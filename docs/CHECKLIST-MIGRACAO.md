# ✅ Checklist de Migração - Schema Relacional

## 🎯 Status Geral: CÓDIGO MIGRADO ✅

---

## 📦 Arquivos Criados/Modificados

### ✏️ Arquivos Reescritos
- [x] `/src/app/utils/api.ts` - REESCRITO para schema relacional
- [x] `/src/app/utils/setup-database.ts` - REESCRITO com SQL das 10 tabelas
- [x] `/src/app/components/DatabaseSetup.tsx` - ATUALIZADO interface

### 📝 Documentação Atualizada
- [x] `/ARQUITETURA-ATUAL.md` - Documentação completa atualizada
- [x] `/RESUMO-MIGRACAO.md` - Resumo executivo (NOVO)
- [x] `/MIGRATION-KV-TO-RELATIONAL.md` - Guia detalhado (NOVO)
- [x] `/README-SCHEMA-RELACIONAL.md` - README completo (NOVO)
- [x] `/CHECKLIST-MIGRACAO.md` - Este arquivo (NOVO)

### ✅ Arquivos Que Já Existiam (Não Modificados)
- [x] `/supabase-relational-schema.sql` - SQL completo (já estava pronto)
- [x] `/DATABASE-DIAGRAM.md` - Diagrama visual (já estava pronto)

---

## 🗄️ Setup do Banco de Dados

### Passo 1: Executar SQL no Supabase
- [ ] Acessar Supabase Dashboard SQL Editor
- [ ] Copiar conteúdo de `/supabase-relational-schema.sql`
- [ ] Colar no SQL Editor
- [ ] Clicar em "Run"
- [ ] Confirmar: ✅ Success (no errors)

**Link direto:**
```
https://supabase.com/dashboard/project/ibwprzjqvegzepphznkm/sql/new
```

### Passo 2: Verificar Tabelas Criadas
- [ ] Executar query de verificação:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'visitors',
    'visitor_sessions',
    'leads',
    'lead_consents',
    'quiz_attempts',
    'quiz_answers',
    'poll_submissions',
    'poll_submission_items',
    'funnel_events',
    'geolocation_permissions'
  )
ORDER BY table_name;
```
- [ ] Confirmar que retornou 10 tabelas

### Passo 3: Verificar Views
- [ ] Verificar views criadas:
```sql
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public'
  AND table_name LIKE 'stats_%'
ORDER BY table_name;
```
- [ ] Confirmar views: `stats_overview`, `stats_profile_distribution`, `stats_top_poll_options`, `stats_geo_distribution`, `stats_funnel_conversion`

---

## 🧪 Testes Funcionais

### Teste 1: Health Check
- [ ] Executar no console do navegador:
```javascript
import { checkHealth } from './utils/api';
const health = await checkHealth();
console.log(health);
// Esperado: { status: 'ok', model: 'supabase-relational', timestamp: ... }
```

### Teste 2: Visitor Tracking
- [ ] Verificar visitor_id no localStorage:
```javascript
import { getOrCreateVisitorId } from './utils/api';
const visitorId = getOrCreateVisitorId();
console.log('Visitor ID:', visitorId);
// Esperado: "visitor_1711622400_abc123"
```

### Teste 3: Cadastro de Lead
- [ ] Testar cadastro de newsletter:
```javascript
import { subscribeNewsletter } from './utils/api';
const result = await subscribeNewsletter({
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
console.log(result);
// Esperado: { success: true, message: '...', position: 1 }
```

### Teste 4: Buscar Total de Leads
- [ ] Verificar contador:
```javascript
import { getNewsletterCount } from './utils/api';
const total = await getNewsletterCount();
console.log('Total de leads:', total);
// Esperado: número >= 1
```

### Teste 5: Listar Leads
- [ ] Listar todos os leads:
```javascript
import { listNewsletterSubscribers } from './utils/api';
const { total, subscribers } = await listNewsletterSubscribers();
console.log('Total:', total);
console.log('Subscribers:', subscribers);
// Esperado: array com os leads cadastrados
```

### Teste 6: Submeter Enquete
- [ ] Testar submissão de poll:
```javascript
import { submitPoll } from './utils/api';
const result = await submitPoll(
  ['buyTicket', 'schedules', 'tracking'],
  'Gostaria de ver preços em tempo real'
);
console.log(result);
// Esperado: { success: true, message: '...', totalResponses: 1 }
```

### Teste 7: Estatísticas da Enquete
- [ ] Buscar stats do poll:
```javascript
import { getPollStats } from './utils/api';
const stats = await getPollStats();
console.log(stats);
// Esperado: { totalResponses, optionCounts, suggestionsCount, recentSuggestions }
```

### Teste 8: Quiz Completo
- [ ] Testar fluxo completo do quiz:
```javascript
import { startQuiz, saveQuizAnswer, completeQuiz } from './utils/api';

// Iniciar
const attemptId = await startQuiz();
console.log('Quiz iniciado:', attemptId);

// Responder
await saveQuizAnswer(attemptId, {
  questionNumber: 1,
  questionKey: 'question1',
  answerKey: 'option1',
  answerText: 'Viajo frequentemente'
});
console.log('Resposta salva');

// Completar
await completeQuiz(attemptId, 'frequentTraveler');
console.log('Quiz completo!');
// Esperado: Sem erros, logs de sucesso
```

### Teste 9: Analytics
- [ ] Buscar overview de analytics:
```javascript
import { getAnalyticsOverview } from './utils/api';
const overview = await getAnalyticsOverview();
console.log(overview);
// Esperado: { totalVisitors, totalLeads, completedQuizzes, pollResponses, ... }
```

### Teste 10: Distribuição de Perfis
- [ ] Buscar distribuição:
```javascript
import { getProfileDistribution } from './utils/api';
const distribution = await getProfileDistribution();
console.log(distribution);
// Esperado: { passageiro: X, barqueiro: Y, agencia: Z, outros: W }
```

---

## 🖥️ Testes de Interface

### Landing Page (/)
- [ ] Página carrega sem erros
- [ ] Formulário de newsletter funciona
- [ ] Contador de inscritos mostra valor correto
- [ ] Quiz funciona e salva respostas
- [ ] Enquete funciona e salva respostas
- [ ] Geolocalização é capturada (se permitido)

### Dashboard Admin (/admin)
- [ ] Dashboard carrega sem erros
- [ ] Mostra total de leads correto
- [ ] Mostra lista de leads
- [ ] Mostra estatísticas da enquete
- [ ] Gráficos carregam corretamente
- [ ] Export CSV funciona

### Test Database (/test-database)
- [ ] Página de teste carrega
- [ ] Componente DatabaseSetup mostra status correto
- [ ] Botão "Verificar" funciona
- [ ] Se schema existe: mostra ✅ com lista das 10 tabelas
- [ ] Se não existe: mostra ❌ com SQL para copiar

---

## 📊 Validação no Supabase Dashboard

### Verificar Dados nas Tabelas
- [ ] `visitors` - Tem registros de visitantes
- [ ] `visitor_sessions` - Tem registros de sessões
- [ ] `leads` - Tem registros de leads cadastrados
- [ ] `lead_consents` - Tem registros de consentimentos vinculados
- [ ] `quiz_attempts` - Tem registros de quiz (se testou)
- [ ] `quiz_answers` - Tem respostas individuais (se testou)
- [ ] `poll_submissions` - Tem submissões de enquete
- [ ] `poll_submission_items` - Tem opções selecionadas
- [ ] `funnel_events` - Tem eventos registrados
- [ ] `geolocation_permissions` - Tem permissões (se testou)

### Verificar Integridade Referencial
- [ ] Foreign Keys funcionando:
```sql
-- Lead deve ter visitor_id válido
SELECT l.email, v.visitor_id 
FROM leads l 
LEFT JOIN visitors v ON v.visitor_id = l.visitor_id
WHERE v.visitor_id IS NULL;
-- Esperado: 0 resultados

-- Consents devem ter lead_id válido
SELECT lc.id, l.email 
FROM lead_consents lc 
LEFT JOIN leads l ON l.id = lc.lead_id
WHERE l.id IS NULL;
-- Esperado: 0 resultados
```

### Verificar Views
- [ ] View `stats_overview` funciona:
```sql
SELECT * FROM stats_overview;
```

- [ ] View `stats_profile_distribution` funciona:
```sql
SELECT * FROM stats_profile_distribution;
```

- [ ] View `stats_top_poll_options` funciona:
```sql
SELECT * FROM stats_top_poll_options;
```

- [ ] View `stats_geo_distribution` funciona:
```sql
SELECT * FROM stats_geo_distribution;
```

- [ ] View `stats_funnel_conversion` funciona:
```sql
SELECT * FROM stats_funnel_conversion;
```

---

## 🧹 Limpeza (Opcional)

### Remover Tabela Antiga
- [ ] Confirmar que schema relacional está 100% funcional
- [ ] Fazer backup dos dados do kv_store (se necessário):
```sql
-- Exportar dados antigos (opcional)
COPY (SELECT * FROM kv_store_63010152) TO '/tmp/kv_store_backup.csv' WITH CSV HEADER;
```

- [ ] Renomear tabela antiga (método seguro):
```sql
ALTER TABLE kv_store_63010152 RENAME TO kv_store_63010152_OLD_BACKUP;
```

- [ ] OU deletar definitivamente (cuidado!):
```sql
DROP TABLE IF EXISTS kv_store_63010152 CASCADE;
```

---

## 📝 Ajustes Adicionais (Se Necessário)

### Dashboard Admin
- [ ] Revisar queries no AdminDashboard.tsx
- [ ] Ajustar visualizações para mostrar novos campos
- [ ] Testar filtros por perfil de usuário
- [ ] Testar exports CSV com novos dados

### Exports CSV
- [ ] Ajustar formato de export para usar JOINs
- [ ] Incluir campos de consentimento
- [ ] Incluir geolocalização estruturada

### Frontend
- [ ] Integrar rastreamento de visitante no App.tsx
- [ ] Registrar eventos de funil importantes
- [ ] Testar fluxo completo: visitante → quiz → enquete → lead

---

## 🎉 Conclusão

### ✅ Checklist Completo Quando:
- [ ] Todas as 10 tabelas criadas no Supabase
- [ ] Todos os testes funcionais passaram
- [ ] Interface funciona 100%
- [ ] Dashboard Admin mostra dados corretamente
- [ ] Sem erros no console do navegador
- [ ] Sem erros no console do Supabase
- [ ] Documentação revisada e compreendida

### 🚀 Sistema Pronto Para:
- [ ] Desenvolvimento contínuo
- [ ] Testes com usuários reais
- [ ] Produção (quando aprovado)

---

**Status da Migração:** ⏳ EM ANDAMENTO  
**Última Atualização:** 2026-03-28  
**Responsável:** Você (desenvolvedor)

---

## 📞 Precisa de Ajuda?

Consulte:
- `/README-SCHEMA-RELACIONAL.md` - README completo
- `/MIGRATION-KV-TO-RELATIONAL.md` - Guia detalhado
- `/ARQUITETURA-ATUAL.md` - Arquitetura atualizada
- `/DATABASE-DIAGRAM.md` - Diagrama visual
- `/TROUBLESHOOTING.md` - Resolução de problemas
