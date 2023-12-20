resource "aws_ecs_service" "nginx" {
  name                               = "nginx"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.nginx.id
  desired_count                      = 1
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 60
  launch_type                        = "FARGATE"
  scheduling_strategy                = "REPLICA"
  platform_version                   = "LATEST"
  enable_execute_command   = true

  service_connect_configuration {
    enabled   = true
    namespace = aws_service_discovery_http_namespace.main.arn

    log_configuration {
      log_driver = "awslogs"
      options = {
        awslogs-group         = "/ecs-fargate/${var.application}/service/service-connect-proxy"
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "nginx"
      }
    }
  }

  network_configuration {
    subnets          = aws_subnet.private.*.id
    assign_public_ip = false
    security_groups  = [aws_security_group.nginx_service.id, aws_security_group.app_service.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = local.nginx.container.name
    container_port   = local.nginx.container.port
  }

  deployment_controller {
    type = "ECS"
  }

  # https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy#preserve-desired-count-when-updating-an-autoscaled-ecs-service
  lifecycle {
    ignore_changes = []
  }

  tags = local.common_tags
}

resource "aws_security_group" "nginx_service" {
  name   = "nginx-ecs-service"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    # Only allow traffic in from the load balancer security group
    security_groups = [aws_security_group.lb.id]
  }

  egress {
    protocol         = "-1"
    from_port        = 0
    to_port          = 0
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(local.common_tags, {
    Name = "nginx-ecs-service"
  })
}

resource "aws_ecs_task_definition" "nginx" {
  family                   = "${var.application}-nginx"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  # https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDefinition.html
  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-secrets.html#secrets-application-retrieval
  container_definitions = jsonencode([
    {
      name      = local.nginx.container.name
      image     = "${var.account}.dkr.ecr.${var.aws_region}.amazonaws.com/${lower(var.application)}:client"
      essential = true
      enable_execute_command   = false
      secrets = [
        # {
        #   name      = "SECRET"
        #   valueFrom = "${data.aws_secretsmanager_secret.app_secret.id}:::"
        # },
      ]
      environment = [
        {
          name  = "NAME"
          value = local.nginx.container.name
        },
        {
          name  = "ENV"
          value = var.environment
        },
        {
          name  = "PORT"
          value = tostring(local.nginx.container.port)
        },
        {
          name  = "APP_URL"
          value = "http://${aws_lb.main.dns_name}"
        },
        {
          name  = "NEXT_PUBLIC_TRPC_API"
          value = "http://api:${tostring(local.api.container.port)}"
        },
         {
          name  = "VERBECC_URL"
          value = "http://verbecc:${tostring(local.verbecc.container.port)}"
        },
         {
          name  = "VERBECC_API"
          value = "http://verbecc:${tostring(local.verbecc.container.port)}"
        },
       {
          name  = "TRPC_PORT"
          value = "${tostring(local.api.container.port)}"
        },
        {
          name  = "CLIENT_PORT"
          value = "${tostring(local.nginx.container.port)}"
        },
        {
          name  = "VERBECC_PORT"
          value = "${tostring(local.verbecc.container.port)}"
        },
        {
          name = "AUTH0_BASE_URL"
          value = "${tostring(local.auth0.base_url)}"
        },
        {
          name = "AUTH0_CLIENT_ID"
          value =  "${tostring(local.auth0.client_id)}"
        },
        {
          name = "AUTH0_CLIENT_SECRET"
          value =  "${tostring(local.auth0.client_secret)}"
        },
        {
          name = "AUTH0_ISSUER_BASE_URL"
          value =  "${tostring(local.auth0.issuer_base_url)}"
        },
        {
          name = "AUTH0_SECRET"
          value =  "${tostring(local.auth0.secret)}"
        },
        {
          name = "OPENAI_API_KEY",
          value =  "${tostring(local.open_ai.api_key)}"
        },
        {
          name = "DB_URL",
          value =  "${tostring(local.database.url)}"
        }
      ]
      portMappings = [
        {
          name          = local.nginx.container.name
          containerPort = local.nginx.container.port
          protocol      = "tcp"
          appProtocol   = "http"
        }
      ]
      # healthCheck = {
      #   command  = ["CMD-SHELL", "curl -f http://localhost:${local.app.container.port}/health || exit 1"]
      #   interval = 30
      #   retries  = 3
      #   timeout  = 5
      # }
      initProcessEnabled = true
      privileged             = false
      readonlyRootFilesystem = false
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs-fargate/${var.application}/service/nginx"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "nginx"
        }
      }
      cpu    = 512
      memory = 1024
    }
  ])

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "nginx" {
  name              = "/ecs-fargate/${var.application}/service/nginx"
  retention_in_days = var.logs_retention_in_days

  tags = local.common_tags
}

resource "aws_appautoscaling_target" "nginx" {
  max_capacity       = 10
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.nginx.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-autoscaling-targettracking.html
resource "aws_appautoscaling_policy" "nginx_ecs_autoscaling_policy_cpu" {
  name               = "${var.application}-nginx-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.nginx.resource_id
  scalable_dimension = aws_appautoscaling_target.nginx.scalable_dimension
  service_namespace  = aws_appautoscaling_target.nginx.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value       = 60
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }

  depends_on = [aws_appautoscaling_target.nginx]
}

resource "aws_appautoscaling_policy" "nginx_esc_autoscaling_policy_memory" {
  name               = "${var.application}-nginx-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.nginx.resource_id
  scalable_dimension = aws_appautoscaling_target.nginx.scalable_dimension
  service_namespace  = aws_appautoscaling_target.nginx.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value       = 80
    scale_in_cooldown  = 300
    scale_out_cooldown = 300
  }

  depends_on = [aws_appautoscaling_target.nginx]
}