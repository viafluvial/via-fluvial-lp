import { test, expect, jsonOk, waitHydrated } from './helpers';

const CONTACT_URL = '**/api/administracao/public/contact-requests';
const NEWSLETTER_URL = '**/api/notificacoes/public/newsletter/subscriptions';

test.describe('pedido de demonstração', () => {
  async function prepare(page: import('@playwright/test').Page) {
    await page.goto('/demonstracao');
    await waitHydrated(page, '[data-testid="demo-form"]');
    return page.getByTestId('demo-form');
  }

  test('valida no navegador com mensagens acessíveis e não envia', async ({ page }) => {
    let calls = 0;
    await page.route(CONTACT_URL, (route) => {
      calls += 1;
      return route.fulfill(jsonOk(201, { requestId: 'x' }));
    });
    const form = await prepare(page);
    await form.getByRole('button', { name: 'Agendar demonstração' }).click();
    await expect(form.getByText('Informe seu nome.')).toBeVisible();
    await expect(form.getByText(/Informe um e-mail válido/)).toBeVisible();
    await expect(form.getByText('Escolha o tipo de operação.')).toBeVisible();
    await expect(form.getByText(/aceitar o uso dos seus dados/)).toBeVisible();
    const name = form.getByLabel(/^Nome/);
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAttribute('aria-describedby', /erro/);
    await expect(name).toBeFocused();
    expect(calls).toBe(0);
  });

  test('201 mostra sucesso e envia exatamente o contrato combinado', async ({ page }) => {
    let body: Record<string, unknown> | undefined;
    await page.route(CONTACT_URL, async (route) => {
      expect(route.request().method()).toBe('POST');
      body = route.request().postDataJSON();
      await route.fulfill(jsonOk(201, { requestId: 'abc' }));
    });
    const form = await prepare(page);
    await form.getByLabel(/^Nome/).fill('Maria da Silva');
    await form.getByLabel(/^E-mail/).fill('maria@exemplo.com.br');
    await form.getByLabel(/^Telefone/).fill('(92) 99999-9999');
    await form.getByLabel(/^Empresa/).fill('Barcos do Norte');
    await form.getByLabel(/^Tipo de operação/).selectOption('BARQUEIRO');
    await form.getByLabel(/^Cidade/).fill('Parintins, AM');
    await form.getByLabel(/^Melhor período/).selectOption('Tarde');
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: 'Agendar demonstração' }).click();
    await expect(page.getByTestId('form-success')).toContainText('Pedido de demonstração enviado');
    expect(body).toMatchObject({
      type: 'DEMO',
      name: 'Maria da Silva',
      email: 'maria@exemplo.com.br',
      phone: '(92) 99999-9999',
      company: 'Barcos do Norte',
      partnerType: 'BARQUEIRO',
      city: 'Parintins, AM',
      preferredPeriod: 'Tarde',
      consentAccepted: true,
      consentVersion: '2026-10',
      source: 'sobre',
      website: '',
    });
  });

  for (const status of [500, 429, 400]) {
    test(`${status} mostra mensagem amigável com WhatsApp e e-mail`, async ({ page }) => {
      await page.route(CONTACT_URL, (route) => route.fulfill(jsonOk(status, { message: 'erro' })));
      const form = await prepare(page);
      await form.getByLabel(/^Nome/).fill('Maria da Silva');
      await form.getByLabel(/^E-mail/).fill('maria@exemplo.com.br');
      await form.getByLabel(/^Tipo de operação/).selectOption('AGENCIA');
      await form.getByRole('checkbox').check();
      await form.getByRole('button', { name: 'Agendar demonstração' }).click();
      const alert = page.getByTestId('form-error');
      await expect(alert).toBeVisible();
      await expect(alert.getByRole('link', { name: '+55 92 99459-3224' })).toHaveAttribute('href', 'https://wa.me/5592994593224');
      await expect(alert.getByRole('link', { name: 'contato@viafluvial.com.br' })).toHaveAttribute('href', 'mailto:contato@viafluvial.com.br');
      // O que a pessoa digitou continua lá para tentar de novo.
      await expect(form.getByLabel(/^Nome/)).toHaveValue('Maria da Silva');
    });
  }

  test('falha de rede também cai no aviso com os canais alternativos', async ({ page }) => {
    await page.route(CONTACT_URL, (route) => route.abort('failed'));
    const form = await prepare(page);
    await form.getByLabel(/^Nome/).fill('Maria da Silva');
    await form.getByLabel(/^E-mail/).fill('maria@exemplo.com.br');
    await form.getByLabel(/^Tipo de operação/).selectOption('EMPRESA');
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: 'Agendar demonstração' }).click();
    await expect(page.getByTestId('form-error')).toContainText('WhatsApp');
  });

  test('campo isca (honeypot) existe, é invisível e vai vazio', async ({ page }) => {
    const form = await prepare(page);
    const hp = form.locator('input[name="website"]');
    await expect(hp).toHaveCount(1);
    await expect(hp).toHaveValue('');
    await expect(hp).toHaveAttribute('tabindex', '-1');
    expect(await hp.evaluate((el) => el.closest('[aria-hidden="true"]') !== null)).toBe(true);
  });
});

test.describe('contato institucional', () => {
  test('assunto vem da URL, envia CONTACT e mostra sucesso', async ({ page }) => {
    let body: Record<string, unknown> | undefined;
    await page.route(CONTACT_URL, async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill(jsonOk(201, { requestId: 'z' }));
    });
    await page.goto('/contato?assunto=INVESTIDORES');
    await waitHydrated(page, '[data-testid="contact-form"]');
    const form = page.getByTestId('contact-form');
    await expect(form.getByLabel(/^Assunto/)).toHaveValue('INVESTIDORES');
    await form.getByLabel(/^Nome/).fill('João Pereira');
    await form.getByLabel(/^E-mail/).fill('joao@exemplo.com.br');
    await form.getByLabel(/^Mensagem/).fill('Gostaria de conhecer a operação da Via Fluvial.');
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.getByTestId('form-success')).toContainText('Mensagem enviada');
    expect(body).toMatchObject({ type: 'CONTACT', subject: 'INVESTIDORES', source: 'sobre', consentAccepted: true, website: '' });
    expect(body).not.toHaveProperty('partnerType');
  });

  test('500 mostra o aviso com WhatsApp e e-mail', async ({ page }) => {
    await page.route(CONTACT_URL, (route) => route.fulfill(jsonOk(500, {})));
    await page.goto('/contato');
    await waitHydrated(page, '[data-testid="contact-form"]');
    const form = page.getByTestId('contact-form');
    await form.getByLabel(/^Nome/).fill('João Pereira');
    await form.getByLabel(/^E-mail/).fill('joao@exemplo.com.br');
    await form.getByLabel(/^Assunto/).selectOption('IMPRENSA');
    await form.getByLabel(/^Mensagem/).fill('Pedido de entrevista sobre a plataforma.');
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: 'Enviar mensagem' }).click();
    await expect(page.getByTestId('form-error')).toContainText('contato@viafluvial.com.br');
  });
});

test.describe('newsletter', () => {
  test('202 mostra "Enviamos um e-mail para confirmar sua inscrição."', async ({ page }) => {
    let body: Record<string, unknown> | undefined;
    await page.route(NEWSLETTER_URL, async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill(jsonOk(202, { status: 'PENDING_CONFIRMATION' }));
    });
    await page.goto('/');
    await waitHydrated(page, '[data-testid="newsletter-form"]');
    const form = page.getByTestId('newsletter-form').first();
    await form.getByLabel('Seu e-mail').fill('maria@exemplo.com.br');
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: 'Quero receber' }).click();
    await expect(page.getByTestId('form-success')).toContainText('Enviamos um e-mail para confirmar sua inscrição.');
    expect(body).toEqual({ email: 'maria@exemplo.com.br', consentAccepted: true, consentVersion: '2026-10', source: 'sobre', website: '' });
  });

  test('exige e-mail válido e consentimento', async ({ page }) => {
    await page.goto('/novidades');
    await waitHydrated(page, '[data-testid="newsletter-form"]');
    const form = page.getByTestId('newsletter-form');
    await form.getByLabel('Seu e-mail').fill('isto-nao-e-email');
    await form.getByRole('button', { name: 'Quero receber' }).click();
    await expect(form.getByText(/e-mail válido/)).toBeVisible();
    await form.getByLabel('Seu e-mail').fill('maria@exemplo.com.br');
    await form.getByRole('button', { name: 'Quero receber' }).click();
    await expect(form.getByText(/aceitar o uso dos seus dados/)).toBeVisible();
  });

  test('500 mostra o aviso com os canais alternativos', async ({ page }) => {
    await page.route(NEWSLETTER_URL, (route) => route.fulfill(jsonOk(500, {})));
    await page.goto('/o-que-vem-por-ai');
    await waitHydrated(page, '[data-testid="newsletter-form"]');
    const form = page.getByTestId('newsletter-form');
    await form.getByLabel('Seu e-mail').fill('maria@exemplo.com.br');
    await form.getByRole('checkbox').check();
    await form.getByRole('button', { name: 'Quero receber' }).click();
    await expect(page.getByTestId('form-error')).toContainText('+55 92 99459-3224');
  });
});
