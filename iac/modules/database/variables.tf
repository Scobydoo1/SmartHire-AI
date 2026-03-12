variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type        = string
  description = "VPC ID from networking module"
}

variable "private_db_subnet_ids" {
  type        = list(string)
  description = "Private DB subnet IDs from networking module"
}

variable "rds_security_group_id" {
  type        = string
  description = "RDS security group ID from networking module"
}

variable "public_subnet_id" {
  type        = string
  description = "First public subnet ID for Bastion host"
}

variable "rds_master_username" {
  type = string
}

variable "rds_master_password" {
  type      = string
  sensitive = true
}

variable "rds_instance_class" {
  type = string
}

variable "rds_allocated_storage" {
  type = number
}

variable "bastion_key_pair" {
  type = string
}

variable "bastion_ssh_cidr" {
  type = string
}

variable "common_tags" {
  type = map(string)
}
