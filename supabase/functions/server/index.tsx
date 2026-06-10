// ==========================================
// 🚫 NÃO FAZER DEPLOY DESTA EDGE FUNCTION
// ==========================================
//
// ESTE ARQUIVO EXISTE APENAS POR QUESTÕES TÉCNICAS.
// ELE NÃO DEVE SER DEPLOYADO E NÃO É USADO PELO SISTEMA.
//
// O sistema Via Fluvial usa ACESSO DIRETO ao Supabase:
// Frontend → Supabase Client → PostgreSQL
//
// Todas as operações de banco são feitas em:
// /src/app/utils/api.ts
//
// Se você está vendo erro 403, IGNORE-O.
// O erro não afeta o funcionamento do sistema.
//
// ==========================================

// Export vazio para satisfazer requisitos de deploy
export default {
  fetch() {
    return new Response(
      JSON.stringify({
        error: 'Edge Function desabilitada',
        message: 'Este sistema usa Supabase Client direto do frontend',
        documentation: [
          '/CONFIRMACAO-SISTEMA-RELACIONAL.md',
          '/COMO-CODIGO-ACESSA-BANCO.md',
          '/CONFIRMACAO-BANCO-RELACIONAL.md'
        ]
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
