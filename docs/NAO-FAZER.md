# ⛔ NÃO FAZER - Via Fluvial Amazônia

## 🚫 NUNCA TENTE FAZER DEPLOY

Este projeto **NÃO usa Edge Functions** e **NÃO requer deploy**!

## ❌ O Que NÃO Fazer

### 1. NÃO tentar fazer deploy de Edge Functions
- ❌ Não usar Supabase CLI para deploy
- ❌ Não modificar arquivos em `/supabase/functions/`
- ❌ Não tentar "publicar" Edge Functions

### 2. NÃO modificar arquivos protegidos do sistema
- ❌ `/supabase/functions/server/index.tsx` (protegido)
- ❌ `/supabase/functions/server/kv_store.tsx` (protegido)
- ❌ `/utils/supabase/info.tsx` (protegido)

### 3. NÃO criar novos arquivos de Edge Functions
- ❌ Não adicionar arquivos em `/supabase/functions/`
- ❌ Não criar novos endpoints em Deno/Hono

### 4. NÃO usar comandos de deploy
```bash
# ❌ NUNCA USE ESTES COMANDOS:
supabase functions deploy
supabase functions deploy server
supabase deploy
npm run deploy
```

## ✅ O Que Fazer em Vez Disso

### 1. Usar Supabase Client Direto
```typescript
// ✅ CORRETO: usar /src/app/utils/api.ts
import { subscribeNewsletter } from '../utils/api';

// ✅ O api.ts usa Supabase Client diretamente
await supabase
  .from('kv_store_63010152')
  .upsert({ key, value })
```

### 2. Modificar apenas o frontend
- ✅ Editar componentes em `/src/app/components/`
- ✅ Editar páginas em `/src/app/pages/`
- ✅ Editar utils em `/src/app/utils/api.ts`

### 3. Testar usando o painel integrado
- ✅ Acesse `/test-database` para testes
- ✅ Use o console do navegador (F12)
- ✅ Verifique dados no dashboard `/admin`

## 📚 Documentação Correta

Se você quer entender como o sistema funciona:

1. **Leia primeiro:** `/SOLUCAO-FINAL-403.md`
2. **Arquitetura:** `/ARQUITETURA-ATUAL.md`
3. **Guia do backend:** `/BACKEND_GUIDE.md`
4. **Como testar:** `/API_TESTING.md`

## 🆘 Se Algo Der Errado

### Se você vir erro 403:
1. **PARE imediatamente**
2. Leia `/SOLUCAO-FINAL-403.md`
3. Não tente fazer deploy
4. O erro é sobre tentativa de deploy automático

### Se o sistema não funcionar:
1. Verifique o console do navegador (F12)
2. Teste em `/test-database`
3. Verifique credenciais no Supabase
4. **NÃO tente fazer deploy**

## 🎯 Resumo

**O sistema já está pronto e funcionando!**

- ✅ Backend: Supabase Client direto
- ✅ Banco: kv_store_63010152
- ✅ Deploy: NÃO necessário
- ✅ Edge Functions: NÃO usadas

**Se funciona, não mexa! 🚀**

---

**Data:** 2026-03-28  
**Status:** Sistema 100% funcional sem deploy
