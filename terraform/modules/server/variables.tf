variable "key_name" {
    description = "The name of the key"
    type        = string
}

variable "aws_ami" {
    description = "The id of the ami"
    type        = string
}

variable "main_vpc_id" {
    description = "Main VPC ID"
    type        = string
}


variable "vpc_cidr_block" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "web_subnet" {
  description = "Web Subnet"
  type        = string
  default     = "10.0.0.0/24"
}

variable "subnet_zone" {
  description = "Subnet Zone"
  type        = string
  default     = "us-east-2a"
}

variable "my_public_ip" {
  description = "My Public IP"
  type        = string
  default     = "162.229.210.89"
}

variable "ssh_public_key" {
  description = "SSH Public Key"
  type        = string
  default     = "ssh-rsa AAAAB3Nz"
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-2"
}

variable "azs" {
  description = "AZs in the region"
  type        = list(string)
  default     = ["us-east-2a", "us-east-2b", "us-east-2c"]
}

variable "amis" {
  type = map(string)
  default = {
    "us-east-2" = "ami-06633e38eb0915f51"
  }
}

variable "my_instance" {
  description = "My Instance"
  type        = tuple([string, number, bool])
  default     = ["t2.micro", 1, true]
}

variable "egress_dsg" {
  type = object({
    // allow all outbound traffic
    from_port = number
    to_port   = number
    protocol  = string
    // any protocol
    cidr_blocks = list(string)
  })
  default = {
    // allow all outbound traffic
    from_port = 0,
    //max avail port
    to_port  = 0,
    protocol = "-1",
    // any protocol
    cidr_blocks = ["0.0.0.0/0"]
  }
}

variable "ingress_ports" {
  description = "values for ingress ports"
  type        = list(number)
  default = [
    22,
    80,
    110,
    143,
    443,
    993,
    8080,
  443]
}

variable "istest" {
  description = "is this a test?"
  type        = bool
  default     = true
}

