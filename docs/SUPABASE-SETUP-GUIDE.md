# 🚀 Guia de Configuração do Supabase - Via Fluvial Amazônia

## 📋 Pré-requisitos
As chaves do Supabase já estão configuradas no projeto:
- ✅ Project ID: `ibwprzjqvegzepphznkm`
- ✅ SUPABASE_URL: `https://ibwprzjqvegzepphznkm.supabase.co`
- ✅ Chaves de API configuradas

## 🔧 Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/ibwprzjqvegzepphznkm
2. Faça login com sua conta Supabase
3. Você verá o projeto "Via Fluvial Amazônia" (ou similar)

## 📊 Passo 2: Criar a Tabela do Banco de Dados

### Opção A: SQL Editor (Recomendado)

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Copie TODO o conteúdo do arquivo `supabase-setup.sql`
4. Cole no editor SQL
5. Clique em **"Run"** (ou pressione Ctrl+Enter)
6. Aguarde a mensagem: **"Tabela criada com sucesso!"**

### Opção B: Table Editor (Manual)

1. No menu lateral, clique em **"Table Editor"**
2. Clique em **"New table"**
3. Configure:
   - **Name**: `kv_store_63010152`
   - **Description**: Armazenamento key-value para Via Fluvial
4. Adicione as colunas:
   
   | Column name | Type   | Default value | Primary | Nullable |
   |-------------|--------|---------------|---------|----------|
   | key         | text   | -             | ✅ Yes  | ❌ No    |
   | value       | jsonb  | -             | ❌ No   | ❌ No    |
   | created_at  | timestamptz | now()    | ❌ No   | ❌ No    |
   | updated_at  | timestamptz | now()    | ❌ No   | ❌ No    |

5. Clique em **"Save"**

## 🔐 Passo 3: Configurar Políticas de Segurança (RLS)

1. No Table Editor, clique na tabela `kv_store_63010152`
2. Vá para a aba **"Policies"**
3. Clique em **"New Policy"**
4. Escolha **"For full customization"**
5. Configure 3 políticas:

### Política 1: Leitura Pública
```sql
Policy name: Permitir leitura pública
Operation: SELECT
WITH CHECK expression: true
```

### Política 2: Inserção
```sql
Policy name: Permitir inserção
Operation: INSERT
WITH CHECK expression: true
```

### Política 3: Atualização
```sql
Policy name: Permitir atualização
Operation: UPDATE
USING expression: true
WITH CHECK expression: true
```

## ✅ Passo 4: Verificar se Está Funcionando

1. Volte para sua aplicação
2. Abra a página inicial
3. Tente cadastrar um email na newsletter
4. Se aparecer "Inscrição realizada com sucesso!", está tudo certo! 🎉

## 🔍 Passo 5: Visualizar os Dados

Para ver os dados coletados:

1. No Supabase Dashboard, vá em **"Table Editor"**
2. Selecione a tabela `kv_store_63010152`
3. Você verá todos os registros salvos

Ou use SQL Editor para queries específicas:

```sql
-- Ver todos os emails cadastrados
SELECT value->>'email' as email, 
       value->>'source' as perfil,
       value->>'subscribedAt' as data
FROM kv_store_63010152 
WHERE key LIKE 'newsletter:%'
ORDER BY value->>'subscribedAt' DESC;

-- Ver respostas da enquete
SELECT value->>'selectedOptions' as opcoes,
       value->>'suggestions' as sugestoes,
       value->>'submittedAt' as data
FROM kv_store_63010152 
WHERE key LIKE 'poll:%'
ORDER BY value->>'submittedAt' DESC;

-- Contadores
SELECT 
  COUNT(*) FILTER (WHERE key LIKE 'newsletter:%') as total_emails,
  COUNT(*) FILTER (WHERE key LIKE 'poll:%') as total_enquetes
FROM kv_store_63010152;
```

## 📱 Passo 6: Acessar o Dashboard Administrativo

1. Acesse: **https://sua-url.com/admin**
2. Você verá:
   - Total de inscritos na newsletter
   - Respostas da enquete com estatísticas
   - Segmentação de público (Passageiros, Barqueiros, Agências, Outros)
   - Sugestões dos usuários
   - Exportação CSV de todos os dados

## 🛠️ Comandos Úteis SQL

### Ver estrutura da tabela
```sql
\d kv_store_63010152
```

### Backup dos dados
```sql
COPY kv_store_63010152 TO '/tmp/backup.csv' CSV HEADER;
```

### Limpar dados de teste (CUIDADO!)
```sql
DELETE FROM kv_store_63010152 WHERE key LIKE 'test:%';
```

### Ver últimos registros
```sql
SELECT * FROM kv_store_63010152 
ORDER BY created_at DESC 
LIMIT 10;
```

## ❌ Solução de Problemas

### Erro: "Could not find the table"
- ✅ Execute o script `supabase-setup.sql` no SQL Editor

### Erro: "Row Level Security"
- ✅ Execute as políticas RLS do script
- ✅ Ou desabilite RLS temporariamente: `ALTER TABLE kv_store_63010152 DISABLE ROW LEVEL SECURITY;`

### Erro: "Permission denied"
- ✅ Verifique se as políticas RLS estão configuradas
- ✅ Confirme que está usando a ANON_KEY no frontend

### Dados não aparecem no Dashboard
- ✅ Verifique se a tabela existe
- ✅ Teste o endpoint: `https://ibwprzjqvegzepphznkm.supabase.co/functions/v1/make-server-63010152/health`
- ✅ Abra o Console do navegador e veja os erros

## 🎯 Próximos Passos

Após tudo configurado:

1. ✅ Teste todas as funcionalidades
2. ✅ Cadastre alguns emails de teste
3. ✅ Responda a enquete
4. ✅ Acesse o dashboard `/admin` e veja os dados
5. ✅ Exporte os dados em CSV
6. ✅ Compartilhe o link da landing page

## 📞 Suporte

Se precisar de ajuda:
- 📚 Documentação Supabase: https://supabase.com/docs
- 💬 Discord do Supabase: https://discord.supabase.com
- 🎯 Supabase Dashboard: https://supabase.com/dashboard

---

**🌊 Via Fluvial Amazônia - Conectando pessoas e lugares através dos rios** 🚤
