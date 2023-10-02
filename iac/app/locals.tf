locals {
  app = {
    container = {
      name  = "app"
      image = "${var.ecr_repository}:${var.app_image_tag}"
      port  = 8080
    }
  }
  api = {
    container = {
      name  = "api"
      image = "${var.ecr_repository}:${var.api_image_tag}"
      port  = 8080
    }
  }
  verbecc = {
    container = {
      name  = "verbecc"
      image = "${var.ecr_repository}:${var.verbecc_image_tag}"
      port  = 8000
    }
  }
  common_tags = {
    application = var.application
    environment = var.environment
  }
}
