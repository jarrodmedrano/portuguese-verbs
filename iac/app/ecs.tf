resource "aws_ecs_cluster" "main" {
  name = var.application

  service_connect_defaults {
    namespace = aws_service_discovery_http_namespace.main.arn
  }

  tags = local.common_tags
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 100
  }
}

resource "aws_service_discovery_http_namespace" "main" {
  name = var.application

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "service_connect_proxy" {
  name              = "/ecs-fargate/${var.application}/service/service-connect-proxy"
  retention_in_days = var.logs_retention_in_days

  tags = local.common_tags
}