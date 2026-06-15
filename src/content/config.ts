import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // Optional link to the essay's companion code (a folder in the rag-by-hand repo).
    codeUrl: z.string().url().optional(),
    // Optional social-card image (site-relative path, e.g. /og/rag-by-hand.png).
    ogImage: z.string().optional(),
    // Optional position in a numbered series; on the index these sort ascending,
    // before the non-series essays (which stay newest-first).
    seriesOrder: z.number().int().positive().optional(),
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
