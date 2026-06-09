import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // i18n: a translated copy sets lang:'tr' + translationSlug pointing to its
    // counterpart. Translation variants are hidden from listings (reachable via
    // the in-essay language toggle) so each essay appears once.
    lang: z.enum(['en', 'tr']).default('en'),
    translationSlug: z.string().optional(),
  }),
});

export const collections = { essays };
