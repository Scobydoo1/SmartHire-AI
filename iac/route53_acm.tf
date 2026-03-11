# ============================================
# Route 53 & ACM Certificate
# ============================================

variable "domain_name" {
  type        = string
  description = "The primary domain name for the frontend (e.g., example.com)"
  default     = "smarthire-ai.org" # Thêm domain thực tế của bạn
}

# 1. Look up existing Route 53 Hosted Zone
data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}

# 2. Request an ACM Certificate in us-east-1 for CloudFront
resource "aws_acm_certificate" "frontend_cert" {
  provider                  = aws.us_east_1 # CloudFront certificates MUST be in us-east-1
  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  tags = merge(local.common_tags, {
    Name    = "${var.project_name}-frontend-cert-${var.environment}"
    Service = "Frontend"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# 3. Create DNS validation records in Route 53
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.frontend_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

# 4. Validate the ACM Certificate
resource "aws_acm_certificate_validation" "frontend_cert" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.frontend_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# 5. Create Alias Record pointing to CloudFront
resource "aws_route53_record" "frontend_a_record" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "frontend_www_a_record" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}
