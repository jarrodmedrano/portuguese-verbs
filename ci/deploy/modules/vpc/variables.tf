
variable "app_name" {
  type        = string
  description = "The name of the app_name"
}

variable "environment" {
  type        = string
  description = "Infrastructure environment"
}

variable "public_subnet_numbers" {
  type        = map(number)
  description = "Map of AZ to a number that should be used for public subnets"
}

variable "private_subnet_numbers" {
  type        = map(number)
  description = "Map of AZ to a number that should be used for private subnets"
}

variable "vpc_cidr" {
  type        = string
  description = "The IP range to use for the VPC"
  # Note we are /17, not /16 So we're only using half of the available which can help with VPC peering in the future
  default = "10.0.0.0/17"
}
