resource "aws_ecs_cluster" "my_cluster" {
  name = "portuguese-verbs-cluster"
}

resource "aws_ecs_service" "service" {
  name = var.service_name
  cluster = aws_ecs_cluster.my_cluster.name
  launch_type = "EC2"
  task_definition = "??"
}

resource "aws_ecs_task_definition" "task" {
  family = var.task_family
  network_mode = "bridge"
  requires_compatibilities = ["EC2"]
  execution_role_arn = aws_iam_role.task_role.arn
}

resource "aws_iam_role" "task_role" {
  name = "ecs-task-${var.task_family}-${terraform.workspace}"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_policy

  inline_policy {
    name = "ecs-task-permissions"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = ["ecr:*"]
          Effects = "Allow"
          Resources = "*"
        }
      ]
    })
  }
}