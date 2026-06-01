# Mefby — Personal Portfolio

Personal portfolio and essays for Meftun Akarsu (AI Engineer).

## Tech Stack

- **Astro 5** (static-by-default rendering)
- **TypeScript** (strict)
- **Tailwind CSS 4** (CSS-native theme config)
- **MDX** essays via Astro Content Collections (type-safe frontmatter)
- **Vercel** deployment

## Local development

```bash
npm install
npm run dev    # → http://localhost:3000
npm run build  # production build (runs astro check + astro build)
npm run preview
```

No environment variables required.

## Writing an essay

1. Create `src/content/essays/<slug>.mdx` with frontmatter:

   ```mdx
   ---
   title: "Your Essay Title"
   description: "One-line summary."
   date: 2026-06-15
   tags: ["RAG", "LLMs"]
   ---

   Your prose here.

   <Diagram number="1" caption="Figure caption">
     <img src="/essays/<slug>/figure.svg" alt="" />
   </Diagram>
   ```

2. Drop any figures into `public/essays/<slug>/`.

3. The essay appears at `/essays/<slug>`, gets listed at `/essays`, and joins the RSS feed.

## Deployment

Vercel auto-detects Astro from `astro.config.mjs`. Push to `main` → production deploy.

## Author

Meftun Akarsu
- Email: meftunakrsu@gmail.com
- LinkedIn: [meftunakarsu](https://www.linkedin.com/in/meftunakarsu/)
- GitHub: [mftnakrsu](https://github.com/mftnakrsu)
