# data "aws_availability_zones" "available" {}

# resource "aws_vpc" "db_vpc" {
#   cidr_block = "10.0.0.0/16"

#   enable_dns_support   = true
#   enable_dns_hostnames = true
# }

# resource "aws_subnet" "subnet_a" {
#   vpc_id     = aws_vpc.db_vpc.id
#   cidr_block = "10.0.1.0/24"
#   availability_zone = element(var.availability_zones, 0)
# }

# resource "aws_subnet" "subnet_b" {
#   vpc_id     = aws_vpc.db_vpc.id
#   cidr_block = "10.0.2.0/24"
#   availability_zone = element(var.availability_zones, 1)
# }

# resource "aws_db_subnet_group" "conjugamedb" {
#   name       = "conjugamedb_subnet"
#   subnet_ids = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]

#   tags = local.common_tags
# }

# resource "aws_internet_gateway" "gw" {
#   vpc_id = aws_vpc.db_vpc.id
# }

# resource "aws_route_table" "r" {
#   vpc_id = aws_vpc.db_vpc.id

#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.gw.id
#   }
# }

# resource "aws_route_table_association" "a" {
#   subnet_id      = aws_subnet.subnet_a.id
#   route_table_id = aws_route_table.r.id
# }

# resource "aws_route_table_association" "b" {
#   subnet_id      = aws_subnet.subnet_b.id
#   route_table_id = aws_route_table.r.id
# }


# resource "aws_security_group" "rds" {
#   name   = "conjugamedb_rds_old"
#   vpc_id = aws_vpc.db_vpc.id

#   ingress {
#     from_port   = 5432
#     to_port     = 5432
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 5432
#     to_port     = 5432
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = local.common_tags
# }

# resource "aws_db_parameter_group" "conjugamedb" {
#   name   = "conjugamedb"
#   family = "postgres14"

#   parameter {
#     name  = "log_connections"
#     value = "1"
#   }

#   tags = local.common_tags
# }

# resource "aws_kms_key" "my_kms_key" {
#   description = "My KMS Key for RDS Encryption"
#   deletion_window_in_days = 30

#   tags = local.common_tags
# }

# resource "aws_db_instance" "conjugamedb" {
#   identifier             = "conjugamedb"
#   instance_class         = "db.t3.micro"
#   allocated_storage      = 5
#   engine                 = "postgres"
#   engine_version         = "14.10"
#   username               = var.db_username
#   password               = var.db_password

#   db_subnet_group_name   = aws_db_subnet_group.conjugamedb.name
#   vpc_security_group_ids = [aws_security_group.rds.id]
#   parameter_group_name   = aws_db_parameter_group.conjugamedb.name
#   publicly_accessible    = true

#   backup_retention_period = 7
#   backup_window = "03:00-04:00"
#   maintenance_window = "mon:04:00-mon:04:30"

#   skip_final_snapshot = false
#   final_snapshot_identifier = "conjugamedbsnap"

#   monitoring_interval = 60
#   monitoring_role_arn = aws_iam_role.rds_monitoring_role.arn

#   performance_insights_enabled = true

#   kms_key_id = aws_kms_key.my_kms_key.arn
#   storage_encrypted = true

#   tags = local.common_tags

#   lifecycle {
#     create_before_destroy = true
#   }
# }

# resource "aws_iam_role" "rds_monitoring_role" {
#   name = "rds-monitoring-role"

#   assume_role_policy = jsonencode({
#   Version = "2012-10-17",
#   Statement = [
#       {
#         Action = "sts:AssumeRole",
#         Effect = "Allow",
#         Principal = {
#         Service = "monitoring.rds.amazonaws.com"
#       }
#     }
#   ]
# })

#   tags = local.common_tags
# }

# resource "aws_iam_policy_attachment" "rds_monitoring_attachment" {
#   name = "rds-monitoring-attachment"
#   roles = [aws_iam_role.rds_monitoring_role.name]
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
# }