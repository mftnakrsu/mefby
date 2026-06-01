# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install deps
npm run dev        # Astro dev server on http://localhost:3000
npm run build      # astro check + astro build → dist/
npm run preview    # serve the built dist/ locally
```

TypeScript and Astro syntax are validated by `astro check` (run automatically during `npm run build`). There is no test runner, linter, or formatter configured.

## Environment

The project has no required environment variables. `.env.example` is empty.

## Architecture

**Astro 5, static-by-default.** Pages live in `src/pages/`; layouts in `src/layouts/`; reusable components in `src/components/`. All pages render server-side at build time. No client JS unless an island opts in via `client:visible` / `client:idle`.

**Content split.**
- **Résumé data** (profile, experience, projects, publications, education, certifications, external writings) stays in `constants.ts` and is imported by `src/pages/index.astro`. Rendered at build time as static HTML.
- **Essays** live as MDX files in `src/content/essays/`. Frontmatter is validated by a Zod schema in `src/content/config.ts` (Astro Content Collections). The dynamic route `src/pages/essays/[...slug].astro` renders each essay through `src/layouts/EssayLayout.astro`.

**Adding a new essay.** Drop an MDX file into `src/content/essays/`, add frontmatter matching the schema (title, description, date, tags), write the prose. The home page and `/essays` index pick it up automatically. Embed figures with the `Diagram` component:

```mdx
import Diagram from '../../components/essay/Diagram.astro';

<Diagram number="1" caption="...">
  <img src="/essays/<slug>/01-foo.svg" alt="" />
</Diagram>
```

Static SVGs go under `public/essays/<slug>/`. For interactive figures, write a React component in `src/components/essay/` and use `client:visible` on it inside `<Diagram>` (requires re-adding `@astrojs/react` to `astro.config.mjs` and as a dep — currently dropped since no essay uses it).

**Styling.** Tailwind CSS 4 via `@tailwindcss/vite` plugin. Theme config (font family, etc.) is in `src/styles/global.css` under the `@theme` directive (v4 CSS-native config; no `tailwind.config.js`). Inter font self-hosted via `@fontsource-variable/inter`. KaTeX CSS imported globally for math in essays.

**SEO.** `Layout.astro` sets default meta + OpenGraph + Person JSON-LD. `EssayLayout.astro` adds Article JSON-LD per essay. `@astrojs/sitemap` integration generates `/sitemap-index.xml`. `/rss.xml` endpoint serves the essay feed from the Content Collection.

**Path alias.** `@/*` → `src/*` (defined in `tsconfig.json`).

**Deployment.** Vercel auto-detects Astro from `astro.config.mjs`. `vercel.json` only sets `"framework": "astro"`.
