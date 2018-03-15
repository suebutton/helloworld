terraform {
  backend "s3" {
    bucket  = "button-terraform-state"
    key     = "env:/staging/service/kokiri"
    region  = "us-west-2"
    encrypt = true
  }
}

provider "aws" {
  region = "us-west-2"
}

module "kokiri_staging" {
  source      = "../modules"
  environment = "staging"
}

# Kokiri's Staging and Production redis setups have two entirely different
# descriptions under Terraform, so we define them in root instead of our handy
# cross-env module.
resource "aws_elasticache_cluster" "kokiri" {
  cluster_id           = "kokiri-staging"
  engine               = "redis"
  node_type            = "cache.t2.small"
  port                 = 6379
  engine_version       = "2.8.24"
  num_cache_nodes      = 1
  parameter_group_name = "lru-cache"
  subnet_group_name    = "internal-subnet"
}
