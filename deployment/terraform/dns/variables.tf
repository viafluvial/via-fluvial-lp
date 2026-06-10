variable "dns_project_id" {
  description = "Projeto GCP que hospeda a zona Cloud DNS"
  type        = string
}

variable "region" {
  description = "Regiao padrao do provider"
  type        = string
  default     = "us-central1"
}

variable "credentials_file" {
  description = "Arquivo de credencial SA JSON (opcional, null usa ADC)"
  type        = string
  default     = null
}

variable "dns_zone_name" {
  description = "Nome da zona DNS existente no Cloud DNS"
  type        = string
  default     = "zona-dns-viafluvial-com-br"
}

variable "record_ttl" {
  description = "TTL dos registros"
  type        = number
  default     = 300
}

variable "application_lb_ip" {
  description = "IP publico do cluster application"
  type        = string
}

variable "domain_primary" {
  description = "Dominio principal da landing page"
  type        = string
  default     = "sobre.viafluvial.com.br."
}

variable "domain_www" {
  description = "Dominio WWW da landing page"
  type        = string
  default     = "www.sobre.viafluvial.com.br."
}
