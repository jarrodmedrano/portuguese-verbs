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

