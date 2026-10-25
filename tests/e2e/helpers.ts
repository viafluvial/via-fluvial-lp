import { expect, test, type Page } from '@playwright/test';

export const PAGES = [
  { path: '/', h1: /O transporte fluvial da Amazônia, conectado/ },
  { path: '/barqueiros', h1: /Sua embarcação vendendo passagens/ },
  { path: '/transportadores', h1: /Seu barco também pode levar carga/ },
  { path: '/parceiros', h1: /Cresça com a Via Fluvial/ },
  { path: '/demonstracao', h1: /Quer ver a plataforma funcionando/ },
  { path: '/quem-somos', h1: /Quem somos/ },
  { path: '/novidades', h1: /Notícias da plataforma/ },
  { path: '/o-que-vem-por-ai', h1: /O que vem por aí/ },
  { path: '/contato', h1: /Fale com a Via Fluvial/ },
  { path: '/privacidade', h1: /Política de Privacidade/ },
  { path: '/termos', h1: /Termos de uso do site/ },
  { path: '/creditos', h1: /Créditos das imagens/ },
  { path: '/newsletter/confirmada', h1: /Inscrição confirmada/ },
  { path: '/newsletter/cancelada', h1: /Inscrição cancelada/ },
] as const;

/** Espera a ilha React que contém o seletor terminar de hidratar (antes disso os campos perdem o que foi digitado). */
export async function waitHydrated(page: Page, selector: string) {
  await page.locator(selector).first().scrollIntoViewIfNeeded();
  await page.waitForFunction((sel) => {
    const island = document.querySelector(sel)?.closest('astro-island');
    return Boolean(island) && !island!.hasAttribute('ssr');
  }, selector);
}

export async function fillContactCommon(page: Page, form: ReturnType<Page['locator']>) {
  await form.getByLabel(/^Nome/).fill('Maria da Silva');
  await form.getByLabel(/^E-mail/).fill('maria@exemplo.com.br');
}

export const jsonOk = (status: number, body: unknown) => ({ status, contentType: 'application/json', body: JSON.stringify(body) });

export { expect, test };
