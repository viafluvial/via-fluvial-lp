/**
 * Eventos de negócio do Rybbit (análise de uso). Pageviews, cliques, links externos e interações
 * de formulário já são capturados automaticamente; aqui só entram conversões confirmadas pelo backend.
 * Convenção compartilhada por todas as propriedades da Via Fluvial: snake_case, sem acento, prefixo `lp_`.
 * Nunca enviar dado pessoal (nome, e-mail, telefone, empresa) nas propriedades.
 */
export type EventoLp = 'lp_demonstracao_solicitada' | 'lp_contato_enviado' | 'lp_newsletter_inscricao_enviada';

type Propriedades = Record<string, string | number | boolean>;

declare global {
  interface Window {
    rybbit?: { event?: (nome: string, propriedades?: Propriedades) => void };
  }
}

/** Registra o evento sem nunca atrapalhar o fluxo da página (script bloqueado, atrasado ou ausente). */
export function registrarEvento(nome: EventoLp, propriedades?: Propriedades): void {
  try {
    window.rybbit?.event?.(nome, propriedades);
  } catch {
    // Análise é opcional: falhar em silêncio.
  }
}
