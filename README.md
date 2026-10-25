# Mefby — Personal Portfolio

Personal portfolio, projects and essays for Meftun Akarsu (AI Engineer).

## Tech stack

- **Astro 6** (static-by-default rendering, no UI framework)
- **TypeScript** (strict)
- **Tailwind CSS 4** with OKLCH design tokens (CSS-native theme config)
- **MDX** essays and project write-ups via Astro Content Collections (type-safe frontmatter)
- **Fontsource** variable fonts: Bricolage Grotesque, Hanken Grotesk, Geist Mono
- **Vercel** deployment

The visual design follows [ArynBuilds/portfolio-for-friend](https://github.com/ArynBuilds/portfolio-for-friend): the home page scrolls through numbered colour zones, and every other page shares its type, palette and chrome.

## Local development

```bash
npm install
npm run dev      # → http://localhost:3000
npm run build    # production build (runs astro check + astro build)
npm test         # unit and page tests (run after a build)
npm run preview  # serve the build on http://localhost:3000
```

Node 22.12 or newer; `npm test` needs Node 22.18+ or 24. No environment variables are needed to build; `.env.example` lists the optional Unsplash key used by `scripts/unsplash.mjs`.

## Adding a project

1. Create `src/content/projects/<slug>.mdx` with frontmatter: `title`, `summary`, `year`, `category`, `spec`, `stack`, `links`, and optionally `private`, `image` and `featured`. The schema is in `src/content.config.ts`.
2. Add a short write-up (120–350 words) below the frontmatter to give the project its own page at `/projects/<slug>`. Without one, it is a row on `/projects` that links to its repository.
3. Put images under `public/projects/<slug>/`, or pick an Unsplash photo with `node scripts/unsplash.mjs search "<query>"` and `node scripts/unsplash.mjs use <photo-id>`.
4. Run `npm run build && npm test`.

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

3. The essay appears at `/essays/<slug>`, gets listed at `/essays`, and joins the RSS feed. To show it on the home page, add its slug to `HOME_ESSAYS` in `constants.ts`.

## Deployment

Vercel auto-detects Astro from `astro.config.mjs`. Push to `main` → production deploy.

## Author

Meftun Akarsu
- Email: meftunakrsu@gmail.com
- LinkedIn: [meftunakarsu](https://www.linkedin.com/in/meftunakarsu/)
- GitHub: [mftnakrsu](https://github.com/mftnakrsu)
