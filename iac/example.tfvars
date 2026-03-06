# SmartHire IAC - Example Terraform Variables
# Copy this file to terraform.tfvars and update values as needed

project_name = "smarthire"
environment  = "dev"
aws_region   = "ap-southeast-1"

# Cognito configuration
cognito_password_min_length = 8

# Service enablement flags
enable_ai_services       = true
enable_frontend_services = true
enable_backend_services  = true

# Example for production environment:
# project_name = "smarthire"
# environment  = "prod"
# aws_region   = "ap-southeast-1"
# cognito_password_min_length = r1frontend2
