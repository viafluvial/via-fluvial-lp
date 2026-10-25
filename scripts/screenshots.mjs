// Capturas de tela de todas as páginas (390 e 1280 px) e dos estados principais, para revisão visual.
// Uso: BASE_URL=http://127.0.0.1:4321 OUT=/tmp/sobre-astro node scripts/screenshots.mjs
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const OUT = process.env.OUT ?? '/tmp/sobre-astro';
mkdirSync(OUT, { recursive: true });

const pages = [
  ['home', '/'],
  ['barqueiros', '/barqueiros'],
  ['transportadores', '/transportadores'],
  ['parceiros', '/parceiros'],
  ['demonstracao', '/demonstracao'],
  ['quem-somos', '/quem-somos'],
  ['novidades', '/novidades'],
  ['novidade-lancamento', '/novidades/via-fluvial-passagens-de-barco-pelo-celular'],
  ['novidade-cargas', '/novidades/cargas-e-encomendas-pelos-rios'],
  ['novidade-via', '/novidades/conheca-a-v-ia'],
  ['o-que-vem-por-ai', '/o-que-vem-por-ai'],
  ['contato', '/contato'],
  ['privacidade', '/privacidade'],
  ['termos', '/termos'],
  ['creditos', '/creditos'],
  ['newsletter-confirmada', '/newsletter/confirmada'],
  ['newsletter-cancelada', '/newsletter/cancelada'],
  ['404', '/pagina-que-nao-existe'],
];

const browser = await chromium.launch({ channel: 'chrome' });

async function settle(page) {
  await page.waitForLoadState('networkidle');
  // Rola a página inteira para carregar as imagens preguiçosas.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('img')];
    imgs.forEach((img) => (img.loading = 'eager'));
    await Promise.all(imgs.map((img) => img.decode().catch(() => {})));
  });
  await page.waitForLoadState('networkidle');
  // Revela tudo o que depende de rolagem, para a captura de página inteira.
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}' });
  await page.waitForTimeout(1200);
}

for (const [width, height, label] of [
  [390, 844, '390'],
  [1280, 800, '1280'],
]) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const [name, path] of pages) {
    await page.goto(BASE + path);
    await settle(page);
    await page.screenshot({ path: `${OUT}/${name}-${label}.png`, fullPage: true });
  }
  await context.close();
}

// Menu do celular aberto.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/menu-mobile-390.png` });
  await context.close();
}

// Dock expandido (celular e desktop).
for (const [width, height, label] of [
  [390, 844, '390'],
  [1280, 800, '1280'],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Mostrar atalhos/ }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/dock-expandido-${label}.png` });
  await context.close();
}

// Formulários em sucesso e erro (envio simulado).
for (const [formPage, formName] of [
  ['/demonstracao', 'demonstracao'],
  ['/contato', 'contato'],
]) {
  for (const [status, tag] of [
    [201, 'sucesso'],
    [500, 'erro'],
  ]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.route('**/api/administracao/public/contact-requests', (route) =>
      route.fulfill({ status, contentType: 'application/json', body: status === 201 ? '{"requestId":"x"}' : '{"message":"erro"}' }),
    );
    await page.goto(BASE + formPage);
    await page.waitForLoadState('networkidle');
    const form = page.locator('form').first();
    await form.getByLabel(/^Nome/).fill('Maria da Silva');
    await form.getByLabel(/^E-mail/).fill('maria@exemplo.com.br');
    if (formName === 'demonstracao') await form.getByLabel(/^Tipo de operação/).selectOption('BARQUEIRO');
    else {
      await form.getByLabel(/^Assunto/).selectOption('PARCERIA');
      await form.getByLabel(/^Mensagem/).fill('Quero conversar sobre uma parceria com a Via Fluvial.');
    }
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: /Agendar demonstração|Enviar mensagem/ }).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/form-${formName}-${tag}-390.png`, fullPage: true });
    await context.close();
  }
}

// Newsletter em sucesso e erro.
for (const [status, tag] of [
  [202, 'sucesso'],
  [500, 'erro'],
]) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.route('**/api/notificacoes/public/newsletter/subscriptions', (route) =>
    route.fulfill({ status, contentType: 'application/json', body: status === 202 ? '{"status":"PENDING_CONFIRMATION"}' : '{}' }),
  );
  await page.goto(BASE + '/#newsletter');
  await page.waitForLoadState('networkidle');
  const form = page.getByTestId('newsletter-form').first();
  await form.scrollIntoViewIfNeeded();
  await form.getByLabel('Seu e-mail').fill('maria@exemplo.com.br');
  await form.getByRole('checkbox').check();
  await form.getByRole('button', { name: 'Quero receber' }).click();
  await page.waitForTimeout(700);
  await page.locator('#newsletter').screenshot({ path: `${OUT}/form-newsletter-${tag}-390.png` });
  await context.close();
}

// Janela "Agendar demonstração" aberta a partir de um botão.
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(BASE + '/');
  await page.waitForLoadState('networkidle');
  await page.locator('header').getByRole('link', { name: 'Agendar demonstração' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/modal-demonstracao-1280.png` });
  await context.close();
}

await browser.close();
console.log('Capturas em', OUT);
