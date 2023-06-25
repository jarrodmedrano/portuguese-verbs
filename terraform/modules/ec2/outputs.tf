

output "private_addresses" {
  description = "The private ip address of the server"
  value       = aws_instance.server[*].private_ip
  sensitive   = false
}