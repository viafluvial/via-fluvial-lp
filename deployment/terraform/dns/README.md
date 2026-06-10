# Terraform DNS - sobre.viafluvial.com.br

Este modulo cria/atualiza os registros DNS no Google Cloud DNS para:

- sobre.viafluvial.com.br
- www.sobre.viafluvial.com.br

## Uso local

```bash
cd deployment/terraform/dns
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

## Variaveis importantes

- dns_project_id: projeto GCP da zona DNS (ex.: vfa-dns-core)
- dns_zone_name: nome da managed zone (ex.: zona-dns-viafluvial-com-br)
- application_lb_ip: IP publico do cluster application

## Estado

Use backend remoto para ambientes compartilhados. O arquivo de exemplo usa estado local apenas para bootstrap.
