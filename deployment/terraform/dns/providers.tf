provider "google" {
  project     = var.dns_project_id
  region      = var.region
  credentials = (var.credentials_file == null || trimspace(var.credentials_file) == "") ? null : file(var.credentials_file)
}
