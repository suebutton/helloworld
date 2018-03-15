terraform {
  backend "s3" {
    bucket  = "button-terraform-state"
    key     = "env:/production/service/kokiri"
    region  = "us-west-2"
    encrypt = true
  }
}

provider "aws" {
  region = "us-west-2"
}

module "kokiri_production" {
  source      = "../modules"
  environment = "production"
}

# Kokiri's Staging and Production redis setups have two entirely different
# descriptions under Terraform, so we define them in root instead of our handy
# cross-env module.
resource "aws_elasticache_replication_group" "kokiri" {
  replication_group_id          = "kokiri-prod"
  replication_group_description = " "
  node_type                     = "cache.m3.large"
  port                          = 6379
  automatic_failover_enabled    = "true"
  snapshot_retention_limit      = "1"
}
