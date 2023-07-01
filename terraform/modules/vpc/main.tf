

resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr_block

  tags = local.common-tags
}


resource "aws_subnet" "web" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.web_subnet
  availability_zone = var.azs[0]
  tags              = local.common-tags
}

resource "aws_internet_gateway" "my_web_igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    "Name" = "${var.main_vpc_name} IGW"
  }
}

resource "aws_default_route_table" "main_vpc_default_rt" {
  default_route_table_id = aws_vpc.main.default_route_table_id

  route {
    cidr_block = "0.0.0.0/0"
    // all routes not explicitly known by the VPC will go through the internet gateway
    gateway_id = aws_internet_gateway.my_web_igw.id
    // gateway id that will handle the traffic ^ points to the internet gateway
  }
  tags = {
    "Name" = "my-default-rt"
  }
}


data "template_file" "user_data" {
  template = file("${path.root}/web-app-template.yml")
  vars = {
    MY_SSH_KEY = "${var.key_name}"
  }
}

resource "aws_instance" "my_vm" {
  ami           = var.aws_ami
  instance_type = var.my_instance[0]
  // cpu not supported in t2 micro
  # cpu_core_count              = var.my_instance[1]
  associate_public_ip_address = var.my_instance[2]
  subnet_id                   = aws_subnet.web.id
# subnet_id = var.web_subnet_id
  vpc_security_group_ids      = ["${var.security_group_id}"]
  # key_name                    = "terraform_key_rsa.pub"
  key_name = var.key_name
  # user_data = file("entry_script.sh")
  user_data = data.template_file.user_data.rendered

  tags = {
    "Name" = "My EC2 Instance - Amazon Linux 2"
  }
}
