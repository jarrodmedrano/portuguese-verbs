output "security_group_id" {
    description = "The security group id"
    value       = aws_default_security_group.default_sec_group.id
}