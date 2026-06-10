# Ansible Deploy - Portainer + Traefik (cluster application)

Este diretório faz o deploy da stack da landing page no Portainer do cluster application:

- Portainer: https://portainer.application.plataforma.prd.viafluvial.com.br
- Dominio: sobre.viafluvial.com.br e www.sobre.viafluvial.com.br
- Inventario default: 8.232.27.179

## Pre-requisitos

- Ansible instalado
- Acesso SSH no manager do cluster
- API key do Portainer (endpoint application-prd)

## Comando

```bash
cd deployment/ansible
ansible-playbook playbooks/deploy-portainer-stack.yml \
  -e "app_image=docker.io/viafluvial/via-fluvial-lp:<tag>" \
  -e "portainer_api_key=<sua_api_key>"
```

## Observacoes

- O playbook cria/atualiza stack no Portainer via API.
- A stack usa Traefik na rede externa service-public.
- Para mudar IP do manager, ajuste inventories/application-prd.ini.
