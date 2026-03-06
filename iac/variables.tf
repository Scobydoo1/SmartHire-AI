variable "project_name" {
  description = "Project name"
  type        = string
  default     = "smarthire"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "cognito_password_min_length" {
  description = "Minimum password length"
  type        = number
  default     = 8
}

variable "enable_ai_services" {
  description = "Enable AI services (SageMaker, Bedrock, etc.)"
  type        = bool
  default     = true
}

variable "enable_frontend_services" {
  description = "Enable frontend services (CloudFront, S3, etc.)"
  type        = bool
  default     = true
}

variable "enable_backend_services" {
  description = "Enable backend services (Lambda, RDS, etc.)"
  type        = bool
  default     = true
}

variable "google_client_id" {
  description = "Google OAuth Client ID for Cognito Federation"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret for Cognito Federation"
  type        = string
  default     = ""
}
