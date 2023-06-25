# terraform {
#   backend "s3" {
#     bucket         = "work-tf-remote-state"
#     key            = "s3_backend.tfstate"
#     region         = "us-east-2"
#     dynamodb_table = "s3-state-lock"
#     # variables not allowed here. use backend.conf
#     # access_key = var.TF_VAR_AWS_ACCESS_KEY_ID
#     # secret_key = var.TF_VAR_AWS_SECRET_ACCESS_KEY
#   }
# }