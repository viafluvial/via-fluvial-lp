/**
 * Dados fixos do site: endereços dos outros sites da plataforma, canais de contato e a navegação.
 * Tudo que é link para fora do sobre sai daqui, para ficar fácil de trocar.
 */
export const SITE = {
  name: 'Via Fluvial',
  url: 'https://sobre.viafluvial.com.br',
  locale: 'pt-BR',
  description:
    'Via Fluvial: plataforma de passagens, cargas e encomendas pelos rios da Amazônia, com pagamento seguro, bilhete digital e acompanhamento.',
  email: 'contato@viafluvial.com.br',
  whatsappDisplay: '+55 92 99459-3224',
  whatsappUrl: 'https://wa.me/5592994593224',
  company: 'IntSoft Consultoria em TI LTDA',
  cnpj: '67.825.379/0001-40',
  consentVersion: '2026-10',
  formSource: 'sobre',
} as const;

/** Redes sociais: ficam escondidas até existir um endereço (todos vazios por enquanto). */
export const SOCIAL: { id: string; label: string; url: string }[] = [
  { id: 'instagram', label: 'Instagram', url: '' },
  { id: 'facebook', label: 'Facebook', url: '' },
  { id: 'tiktok', label: 'TikTok', url: '' },
  { id: 'youtube', label: 'YouTube', url: '' },
  { id: 'linkedin', label: 'LinkedIn', url: '' },
  { id: 'whatsapp-business', label: 'WhatsApp Business', url: '' },
];

const PLATFORM = 'https://viafluvial.com.br';

/** Acrescenta a origem (UTM) nos links para os apps, para medir de onde vem o acesso. */
export function withUtm(url: string, campaign: string): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'sobre');
  u.searchParams.set('utm_medium', 'site');
  u.searchParams.set('utm_campaign', campaign);
  return u.toString();
}

export const LINKS = {
  platform: PLATFORM,
  /** App de passageiros. */
  app: (campaign = 'home') => withUtm(`${PLATFORM}/`, campaign),
  /** App de cargas. */
  cargas: (campaign = 'home') => withUtm(`${PLATFORM}/cargas/`, campaign),
  /** O app não tem link direto para o cadastro de barqueiro: o "Quero ser barqueiro" fica na página inicial dele. */
  barqueiroSignup: (campaign = 'barqueiros') => withUtm(`${PLATFORM}/`, campaign),
  transportadorActivation: (campaign = 'transportadores') => withUtm(`${PLATFORM}/cargas/transportador`, campaign),
  docs: 'https://docs.viafluvial.com.br',
  docsGuide: {
    passageiros: 'https://docs.viafluvial.com.br/para/passageiros',
    cargas: 'https://docs.viafluvial.com.br/para/cargas',
    barqueiros: 'https://docs.viafluvial.com.br/para/barqueiros',
    transportadoras: 'https://docs.viafluvial.com.br/para/transportadoras',
    comprar: 'https://docs.viafluvial.com.br/tutoriais/TUT-PAS-001',
    cotar: 'https://docs.viafluvial.com.br/tutoriais/TUT-CAR-001',
    cadastroBarqueiro: 'https://docs.viafluvial.com.br/tutoriais/TUT-BAR-001',
    ativarCargas: 'https://docs.viafluvial.com.br/tutoriais/TUT-TRA-001',
  },
  support: `${PLATFORM}/?go=chat`,
  whatsapp: SITE.whatsappUrl,
  mailto: `mailto:${SITE.email}`,
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/** Links do cabeçalho (5.1). "Para parceiros" abre o grupo com as páginas de cada público. */
export const NAV_MAIN: NavItem[] = [
  { label: 'Passageiros', href: '/#passageiros' },
  { label: 'Cargas e encomendas', href: '/#cargas' },
];
export const NAV_PARTNERS: NavItem[] = [
  { label: 'Barqueiros', href: '/barqueiros' },
  { label: 'Transportadores', href: '/transportadores' },
  { label: 'Agências, empresas e investidores', href: '/parceiros' },
];
export const NAV_AFTER: NavItem[] = [
  { label: 'Quem somos', href: '/quem-somos' },
  { label: 'Novidades', href: '/novidades' },
];

export const FOOTER_COLUMNS: { title: string; links: (NavItem & { external?: boolean })[] }[] = [
  {
    title: 'Plataforma',
    links: [
      { label: 'Acessar a plataforma', href: LINKS.platform, external: true },
      { label: 'App de cargas', href: LINKS.cargas('rodape'), external: true },
      { label: 'Central de Ajuda', href: LINKS.docs, external: true },
    ],
  },
  {
    title: 'Para parceiros',
    links: [
      { label: 'Barqueiros', href: '/barqueiros' },
      { label: 'Transportadores', href: '/transportadores' },
      { label: 'Parceiros', href: '/parceiros' },
      { label: 'Agendar demonstração', href: '/demonstracao' },
    ],
  },
  {
    title: 'Institucional',
    links: [
      { label: 'Quem somos', href: '/quem-somos' },
      { label: 'Novidades', href: '/novidades' },
      { label: 'O que vem por aí', href: '/o-que-vem-por-ai' },
      { label: 'Contato', href: '/contato' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidade', href: '/privacidade' },
      { label: 'Termos', href: '/termos' },
      { label: 'Créditos das imagens', href: '/creditos' },
    ],
  },
];

export const CANONICAL_PATHS = [
  '/',
  '/barqueiros',
  '/transportadores',
  '/parceiros',
  '/demonstracao',
  '/quem-somos',
  '/novidades',
  '/o-que-vem-por-ai',
  '/contato',
  '/privacidade',
  '/termos',
  '/creditos',
] as const;
