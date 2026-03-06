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
