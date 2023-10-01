resource "aws_ecs_cluster" "ecs_cluster" {
  name = lower("${var.app_name}-cluster")

  service_connect_defaults {
    namespace = aws_service_discovery_http_namespace.main.arn
  }
}

resource "aws_cloudwatch_log_group" "ecs_cw_log_group" {
  for_each = toset(var.app_services)
  name     = lower("${each.key}-logs")
}

resource "aws_service_discovery_public_dns_namespace" "public_portuguese" {
  name = "public-service.local"
  description = "portuguese"
}

resource "aws_service_discovery_private_dns_namespace" "private_portuguese" {
  name = "private-service.local"
  description = "portuguese"
  vpc = var.vpc_id
}

# resource "aws_service_discovery_service" "public_service" {
#   for_each = { for k, v in var.service_config : k => v if v.is_public == true }

#   name = "${each.value.name}-service"

#   dns_config {
#     namespace_id = aws_service_discovery_public_dns_namespace.public_portuguese.id

#     dns_records {
#       ttl  = 10
#       type = "A"
#     }
#   }
# }

# resource "aws_service_discovery_service" "private_service" {
#   for_each = { for k, v in var.service_config : k => v if v.is_public == false }

#   name = "${each.value.name}-service"

#   dns_config {
#     namespace_id = aws_service_discovery_private_dns_namespace.private_portuguese.id

#     dns_records {
#       ttl  = 10
#       type = "A"
#     }
#   }
# }

#Create task definitions for app services
resource "aws_ecs_task_definition" "ecs_task_definition" {
  for_each                 = var.service_config
  family                   = "${lower(var.app_name)}-${each.key}"
  execution_role_arn       = var.ecs_task_execution_role_arn
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  memory                   = each.value.memory
  cpu                      = each.value.cpu

  task_role_arn            = var.ecs_task_execution_role_arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = each.value.name
      image        = "${var.account}.dkr.ecr.${var.region}.amazonaws.com/${lower(var.app_name)}:${lower(each.value.name)}"
      cpu       = each.value.cpu
      memory    = each.value.memory
      essential = true
      enable_execute_command   = true

      environment = [
        {
          name  = "VERBECC_API"
          value = "http://${var.service_config.verbecc.name}:${tostring(var.service_config.verbecc.container_port)}"
        },
        {
          name  = "NODE_ENV"
          value = "development"
        },
        {
          name  = "TRPC_PORT"
          value = tostring(var.service_config.api.container_port)
        },
        {
          name  = "CLIENT_PORT"
          value = tostring(var.service_config.client.container_port)
        },
        {
          name  = "VERBECC_PORT"
          value = tostring(var.service_config.verbecc.container_port)
        }, {
          name  = "NEXT_PUBLIC_TRPC_API"
          value = "http://${var.service_config.api.name}:${tostring(var.service_config.api.container_port)}"
        }, {
          name  = "NEXT_PUBLIC_APP_URL"
          value = "http://${var.dns_name}"
        }
      ]
      portMappings = [
        {
          name = each.value.name
          containerPort = each.value.container_port
          hostPort = each.value.host_port
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]
      initProcessEnabled = true
      privileged             = false
      readonlyRootFilesystem = false

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "${lower(each.value["name"])}-logs"
          awslogs-region        = var.region
          awslogs-stream-prefix = var.app_name
        }
      }
    }
  ])
}

resource "aws_service_discovery_http_namespace" "main" {
  name = var.app_name
}


#Create services for app services
resource "aws_ecs_service" "private_service" {
  for_each = var.service_config

  name            = "${each.value.name}-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_task_definition[each.key].arn
  launch_type     = "FARGATE"
  desired_count   = each.value.desired_count
  platform_version = "LATEST"
  enable_execute_command   = true

  service_connect_configuration {
    enabled   = each.value.name == "api" || each.value.name == "client" ? true : false
    namespace = aws_service_discovery_http_namespace.main.arn


    dynamic "service" {
      for_each = each.value.name == "api" ? [var.service_config.api] : []
      content {
        client_alias {
          dns_name = var.service_config.api.name
          port     = var.service_config.api.container_port
        }

        port_name = var.service_config.api.name
      }
    }

    # service {
    #   client_alias {
    #     dns_name = var.service_config.api.name
    #     port     = var.service_config.api.container_port
    #   }

    #   port_name = var.service_config.api.name
    # }
  }

  
  network_configuration {
    subnets          = each.value.is_public == true ? var.public_subnets : var.private_subnets
    assign_public_ip = each.value.is_public == true ? true : false
    security_groups = [
      each.value.is_public == true ? aws_security_group.webapp_security_group.id : aws_security_group.service_security_group.id
    ]
  }

  deployment_controller {
    type = "ECS"
  }

  load_balancer {
    target_group_arn = each.value.is_public == true ? var.public_alb_target_groups[each.key].arn : var.internal_alb_target_groups[each.key].arn
    container_name   = each.value.name
    container_port   = each.value.container_port
  }
}



resource "aws_appautoscaling_target" "service_autoscaling" {
  for_each           = var.service_config
  max_capacity       = each.value.auto_scaling.max_capacity
  min_capacity       = each.value.auto_scaling.min_capacity
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${aws_ecs_service.private_service[each.key].name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy_memory" {
  for_each           = var.service_config
  name               = "${var.app_name}-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.service_autoscaling[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.service_autoscaling[each.key].scalable_dimension
  service_namespace  = aws_appautoscaling_target.service_autoscaling[each.key].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value = each.value.auto_scaling.memory.target_value
  }
}

resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
  for_each           = var.service_config
  name               = "${var.app_name}-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.service_autoscaling[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.service_autoscaling[each.key].scalable_dimension
  service_namespace  = aws_appautoscaling_target.service_autoscaling[each.key].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = each.value.auto_scaling.cpu.target_value
  }
}

resource "aws_security_group" "service_security_group" {
  vpc_id = var.vpc_id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [var.internal_alb_security_group.security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group" "webapp_security_group" {
  vpc_id = var.vpc_id

  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [var.public_alb_security_group.security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
