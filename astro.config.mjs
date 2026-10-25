// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sobre.viafluvial.com.br',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [
    react(),
    sitemap({
      // As páginas de resultado da newsletter são só destino de redirecionamento.
      filter: (page) => !page.includes('/newsletter/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
