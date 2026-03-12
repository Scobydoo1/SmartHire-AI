# ============================================
# Root Orchestration — calls all modules
# ============================================

module "networking" {
  source       = "./modules/networking"
  project_name = var.project_name
  environment  = var.environment
  aws_region   = var.aws_region
  common_tags  = local.common_tags
}

module "dns" {
  source = "./modules/dns"
  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }
  domain_name = var.domain_name
  common_tags = local.common_tags
}

module "database" {
  source                = "./modules/database"
  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.networking.vpc_id
  private_db_subnet_ids = module.networking.private_db_subnet_ids
  rds_security_group_id = module.networking.rds_security_group_id
  public_subnet_id      = module.networking.public_subnet_ids[0]
  rds_master_username   = var.rds_master_username
  rds_master_password   = var.rds_master_password
  rds_instance_class    = var.rds_instance_class
  rds_allocated_storage = var.rds_allocated_storage
  bastion_key_pair      = var.bastion_key_pair
  bastion_ssh_cidr      = var.bastion_ssh_cidr
  common_tags           = local.common_tags
}

module "auth" {
  source                      = "./modules/auth"
  project_name                = var.project_name
  environment                 = var.environment
  private_db_subnet_ids       = module.networking.private_db_subnet_ids
  app_security_group_id       = module.networking.app_security_group_id
  rds_secret_arn              = module.database.rds_secret_arn
  rds_secret_name             = module.database.rds_secret_name
  kms_key_arn                 = module.database.rds_secrets_kms_key_arn
  cognito_password_min_length = var.cognito_password_min_length
  google_client_id            = var.google_client_id
  google_client_secret        = var.google_client_secret
  common_tags                 = local.common_tags
}

module "frontend" {
  source           = "./modules/frontend"
  project_name     = var.project_name
  environment      = var.environment
  domain_name      = var.domain_name
  certificate_arn  = module.dns.certificate_arn
  route53_zone_id  = module.dns.route53_zone_id
  existing_waf_arn = var.existing_waf_arn
  common_tags      = local.common_tags
}

module "iam" {
  source                     = "./modules/iam"
  project_name               = var.project_name
  environment                = var.environment
  aws_region                 = var.aws_region
  frontend_s3_bucket_name    = module.frontend.frontend_s3_bucket_name
  cloudfront_distribution_id = module.frontend.cloudfront_distribution_id
  cognito_user_pool_arn      = module.auth.cognito_user_pool_arn
  github_repo                = var.github_repo
  enable_ai_services         = var.enable_ai_services
  enable_frontend_services   = var.enable_frontend_services
  enable_backend_services    = var.enable_backend_services
  common_tags                = local.common_tags
}

# ============================================
# moved{} blocks — preserve existing state
# (prevents destroy/recreate of real resources)
# ============================================

moved {
  from = aws_vpc.main
  to   = module.networking.aws_vpc.main
}

moved {
  from = aws_subnet.public[0]
  to   = module.networking.aws_subnet.public[0]
}

moved {
  from = aws_subnet.public[1]
  to   = module.networking.aws_subnet.public[1]
}

moved {
  from = aws_subnet.private_db[0]
  to   = module.networking.aws_subnet.private_db[0]
}

moved {
  from = aws_subnet.private_db[1]
  to   = module.networking.aws_subnet.private_db[1]
}

moved {
  from = aws_route_table.public
  to   = module.networking.aws_route_table.public
}

moved {
  from = aws_route_table_association.public[0]
  to   = module.networking.aws_route_table_association.public[0]
}

moved {
  from = aws_route_table_association.public[1]
  to   = module.networking.aws_route_table_association.public[1]
}

moved {
  from = aws_security_group.app
  to   = module.networking.aws_security_group.app
}

moved {
  from = aws_security_group.rds
  to   = module.networking.aws_security_group.rds
}

moved {
  from = aws_security_group.bastion
  to   = module.database.aws_security_group.bastion
}

moved {
  from = aws_security_group_rule.rds_ingress_bastion
  to   = module.database.aws_security_group_rule.rds_ingress_bastion
}

moved {
  from = aws_kms_key.secrets
  to   = module.database.aws_kms_key.secrets
}

moved {
  from = aws_kms_alias.secrets
  to   = module.database.aws_kms_alias.secrets
}

moved {
  from = aws_secretsmanager_secret.rds
  to   = module.database.aws_secretsmanager_secret.rds
}

moved {
  from = aws_secretsmanager_secret_version.rds
  to   = module.database.aws_secretsmanager_secret_version.rds
}

moved {
  from = aws_s3_bucket.frontend
  to   = module.frontend.aws_s3_bucket.frontend
}

moved {
  from = aws_s3_bucket_public_access_block.frontend
  to   = module.frontend.aws_s3_bucket_public_access_block.frontend
}

moved {
  from = aws_s3_bucket_policy.frontend
  to   = module.frontend.aws_s3_bucket_policy.frontend
}

moved {
  from = aws_route53_record.frontend_a_record
  to   = module.frontend.aws_route53_record.frontend_a_record
}

moved {
  from = aws_route53_record.frontend_www_a_record
  to   = module.frontend.aws_route53_record.frontend_www_a_record
}

moved {
  from = aws_route53_record.cert_validation["smarthire-ai.org"]
  to   = module.dns.aws_route53_record.cert_validation["smarthire-ai.org"]
}

moved {
  from = aws_route53_record.cert_validation["www.smarthire-ai.org"]
  to   = module.dns.aws_route53_record.cert_validation["www.smarthire-ai.org"]
}

# Move Origin Access Control (OAC)
moved {
  from = aws_cloudfront_origin_access_control.frontend
  to   = module.frontend.aws_cloudfront_origin_access_control.frontend
}
