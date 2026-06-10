# 🗂️ Estrutura Completa das Tabelas

## 📊 Visão Geral

Este documento descreve **detalhadamente** cada uma das 10 tabelas do schema relacional.

---

## 1️⃣ `visitors` - Visitantes Anônimos

Cada pessoa que entra no site gera um `visitor_id` único (armazenado no localStorage).

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-e29b-41d4-a716-446655440000` |
| `visitor_id` | TEXT | ID técnico único | `visitor_1711622400_abc123` |
| `first_visit_at` | TIMESTAMP | Data da primeira visita | `2026-03-28 10:00:00+00` |
| `last_visit_at` | TIMESTAMP | Data da última visita | `2026-03-28 15:30:00+00` |
| `user_agent` | TEXT | Navegador do usuário | `Mozilla/5.0 ...` |
| `referrer` | TEXT | De onde veio | `https://google.com` |
| `created_at` | TIMESTAMP | Data de criação | `2026-03-28 10:00:00+00` |
| `updated_at` | TIMESTAMP | Data de atualização | `2026-03-28 15:30:00+00` |

**Índices:**
- `visitor_id` (UNIQUE)
- `first_visit_at` (DESC)

**Relacionamentos:**
- 1:N → `visitor_sessions`
- 1:N → `quiz_attempts`
- 1:N → `poll_submissions`
- 1:N → `funnel_events`

---

## 2️⃣ `visitor_sessions` - Sessões de Navegação

Cada visita ao site cria uma sessão. Um visitante pode ter múltiplas sessões.

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `session_id` | TEXT | ID técnico da sessão | `session_1711622400_xyz789` |
| `visitor_id` | TEXT | FK → visitors | `visitor_1711622400_abc123` |
| `started_at` | TIMESTAMP | Início da sessão | `2026-03-28 10:00:00+00` |
| `ended_at` | TIMESTAMP | Fim da sessão (NULL se ativa) | `2026-03-28 10:25:00+00` |
| `duration_seconds` | INTEGER | Duração em segundos | `1500` |
| `pages_viewed` | INTEGER | Páginas vistas | `5` |
| `language` | TEXT | Idioma | `pt`, `en`, `es` |
| `created_at` | TIMESTAMP | Data de criação | `2026-03-28 10:00:00+00` |

**Índices:**
- `session_id` (UNIQUE)
- `visitor_id`
- `started_at` (DESC)
- `language`

**Relacionamentos:**
- N:1 → `visitors`

---

## 3️⃣ `leads` - Contatos Identificados

Quando um visitante cadastra email/WhatsApp, ele vira um **lead**.

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `visitor_id` | TEXT | FK → visitors (opcional) | `visitor_1711622400_abc123` |
| `email` | TEXT | Email (UNIQUE) | `joao@email.com` |
| `whatsapp` | TEXT | WhatsApp (opcional) | `5511999999999` |
| `profile_type` | TEXT | Tipo de perfil | `passageiro`, `barqueiro`, `agencia`, `outros` |
| `source` | TEXT | Origem do cadastro | `passageiro-hero`, `barqueiro-quiz`, `agencia-cta-final` |
| `language` | TEXT | Idioma | `pt`, `en`, `es` |
| `geo_city` | TEXT | Cidade | `Manaus` |
| `geo_state` | TEXT | Estado | `Amazonas` |
| `geo_country` | TEXT | País | `Brasil` |
| `geo_latitude` | NUMERIC(10,8) | Latitude | `-3.11902800` |
| `geo_longitude` | NUMERIC(11,8) | Longitude | `-60.02173100` |
| `geo_accuracy` | NUMERIC(10,2) | Precisão em metros | `100.50` |
| `geo_source` | TEXT | Fonte da geo | `gps`, `ip` |
| `created_at` | TIMESTAMP | Data de cadastro | `2026-03-28 10:15:00+00` |
| `updated_at` | TIMESTAMP | Data de atualização | `2026-03-28 10:15:00+00` |

**Índices:**
- `email` (UNIQUE)
- `visitor_id`
- `profile_type`
- `source`
- `created_at` (DESC)
- `geo_state`

**Relacionamentos:**
- N:1 → `visitors` (opcional, ON DELETE SET NULL)
- 1:1 → `lead_consents`

---

## 4️⃣ `lead_consents` - Consentimentos LGPD

Cada lead tem exatamente 1 registro de consentimentos.

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `lead_id` | UUID | FK → leads | `550e8400-...` |
| `consent_email` | BOOLEAN | Consente receber emails | `true` |
| `consent_whatsapp` | BOOLEAN | Consente receber WhatsApp | `true` |
| `consent_launch_notification` | BOOLEAN | Notificar 24h antes do lançamento | `true` |
| `consent_privacy_policy` | BOOLEAN | Aceita política de privacidade | `true` |
| `consent_location_precise` | BOOLEAN | Permite geolocalização GPS | `false` |
| `consented_email_at` | TIMESTAMP | Quando consentiu email | `2026-03-28 10:15:00+00` |
| `consented_whatsapp_at` | TIMESTAMP | Quando consentiu WhatsApp | `2026-03-28 10:15:00+00` |
| `consented_launch_at` | TIMESTAMP | Quando consentiu notificação | `2026-03-28 10:15:00+00` |
| `consented_privacy_at` | TIMESTAMP | Quando consentiu privacidade | `2026-03-28 10:15:00+00` |
| `consented_location_at` | TIMESTAMP | Quando consentiu GPS | `NULL` |
| `created_at` | TIMESTAMP | Data de criação | `2026-03-28 10:15:00+00` |
| `updated_at` | TIMESTAMP | Data de atualização | `2026-03-28 10:15:00+00` |

**Índices:**
- `lead_id`
- `consent_launch_notification` (WHERE true)

**Relacionamentos:**
- 1:1 → `leads` (ON DELETE CASCADE)

---

## 5️⃣ `quiz_attempts` - Tentativas de Quiz

Cada vez que alguém faz o quiz (mesmo anônimo).

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `visitor_id` | TEXT | FK → visitors (opcional) | `visitor_1711622400_abc123` |
| `session_id` | TEXT | FK → sessions (opcional) | `session_1711622400_xyz789` |
| `lead_id` | UUID | FK → leads (NULL se anônimo) | `550e8400-...` ou `NULL` |
| `result_profile` | TEXT | Resultado do quiz | `frequentTraveler`, `familyTraveler`, `explorer`, `businessTraveler` |
| `completed` | BOOLEAN | Quiz foi concluído? | `true` |
| `completion_percentage` | INTEGER | Porcentagem de conclusão | `100` |
| `started_at` | TIMESTAMP | Quando começou | `2026-03-28 10:00:00+00` |
| `completed_at` | TIMESTAMP | Quando terminou | `2026-03-28 10:03:00+00` |
| `created_at` | TIMESTAMP | Data de criação | `2026-03-28 10:00:00+00` |

**Índices:**
- `visitor_id`
- `lead_id`
- `result_profile`
- `completed` (WHERE true)

**Relacionamentos:**
- N:1 → `visitors` (ON DELETE SET NULL)
- N:1 → `visitor_sessions` (ON DELETE SET NULL)
- N:1 → `leads` (ON DELETE SET NULL)
- 1:N → `quiz_answers`

**Fluxo:**
1. Usuário inicia quiz → cria `quiz_attempt` com `completed=false`
2. Usuário responde perguntas → cria múltiplas linhas em `quiz_answers`
3. Usuário completa → atualiza `quiz_attempt` com `completed=true` e `result_profile`
4. Se usuário depois cadastra email → atualiza `lead_id` (vincula ao lead)

---

## 6️⃣ `quiz_answers` - Respostas do Quiz

Cada pergunta respondida é uma **linha separada**. NÃO é um JSON!

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `quiz_attempt_id` | UUID | FK → quiz_attempts | `550e8400-...` |
| `question_number` | INTEGER | Número da pergunta | `1`, `2`, `3`, ... |
| `question_key` | TEXT | Chave da pergunta | `question1`, `question2`, ... |
| `answer_key` | TEXT | Chave da resposta | `option1`, `option2`, ... |
| `answer_text` | TEXT | Texto da resposta | `Viajo frequentemente` |
| `answered_at` | TIMESTAMP | Quando respondeu | `2026-03-28 10:01:00+00` |

**Índices:**
- `quiz_attempt_id`
- `question_key`
- `answer_key`

**Relacionamentos:**
- N:1 → `quiz_attempts` (ON DELETE CASCADE)

**Exemplo de consulta:**
```sql
-- Ver todas as respostas de um quiz
SELECT 
  qa.question_number,
  qa.question_key,
  qa.answer_key,
  qa.answer_text,
  qa.answered_at
FROM quiz_answers qa
WHERE qa.quiz_attempt_id = '550e8400-...'
ORDER BY qa.question_number;
```

---

## 7️⃣ `poll_submissions` - Submissões da Enquete

Cada vez que alguém responde a enquete.

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `visitor_id` | TEXT | FK → visitors (opcional) | `visitor_1711622400_abc123` |
| `session_id` | TEXT | FK → sessions (opcional) | `session_1711622400_xyz789` |
| `lead_id` | UUID | FK → leads (NULL se anônimo) | `550e8400-...` ou `NULL` |
| `suggestions` | TEXT | Campo livre de sugestões | `Gostaria de ver preços em tempo real` |
| `suggestions_category` | TEXT | Categoria da sugestão | `funcionalidades`, `pagamento`, `rotas`, ... |
| `submitted_at` | TIMESTAMP | Quando enviou | `2026-03-28 10:05:00+00` |

**Índices:**
- `visitor_id`
- `lead_id`
- `submitted_at` (DESC)

**Relacionamentos:**
- N:1 → `visitors` (ON DELETE SET NULL)
- N:1 → `visitor_sessions` (ON DELETE SET NULL)
- N:1 → `leads` (ON DELETE SET NULL)
- 1:N → `poll_submission_items`

---

## 8️⃣ `poll_submission_items` - Opções da Enquete

Cada opção selecionada é uma **linha separada**. NÃO é um array!

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `poll_submission_id` | UUID | FK → poll_submissions | `550e8400-...` |
| `option_key` | TEXT | Chave da opção | `buyTicket`, `schedules`, `tracking`, `payment`, `reliable`, `info` |
| `option_text` | TEXT | Texto da opção (opcional) | `Comprar passagens online` |
| `selected_at` | TIMESTAMP | Quando selecionou | `2026-03-28 10:05:00+00` |

**Índices:**
- `poll_submission_id`
- `option_key`

**Relacionamentos:**
- N:1 → `poll_submissions` (ON DELETE CASCADE)

**Exemplo de consulta:**
```sql
-- Ver quantos votos cada opção recebeu
SELECT 
  option_key,
  COUNT(*) as votes,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM poll_submission_items), 2) as percentage
FROM poll_submission_items
GROUP BY option_key
ORDER BY votes DESC;
```

---

## 9️⃣ `funnel_events` - Eventos do Funil

Rastreamento estruturado de eventos para analytics.

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `visitor_id` | TEXT | FK → visitors (opcional) | `visitor_1711622400_abc123` |
| `session_id` | TEXT | FK → sessions (opcional) | `session_1711622400_xyz789` |
| `lead_id` | UUID | FK → leads (opcional) | `550e8400-...` |
| `event_type` | TEXT | Tipo de evento | `page_view`, `cta_click`, `quiz_start`, `quiz_complete`, `form_submit`, `poll_submit` |
| `event_category` | TEXT | Categoria | `hero`, `benefits`, `quiz`, `poll`, `cta` |
| `event_label` | TEXT | Label descritivo | `Landing page carregada`, `Quiz completo: frequentTraveler` |
| `event_value` | NUMERIC(10,2) | Valor numérico (opcional) | `1.00` |
| `event_metadata` | JSONB | Metadata adicional (opcional) | `{"quiz_result": "frequentTraveler", "time_spent": 180}` |
| `occurred_at` | TIMESTAMP | Quando ocorreu | `2026-03-28 10:00:00+00` |

**Índices:**
- `visitor_id`
- `session_id`
- `lead_id`
- `event_type`
- `occurred_at` (DESC)

**Relacionamentos:**
- N:1 → `visitors` (ON DELETE SET NULL)
- N:1 → `visitor_sessions` (ON DELETE SET NULL)
- N:1 → `leads` (ON DELETE SET NULL)

**Tipos de Eventos Comuns:**
- `page_view` - Visualização de página
- `cta_click` - Clique em CTA
- `quiz_start` - Quiz iniciado
- `quiz_complete` - Quiz completo
- `form_submit` - Formulário enviado (lead criado)
- `poll_submit` - Enquete enviada

---

## 🔟 `geolocation_permissions` - Permissões de Localização

Controle detalhado de permissões de geolocalização.

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `id` | UUID | ID interno (PK) | `550e8400-...` |
| `visitor_id` | TEXT | FK → visitors (opcional) | `visitor_1711622400_abc123` |
| `lead_id` | UUID | FK → leads (opcional) | `550e8400-...` |
| `permission_granted` | BOOLEAN | Permissão concedida? | `true` |
| `permission_type` | TEXT | Tipo de permissão | `browser` (API Geolocation), `manual` (usuário digitou), `ip` (IP-based) |
| `granted_at` | TIMESTAMP | Quando concedeu | `2026-03-28 10:15:00+00` |
| `revoked_at` | TIMESTAMP | Quando revogou (NULL se ativa) | `NULL` |
| `created_at` | TIMESTAMP | Data de criação | `2026-03-28 10:15:00+00` |

**Índices:**
- `visitor_id`
- `lead_id`
- `permission_granted` (WHERE true)

**Relacionamentos:**
- N:1 → `visitors` (ON DELETE SET NULL)
- N:1 → `leads` (ON DELETE CASCADE)

---

## 📊 Views Pré-Definidas

### `stats_overview`
Totais gerais do sistema.

| Campo | Descrição |
|-------|-----------|
| `total_visitors` | Total de visitantes únicos |
| `total_leads` | Total de leads cadastrados |
| `completed_quizzes` | Total de quiz completos |
| `poll_responses` | Total de respostas de enquete |
| `launch_notifications` | Total que quer ser notificado 24h antes |

### `stats_profile_distribution`
Distribuição de leads por perfil.

| Campo | Descrição |
|-------|-----------|
| `profile_type` | Tipo de perfil |
| `count` | Quantidade |
| `percentage` | Percentual |

### `stats_top_poll_options`
Top 10 funcionalidades mais votadas.

| Campo | Descrição |
|-------|-----------|
| `option_key` | Chave da opção |
| `votes` | Quantidade de votos |
| `percentage` | Percentual |

### `stats_geo_distribution`
Distribuição geográfica por estado.

| Campo | Descrição |
|-------|-----------|
| `geo_state` | Estado |
| `leads_count` | Quantidade de leads |
| `cities_count` | Quantidade de cidades diferentes |

### `stats_funnel_conversion`
Taxa de conversão do funil.

| Campo | Descrição |
|-------|-----------|
| `step` | Etapa do funil |
| `count` | Quantidade |
| `conversion_rate` | Taxa de conversão em % |

---

## 🔗 Relacionamentos Visuais

```
visitors (visitante anônimo)
    ├─→ visitor_sessions (1:N)
    ├─→ quiz_attempts (1:N)
    ├─→ poll_submissions (1:N)
    ├─→ funnel_events (1:N)
    ├─→ geolocation_permissions (1:N)
    └─→ leads (1:N - quando cadastra email)
            ├─→ lead_consents (1:1 obrigatório)
            ├─→ quiz_attempts (1:N - vincula depois)
            ├─→ poll_submissions (1:N - vincula depois)
            ├─→ funnel_events (1:N - vincula depois)
            └─→ geolocation_permissions (1:N - vincula depois)

quiz_attempts
    └─→ quiz_answers (1:N - cada pergunta é uma linha)

poll_submissions
    └─→ poll_submission_items (1:N - cada opção é uma linha)
```

---

## 🎯 Fluxo Completo de Dados

### Cenário: João visita o site e se cadastra

```
1. João entra no site
   → Cria visitor_id no localStorage: "visitor_1711622400_abc123"
   → INSERT em 'visitors' (visitor_id, first_visit_at, user_agent, referrer)
   → INSERT em 'visitor_sessions' (session_id, visitor_id, language='pt')
   → INSERT em 'funnel_events' (visitor_id, event_type='page_view')

2. João faz o quiz
   → INSERT em 'quiz_attempts' (visitor_id, completed=false)
   → INSERT em 'quiz_answers' x5 (uma por pergunta)
   → UPDATE em 'quiz_attempts' (completed=true, result_profile='frequentTraveler')
   → INSERT em 'funnel_events' (visitor_id, event_type='quiz_complete')

3. João responde a enquete
   → INSERT em 'poll_submissions' (visitor_id, suggestions)
   → INSERT em 'poll_submission_items' x3 (uma por opção)
   → INSERT em 'funnel_events' (visitor_id, event_type='poll_submit')

4. João cadastra email (VIRA LEAD!)
   → INSERT em 'leads' (visitor_id, email, profile_type, geo_*)
   → INSERT em 'lead_consents' (lead_id, consent_*, consented_*_at)
   → UPDATE em 'quiz_attempts' SET lead_id (vincula quiz anterior)
   → UPDATE em 'poll_submissions' SET lead_id (vincula enquete anterior)
   → INSERT em 'funnel_events' (visitor_id, lead_id, event_type='form_submit')

5. Analytics consultam:
   → SELECT * FROM stats_overview (totais)
   → SELECT * FROM stats_profile_distribution (distribuição)
   → SELECT * FROM stats_funnel_conversion (taxa de conversão)
```

---

## 📚 Queries de Exemplo

### Buscar histórico completo de um lead

```sql
SELECT 
  'Lead criado' as event,
  l.created_at as timestamp,
  l.email as detail
FROM leads l
WHERE l.email = 'joao@email.com'

UNION ALL

SELECT 
  'Quiz completo' as event,
  qa.completed_at as timestamp,
  qa.result_profile as detail
FROM quiz_attempts qa
JOIN leads l ON l.id = qa.lead_id
WHERE l.email = 'joao@email.com'

UNION ALL

SELECT 
  'Enquete respondida' as event,
  ps.submitted_at as timestamp,
  ps.suggestions as detail
FROM poll_submissions ps
JOIN leads l ON l.id = ps.lead_id
WHERE l.email = 'joao@email.com'

ORDER BY timestamp;
```

### Top 5 estados com mais leads

```sql
SELECT * FROM stats_geo_distribution LIMIT 5;
```

### Leads que querem notificação 24h

```sql
SELECT 
  l.email,
  l.whatsapp,
  l.profile_type,
  l.geo_city,
  l.geo_state,
  lc.consented_launch_at
FROM leads l
JOIN lead_consents lc ON lc.lead_id = l.id
WHERE lc.consent_launch_notification = true
ORDER BY lc.consented_launch_at DESC;
```

---

**Última atualização:** 2026-03-28  
**Versão:** 3.0 (Schema Relacional)
