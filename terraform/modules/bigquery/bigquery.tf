resource "google_bigquery_dataset" "linebot_sample_dataset" {
  access {
    role          = "OWNER"
    special_group = "projectOwners"
  }

  access {
    role          = "READER"
    special_group = "projectReaders"
  }

  access {
    role          = "WRITER"
    special_group = "projectWriters"
  }

  dataset_id                 = "linebot_googlecloud_sample"
  delete_contents_on_destroy = false
  location                   = var.region
  project                    = var.project_id
}

resource "google_bigquery_table" "text_info" {
  dataset_id  = google_bigquery_dataset.linebot_sample_dataset.dataset_id
  project     = var.project_id
  table_id    = "message_logs"
  schema      = file("${path.module}/schema/message_logs.json")
  description = "message_logs のテーブル"

  depends_on = [
    google_bigquery_dataset.linebot_sample_dataset
  ]
}
