module "backend" {
  source     = "../../modules/backend"
  project_id = var.project_id
  region     = var.region

  cloud_run_min_instance_count = 1
  cloud_run_max_instance_count = 1

}

