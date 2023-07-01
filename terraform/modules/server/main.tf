resource "aws_default_security_group" "default_sec_group" {
  vpc_id = var.main_vpc_id

  dynamic "ingress" {
    for_each = var.ingress_ports
    iterator = iport
    content {
      from_port   = iport.value
      to_port     = iport.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  egress {
    // allow all outbound traffic
    from_port = var.egress_dsg["from_port"]
    to_port   = var.egress_dsg["to_port"]
    protocol  = var.egress_dsg["protocol"]
    // any protocol
    cidr_blocks = var.egress_dsg["cidr_blocks"]
  }

  tags = {
    "Name" = "my-default-sg"
  }
}
