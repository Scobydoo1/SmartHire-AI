terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Uncomment the following to use remote state (S3 + DynamoDB for locking)
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "smarthire/terraform.tfstate"
  #   region         = "ap-southeast-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region
}
