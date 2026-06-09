import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = await getCollection('essays', ({ data }) => !data.draft && !(data.lang === 'tr' && data.translationSlug));
  return rss({
    title: 'Meftun Akarsu — Essays',
    description: 'Long-form technical essays from Meftun Akarsu.',
    site: context.site!,
    items: essays
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map(essay => ({
        title: essay.data.title,
        pubDate: essay.data.date,
        description: essay.data.description,
        link: `/essays/${essay.slug}/`,
      })),
  });
}
