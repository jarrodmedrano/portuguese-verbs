variable "TF_VAR_AWS_ACCESS_KEY_ID" {
  description = "AWS Access Key ID"
  type        = string
  nullable    = false
  sensitive   = true
}

variable "TF_VAR_AWS_SECRET_ACCESS_KEY" {
  description = "AWS Secret Access Key"
  type        = string
  nullable    = false
  sensitive   = true
}
########################################################################################################################
# Application
variable "account" {
  type        = number
  description = "AWS account number"
}

variable "region" {
  type        = string
  description = "region"
}

variable "app_name" {
  type        = string
  description = "Application name"
}

variable "env" {
  type        = string
  description = "Environment"
}