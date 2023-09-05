resource "aws_security_group" "docker_multi_container_app" {
  name        = "${var.app_name}-${var.environment}"
  description = "Security group for the application"
  vpc_id      = aws_vpc.vpc.id

  tags = {
    Name      = "${var.app_name}-${var.environment}"
    ManagedBy = "terraform"
  }
}
