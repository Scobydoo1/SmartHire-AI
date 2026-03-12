# Kế hoạch tái cấu trúc IaC thành Terraform Modules — SmartHire-AI

## Mục tiêu

- Tách 8 file `.tf` phẳng hiện tại thành 6 grouped modules (`networking`, `database`, `auth`, `frontend`, `iam`, `dns`)
- Root `main.tf` trở thành file duy nhất chịu trách nhiệm orchestration (gọi các modules và nối dữ liệu giữa chúng)
- Lambda `cognito_post_confirmation` được gộp vào module `auth` cùng với Cognito User Pool

## Cấu trúc thư mục mục tiêu

```
iac/
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── database/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── auth/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── frontend/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── iam/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── dns/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── main.tf (orchestration — gọi các modules)
├── variables.tf (giữ nguyên)
├── outputs.tf (delegate tới module outputs)
├── locals.tf (common_tags, giữ nguyên)
├── provider.tf (giữ nguyên)
├── terraform.tfvars (giữ nguyên)
└── example.tfvars (giữ nguyên)
```

## Mapping file hiện tại → Module

| File gốc                 | Module đích           | Ghi chú                                                                             |
| ------------------------ | --------------------- | ----------------------------------------------------------------------------------- |
| `vpc.tf`                 | `modules/networking/` | Toàn bộ VPC, subnets, IGW, route tables, security groups                            |
| `rds.tf`                 | `modules/database/`   | KMS, Secrets Manager, DB subnet group, aws_db_instance                              |
| `bastion.tf`             | `modules/database/`   | Gộp chung với RDS; bastion SG rule trỏ tới RDS SG                                   |
| `cognito.tf`             | `modules/auth/`       | User Pool, client, domain, Google IdP                                               |
| `lambda_cognito_sync.tf` | `modules/auth/`       | Lambda IAM role, function, permission gộp vào auth                                  |
| `frontend.tf`            | `modules/frontend/`   | S3, CloudFront, OAC, S3 bucket policy                                               |
| `iam-groups.tf`          | `modules/iam/`        | Ba IAM groups: AI / Frontend / Backend                                              |
| `iam_github_oidc.tf`     | `modules/iam/`        | GitHub OIDC provider + role + deploy policy                                         |
| `route53_acm.tf`         | split                 | ACM cert + DNS validation → `modules/dns/`; Route53 A records → `modules/frontend/` |

## Chi tiết từng module

### modules/networking

**Nguồn:** `vpc.tf`

**Resources:**

- `aws_vpc.main`
- `aws_subnet.public[2]`
- `aws_subnet.private_db[2]`
- `aws_internet_gateway.main`
- `aws_route_table.public`
- `aws_route_table_association.public[2]`
- `aws_security_group.app`
- `aws_security_group.rds`
- `data.aws_availability_zones.available`

#### variables.tf

| Variable       | Type          | Description               |
| -------------- | ------------- | ------------------------- |
| `project_name` | `string`      | Prefix cho tên resource   |
| `environment`  | `string`      | dev / staging / prod      |
| `aws_region`   | `string`      | Primary AWS region        |
| `common_tags`  | `map(string)` | Tags chung từ root locals |

#### outputs.tf

| Output                  | Description                      |
| ----------------------- | -------------------------------- |
| `vpc_id`                | ID của VPC                       |
| `public_subnet_ids`     | List ID của 2 public subnets     |
| `private_db_subnet_ids` | List ID của 2 private DB subnets |
| `app_security_group_id` | SG cho Lambda / App tầng         |
| `rds_security_group_id` | SG cho RDS                       |

### modules/dns

**Nguồn:** `route53_acm.tf` (phần ACM + DNS validation)

**Resources:**

- `data.aws_route53_zone.main`
- `aws_acm_certificate.frontend_cert` (provider `aws.us_east_1` — bắt buộc cho CloudFront)
- `aws_route53_record.cert_validation`
- `aws_acm_certificate_validation.frontend_cert`

> **Yêu cầu đặc biệt:** Module này cần nhận provider alias `aws.us_east_1` từ root qua `providers = { aws.us_east_1 = aws.us_east_1 }`.
>
> Khai báo trong module:
>
> ```hcl
> terraform {
>   required_providers {
>     aws = {
>       configuration_aliases = [aws.us_east_1]
>     }
>   }
> }
> ```

#### variables.tf

| Variable      | Type          | Description                          |
| ------------- | ------------- | ------------------------------------ |
| `domain_name` | `string`      | Domain chính, vd: `smarthire-ai.org` |
| `common_tags` | `map(string)` | Tags chung                           |

#### outputs.tf

| Output            | Description                  |
| ----------------- | ---------------------------- |
| `certificate_arn` | ARN của ACM cert (us-east-1) |
| `route53_zone_id` | Zone ID của hosted zone      |

### modules/database

**Nguồn:** `rds.tf` + `bastion.tf`

**Resources:**

- `aws_kms_key.secrets`
- `aws_kms_alias.secrets`
- `aws_secretsmanager_secret.rds`
- `aws_secretsmanager_secret_version.rds`
- `aws_db_subnet_group.main`
- `aws_db_instance.main`
- `aws_security_group.bastion`
- `aws_instance.bastion`
- `aws_eip.bastion`
- `aws_security_group_rule.rds_ingress_bastion`

#### variables.tf

| Variable                | Type                 | Description                          |
| ----------------------- | -------------------- | ------------------------------------ |
| `project_name`          | `string`             | -                                    |
| `environment`           | `string`             | -                                    |
| `private_db_subnet_ids` | `list(string)`       | Từ module networking                 |
| `rds_security_group_id` | `string`             | Từ module networking                 |
| `public_subnet_id`      | `string`             | `public_subnet_ids[0]` — cho Bastion |
| `rds_master_username`   | `string`             | -                                    |
| `rds_master_password`   | `string` (sensitive) | -                                    |
| `rds_instance_class`    | `string`             | -                                    |
| `rds_allocated_storage` | `number`             | -                                    |
| `bastion_key_pair`      | `string`             | -                                    |
| `bastion_ssh_cidr`      | `string`             | -                                    |
| `common_tags`           | `map(string)`        | -                                    |

#### outputs.tf

| Output                    | Description                    |
| ------------------------- | ------------------------------ |
| `rds_endpoint`            | Hostname của RDS instance      |
| `rds_port`                | Port (5432)                    |
| `rds_database_name`       | Tên database                   |
| `rds_instance_id`         | ID của RDS instance            |
| `rds_secret_arn`          | ARN của Secrets Manager secret |
| `rds_secrets_kms_key_id`  | KMS Key ID                     |
| `rds_secrets_kms_key_arn` | KMS Key ARN                    |
| `bastion_public_ip`       | Elastic IP của Bastion         |

### modules/auth

**Nguồn:** `cognito.tf` + `lambda_cognito_sync.tf`

**Resources:**

- `aws_cognito_user_pool.smarthire_pool`
- `aws_cognito_user_pool_client.smarthire_frontend_client`
- `aws_cognito_user_pool_domain.smarthire_domain`
- `aws_cognito_identity_provider.google_provider`
- `aws_iam_role.cognito_sync`
- `aws_iam_role_policy_attachment.cognito_sync_vpc`
- `aws_iam_role_policy.cognito_sync_secrets`
- `data.archive_file.cognito_sync`
- `aws_lambda_function.cognito_sync`
- `aws_lambda_permission.cognito_invoke_sync`

> **Lưu ý path Lambda:** `data.archive_file` `source_dir` phải trỏ tới `${path.root}/../../lambda/cognito_post_confirmation` hoặc dùng `path.module` + relative path phù hợp. Cần kiểm tra sau khi di chuyển.

#### variables.tf

| Variable                      | Type                 | Description          |
| ----------------------------- | -------------------- | -------------------- |
| `project_name`                | `string`             | -                    |
| `environment`                 | `string`             | -                    |
| `private_db_subnet_ids`       | `list(string)`       | Từ module networking |
| `app_security_group_id`       | `string`             | Từ module networking |
| `rds_secret_arn`              | `string`             | Từ module database   |
| `kms_key_arn`                 | `string`             | Từ module database   |
| `cognito_password_min_length` | `number`             | -                    |
| `google_client_id`            | `string`             | -                    |
| `google_client_secret`        | `string` (sensitive) | -                    |
| `common_tags`                 | `map(string)`        | -                    |

#### outputs.tf

| Output                  | Description                            |
| ----------------------- | -------------------------------------- |
| `cognito_user_pool_id`  | Dùng cho React frontend config         |
| `cognito_user_pool_arn` | Dùng nội bộ module (lambda_permission) |
| `cognito_client_id`     | Dùng cho React frontend config         |

### modules/frontend

**Nguồn:** `frontend.tf` + Route53 A records từ `route53_acm.tf`

**Resources:**

- `aws_s3_bucket.frontend`
- `aws_s3_bucket_public_access_block.frontend`
- `aws_cloudfront_origin_access_control.frontend`
- `aws_s3_bucket_policy.frontend`
- `aws_cloudfront_distribution.frontend`
- `aws_route53_record.frontend_a_record`
- `aws_route53_record.frontend_www_a_record`

#### variables.tf

| Variable           | Type          | Description            |
| ------------------ | ------------- | ---------------------- |
| `project_name`     | `string`      | -                      |
| `environment`      | `string`      | -                      |
| `domain_name`      | `string`      | -                      |
| `certificate_arn`  | `string`      | Từ module dns          |
| `route53_zone_id`  | `string`      | Từ module dns          |
| `existing_waf_arn` | `string`      | WAF ARN cho CloudFront |
| `common_tags`      | `map(string)` | -                      |

#### outputs.tf

| Output                       | Description          |
| ---------------------------- | -------------------- |
| `frontend_s3_bucket_name`    | Cho CI/CD deployment |
| `cloudfront_distribution_id` | Cache invalidation   |
| `cloudfront_domain_name`     | URL frontend         |

### modules/iam

**Nguồn:** `iam-groups.tf` + `iam_github_oidc.tf`

**Resources:**

- `aws_iam_group.ai_services_group`
- `aws_iam_group_policy.ai_services_policy`
- `aws_iam_group.frontend_services_group`
- `aws_iam_group_policy.frontend_services_policy`
- `aws_iam_group.backend_services_group`
- `aws_iam_group_policy.backend_services_policy`
- `aws_iam_openid_connect_provider.github`
- `aws_iam_role.github_actions_frontend`
- `aws_iam_policy.frontend_deploy_policy`
- `aws_iam_role_policy_attachment.github_deploy_attach`

#### variables.tf

| Variable                     | Type          | Description        |
| ---------------------------- | ------------- | ------------------ |
| `project_name`               | `string`      | -                  |
| `environment`                | `string`      | -                  |
| `frontend_s3_bucket_name`    | `string`      | Từ module frontend |
| `cloudfront_distribution_id` | `string`      | Từ module frontend |
| `github_repo`                | `string`      | owner/repo format  |
| `enable_ai_services`         | `bool`        | Feature flag       |
| `enable_frontend_services`   | `bool`        | Feature flag       |
| `enable_backend_services`    | `bool`        | Feature flag       |
| `common_tags`                | `map(string)` | -                  |

#### outputs.tf

| Output                | Description |
| --------------------- | ----------- |
| `ai_group_arn`        | -           |
| `ai_group_name`       | -           |
| `frontend_group_arn`  | -           |
| `frontend_group_name` | -           |
| `backend_group_arn`   | -           |
| `backend_group_name`  | -           |

## Dependency Graph giữa các modules

```
module.networking ──┬──→ module.database ──→ module.auth
                    │
module.dns ─────────┴──→ module.frontend ──→ module.iam
```

## Thứ tự apply của Terraform

Terraform tự động xử lý qua implicit/explicit dependencies:

- **Phase 1 (parallel):**
  - `module.networking` — không phụ thuộc gì
  - `module.dns` — không phụ thuộc gì

- **Phase 2:**
  - `module.database` — phụ thuộc subnet + SG từ `module.networking`

- **Phase 3:**
  - `module.auth` — phụ thuộc subnet + SG từ `module.networking`; secret ARN + KMS từ `module.database`

- **Phase 4:**
  - `module.frontend` — phụ thuộc cert ARN + zone ID từ `module.dns`

- **Phase 5:**
  - `module.iam` — phụ thuộc S3 bucket + CloudFront ID từ `module.frontend`

## Các bước thực hiện

### Phase 1 — Tạo các module (song song)

- [ ] Tạo `modules/networking/main.tf`, `variables.tf`, `outputs.tf`
- [ ] Tạo `modules/dns/main.tf`, `variables.tf`, `outputs.tf`
- [ ] Tạo `modules/database/main.tf`, `variables.tf`, `outputs.tf`
- [ ] Tạo `modules/auth/main.tf`, `variables.tf`, `outputs.tf`
- [ ] Tạo `modules/frontend/main.tf`, `variables.tf`, `outputs.tf`
- [ ] Tạo `modules/iam/main.tf`, `variables.tf`, `outputs.tf`

### Phase 2 — Viết lại root files

- [ ] Viết lại `iac/main.tf`:
  - 6 module blocks với đầy đủ input variables
  - Truyền `providers = { aws = aws, aws.us_east_1 = aws.us_east_1 }` cho `module.dns`

- [ ] Cập nhật `iac/outputs.tf` — delegate toàn bộ sang `module.<name>.<output>`

- [ ] Giữ nguyên:
  - `provider.tf`
  - `variables.tf`
  - `locals.tf`
  - `terraform.tfvars`

### Phase 3 — Cleanup & Verification

- [ ] Xóa 9 .tf file gốc:
  - `vpc.tf`, `rds.tf`, `bastion.tf`, `cognito.tf`, `lambda_cognito_sync.tf`, `frontend.tf`, `iam-groups.tf`, `iam_github_oidc.tf`, `route53_acm.tf`

- [ ] Thêm `moved {}` blocks vào root `main.tf` để map old resource addresses → new module addresses (tránh destroy/recreate resource thật)

### Phase 4 — State Migration (quan trọng nhất)

- [ ] Chạy `terraform init` để kéo modules mới
- [ ] Chạy `terraform validate` để kiểm tra syntax
- [ ] Chạy `terraform plan` và đảm bảo không có resource nào bị destroy/recreate nhờ `moved {}` blocks
- [ ] Backup `terraform.tfstate` trước khi apply
- [ ] Chạy `terraform apply`

## Lưu ý kỹ thuật quan trọng

### moved {} blocks để tránh phá resource thật

Khi resource address thay đổi từ `aws_vpc.main` → `module.networking.aws_vpc.main`, Terraform sẽ plan destroy + create nếu không có `moved {}` block.

**Ví dụ:**

```hcl
moved {
  from = aws_vpc.main
  to   = module.networking.aws_vpc.main
}

moved {
  from = aws_db_instance.main
  to   = module.database.aws_db_instance.main
}
```

> **Cần thêm `moved {}` block cho toàn bộ resources có trong state hiện tại.**

### Provider alias cho module dns

Module `dns` dùng `aws_acm_certificate` với provider `aws.us_east_1`. Root `main.tf` cần truyền:

```hcl
module "dns" {
  source = "./modules/dns"
  providers = {
    aws         = aws
    aws.us_east_1 = aws.us_east_1
  }
  ...
}
```

### Lambda source path

`data.archive_file.cognito_sync` trong module `auth` cần đường dẫn tương đối đúng:

```hcl
source_dir = "${path.root}/../lambda/cognito_post_confirmation"
```

> Vì `path.root = iac/`, còn `lambda/` nằm cùng cấp với `iac/`

### Secrets trong tfvars

`rds_master_password` và `google_client_secret` đang hardcode trong `terraform.tfvars`.

**Khuyến nghị sau refactor:**

- Dùng environment variables: `TF_VAR_rds_master_password`
- Hoặc lưu trong AWS Secrets Manager và dùng `data.aws_secretsmanager_secret_version`
- Thêm `terraform.tfvars` vào `.gitignore`

## Checklist hoàn thành

- [ ] `terraform init` thành công
- [ ] `terraform validate` không có lỗi
- [ ] `terraform plan` không có resource nào bị destroy/recreate ngoài ý muốn
- [ ] Tất cả outputs ở root level vẫn đủ (dùng cho CI/CD pipeline)
- [ ] `modules/auth/` có đúng path tới Lambda source code
- [ ] Module `dns` nhận đúng provider alias `aws.us_east_1`
- [ ] `moved {}` blocks đầy đủ cho tất cả resources trong state hiện tại
      </output></name>
