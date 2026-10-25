import { defineConfig } from '@playwright/test';

const PORT = 4321;
const baseURL = process.env.BASE_URL ?? `http://127.0.0.1:${PORT}`;

/**
 * Testes de fumaça sobre o site já construído (npm run build). Localmente usam o Chrome instalado;
 * no CI, o Chromium do Playwright (npx playwright install --with-deps chromium).
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    locale: 'pt-BR',
    channel: process.env.CI ? undefined : 'chrome',
    trace: process.env.CI ? 'retain-on-failure' : 'off',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npx astro preview --host 127.0.0.1 --port ${PORT}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
