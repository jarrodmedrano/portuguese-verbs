output "aws_region" {
  value       = var.aws_region
  description = "AWS region"
}

output "app_url" {
  value       = aws_lb.main.dns_name
  description = "Application URL"
}

output "ecs_cluster" {
  value       = aws_ecs_cluster.main.name
  description = "ECS cluster"
}

output "ecs_app_service" {
  value       = aws_ecs_service.app.name
  description = "ECS app service"
}

output "ecs_app_task" {
  value       = aws_ecs_service.app.task_definition
  description = "ECS app task"
}

output "ecs_app_container" {
  value       = local.app.container.name
  description = "ECS app container"
}

output "ecs_app_image" {
  value       = local.app.container.image
  description = "ECS app image"
}

output "ecs_api_service" {
  value       = aws_ecs_service.api.name
  description = "ECS api service"
}

output "ecs_api_task" {
  value       = aws_ecs_service.api.task_definition
  description = "ECS api task"
}

output "ecs_api_container" {
  value       = local.api.container.name
  description = "ECS api container"
}

output "ecs_api_image" {
  value       = local.api.container.image
  description = "ECS api image"
}

output "ecs_verbecc_service" {
  value       = aws_ecs_service.verbecc.name
  description = "ECS verbecc service"
}

output "ecs_verbecc_task" {
  value       = aws_ecs_service.verbecc.task_definition
  description = "ECS verbecc task"
}

output "ecs_verbecc_container" {
  value       = local.verbecc.container.name
  description = "ECS verbecc container"
}

output "ecs_verbecc_image" {
  value       = local.verbecc.container.image
  description = "ECS verbecc image"
}

output "aws_ecs_service_app" {
  value       = aws_ecs_service.app.service_connect_configuration[0].namespace
  description = "ECS service app"
}

# output "aws_db_instance" {
#   value       = aws_db_instance.conjugamedb.endpoint
#   description = "RDS instance"
# }

output "aws_db_instance_new" {
  value       = aws_db_instance.dbconjugame.endpoint
  description = "RDS instance new"
}

# output "lb_tls_cert_secret" {
#   value = aws_secretsmanager_secret.lb_tls_cert.id
#   description = "TLS cert for load-balancer"
# }

# output "lb_tls_key_secret" {
#   value = aws_secretsmanager_secret.lb_tls_key.id
#   description = "TLS key for load-balancer"
# }

# output "app_secret" {
#   value = aws_secretsmanager_secret.app_secret.id
#   description = "Dummy secret for application"
# }