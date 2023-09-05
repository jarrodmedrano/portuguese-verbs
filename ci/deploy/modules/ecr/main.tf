
resource "aws_ecr_repository" "modules" {
  name = var.app_name

  image_scanning_configuration {
    scan_on_push = false
  }

  tags = {
    Name = "${var.app_name}"
  }
}

resource "aws_ecr_lifecycle_policy" "modules" {
  repository = aws_ecr_repository.modules.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "keep last 3 images"
      action = {
        type = "expire"
      }
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 3
      }
    }]
  })
}
