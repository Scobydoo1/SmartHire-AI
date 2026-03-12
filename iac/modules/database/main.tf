data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

# ============================================
# KMS Key for encryption
# ============================================

resource "aws_kms_key" "secrets" {
  description             = "KMS key for encrypting RDS secrets in ${var.project_name} ${var.environment}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-secrets-key-${var.environment}"
  })
}

resource "aws_kms_alias" "secrets" {
  name          = "alias/${var.project_name}-secrets-${var.environment}"
  target_key_id = aws_kms_key.secrets.key_id
}

# ============================================
# Secrets Manager - store RDS credentials
# ============================================

resource "aws_secretsmanager_secret" "rds" {
  name                    = "${var.project_name}/rds/${var.environment}"
  description             = "RDS PostgreSQL credentials for ${var.project_name} ${var.environment}"
  recovery_window_in_days = 0
  kms_key_id              = aws_kms_key.secrets.id

  tags = var.common_tags
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
  subnet_ids  = var.private_db_subnet_ids

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-db-subnet-group-${var.environment}"
  })
}

# ============================================
# RDS PostgreSQL Instance
# ============================================

resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-postgres-${var.environment}"

  engine         = "postgres"
  engine_version = "15"

  instance_class        = var.rds_instance_class
  allocated_storage     = var.rds_allocated_storage
  max_allocated_storage = var.rds_allocated_storage * 2
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "smarthiredb"
  username = var.rds_master_username
  password = var.rds_master_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]
  publicly_accessible    = false
  multi_az               = false

  deletion_protection = false
  skip_final_snapshot = true

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:05:00-sun:06:00"
  copy_tags_to_snapshot   = true

  iam_database_authentication_enabled = true
  auto_minor_version_upgrade          = true

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-postgres-${var.environment}"
  })
}

# ============================================
# Bastion Host
# ============================================

resource "aws_security_group" "bastion" {
  name        = "${var.project_name}-bastion-sg-${var.environment}"
  description = "Security group for Bastion Host"
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.bastion_ssh_cidr]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-bastion-sg-${var.environment}"
  })
}

resource "aws_instance" "bastion" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = "t3.micro"
  subnet_id     = var.public_subnet_id
  key_name      = var.bastion_key_pair != "" ? var.bastion_key_pair : null

  vpc_security_group_ids = [aws_security_group.bastion.id]

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y postgresql15
  EOF

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-bastion-${var.environment}"
  })
}

resource "aws_eip" "bastion" {
  instance = aws_instance.bastion.id
  domain   = "vpc"

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-bastion-eip-${var.environment}"
  })
}

resource "aws_security_group_rule" "rds_ingress_bastion" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.bastion.id
  security_group_id        = var.rds_security_group_id
  description              = "PostgreSQL from Bastion Security Group"
}
