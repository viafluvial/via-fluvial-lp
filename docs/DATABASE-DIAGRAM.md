# Diagrama do Schema Relacional - Via Fluvial Amazônia

## 🗺️ Visão Geral da Estrutura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SCHEMA RELACIONAL - VIA FLUVIAL AMAZÔNIA                │
│                                                                             │
│  Estrutura normalizada para captura de leads, quiz, enquete e analytics    │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAMADA 1: VISITANTES                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │      visitors        │  (Visitantes anônimos)
    ├──────────────────────┤
    │ id (PK)              │  UUID
    │ visitor_id (UNIQUE)  │  TEXT - Gerado no frontend
    │ first_visit_at       │  TIMESTAMP
    │ last_visit_at        │  TIMESTAMP
    │ user_agent           │  TEXT
    │ referrer             │  TEXT
    └──────────────────────┘
              │
              │ 1:N
              │
              ▼
    ┌──────────────────────┐
    │  visitor_sessions    │  (Sessões de navegação)
    ├──────────────────────┤
    │ id (PK)              │  UUID
    │ session_id (UNIQUE)  │  TEXT
    │ visitor_id (FK)      │──┐
    │ started_at           │  │
    │ ended_at             │  │
    │ duration_seconds     │  │
    │ pages_viewed         │  │
    │ language (pt/en/es)  │  │
    └──────────────────────┘  │
                              │
              ┌───────────────┘
              │
              │ Foreign Key
              ▼
    (Vincula à tabela visitors)


┌─────────────────────────────────────────────────────────────────────────────┐
│                      CAMADA 2: LEADS (CONTATOS)                             │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │       leads          │  (Contatos identificados)
    ├──────────────────────┤
    │ id (PK)              │  UUID
    │ visitor_id (FK)      │──► Vincula ao visitor original
    │ email (UNIQUE)       │  TEXT
    │ whatsapp             │  TEXT (opcional)
    │ profile_type         │  passageiro | barqueiro | agencia | outros
    │ source               │  hero | quiz | cta-final | poll
    │ language             │  pt | en | es
    │                      │
    │ -- Geolocalização    │
    │ geo_city             │  TEXT
    │ geo_state            │  TEXT
    │ geo_country          │  TEXT
    │ geo_latitude         │  NUMERIC(10,8)
    │ geo_longitude        │  NUMERIC(11,8)
    │ geo_accuracy         │  NUMERIC (metros)
    │ geo_source           │  gps | ip
    │                      │
    │ created_at           │
    │ updated_at           │
    └──────────────────────┘
              │
              │ 1:1
              │
              ▼
    ┌──────────────────────────────┐
    │     lead_consents            │  (Consentimentos)
    ├──────────────────────────────┤
    │ id (PK)                      │  UUID
    │ lead_id (FK)                 │──┐
    │                              │  │
    │ consent_email                │  BOOLEAN
    │ consent_whatsapp             │  BOOLEAN
    │ consent_launch_notification  │  BOOLEAN (24h antes)
    │ consent_privacy_policy       │  BOOLEAN
    │ consent_location_precise     │  BOOLEAN (GPS)
    │                              │  │
    │ consented_email_at           │  TIMESTAMP
    │ consented_whatsapp_at        │  TIMESTAMP
    │ consented_launch_at          │  TIMESTAMP
    │ consented_privacy_at         │  TIMESTAMP
    │ consented_location_at        │  TIMESTAMP
    └──────────────────────────────┘  │
                                      │
              ┌───────────────────────┘
              │
              ▼
    (Vincula à tabela leads)


┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAMADA 3: QUIZ                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │   quiz_attempts      │  (Tentativas de quiz)
    ├──────────────────────┤
    │ id (PK)              │  UUID
    │ visitor_id (FK)      │──► Pode ser anônimo
    │ session_id (FK)      │──► Vincula à sessão
    │ lead_id (FK)         │──► Se já for lead (NULL se anônimo)
    │                      │
    │ result_profile       │  frequentTraveler | familyTraveler | etc
    │ completed            │  BOOLEAN
    │ completion_percentage│  INTEGER (0-100)
    │                      │
    │ started_at           │  TIMESTAMP
    │ completed_at         │  TIMESTAMP
    └──────────────────────┘
              │
              │ 1:N
              │
              ▼
    ┌──────────────────────┐
    │   quiz_answers       │  (Respostas individuais)
    ├──────────────────────┤
    │ id (PK)              │  UUID
    │ quiz_attempt_id (FK) │──┐
    │                      │  │
    │ question_number      │  INTEGER (1, 2, 3...)
    │ question_key         │  TEXT (question1, question2...)
    │ answer_key           │  TEXT (option1, option2...)
    │ answer_text          │  TEXT
    │                      │  │
    │ answered_at          │  TIMESTAMP
    └──────────────────────┘  │
                              │
              ┌───────────────┘
              │
              ▼
    (Cada resposta é uma linha, NÃO um JSON)


┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAMADA 4: ENQUETE (POLL)                            │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │  poll_submissions    │  (Submissões da enquete)
    ├──────────────────────┤
    │ id (PK)              │  UUID
    │ visitor_id (FK)      │──► Pode ser anônimo
    │ session_id (FK)      │──► Vincula à sessão
    │ lead_id (FK)         │──► Se já for lead (NULL se anônimo)
    │                      │
    │ suggestions          │  TEXT (campo livre)
    │ suggestions_category │  funcionalidades | pagamento | rotas | etc
    │                      │
    │ submitted_at         │  TIMESTAMP
    └──────────────────────┘
              │
              │ 1:N
              │
              ▼
    ┌──────────────────────────┐
    │  poll_submission_items   │  (Opções selecionadas)
    ├──────────────────────────┤
    │ id (PK)                  │  UUID
    │ poll_submission_id (FK)  │──┐
    │                          │  │
    │ option_key               │  buyTicket | schedules | tracking | etc
    │ option_text              │  TEXT
    │                          │  │
    │ selected_at              │  TIMESTAMP
    └──────────────────────────┘  │
                                  │
              ┌───────────────────┘
              │
              ▼
    (Cada opção selecionada é uma linha, NÃO um array)


┌─────────────────────────────────────────────────────────────────────────────┐
│                    CAMADA 5: RASTREAMENTO E ANALYTICS                       │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │   funnel_events      │  (Eventos do funil)
    ├──────────────────────┤
    │ id (PK)              │  UUID
    │ visitor_id (FK)      │──► Visitante que fez a ação
    │ session_id (FK)      │──► Sessão onde ocorreu
    │ lead_id (FK)         │──► Lead (se já convertido)
    │                      │
    │ event_type           │  page_view | cta_click | quiz_start |
    │                      │  quiz_complete | form_submit | poll_submit
    │ event_category       │  hero | benefits | quiz | poll | cta
    │ event_label          │  Detalhes específicos
    │ event_value          │  NUMERIC (opcional)
    │ event_metadata       │  JSONB (dados extras estruturados)
    │                      │
    │ occurred_at          │  TIMESTAMP
    └──────────────────────┘


    ┌──────────────────────────────┐
    │  geolocation_permissions     │  (Controle de permissões)
    ├──────────────────────────────┤
    │ id (PK)                      │  UUID
    │ visitor_id (FK)              │──► Visitante
    │ lead_id (FK)                 │──► Lead (quando converte)
    │                              │
    │ permission_granted           │  BOOLEAN
    │ permission_type              │  browser | manual | ip
    │                              │
    │ granted_at                   │  TIMESTAMP
    │ revoked_at                   │  TIMESTAMP (se revogar)
    └──────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                      FLUXO DE DADOS DO USUÁRIO                              │
└─────────────────────────────────────────────────────────────────────────────┘

    1. VISITANTE ENTRA NO SITE
       ↓
    [visitors] ─────► visitor_id gerado
       ↓
    2. NAVEGA PELO SITE
       ↓
    [visitor_sessions] ─────► session_id criado
    [funnel_events] ────────► page_view registrado
       ↓
    3. FAZ O QUIZ (ainda anônimo)
       ↓
    [quiz_attempts] ────────► visitor_id vinculado
    [quiz_answers] ─────────► perguntas respondidas individualmente
    [funnel_events] ────────► quiz_start, quiz_complete
       ↓
    4. RESPONDE ENQUETE (ainda anônimo)
       ↓
    [poll_submissions] ─────► visitor_id vinculado
    [poll_submission_items] ► opções selecionadas individualmente
    [funnel_events] ────────► poll_submit
       ↓
    5. CADASTRA EMAIL/WHATSAPP (vira lead!)
       ↓
    [leads] ────────────────► email registrado
       │                      visitor_id vinculado
       │                      geolocalização capturada
       │
       ├─► [lead_consents] ─► permissões registradas
       │
       ├─► [quiz_attempts] ─► lead_id preenchido (vincula quiz anterior)
       │
       ├─► [poll_submissions] ─► lead_id preenchido (vincula enquete anterior)
       │
       └─► [funnel_events] ──► form_submit com lead_id


┌─────────────────────────────────────────────────────────────────────────────┐
│                         VIEWS PRÉ-DEFINIDAS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    📊 stats_overview
    ├─ Total de visitantes
    ├─ Total de leads
    ├─ Quiz completos
    ├─ Respostas de enquete
    └─ Notificações 24h ativadas

    👥 stats_profile_distribution
    ├─ Distribuição por tipo de perfil
    └─ Percentual de cada perfil

    📈 stats_top_poll_options
    ├─ Top 10 funcionalidades mais votadas
    └─ Percentual de votos

    🗺️ stats_geo_distribution
    ├─ Distribuição por estado
    └─ Contagem de cidades por estado

    🎯 stats_funnel_conversion
    ├─ Taxa de conversão por etapa
    └─ Page views → Quiz → Poll → Leads


┌─────────────────────────────────────────────────────────────────────────────┐
│                      ÍNDICES PARA PERFORMANCE                               │
└─────────────────────────────────────────────────────────────────────────────┘

    ✅ Todos os IDs primários têm índices automáticos
    ✅ Todos os campos visitor_id têm índices
    ✅ Todos os campos lead_id têm índices
    ✅ Campos de data têm índices DESC (para queries recentes)
    ✅ Campos de categoria têm índices (profile_type, event_type, etc)
    ✅ Campos geográficos têm índices (geo_state)
    ✅ Email tem índice UNIQUE


┌─────────────────────────────────────────────────────────────────────────────┐
│                    SEGURANÇA (ROW LEVEL SECURITY)                           │
└─────────────────────────────────────────────────────────────────────────────┘

    🔒 RLS Habilitado em TODAS as tabelas
    🔓 Leitura pública (para estatísticas e contadores)
    🔐 Inserção/Atualização requer autenticação
    🔗 Foreign Keys garantem integridade referencial
    ⚡ Triggers para updated_at automático


┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPARAÇÃO: ANTES vs DEPOIS                         │
└─────────────────────────────────────────────────────────────────────────────┘

    ANTES (Chave-Valor):
    ┌────────────────────────────────────┐
    │ kv_store_63010152                  │
    ├────────────────────────────────────┤
    │ key: "newsletter:email@example.com"│
    │ value: {                           │
    │   email: "email@example.com",      │
    │   source: "passageiro-cta-final",  │
    │   whatsapp: "11999999999",         │
    │   notify24h: true,                 │
    │   language: "pt",                  │
    │   geolocation: { ... },            │
    │   quiz: { ... }                    │
    │ }                                  │
    └────────────────────────────────────┘
    ❌ Tudo em um JSON
    ❌ Difícil fazer queries
    ❌ Sem normalização

    DEPOIS (Relacional):
    ┌─────────────────────┐
    │ leads               │  ← Dados principais
    ├─────────────────────┤
    │ lead_consents       │  ← Permissões separadas
    ├─────────────────────┤
    │ quiz_attempts       │  ← Quiz vinculado
    ├─────────────────────┤
    │ quiz_answers        │  ← Cada resposta é uma linha
    ├─────────────────────┤
    │ poll_submissions    │  ← Enquete vinculada
    ├─────────────────────┤
    │ funnel_events       │  ← Eventos rastreados
    └─────────────────────┘
    ✅ Estrutura normalizada
    ✅ Queries SQL otimizadas
    ✅ Integridade referencial
    ✅ Escalável e manutenível
