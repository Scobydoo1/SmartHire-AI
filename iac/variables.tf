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

variable "rds_master_username" {
  description = "RDS master username"
  type        = string
  default     = "smarthire_admin"
}

variable "rds_master_password" {
  description = "RDS master password (sensitive - set via TF_VAR_rds_master_password or terraform.tfvars)"
  type        = string
  sensitive   = true
}

variable "rds_instance_class" {
  description = "RDS instance class (dev: db.t3.micro, prod: db.m5.large)"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
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

variable "bastion_key_pair" {
  description = "EC2 Key Pair name for SSH access to Bastion host"
  type        = string
  default     = ""
}

variable "bastion_ssh_cidr" {
  description = "CIDR block allowed to SSH into Bastion host"
  type        = string
  default     = "0.0.0.0/0"
}

variable "existing_waf_arn" {
  description = "ARN of the existing WAF automatically created by CloudFront Pricing Plan"
  type        = string
  default     = "arn:aws:wafv2:us-east-1:116527261062:global/webacl/CreatedByCloudFront-4cfcba52/dda62f68-4276-4085-b027-938ce627350b"
}
