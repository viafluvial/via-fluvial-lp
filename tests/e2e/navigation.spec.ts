import { test, expect } from './helpers';

test.describe('navegação no desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('cabeçalho: links, botão amarelo para a plataforma e botão de demonstração', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Principal' });
    await expect(nav.getByRole('link', { name: 'Passageiros' })).toHaveAttribute('href', '/#passageiros');
    await expect(nav.getByRole('link', { name: 'Cargas e encomendas' })).toHaveAttribute('href', '/#cargas');
    await expect(page.locator('header').getByRole('link', { name: 'Acessar a plataforma' })).toHaveAttribute('href', 'https://viafluvial.com.br');
    await expect(page.locator('header').getByRole('link', { name: 'Agendar demonstração' })).toBeVisible();
    await nav.getByRole('link', { name: 'Quem somos' }).click();
    await expect(page).toHaveURL(/\/quem-somos$/);
    await nav.getByRole('link', { name: 'Novidades' }).click();
    await expect(page).toHaveURL(/\/novidades$/);
  });

  test('grupo "Para parceiros" leva a barqueiros, transportadores e parceiros', async ({ page }) => {
    await page.goto('/');
    for (const [name, url] of [
      ['Barqueiros', /\/barqueiros$/],
      ['Transportadores', /\/transportadores$/],
      ['Agências, empresas e investidores', /\/parceiros$/],
    ] as const) {
      await page.getByRole('navigation', { name: 'Principal' }).getByText('Para parceiros').click();
      await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name }).click();
      await expect(page).toHaveURL(url);
      await page.goto('/');
    }
  });

  test('"Agendar demonstração" abre como janela com foco preso e Esc fecha', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const trigger = page.locator('header').getByRole('link', { name: 'Agendar demonstração' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Agendar uma demonstração' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel(/^Nome/)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('rodapé: links, contato, empresa e créditos', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    for (const [name, href] of [
      ['Acessar a plataforma', 'https://viafluvial.com.br'],
      ['Central de Ajuda', 'https://docs.viafluvial.com.br'],
      ['Barqueiros', '/barqueiros'],
      ['Transportadores', '/transportadores'],
      ['Parceiros', '/parceiros'],
      ['Quem somos', '/quem-somos'],
      ['Novidades', '/novidades'],
      ['O que vem por aí', '/o-que-vem-por-ai'],
      ['Contato', '/contato'],
      ['Privacidade', '/privacidade'],
      ['Termos', '/termos'],
      ['Créditos das imagens', '/creditos'],
    ] as const) {
      await expect(footer.getByRole('link', { name, exact: true }), name).toHaveAttribute('href', href);
    }
    await expect(footer.getByRole('link', { name: /App de cargas/ })).toHaveAttribute('href', /^https:\/\/viafluvial\.com\.br\/cargas\//);
    await expect(footer.getByRole('link', { name: 'contato@viafluvial.com.br' })).toHaveAttribute('href', 'mailto:contato@viafluvial.com.br');
    await expect(footer.getByRole('link', { name: /WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/5592994593224');
    await expect(footer).toContainText('Via Fluvial é uma plataforma da IntSoft Consultoria em TI LTDA - CNPJ 67.825.379/0001-40');
    // Sem endereço de rede social cadastrado, nenhum ícone aparece.
    await expect(footer.getByRole('list', { name: 'Redes sociais' })).toHaveCount(0);
  });
});

test.describe('menu do celular', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('abre pela direita, prende o foco, fecha com Esc e devolve o foco ao botão', async ({ page }) => {
    await page.goto('/');
    const button = page.locator('button[aria-controls="vf-mobile-menu"]');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    const box = await button.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await expect.poll(async () => button.isEnabled()).toBe(true);
    await page.waitForFunction(() => !document.querySelector('header astro-island')?.hasAttribute('ssr'));

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    const drawer = page.getByRole('dialog', { name: 'Menu principal' });
    await expect(drawer).toBeVisible();
    const drawerBox = await drawer.boundingBox();
    expect(drawerBox!.x + drawerBox!.width).toBeGreaterThanOrEqual(389);
    await expect(drawer.getByRole('link', { name: 'Barqueiros' })).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'Acessar a plataforma' })).toBeVisible();
    await expect(drawer.getByRole('button', { name: 'Fechar menu' })).toBeFocused();

    // Tab nunca sai da gaveta.
    for (let index = 0; index < 14; index += 1) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => Boolean(document.activeElement?.closest('#vf-mobile-menu')));
      expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(button).toBeFocused();
  });

  test('os itens do menu levam às páginas', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => !document.querySelector('header astro-island')?.hasAttribute('ssr'));
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('dialog', { name: 'Menu principal' }).getByRole('link', { name: 'Transportadores' }).click();
    await expect(page).toHaveURL(/\/transportadores$/);
  });
});
