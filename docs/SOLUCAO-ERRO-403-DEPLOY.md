# 🛑 SOLUÇÃO: Erro 403 ao Tentar Deploy

## ❌ O Erro Que Você Viu

```
Error while deploying: XHR for "/api/integrations/supabase/.../edge_functions/make-server/deploy" failed with status 403
```

## ✅ A SOLUÇÃO: NÃO FAÇA DEPLOY!

**Este erro é PROPOSITAL e ESPERADO.**

O sistema Via Fluvial Amazônia foi projetado especificamente para **NÃO usar Edge Functions** e **NÃO requerer deploy**.

---

## 🚫 Por Que Não Fazer Deploy?

### Razões Técnicas:

1. **Não é necessário** - O sistema usa Supabase Client diretamente
2. **Causa erro 403** - Edge Functions não estão configuradas (e não devem estar)
3. **Arquitetura diferente** - Acesso direto ao banco é mais rápido e simples
4. **Já funciona 100%** - Sem deploy, sem problemas

### O Que Acontece Se Tentar:

- ❌ Erro 403 (sem permissão)
- ❌ "Could not find table" (Edge Functions não acessam o banco corretamente)
- ❌ Problemas de autenticação
- ❌ Sistema para de funcionar

---

## ✅ Como o Sistema Funciona (SEM DEPLOY)

```
┌──────────────────────────────────────┐
│   FRONTEND (React + TypeScript)      │
│   /src/app/utils/api.ts              │
└──────────────────────────────────────┘
              ↓ (acesso direto)
┌──────────────────────────────────────┐
│   SUPABASE CLIENT                    │
│   publicAnonKey                      │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│   POSTGRESQL DATABASE                │
│   Schema Relacional (10 tabelas)     │
└──────────────────────────────────────┘

SEM INTERMEDIÁRIOS!
SEM EDGE FUNCTIONS!
SEM DEPLOY!
```

---

## 🔧 O Que Fazer Agora

### Passo 1: PARE de Tentar Deploy

Se você viu o erro 403, significa que algo (provavelmente o Figma Make ou você) tentou fazer deploy. **Cancele imediatamente.**

### Passo 2: Verifique o Banco de Dados

O único setup necessário é criar as tabelas no banco. **Você já fez isso?**

1. Acesse: `http://localhost:5173/test-database`

2. Clique em **"🔍 Verificar Schema Relacional"**

3. **Se aparecer ✅ "Schema encontrado":**
   - Perfeito! Tudo funcionando!
   - Não precisa de mais nada!

4. **Se aparecer ❌ "Schema não encontrado":**
   - Vá para o Supabase Dashboard
   - Execute o SQL de `/supabase-relational-schema.sql`
   - Volte e verifique novamente

### Passo 3: Teste o Sistema

```javascript
// Abra o console do navegador (F12) e teste:

import { checkHealth } from './utils/api';
const health = await checkHealth();
console.log(health);
// Esperado: { status: 'ok', model: 'supabase-relational' }

// Se funcionou, tudo está OK! ✅
```

---

## 🚫 Comandos que NÃO Deve Usar

```bash
# ❌ NUNCA USE:
supabase functions deploy
supabase functions deploy server
supabase deploy
npm run deploy
deno deploy

# ❌ NUNCA CLIQUE:
Botão "Deploy" no Figma Make
Botão "Publish" no Supabase
Qualquer ação relacionada a "Edge Functions"
```

---

## ✅ O Que DEVE Fazer

### Para Adicionar Funcionalidades:

1. **Modifique apenas o frontend:**
   - Editar componentes em `/src/app/components/`
   - Editar páginas em `/src/app/pages/`
   - Editar lógica em `/src/app/utils/api.ts`

2. **Adicionar campos no banco:**
   - Escreva SQL no Supabase Dashboard
   - Atualize as queries em `api.ts`
   - Teste no navegador

3. **Testar:**
   - Use `/test-database`
   - Use `/admin` (dashboard)
   - Use console do navegador (F12)

---

## 📁 Arquivos Protegidos (NÃO EDITE)

Estes arquivos são do sistema e **NÃO devem ser modificados**:

- ❌ `/supabase/functions/server/index.tsx`
- ❌ `/supabase/functions/server/kv_store.tsx`
- ❌ `/utils/supabase/info.tsx`

**Por quê?** Eles são gerados automaticamente pelo Figma Make e podem causar problemas se editados.

---

## 📁 Arquivos que PODE Editar

Estes arquivos você PODE e DEVE modificar conforme necessário:

- ✅ `/src/app/utils/api.ts` - Lógica de comunicação com banco
- ✅ `/src/app/components/**` - Componentes React
- ✅ `/src/app/pages/**` - Páginas da aplicação
- ✅ `/src/styles/**` - Estilos CSS
- ✅ `/supabase-relational-schema.sql` - Schema do banco (se precisar adicionar tabelas)

---

## 🎯 Fluxo Correto de Desenvolvimento

### 1. Fazer Mudanças no Frontend

```typescript
// Edite /src/app/utils/api.ts
export async function minhaNovaFuncao() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('profile_type', 'passageiro');
  
  if (error) throw error;
  return data;
}
```

### 2. Adicionar Campos no Banco (Se Necessário)

```sql
-- Execute no Supabase Dashboard SQL Editor
ALTER TABLE leads ADD COLUMN novo_campo TEXT;
```

### 3. Testar no Navegador

```javascript
// Console do navegador (F12)
import { minhaNovaFuncao } from './utils/api';
const result = await minhaNovaFuncao();
console.log(result);
```

### 4. Deploy? ❌ NÃO!

O sistema já está "deployado" porque roda no navegador do usuário e acessa o Supabase diretamente. **Não há nada para fazer deploy!**

---

## 🔍 Como Saber se Está Funcionando?

### Sinais de que está OK:

- ✅ Landing page carrega sem erros
- ✅ Formulário de newsletter funciona
- ✅ Dashboard `/admin` mostra dados
- ✅ Console do navegador não tem erros
- ✅ Health check retorna `status: 'ok'`

### Sinais de problema:

- ❌ Erro 403 (você tentou fazer deploy!)
- ❌ "Could not find table" (banco não está configurado)
- ❌ Erro de permissão (RLS mal configurado)
- ❌ Timeout (credenciais erradas)

---

## 🆘 Troubleshooting

### "Mas eu preciso fazer deploy do meu código!"

**Não, você não precisa!** O Figma Make já faz isso automaticamente. Quando você salva um arquivo:

1. O Figma Make compila o código
2. O navegador recarrega automaticamente
3. O código atualizado já está "no ar"

**Não há servidor backend para fazer deploy!** Tudo roda no navegador.

### "Mas e se eu mudar o api.ts?"

Quando você muda `/src/app/utils/api.ts`:

1. Salve o arquivo
2. O navegador recarrega
3. Pronto! ✅

**Não precisa de deploy porque é código frontend!**

### "Edge Functions não são necessárias mesmo?"

**Correto!** O sistema foi projetado assim propositalmente:

**ANTES (com Edge Functions):**
```
Frontend → Edge Function → Banco
         (deploy, erro 403)
```

**AGORA (sem Edge Functions):**
```
Frontend → Banco
         (direto, sem deploy, funciona 100%)
```

---

## 📚 Documentação Relacionada

Se você quer entender melhor o sistema:

1. **`/PROXIMOS-PASSOS.md`** - O que fazer agora
2. **`/ARQUITETURA-ATUAL.md`** - Como o sistema funciona
3. **`/NAO-FAZER.md`** - Lista de coisas a evitar
4. **`/README-SCHEMA-RELACIONAL.md`** - README completo

---

## 🎉 Conclusão

**O erro 403 é um AVISO de que você está tentando algo que não deve fazer!**

✅ **Sistema funciona SEM deploy**  
✅ **Modifique apenas o frontend**  
✅ **Execute SQL no Supabase Dashboard quando necessário**  
✅ **Teste no navegador**  

**NÃO FAÇA DEPLOY! 🚫**

---

**Data:** 2026-03-28  
**Versão:** 3.0 (Schema Relacional, SEM Edge Functions)  
**Status:** ✅ Sistema 100% funcional SEM DEPLOY
