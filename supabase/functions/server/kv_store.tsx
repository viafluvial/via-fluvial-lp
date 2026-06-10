// ==========================================
// 🚫 ARQUIVO LEGACY - NÃO USADO
// ==========================================
//
// Este arquivo fazia parte do sistema antigo (chave-valor).
// Ele foi substituído pelo schema relacional.
//
// NÃO é necessário fazer deploy deste arquivo.
//
// ==========================================

export default {
  fetch() {
    return new Response(
      JSON.stringify({
        error: 'Arquivo legacy não usado',
        message: 'Sistema migrado para schema relacional',
        newSchema: '/supabase-relational-schema.sql'
      }),
      {
        status: 410, // Gone
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
