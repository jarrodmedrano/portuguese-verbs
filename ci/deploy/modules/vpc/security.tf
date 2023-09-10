resource "aws_security_group" "docker_multi_container_app" {
  name        = "${var.app_name}-${var.environment}"
  description = "Security group for the application"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name      = "${var.app_name}-${var.environment}"
    ManagedBy = "terraform"
  }
}

resource "aws_security_group_rule" "app-sg_in_verbecc" {
  type                     = "ingress"
  from_port                = var.verbecc_port
  to_port                  = var.verbecc_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.docker_multi_container_app.id
  security_group_id        = aws_security_group.docker_multi_container_app.id
}

resource "aws_security_group_rule" "app-sg_in_nginx" {
  type                     = "ingress"
  from_port                = var.nginx_port
  to_port                  = var.nginx_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.docker_multi_container_app.id
  security_group_id        = aws_security_group.docker_multi_container_app.id
}

resource "aws_security_group_rule" "app-sg_in_api" {
  type                     = "ingress"
  from_port                = var.api_port
  to_port                  = var.api_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.docker_multi_container_app.id
  security_group_id        = aws_security_group.docker_multi_container_app.id
}

resource "aws_security_group_rule" "app-sg_in_client" {
  type                     = "ingress"
  from_port                = var.client_port
  to_port                  = var.client_port
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.docker_multi_container_app.id
  security_group_id        = aws_security_group.docker_multi_container_app.id
}