import { test, expect, PAGES } from './helpers';

for (const { path, h1 } of PAGES) {
  test(`página ${path} carrega com título, h1, canônica e dados estruturados`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(h1);
    await expect(page).toHaveTitle(/Via Fluvial|v\.IA|Quem somos|Novidades|Contato|Parceiros|Termos|Créditos|Inscrição|Política|Agendar|O que vem|Para /);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/sobre\.viafluvial\.com\.br/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/sobre\.viafluvial\.com\.br\/.+/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((block) => JSON.parse(block)['@type']);
    expect(types).toContain('Organization');
    if (path === '/') expect(types).toContain('FAQPage');
    if (path.startsWith('/novidades/')) expect(types).toContain('NewsArticle');
    expect(errors).toEqual([]);
  });
}

for (const { path } of PAGES) {
  test(`${path}: toda imagem tem alt, sem travessão longo e sem rastro do Supabase`, async ({ page }) => {
    await page.goto(path);
    expect(await page.locator('img:not([alt])').count(), 'imagens sem alt').toBe(0);
    const text = await page.locator('body').innerText();
    expect(text).not.toContain('\u2014');
    expect((await page.content()).toLowerCase()).not.toContain('supabase');
  });
}

test('o site traz robots.txt, sitemap e manifesto com o tema verde', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Sitemap: https://sobre.viafluvial.com.br/sitemap-index.xml');
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  for (const route of ['/barqueiros', '/transportadores', '/parceiros', '/demonstracao', '/quem-somos', '/novidades', '/o-que-vem-por-ai', '/contato', '/privacidade', '/termos']) {
    expect(sitemap).toContain(`https://sobre.viafluvial.com.br${route}`);
  }
  expect(sitemap).toContain('/novidades/conheca-a-v-ia');
  const manifest = await (await request.get('/site.webmanifest')).json();
  expect(manifest.name).toBe('Via Fluvial');
  expect(manifest.theme_color.toLowerCase()).toBe('#1a5f3b');
  expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
});

for (const width of [360, 768, 1280, 1920]) {
  test(`sem rolagem horizontal a ${width} px em todas as páginas`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    for (const { path } of PAGES) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} a ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test('o que não entra no sobre não aparece: busca de viagens, cotação, v.IA interativa e viagem em grupo', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('input[type="date"]')).toHaveCount(0);
  await expect(page.getByText(/viagem em grupo/i)).toHaveCount(0);
  await expect(page.getByText('Saindo hoje')).toHaveCount(0);
});

test('rotas antigas /admin e /test-database mostram 404 sem dados', async ({ page }) => {
  for (const route of ['/admin', '/test-database']) {
    const response = await page.goto(route);
    // Aceitável: 404 (padrão) ou redirecionamento para a página inicial.
    const redirected = new URL(page.url()).pathname === '/';
    expect(response?.status() === 404 || redirected, route).toBe(true);
    const html = (await page.content()).toLowerCase();
    expect(html).not.toContain('supabase');
    expect(html).not.toContain('inscritos');
    if (!redirected) await expect(page.locator('h1')).toHaveText('Página não encontrada');
  }
});
