# data "aws_iam_policy" "permissions_boundary" {
#   name = "network-boundary"
# }

# resource "aws_iam_user" "publisher" {
#   name = "${var.application}-publisher"
#   path = "/"
#   # permissions_boundary = data.aws_iam_policy.permissions_boundary.arn

#   tags = local.common_tags
# }

# resource "aws_iam_user_policy_attachment" "publisher_policy_attachment" {
#   user       = "handmaiden"
#   policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
# }

# resource "aws_iam_access_key" "access_key" {
#   user = aws_iam_user.publisher.name
# }