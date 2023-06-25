variable "ami_id" {
    description = "The id of the ami"
    type        = string
    default     = "ami-0d8f6eb4f641ef691"
}

variable "instance_type" {
    description = "The type of instance"
    type        = string
    default     = "t2.micro"
}

variable "servers" {
    description = "The number of servers to create"
    type        = number
    default     = 1
}

variable "key_name" {
    description = "The name of the key"
    type        = string
}