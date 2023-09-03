# Provider 
provider "aws" {
  region = var.region
}

# ECR repository
resource "aws_ecr_repository" "repo" {
  name = var.app_name 
}

# ECS cluster
resource "aws_ecs_cluster" "cluster" {
  name = lower("${var.app_name}-cluster")  
}

# ECS service 
resource "aws_ecs_service" "service" {
  name            = "service"
  cluster         = aws_ecs_cluster.cluster.arn
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1


  # Add this block for network configuration
  network_configuration {
    subnets = [aws_subnet.public[0].id, aws_subnet.public[1].id]
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.tg.arn
    container_name   = "nginx"
    container_port   = var.listener_port 
  }

  depends_on = [aws_lb_target_group.tg]
}

# ALB target group
resource "aws_lb_target_group" "tg" {
  port        = var.listener_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id
}

# ALB
resource "aws_lb" "lb" {
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public[0].id, aws_subnet.public[1].id]
}

resource "aws_lb_listener" "lb_listener" {
  load_balancer_arn = aws_lb.lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg.arn
  }
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Internet gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

# Public subnets
resource "aws_subnet" "public" {
  count             = length(data.aws_availability_zones.azs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = element(data.aws_availability_zones.azs.names, count.index)
}

# Routing table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Route table associations
resource "aws_route_table_association" "public" {
  count          = length(data.aws_availability_zones.azs)
  subnet_id      = aws_subnet.public.*.id[count.index]
  route_table_id = aws_route_table.public.id
}

# ECS task execution IAM role
resource "aws_iam_role" "ecs_task_execution" {
  name = "myapp-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

# ECS task execution role policies 
resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS task definition
resource "aws_ecs_task_definition" "task" {
  family                   = "${var.app_name}-task" 
   container_definitions = jsonencode([
    {
      name  = "verbecc"
      image = "${var.account}.dkr.ecr.${var.region}.amazonaws.com/${lower(var.app_name)}:verbecc"
      portMappings = [{
        containerPort = 8000
        hostPort      = 8000
      }]
    },
    {
      name  = "api"
      image = "${var.account}.dkr.ecr.${var.region}.amazonaws.com/${lower(var.app_name)}:api"
      portMappings = [{
        containerPort = 4000
        hostPort      = 4000
      }]
    },
    {
      name  = "client"
      image = "${var.account}.dkr.ecr.${var.region}.amazonaws.com/${lower(var.app_name)}:client"
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
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
}
