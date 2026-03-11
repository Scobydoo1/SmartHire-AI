# ============================================
# Cognito User Pool Configuration
# ============================================

# 1. Create User Pool (User repository)
resource "aws_cognito_user_pool" "smarthire_pool" {
  name = local.cognito_config.user_pool_name

  # Configure email-based login
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password Policy
  password_policy {
    minimum_length                   = var.cognito_password_min_length
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  # Account recovery configuration
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # User attributes schema
  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = true
  }
}

# 2. Create App Client (Connection point for React)
resource "aws_cognito_user_pool_client" "smarthire_frontend_client" {
  name         = local.cognito_config.frontend_client_name
  user_pool_id = aws_cognito_user_pool.smarthire_pool.id

  # OAuth Configuration for Google Login
  supported_identity_providers         = ["COGNITO", "Google"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile", "aws.cognito.signin.user.admin"]
  callback_urls                        = ["http://localhost:5173/", "http://localhost:5173/login"]
  logout_urls                          = ["http://localhost:5173/", "http://localhost:5173/login"]

  # IMPORTANT: Disable Client Secret for SPA (React)
  generate_secret = false

  # Authentication flows (SRP is the most secure for Amplify)
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  # Security: Prevent user existence errors
  prevent_user_existence_errors = "ENABLED"
}

# 3. Create Cognito Domain for Hosted UI
resource "aws_cognito_user_pool_domain" "smarthire_domain" {
  domain       = local.cognito_config.domain_prefix
  user_pool_id = aws_cognito_user_pool.smarthire_pool.id
}

# 4. Integrate Google Identity Provider
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
