# 🔧 Guia de Resolução de Erros

## ❌ Erro: "Could not find the table 'public.kv_store_63010152'"

### Causa
A tabela `kv_store_63010152` não existe no banco de dados Supabase.

### Solução

#### Opção 1: Usar a Interface Visual (Recomendado)

1. **Acesse:** `/test-database` no navegador
2. **Clique:** "🔍 Verificar Banco de Dados"
3. **Siga as instruções na tela:**
   - O sistema detectará que a tabela não existe
   - Mostrará o SQL necessário
   - Fornecerá link direto para o Supabase Dashboard
   - Botão para copiar o SQL
4. **Execute o SQL no Supabase**
5. **Clique:** "🔄 Verificar Novamente"

#### Opção 2: Manual

1. **Abra o Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/ibwprzjqvegzepphznkm/sql/new
   ```

2. **Copie o conteúdo do arquivo:** `/supabase-setup.sql`

3. **Cole no SQL Editor do Supabase**

4. **Clique em "Run"**

5. **Aguarde a confirmação:** "Success. No rows returned"

6. **Recarregue a aplicação**

---

## ❌ Erro 403: "XHR for /api/integrations/supabase/.../edge_functions/.../deploy"

### Causa
O sistema está tentando fazer deploy automático de Edge Functions, mas não temos permissão.

### ⚠️ IMPORTANTE
**Este projeto NÃO usa Edge Functions!** Não precisamos de deploy.

### Solução

1. **Ignore este erro** - Ele não afeta o funcionamento do sistema
2. **Não tente fazer deploy** - Não é necessário
3. **O sistema funciona 100%** usando Supabase Client direto

### Por que acontece?
O Figma Make detecta arquivos em `/supabase/functions/` e tenta fazer deploy automático. Esses arquivos são protegidos do sistema e não podemos deletá-los, mas já estão desabilitados.

### Verificação
✅ Se você consegue cadastrar emails e responder enquetes, **está tudo funcionando!**

---

## ❌ Erro: "Error while deploying"

### Causa
Mesmo problema do erro 403 acima.

### Solução
**Ignore completamente!** Este erro não impacta o funcionamento da aplicação.

### Como confirmar que está funcionando:

1. **Acesse:** `/test-database`
2. **Verifique o banco:** Botão "🔍 Verificar Banco de Dados"
3. **Se aparecer:** ✅ "Tabela encontrada e pronta para uso!" = **Tudo OK!**

---

## ❌ Erro: "RLS policy violation" ou "new row violates row-level security policy"

### Causa
As políticas de Row Level Security (RLS) não estão configuradas corretamente.

### Solução

Execute este SQL no Supabase:

```sql
-- Recriar políticas RLS
ALTER TABLE kv_store_63010152 ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
DROP POLICY IF EXISTS "Permitir leitura pública" ON kv_store_63010152;
CREATE POLICY "Permitir leitura pública"
ON kv_store_63010152
FOR SELECT
USING (true);

-- Permitir inserção
DROP POLICY IF EXISTS "Permitir inserção autenticada" ON kv_store_63010152;
CREATE POLICY "Permitir inserção autenticada"
ON kv_store_63010152
FOR INSERT
WITH CHECK (true);

-- Permitir atualização
DROP POLICY IF EXISTS "Permitir atualização autenticada" ON kv_store_63010152;
CREATE POLICY "Permitir atualização autenticada"
ON kv_store_63010152
FOR UPDATE
USING (true);
```

---

## ❌ Erro: "Invalid API key" ou "JWT expired"

### Causa
As credenciais do Supabase estão incorretas ou desatualizadas.

### Solução

1. **Verifique as credenciais** em `/utils/supabase/info.tsx`
   - Este arquivo é protegido e auto-gerado
   - Se estiver correto, não mexa

2. **Reconecte o Supabase:**
   - Desconecte e reconecte o projeto no Figma Make
   - As credenciais serão atualizadas automaticamente

---

## ❌ Erro: "Network error" ou "Failed to fetch"

### Causa
Problema de conexão com o Supabase ou CORS.

### Solução

1. **Verifique sua conexão com internet**

2. **Verifique o status do Supabase:**
   ```
   https://status.supabase.com/
   ```

3. **Limpe o cache do navegador:**
   - Pressione `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
   - Selecione "Cache" e limpe

4. **Tente em uma aba anônima/privada**

---

## 🔍 Como Debugar

### 1. Console do Navegador

Abra o DevTools (F12) e veja a aba "Console":

```javascript
// Logs úteis:
"✅ Newsletter: email@example.com cadastrado! Total: 5"
"📦 API: Subscribers encontrados: 5"
"❌ Erro ao buscar contador: [mensagem de erro]"
```

### 2. Painel de Testes

Acesse `/test-database` e execute todos os testes:

- ✅ Verde = OK
- ❌ Vermelho = Erro (leia a mensagem)

### 3. Dashboard Admin

Acesse `/admin`:

- Se aparecer dados = Sistema funcionando
- Se aparecer erros = Problemas de conexão

---

## 📋 Checklist de Troubleshooting

Se algo não funcionar, verifique na ordem:

- [ ] 1. A tabela `kv_store_63010152` existe? → `/test-database`
- [ ] 2. As políticas RLS estão corretas? → Execute SQL acima
- [ ] 3. O console mostra erros? → Abra DevTools (F12)
- [ ] 4. O Supabase está online? → https://status.supabase.com/
- [ ] 5. Você está conectado à internet? → Teste outro site

---

## ✅ Como Confirmar que Está Funcionando

### Teste 1: Cadastro de Email
1. Acesse a landing page `/`
2. Role até o final
3. Selecione um perfil
4. Digite um email
5. Clique em "Quero acompanhar"
6. ✅ Deve aparecer: "Pronto! Você está na lista"

### Teste 2: Enquete
1. Role até a seção de enquete
2. Selecione pelo menos 1 opção
3. Clique em "Enviar Resposta"
4. ✅ Deve aparecer: "Obrigado! Sua opinião foi registrada"

### Teste 3: Dashboard
1. Acesse `/admin`
2. ✅ Deve mostrar número de inscritos e respostas

### Teste 4: Painel de Testes
1. Acesse `/test-database`
2. Clique em "Verificar Banco de Dados"
3. ✅ Deve aparecer: "Tabela encontrada e pronta para uso!"

---

## 🆘 Ainda com Problemas?

### Documentação Relevante
- [SOLUCAO-FINAL-403.md](/SOLUCAO-FINAL-403.md) - Solução do erro 403
- [ARQUITETURA-ATUAL.md](/ARQUITETURA-ATUAL.md) - Como o sistema funciona
- [NAO-FAZER.md](/NAO-FAZER.md) - O que NÃO fazer

### Reset Total
Se nada funcionar, faça um reset:

```sql
-- ⚠️ CUIDADO: Isso deleta TODOS os dados!
DROP TABLE IF EXISTS kv_store_63010152 CASCADE;
```

Depois execute o SQL completo do `/supabase-setup.sql` novamente.

---

**Última atualização:** 2026-03-28  
**Status:** Sistema funcional sem Edge Functions
