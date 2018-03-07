provider "google" {
  credentials = "${file(pathexpand("~/.creds/bigquery-terraform.json"))}"
  project     = "btn-dlc"
  region      = "us"
}

provider "aws" {
  region = "us-west-2"
}
