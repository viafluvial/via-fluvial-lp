import { test, expect, jsonOk } from './helpers';

test.describe('dock', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('alça amarela mostra suporte e rolagem automática, com as mesmas chaves dos apps', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !document.querySelector('astro-island[component-url*="FloatingDock"]')?.hasAttribute('ssr'));
    const dock = page.getByTestId('floating-dock');
    await expect(dock).toBeVisible();
    const handle = dock.getByRole('button', { name: /Mostrar atalhos/ });
    await expect(handle).toHaveAttribute('aria-expanded', 'false');
    await handle.click();
    await expect(dock.getByRole('button', { name: 'Esconder atalhos' })).toHaveAttribute('aria-expanded', 'true');

    const support = dock.getByRole('link', { name: 'Falar com o suporte' });
    await expect(support).toHaveAttribute('href', 'https://viafluvial.com.br/?go=chat');
    await expect(support).toHaveAttribute('target', '_blank');
    await expect(support).toHaveAttribute('rel', /noopener/);

    expect(await page.evaluate(() => localStorage.getItem('vfa.floating-dock.expanded'))).toBe('1');
    expect(await page.evaluate(() => localStorage.getItem('vfa.floating-dock.discovered'))).toBe('1');

    const play = dock.getByRole('button', { name: 'Iniciar rolagem automática' });
    await expect(play).toBeEnabled();
    const before = await page.evaluate(() => window.scrollY);
    await play.click();
    await expect(dock.getByRole('button', { name: 'Pausar rolagem automática' })).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 100);
    await dock.getByRole('button', { name: 'Pausar rolagem automática' }).click();
  });

  test('o estado aberto é lembrado ao recarregar', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('vfa.floating-dock.expanded', '1'));
    await page.reload();
    await expect(page.getByTestId('floating-dock').getByRole('button', { name: 'Esconder atalhos' })).toBeVisible();
  });

  test('pílula de subir e descer aparece a partir de 640 px e leva ao topo', async ({ page }) => {
    await page.goto('/');
    const top = page.getByRole('button', { name: 'Ir para o topo' });
    await expect(top).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 1500));
    await top.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 8000 }).toBeLessThan(5);
  });

  test('em telas estreitas (390 px) a pílula some', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Ir para o topo' })).toBeHidden();
    await expect(page.getByTestId('floating-dock')).toBeVisible();
  });
});

test.describe('números da plataforma (5.9)', () => {
  test('desligado por padrão: mostra "Em operação nas rotas do Amazonas"', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('platform-stats-fallback').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('platform-stats-fallback')).toHaveText('Em operação nas rotas do Amazonas');
  });

  test('ligado, mostra só os números acima do mínimo', async ({ page }) => {
    await page.route('**/runtime-config.json', (route) => route.fulfill(jsonOk(200, { platformStatsEnabled: true })));
    await page.route('**/api/reservas/public/stats/summary', (route) =>
      route.fulfill(jsonOk(200, { passengersTransported: 2350, confirmedBookings: 120, generatedAt: '2026-11-01T00:00:00Z' })),
    );
    await page.goto('/');
    await page.getByLabel('Números da plataforma').scrollIntoViewIfNeeded();
    const strip = page.getByTestId('platform-stats-numbers');
    await expect(strip).toContainText('2.350');
    await expect(strip).toContainText('passageiros transportados');
    await expect(strip).not.toContainText('reservas confirmadas');
  });

  test('ligado, mas abaixo dos dois mínimos: volta ao texto padrão', async ({ page }) => {
    await page.route('**/runtime-config.json', (route) => route.fulfill(jsonOk(200, { platformStatsEnabled: true })));
    await page.route('**/api/reservas/public/stats/summary', (route) =>
      route.fulfill(jsonOk(200, { passengersTransported: 999, confirmedBookings: 499 })),
    );
    await page.goto('/');
    await page.getByTestId('platform-stats-fallback').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('platform-stats-fallback')).toBeVisible();
    await expect(page.getByTestId('platform-stats-numbers')).toHaveCount(0);
  });

  test('ligado mas sem resposta do backend: texto padrão', async ({ page }) => {
    await page.route('**/runtime-config.json', (route) => route.fulfill(jsonOk(200, { platformStatsEnabled: true })));
    await page.route('**/api/reservas/public/stats/summary', (route) => route.fulfill(jsonOk(500, {})));
    await page.goto('/');
    await page.getByTestId('platform-stats-fallback').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('platform-stats-fallback')).toBeVisible();
  });
});

test.describe('conteúdo', () => {
  test('notícias de lançamento ficam escondidas até o lançamento oficial', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-news-card]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Notícias da plataforma' })).toHaveCount(0);
  });

  test('novidades: sem notícias publicadas, avisa que chegam em breve e oferece a newsletter', async ({ page }) => {
    await page.goto('/novidades');
    await expect(page.locator('[data-news-soon]')).toContainText('As primeiras notícias chegam em breve');
    await expect(page.locator('[data-news-item]')).toHaveCount(0);
    await expect(page.getByTestId('newsletter-form')).toBeVisible();
  });

  test('páginas das notícias em rascunho não existem', async ({ page }) => {
    const response = await page.goto('/novidades/cargas-e-encomendas-pelos-rios');
    expect(response?.status()).toBe(404);
  });

  test('o que vem por aí: três colunas, sem datas, com o aviso "planos podem mudar"', async ({ page }) => {
    await page.goto('/o-que-vem-por-ai');
    for (const name of ['Agora', 'Em seguida', 'Mais adiante']) await expect(page.getByRole('heading', { name, level: 2 })).toBeVisible();
    await expect(page.getByText('Planos podem mudar.')).toBeVisible();
    await expect(page.locator('[data-column="em-seguida"] li')).toHaveCount(4);
  });

  test('quem somos: história sem "milhões", linha do tempo e números com fonte e ano', async ({ page }) => {
    await page.goto('/quem-somos');
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/milhões de pessoas/i);
    expect(text).toContain('grande parte da população da Amazônia');
    await expect(page.getByTestId('timeline').locator('li')).toHaveCount(3);
    const cards = page.getByTestId('numbers-grid').locator('li');
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
    for (const card of await cards.all()) {
      await expect(card.getByRole('link')).toHaveAttribute('href', /^https:\/\//);
      await expect(card).toContainText(/Fonte:.*, 20\d\d\./);
    }
  });

  test('links de cadastro apontam para os apps certos', async ({ page }) => {
    await page.goto('/barqueiros');
    await expect(page.getByRole('link', { name: 'Cadastrar minha embarcação' }).first()).toHaveAttribute('href', /^https:\/\/viafluvial\.com\.br\/\?utm_source=sobre/);
    await page.goto('/transportadores');
    await expect(page.getByRole('link', { name: 'Ativar transporte de cargas' }).first()).toHaveAttribute('href', /^https:\/\/viafluvial\.com\.br\/cargas\/transportador\?utm_source=sobre/);
  });
});
