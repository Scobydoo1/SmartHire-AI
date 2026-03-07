# ============================================
# IAM Groups for different service layers
# ============================================

# AI Services Group (SageMaker, Bedrock, Lambda)
resource "aws_iam_group" "ai_group" {
  name = local.iam_groups.ai_group
  path = "/services/"
}

# Frontend Services Group (CloudFront, S3, Cognito)
resource "aws_iam_group" "frontend_group" {
  name = local.iam_groups.frontend_group
  path = "/services/"
}

# Backend Services Group (Lambda, RDS, API Gateway, DynamoDB)
resource "aws_iam_group" "backend_group" {
  name = local.iam_groups.backend_group
  path = "/services/"
}

# ============================================
# IAM Policies for AI Group
# ============================================

resource "aws_iam_group_policy" "ai_policy" {
  name  = "${local.iam_groups.ai_group}-policy"
  group = aws_iam_group.ai_group.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "SageMakerAccess"
        Effect = "Allow"
        Action = [
          "sagemaker:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "BedrockAccess"
        Effect = "Allow"
        Action = [
          "bedrock:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "LambdaAccess"
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction",
          "lambda:UpdateFunctionCode",
          "lambda:GetFunction",
          "lambda:CreateFunction"
        ]
        Resource = "arn:aws:lambda:${var.aws_region}:*:function:${var.project_name}-ai-*"
      },
      {
        Sid    = "S3AccessForModels"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.project_name}-ai-models*",
          "arn:aws:s3:::${var.project_name}-ai-models*/*"
        ]
      },
      {
        Sid    = "TranscribeAccess"
        Effect = "Allow"
        Action = [
          "transcribe:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "PollyAccess"
        Effect = "Allow"
        Action = [
          "polly:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "RekognitionAccess"
        Effect = "Allow"
        Action = [
          "rekognition:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "IAMAccessKeyManagement"
        Effect = "Allow"
        Action = [
          "iam:CreateAccessKey",
          "iam:ListAccessKeys",
          "iam:DeleteAccessKey",
          "iam:UpdateAccessKey",
          "iam:GetUser",
          "iam:ListUsers"
        ]
        Resource = "*"
      },
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/sagemaker/*"
      }
    ]
  })
}

# ============================================
# IAM Policies for Frontend Group
# ============================================

resource "aws_iam_group_policy" "frontend_policy" {
  name  = "${local.iam_groups.frontend_group}-policy"
  group = aws_iam_group.frontend_group.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3FrontendDeployment"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.project_name}-frontend*",
          "arn:aws:s3:::${var.project_name}-frontend*/*"
        ]
      },
      {
        Sid    = "CloudFrontInvalidation"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetDistribution",
          "cloudfront:ListDistributions"
        ]
        Resource = "*"
      },
      {
        Sid    = "CognitoAccess"
        Effect = "Allow"
        Action = [
          "cognito-idp:DescribeUserPool",
          "cognito-idp:DescribeUserPoolClient",
          "cognito-idp:ListUserPools"
        ]
        Resource = "*"
      },
      {
        Sid    = "APIGatewayAccess"
        Effect = "Allow"
        Action = [
          "apigateway:GET"
        ]
        Resource = "arn:aws:apigateway:${var.aws_region}::*"
      }
    ]
  })
}

# ============================================
# IAM Policies for Backend Group
# ============================================

resource "aws_iam_group_policy" "backend_policy" {
  name  = "${local.iam_groups.backend_group}-policy"
  group = aws_iam_group.backend_group.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "LambdaManagement"
        Effect = "Allow"
        Action = [
          "lambda:CreateFunction",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:DeleteFunction",
          "lambda:GetFunction",
          "lambda:ListFunctions",
          "lambda:InvokeFunction"
        ]
        Resource = "arn:aws:lambda:${var.aws_region}:*:function:${var.project_name}-backend-*"
      },
      {
        Sid    = "APIGatewayManagement"
        Effect = "Allow"
        Action = [
          "apigateway:*"
        ]
        Resource = "arn:aws:apigateway:${var.aws_region}::*"
      },
      {
        Sid    = "RDSAccess"
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds:DescribeDBClusters",
          "rds-db:connect"
        ]
        Resource = "*"
      },
      {
        Sid    = "DynamoDBAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:CreateTable",
          "dynamodb:DescribeTable",
          "dynamodb:ListTables",
          "dynamodb:UpdateTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ]
        Resource = "arn:aws:dynamodb:${var.aws_region}:*:table/${var.project_name}-*"
      },
      {
        Sid    = "SecretsManagerAccess"
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:${var.aws_region}:*:secret:${var.project_name}/*"
      },
      {
        Sid    = "SQSAccess"
        Effect = "Allow"
        Action = [
          "sqs:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "SNSAccess"
        Effect = "Allow"
        Action = [
          "sns:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "SESAccess"
        Effect = "Allow"
        Action = [
          "ses:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "DocumentProcessingAndAI"
        Effect = "Allow"
        Action = [
          "s3:*",
          "textract:*",
          "bedrock:*"
        ]
        Resource = "*"
      },
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/${var.project_name}-*"
      },
      {
        Sid    = "CognitoFullAccess"
        Effect = "Allow"
        Action = [
          "cognito-idp:*"
        ]
        Resource = aws_cognito_user_pool.smarthire_pool.arn
      },
      {
        Sid    = "CognitoDescribeAccess"
        Effect = "Allow"
        Action = [
          "cognito-idp:ListUserPools",
          "cognito-idp:DescribeUserPool",
          "cognito-idp:DescribeUserPoolClient"
        ]
        Resource = "*"
      }
    ]
  })
}
