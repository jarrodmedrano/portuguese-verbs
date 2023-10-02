terraform {
  required_version = ">= 0.13"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0.0, < 5.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.4.3"
    }
  }

  backend "s3" {
    region = "us-east-2"
    bucket = "portuguese-verbs-tfstate"
    key    = "tfstate"
  }
}

provider "aws" {
  region  = var.aws_region
  # profile = var.aws_profile
}

provider "random" {}