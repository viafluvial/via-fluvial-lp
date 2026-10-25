// Lighthouse (celular, configuração padrão) na página inicial e em duas páginas internas, contra um preview local.
// Uso: npm run build && npm run preview &  ;  npm run lighthouse
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const OUT = new URL('../lighthouse-reports/', import.meta.url).pathname;
const pages = (process.env.LH_PAGES ?? '/,/barqueiros,/quem-somos').split(',');
const minimum = Number(process.env.LH_MIN ?? 90);
mkdirSync(OUT, { recursive: true });

let failed = false;
for (const path of pages) {
  const name = path === '/' ? 'home' : path.slice(1).replaceAll('/', '-');
  const file = `${OUT}${name}.json`;
  const run = spawnSync(
    'npx',
    [
      '--yes',
      'lighthouse',
      BASE + path,
      '--output=json',
      `--output-path=${file}`,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless=new --no-sandbox',
      '--quiet',
    ],
    { stdio: ['ignore', 'inherit', 'inherit'], env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? '/usr/bin/google-chrome' } },
  );
  if (run.status !== 0) {
    console.error(`Lighthouse falhou em ${path}`);
    failed = true;
    continue;
  }
  const { categories } = JSON.parse(readFileSync(file, 'utf8'));
  const scores = Object.fromEntries(Object.entries(categories).map(([key, value]) => [key, Math.round(value.score * 100)]));
  console.log(`${path.padEnd(14)} desempenho ${scores.performance} | acessibilidade ${scores.accessibility} | boas práticas ${scores['best-practices']} | SEO ${scores.seo}`);
  if (Object.values(scores).some((score) => score < minimum)) failed = true;
}
process.exit(failed ? 1 : 0);
