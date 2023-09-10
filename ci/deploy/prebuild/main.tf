provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.environment}-${var.app_name}-test"
  acl    = "private"

  versioning {
    enabled = true
  }

  tags = {
    Environment = "${var.environment}"
  }
}

module "ecr" {
  source       = "../modules/ecr"
  app_services = var.app_services
  env          = var.environment
  app_name     = var.app_name
}
