# ============================================
# Cognito User Pool
# ============================================

resource "aws_cognito_user_pool" "smarthire_pool" {
  name = "${var.project_name}-user-pool-${var.environment}"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length                   = var.cognito_password_min_length
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true
  }

  schema {
    attribute_data_type = "String"
    name                = "role"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 20
    }
  }

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_sync.arn
  }
}

resource "aws_cognito_user_pool_client" "smarthire_frontend_client" {
  name         = "${var.project_name}-frontend-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.smarthire_pool.id

  supported_identity_providers         = ["COGNITO", "Google"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile", "aws.cognito.signin.user.admin"]
  callback_urls                        = ["http://localhost:5173/", "http://localhost:5173/login"]
  logout_urls                          = ["http://localhost:5173/", "http://localhost:5173/login"]

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  read_attributes  = ["email", "name", "custom:role"]
  write_attributes = ["email", "name", "custom:role"]

  prevent_user_existence_errors = "ENABLED"
}

resource "aws_cognito_user_pool_domain" "smarthire_domain" {
  domain       = "${var.project_name}-auth-${var.environment}"
  user_pool_id = aws_cognito_user_pool.smarthire_pool.id
}

resource "aws_cognito_identity_provider" "google_provider" {
  user_pool_id  = aws_cognito_user_pool.smarthire_pool.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "email openid profile"
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }
}

# ============================================
# Lambda: Cognito PostConfirmation -> RDS Sync
# ============================================

resource "aws_iam_role" "cognito_sync" {
  name = "${var.project_name}-cognito-sync-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })

  tags = var.common_tags
}

resource "aws_iam_role_policy_attachment" "cognito_sync_vpc" {
  role       = aws_iam_role.cognito_sync.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy" "cognito_sync_secrets" {
  name = "read-rds-secret"
  role = aws_iam_role.cognito_sync.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = var.rds_secret_arn
      },
      {
        Effect   = "Allow"
        Action   = ["kms:Decrypt"]
        Resource = var.kms_key_arn
      }
    ]
  })
}

data "archive_file" "cognito_sync" {
  type        = "zip"
  source_dir  = "${path.root}/../lambda/cognito_post_confirmation"
  output_path = "${path.root}/../lambda/cognito_post_confirmation.zip"
}

resource "aws_lambda_function" "cognito_sync" {
  filename         = data.archive_file.cognito_sync.output_path
  source_code_hash = data.archive_file.cognito_sync.output_base64sha256
  function_name    = "${var.project_name}-cognito-rds-sync-${var.environment}"
  role             = aws_iam_role.cognito_sync.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 128

  vpc_config {
    subnet_ids         = var.private_db_subnet_ids
    security_group_ids = [var.app_security_group_id]
  }

  environment {
    variables = {
      SECRET_NAME = var.rds_secret_name
    }
  }

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-cognito-rds-sync-${var.environment}"
  })
}

resource "aws_lambda_permission" "cognito_invoke_sync" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_sync.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.smarthire_pool.arn
}
