# ============================================
# Bastion Host cho RDS
# ============================================

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

resource "aws_security_group" "bastion" {
  name        = "${var.project_name}-bastion-sg-${var.environment}"
  description = "Security group for Bastion Host"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH access from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-bastion-sg-${var.environment}"
  })
}

resource "aws_instance" "bastion" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public[0].id
  key_name      = var.bastion_key_pair != "" ? var.bastion_key_pair : null

  vpc_security_group_ids = [aws_security_group.bastion.id]

  # Đoạn script sẽ được tự động chạy 1 lần duy nhất khi máy bật lên cấu hình lần đầu
  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y postgresql15
  EOF

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-bastion-${var.environment}"
  })
}

resource "aws_eip" "bastion" {
  instance = aws_instance.bastion.id
  domain   = "vpc"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-bastion-eip-${var.environment}"
  })
}

# ============================================
# Cho phép Bastion truy cập RDS
# ============================================
resource "aws_security_group_rule" "rds_ingress_bastion" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.bastion.id
  security_group_id        = aws_security_group.rds.id
  description              = "PostgreSQL from Bastion Security Group"
}
