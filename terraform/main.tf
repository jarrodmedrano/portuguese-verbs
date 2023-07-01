terraform {
  required_version = ">= 0.12.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

module "vpc" {
  source         = "./modules/vpc"
  key_name       = aws_key_pair.terraform_ssh_key.key_name
  aws_ami        = data.aws_ami.latest_amazon_linux2.id
  security_group_id = module.server.security_group_id
}

module "ecr" {
  source         = "./modules/ecr"
}

module "ecs" {
  source         = "./modules/ecs"
}

module "server" {
  source         = "./modules/server"
  key_name       = aws_key_pair.terraform_ssh_key.key_name
  aws_ami        = data.aws_ami.latest_amazon_linux2.id
    main_vpc_id = module.vpc.main_vpc_id

}

provider "aws" {
  region     = "us-east-2"
  access_key = var.TF_VAR_AWS_ACCESS_KEY_ID
  secret_key = var.TF_VAR_AWS_SECRET_ACCESS_KEY
}

// create ssh keypair for ec2 instance
resource "aws_key_pair" "terraform_ssh_key" {
  key_name   = "terraform_key_rsa"
  public_key = file("~/.ssh/aws/terraform_key_rsa.pub")
}