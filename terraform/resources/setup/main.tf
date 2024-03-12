resource "google_storage_bucket" "terraform_state" {
  name     = "linedc-handson-terraform-state" // your gcs bucket name
  location = "ASIA"
  versioning {
    enabled = true
  }
}

