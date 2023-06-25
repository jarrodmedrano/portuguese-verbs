output "main_vpc_id" {
    description = "The id of the vpc"
    value       = aws_vpc.main.id
    sensitive   = false
}

output "web_subnet_id" {
    description = "The id of the web subnet"
    value       = aws_subnet.web.id
    sensitive   = false
}

output "ec2_public_ip" {
  description = "The public ip of the ec2 instance"
  value       = aws_instance.my_vm.public_ip
  sensitive   = false
}

output "vpc_id" {
  description = "The id of the vpc"
  value       = aws_vpc.main.id
  sensitive   = false
}

output "ami_id" {
  description = "The id of the ami"
  value       = aws_instance.my_vm.ami
  sensitive   = false
}

output "Datetime" {
  description = "The current date and time"
  value       = local.time
  sensitive   = false
}