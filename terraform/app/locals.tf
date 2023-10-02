locals {
  microservice_config = {
  verbecc = {
    name           = var.microservice_config.verbecc.name
    is_public      = var.microservice_config.verbecc.is_public
    container_port = var.microservice_config.verbecc.container_port
    host_port      = var.microservice_config.verbecc.host_port
    cpu            = var.microservice_config.verbecc.cpu
    memory         = var.microservice_config.verbecc.memory
    desired_count  = var.microservice_config.verbecc.desired_count
    alb_target_group = {
      port              = var.microservice_config.verbecc.alb_target_group.port
      protocol          = var.microservice_config.verbecc.alb_target_group.protocol
      path_pattern      = var.microservice_config.verbecc.alb_target_group.path_pattern
      health_check_path = var.microservice_config.verbecc.alb_target_group.health_check_path
      priority          = var.microservice_config.verbecc.alb_target_group.priority
    }
    auto_scaling = {
      max_capacity = var.microservice_config.verbecc.auto_scaling.max_capacity
      min_capacity = var.microservice_config.verbecc.auto_scaling.min_capacity
      cpu = {
        target_value = var.microservice_config.verbecc.auto_scaling.cpu.target_value
      }
      memory = {
        target_value = var.microservice_config.verbecc.auto_scaling.memory.target_value
      }
    }
  },
  api = {
    name           = var.microservice_config.api.name
    is_public      = var.microservice_config.api.is_public
    container_port = var.microservice_config.api.container_port
    host_port      = var.microservice_config.api.host_port
    cpu            = var.microservice_config.api.cpu
    memory         = var.microservice_config.api.memory
    desired_count  = var.microservice_config.api.desired_count
    alb_target_group = {
      port              = var.microservice_config.api.alb_target_group.port
      protocol          = var.microservice_config.api.alb_target_group.protocol
      path_pattern      = var.microservice_config.api.alb_target_group.path_pattern
      health_check_path = var.microservice_config.api.alb_target_group.health_check_path
      priority          = var.microservice_config.api.alb_target_group.priority
    }
    auto_scaling = {
      max_capacity = var.microservice_config.api.auto_scaling.max_capacity
      min_capacity = var.microservice_config.api.auto_scaling.min_capacity
      cpu = {
        target_value = var.microservice_config.api.auto_scaling.cpu.target_value
      }
      memory = {
        target_value = var.microservice_config.api.auto_scaling.memory.target_value
      }
    }
  },
  client = {
    name           = var.microservice_config.client.name
    is_public      = var.microservice_config.client.is_public
    container_port = var.microservice_config.client.container_port
    host_port      = var.microservice_config.client.host_port
    cpu            = var.microservice_config.client.cpu
    memory         = var.microservice_config.client.memory
    desired_count  = var.microservice_config.client.desired_count
    alb_target_group = {
      port              = var.microservice_config.client.alb_target_group.port
      protocol          = var.microservice_config.client.alb_target_group.protocol
      path_pattern      = var.microservice_config.client.alb_target_group.path_pattern
      health_check_path = var.microservice_config.client.alb_target_group.health_check_path
      priority          = var.microservice_config.client.alb_target_group.priority
    }
    auto_scaling = {
      max_capacity = var.microservice_config.client.auto_scaling.max_capacity
      min_capacity = var.microservice_config.client.auto_scaling.min_capacity
      cpu = {
        target_value = var.microservice_config.client.auto_scaling.cpu.target_value
      }
      memory = {
        target_value = var.microservice_config.client.auto_scaling.memory.target_value
      }
    }
  }
}

}