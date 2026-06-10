# Migração: Modelo Chave-Valor → Modelo Relacional

## 📋 Visão Geral

Este guia documenta a migração da estrutura de dados da landing page Via Fluvial Amazônia de um modelo **chave-valor genérico** (usando `kv_store_63010152`) para um **modelo relacional estruturado e normalizado**.

## 🎯 Motivação

### Modelo Anterior (Chave-Valor)
```sql
kv_store_63010152 (
  key: TEXT,           -- Exemplo: "newsletter:email@example.com"
  value: JSONB,        -- Todos os dados em um JSON
  created_at,
  updated_at
)
```

**Problemas:**
- ❌ Dados não normalizados
- ❌ Difícil fazer queries complexas
- ❌ Não aproveita recursos relacionais do Postgres
- ❌ Falta de integridade referencial
- ❌ Dificulta análises e relatórios

### Modelo Novo (Relacional)

**Vantagens:**
- ✅ Estrutura normalizada e organizada
- ✅ Queries SQL otimizadas
- ✅ Integridade referencial com Foreign Keys
- ✅ Índices específicos para performance
- ✅ Views pré-definidas para análises
- ✅ Escalabilidade e manutenibilidade

## 📊 Estrutura das Tabelas

### 1. **visitors** (Visitantes)
Cada pessoa que acessa o site, identificada por `visitor_id` gerado no frontend.

### 2. **visitor_sessions** (Sessões)
Cada visita ao site, vinculada ao visitor.

### 3. **leads** (Leads)
Quando o usuário fornece email/WhatsApp, vira um lead.
- Contém dados de contato
- Geolocalização estruturada (lat/long)
- Perfil do usuário (passageiro, barqueiro, etc)

### 4. **lead_consents** (Consentimentos)
Controle detalhado de todos os consentimentos:
- Email
- WhatsApp
- Notificação 24h antes do lançamento
- Política de privacidade
- Geolocalização precisa

### 5. **quiz_attempts** (Tentativas de Quiz)
Cada vez que alguém faz o quiz.

### 6. **quiz_answers** (Respostas do Quiz)
**Cada pergunta é uma linha**, não um JSON.

### 7. **poll_submissions** (Submissões da Enquete)
Cada resposta da enquete.

### 8. **poll_submission_items** (Itens da Enquete)
**Cada opção selecionada é uma linha**, não um array.

### 9. **funnel_events** (Eventos do Funil)
Rastreamento estruturado de eventos:
- Page views
- Cliques em CTAs
- Início/conclusão de quiz
- Envio de formulários

### 10. **geolocation_permissions** (Permissões de Geolocalização)
Controle de permissões de localização detalhada.

## 🔄 Fluxo de Relacionamentos

```
visitor (anônimo)
  └─> visitor_sessions (múltiplas visitas)
  └─> funnel_events (rastreamento de ações)
  └─> quiz_attempts (pode fazer quiz sem ser lead)
  └─> poll_submissions (pode responder enquete sem ser lead)
  
  [Ao fornecer email/WhatsApp, vira:]
  
  └─> leads (contato identificado)
        ├─> lead_consents (permissões)
        ├─> quiz_attempts (vincula quiz anterior)
        ├─> poll_submissions (vincula enquete anterior)
        ├─> funnel_events (vincula eventos anteriores)
        └─> geolocation_permissions (controle de localização)
```

## 📦 Instalação do Novo Schema

### Passo 1: Criar as Tabelas
Execute o arquivo `/supabase-relational-schema.sql` no Supabase SQL Editor:
```
https://supabase.com/dashboard/project/ibwprzjqvegzepphznkm/sql/new
```

### Passo 2: Migrar Dados Existentes (se houver)
Se você já tem dados no `kv_store_63010152`, execute a migração abaixo.

## 🔧 Script de Migração de Dados

```sql
-- ==========================================
-- MIGRAÇÃO DE DADOS: kv_store → Relacional
-- ==========================================

-- 1. Migrar dados de newsletter para leads
INSERT INTO leads (
  email,
  profile_type,
  source,
  whatsapp,
  geo_city,
  geo_state,
  geo_country,
  geo_latitude,
  geo_longitude,
  geo_accuracy,
  geo_source,
  language,
  created_at
)
SELECT
  (value->>'email')::TEXT as email,
  COALESCE(
    CASE 
      WHEN value->>'source' LIKE 'passageiro%' THEN 'passageiro'
      WHEN value->>'source' LIKE 'barqueiro%' THEN 'barqueiro'
      WHEN value->>'source' LIKE 'agencia%' THEN 'agencia'
      ELSE 'outros'
    END,
    'outros'
  ) as profile_type,
  COALESCE((value->>'source')::TEXT, 'unknown') as source,
  (value->>'whatsapp')::TEXT as whatsapp,
  (value->'geolocation'->>'city')::TEXT as geo_city,
  (value->'geolocation'->>'state')::TEXT as geo_state,
  (value->'geolocation'->>'country')::TEXT as geo_country,
  (value->'geolocation'->>'latitude')::NUMERIC as geo_latitude,
  (value->'geolocation'->>'longitude')::NUMERIC as geo_longitude,
  (value->'geolocation'->>'accuracy')::NUMERIC as geo_accuracy,
  (value->'geolocation'->>'source')::TEXT as geo_source,
  (value->>'language')::TEXT as language,
  created_at
FROM kv_store_63010152
WHERE key LIKE 'newsletter:%'
ON CONFLICT (email) DO NOTHING;

-- 2. Criar consentimentos dos leads migrados
INSERT INTO lead_consents (
  lead_id,
  consent_email,
  consent_whatsapp,
  consent_launch_notification,
  consented_email_at,
  consented_whatsapp_at,
  consented_launch_at
)
SELECT
  l.id as lead_id,
  true as consent_email, -- Se cadastrou email, consentiu
  (kv.value->>'whatsapp') IS NOT NULL as consent_whatsapp,
  COALESCE((kv.value->>'notify24h')::BOOLEAN, false) as consent_launch_notification,
  l.created_at as consented_email_at,
  CASE WHEN (kv.value->>'whatsapp') IS NOT NULL THEN l.created_at ELSE NULL END as consented_whatsapp_at,
  CASE WHEN COALESCE((kv.value->>'notify24h')::BOOLEAN, false) THEN l.created_at ELSE NULL END as consented_launch_at
FROM leads l
JOIN kv_store_63010152 kv ON (kv.value->>'email')::TEXT = l.email
WHERE kv.key LIKE 'newsletter:%';

-- 3. Migrar respostas da enquete
-- Primeiro, criar a submissão
INSERT INTO poll_submissions (
  suggestions,
  submitted_at
)
SELECT
  (value->>'suggestions')::TEXT as suggestions,
  created_at
FROM kv_store_63010152
WHERE key LIKE 'poll:%';

-- Depois, criar os itens selecionados (se possível extrair do JSON)
-- Esta parte depende da estrutura exata do seu JSON de poll

-- 4. Registrar eventos de funil baseados nos dados existentes
INSERT INTO funnel_events (
  event_type,
  event_category,
  event_label,
  occurred_at
)
SELECT
  'form_submit' as event_type,
  'newsletter' as event_category,
  (value->>'source')::TEXT as event_label,
  created_at as occurred_at
FROM kv_store_63010152
WHERE key LIKE 'newsletter:%'
UNION ALL
SELECT
  'poll_submit' as event_type,
  'poll' as event_category,
  'enquete' as event_label,
  created_at as occurred_at
FROM kv_store_63010152
WHERE key LIKE 'poll:%';

-- ==========================================
-- VERIFICAÇÃO DA MIGRAÇÃO
-- ==========================================

-- Comparar contagens
SELECT 
  'KV Store (newsletter)' as source,
  COUNT(*) as count
FROM kv_store_63010152
WHERE key LIKE 'newsletter:%'
UNION ALL
SELECT 
  'Leads migrados' as source,
  COUNT(*) as count
FROM leads
UNION ALL
SELECT 
  'KV Store (poll)' as source,
  COUNT(*) as count
FROM kv_store_63010152
WHERE key LIKE 'poll:%'
UNION ALL
SELECT 
  'Poll submissions migrados' as source,
  COUNT(*) as count
FROM poll_submissions;
```

## 🔌 Atualização das Edge Functions

Agora você precisa atualizar o código das Edge Functions (`/supabase/functions/server/index.tsx`) para usar as novas tabelas relacionais ao invés do `kv_store`.

### Exemplo: Endpoint de Newsletter

**Antes (kv_store):**
```typescript
const key = `newsletter:${email}`;
await kv.set(key, {
  email,
  source,
  whatsapp,
  notify24h,
  language,
  geolocation
});
```

**Depois (relacional):**
```typescript
// 1. Inserir lead
const { data: lead } = await supabaseClient
  .from('leads')
  .insert({
    email,
    profile_type: extractProfileFromSource(source),
    source,
    whatsapp,
    language,
    geo_city: geolocation?.city,
    geo_state: geolocation?.state,
    geo_country: geolocation?.country,
    geo_latitude: geolocation?.latitude,
    geo_longitude: geolocation?.longitude,
    geo_accuracy: geolocation?.accuracy,
    geo_source: geolocation?.source,
  })
  .select()
  .single();

// 2. Inserir consentimentos
await supabaseClient
  .from('lead_consents')
  .insert({
    lead_id: lead.id,
    consent_email: true,
    consent_whatsapp: !!whatsapp,
    consent_launch_notification: notify24h,
    consented_email_at: new Date().toISOString(),
    consented_whatsapp_at: whatsapp ? new Date().toISOString() : null,
    consented_launch_at: notify24h ? new Date().toISOString() : null,
  });

// 3. Registrar evento do funil
await supabaseClient
  .from('funnel_events')
  .insert({
    lead_id: lead.id,
    event_type: 'form_submit',
    event_category: 'newsletter',
    event_label: source,
  });
```

## 📈 Queries Úteis com o Novo Schema

### Contar leads por perfil
```sql
SELECT profile_type, COUNT(*) 
FROM leads 
GROUP BY profile_type;
```

### Top 5 estados com mais leads
```sql
SELECT geo_state, COUNT(*) as total
FROM leads
WHERE geo_state IS NOT NULL
GROUP BY geo_state
ORDER BY total DESC
LIMIT 5;
```

### Taxa de conclusão do quiz
```sql
SELECT
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE completed = true) as completed,
  ROUND(COUNT(*) FILTER (WHERE completed = true) * 100.0 / COUNT(*), 2) as completion_rate
FROM quiz_attempts;
```

### Funcionalidades mais votadas na enquete
```sql
SELECT option_key, COUNT(*) as votes
FROM poll_submission_items
GROUP BY option_key
ORDER BY votes DESC;
```

### Leads que aceitaram notificação 24h
```sql
SELECT l.email, l.profile_type, l.geo_state
FROM leads l
JOIN lead_consents c ON l.id = c.lead_id
WHERE c.consent_launch_notification = true;
```

## 🎯 Próximos Passos

1. ✅ Execute o schema relacional no Supabase
2. ⏭️ Migre os dados existentes (se houver)
3. ⏭️ Atualize as Edge Functions para usar o novo schema
4. ⏭️ Teste todos os endpoints
5. ⏭️ (Opcional) Desative/arquive a tabela `kv_store_63010152`

## 📚 Views Prontas

O schema já inclui várias views úteis:

- `stats_overview` - Visão geral das estatísticas
- `stats_profile_distribution` - Distribuição de perfis
- `stats_top_poll_options` - Top funcionalidades desejadas
- `stats_geo_distribution` - Distribuição geográfica
- `stats_funnel_conversion` - Taxa de conversão do funil

**Exemplo de uso:**
```sql
SELECT * FROM stats_overview;
SELECT * FROM stats_profile_distribution;
```

## 🔒 Segurança

O schema já inclui:
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de leitura pública (para estatísticas)
- ✅ Políticas de inserção/atualização autenticadas
- ✅ Foreign Keys para integridade referencial
- ✅ Índices para performance

## 📞 Suporte

Se tiver dúvidas sobre a migração, consulte:
- Arquivo: `/supabase-relational-schema.sql`
- Documentação do Supabase: https://supabase.com/docs
