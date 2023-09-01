# Configure AWS provider
provider "aws" {
  region = var.region
}

# Create ECR repository for images
resource "aws_ecr_repository" "repo" {
  name = var.app_name
}

# Create ECS cluster
resource "aws_ecs_cluster" "cluster" {
  name = "${var.app_name}-cluster"
}

# Create ECS task definition
resource "aws_ecs_task_definition" "task" {
  family = "${var.app_name}-task"

  container_definitions = jsonencode([
    {
      name  = "verbecc"
      image = "${aws_ecr_repository.repo.repository_url}:verbecc"
      portMappings = [{
        containerPort = 8000
        hostPort      = 8000
      }]
    },
    {
      name  = "api"
      image = "${aws_ecr_repository.repo.repository_url}:api"
      portMappings = [{
        containerPort = 4000
        hostPort      = 4000
      }]
    },
    {
      name  = "client"
      image = "${aws_ecr_repository.repo.repository_url}:client"
      portMappings = [{
        containerPort = 3000
        hostPort      = 3000
      }]
    },
    {
      name  = "nginx"
      image = "nginx:stable"
      portMappings = [{
        containerPort = 80
        hostPort      = 80
      }]
    }
  ])

  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = 2048
  cpu                      = 1024
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}

# Create ECS service
resource "aws_ecs_service" "service" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.tg.arn
    container_name   = "nginx"
    container_port   = 80
  }

  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    assign_public_ip = true
  }
}

# Create ALB target group
resource "aws_lb_target_group" "tg" {
  name        = "${var.app_name}-tg"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id
}

# Create ALB
resource "aws_lb" "lb" {
  name               = "${var.app_name}-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}

# Create VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Create public subnets
resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.region}a"
}

resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.region}b"
}

# Create ECS service IAM role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app_name}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

# Attach required policies to ECS role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
