import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/** Notícias da plataforma: um arquivo Markdown por notícia, publicado junto com o site. */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(110),
      summary: z.string().max(220),
      type: z.enum(['lancamento', 'nova-rota', 'nova-funcao', 'institucional']),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      image: image(),
      imageAlt: z.string(),
      /** id da foto em credits/photos.json, quando a imagem é uma foto licenciada. */
      imageCredit: z.string().optional(),
      links: z
        .array(z.object({ label: z.string(), url: z.url(), kind: z.enum(['app', 'cargas', 'docs']) }))
        .default([]),
    }),
});

/** "O que vem por aí": itens do roteiro público, sem datas. */
const roadmap = defineCollection({
  loader: file('src/content/roadmap/items.yaml'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    column: z.enum(['agora', 'em-seguida', 'mais-adiante']),
    audience: z.enum(['passageiros', 'barqueiros', 'cargas', 'empresas', 'todos']),
    order: z.number(),
  }),
});

/** "A Amazônia e os rios em números": cada indicador com valor, unidade, ano, fonte e endereço exato da fonte. */
const numbers = defineCollection({
  loader: file('src/content/numbers/indicators.json'),
  schema: z.object({
    order: z.number(),
    featured: z.boolean().default(false),
    label: z.string(),
    value: z.string(),
    unit: z.string(),
    year: z.number(),
    description: z.string(),
    scope: z.string(),
    sourceName: z.string(),
    sourceUrl: z.url(),
    quote: z.string(),
  }),
});

/** Créditos das fotos licenciadas (autor, licença e endereço de origem). */
const credits = defineCollection({
  loader: file('src/content/credits/photos.json'),
  schema: z.object({
    title: z.string(),
    alt: z.string(),
    author: z.string(),
    license: z.string(),
    licenseUrl: z.url(),
    sourceUrl: z.url(),
    note: z.string().optional(),
  }),
});

/** Linha do tempo da página Quem somos. */
const timeline = defineCollection({
  loader: file('src/content/timeline/items.yaml'),
  schema: z.object({
    when: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

export const collections = { news, roadmap, numbers, credits, timeline };
