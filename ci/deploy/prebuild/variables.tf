variable "app_name" {
  type        = string
  description = "app_name's name"
  default = "portuguese-verbs"
}

variable "environment" {
  type        = string
  description = "Infrastructure environment"
  default     = "staging"
}

variable "app_services" {
  type        = list(string)
  description = "service name list"
  default     = ["client", "api", "nginx", "verbecc"]
}