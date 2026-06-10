# 📚 Índice da Documentação - Via Fluvial Amazônia

## 🚨 LEIA PRIMEIRO (IMPORTANTE!)

1. **[TROUBLESHOOTING.md](/TROUBLESHOOTING.md)** 🔧  
   Resolução de erros comuns (tabela não encontrada, erro 403, etc)

2. **[NAO-FAZER.md](/NAO-FAZER.md)** ⛔  
   O que NUNCA fazer neste projeto (principalmente sobre deploy)

3. **[SOLUCAO-FINAL-403.md](/SOLUCAO-FINAL-403.md)** ✅  
   Solução completa do erro 403 - Sistema atual sem Edge Functions

4. **[ARQUITETURA-ATUAL.md](/ARQUITETURA-ATUAL.md)** 🏗️  
   Como o sistema funciona agora (sem deploy)

---

## 📖 Documentação Técnica

### Backend
- **[BACKEND_GUIDE.md](/BACKEND_GUIDE.md)** - Guia completo do backend
- **[API_TESTING.md](/API_TESTING.md)** - Como testar a API
- **[TECHNICAL_DOCUMENTATION.md](/TECHNICAL_DOCUMENTATION.md)** - Documentação técnica detalhada

### Banco de Dados
- **[SUPABASE-SETUP-GUIDE.md](/SUPABASE-SETUP-GUIDE.md)** - Guia de configuração do Supabase
- **[supabase-setup.sql](/supabase-setup.sql)** - Script SQL de setup
- **[supabase-test.sql](/supabase-test.sql)** - Script SQL de testes
- **[USEFUL-QUERIES.sql](/USEFUL-QUERIES.sql)** - Queries úteis

### Sistema
- **[RESUMO-SISTEMA.md](/RESUMO-SISTEMA.md)** - Resumo completo do sistema
- **[DATABASE-DIAGRAM.md](/DATABASE-DIAGRAM.md)** - Diagrama do banco de dados

---

## 🗂️ Organização por Tópico

### Se você quer...

#### ✅ Entender como funciona
1. Leia: [ARQUITETURA-ATUAL.md](/ARQUITETURA-ATUAL.md)
2. Depois: [RESUMO-SISTEMA.md](/RESUMO-SISTEMA.md)

#### 🔧 Configurar o sistema
1. Acesse: `/test-database` no navegador
2. Leia: [SUPABASE-SETUP-GUIDE.md](/SUPABASE-SETUP-GUIDE.md)

#### 🧪 Testar a API
1. Leia: [API_TESTING.md](/API_TESTING.md)
2. Use: `/test-database` no navegador

#### 📊 Ver dados
1. Acesse: `/admin` no navegador
2. Leia: [RESUMO-SISTEMA.md](/RESUMO-SISTEMA.md) - seção Dashboard

#### 🐛 Resolver problemas
1. Leia: [SOLUCAO-FINAL-403.md](/SOLUCAO-FINAL-403.md)
2. Depois: [NAO-FAZER.md](/NAO-FAZER.md)

#### 💻 Modificar código
1. ✅ Edite apenas: `/src/app/` (componentes, páginas, utils)
2. ❌ NÃO edite: `/supabase/functions/` ou `/utils/supabase/`

---

## 📁 Estrutura de Arquivos

```
/
├── 📚 DOCUMENTAÇÃO (você está aqui)
│   ├── INDICE.md                    ← Este arquivo
│   ├── NAO-FAZER.md                 ← ⚠️ Leia primeiro!
│   ├── ARQUITETURA-ATUAL.md         ← Como funciona
│   ├── SOLUCAO-FINAL-403.md         ← Solução do erro 403
│   ├── BACKEND_GUIDE.md             ← Guia do backend
│   ├── API_TESTING.md               ← Como testar
│   ├── TECHNICAL_DOCUMENTATION.md   ← Docs técnicos
│   ├── RESUMO-SISTEMA.md            ← Resumo completo
│   └── SUPABASE-SETUP-GUIDE.md      ← Setup do Supabase
│
├── 🗄️ SCRIPTS SQL
│   ├── supabase-setup.sql           ← Setup da tabela
│   ├── supabase-test.sql            ← Testes SQL
│   ├── supabase-relational-schema.sql
│   └── USEFUL-QUERIES.sql           ← Queries úteis
│
├── 💻 CÓDIGO FONTE
│   ├── src/app/
│   │   ├── components/              ← Componentes React
│   │   ├── pages/                   ← Páginas da aplicação
│   │   └── utils/
│   │       └── api.ts               ← ⭐ API principal (EDITE AQUI)
│   │
│   └── supabase/functions/          ← ⛔ NÃO EDITAR (protegido)
│
└── ⚙️ CONFIGURAÇÃO
    ├── package.json
    └── vite.config.ts
```

---

## 🎯 Quick Links

### Rotas da Aplicação
- **Landing Page:** [/](/)
- **Dashboard Admin:** [/admin](/admin)
- **Testes:** [/test-database](/test-database)

### Arquivos Importantes para Editar
- **API Client:** `/src/app/utils/api.ts` ⭐
- **Components:** `/src/app/components/` ⭐
- **Pages:** `/src/app/pages/` ⭐

### Arquivos Protegidos (NÃO EDITAR)
- `/supabase/functions/server/index.tsx` ⛔
- `/supabase/functions/server/kv_store.tsx` ⛔
- `/utils/supabase/info.tsx` ⛔

---

## ✅ Checklist de Onboarding

Para novos desenvolvedores:

- [ ] Ler [NAO-FAZER.md](/NAO-FAZER.md)
- [ ] Ler [SOLUCAO-FINAL-403.md](/SOLUCAO-FINAL-403.md)
- [ ] Ler [ARQUITETURA-ATUAL.md](/ARQUITETURA-ATUAL.md)
- [ ] Acessar `/test-database` e rodar testes
- [ ] Verificar dashboard em `/admin`
- [ ] Testar cadastro de email na landing page
- [ ] Testar envio de enquete
- [ ] Explorar código em `/src/app/`

---

## 🆘 Suporte

### Se você tiver dúvidas:

1. **Sobre arquitetura:** Leia [ARQUITETURA-ATUAL.md](/ARQUITETURA-ATUAL.md)
2. **Sobre API:** Leia [BACKEND_GUIDE.md](/BACKEND_GUIDE.md)
3. **Sobre testes:** Leia [API_TESTING.md](/API_TESTING.md)
4. **Erro 403:** Leia [SOLUCAO-FINAL-403.md](/SOLUCAO-FINAL-403.md)
5. **O que não fazer:** Leia [NAO-FAZER.md](/NAO-FAZER.md)

---

## 📊 Status do Projeto

**Última atualização:** 2026-03-28

✅ **Sistema 100% funcional**  
✅ **Sem Edge Functions**  
✅ **Sem necessidade de deploy**  
✅ **Pronto para produção**

---

**🌊 Via Fluvial Amazônia - Plataforma de Transporte Fluvial** 🚢