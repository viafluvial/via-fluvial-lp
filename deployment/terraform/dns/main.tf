resource "google_dns_record_set" "sobre_root" {
  managed_zone = var.dns_zone_name
  name         = var.domain_primary
  type         = "A"
  ttl          = var.record_ttl
  rrdatas      = [var.application_lb_ip]
}

resource "google_dns_record_set" "sobre_www" {
  managed_zone = var.dns_zone_name
  name         = var.domain_www
  type         = "A"
  ttl          = var.record_ttl
  rrdatas      = [var.application_lb_ip]
}
