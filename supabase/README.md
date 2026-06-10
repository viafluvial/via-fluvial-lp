# Configuração Supabase - Edge Functions DESABILITADAS

Este projeto NÃO usa Edge Functions.

O acesso ao banco de dados é feito DIRETAMENTE do frontend usando o Supabase Client.

## Arquitetura

```
Frontend (React) → Supabase Client → PostgreSQL Database (10 tabelas relacionais)
```

## Por que não usar Edge Functions?

1. ✅ Mais simples - sem intermediário
2. ✅ Mais rápido - acesso direto
3. ✅ Sem deploy - sem erro 403
4. ✅ Menos código - menos complexidade

## Banco de Dados

O sistema usa um schema relacional completo:

- 10 tabelas relacionais
- 99 colunas tipadas
- 16 Foreign Keys
- Views para estatísticas

Ver schema completo em: `/supabase-relational-schema.sql`

## Documentação

- [/CONFIRMACAO-SISTEMA-RELACIONAL.md](/CONFIRMACAO-SISTEMA-RELACIONAL.md)
- [/COMO-CODIGO-ACESSA-BANCO.md](/COMO-CODIGO-ACESSA-BANCO.md)
- [/CONFIRMACAO-BANCO-RELACIONAL.md](/CONFIRMACAO-BANCO-RELACIONAL.md)

## Código de Acesso

Todo o código de acesso ao banco está em:
- `/src/app/utils/api.ts` - API functions
- `/src/app/utils/supabase.ts` - Supabase client

**Não tente fazer deploy das Edge Functions!** Elas não são usadas.
