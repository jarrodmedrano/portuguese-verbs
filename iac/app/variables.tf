variable "application" {
  type = string
}

variable "account" {
  type = string
}

variable "environment" {
  type    = string
  default = "dev"

  validation {
    condition     = contains(["dev", "uat", "prod"], var.environment)
    error_message = "Invalid environment"
  }
}

variable "vpc" {
  type = string
}

variable "public_subnets" {
  type = list(string)
}

variable "private_subnets" {
  type = list(string)
}

variable "availability_zones" {
  type = list(string)
}

variable "ecr_repository" {
  type = string
}

variable "app_image_tag" {
  type    = string
  default = "latest"
}

variable "api_image_tag" {
  type    = string
  default = "latest"
}

variable "verbecc_image_tag" {
  type    = string
  default = "latest"
}

variable "logs_retention_in_days" {
  type    = number
  default = 90
}

variable "aws_region" {
  type    = string
  default = "us-east-2"
}

variable "aws_profile" {
  type    = string
  default = null
}

variable "domain_name" {
  type = string
}

variable "ttl" {
  type    = number
  default = 60
}