# resource "aws_secretsmanager_secret" "lb_tls_cert" {
#   name = "${var.application}-lb-tls-cert-newish3"
#   recovery_window_in_days = 30

#   tags = local.common_tags
# }

# resource "aws_secretsmanager_secret" "lb_tls_key" {
#   name = "${var.application}-lb-tls-key-newish3"
#   recovery_window_in_days = 30

#   tags = local.common_tags
# }

# resource "aws_secretsmanager_secret" "app_secret" {
#   name = "${var.application}-app-secret-newish3"
#   recovery_window_in_days = 30

#   tags = local.common_tags
# }

# data "aws_secretsmanager_secret" "lb_tls_cert" {
#   depends_on = [ aws_secretsmanager_secret.lb_tls_cert ]
#   name = aws_secretsmanager_secret.app_secret.name # As stored in the AWS Secrets Manager
# }

# data "aws_secretsmanager_secret_version" "lb_tls_cert_latest_ver" {
#   depends_on = [ aws_secretsmanager_secret.lb_tls_cert ]
#   secret_id = data.aws_secretsmanager_secret.lb_tls_cert.id
# }

# data "aws_secretsmanager_secret" "lb_tls_key" {
#   depends_on = [ aws_secretsmanager_secret.lb_tls_key ]
#   name = aws_secretsmanager_secret.lb_tls_key.name
# }

# data "aws_secretsmanager_secret_version" "lb_tls_key_latest_ver" {
#   depends_on = [ aws_secretsmanager_secret.lb_tls_key ]
#   secret_id = data.aws_secretsmanager_secret.lb_tls_key.id
# }

# data "aws_secretsmanager_secret" "app_secret" {
#   name = aws_secretsmanager_secret.app_secret.name
# }

# data "aws_secretsmanager_secret_version" "app_secret_latest_ver" {
#   depends_on = [ aws_secretsmanager_secret.app_secret ]
#   secret_id = data.aws_secretsmanager_secret.app_secret.id
# }