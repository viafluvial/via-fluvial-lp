// Gera a imagem de prévia (Open Graph, 1200x630) a partir do logo oficial.
// Uso: npm run assets:brand  (o resultado fica em public/og-image.png e é versionado)
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const logo = readFileSync(new URL('../public/logo.svg', import.meta.url));
const logoPng = await sharp(logo).resize(260, 260).png().toBuffer();

const W = 1200;
const H = 630;
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1A5F3B"/>
      <stop offset="1" stop-color="#0E3B2A"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1040" cy="110" r="150" fill="#F9C74F" opacity="0.18"/>
  <path d="M0 540c120-40 220-44 330 0s210 40 330 0 220-44 330 0 150 30 210 10v80H0z" fill="#ffffff" opacity="0.07"/>
  <text x="90" y="395" font-family="Noto Sans, DejaVu Sans, Arial, sans-serif" font-size="78" font-weight="800" fill="#ffffff">ViaFluvial<tspan fill="#F9C74F">Amazônia</tspan></text>
  <text x="90" y="470" font-family="Noto Sans, DejaVu Sans, Arial, sans-serif" font-size="38" font-weight="500" fill="#E6F2EA">O transporte fluvial da Amazônia, conectado.</text>
  <text x="90" y="560" font-family="Noto Sans, DejaVu Sans, Arial, sans-serif" font-size="28" font-weight="600" fill="#F9C74F">sobre.viafluvial.com.br</text>
</svg>`;

const og = await sharp(Buffer.from(svg))
  .composite([{ input: logoPng, left: 90, top: 70 }])
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(new URL('../public/og-image.png', import.meta.url), og);
console.log('public/og-image.png gerado');
