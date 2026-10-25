import { getCollection } from 'astro:content';

/** Notícias publicadas (sem rascunhos), da mais recente para a mais antiga. */
export async function getPublishedNews() {
  return (await getCollection('news', (entry) => !entry.data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}
