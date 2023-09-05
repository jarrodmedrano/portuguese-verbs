

variable "app_name" {
  type        = string
  description = "The name of the project"
}

variable "environment" {
  type        = string
  description = "Infrastructure environment"
}

variable "vpc_id" {
  type        = string
  description = "VPC ID"
}

variable "vpc_public_subnet_ids" {
  type        = list(string)
  description = "Public Subnet IDs"
}

variable "vpc_private_subnet_ids" {
  type        = list(string)
  description = "Private Subnet IDs"
}

variable "app_security_group_id" {
  type        = string
  description = "Application Security Group ID"
}

variable "beanstalk_environment" {
  type        = string
  description = "Beanstalk environment name"
}
