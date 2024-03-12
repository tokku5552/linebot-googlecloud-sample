terraform {
  backend "gcs" {
    bucket = "linedc-handson-terraform-state" // your gcs bucket name
    prefix = "setup"                          // your gcs prefix
  }
}