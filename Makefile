SHELL := /bin/bash
.DEFAULT_GOAL := help

PROJECT_NAME := via-fluvial-lp
IMAGE_NAME := $(PROJECT_NAME)
IMAGE_TAG ?= latest
CONTAINER_NAME := $(PROJECT_NAME)-web
PORT ?= 8081
ANSIBLE_DIR := deployment/ansible
TF_DNS_DIR := deployment/terraform/dns
PORTAINER_URL ?= https://portainer.application.plataforma.prd.viafluvial.com.br
PORTAINER_ENDPOINT_NAME ?= application
APP_IMAGE ?= via-fluvial-lp:latest
ifneq ($(DOCKERHUB_USERNAME),)
APP_IMAGE := docker.io/$(DOCKERHUB_USERNAME)/$(PROJECT_NAME):latest
endif
APPLICATION_CLUSTER_IP ?= 8.232.27.179

.PHONY: help install dev build preview clean docker-build docker-run docker-stop docker-logs compose-prod compose-dev compose-down compose-up compose-dev-up compose-dev-down ci ansible-ping ansible-deploy tf-dns-init tf-dns-plan tf-dns-apply resolve-application-ip deploy-prd

help: ## Lista os comandos disponiveis
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "%-20s %s\n", $$1, $$2}'

install: ## Instala dependencias do projeto
	npm install --legacy-peer-deps

dev: ## Roda o Vite localmente na porta $(PORT)
	npm run dev -- --host 0.0.0.0 --port $(PORT)

build: ## Gera build de producao
	npm run build

preview: ## Faz preview da build na porta $(PORT)
	npm run build && npx vite preview --host 0.0.0.0 --port $(PORT)

clean: ## Remove artefatos de build
	rm -rf dist

docker-build: ## Builda a imagem Docker de producao
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

docker-run: ## Roda container Docker local na porta $(PORT)
	docker run --rm -d --name $(CONTAINER_NAME) -p $(PORT):80 $(IMAGE_NAME):$(IMAGE_TAG)

docker-stop: ## Para e remove container Docker local
	-docker stop $(CONTAINER_NAME)


docker-logs: ## Exibe logs do container Docker local
	docker logs -f $(CONTAINER_NAME)

compose-prod: ## Sobe stack de producao no Docker Compose (porta 8081)
	docker compose up --build -d web

compose-down: ## Derruba stack de producao no Docker Compose
	docker compose down

compose-dev: ## Sobe stack de desenvolvimento no Docker Compose (porta 8081)
	docker compose --profile dev up --build -d web-dev

compose-dev-down: ## Derruba stack de desenvolvimento no Docker Compose
	docker compose --profile dev down

compose-up: ## Alias legado para compose-prod
	@$(MAKE) compose-prod

compose-dev-up: ## Alias legado para compose-dev
	@$(MAKE) compose-dev

ci: ## Executa pipeline local basica (install + build)
	npm install --legacy-peer-deps
	npm run build

resolve-application-ip: ## Resolve o IP do cluster application via DNS
	./deployment/scripts/resolve-application-ip.sh

ansible-ping: ## Testa conectividade Ansible com o cluster application
	ANSIBLE_CONFIG=$(ANSIBLE_DIR)/ansible.cfg ansible -i $(ANSIBLE_DIR)/inventories/application-prd.ini managers -m ping

ansible-deploy: ## Deploy da stack no Portainer via Ansible
	@test -n "$(PORTAINER_API_KEY)" || (echo "PORTAINER_API_KEY nao definido" && exit 1)
	ANSIBLE_CONFIG=$(ANSIBLE_DIR)/ansible.cfg ansible-playbook -i $(ANSIBLE_DIR)/inventories/application-prd.ini $(ANSIBLE_DIR)/playbooks/deploy-portainer-stack.yml -e @$(ANSIBLE_DIR)/group_vars/application-prd.yml -e "app_image=$(APP_IMAGE)" -e "portainer_api_key=$(PORTAINER_API_KEY)" -e "portainer_url=$(PORTAINER_URL)" -e "portainer_endpoint_name=$(PORTAINER_ENDPOINT_NAME)"

tf-dns-init: ## Inicializa Terraform do DNS no GCP
	cd $(TF_DNS_DIR) && terraform init

validate-gcp-auth: ## Valida autenticacao GCP para Terraform DNS (ADC ou arquivo JSON)
	@CRED_FILE="$(or $(GCP_CREDENTIALS_FILE),$(GOOGLE_APPLICATION_CREDENTIALS))"; \
	if [[ -n "$$CRED_FILE" ]]; then \
		if [[ -f "$$CRED_FILE" ]]; then \
			:; \
		elif [[ "$$CRED_FILE" == /* && -f ".$$CRED_FILE" ]]; then \
			echo "Aviso: usando credencial local .$${CRED_FILE} (ajuste seu export para caminho relativo ao projeto)."; \
		else \
			echo "Arquivo de credencial GCP inexistente: $$CRED_FILE"; \
			echo "Exemplo valido neste projeto: export GOOGLE_APPLICATION_CREDENTIALS=credentials/sa.json"; \
			exit 1; \
		fi; \
	elif gcloud auth application-default print-access-token >/dev/null 2>&1; then \
		:; \
	else \
		echo "Sem credenciais GCP para Terraform."; \
		echo "Use uma das opcoes:"; \
		echo "1) export GOOGLE_APPLICATION_CREDENTIALS=/caminho/sa.json"; \
		echo "2) export GCP_CREDENTIALS_FILE=/caminho/sa.json"; \
		echo "3) gcloud auth application-default login"; \
		exit 1; \
	fi

tf-dns-plan: ## Gera plano Terraform de DNS (requer GCP_DNS_PROJECT_ID)
	@test -n "$(GCP_DNS_PROJECT_ID)" || (echo "GCP_DNS_PROJECT_ID nao definido" && exit 1)
	@$(MAKE) validate-gcp-auth
	@CRED_FILE="$(or $(GCP_CREDENTIALS_FILE),$(GOOGLE_APPLICATION_CREDENTIALS))"; \
	if [[ "$$CRED_FILE" == /* && -f ".$$CRED_FILE" ]]; then CRED_FILE=".$$CRED_FILE"; fi; \
	if [[ -n "$$CRED_FILE" && "$$CRED_FILE" != /* ]]; then CRED_FILE="$(PWD)/$$CRED_FILE"; fi; \
	cd $(TF_DNS_DIR) && terraform plan -var="dns_project_id=$(GCP_DNS_PROJECT_ID)" -var="dns_zone_name=$(or $(GCP_DNS_ZONE_NAME),zona-dns-viafluvial-com-br)" -var="application_lb_ip=$(APPLICATION_CLUSTER_IP)" -var="credentials_file=$$CRED_FILE"

tf-dns-apply: ## Aplica Terraform de DNS (requer GCP_DNS_PROJECT_ID)
	@test -n "$(GCP_DNS_PROJECT_ID)" || (echo "GCP_DNS_PROJECT_ID nao definido" && exit 1)
	@$(MAKE) validate-gcp-auth
	@CRED_FILE="$(or $(GCP_CREDENTIALS_FILE),$(GOOGLE_APPLICATION_CREDENTIALS))"; \
	if [[ "$$CRED_FILE" == /* && -f ".$$CRED_FILE" ]]; then CRED_FILE=".$$CRED_FILE"; fi; \
	if [[ -n "$$CRED_FILE" && "$$CRED_FILE" != /* ]]; then CRED_FILE="$(PWD)/$$CRED_FILE"; fi; \
	cd $(TF_DNS_DIR) && terraform apply -auto-approve -var="dns_project_id=$(GCP_DNS_PROJECT_ID)" -var="dns_zone_name=$(or $(GCP_DNS_ZONE_NAME),zona-dns-viafluvial-com-br)" -var="application_lb_ip=$(APPLICATION_CLUSTER_IP)" -var="credentials_file=$$CRED_FILE"

deploy-prd: ## Pipeline local de deploy (build + DNS + stack)
	$(MAKE) ci
	$(MAKE) tf-dns-apply
	$(MAKE) ansible-deploy
