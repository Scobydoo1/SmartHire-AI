# ============================================
# Cognito Outputs
# ============================================

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID for React configuration"
  value       = module.auth.cognito_user_pool_id
}

output "cognito_client_id" {
  description = "Cognito Client ID for React configuration"
  value       = module.auth.cognito_client_id
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
  value       = module.iam.ai_group_arn
}

output "ai_group_name" {
  description = "Name of AI Services IAM Group"
  value       = module.iam.ai_group_name
}

output "frontend_group_arn" {
  description = "ARN of Frontend Services IAM Group"
  value       = module.iam.frontend_group_arn
}

output "frontend_group_name" {
  description = "Name of Frontend Services IAM Group"
  value       = module.iam.frontend_group_name
}

output "backend_group_arn" {
  description = "ARN of Backend Services IAM Group"
  value       = module.iam.backend_group_arn
}

output "backend_group_name" {
  description = "Name of Backend Services IAM Group"
  value       = module.iam.backend_group_name
}

# ============================================
# Frontend Infrastructure Outputs
# ============================================

output "frontend_s3_bucket_name" {
  description = "S3 bucket name for frontend deployment (used in CI/CD)"
  value       = module.frontend.frontend_s3_bucket_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation (used in CI/CD)"
  value       = module.frontend.cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name (frontend URL)"
  value       = module.frontend.cloudfront_domain_name
}

# ============================================
# VPC Outputs
# ============================================

output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "Public Subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "private_db_subnet_ids" {
  description = "Private DB Subnet IDs"
  value       = module.networking.private_db_subnet_ids
}

output "app_security_group_id" {
  description = "App Security Group ID (dùng cho Lambda)"
  value       = module.networking.app_security_group_id
}

output "rds_security_group_id" {
  description = "RDS Security Group ID"
  value       = module.networking.rds_security_group_id
}

# ============================================
# RDS Outputs
# ============================================

output "rds_endpoint" {
  description = "RDS endpoint address"
  value       = module.database.rds_endpoint
}

output "rds_port" {
  description = "RDS port"
  value       = module.database.rds_port
}

output "rds_database_name" {
  description = "RDS database name"
  value       = module.database.rds_database_name
}

output "rds_instance_id" {
  description = "RDS instance identifier"
  value       = module.database.rds_instance_id
}

output "rds_secret_arn" {
  description = "ARN of Secrets Manager secret chứa RDS credentials"
  value       = module.database.rds_secret_arn
}

output "rds_secrets_kms_key_id" {
  description = "KMS Key ID dùng để encrypt RDS secrets"
  value       = module.database.rds_secrets_kms_key_id
}

output "rds_secrets_kms_key_arn" {
  description = "KMS Key ARN dùng để encrypt RDS secrets"
  value       = module.database.rds_secrets_kms_key_arn
}

# ============================================
# Bastion Outputs
# ============================================

output "bastion_public_ip" {
  description = "Public IP of Bastion Host"
  value       = module.database.bastion_public_ip
}
