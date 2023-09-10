

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

variable "client_port" {
  type        = number
  description = "Client port"
}

variable "client_host" {
  type        = number
  description = "Client host"
}

variable "api_port" {
  type        = number
  description = "Api port"
}

variable "api_host" {
  type        = number
  description = "Api host"
}

variable "nginx_port" {
  type        = number
  description = "Nginx port"
}

variable "nginx_host" {
  type        = number
  description = "Nginx host"
}