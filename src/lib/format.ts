export const NEWS_TYPES = {
  lancamento: 'Lançamento',
  'nova-rota': 'Nova rota',
  'nova-funcao': 'Nova função',
  institucional: 'Institucional',
} as const;

export type NewsType = keyof typeof NEWS_TYPES;

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Manaus' });
}

export function isoDate(date: Date): string {
  return date.toISOString();
}
