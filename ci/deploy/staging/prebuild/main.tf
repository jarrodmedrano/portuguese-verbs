provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.environment}-${var.app_name}-test2"

  tags = {
    Environment = "${var.environment}"
  }
}
