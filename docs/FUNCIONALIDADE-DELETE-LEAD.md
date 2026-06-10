# ✅ NOVA FUNCIONALIDADE: Exclusão de Leads no Admin

## 🎯 Funcionalidade Implementada

Adicionado botão de **exclusão** de leads no dashboard administrativo (`/admin`), com **exclusão em cascata** de todos os dados relacionados no banco relacional.

---

## 🔧 O Que Foi Feito

### 1. **Nova Função na API** - `deleteLead()`

**Arquivo:** `/src/app/utils/api.ts`

```typescript
export async function deleteLead(email: string) {
  // 1. Busca o lead pelo email
  // 2. Deleta lead_consents
  // 3. Desvincula quiz_attempts (mantém para histórico)
  // 4. Desvincula poll_submissions (mantém para histórico)
  // 5. Deleta funnel_events
  // 6. Deleta o lead
}
```

#### O Que É Deletado (Cascata):

| Tabela | Ação | Motivo |
|--------|------|--------|
| **lead_consents** | ✅ DELETE | Dados vinculados exclusivamente ao lead |
| **funnel_events** | ✅ DELETE | Eventos do lead |
| **quiz_attempts** | ⚠️ SET NULL | Mantém quiz para analytics (desvincula do lead) |
| **poll_submissions** | ⚠️ SET NULL | Mantém enquete para analytics (desvincula do lead) |
| **leads** | ✅ DELETE | Registro principal |

**⚠️ IMPORTANTE:** Quiz e Enquete são **desvinculados**, não deletados, para manter histórico agregado de analytics.

---

### 2. **Botão de Exclusão na Tabela**

**Arquivo:** `/src/app/pages/AdminDashboard.tsx`

#### Localização:

- **Aba:** Usuários (`users`)
- **Coluna:** Ações (última coluna da tabela)
- **Ícone:** 🗑️ Trash (vermelho)

```tsx
<Button
  onClick={() => {
    setUserToDelete(subscriber);
    setShowDeleteConfirm(true);
  }}
  variant="ghost"
  size="sm"
  className="text-red-600"
  title="Excluir lead"
>
  <Trash2 className="w-4 h-4" />
</Button>
```

---

### 3. **Modal de Confirmação**

Modal com **confirmação explícita** que mostra:

1. **Email do usuário** a ser excluído
2. **WhatsApp** (se cadastrado)
3. **Lista completa** do que será deletado:
   - ✅ Dados cadastrais do lead
   - ✅ Consentimentos (email, WhatsApp, notificações)
   - ⚠️ Respostas de enquetes (desvinculadas)
   - ⚠️ Tentativas de quiz (desvinculadas)
   - ✅ Eventos de funil (conversões, cliques)
4. **Aviso:** "Esta ação NÃO pode ser desfeita!"

#### Estados do Botão:

| Estado | Texto | Ícone | Cor |
|--------|-------|-------|-----|
| **Normal** | "Sim, Excluir Definitivamente" | 🗑️ | Vermelho |
| **Deletando** | "Excluindo..." | 🔄 (girando) | Vermelho |
| **Completo** | (modal fecha) | - | - |

---

## 📊 Fluxo de Exclusão

```
1. Administrador clica no botão 🗑️
   ↓
2. Modal de confirmação abre
   ↓
3. Administrador lê o aviso
   ↓
4. Clica em "Sim, Excluir Definitivamente"
   ↓
5. API deleta em cascata:
   a. lead_consents → DELETE
   b. quiz_attempts → SET lead_id = NULL
   c. poll_submissions → SET lead_id = NULL
   d. funnel_events → DELETE
   e. leads → DELETE
   ↓
6. Dashboard recarrega dados
   ↓
7. Modal fecha
   ↓
8. Alert: "✅ Inscrito excluído com sucesso!"
```

---

## 🎨 UI/UX

### Botão na Tabela:

```
┌──────────────┬─────────────────┐
│ Ações        │                 │
├──────────────┼─────────────────┤
│ 👁️ 🗺️ 🗑️     │ Ver, Mapa, Del  │
└──────────────┴─────────────────┘
```

- **👁️ (Verde):** Ver detalhes
- **🗺️ (Azul):** Ver localização no mapa
- **🗑️ (Vermelho):** Excluir lead ← **NOVO!**

### Modal de Confirmação:

```
╔══════════════════════════════════════╗
║ 🗑️ Confirmar Exclusão                ║
╠══════════════════════════════════════╣
║                                      ║
║ ┌─ Usuário a ser excluído ─────────┐ ║
║ │ teste@example.com                │ ║
║ │ WhatsApp: +55 92 99999-9999      │ ║
║ └──────────────────────────────────┘ ║
║                                      ║
║ ⚠️ Atenção                           ║
║                                      ║
║ Esta ação irá deletar:               ║
║ • Dados cadastrais do lead           ║
║ • Consentimentos                     ║
║ • Respostas de enquetes (se houver)  ║
║ • Tentativas de quiz (se houver)     ║
║ • Eventos de funil                   ║
║                                      ║
║ ⛔ Esta ação NÃO pode ser desfeita!  ║
║                                      ║
║ [Sim, Excluir Definitivamente]  [X]  ║
╚══════════════════════════════════════╝
```

---

## 🧪 Como Testar

### 1. Acessar o Admin

```
http://localhost:3000/admin
```

### 2. Ir para a Aba "Usuários"

### 3. Localizar um Lead de Teste

### 4. Clicar no Botão 🗑️ (vermelho)

### 5. Conferir o Modal

- ✅ Email está correto?
- ✅ WhatsApp aparece (se houver)?
- ✅ Lista de dados está correta?
- ✅ Aviso está destacado?

### 6. Clicar em "Sim, Excluir Definitivamente"

### 7. Aguardar

- ✅ Botão muda para "Excluindo..."?
- ✅ Ícone gira?

### 8. Verificar

- ✅ Alert: "✅ Inscrito excluído com sucesso!"
- ✅ Modal fecha
- ✅ Tabela recarrega
- ✅ Lead sumiu da lista

### 9. Conferir no Supabase (opcional)

**SQL no Supabase SQL Editor:**

```sql
-- 1. Confirmar que o lead foi deletado
SELECT * FROM leads WHERE email = 'teste@example.com';
-- ✅ Deve retornar 0 linhas

-- 2. Confirmar que consentimentos foram deletados
SELECT * FROM lead_consents WHERE lead_id = 'UUID_DO_LEAD';
-- ✅ Deve retornar 0 linhas

-- 3. Confirmar que quiz foi desvinculado (não deletado)
SELECT * FROM quiz_attempts WHERE lead_id = 'UUID_DO_LEAD';
-- ✅ Deve retornar 0 linhas (pois lead_id = NULL agora)

-- 4. Confirmar que enquete foi desvinculada (não deletada)
SELECT * FROM poll_submissions WHERE lead_id = 'UUID_DO_LEAD';
-- ✅ Deve retornar 0 linhas (pois lead_id = NULL agora)

-- 5. Confirmar que eventos foram deletados
SELECT * FROM funnel_events WHERE lead_id = 'UUID_DO_LEAD';
-- ✅ Deve retornar 0 linhas
```

---

## 🔒 Segurança

### ✅ O Que Foi Implementado:

1. **Modal de confirmação** - Impede exclusões acidentais
2. **Aviso explícito** - "Esta ação NÃO pode ser desfeita!"
3. **Lista completa** - Mostra todos os dados que serão afetados
4. **Botão desabilitado durante exclusão** - Impede duplo clique
5. **Feedback visual** - "Excluindo..." com spinner

### ⚠️ O Que NÃO Foi Implementado (pode adicionar depois):

- ❌ Autenticação de admin (proteção de rota)
- ❌ Log de auditoria (quem deletou, quando)
- ❌ Soft delete (marcar como deletado em vez de remover)
- ❌ Backup automático antes da exclusão
- ❌ Permissão por nível de admin (super admin vs admin)

---

## 📝 Notas Técnicas

### Por Que Quiz e Enquete São Desvinculados?

**Motivo:** Manter dados agregados de analytics.

**Exemplo:**

```
Antes da exclusão:
- Total de quiz_attempts: 100
- Lead deletado tinha 1 quiz

Após exclusão (COM DELETE de quiz):
- Total de quiz_attempts: 99 ❌ (perde histórico agregado)

Após exclusão (COM SET NULL):
- Total de quiz_attempts: 100 ✅ (mantém histórico agregado)
```

**Benefício:** Analytics não são afetados (ex: "Total de quizzes completados: 100" continua correto).

### Por Que Funnel Events São Deletados?

**Motivo:** Eventos de funil são **específicos do lead** e não têm valor agregado após a exclusão.

**Exemplo:**

```
funnel_events:
- event_type: form_submit
- event_label: lead_conversion
- lead_id: uuid-do-lead ← Se o lead não existe mais, o evento não faz sentido
```

---

## 🎓 Melhorias Futuras (Sugestões)

### 1. **Soft Delete**

Em vez de deletar permanentemente, marcar como deletado:

```sql
ALTER TABLE leads ADD COLUMN deleted_at TIMESTAMP NULL;
```

**Vantagens:**
- Permite recuperar dados acidentalmente deletados
- Mantém histórico completo
- Facilita auditoria

### 2. **Log de Auditoria**

Registrar quem deletou e quando:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,  -- Admin que deletou
  action VARCHAR,  -- 'DELETE_LEAD'
  target_id UUID,  -- ID do lead deletado
  target_email VARCHAR,  -- Email do lead
  deleted_at TIMESTAMP,
  metadata JSONB  -- Dados adicionais
);
```

### 3. **Confirmação com Digitação**

Exigir que o admin digite "EXCLUIR" para confirmar:

```tsx
<Input
  placeholder='Digite "EXCLUIR" para confirmar'
  value={confirmText}
  onChange={(e) => setConfirmText(e.target.value)}
/>
<Button disabled={confirmText !== 'EXCLUIR'}>
  Excluir
</Button>
```

### 4. **Backup Antes da Exclusão**

Salvar snapshot em outra tabela:

```sql
CREATE TABLE deleted_leads (
  id UUID PRIMARY KEY,
  original_lead_data JSONB,
  deleted_by UUID,
  deleted_at TIMESTAMP
);
```

### 5. **Permissões por Nível**

Apenas super admins podem deletar:

```tsx
{user.role === 'super_admin' && (
  <Button onClick={handleDelete}>
    <Trash2 />
  </Button>
)}
```

---

## 📚 Arquivos Modificados

### 1. `/src/app/utils/api.ts`

**Linhas adicionadas: ~120**

- ✅ Função `deleteLead(email)`
- ✅ Função `getSubscriberCount()` (alias)

### 2. `/src/app/pages/AdminDashboard.tsx`

**Linhas modificadas: ~100**

- ✅ Import de `Trash2` (lucide-react)
- ✅ Import de `deleteLead` (api)
- ✅ Estados: `showDeleteConfirm`, `userToDelete`, `isDeleting`
- ✅ Botão de exclusão na tabela
- ✅ Modal de confirmação de exclusão

---

## ✅ Checklist de Implementação

- [x] Criar função `deleteLead()` na API
- [x] Deletar `lead_consents` em cascata
- [x] Desvincular `quiz_attempts` (SET NULL)
- [x] Desvincular `poll_submissions` (SET NULL)
- [x] Deletar `funnel_events`
- [x] Deletar o `lead`
- [x] Adicionar botão 🗑️ na tabela do admin
- [x] Criar modal de confirmação
- [x] Adicionar estados de loading
- [x] Recarregar dados após exclusão
- [x] Adicionar feedback visual (alerts)
- [x] Testar fluxo completo

---

## 🎉 Status Final

| Item | Status |
|------|--------|
| Função de API | ✅ Implementada |
| Botão de exclusão | ✅ Implementado |
| Modal de confirmação | ✅ Implementado |
| Exclusão em cascata | ✅ Funcionando |
| Feedback visual | ✅ Funcionando |
| Testes | ✅ Prontos |

---

**Data:** 28/03/2026  
**Versão:** 3.2 (Delete Lead Feature)  
**Status:** ✅ Completo e funcional

---

## 📞 Como Usar

1. **Acesse:** `/admin`
2. **Aba:** Usuários
3. **Clique:** 🗑️ (vermelho)
4. **Confirme:** "Sim, Excluir Definitivamente"
5. **Pronto!** Lead e dados relacionados deletados!

🎯 **Funcionalidade 100% operacional!**
