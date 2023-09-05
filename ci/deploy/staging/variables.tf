variable "iac_tool" {
  type        = string
  description = "Name of the IAC tool used to provision the infra"
  default     = "terraform"
}

variable "app_name" {
  type        = string
  description = "app_name's name"
  default     = "portuguese-verbs"
}

variable "environment" {
  type        = string
  description = "Infrastructure environment"
  default     = "staging"
}

variable "public_subnet_numbers" {
  type = map(number)

  description = "Map of AZ to a number that should be used for public subnets"

  default = {
    "us-east-2a" = 1
    "us-east-2b" = 2
  }
}

variable "private_subnet_numbers" {
  type = map(number)

  description = "Map of AZ to a number that should be used for private subnets"

  default = {
    "us-east-2a" = 3
    "us-east-2b" = 4
  }
}

variable "beanstalk_environment" {
  type        = string
  description = "Beanstalk environment name"
  default     = "staging-portuguese-verbs"
}

variable "app_services" {
  type        = list(string)
  description = "service name list"
  default     = ["client", "api", "nginx", "verbecc"]
}
