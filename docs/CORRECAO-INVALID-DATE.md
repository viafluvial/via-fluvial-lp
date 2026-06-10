# ✅ CORREÇÃO: "Invalid Date" nas Sugestões Recentes

## 🐛 Problema

No dashboard administrativo (`/admin`), na seção "Sugestões Recentes", aparecia:

```
Invalid Date
Invalid Date
```

## 🔍 Causa

A função `getPollStats()` estava retornando apenas as **strings das sugestões**, mas o AdminDashboard esperava **objetos com `suggestion` e `submittedAt`**.

### Como estava (ERRADO):

```javascript
// /src/app/utils/api.ts - linha 421-429
const { data: submissions } = await supabase
  .from('poll_submissions')
  .select('suggestions')  // ❌ Só pegava 'suggestions'
  .not('suggestions', 'is', null)
  .order('submitted_at', { ascending: false })
  .limit(10);

const recentSuggestions = 
  submissions?.map((s: any) => s.suggestions).filter(Boolean) || [];
  // ❌ Retornava: ['texto1', 'texto2', ...]
```

### O que o AdminDashboard esperava:

```javascript
// /src/app/pages/AdminDashboard.tsx - linha 528-536
<p className="text-gray-700 mb-2">{item.suggestion}</p>  {/* undefined! */}
<p className="text-sm text-gray-500">
  {new Date(item.submittedAt).toLocaleDateString(...)}  {/* undefined → Invalid Date! */}
</p>
```

**Problema:** `item` era uma string, não um objeto!

---

## ✅ Solução

### Mudança na função `getPollStats()`:

```javascript
// /src/app/utils/api.ts - linhas 420-436
const { data: submissions } = await supabase
  .from('poll_submissions')
  .select('suggestions, submitted_at')  // ✅ Agora pega AMBOS os campos
  .not('suggestions', 'is', null)
  .order('submitted_at', { ascending: false })
  .limit(10);

const recentSuggestions =
  submissions?.map((s: any) => ({
    suggestion: s.suggestions,      // ✅ Campo 'suggestion'
    submittedAt: s.submitted_at     // ✅ Campo 'submittedAt'
  })).filter(s => s.suggestion) || [];
  // ✅ Retorna: [{ suggestion: 'texto1', submittedAt: '2024-...' }, ...]
```

### Resultado:

Agora o AdminDashboard recebe objetos completos:

```javascript
{
  suggestion: "Quero mais rotas para Santarém",
  submittedAt: "2024-03-28T15:30:00Z"
}
```

E pode acessar:
- ✅ `item.suggestion` → "Quero mais rotas para Santarém"
- ✅ `item.submittedAt` → "28 de mar de 2024, 15:30"

---

## 🧪 Como Testar

### 1. Enviar uma sugestão na enquete:

Na landing page:
1. Preencha a enquete
2. Adicione uma sugestão no campo de texto
3. Envie

### 2. Verificar no admin:

Acesse `/admin` → Aba "Overview" → Seção "Sugestões Recentes"

**Antes:** "Invalid Date"  
**Agora:** Data formatada corretamente! ✅

Exemplo:
```
"Gostaria de ver mais rotas para Manaus"
28 de mar de 2024, 15:30
```

---

## 📊 Estrutura dos Dados

### Banco de dados (tabela `poll_submissions`):

| Campo | Tipo | Valor |
|-------|------|-------|
| `suggestions` | text | "Sugestão do usuário" |
| `submitted_at` | timestamp | 2024-03-28T15:30:00Z |

### API retorna (após correção):

```json
{
  "recentSuggestions": [
    {
      "suggestion": "Sugestão do usuário",
      "submittedAt": "2024-03-28T15:30:00Z"
    }
  ]
}
```

### AdminDashboard exibe:

```
Sugestão do usuário
28 de mar de 2024, 15:30
```

---

## ✅ Status

| Item | Status |
|------|--------|
| Formato de dados da API | ✅ Corrigido |
| Datas exibidas corretamente | ✅ Sim |
| "Invalid Date" removido | ✅ Sim |

---

**Data:** 28/03/2026  
**Arquivo alterado:** `/src/app/utils/api.ts` (linhas 420-436)  
**Status:** ✅ Corrigido
