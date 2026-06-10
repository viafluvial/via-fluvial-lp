output "dns_records" {
  value = {
    sobre = google_dns_record_set.sobre_root.name
    www   = google_dns_record_set.sobre_www.name
  }
}

output "dns_target_ip" {
  value = var.application_lb_ip
}
