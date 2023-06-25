

# resource "aws_instance" "server" {
#   # ami           = var.amis[var.aws_region]
#   ami           = var.ami_id
#   instance_type = var.instance_type
#   count = var.servers
#   key_name = var.key_name
# #   tags = {
# #     "Name"    = "${local.common-tags["Name"]}-server"
# #     "Version" = "${local.common-tags["Version"]}"
# #   }
# }