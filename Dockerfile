# syntax=docker/dockerfile:1.7
# Site de apresentação da Via Fluvial (Astro, saída estática) servido pelo nginx.
#   docker build --target runtime --build-arg APP_BUILD_ID=$(git rev-parse --short HEAD) -t via-fluvial-lp:local .

FROM node:22-alpine AS build
ARG APP_BUILD_ID=local
ARG APP_VERSION=dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build \
 && printf '{"buildId":"%s","version":"%s"}\n' "${APP_BUILD_ID}" "${APP_VERSION}" > dist/version.json

FROM nginx:1.27-alpine AS runtime
ARG APP_BUILD_ID=local
LABEL org.opencontainers.image.source="https://github.com/viafluvial/via-fluvial-lp" \
      org.opencontainers.image.title="via-fluvial-lp" \
      org.opencontainers.image.revision="${APP_BUILD_ID}"

# O nginx troca só estas variáveis nos modelos de /etc/nginx/templates (as do próprio nginx ficam intactas).
ENV NGINX_ENVSUBST_FILTER="^(VIA_FLUVIAL_|PLATFORM_STATS_)" \
    VIA_FLUVIAL_API_ADMINISTRACAO_BACKEND_URL="https://api-administracao.api.plataforma.prd.viafluvial.com.br/api/v1" \
    VIA_FLUVIAL_API_NOTIFICACOES_BACKEND_URL="https://api-notificacoes.api.plataforma.prd.viafluvial.com.br/api/v1" \
    VIA_FLUVIAL_API_RESERVAS_BACKEND_URL="https://api-reservas.api.plataforma.prd.viafluvial.com.br/api/v1" \
    PLATFORM_STATS_ENABLED="false"

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1
