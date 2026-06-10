# 🔄 Guia de Migração: KV Store → Schema Relacional

## 📋 Resumo da Migração

Este documento explica a migração completa do modelo **chave-valor (kv_store_63010152)** para o **schema relacional normalizado (10 tabelas)**.

---

## ⚠️ IMPORTANTE - LEIA PRIMEIRO

### O que mudou?

**ANTES (kv_store_63010152):**
```
Tudo em uma tabela:
- key: "newsletter:email@example.com"
- value: { email, source, whatsapp, geolocation: {...}, quiz: {...} }
```

**AGORA (Schema Relacional):**
```
10 tabelas especializadas:
- visitors (visitantes anônimos)
- visitor_sessions (sessões)
- leads (emails cadastrados)
- lead_consents (consentimentos LGPD)
- quiz_attempts + quiz_answers
- poll_submissions + poll_submission_items
- funnel_events (analytics)
- geolocation_permissions
```

### Por que migrar?

✅ **Vantagens do Schema Relacional:**
- 🚀 Queries SQL otimizadas e rápidas
- 📊 Análises complexas sem processar JSONs
- 🔗 Integridade referencial (Foreign Keys)
- 📈 Escalabilidade infinita
- 🎯 Views pré-definidas para estatísticas
- 🔍 Índices otimizados para performance
- 🧹 Estrutura normalizada e limpa

❌ **Problemas do KV Store:**
- 🐌 Queries lentas (precisa deserializar JSON)
- 😵 Difícil fazer análises complexas
- 🤯 JSONs gigantes e desorganizados
- 🚫 Sem integridade referencial
- 📉 Performance cai com crescimento

---

## 🚀 Passo a Passo da Migração

### 1. Execute o SQL no Supabase Dashboard

1. Acesse: `https://supabase.com/dashboard/project/ibwprzjqvegzepphznkm/sql/new`

2. Copie e cole o conteúdo de `/supabase-relational-schema.sql`

3. Clique em **"Run"**

4. Aguarde a confirmação: ✅ Success (no errors)

5. Verifique se as tabelas foram criadas:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

### 2. Verifique a Instalação

Acesse: `http://localhost:5173/test-database` ou use o componente `<DatabaseSetup />`

Você deve ver:
```
✅ Schema relacional encontrado e pronto para uso!
✓ visitors (visitantes anônimos)
✓ visitor_sessions (sessões)
✓ leads (contatos identificados)
...
```

### 3. Teste as APIs

```typescript
// Teste 1: Health Check
import { checkHealth } from './utils/api';
const health = await checkHealth();
console.log(health); // { status: 'ok', model: 'supabase-relational' }

// Teste 2: Cadastro de Lead
import { subscribeNewsletter } from './utils/api';
await subscribeNewsletter({
  email: 'teste@example.com',
  source: 'passageiro-hero',
  language: 'pt',
  geolocation: {
    city: 'Manaus',
    state: 'Amazonas',
    country: 'Brasil',
    source: 'ip'
  }
});

// Teste 3: Buscar Total de Leads
import { getNewsletterCount } from './utils/api';
const total = await getNewsletterCount();
console.log('Total de leads:', total);
```

---

## 📊 Mapeamento: Antigo → Novo

### Newsletter (Cadastro de Email)

**ANTES (KV Store):**
```typescript
// Uma chave com tudo em JSON
{
  key: "newsletter:joao@email.com",
  value: {
    email: "joao@email.com",
    source: "passageiro-cta-final",
    whatsapp: "11999999999",
    notify24h: true,
    language: "pt",
    quizResult: "frequentTraveler",
    geolocation: { city: "Manaus", state: "AM", ... },
    subscribedAt: "2026-03-28T10:00:00Z"
  }
}
```

**AGORA (Relacional):**
```typescript
// Tabela 'leads'
{
  id: "uuid-123",
  visitor_id: "visitor_123",
  email: "joao@email.com",
  whatsapp: "11999999999",
  profile_type: "passageiro",
  source: "passageiro-cta-final",
  language: "pt",
  geo_city: "Manaus",
  geo_state: "Amazonas",
  geo_country: "Brasil",
  geo_latitude: -3.119028,
  geo_longitude: -60.021731,
  geo_accuracy: 100,
  geo_source: "ip",
  created_at: "2026-03-28T10:00:00Z"
}

// Tabela 'lead_consents'
{
  id: "uuid-456",
  lead_id: "uuid-123",
  consent_email: true,
  consent_whatsapp: true,
  consent_launch_notification: true,
  consent_privacy_policy: true,
  consent_location_precise: false,
  consented_email_at: "2026-03-28T10:00:00Z",
  consented_whatsapp_at: "2026-03-28T10:00:00Z",
  consented_launch_at: "2026-03-28T10:00:00Z"
}

// Tabela 'quiz_attempts' (vinculada depois)
{
  id: "uuid-789",
  visitor_id: "visitor_123",
  lead_id: "uuid-123", // Vinculado após cadastro
  result_profile: "frequentTraveler",
  completed: true
}
```

### Poll (Enquete)

**ANTES (KV Store):**
```typescript
{
  key: "poll:1711622400000-abc123",
  value: {
    id: 1711622400000,
    selectedOptions: ["buyTicket", "schedules", "tracking"],
    suggestions: "Gostaria de ver preços em tempo real",
    submittedAt: "2026-03-28T10:00:00Z"
  }
}
```

**AGORA (Relacional):**
```typescript
// Tabela 'poll_submissions'
{
  id: "uuid-111",
  visitor_id: "visitor_123",
  session_id: "session_456",
  lead_id: null, // Se não for lead ainda
  suggestions: "Gostaria de ver preços em tempo real",
  suggestions_category: null,
  submitted_at: "2026-03-28T10:00:00Z"
}

// Tabela 'poll_submission_items' (uma linha por opção)
[
  { id: "uuid-222", poll_submission_id: "uuid-111", option_key: "buyTicket" },
  { id: "uuid-333", poll_submission_id: "uuid-111", option_key: "schedules" },
  { id: "uuid-444", poll_submission_id: "uuid-111", option_key: "tracking" }
]
```

### Quiz

**ANTES (KV Store):**
```typescript
// Não havia estrutura definida no KV, apenas um campo "quizResult"
// dentro do newsletter subscriber
```

**AGORA (Relacional):**
```typescript
// Tabela 'quiz_attempts'
{
  id: "uuid-555",
  visitor_id: "visitor_123",
  session_id: "session_456",
  lead_id: null, // Preenchido quando cadastrar email
  result_profile: "frequentTraveler",
  completed: true,
  completion_percentage: 100,
  started_at: "2026-03-28T09:55:00Z",
  completed_at: "2026-03-28T09:58:00Z"
}

// Tabela 'quiz_answers' (uma linha por resposta)
[
  {
    id: "uuid-666",
    quiz_attempt_id: "uuid-555",
    question_number: 1,
    question_key: "question1",
    answer_key: "option1",
    answer_text: "Viajo frequentemente",
    answered_at: "2026-03-28T09:55:30Z"
  },
  {
    id: "uuid-777",
    quiz_attempt_id: "uuid-555",
    question_number: 2,
    question_key: "question2",
    answer_key: "option3",
    answer_text: "Conforto",
    answered_at: "2026-03-28T09:56:15Z"
  },
  // ... mais respostas
]
```

---

## 🔧 APIs Atualizadas

Todas as funções em `/src/app/utils/api.ts` foram reescritas:

### Newsletter API

```typescript
✅ subscribeNewsletter(data) - Insere em 'leads' + 'lead_consents'
✅ getNewsletterCount() - COUNT da tabela 'leads'
✅ listNewsletterSubscribers() - SELECT com JOIN de 'leads' e 'lead_consents'
```

### Poll API

```typescript
✅ submitPoll(options, suggestions) - Insere em 'poll_submissions' + 'poll_submission_items'
✅ getPollStats() - Agrega de 'poll_submission_items'
✅ listPollResponses() - SELECT com JOIN
```

### Quiz API (NOVA!)

```typescript
✅ startQuiz(sessionId) - Cria 'quiz_attempts'
✅ saveQuizAnswer(attemptId, answer) - Insere em 'quiz_answers'
✅ completeQuiz(attemptId, result) - Atualiza 'quiz_attempts'
```

### Analytics API (NOVA!)

```typescript
✅ getAnalyticsOverview() - Totais gerais
✅ getProfileDistribution() - Distribuição por perfil
✅ trackFunnelEvent(event) - Registra em 'funnel_events'
```

### Visitor Tracking (NOVA!)

```typescript
✅ getOrCreateVisitorId() - Gera/recupera visitor_id do localStorage
✅ trackVisitor(visitorId) - Registra em 'visitors'
✅ trackSession(sessionId, visitorId, language) - Registra em 'visitor_sessions'
```

---

## 🎯 Fluxo Completo de um Usuário

### 1. Visitante Entra no Site
```typescript
// Frontend (automaticamente no App.tsx ou Layout):
const visitorId = getOrCreateVisitorId(); // "visitor_1711622400_abc123"
await trackVisitor(visitorId);

const sessionId = generateSessionId(); // "session_1711622400_xyz789"
await trackSession(sessionId, visitorId, 'pt');
```

**Resultado no Banco:**
- ✅ Linha criada em `visitors`
- ✅ Linha criada em `visitor_sessions`

### 2. Usuário Faz o Quiz (Ainda Anônimo)
```typescript
const attemptId = await startQuiz(sessionId);

// Cada pergunta respondida:
await saveQuizAnswer(attemptId, {
  questionNumber: 1,
  questionKey: 'question1',
  answerKey: 'option1',
  answerText: 'Viajo frequentemente'
});

// Ao finalizar:
await completeQuiz(attemptId, 'frequentTraveler');
```

**Resultado no Banco:**
- ✅ Linha criada em `quiz_attempts` (visitor_id preenchido, lead_id NULL)
- ✅ 5 linhas criadas em `quiz_answers` (uma por pergunta)
- ✅ Evento registrado em `funnel_events` (quiz_start, quiz_complete)

### 3. Usuário Responde a Enquete (Ainda Anônimo)
```typescript
await submitPoll(
  ['buyTicket', 'schedules', 'tracking'],
  'Gostaria de ver preços em tempo real'
);
```

**Resultado no Banco:**
- ✅ Linha criada em `poll_submissions` (visitor_id preenchido, lead_id NULL)
- ✅ 3 linhas criadas em `poll_submission_items`
- ✅ Evento registrado em `funnel_events` (poll_submit)

### 4. Usuário Cadastra Email (Vira Lead!)
```typescript
await subscribeNewsletter({
  email: 'joao@email.com',
  source: 'passageiro-cta-final',
  whatsapp: '11999999999',
  notify24h: true,
  language: 'pt',
  quizResult: 'frequentTraveler',
  geolocation: {
    city: 'Manaus',
    state: 'Amazonas',
    country: 'Brasil',
    latitude: -3.119028,
    longitude: -60.021731,
    accuracy: 100,
    source: 'gps'
  }
});
```

**Resultado no Banco:**
- ✅ Linha criada em `leads` (visitor_id vinculado)
- ✅ Linha criada em `lead_consents`
- ✅ `quiz_attempts` ATUALIZADO com lead_id (vincula quiz anterior)
- ✅ `poll_submissions` PODE SER ATUALIZADO com lead_id (se necessário)
- ✅ Evento registrado em `funnel_events` (form_submit)

---

## 📊 Queries Úteis

### Total de Leads por Perfil
```sql
SELECT 
  profile_type,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads), 2) as percentage
FROM leads
GROUP BY profile_type
ORDER BY total DESC;
```

### Top 10 Funcionalidades Mais Votadas
```sql
SELECT 
  option_key,
  COUNT(*) as votes,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM poll_submission_items), 2) as percentage
FROM poll_submission_items
GROUP BY option_key
ORDER BY votes DESC
LIMIT 10;
```

### Taxa de Conversão do Funil
```sql
-- Usar a view pré-definida:
SELECT * FROM stats_funnel_conversion;
```

### Leads por Estado
```sql
SELECT 
  geo_state,
  COUNT(*) as leads_count,
  COUNT(DISTINCT geo_city) as cities_count
FROM leads
WHERE geo_state IS NOT NULL
GROUP BY geo_state
ORDER BY leads_count DESC;
```

### Histórico Completo de um Visitante
```sql
-- Substitua 'visitor_123' pelo visitor_id real
SELECT 
  'visitor' as type,
  first_visit_at as timestamp,
  NULL as detail
FROM visitors
WHERE visitor_id = 'visitor_123'

UNION ALL

SELECT 
  'session' as type,
  started_at as timestamp,
  language as detail
FROM visitor_sessions
WHERE visitor_id = 'visitor_123'

UNION ALL

SELECT 
  'lead' as type,
  created_at as timestamp,
  email as detail
FROM leads
WHERE visitor_id = 'visitor_123'

UNION ALL

SELECT 
  'quiz' as type,
  completed_at as timestamp,
  result_profile as detail
FROM quiz_attempts
WHERE visitor_id = 'visitor_123'

UNION ALL

SELECT 
  'poll' as type,
  submitted_at as timestamp,
  suggestions as detail
FROM poll_submissions
WHERE visitor_id = 'visitor_123'

UNION ALL

SELECT 
  event_type as type,
  occurred_at as timestamp,
  event_label as detail
FROM funnel_events
WHERE visitor_id = 'visitor_123'

ORDER BY timestamp;
```

---

## ⚠️ Atenção: Dados Antigos

Se você já tinha dados no **kv_store_63010152**, eles **NÃO serão migrados automaticamente**.

### Opções:

1. **Começar do Zero (Recomendado para MVP)**
   - Delete a tabela antiga `kv_store_63010152`
   - Comece a usar o schema relacional

2. **Migrar Dados Manualmente (Se necessário)**
   - Crie um script de migração que:
     1. Leia todos os registros de `kv_store_63010152`
     2. Parse o JSON de cada `value`
     3. Insira nas novas tabelas relacionais
   - Exemplo: `/scripts/migrate-kv-to-relational.ts` (você precisaria criar)

3. **Manter Ambos Temporariamente**
   - Use o schema relacional para novos dados
   - Mantenha o KV Store apenas para consulta de dados históricos

---

## ✅ Checklist de Migração

- [ ] Execute o SQL no Supabase Dashboard
- [ ] Verifique que as 10 tabelas foram criadas
- [ ] Teste o health check: `checkHealth()` retorna `model: 'supabase-relational'`
- [ ] Teste cadastro de lead: `subscribeNewsletter()`
- [ ] Teste enquete: `submitPoll()`
- [ ] Teste quiz: `startQuiz()`, `saveQuizAnswer()`, `completeQuiz()`
- [ ] Verifique analytics: `getAnalyticsOverview()`
- [ ] Atualize o Dashboard Admin para usar as novas tabelas
- [ ] Atualize os exports CSV para usar as novas tabelas
- [ ] Delete ou renomeie `kv_store_63010152` (opcional)
- [ ] Atualize a documentação interna do time

---

## 🎉 Pronto!

Sua plataforma Via Fluvial agora usa um schema relacional profissional, escalável e performático!

Se tiver dúvidas, consulte:
- `/ARQUITETURA-ATUAL.md` - Documentação da arquitetura
- `/DATABASE-DIAGRAM.md` - Diagrama visual do schema
- `/supabase-relational-schema.sql` - SQL completo

---

**Migrado em:** 2026-03-28  
**Por:** Assistente Figma Make  
**Status:** ✅ Concluído
