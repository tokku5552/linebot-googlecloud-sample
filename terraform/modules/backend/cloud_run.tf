resource "google_cloud_run_v2_service" "line-bot" {
  project  = var.project_id
  name     = "linebot-googlecloud-sample"
  location = var.region

  template {
    containers {
      # TODO: CloudBuild で指定した image に変更する
      image = "${var.region}-docker.pkg.dev/${var.project_id}/cloud-run-source-deploy/linebot-dev:latest"
    }

    scaling {
      min_instance_count = var.cloud_run_min_instance_count
      max_instance_count = var.cloud_run_max_instance_count
    }
    service_account = google_service_account.line_bot_cloud_run.email
  }
}

resource "google_service_account" "line_bot_cloud_run" {
  account_id   = "line-bot-cloud-run"
  display_name = "Line Bot Cloud Run Service Account"
  project      = var.project_id
}
