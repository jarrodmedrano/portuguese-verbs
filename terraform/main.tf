terraform {
  required_version = ">= 0.12.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

module "my_instance" {
  source        = "./modules/ec2"
  ami_id        = lookup(var.amis, var.aws_region)
  instance_type = var.my_instance[0]
  servers       = 1
  key_name      = aws_key_pair.terraform_ssh_key.key_name
}

module "vpc" {
  source         = "./modules/vpc"
  key_name       = aws_key_pair.terraform_ssh_key.key_name
  aws_ami        = data.aws_ami.latest_amazon_linux2.id
  security_group = aws_default_security_group.default_sec_group.id
}

# data "aws_secretsmanager_secret_version" "creds" {
#   secret_id = "tf_access"
# }

# locals {
#   access_key = jsondecode(data.aws_secretsmanager_secret_version.creds.secret_string)
# }

provider "aws" {
  region     = "us-east-2"
  access_key = var.TF_VAR_AWS_ACCESS_KEY_ID
  secret_key = var.TF_VAR_AWS_SECRET_ACCESS_KEY
}



resource "aws_default_security_group" "default_sec_group" {
  vpc_id = module.vpc.main_vpc_id

  # dynamic "ingress" {
  #   for_each = var.ingress_ports
  #   content {
  #     from_port   = ingress.value
  #     to_port     = ingress.value
  #     protocol    = "tcp"
  #     cidr_blocks = ["0.0.0.0/0"]
  #   }
  # }

  dynamic "ingress" {
    for_each = var.ingress_ports
    iterator = iport
    content {
      from_port   = iport.value
      to_port     = iport.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    // allow all outbound traffic
    from_port = var.egress_dsg["from_port"]
    to_port   = var.egress_dsg["to_port"]
    protocol  = var.egress_dsg["protocol"]
    // any protocol
    cidr_blocks = var.egress_dsg["cidr_blocks"]
  }

  tags = {
    "Name" = "my-default-sg"
  }
}

// create ssh keypair for ec2 instance
resource "aws_key_pair" "terraform_ssh_key" {
  key_name   = "terraform_key_rsa"
  public_key = file("~/.ssh/aws/terraform_key_rsa.pub")
}



## Using count to create users

# resource "aws_iam_user" "test" {
#   name = "x-user"
#   path = "/system/"
# }

# variable "users" {
#   type    = list(string)
#   default = ["demo-user", "admin1", "john"]
# }

# resource "aws_iam_user" "test" {
#   count = length(var.users)
#   name  = element(var.users, count.index)
#   path  = "/system/"
# }

# resource "aws_iam_user" "test" {
#   name = "x-user${count.index}}"
#   path = "/system/"
#   count = 3
# }

## Using foreach to create users

# variable "users" {
#   type    = list(string)
#   default = ["demo-user", "admin1", "john"]
# }

# resource "aws_iam_user" "test" {
#   for_each = toset(var.users)
#   name     = each.key
# }

## Ternary expression

# resource "aws_instance" "test-server" {
#   ami           = "ami-0d8f6eb4f641ef691"
#   instance_type = "t2.micro"
#   count         = var.istest ? 1 : 0
# }

# resource "aws_instance" "prod-server" {
#   ami           = "ami-0d8f6eb4f641ef691"
#   instance_type = "t2.large"
#   count         = !var.istest ? 1 : 0
# }
