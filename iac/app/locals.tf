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
  auth0 = {
    client_id = var.auth0_client_id
    client_secret = var.auth0_client_secret
    issuer_base_url = var.auth0_issuer_base_url
    base_url = var.auth0_base_url
    secret = var.auth0_secret
  }
  common_tags = {
    application = var.application
    environment = var.environment
  }
  open_ai = {
    api_key = var.open_ai_api_key
  }
}
