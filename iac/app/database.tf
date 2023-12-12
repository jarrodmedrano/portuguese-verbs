

resource "aws_db_subnet_group" "dbconjugame" {
  name       = "dbconjugame_subnet"
  subnet_ids = aws_subnet.public.*.id

  tags = local.common_tags
}

resource "aws_security_group" "sgrds" {
  name   = "dbconjugame_rds_db"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_db_parameter_group" "dbconjugame" {
  name   = "dbconjugame"
  family = "postgres14"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  tags = local.common_tags
}

resource "aws_kms_key" "db_kms_key" {
  description = "My KMS Key for RDS Encryption"
  deletion_window_in_days = 30

  tags = local.common_tags
}

resource "aws_db_instance" "dbconjugame" {
  identifier             = "dbconjugame"
  instance_class         = "db.t3.micro"
  allocated_storage      = 5
  engine                 = "postgres"
  engine_version         = "14.10"
  username               = var.db_username
  password               = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.dbconjugame.name
  vpc_security_group_ids = [aws_security_group.sgrds.id]
  parameter_group_name   = aws_db_parameter_group.dbconjugame.name
  publicly_accessible    = true

  backup_retention_period = 7
  backup_window = "03:00-04:00"
  maintenance_window = "mon:04:00-mon:04:30"

  skip_final_snapshot = false
  final_snapshot_identifier = "dbconjugamesnap"

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.db_rds_monitoring_role.arn

  performance_insights_enabled = true

  kms_key_id = aws_kms_key.db_kms_key.arn
  storage_encrypted = true

  tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_iam_role" "db_rds_monitoring_role" {
  name = "rds-monitoring-role-new"

  assume_role_policy = jsonencode({
  Version = "2012-10-17",
  Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
        Service = "monitoring.rds.amazonaws.com"
      }
    }
  ]
})

  tags = local.common_tags
}

resource "aws_iam_policy_attachment" "db_rds_monitoring_attachment" {
  name = "rds-monitoring-attachment"
  roles = [aws_iam_role.db_rds_monitoring_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}