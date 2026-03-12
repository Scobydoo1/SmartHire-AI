## 🧠 Brainstorm: Đồng bộ User từ Cognito sang RDS (PostgreSQL)

### Context

Hệ thống hiện tại sử dụng AWS Cognito để quản lý xác thực người dùng và AWS RDS (PostgreSQL) cho database chính. Khi một user mới đăng ký thành công trên Cognito, chúng ta cần tự động tạo một bản ghi tương ứng trong bảng `Users` trên RDS để phục vụ cho các logic nghiệp vụ sau này.

Cấu trúc bảng `Users` trên RDS:

```sql
CREATE TABLE Users (
    Id UUID PRIMARY KEY,
    CognitoSub TEXT NOT NULL DEFAULT '',
    Email TEXT NOT NULL UNIQUE,
    Role TEXT NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL
);
```

Dưới đây là các phương án thiết kế để giải quyết bài toán này.

---

### Option A: Cognito Post Confirmation Lambda Trigger (Khuyên dùng)

Sử dụng trigger `PostConfirmation` mặc định của Cognito để gọi một Lambda function. Lambda này sẽ kết nối trực tiếp vào RDS và thực hiện câu lệnh `INSERT`.

✅ **Pros:**

- Real-time: Dữ liệu được đồng bộ ngay lập tức sau khi user xác thực email thành công.
- Đơn giản, dễ setup bằng Terraform, được AWS Cognito hỗ trợ Native.
- Không cần thêm các services trung gian (SQS, EventBridge).

❌ **Cons:**

- Chặt chẽ (Tightly coupled): Nếu RDS bị down, trigger có thể bị lỗi báo về phía Cognito (tuy nhiên user đã được tạo thành công trên Cognito).
- Lambda phải được đặt trong cùng VPC (Private Subnet) với RDS và phải quản lý connection pool.

📊 **Effort:** Low | **Medium** | High

---

### Option B: Asynchronous Sync (EventBridge/CloudTrail -> SQS -> Lambda)

Sử dụng AWS CloudTrail để bắt event `SignUp`/`ConfirmSignUp` từ Cognito, đưa vào Amazon EventBridge Rule, gửi message vào SQS Queue, sau đó Lambda sẽ consume từ SQS và ghi vào RDS.

✅ **Pros:**

- Decoupled (Lỏng lẻo): Signup flow của user không bị phụ thuộc vào tốc độ hoặc trạng thái (up/down) của RDS.
- Resilience: SQS hỗ trợ retry tự động và DLQ (Dead Letter Queue) nếu có lỗi xảy ra.

❌ **Cons:**

- Eventual Consistency: Dữ liệu trên RDS sẽ có độ trễ ngắn (vài trăm mili-giây đến vài giây).
- Kiến trúc phức tạp hơn, tốn nhiều effort setup Terraform cho CloudTrail, SQS, EventBridge.

📊 **Effort:** Low | Medium | **High**

---

### Option C: API Gateway + Custom Signup Flow

Thay vì để Frontend gọi thẳng vào Cognito, Frontend sẽ gọi một REST API (API Gateway -> Lambda). Lambda này sẽ đóng vai trò Backend: gọi AWS SDK (AdminCreateUser) để ép tạo user trên Cognito, sau khi thành công thì chèn dữ liệu vào RDS.

✅ **Pros:**

- Kiểm soát hoàn toàn transaction. Có thể rollback hoặc xóa lại user trên Cognito nếu RDS insert lỗi.

❌ **Cons:**

- Phá vỡ tính tiện lợi của Amplify/Cognito UI từ Frontend. Frontend phải tự build giao diện và quản lý payload gửi lên API Custom.

📊 **Effort:** Low | Medium | **High**

---

## 💡 Recommendation

**Option A (Cognito Post Confirmation Lambda Trigger)** là phù hợp nhất cho dự án hiện tại vì nó đảm bảo tính realtime và kiến trúc terraform gọn nhẹ, tận dụng tốt tính năng Native của Cognito.

Để Lambda này chạy được, nó sẽ cần:

1. Đặt vào chung VPC / Private Subnet với RDS.
2. Có Role cho phép đọc Secret Manager (lấy Credentials RDS), kết nối VPC (ENI).

---

## 🛠 Hướng dẫn chi tiết từng bước thực hiện (Option A)

Dựa vào cấu trúc `iac` hiện tại (có `cognito.tf` và `rds.tf`), đây là các bước bạn cần thực hiện bằng Terraform và Code.

### Bước 1: Tạo thư mục code cho Lambda

Tạo thư mục `lambda/cognito_post_confirmation` ở thư mục gốc của dự án.
Trong đó khởi tạo ứng dụng Node.js hoặc Python (Ví dụ dùng Node.js để kết nối Postgres bằng thư viện `pg`).

`lambda/cognito_post_confirmation/index.js`

```javascript
const { Client } = require("pg");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const crypto = require("crypto");

const secretManagerClient = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

async function getDbSecret() {
  const command = new GetSecretValueCommand({
    SecretId: process.env.SECRET_NAME,
  });
  const response = await secretManagerClient.send(command);
  return JSON.parse(response.SecretString);
}

exports.handler = async (event, context) => {
  // Chỉ chạy khi Cognito gọi tới sau khi user được Confirm
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
    return event;
  }

  const userAttributes = event.request.userAttributes;
  const cognitoSub = userAttributes.sub;
  const email = userAttributes.email;
  const role = "USER"; // Mặc định role

  const secret = await getDbSecret();

  const client = new Client({
    user: secret.username,
    password: secret.password,
    host: secret.host,
    port: secret.port,
    database: secret.dbname,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const insertQuery = `
      INSERT INTO Users (Id, CognitoSub, Email, Role, CreatedAt)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (Email) DO NOTHING;
    `;
    const newUuid = crypto.randomUUID();

    await client.query(insertQuery, [newUuid, cognitoSub, email, role]);
    console.log("Successfully inserted user into RDS:", email);
  } catch (err) {
    console.error("Error inserting into RDS:", err);
    throw err; // Cẩn trọng: Nếu throw err, một số flow cognito có thể bị gián đoạn.
  } finally {
    await client.end();
  }

  // Bắt buộc phải return lại event cho Cognito
  return event;
};
```

_Lưu ý:_ Cần chạy `npm init -y` và `npm install pg @aws-sdk/client-secrets-manager` trong folder này, sau đó zip lại.

### Bước 2: Tạo `lambda_cognito_sync.tf`

Trong thư mục `iac/`, tạo file `lambda_cognito_sync.tf` để định nghĩa Lambda và IAM Role.

```hcl
# 1. IAM Role cho Lambda
resource "aws_iam_role" "cognito_post_confirmation_role" {
  name = "${var.project_name}-cognito-sync-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# 2. Các quyền cần thiết (CW Logs, VPC Access, SecretsManager)
resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
  role       = aws_iam_role.cognito_post_confirmation_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy" "lambda_secrets_access" {
  name = "allow-read-rds-secret"
  role = aws_iam_role.cognito_post_confirmation_role.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = ["secretsmanager:GetSecretValue"]
      Effect = "Allow"
      Resource = aws_secretsmanager_secret.rds.arn
    },
    {
      Action = ["kms:Decrypt"]
      Effect = "Allow"
      Resource = aws_kms_key.secrets.arn
    }]
  })
}

# 3. Tạo file ZIP code
data "archive_file" "cognito_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/cognito_post_confirmation"
  output_path = "${path.module}/../lambda/cognito_post_confirmation.zip"
}

# 4. Định nghĩa Lambda Function
resource "aws_lambda_function" "cognito_post_confirmation" {
  filename         = data.archive_file.cognito_lambda_zip.output_path
  source_code_hash = data.archive_file.cognito_lambda_zip.output_base64sha256
  function_name    = "${var.project_name}-cognito-to-rds-sync"
  role             = aws_iam_role.cognito_post_confirmation_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 10

  # Quan trọng: Lambda cần nằm trong Private Subnet để thấy RDS
  vpc_config {
    subnet_ids         = aws_subnet.private_db[*].id # Từ vpc.tf của bạn
    security_group_ids = [aws_security_group.lambda_rds_sg.id] # Tạo SG mới
  }

  environment {
    variables = {
      SECRET_NAME = aws_secretsmanager_secret.rds.name
    }
  }
}

# 5. Security Group cho Lambda
resource "aws_security_group" "lambda_rds_sg" {
  name        = "${var.project_name}-lambda-rds-sg"
  description = "Security group for Cognito Sync Lambda to access RDS"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 6. Cho phép Lambda gọi vào RDS
resource "aws_security_group_rule" "rds_allow_lambda" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds.id # Từ rds.tf
  source_security_group_id = aws_security_group.lambda_rds_sg.id
}
```

### Bước 3: Cập nhật `cognito.tf` để gài Trigger

Mở file `iac/cognito.tf` và cập nhật `aws_cognito_user_pool` hiện tại:

```hcl
# Trong block resource "aws_cognito_user_pool" "smarthire_pool" của bạn, thêm:

  lambda_config {
    post_confirmation = aws_lambda_function.cognito_post_confirmation.arn
  }
```

Và thêm Permission cho phép Cognito gọi Lambda:

```hcl
# Cho phép Cognito User Pool invoke Lambda này
resource "aws_lambda_permission" "allow_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_post_confirmation.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.smarthire_pool.arn
}
```

### Bước 4: Deploy

1. Viết Node.js code và chạy `npm install` trong thư mục `lambda`.
2. Chạy `terraform plan` để kiểm tra.
3. Chạy `terraform apply` để triển khai Lambda, IAM Roles và gài trigger vào Cognito.

---

Khi mọi thứ đã được deploy, hãy tạo một user thử nghiệm trên giao diện/CLI của Cognito, xác thực email và kiểm tra trong bảng `Users` trên RDS xem dữ liệu có được insert tự động không.
