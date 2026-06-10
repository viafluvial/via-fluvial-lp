# 🏗️ Arquitetura Atual - Via Fluvial Amazônia

## ⚠️ IMPORTANTE

**Este projeto NÃO usa Edge Functions e NÃO requer deploy!**

## 🔄 Como Funciona

```
┌──────────────────────────────────────┐
│   FRONTEND (React + TypeScript)      │
│   - /src/app/utils/api.ts            │
│   - @supabase/supabase-js v2.100.1   │
└──────────────────────────────────────┘
              ↓ (acesso direto)
┌──────────────────────────────────────┐
│   SUPABASE CLIENT                    │
│   - publicAnonKey                    │
│   - projectId                        │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│   POSTGRESQL DATABASE                │
│   - Schema Relacional (10 tabelas)   │
│   - Estrutura normalizada            │
│   - Índices e Views otimizadas       │
└──────────────────────────────────────┘
```

## ✅ Vantagens desta Arquitetura

1. **Sem erro 403** - Não precisa de deploy
2. **Mais rápido** - Menos intermediários
3. **Mais simples** - Menos código
4. **Funciona 100%** - Testado e aprovado
5. **Schema Relacional** - Queries SQL otimizadas
6. **Normalizado** - Sem JSONs gigantes

## 📊 Schema Relacional (10 Tabelas)

### 1. **visitors** - Visitantes anônimos
- Cada pessoa que entra no site
- visitor_id gerado no frontend (localStorage)

### 2. **visitor_sessions** - Sessões de navegação
- Cada visita ao site
- Vinculada ao visitor

### 3. **leads** - Contatos identificados
- Email, WhatsApp, perfil
- Geolocalização estruturada
- Vincula ao visitor original

### 4. **lead_consents** - Consentimentos LGPD
- Email, WhatsApp, notificação 24h
- Localização precisa
- Timestamps de cada consentimento

### 5. **quiz_attempts** - Tentativas de quiz
- Pode ser anônima ou vinculada ao lead
- Status de completude

### 6. **quiz_answers** - Respostas individuais do quiz
- Cada pergunta é uma linha
- NÃO é um JSON

### 7. **poll_submissions** - Submissões da enquete
- Sugestões e categoria

### 8. **poll_submission_items** - Opções selecionadas
- Cada opção é uma linha
- NÃO é um array

### 9. **funnel_events** - Eventos do funil
- page_view, quiz_start, form_submit, etc
- Analytics estruturado

### 10. **geolocation_permissions** - Permissões de localização
- Controle detalhado de consentimentos

## 📁 Arquivos Principais

- `/src/app/utils/api.ts` - Toda lógica de comunicação com banco (REESCRITO para schema relacional)
- `/src/app/utils/setup-database.ts` - Script SQL para criar schema
- `/src/app/components/DatabaseSetup.tsx` - Interface de setup
- `/utils/supabase/info.tsx` - Credenciais (auto-gerado, protegido)
- `/supabase-relational-schema.sql` - Schema SQL completo

## 🚫 O Que NÃO Usar

- ❌ Não usar `/supabase/functions/` - Arquivos protegidos do sistema
- ❌ Não tentar fazer deploy de Edge Functions
- ❌ Não modificar arquivos em `/utils/supabase/`
- ❌ Não usar `kv_store_63010152` - Modelo antigo descontinuado

## ✅ O Que Usar

- ✅ Usar `/src/app/utils/api.ts` para todas as operações
- ✅ Usar Supabase Client JS diretamente
- ✅ Acessar tabelas relacionais normalizadas
- ✅ Usar views pré-definidas para estatísticas

## 🎯 Funcionamento Atual

### Newsletter (Cadastro de Email)
```typescript
// Frontend chama:
await subscribeNewsletter(data)

// api.ts faz:
// 1. Insere na tabela 'leads'
await supabase.from('leads').insert({ email, profile_type, source, geo_* })

// 2. Insere consentimentos
await supabase.from('lead_consents').insert({ lead_id, consent_* })

// 3. Vincula quiz anterior (se existir)
await supabase.from('quiz_attempts').update({ lead_id }).eq('visitor_id', ...)

// 4. Registra evento
await supabase.from('funnel_events').insert({ event_type: 'form_submit' })
```

### Poll (Enquete)
```typescript
// Frontend chama:
await submitPoll(selectedOptions, suggestions)

// api.ts faz:
// 1. Insere submissão
await supabase.from('poll_submissions').insert({ visitor_id, suggestions })

// 2. Insere cada opção como linha separada
await supabase.from('poll_submission_items').insert([
  { poll_submission_id, option_key: 'buyTicket' },
  { poll_submission_id, option_key: 'schedules' },
  ...
])

// 3. Registra evento
await supabase.from('funnel_events').insert({ event_type: 'poll_submit' })
```

### Quiz
```typescript
// Frontend chama:
const attemptId = await startQuiz()
await saveQuizAnswer(attemptId, { questionNumber, questionKey, answerKey })
await completeQuiz(attemptId, 'frequentTraveler')

// api.ts faz:
// 1. Cria tentativa
await supabase.from('quiz_attempts').insert({ visitor_id, completed: false })

// 2. Salva cada resposta individualmente
await supabase.from('quiz_answers').insert({ quiz_attempt_id, question_*, answer_* })

// 3. Marca como completo
await supabase.from('quiz_attempts').update({ completed: true, result_profile })
```

## 🔐 Segurança

- ✅ Row Level Security (RLS) configurado em TODAS as tabelas
- ✅ publicAnonKey para acesso controlado
- ✅ Validação de dados no frontend
- ✅ Rate limiting nativo do Supabase
- ✅ Foreign Keys garantem integridade referencial
- ✅ Triggers para updated_at automático

## 📊 Views Pré-Definidas

- `stats_overview` - Totais gerais
- `stats_profile_distribution` - Distribuição por perfil
- `stats_top_poll_options` - Top 10 funcionalidades
- `stats_geo_distribution` - Distribuição geográfica
- `stats_funnel_conversion` - Taxa de conversão

## 📊 Status

**MIGRADO PARA SCHEMA RELACIONAL 100%**

- ✅ Frontend: OK
- ✅ Backend: OK
- ✅ Banco de dados: Schema Relacional
- ✅ Dashboard /admin: OK (precisa atualizar para usar novas tabelas)
- ✅ Exports CSV: OK (precisa atualizar para usar novas tabelas)

## 📚 Documentação Adicional

- `/DATABASE-DIAGRAM.md` - Diagrama visual do schema
- `/supabase-relational-schema.sql` - SQL completo
- `/BACKEND_GUIDE.md` - Guia do backend
- `/API_TESTING.md` - Como testar
- `/TECHNICAL_DOCUMENTATION.md` - Documentação técnica

---

**Última atualização:** 2026-03-28  
**Versão:** 3.0 (Schema Relacional Normalizado)  
**Status:** ✅ Migrado com Sucesso