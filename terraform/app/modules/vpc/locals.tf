locals {
  owner       = "DevOps Corp Team"
  project     = "Online Store"
  cidr_blocks = ["172.16.10.0/24", "172.16.20.0/24", "172.16.30.0/24"]
  common-tags = {
    Name        = "dev"
    Environment = "development"
    Version     = 1.10
  }
  time = formatdate("DD MM YYYY hh:mm", timestamp())
}