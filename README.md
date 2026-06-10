# Via Fluvial - Landing Page (sobre.viafluvial.com.br)

Landing page React/Vite da Via Fluvial com fluxo de build em GitHub Actions e deploy de stack no cluster Docker Swarm `application` via Ansible + Portainer API.

## Arquitetura de deploy

- Fonte: este repositório
- Build de imagem: GitHub Actions
- Registro de imagem: DockerHub (`docker.io/viafluvial`)
- Orquestração: Portainer no cluster `application`
- Proxy/SSL: Traefik (rede `service-public`)
- DNS: Google Cloud DNS via Terraform

Dominios da aplicacao:

- `sobre.viafluvial.com.br`
- `www.sobre.viafluvial.com.br`

Portainer alvo:

- `https://portainer.application.plataforma.prd.viafluvial.com.br`

IP identificado para inventario Ansible (`application`):

- `8.232.27.179`

## Estrutura adicionada para operacao

- `deployment/ansible`: inventario, playbook e template da stack
- `deployment/portainer`: stack base para uso manual no Portainer
- `deployment/terraform/dns`: IaC para DNS no Google Cloud
- `.github/workflows/deploy.yml`: CI/CD com build, DNS e deploy da stack

## Requisitos

- Node.js 20+
- Docker + Docker Compose
- Ansible 2.17+
- Terraform 1.5+
- Acesso SSH ao manager do cluster `application`
- API key do Portainer (endpoint `application-prd`)
- Permissoes GCP para gerenciar Cloud DNS

## Operacao local

### Build e execucao local

```bash
make install
make compose-prod
```

Aplicacao local: `http://localhost:8081`

### Comandos principais

```bash
make help
make compose-dev
make compose-prod
make compose-down
make docker-build
make ci
```

## Deploy com Ansible (Portainer)

1. Garanta chave SSH em `~/.ssh/gcp-swarm-vfa`.
2. Garanta `PORTAINER_API_KEY` no ambiente.
3. Informe a imagem publicada no DockerHub.

Exemplo:

```bash
PORTAINER_API_KEY='<api_key>' \
APP_IMAGE='docker.io/viafluvial/via-fluvial-lp:<tag>' \
make ansible-deploy
```

Playbook usado:

- `deployment/ansible/playbooks/deploy-portainer-stack.yml`

Inventario alvo:

- `deployment/ansible/inventories/application-prd.ini`

## Terraform DNS (Google Cloud)

Diretorio:

- `deployment/terraform/dns`

Exemplo local:

```bash
cd deployment/terraform/dns
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

Ou via Makefile:

```bash
GCP_DNS_PROJECT_ID='vfa-dns-core' make tf-dns-init
GCP_DNS_PROJECT_ID='vfa-dns-core' APPLICATION_CLUSTER_IP='8.232.27.179' make tf-dns-plan
GCP_DNS_PROJECT_ID='vfa-dns-core' APPLICATION_CLUSTER_IP='8.232.27.179' make tf-dns-apply
```

## CI/CD no GitHub

### Workflow de CI

- `.github/workflows/ci.yml`
- Executa em push/PR
- Em push na `main`, valida build e publica imagem Docker no DockerHub

### Workflow de deploy

- `.github/workflows/deploy.yml`
- Execucao manual (`workflow_dispatch`) para evitar deploy involuntario e build duplicado
- Fluxo:
  1. Build/push da imagem
  2. Terraform apply de DNS
  3. Deploy da stack via Ansible + Portainer API

Secrets esperados:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `PORTAINER_APPLICATION_API_KEY`
- `ANSIBLE_SSH_PRIVATE_KEY`
- `GCP_SA_KEY_JSON` (ou WIF via `GCP_WIF_PROVIDER` e `GCP_WIF_SERVICE_ACCOUNT`)
- `GCP_DNS_PROJECT_ID`
- `GCP_DNS_ZONE_NAME`

Variables recomendadas:

- `APPLICATION_CLUSTER_IP` (default usado: `8.232.27.179`)

Defaults preenchidos automaticamente com base nos zips de referencia:

- `dns_project_id`: `vfa-dns-core`
- `dns_zone_name`: `zona-dns-viafluvial-com-br`
- `workload_identity_provider`: `projects/365800925236/locations/global/workloadIdentityPools/via-fluvial-pool/providers/github-provider`
- `workload_identity_service_account`: `via-fluvial-tf@infra-control-automation.iam.gserviceaccount.com`

Fallbacks implementados no workflow de deploy:

- Se `GCP_SA_KEY_JSON` nao estiver definido, o pipeline tenta usar `credentials/sa.json` do repositorio.
- Se `ANSIBLE_SSH_PRIVATE_KEY` nao estiver definido, o pipeline tenta extrair a chave de `modelos/via-fluvial-cluster-warm.zip`.

## Referencias de modelagem usadas

A estrutura de deploy foi baseada nos modelos fornecidos em `modelos/`:

- `via-fluvial-gcp-foundation.zip`
- `via-fluvial-cluster-warm.zip`
- `via-fluvial-gravitee-apim.zip`
- `via-fluvial-services.zip`

## Documentacao funcional e historica

Documentos complementares permanecem em `docs/` e scripts SQL em `sql/`.
