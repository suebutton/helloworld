terraform {
  backend "s3" {
    bucket  = "button-terraform-state"
    key     = "env:/staging/service/kokiri"
    region  = "us-west-2"
    encrypt = true
  }
}

module "kokiri_staging" {
  source      = "../modules"
  environment = "staging"
}
