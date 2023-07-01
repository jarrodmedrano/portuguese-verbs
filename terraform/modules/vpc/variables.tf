variable "vpc_cidr_block" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
  }

  variable "web_subnet" {
    description = "Web Subnet"
    type        = string
    default     = "10.0.0.0/16"
  }

  variable "subnet_zone" {
    default = "us-east-2a"
  }

  variable "key_name" {
    description = "The name of the key"
    type        = string
}

variable "main_vpc_name" {
    description = "Main VPC Name"
    type        = string
    default = "New VPC"
}

variable "azs" {
  description = "AZs in the region"
  type        = list(string)
  default     = ["us-east-2a", "us-east-2b", "us-east-2c"]
}

variable "aws_ami" {
    description = "AMI to use for the instance"
    type        = string
}

variable "security_group_id" {
    description = "Security Group"
    type        = string
}

variable "my_instance" {
    description = "Instance Type"
    type        = list(string)
    default     = ["t2.micro", "1", "true"]
}