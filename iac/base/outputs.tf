output "aws_region" {
  value       = var.aws_region
  description = "AWS region"
}

output "s3_bucket" {
  value = aws_s3_bucket.tfstate.bucket
  description = "S3 bucket for Terraform state"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.repository.repository_url
  description = "ECR repository URL"
}

output "ecr_repository_name" {
  value = aws_ecr_repository.repository.name
  description = "ECR repository name"
}

# output "publisher_user" {
#   value = aws_iam_user.publisher.id
#   description = "AWS user to publish tasks"
# }

# output "publisher_access_key" {
#   value = aws_iam_access_key.access_key.id
#   description = "AWS_ACCESS_KEY to publish tasks"
# }

# output "publisher_secret_key" {
#   value = nonsensitive(aws_iam_access_key.access_key.secret)
#   description = "AWS_SECRET_ACCESS_KEY to publish tasks"
# }

# output "lb_tls_cert_secret" {
#   value = aws_secretsmanager_secret.lb_tls_cert.id
#   description = "TLS cert for load-balancer"
# }

# output "lb_tls_key_secret" {
#   value = aws_secretsmanager_secret.lb_tls_key.id
#   description = "TLS key for load-balancer"
# }

# output "app_secret" {
#   value = aws_secretsmanager_secret.app_secret.id
#   description = "Dummy secret for application"
# }