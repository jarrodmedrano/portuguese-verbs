########################################################################################################################
# Application

variable "app_name" {
  type        = string
  description = "Application name"
}

variable "app_services" {
  type        = list(string)
  description = "service name list"
}

variable "env" {
  type        = string
  description = "Environment"
}
