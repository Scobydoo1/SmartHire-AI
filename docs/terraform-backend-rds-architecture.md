# SmartHire Terraform Architecture cho Backend ket noi RDS

Tai lieu nay mo ta kien truc Terraform hien tai cua du an, tap trung vao luong Backend <-> RDS de team BE co chung hieu biet khi trien khai service.

## 1. Tong quan module trong `iac/`

Root orchestration nam o `iac/main.tf`, dang goi 6 module:

1. `networking`
- Tao VPC `10.0.0.0/16`
- Tao 2 public subnet (`10.0.1.0/24`, `10.0.2.0/24`)
- Tao 2 private DB subnet (`10.0.10.0/24`, `10.0.11.0/24`)
- Tao SG cho app/lambda (`app_sg`) va SG cho RDS (`rds_sg`)
- Rule: chi cho `app_sg` vao `rds_sg` port 5432
- Tao VPC Interface Endpoint cho Secrets Manager va KMS

2. `database`
- Tao PostgreSQL RDS (engine 15), private (`publicly_accessible = false`)
- Tao DB subnet group tren private DB subnet
- Tao Secrets Manager secret luu credentials + endpoint + dbname + connection URL
- Tao KMS key de ma hoa secret
- Tao bastion host (public subnet + EIP) de debug/migrate DB khi can

3. `auth`
- Tao Cognito User Pool + App Client + Google IdP
- Tao Lambda PostConfirmation (Node.js) de sync user tu Cognito vao bang `Users` tren RDS
- Lambda chay trong VPC (private DB subnet + `app_sg`)
- Lambda doc RDS secret tu Secrets Manager, decrypt bang KMS

4. `iam`
- Tao IAM groups theo layer (ai/frontend/backend)
- Tao policy cho backend group (co quyen Lambda, RDS, Secrets Manager, CloudWatch, v.v.)
- Tao GitHub OIDC role cho frontend deploy

5. `dns`
- Quan ly Route53 zone + ACM cert (co provider `aws.us_east_1` cho CloudFront)

6. `frontend`
- Hosting frontend bang S3 + CloudFront + Route53 record

## 2. Luong ket noi Backend -> RDS (thuc te hien tai)

```text
Backend runtime (Lambda/ECS/EC2 in VPC)
    -> lay secret (Secrets Manager endpoint trong VPC)
    -> KMS decrypt
    -> dung host/port/user/password/dbname trong secret
    -> ket noi RDS PostgreSQL:5432 (qua rds_sg)
```

Diem quan trong:
- RDS khong public, chi truy cap noi bo qua VPC + security group.
- `rds_sg` chi mo 5432 tu `app_sg` va bastion SG.
- Neu compute backend khong dung `app_sg` thi se KHONG vao duoc RDS.

## 3. Tai nguyen backend can nam ro

1. Networking
- VPC ID: lay tu output `vpc_id`
- DB private subnet IDs: lay tu output `private_db_subnet_ids`
- App SG ID: lay tu output `app_security_group_id`
- RDS SG ID: lay tu output `rds_security_group_id`

2. Database
- RDS endpoint: output `rds_endpoint`
- Port: output `rds_port` (hien tai 5432)
- Secret ARN: output `rds_secret_arn`
- Secret duoc ma hoa boi KMS key: `rds_secrets_kms_key_arn`

3. Secret shape (module database dang ghi)
```json
{
  "username": "...",
  "password": "...",
  "host": "...",
  "port": 5432,
  "dbname": "smarthiredb",
  "engine": "postgres",
  "url": "postgresql://..."
}
```

## 4. Cach deploy backend de ket noi RDS dung kien truc

### Option uu tien: Backend chay trong VPC

Ap dung cho Lambda, ECS Fargate, hoac EC2 app server:

1. Attach backend vao cung VPC voi RDS (`module.networking.vpc_id`).
2. Gan security group cua backend = `app_sg` (hoac SG duoc `rds_sg` allow).
3. Neu backend private subnet va can goi AWS APIs, dam bao route hoac endpoint day du.
4. Grant IAM runtime role cac quyen toi thieu:
- `secretsmanager:GetSecretValue` cho `rds_secret_arn`
- `kms:Decrypt` cho KMS key dung encrypt secret
5. Tai runtime, doc secret -> parse -> tao DB pool.

### Option tam thoi: Truy cap qua bastion de debug/migration

- Dung bastion public IP (`bastion_public_ip`) + SSH key pair.
- Tu may local mo SSH tunnel vao RDS de chay migration tool.
- Khong dung cach nay cho app traffic production.

## 5. Vi du bootstrap ket noi DB trong backend

```ts
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg";

const sm = new SecretsManagerClient({ region: process.env.AWS_REGION });

export async function createDbPool(secretArn: string) {
  const out = await sm.send(new GetSecretValueCommand({ SecretId: secretArn }));
  const sec = JSON.parse(out.SecretString ?? "{}");

  return new Pool({
    host: sec.host,
    port: sec.port,
    user: sec.username,
    password: sec.password,
    database: sec.dbname,
    ssl: { rejectUnauthorized: false },
  });
}
```

Khuyen nghi:
- Khong hardcode username/password trong env.
- Chi truyen `RDS_SECRET_ARN` va `AWS_REGION`.
- Su dung connection pool + retry/backoff.

## 6. Luong user auth hien tai lien quan den DB

- Sau khi user confirm sign-up tren Cognito, trigger Lambda `cognito-rds-sync` se insert user vao bang `Users` trong RDS.
- Neu team BE cung ghi vao bang `Users`, can thong nhat logic idempotent (VD: upsert theo `CognitoSub` hoac `Email`).
- Dang co `ON CONFLICT (Email) DO NOTHING` trong Lambda, can dam bao schema co unique constraint phu hop.

## 7. Checklist cho team BE truoc khi deploy

1. Da co runtime role voi quyen doc secret + decrypt KMS.
2. Service chay trong dung VPC/subnet va SG.
3. Service import `pg` va AWS SDK v3.
4. Da test health check toi DB (`SELECT 1`).
5. Da co migration strategy (CI job trong VPC hoac qua bastion).
6. Da setup monitoring: CloudWatch logs + alarm cho DB connect error.

## 8. Cac diem can luu y trong architecture hien tai

- Terraform backend dang la local state (`backend "local"`), chua dung remote state.
- `bastion_ssh_cidr` default la `0.0.0.0/0`, nen gioi han CIDR truoc khi len moi truong production.
- Chi co public subnet va private DB subnet; neu can tach rieng private app subnet cho ECS/EC2 backend thi nen bo sung module networking.

---

Neu can, co the tao tiep mot tai lieu "Backend deployment runbook" theo tung stack cu the (Lambda, ECS, EC2) dua tren architecture nay.
