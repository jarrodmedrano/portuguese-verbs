# resource "aws_secretsmanager_secret" "lb_tls_cert" {
#   name = "${var.application}-lb-tls-cert-newish2"
#   recovery_window_in_days = 30

#   tags = local.common_tags
# }

# resource "aws_secretsmanager_secret" "lb_tls_key" {
#   name = "${var.application}-lb-tls-key-newish2"
#   recovery_window_in_days = 30

#   tags = local.common_tags
# }

# resource "aws_secretsmanager_secret" "app_secret" {
#   name = "${var.application}-app-secret-newish2"
#   recovery_window_in_days = 30

#   tags = local.common_tags
# }