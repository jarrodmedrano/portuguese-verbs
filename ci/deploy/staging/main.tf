terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.72"
    }
  }

  backend "s3" {
    region = "us-east-2"
    bucket = "staging-portuguese-verbs-test"
    key    = "iac/prebuild/terraform.tfstate"
  }
}

provider "aws" {
  region = "us-east-2"
}

# module "ecr" {
#   source       = "../modules/ecr"
#   app_services = var.app_services
#   env          = var.environment
#   app_name     = var.app_name
# }



module "vpc" {
  source                 = "../modules/vpc"
  app_name               = var.app_name
  environment            = var.environment
  public_subnet_numbers  = var.public_subnet_numbers
  private_subnet_numbers = var.private_subnet_numbers
  api_port = var.trpc_port
  client_port = var.client_port
  nginx_port = var.nginx_port
  verbecc_port = var.verbecc_port
}

module "compute" {
  source                 = "../modules/compute"
  app_name               = var.app_name
  environment            = var.environment
  vpc_id                 = module.vpc.vpc_id
  vpc_public_subnet_ids  = module.vpc.vpc_public_subnet_ids
  vpc_private_subnet_ids = module.vpc.vpc_private_subnet_ids
  app_security_group_id  = module.vpc.app_security_group_id
  beanstalk_environment  = var.beanstalk_environment
  client_host            = var.client_port
  api_host              = var.api_port
  nginx_host            = var.nginx_port
  api_port              = var.api_port
  client_port           = var.client_port
  nginx_port            = var.nginx_port
}
