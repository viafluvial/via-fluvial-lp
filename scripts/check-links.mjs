// Verificador de links internos: lê o site construído (dist/) e confere se cada link, imagem, script e
// âncora (#id) que aponta para dentro do próprio site existe. Links externos não são acessados.
// Uso: npm run build && npm run test:links
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const ORIGIN = 'https://sobre.viafluvial.com.br';

if (!existsSync(DIST)) {
  console.error('dist/ não existe. Rode "npm run build" antes.');
  process.exit(2);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(DIST);
const htmlFiles = files.filter((file) => file.endsWith('.html'));

/** Converte um caminho do site (/barqueiros) no arquivo gerado, ou null. */
function resolveRoute(pathname) {
  const clean = decodeURIComponent(pathname);
  const candidates = [clean, `${clean}.html`, join(clean, 'index.html')];
  for (const candidate of candidates) {
    const full = join(DIST, candidate);
    if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])));
  }
  return idCache.get(file);
}

const problems = [];
let checked = 0;

for (const file of htmlFiles) {
  const page = '/' + relative(DIST, file).replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/\s(?:href|src|poster|action)="([^"]*)"/g)].map((match) => match[1]);
  // srcset: várias URLs separadas por vírgula.
  for (const match of html.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const part of match[1].split(',')) refs.push(part.trim().split(/\s+/)[0]);
  }

  for (const ref of refs) {
    if (!ref || /^(mailto:|tel:|javascript:|data:|blob:)/.test(ref)) continue;
    let url;
    try {
      url = new URL(ref, ORIGIN + (page === '/' ? '/' : page));
    } catch {
      problems.push(`${page}: endereço inválido "${ref}"`);
      continue;
    }
    if (url.origin !== ORIGIN) continue;
    checked += 1;
    const target = resolveRoute(url.pathname);
    if (!target) {
      problems.push(`${page}: "${ref}" não existe`);
      continue;
    }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (id && !idsOf(target).has(id)) problems.push(`${page}: âncora "${ref}" não existe em ${url.pathname}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`${problems.length} problema(s) em ${htmlFiles.length} páginas:`);
  for (const problem of [...new Set(problems)]) console.error(' - ' + problem);
  process.exit(1);
}
console.log(`OK: ${checked} links internos conferidos em ${htmlFiles.length} páginas.`);
