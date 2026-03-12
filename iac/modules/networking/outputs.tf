output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_db_subnet_ids" {
  description = "List of private DB subnet IDs"
  value       = aws_subnet.private_db[*].id
}

output "app_security_group_id" {
  description = "Security group ID for Lambda / App"
  value       = aws_security_group.app.id
}

output "rds_security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}
