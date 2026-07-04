import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const essays = defineCollection({
  // Astro 6 Content Layer: entries are loaded explicitly; each file's `id` is its
  // filename without the extension, matching the old `slug` used in routes/links.
  loader: glob({ pattern: '**/*.mdx', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // Optional link to the essay's companion code + notebook (a folder in the rag-by-hand repo).
    codeUrl: z.url().optional(),
    // Optional social-card image (site-relative path, e.g. /og/rag-by-hand.png).
    ogImage: z.string().optional(),
    // Optional ~155-char summary used for the <meta description> / og:description.
    // Falls back to `description` (which doubles as the long on-page intro) when absent.
    summary: z.string().optional(),
    // Optional position in a numbered series; on the index these sort ascending,
    // before the non-series essays (which stay newest-first).
    seriesOrder: z.number().int().positive().optional(),
    // Which numbered series this essay belongs to. Scopes the "Part X of N" count,
    // prev/next links, the banner/label, and the og-image fallback so two series
    // (RAG, Agents) coexist without bleeding into each other. Only meaningful when
    // seriesOrder is set. Defaults to 'rag' so the 20 existing RAG essays need no
    // change; new Agents essays set series: 'agents'.
    series: z.enum(['rag', 'agents', 'evals']).default('rag'),
    draft: z.boolean().default(false),
    // i18n: an essay and its translation point at each other via translationSlug
    // (the counterpart's slug) and declare their own `lang`. The secondary copy
    // sets isTranslation:true and is hidden from listings (reachable via the
    // in-essay language toggle) so each essay appears exactly once. The canonical
    // copy may be in either language, so hiding is flag-based, not language-based.
    lang: z.enum(['en', 'tr']).default('en'),
    translationSlug: z.string().optional(),
    isTranslation: z.boolean().default(false),
  }),
});

export const collections = { essays };
