# Via Fluvial - site de apresentação (sobre.viafluvial.com.br)

Página de apresentação da plataforma Via Fluvial: quem somos, o que oferecemos, por que confiar e por que ser parceiro.
Não vende passagem nem ensina a usar (isso fica no app e no portal de ajuda). A especificação aprovada está em
`.project/proposta-landing-sobre.md` e o conteúdo inicial em `.project/conteudo-inicial.md`.

## Tecnologia

- **Astro 7** (saída estática) + **Tailwind 4**; ilhas **React** só onde há interação (menu do celular, dock, formulários,
  janela de demonstração e faixa de números da plataforma). Requer **Node 22.23.4 ou mais novo**.
- **Coleções de conteúdo** em `src/content/`: `news` (Markdown), `roadmap` ("O que vem por aí"), `numbers` ("A Amazônia e
  os rios em números", com fonte, ano e endereço exato), `credits` (fotos) e `timeline`.
- **nginx** (`nginx/`) serve o site e faz o proxy dos formulários, para o navegador nunca chamar o backend direto.

## Comandos

```bash
npm ci                 # instala
npm run dev            # desenvolvimento em http://localhost:8081
npm run check          # astro check (tipos)
npm run build          # gera dist/
npm run preview        # serve dist/ em http://127.0.0.1:4321
npm test               # testes de fumaça (Playwright; precisa do build e usa o Chrome instalado)
npm run test:links     # verificador de links internos (lê dist/)
npm run lighthouse     # Lighthouse mobile na home e em duas páginas internas (preview rodando)
npm run assets:brand   # regenera public/og-image.png
```

## Estrutura

```
src/pages/            /, /barqueiros, /transportadores, /parceiros, /demonstracao, /quem-somos, /novidades,
                      /novidades/<slug>, /o-que-vem-por-ai, /contato, /privacidade, /termos, /creditos,
                      /newsletter/confirmada, /newsletter/cancelada, 404
src/components/       Header, Footer, Seo, Photo, mockups, cartões e ilhas React (components/islands)
src/content/          notícias, roteiro, números, créditos e linha do tempo
src/data/             links, contatos e navegação (site.ts), missão/visão/valores (institutional.ts)
src/assets/           fotos licenciadas e telas do produto (otimizadas no build para AVIF/WebP)
public/               ícones da marca, manifesto, robots.txt, imagem Open Graph, runtime-config.json
nginx/                modelo do nginx (envsubst) e cabeçalhos de segurança
tests/e2e/            testes Playwright
scripts/              verificador de links, Lighthouse, capturas de tela, geração da imagem OG
deployment/           stack do Portainer, Ansible, Terraform do DNS (inalterados, exceto as variáveis novas)
```

## Conteúdo

- **Notícia nova:** crie `src/content/news/<slug>.md` (título, resumo, tipo, data, imagem e links). Ela entra na lista,
  no sitemap e na home (as três mais recentes).
- **O que vem por aí:** edite `src/content/roadmap/items.yaml` (coluna `agora`, `em-seguida` ou `mais-adiante`). Quando
  um item é lançado, remova-o e publique uma notícia.
- **Números:** edite `src/content/numbers/indicators.json`. Nenhum número entra sem fonte, ano e endereço exato da
  publicação; revise uma vez por ano.
- **Fotos:** só com licença livre (CC0, CC BY, CC BY-SA), com autor, licença e origem em `src/content/credits/photos.json`.
- **Redes sociais:** preencha as URLs em `src/data/site.ts` (`SOCIAL`); os ícones só aparecem no rodapé quando há endereço.
- Textos em português, com hífen "-" (nunca travessão longo). A estrutura está pronta para i18n (inglês e espanhol depois).

## Formulários e proxy do nginx

O navegador chama apenas caminhos do próprio site; o nginx encaminha para a plataforma:

| Caminho do site | Método | Backend (variável) |
|---|---|---|
| `/api/administracao/public/contact-requests` | POST | `VIA_FLUVIAL_API_ADMINISTRACAO_BACKEND_URL` + `/public/contact-requests` |
| `/api/notificacoes/public/newsletter/subscriptions` | POST | `VIA_FLUVIAL_API_NOTIFICACOES_BACKEND_URL` + `/public/newsletter/subscriptions` |
| `/api/reservas/public/stats/summary` | GET | `VIA_FLUVIAL_API_RESERVAS_BACKEND_URL` + `/public/stats/summary` (cache de 10 min) |

Qualquer outro caminho em `/api/` responde 404. Há limite de envios (10 por minuto por IP, com rajada de 5) e corpo
máximo de 16 KB. Em qualquer falha, a página mostra uma mensagem amigável com o WhatsApp e o e-mail.

Variáveis de ambiente do contêiner (valores de produção são o padrão da imagem):

| Variável | Padrão |
|---|---|
| `VIA_FLUVIAL_API_ADMINISTRACAO_BACKEND_URL` | `https://api-administracao.api.plataforma.prd.viafluvial.com.br/api/v1` |
| `VIA_FLUVIAL_API_NOTIFICACOES_BACKEND_URL` | `https://api-notificacoes.api.plataforma.prd.viafluvial.com.br/api/v1` |
| `VIA_FLUVIAL_API_RESERVAS_BACKEND_URL` | `https://api-reservas.api.plataforma.prd.viafluvial.com.br/api/v1` |
| `PLATFORM_STATS_ENABLED` | `false` |

**Números da plataforma (5.9):** com `PLATFORM_STATS_ENABLED=true`, o navegador lê `/runtime-config.json` (gerado pelo nginx
na partida do contêiner) e busca `/api/reservas/public/stats/summary`. Cada número só aparece se passar do mínimo
(passageiros transportados 1.000, reservas confirmadas 500); senão a faixa mostra "Em operação nas rotas do Amazonas".
Ligue só depois do lançamento oficial. Mudar a variável e reiniciar o serviço basta, sem nova publicação do código.

## Docker e publicação

```bash
docker build --target runtime --build-arg APP_BUILD_ID=$(git rev-parse --short HEAD) -t via-fluvial-lp:local .
docker run --rm -p 8081:80 via-fluvial-lp:local      # http://localhost:8081  (healthcheck em /healthz)
```

A imagem grava `/version.json` (`APP_BUILD_ID`, `APP_VERSION`). A publicação continua pelo GitHub Actions (`deploy.yml`:
imagem no Docker Hub e stack no Portainer com Traefik) em sobre.viafluvial.com.br e www.sobre.viafluvial.com.br. A
stack (`deployment/portainer/stack.sobre.yml`) e o `stack.env.example` trazem as variáveis acima.
O CI (`ci.yml`) roda `npm ci`, `astro check`, build, testes Playwright e o verificador de links.
