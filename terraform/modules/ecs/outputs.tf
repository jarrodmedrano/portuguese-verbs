output "aws_ecs_task_definition" {
  value = [for taskdef in aws_ecs_task_definition.ecs_task_definition : taskdef]
}
