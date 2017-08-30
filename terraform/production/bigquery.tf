terraform {
  backend "s3" {
    bucket = "button-terraform-state"
    key    = "env:/production/service/kokiri"
    region = "us-west-2"
    encrypt = true
  }
}

module "kokiri_bigquery_production" {
  source = "../modules"
  environment = "production"
}
