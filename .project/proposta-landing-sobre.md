# sobre.viafluvial.com.br - especificação da página de apresentação

Versão 2 - consolidada após as conversas sobre escopo, não redundância e conteúdo institucional.
Projeto: `via-fluvial-lp` (o site atual será substituído).

---

## 1. Resumo

O sobre.viafluvial.com.br passa a ser a **página de apresentação da plataforma Via Fluvial**: quem somos, o que
oferecemos, por que confiar e por que ser parceiro. Não vende passagem nem ensina a usar. Isso continua no app e no portal
de conhecimento. Cada parte da página termina com um botão que leva ao lugar certo.

O que entra, em uma frase por grupo:

- **Apresentação do produto:** o problema, a solução e os dois negócios (passageiros; cargas e encomendas), em linguagem
  de venda.
- **Parceiros:** páginas de convencimento para barqueiros, transportadores, agências e empresas, com **agendamento de
  demonstração**.
- **Institucional:** missão, visão e valores; quem somos e nossa história; **a Amazônia e os rios em
  números**.
- **Novidades:** **notícias da plataforma**, **newsletter** e **o que vem por aí**.
- **Investidores e poder público:** seção curta com contato.

---

## 2. Papel de cada site (regra de não redundância)

| Site | Papel | Exemplos |
|---|---|---|
| **viafluvial.com.br** (app de passageiros) | Comprar, viajar, operar | Busca de viagens, v.IA, destinos em destaque, saindo hoje, menor preço, viagem em grupo, Minhas Viagens, áreas do barqueiro e da agência |
| **viafluvial.com.br/cargas** (app de cargas) | Enviar, receber, transportar | Cotação, fretamento, rastreio, retirada, área do transportador e operação no porto |
| **docs.viafluvial.com.br** (portal de conhecimento) | Ensinar a usar | Tutoriais, ajuda, telas explicadas, regras, apresentações por público |
| **sobre.viafluvial.com.br** (esta página) | Apresentar e convencer | Quem somos, propósito, benefícios, parceiros, demonstração, novidades, contato institucional |

**Não entra no sobre**, porque já existe no app ou no docs:

- busca de viagens ou cotação de frete embutidas;
- listas vivas de viagens (saindo hoje, menor preço da semana) e carrossel de destinos com saídas;
- demonstração interativa da v.IA;
- formulário de viagem em grupo;
- passo a passo de uso (fica no docs, com link);
- material detalhado para investidores (fica na versão interna do docs).

---

## 3. Públicos e objetivos

| Público | Objetivo da página | Ação principal |
|---|---|---|
| Passageiro que ainda não conhece | Entender e confiar | **Abrir o app** (viafluvial.com.br) |
| Quem envia ou recebe carga | Entender e confiar | **Abrir o app de cargas** (/cargas) |
| Barqueiro e operador | Querer entrar | **Cadastrar minha embarcação** (app) ou **Agendar demonstração** |
| Transportador de cargas | Querer entrar | **Ativar transporte de cargas** (/cargas) ou **Agendar demonstração** |
| Agência e empresa | Avaliar parceria | **Agendar demonstração** |
| Investidor e poder público | Conhecer e conversar | **Fale conosco** |
| Imprensa e público em geral | Conhecer a empresa | Quem somos, notícias, newsletter |

---

## 4. Mapa do site

```
/                          Página principal
/barqueiros                Para donos de embarcação e operadores
/transportadores           Para quem transporta cargas
/parceiros                 Agências, empresas, investidores e poder público
/demonstracao              Agendar uma demonstração (também abre como janela a partir dos botões)
/quem-somos                Missão, visão, valores, história, linha do tempo, Amazônia em números
/novidades                 Notícias da plataforma (lista)
/novidades/<slug>          Notícia
/o-que-vem-por-ai          Roteiro público
/contato                   Canais e formulário
/privacidade  /termos      Páginas legais
```

---

## 5. Página principal

Ordem das seções, com objetivo, conteúdo e ação de cada uma.

### 5.1 Cabeçalho
- Logo oficial; links: Passageiros (âncora), Cargas e encomendas (âncora), Para parceiros, Quem somos, Novidades.
- Botões: **Acessar a plataforma** (amarelo, abre viafluvial.com.br) e **Agendar demonstração** (contorno).
- No celular: menu ≡, como nos apps.

### 5.2 Abertura
- Título sugerido: "O transporte fluvial da Amazônia, conectado."
- Subtítulo: "Passagens, cargas e encomendas pelos rios, com pagamento seguro, bilhete digital e acompanhamento - para
  quem viaja, quem envia e quem trabalha no rio."
- Botões: **Viajar ou enviar** (abre o app) e **Sou parceiro** (vai para as seções de parceiros).
- Fundo: vídeo curto ou foto real de barco regional (vídeo só carrega em boa conexão).

### 5.3 O problema
Quatro cartões com as dores reais:
- passagem comprada só no porto;
- horário incerto;
- encomenda sem rastreio;
- barqueiro vendendo no papel.

### 5.4 A Amazônia e os rios em números
- Quatro a seis indicadores que mostram o tamanho do desafio:
  - extensão da malha navegável;
  - municípios que dependem do transporte fluvial ou que não têm acesso por estrada;
  - população atendida pelos rios;
  - passageiros e cargas transportados por ano na região.
- **Cada número com fonte e ano visíveis** (por exemplo IBGE, ANTAQ e Ministério dos Transportes), com link para a
  publicação original.
- Os valores serão levantados e conferidos na produção do conteúdo. Nenhum número entra sem fonte.
- Versão completa em /quem-somos.

### 5.5 A solução: dois negócios, uma plataforma
Dois blocos lado a lado, apenas benefícios, sem telas de compra:
- **Viagens de passageiros:** encontrar a viagem, pagar por Pix ou cartão, embarcar com bilhete QR, acompanhar a viagem.
  Botão: **Abrir o app**.
- **Cargas e encomendas:** cotar na hora, frete especial ou fretamento, acompanhar até a retirada, retirada com QR.
  Botão: **Abrir o app de cargas**.

### 5.6 Como funciona (visão geral)
Três passos por negócio, em ícones:
- Viajar: buscar, pagar, embarcar.
- Enviar: cotar, entregar no porto, retirar com QR.

Link "Ver o passo a passo completo" para o docs.

### 5.7 Para quem trabalha no rio
Cartões com o ganho principal de cada público:
- **Barqueiros:** venda online, check-in por QR, controle das passagens, financeiro com saque, vitrine da embarcação.
  Botão para /barqueiros.
- **Transportadores:** tarifas próprias, operações de carga, propostas para cargas especiais, manifesto. Botão para
  /transportadores.
- **Agências:** painel para vender passagens das embarcações parceiras. Botão para /parceiros.
- **Empresas:** fretamento, volume e integração com sistemas. Botão para /parceiros.

### 5.8 Agendar uma demonstração
Faixa de destaque: "Quer ver a plataforma funcionando na sua operação?" Botão **Agendar demonstração** (ver 7.2).

### 5.9 Por que confiar
- Embarcações e barqueiros aprovados.
- Avaliações verificadas de passageiros.
- Pagamento seguro; a reserva só confirma com o pagamento.
- Carga conferida no porto, com fotos.
- Proteção de dados (LGPD).
- Suporte por chat.
- Números da própria plataforma (`/public/stats/summary`), **com regra de mínimo (decidido):**
  - só depois do lançamento oficial (sem o aviso de "ambiente de testes" nos apps), para não publicar reservas de teste;
  - cada número só aparece se passar do mínimo: passageiros transportados 1.000 ou mais; reservas confirmadas 500 ou
    mais;
  - se nenhum passar, a faixa mostra "Em operação nas rotas do Amazonas";
  - liga e desliga por configuração do site (sem nova publicação).

### 5.10 Propósito
Missão em uma frase e os valores em ícones (texto completo em /quem-somos). Botão "Conheça a Via Fluvial".

### 5.11 Novidades
As três notícias mais recentes, mais o link "Ver todas" e o link "O que vem por aí".

### 5.12 Newsletter
"Receba as novidades da Via Fluvial": e-mail, consentimento e confirmação por e-mail (ver 7.3).

### 5.13 Investidores e poder público
Bloco curto: oportunidade, impacto na região e tração (somente dados reais), com o botão **Fale conosco**.

### 5.14 Rodapé
- Links: Acessar a plataforma, App de cargas, Central de Ajuda (docs), Barqueiros, Transportadores, Parceiros, Quem
  somos, Novidades, O que vem por aí, Contato, Privacidade, Termos.
- Contato: contato@viafluvial.com.br e WhatsApp (ver seção 14.1).
- Ícones das redes sociais, só das que já existirem.
- "Via Fluvial é uma plataforma da IntSoft Consultoria em TI LTDA - CNPJ 67.825.379/0001-40".

### 5.15 Dock
O mesmo padrão dos outros projetos: alça amarela, **chat de suporte** (`viafluvial.com.br/?go=chat`), rolagem automática
e os botões subir e descer.

---

## 6. Páginas internas

| Página | Conteúdo | Ações |
|---|---|---|
| **/barqueiros** | Benefícios (mais vendas, controle, recebimento); o que a área do barqueiro oferece (embarcações, viagens, passagens vendidas, check-in por QR, tripulação, financeiro e saques, avaliações, mídias, vitrine pública, agências parceiras); como entrar em 4 passos (visão geral); perguntas comerciais | **Cadastrar minha embarcação** (app), **Agendar demonstração**, "Ver o guia" (docs) |
| **/transportadores** | Benefícios; ativação em 5 etapas (visão geral); tarifas, rotas e políticas, frota e comboios, equipe, operações, cargas especiais, manifesto | **Ativar transporte de cargas** (/cargas), **Agendar demonstração**, "Ver o guia" (docs) |
| **/parceiros** | Agências (painel e venda de passagens); empresas (fretamento, volume, integração por API e webhooks, em linguagem de negócio); **investidores e poder público** (oportunidade, impacto, tração e contato) | **Agendar demonstração**, **Fale conosco** |
| **/quem-somos** | Manifesto; **missão, visão e valores** (seção 8); nossa história e linha do tempo; **a Amazônia e os rios em números** completa, com todas as fontes | **Fale conosco** |
| **/novidades** | Lista de notícias com filtro por tipo (lançamento, nova rota, nova função, institucional) e busca simples | Assinar a newsletter |
| **/novidades/<slug>** | Título, data, imagem, texto, links para o app ou o docs quando fizer sentido, compartilhar (WhatsApp, redes) | Assinar a newsletter |
| **/o-que-vem-por-ai** | Roteiro em três colunas, "Agora", "Em seguida" e "Mais adiante", **sem datas**, com o aviso "planos podem mudar" | Assinar a newsletter |
| **/contato** | Chat de suporte (link), WhatsApp, e-mail institucional, formulário com assunto (parceria, imprensa, investidores, poder público, outro) | Enviar |

---

## 7. Funcionalidades

### 7.1 Formulários (regras gerais)
- Campos mínimos, validação clara, mensagem de sucesso, proteção contra robôs (honeypot e limite de envios).
- Consentimento LGPD explícito, com link para a privacidade. Os registros guardam data e versão do texto aceito.
- Os dados vão para um serviço da plataforma (proposta: api-administracao ou api-suporte), **nunca** para um banco
  acessível pelo navegador.

### 7.2 Agendar uma demonstração e contato institucional
- Campos da demonstração: nome, empresa, tipo (agência, transportadora, barqueiro, empresa, outro), cidade e região,
  telefone ou WhatsApp, e-mail, melhor período, mensagem. O contato tem assunto (parceria, imprensa, investidores, poder
  público, outro) e mensagem.
- **Onde cai (decidido):**
  - os pedidos são gravados na **api-administracao**, no mesmo padrão das solicitações de viagem em grupo, que já
    existem;
  - aparecem numa lista "Solicitações de contato" na Área da Plataforma, com situação (novo, em contato, concluído) e
    responsável;
  - cada pedido novo gera um aviso por e-mail para **contato@viafluvial.com.br**, pela api-notificacoes;
  - quem pediu recebe uma confirmação automática de no-reply@viafluvial.com.br.
- Não entra na Central de Suporte, para não misturar oportunidade comercial com atendimento a clientes.
- Responsável inicial: quem cuida da caixa contato@viafluvial.com.br. Meta de resposta: 1 dia útil.
- Evolução opcional: integração com agenda (escolher o horário direto).

### 7.3 Newsletter de novidades
- Confirmação em duas etapas (double opt-in) e descadastro em um clique em todo e-mail.
- **Como funciona (decidido):**
  - **A lista fica na plataforma:** inscrições, consentimento (data e versão do texto) e descadastro ficam na
    api-notificacoes. A empresa é dona da lista, sem depender de fornecedor.
  - **E-mails de confirmação e de boas-vindas** saem pela api-notificacoes, pelo **Infobip**, que já é usado e já está
    configurado com no-reply@viafluvial.com.br.
  - **As edições da newsletter** (uma por mês, ou quando houver lançamento) também saem pelo Infobip, que
    permite envio em massa com descadastro (confirmado no contrato).
- Substitui a lista "seja o primeiro a saber". O destino dos inscritos antigos está na seção 11.

### 7.4 Notícias da plataforma
- Conteúdo em arquivos (Markdown) no repositório, com título, data, tipo, imagem, resumo e texto, publicados com o site.
- **Quem publica (decidido):**
  - o responsável pelo produto define os assuntos e aprova;
  - a equipe técnica escreve e publica, com revisão antes de ir ao ar, como qualquer mudança no site.
- **Frequência:** uma ou duas notícias por mês, e sempre que houver lançamento ou rota nova.
- Quando alguém sem perfil técnico for publicar, ligar o **Decap CMS**: um painel web gratuito que edita os mesmos
  arquivos, com login pelo GitHub e revisão antes de publicar.
- Cada notícia tem prévia para WhatsApp e redes, e entra no sitemap.
- Feed RSS opcional.

### 7.5 O que vem por aí
- Arquivo de conteúdo com itens (título, descrição curta, coluna, público).
- Sem datas. Mudanças de coluna são revisadas por quem decide o produto.
- **Quem cuida (decidido):** o responsável pelo produto, numa revisão mensal; a equipe técnica publica.
- Quando um item é lançado, sai do roteiro e vira notícia.

### 7.6 A Amazônia e os rios em números
- Arquivo de dados com valor, unidade, descrição, fonte, ano e link de cada indicador.
- A seção mostra a fonte junto de cada número, e a página Quem somos lista todas as fontes.
- Revisão anual dos números.

### 7.7 Medição
- Analytics com aviso de cookies e opção de recusar.
- Eventos:
  - clique em "Acessar a plataforma" e "Abrir o app de cargas";
  - cadastro de barqueiro e ativação de transportador;
  - pedido de demonstração;
  - inscrição na newsletter;
  - contato de investidores e poder público.
- Links para os apps com parâmetros de origem (UTM).

---

## 8. Missão, visão e valores (texto sugerido, para aprovação)

Baseado no texto atual do site, ampliado para incluir cargas e quem trabalha no rio.

- **Missão:** conectar pessoas, cargas e embarcações pelos rios da Amazônia, com uma forma simples, segura e justa de
  viajar, enviar encomendas e trabalhar no transporte fluvial.
- **Visão:** ser a principal plataforma de transporte fluvial da Amazônia, reconhecida pela confiança, pela inclusão das
  comunidades ribeirinhas e por fortalecer quem vive do rio.
- **Valores:**
  - **Respeito à cultura local:** tradição ribeirinha e tecnologia caminhando juntas.
  - **Inclusão:** feito para todos, do primeiro acesso digital ao turista, e funcionando até sem internet no porto.
  - **Confiança e transparência:** preço claro, embarcações verificadas, pagamento seguro e regras visíveis.
  - **Segurança:** de quem viaja, da carga enviada e dos dados de cada pessoa.
  - **Compromisso com a região:** renda para barqueiros e transportadores, desenvolvimento local e cuidado com os rios.
  - **Inovação com propósito:** tecnologia só quando resolve um problema real.

A história e a linha do tempo estão aprovadas em `.project/conteudo-inicial.md` (sem nomes de pessoas).

---

## 9. Identidade e experiência

- **Marca:** logo oficial (o mesmo de docs.viafluvial.com.br/img/logo.svg), verde #1A5F3B e amarelo #F9C74F, tipografia
  dos apps.
- **Favicon e ícones: mesmo padrão dos outros frontends** (app, cargas e portal), todos gerados a partir do logo
  oficial:
  - `favicon.svg` (o próprio logo) e `favicon` PNG 32x32;
  - `apple-touch-icon` 180x180 opaco (sem cantos transparentes, que o iPhone pinta de preto);
  - ícones 192x192 e 512x512 ("any") e 512x512 "maskable" (logo a 80% sobre fundo #1A5F3B);
  - manifest com esses ícones, `theme_color` #1A5F3B e nome "Via Fluvial";
  - nada de ícone próprio ou gerado em código (como a âncora "VFA" que existia no app).
- **Fotos:** reais e próprias sempre que possível. Enquanto não houver, fotos licenciadas com atribuição. Nada de banco
  de imagens genérico.
- **Padrão de navegação:** cabeçalho, menu do celular e dock iguais aos dos apps e do portal.
- **Movimento sutil** ao rolar, respeitando "reduzir movimento".
- **Acessibilidade:** contraste AA, textos alternativos, navegação por teclado, áreas de toque de 44 px, sem depender de
  atalhos de teclado.
- **Celular primeiro.** Página leve para internet fraca.

---

## 10. Técnica

- **Refazer o projeto em Astro.** Páginas estáticas muito rápidas e ótimas para SEO; notícias, roteiro e números como
  coleções de conteúdo; pequenas partes interativas (formulários, dock, menu) como componentes React.
- **Integração com a plataforma:**
  - os formulários enviam para um endpoint da plataforma, por um proxy do próprio site, como os apps fazem com
    `backend-api-proxy`;
  - os números opcionais da seção 5.9 vêm de `/public/stats/summary`, com cache, e a seção some se não houver resposta.
- **SEO:**
  - título e descrição por página;
  - dados estruturados (Organization, NewsArticle nas notícias, FAQPage);
  - sitemap, robots e URL canônica;
  - prévias Open Graph para WhatsApp e redes.
- **Idiomas:** português na primeira entrega. Inglês e espanhol depois, nas páginas institucionais e de parceiros (a base
  de tradução atual pode ser aproveitada).
- **Desempenho:** meta Lighthouse 90+ no celular, em desempenho, acessibilidade, boas práticas e SEO. Imagens AVIF/WebP
  responsivas.
- **Qualidade:** CI com build, verificação de links, testes de fumaça (Playwright), Lighthouse e acessibilidade.
- **Publicação:** o mesmo fluxo atual (GitHub Actions, Docker Hub, Portainer, Traefik e Cloud DNS em
  sobre.viafluvial.com.br e www.sobre.viafluvial.com.br), com healthcheck e arquivo de versão, como no portal.

---

## 11. Segurança e dados do site atual (Fase 0)

Feito antes de qualquer outra coisa, mesmo que a nova página demore:

1. Retirar do ar as rotas `/admin` e `/test-database`, que hoje abrem sem login.
2. Fechar as regras do banco Supabase. Hoje a exclusão de inscritos está liberada para qualquer um, e a leitura pelo
   navegador precisa ser verificada.
3. **Inscritos atuais (decidido: aviso único e depois apagar):**
   - eles deram consentimento para receber novidades do lançamento, então avisar que a plataforma está no ar cabe
     nesse consentimento;
   - enviar **um único e-mail** de lançamento, pelo Infobip, com o botão "Quero continuar recebendo novidades", que
     inscreve na nova newsletter já com confirmação;
   - **depois de 30 dias, apagar todos os dados antigos:** inscritos que não confirmaram, números de WhatsApp (nunca
     foram usados), respostas de quiz e enquete, visitantes, sessões e eventos;
   - antes de apagar, guardar apenas o resumo agregado e anônimo da enquete (percentuais por opção), útil para o
     produto.
4. Na troca para o novo site, desligar o projeto Supabase e remover as credenciais e referências antigas (incluindo os
   fallbacks de credenciais do processo de publicação).

---

## 12. Ajustes em outros projetos

Pequenos e só de navegação:

- **App principal:** confirmar ou criar links diretos para o **cadastro de barqueiro**.
- **App de cargas:** confirmar ou criar um link direto para a **ativação do transportador**.
- **Endpoints para os formulários:** pedido de demonstração, contato institucional e newsletter, nos serviços da
  plataforma, se ainda não existirem.
- **Apps e portal:** o link "Sobre o Via Fluvial" já existe nos rodapés; nada mais a fazer.

---

## 13. Fases e critérios de aceite

| Fase | Entregas | Pronto quando |
|---|---|---|
| **0 - Segurança** | Itens da seção 11 | /admin e /test-database fora do ar; regras do banco fechadas; destino dos inscritos decidido |
| **1 - Página principal** | Seções 5.1 a 5.15 (com 5.4 e 5.11 a 5.13 já funcionando); /demonstracao; /contato; privacidade e termos; publicação no lugar do site atual | Lighthouse 90+ no celular; formulários entregando para a plataforma; nenhum conteúdo repetido do app ou do docs; navegação igual à dos apps |
| **2 - Parceiros e novidades** | /barqueiros, /transportadores, /parceiros (com investidores e poder público), /novidades, /o-que-vem-por-ai, newsletter com confirmação, analytics | Primeira leva de notícias e o roteiro publicados; newsletter enviando e descadastrando |
| **3 - Institucional e idiomas** | /quem-somos completa (história, linha do tempo, Amazônia em números com todas as fontes); inglês e espanhol; vídeo | Textos institucionais aprovados; números com fonte conferida |

---

## 14. Decisões e materiais

### 14.1 Já decidido
| Item | Decisão |
|---|---|
| Inscritos do site atual | E-mail único de lançamento com convite para a nova newsletter; dados antigos apagados após 30 dias (seção 11) |
| Pedidos de demonstração e contato | api-administracao, lista na Área da Plataforma, aviso para contato@viafluvial.com.br (seção 7.2) |
| Newsletter | Lista e consentimento na plataforma; envio pelo Infobip (seção 7.3) |
| Notícias e roteiro | Responsável pelo produto define e aprova; equipe técnica publica; Decap CMS quando houver editor não técnico (seções 7.4 e 7.5) |
| E-mail oficial | contato@viafluvial.com.br |
| WhatsApp | +55 92 99459-3224 (wa.me/5592994593224) |
| Missão, visão e valores | Aprovados como na seção 8 |
| Newsletter em massa | Infobip (contrato permite envio em massa com descadastro); Brevo não será necessário |
| Números da plataforma | Regra de mínimo e só após o lançamento oficial (seção 5.9) |
| Tecnologia | Astro, confirmado |
| Fotos | Primeira versão com telas do produto e fotos licenciadas; material próprio entra quando houver |
| Conteúdo inicial | Três notícias, "O que vem por aí" e história aprovados (`.project/conteudo-inicial.md`) |
| Quem somos | Sem fundadores, equipe, ações com a região ou parcerias; linha do tempo com 2012 (IntSoft) e 2025 (ideia e desenvolvimento) |
| Favicon e ícones | Mesmo padrão dos outros frontends, a partir do logo oficial (seção 9) |
| Empresa | IntSoft Consultoria em TI LTDA - CNPJ 67.825.379/0001-40 |
| Redes sociais | Instagram, Facebook, TikTok, YouTube, LinkedIn e WhatsApp Business: endereços a definir; ícones só aparecem depois de criados |

### 14.2 Pendente
1. **Endereços das redes sociais**, quando forem criadas (não bloqueia).
2. **Rotas de carga liberadas**, confirmadas no dia de publicar a notícia 2 (não bloqueia).

## 15. Fora do escopo

- Compra de passagens, cotação de frete, busca, destinos com saídas, viagem em grupo e v.IA (ficam nos apps).
- Tutoriais e ajuda (ficam no docs).
- Material detalhado para investidores (fica na versão interna do docs).
- Simulador de ganhos, kit de divulgação, histórias reais, vídeo "um dia no rio", "na mídia", mapa "vote na próxima
  rota", representantes locais, central de transparência e status da plataforma. Ficam como ideias para depois, se
  quiserem retomar.
