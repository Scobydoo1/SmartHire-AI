variable "project_name" {
  type        = string
  description = "Prefix for resource names"
}

variable "environment" {
  type        = string
  description = "Environment name (dev / staging / prod)"
}

variable "aws_region" {
  type        = string
  description = "Primary AWS region"
}

variable "common_tags" {
  type        = map(string)
  description = "Common tags applied to all resources"
}
