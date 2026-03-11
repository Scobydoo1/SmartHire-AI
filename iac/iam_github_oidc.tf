# ============================================
# GitHub OIDC for CI/CD Deployment
# ============================================

variable "github_repo" {
  type        = string
  description = "The GitHub repository in format 'user/repo' allowed to assume the role (e.g., 'octocat/SmartHire-AI')"
  default     = "YOUR_GITHUB_ORG/YOUR_GITHUB_REPO" # Thay bằng repo thực tế
}

# 1. GitHub OIDC Provider (chỉ cần tạo 1 lần mỗi account)
# Kiểm tra nếu chưa có thì tạo mới, nếu đã tồn tại ở account thì cân nhắc import thay vì báo lỗi
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1", "1c58a3a8518e8759bf075b76b750d4f2df264fcd"] # Update new thumbprint if needed
}

# 2. IAM Role for GitHub Actions (Frontend Deployment)
resource "aws_iam_role" "github_actions_frontend" {
  name = "${var.project_name}-github-actions-frontend-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:*"
          }
        }
      }
    ]
  })

  tags = local.common_tags
}

# 3. IAM Policy granting rights to S3 and CloudFront only
resource "aws_iam_policy" "frontend_deploy_policy" {
  name        = "${var.project_name}-frontend-deploy-policy-${var.environment}"
  description = "Policy allowing GitHub Actions to deploy to S3 and invalidate CloudFront caches"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3UploadAccess"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ]
        Resource = [
          aws_s3_bucket.frontend.arn,
          "${aws_s3_bucket.frontend.arn}/*"
        ]
      },
      {
        Sid    = "CloudFrontInvalidationAccess"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = aws_cloudfront_distribution.frontend.arn
      }
    ]
  })
}

# 4. Attach the Policy to the Role
resource "aws_iam_role_policy_attachment" "github_deploy_attach" {
  role       = aws_iam_role.github_actions_frontend.name
  policy_arn = aws_iam_policy.frontend_deploy_policy.arn
}
