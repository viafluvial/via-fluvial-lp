#!/usr/bin/env bash
set -euo pipefail

HOST="${1:-portainer.application.plataforma.prd.viafluvial.com.br}"

if command -v getent >/dev/null 2>&1; then
  getent ahostsv4 "$HOST" | awk '{print $1}' | head -n1
  exit 0
fi

if command -v dig >/dev/null 2>&1; then
  dig +short "$HOST" A | head -n1
  exit 0
fi

if command -v nslookup >/dev/null 2>&1; then
  nslookup "$HOST" | awk '/^Address: /{print $2}' | tail -n1
  exit 0
fi

echo "Nenhuma ferramenta de resolucao DNS encontrada (getent/dig/nslookup)." >&2
exit 1
