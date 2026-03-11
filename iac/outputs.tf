output "cognito_user_pool_id" {
  description = "Cognito User Pool ID for React configuration"
  value       = aws_cognito_user_pool.smarthire_pool.id
}

output "cognito_client_id" {
  description = "Cognito Client ID for React configuration"
  value       = aws_cognito_user_pool_client.smarthire_frontend_client.id
}

output "aws_region" {
  description = "AWS Region"
  value       = var.aws_region
}

# ============================================
# IAM Groups Outputs
# ============================================

output "ai_group_arn" {
  description = "ARN of AI Services IAM Group"
  value       = aws_iam_group.ai_group.arn
}

output "ai_group_name" {
  description = "Name of AI Services IAM Group"
  value       = aws_iam_group.ai_group.name
}

output "frontend_group_arn" {
  description = "ARN of Frontend Services IAM Group"
  value       = aws_iam_group.frontend_group.arn
}

output "frontend_group_name" {
  description = "Name of Frontend Services IAM Group"
  value       = aws_iam_group.frontend_group.name
}

output "backend_group_arn" {
  description = "ARN of Backend Services IAM Group"
  value       = aws_iam_group.backend_group.arn
}

output "backend_group_name" {
  description = "Name of Backend Services IAM Group"
  value       = aws_iam_group.backend_group.name
}

# ============================================
# Frontend Infrastructure Outputs
# ============================================

output "frontend_s3_bucket_name" {
  description = "S3 bucket name for frontend deployment (used in CI/CD)"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation (used in CI/CD)"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name (frontend URL)"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

# ============================================
# VPC Outputs
# ============================================

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public Subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_db_subnet_ids" {
  description = "Private DB Subnet IDs"
  value       = aws_subnet.private_db[*].id
}

output "app_security_group_id" {
  description = "App Security Group ID (dùng cho Lambda)"
  value       = aws_security_group.app.id
}

output "rds_security_group_id" {
  description = "RDS Security Group ID"
  value       = aws_security_group.rds.id
}

# ============================================
# RDS Outputs
# ============================================

output "rds_endpoint" {
  description = "RDS endpoint address"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  description = "RDS port"
  value       = aws_db_instance.main.port
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.main.db_name
}

output "rds_instance_id" {
  description = "RDS instance identifier"
  value       = aws_db_instance.main.identifier
}

output "rds_secret_arn" {
  description = "ARN of Secrets Manager secret chứa RDS credentials"
  value       = aws_secretsmanager_secret.rds.arn
}

output "rds_secrets_kms_key_id" {
  description = "KMS Key ID dùng để encrypt RDS secrets"
  value       = aws_kms_key.secrets.id
}

output "rds_secrets_kms_key_arn" {
  description = "KMS Key ARN dùng để encrypt RDS secrets"
  value       = aws_kms_key.secrets.arn
}

# ============================================
# Bastion Outputs
# ============================================

output "bastion_public_ip" {
  description = "Public IP of Bastion Host"
  value       = aws_eip.bastion.public_ip
}
