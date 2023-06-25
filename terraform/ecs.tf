# resource "aws_ecs_cluster" "main" {
#   name = "terraform-cluster"
# }


# data "template_file" "app_container_definitions" {
#   template = file("./app.json.tpl")

#   vars = {
#     app_image        = var.ecr_image_app
#     secret           = var.secret
#     log_group_name   = aws_cloudwatch_log_group.ecs_task_logs.name
#     log_group_region = data.aws_region.current.name
#     dd_api_key       = var.dd_api_key
#   }
# }

# resource "aws_ecs_task_definition" "ihq" {
#   family                   = "${local.prefix}-ihq"
#   container_definitions    = data.template_file.app_container_definitions.rendered
#   requires_compatibilities = ["FARGATE"]
#   network_mode             = "awsvpc"
#   # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html
#   cpu    = 256
#   memory = 1024
# }

# resource "aws_ecs_service" "ihq" {
#   name            = "${local.prefix}-app"
#   cluster         = aws_ecs_cluster.main.name
#   task_definition = aws_ecs_task_definition.ihq.family
#   desired_count   = 1
#   launch_type     = "FARGATE"
# }
