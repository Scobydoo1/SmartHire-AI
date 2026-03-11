# ============================================
# RDS PostgreSQL - Dev Environment
# ============================================

# ============================================
# KMS Key cho encryption
# ============================================

resource "aws_kms_key" "secrets" {
  description             = "KMS key for encrypting RDS secrets in ${var.project_name} ${var.environment}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-secrets-key-${var.environment}"
  })
}

resource "aws_kms_alias" "secrets" {
  name          = "alias/${var.project_name}-secrets-${var.environment}"
  target_key_id = aws_kms_key.secrets.key_id
}

# ============================================
# Secrets Manager - lưu credentials RDS
# ============================================

resource "aws_secretsmanager_secret" "rds" {
  name                    = "${var.project_name}/rds/${var.environment}"
  description             = "RDS PostgreSQL credentials for ${var.project_name} ${var.environment}"
  recovery_window_in_days = 0 # dev: xóa ngay lập tức, Prod nên đặt 30
  kms_key_id              = aws_kms_key.secrets.id

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "rds" {
  secret_id = aws_secretsmanager_secret.rds.id

  secret_string = jsonencode({
    username = var.rds_master_username
    password = var.rds_master_password
    host     = aws_db_instance.main.address
    port     = aws_db_instance.main.port
    dbname   = aws_db_instance.main.db_name
    engine   = "postgres"
    url      = "postgresql://${var.rds_master_username}:${var.rds_master_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${aws_db_instance.main.db_name}"
  })
}

# ============================================
# DB Subnet Group
# ============================================

resource "aws_db_subnet_group" "main" {
  name        = "${var.project_name}-db-subnet-group-${var.environment}"
  description = "DB Subnet Group for ${var.project_name} ${var.environment}"
  subnet_ids  = aws_subnet.private_db[*].id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-db-subnet-group-${var.environment}"
  })
}

# ============================================
# RDS PostgreSQL Instance
# ============================================

resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-postgres-${var.environment}"

  # Engine
  engine         = "postgres"
  engine_version = "15"

  # Instance
  instance_class        = var.rds_instance_class
  allocated_storage     = var.rds_allocated_storage
  max_allocated_storage = var.rds_allocated_storage * 2 # autoscaling tối đa 2x
  storage_type          = "gp3"
  storage_encrypted     = true

  # Database
  db_name  = "smarthiredb"
  username = var.rds_master_username
  password = var.rds_master_password

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false # dev: Single-AZ để tiết kiệm

  # Deletion
  deletion_protection = false
  skip_final_snapshot = true

  # Backup
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:05:00-sun:06:00"
  copy_tags_to_snapshot   = true

  # Auth & Upgrade
  iam_database_authentication_enabled = true
  auto_minor_version_upgrade          = true

  # Monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-postgres-${var.environment}"
  })
}
