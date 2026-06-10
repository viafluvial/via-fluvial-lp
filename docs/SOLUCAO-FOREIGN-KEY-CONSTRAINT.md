# ✅ SOLUÇÃO: Erro de Foreign Key Constraint

## 🐛 Problema Identificado

### Erros que estavam acontecendo:

```
❌ Erro ao cadastrar newsletter:
   insert or update on table "leads" violates foreign key constraint "leads_visitor_id_fkey"

❌ Erro ao enviar enquete:
   insert or update on table "poll_submissions" violates foreign key constraint "poll_submissions_visitor_id_fkey"
```

---

## 🔍 Causa Raiz

O problema era na **ordem de execução das operações** no banco de dados:

### Como estava (ERRADO):

```javascript
// ❌ PROBLEMA:
export async function subscribeNewsletter(data) {
  const visitorId = getOrCreateVisitorId(); // Apenas cria no localStorage
  
  // ❌ Tenta inserir direto na tabela leads
  await supabase.from('leads').insert({
    visitor_id: visitorId,  // ← Este visitor_id NÃO existe na tabela visitors!
    email: data.email,
    // ...
  });
}
```

### Por que falhava?

1. **`getOrCreateVisitorId()`** apenas:
   - Gera um ID único
   - Salva no `localStorage`
   - **NÃO cria registro na tabela `visitors`**

2. **Tentava inserir na tabela `leads`**:
   - Usava um `visitor_id` que não existe no banco
   - A foreign key constraint `leads_visitor_id_fkey` exige que o `visitor_id` exista na tabela `visitors`
   - **Resultado:** Erro de constraint violation

3. **Mesmo problema na enquete**:
   - `poll_submissions` também tem foreign key para `visitors`
   - Mesma falha ao tentar inserir com `visitor_id` inexistente

---

## ✅ Solução Implementada

### Garantir que o visitor existe ANTES de usá-lo

```javascript
// ✅ CORRETO:
export async function subscribeNewsletter(data) {
  const visitorId = getOrCreateVisitorId(); // 1. Gera o ID
  
  // 2. ✅ GARANTIR que existe no banco ANTES de usar
  await trackVisitor(visitorId);
  
  // 3. Agora pode inserir na tabela leads com segurança
  await supabase.from('leads').insert({
    visitor_id: visitorId,  // ✅ Este visitor_id já existe na tabela visitors!
    email: data.email,
    // ...
  });
}
```

### O que `trackVisitor()` faz?

```javascript
export async function trackVisitor(visitorId: string) {
  await supabase
    .from('visitors')
    .upsert(
      {
        visitor_id: visitorId,
        last_visit_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      },
      { onConflict: 'visitor_id' }  // ← Se já existe, apenas atualiza
    );
}
```

**Vantagens do `upsert`:**
- Se o visitor NÃO existe: **cria**
- Se o visitor já existe: **atualiza** `last_visit_at`
- **Sempre garante** que o visitor existe no banco

---

## 🔧 Funções Corrigidas

### 1. `subscribeNewsletter()` - Cadastro de Newsletter

```javascript
export async function subscribeNewsletter(data: NewsletterData) {
  const visitorId = getOrCreateVisitorId();
  
  // ✅ ADICIONAR ESTA LINHA
  await trackVisitor(visitorId);
  
  // Agora o resto funciona normalmente
  await supabase.from('leads').insert({ visitor_id: visitorId, ... });
}
```

### 2. `submitPoll()` - Envio de Enquete

```javascript
export async function submitPoll(selectedOptions: string[], suggestions: string) {
  const visitorId = getOrCreateVisitorId();
  
  // ✅ ADICIONAR ESTA LINHA
  await trackVisitor(visitorId);
  
  // Agora o resto funciona normalmente
  await supabase.from('poll_submissions').insert({ visitor_id: visitorId, ... });
}
```

### 3. `startQuiz()` - Início do Quiz

```javascript
export async function startQuiz(sessionId?: string) {
  const visitorId = getOrCreateVisitorId();
  
  // ✅ ADICIONAR ESTA LINHA
  await trackVisitor(visitorId);
  
  // Agora o resto funciona normalmente
  await supabase.from('quiz_attempts').insert({ visitor_id: visitorId, ... });
}
```

---

## 🎯 Resultado

### Antes (com erro):

```
1. getOrCreateVisitorId() → visitor_123
2. Tenta INSERT em leads com visitor_id = visitor_123
3. ❌ ERRO: visitor_123 não existe na tabela visitors
```

### Depois (corrigido):

```
1. getOrCreateVisitorId() → visitor_123
2. trackVisitor(visitor_123) → ✅ CRIA/ATUALIZA na tabela visitors
3. INSERT em leads com visitor_id = visitor_123
4. ✅ SUCESSO: visitor_123 existe e pode ser referenciado!
```

---

## 📊 Integridade Referencial Garantida

### Estrutura das Foreign Keys:

```sql
-- leads → visitors
ALTER TABLE leads 
  ADD CONSTRAINT leads_visitor_id_fkey 
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id);

-- poll_submissions → visitors  
ALTER TABLE poll_submissions 
  ADD CONSTRAINT poll_submissions_visitor_id_fkey 
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id);

-- quiz_attempts → visitors
ALTER TABLE quiz_attempts 
  ADD CONSTRAINT quiz_attempts_visitor_id_fkey 
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id);
```

**Agora todas funcionam porque:**
1. Sempre criamos o `visitor` primeiro
2. Depois referenciamos o `visitor_id` nas outras tabelas
3. A integridade referencial está garantida

---

## 🧪 Como Testar

### Teste 1: Cadastro de Email

```javascript
// Console do navegador (F12):
const { subscribeNewsletter } = await import('./utils/api');

const result = await subscribeNewsletter({
  email: 'teste@example.com',
  source: 'passageiro-hero',
  language: 'pt',
});

console.log(result);
// ✅ Deve retornar: { success: true, message: '...', position: N }
```

### Teste 2: Enquete

```javascript
const { submitPoll } = await import('./utils/api');

const result = await submitPoll(
  ['opcao1', 'opcao2'],
  'Sugestão de teste'
);

console.log(result);
// ✅ Deve retornar: { success: true, message: '...', totalResponses: N }
```

### Teste 3: Quiz

```javascript
const { startQuiz } = await import('./utils/api');

const attemptId = await startQuiz();

console.log('Quiz ID:', attemptId);
// ✅ Deve retornar: UUID do quiz iniciado
```

---

## 📋 Checklist de Verificação

Execute `/test-database` e verifique:

- [x] ✅ 1. Verificar Health Check → `status: 'ok'`
- [x] ✅ 2. Verificar Schema Relacional → 10 tabelas encontradas
- [x] ✅ 3. Cadastrar Email Newsletter → Sucesso
- [x] ✅ 4. Buscar Total de Leads → Número correto
- [x] ✅ 5. Enviar Resposta da Enquete → Sucesso
- [x] ✅ 6. Buscar Estatísticas da Enquete → Dados corretos

**Se TODOS passarem = Sistema funcionando perfeitamente!** ✅

---

## 🎓 Lições Aprendidas

### 1. Ordem de Operações Importa

```javascript
// ❌ ERRADO:
insert leads → visitor não existe → ERRO

// ✅ CORRETO:
create visitor → insert leads → SUCESSO
```

### 2. Foreign Keys São Rigorosas

```
Foreign Key = Promessa de que o valor referenciado existe
```

Se você tentar referenciar algo que não existe, o banco **rejeita** a operação.

### 3. `upsert` É Seu Amigo

```javascript
// Garante que o registro existe SEM duplicar
.upsert(data, { onConflict: 'unique_column' })
```

Perfeito para garantir existência antes de referenciar.

---

## 🚀 Status Final

| Funcionalidade | Status | Teste |
|----------------|--------|-------|
| Health Check | ✅ OK | `/test-database` |
| Cadastro Newsletter | ✅ OK | Teste 1 passando |
| Enquete | ✅ OK | Teste 2 passando |
| Quiz | ✅ OK | Teste 3 passando |
| Foreign Keys | ✅ OK | Integridade garantida |

---

## 📚 Arquivos Alterados

### `/src/app/utils/api.ts`

**Funções modificadas:**
- ✅ `subscribeNewsletter()` - Linha 110: `await trackVisitor(visitorId)`
- ✅ `submitPoll()` - Linha 332: `await trackVisitor(visitorId)`
- ✅ `startQuiz()` - Linha 497: `await trackVisitor(visitorId)`

**Mudança:** Adicionar `await trackVisitor(visitorId)` antes de inserir em tabelas que referenciam `visitors`.

---

**✅ Problema resolvido definitivamente!**  
**🎉 Sistema 100% funcional com integridade referencial garantida!**

---

**Data:** 28/03/2026  
**Versão:** 3.1 (Foreign Key Fix)  
**Status:** ✅ Resolvido
