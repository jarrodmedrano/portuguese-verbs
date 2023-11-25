resource "aws_vpc" "main" {
  cidr_block           = var.vpc
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.common_tags, {
    Name = "${var.application}"
  })
}

resource "aws_subnet" "public" {
  count                   = length(compact(var.public_subnets))
  vpc_id                  = aws_vpc.main.id
  cidr_block              = element(var.public_subnets, count.index)
  availability_zone       = element(var.availability_zones, count.index)
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    Name = "${var.application}-public"
  })
}

resource "aws_subnet" "private" {
  count             = length(compact(var.private_subnets))
  vpc_id            = aws_vpc.main.id
  cidr_block        = element(var.private_subnets, count.index)
  availability_zone = element(var.availability_zones, count.index)

  tags = merge(local.common_tags, {
    Name = "${var.application}-private-subnet"
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = local.common_tags
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = local.common_tags
}

resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

resource "aws_route_table_association" "public" {
  count          = length(compact(var.public_subnets))
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public.id
}

resource "aws_nat_gateway" "main" {
  count         = length(compact(var.private_subnets))
  allocation_id = element(aws_eip.nat.*.id, count.index)
  subnet_id     = element(aws_subnet.public.*.id, count.index)

  tags = local.common_tags

  depends_on = [aws_internet_gateway.main]
}

resource "aws_eip" "nat" {
  count = length(compact(var.private_subnets))
  vpc   = true

  tags = local.common_tags
}

resource "aws_route_table" "private" {
  count  = length(compact(var.private_subnets))
  vpc_id = aws_vpc.main.id

  tags = local.common_tags
}

resource "aws_route" "private" {
  count                  = length(compact(var.private_subnets))
  route_table_id         = element(aws_route_table.private.*.id, count.index)
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = element(aws_nat_gateway.main.*.id, count.index)
}

resource "aws_route_table_association" "private" {
  count          = length(compact(var.private_subnets))
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = element(aws_route_table.private.*.id, count.index)
}

resource "aws_lb" "main" {
  name               = var.application
  internal           = false
  load_balancer_type = "application"
  subnets            = aws_subnet.public.*.id
  security_groups    = [aws_security_group.lb.id]

  enable_deletion_protection = false

  tags = local.common_tags
}

resource "aws_security_group" "lb" {
  name   = "${var.application}-lb"
  vpc_id = aws_vpc.main.id

  ingress {
    protocol         = "tcp"
    from_port        = 80
    to_port          = 80
    cidr_blocks      = ["0.0.0.0/0"] # Allowing traffic in from all sources
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    protocol         = "tcp"
    from_port        = 443
    to_port          = 443
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    protocol         = "-1"
    from_port        = 0
    to_port          = 0
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${var.application}-lb"
  })
}

resource "aws_lb_target_group" "main" {
  name        = var.application
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = "/"
    unhealthy_threshold = "3"
  }

  tags = local.common_tags

  depends_on = [aws_lb.main]
}

# resource "aws_acm_certificate" "lb_tls_cert" {
#   private_key      = data.aws_secretsmanager_secret_version.lb_tls_key_latest_ver.secret_string
#   certificate_body = data.aws_secretsmanager_secret_version.lb_tls_key_latest_ver.secret_string
# }

// Comment out https for now
# resource "aws_lb_listener" "https_listener" {
#   load_balancer_arn = aws_lb.main.id
#   port              = 443
#   protocol          = "HTTPS"
#   # certificate_arn   = aws_acm_certificate.lb_tls_cert.id

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.main.id
#   }

#   tags = local.common_tags
# }

resource "aws_lb_listener" "http_redirect_listener" {
  load_balancer_arn = aws_lb.main.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.id
  }
// Comment out https for now
  # default_action {
  #   type = "redirect"

  #   redirect {
  #     port        = "443"
  #     protocol    = "HTTPS"
  #     status_code = "HTTP_301"
  #   }
  # }

  tags = local.common_tags
}