# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install deps
npm run dev        # Astro dev server on http://localhost:3000
npm run build      # astro check + astro build → dist/
npm run preview    # serve the built dist/ on http://localhost:3000
npm test           # node --test "tests/**/*.test.ts" (build first: page tests read dist/)
```

Requires Node >= 22.12 (Astro 6); `npm test` needs Node 22.18+ or 24 (TypeScript type stripping). An `.nvmrc` pins 22 for nvm users.

TypeScript and Astro syntax are validated by `astro check` (run automatically during `npm run build`). Tests use Node's built-in runner: unit tests import `src/lib/*.ts` directly, so value imports between `src/lib` files keep the `.ts` extension; page tests read the built HTML in `dist/` through `tests/helpers/dist.ts`. There is no linter or formatter.

## Environment

No environment variables are needed to build. `UNSPLASH_ACCESS_KEY` (in the gitignored `.env`, see `.env.example`) is used only by `scripts/unsplash.mjs`, the dev tool that finds an Unsplash photo for a project and registers its use.

Local-only, gitignored: `docs/private/` (planning notes and review documents) and `tests/wording.local.json` (a wording checklist; `tests/wording.test.ts` skips without it). Never commit either.

## Architecture

**Astro 6, static-by-default, no UI framework.** Pages live in `src/pages/`; layouts in `src/layouts/`; components in `src/components/` (site chrome in `site/`, home sections in `home/`, project pieces in `projects/`, essay figures in `essay/`). All pages render at build time. The only client JS is the one-line `js` flag on `<html>` (`Layout.astro`), `src/scripts/reveal.ts` (every page), `src/scripts/journey.ts` and `src/scripts/home-nav.ts` (home page), and the essay copy-button and iframe auto-fit scripts.

**Visual system.** Design tokens are CSS custom properties in `src/styles/global.css` (OKLCH), mirrored as data in `src/lib/palette.ts` for scripts and tests, and mapped into Tailwind with `@theme inline` (`bg-paper`, `bg-paper-sunk`, `text-fg`, `text-fg-muted`, `border-fg-line`, `bg-accent-ink`, `text-accent-ink`, …). Tailwind's default palette is removed, so `zinc-*`, `emerald-*`, `white` and `black` classes do nothing, and `tests/legacy-classes.test.ts` fails if one appears. Components use the live tokens (`--canvas`, `--fg`, `--fg-muted`, `--fg-line`, `--focus`), never raw ink or bone, so they read on any canvas. `--accent` is decoration only on light canvases; links and filled buttons there use `--accent-ink`.

**Home page journey.** The home page (`<Layout variant="home">`) scrolls through numbered colour zones: hero, 01 Products, 02 Writing, 03 Selected work, 04 Experience, 05 Publications and the footer. `src/scripts/journey.ts` sets `--canvas` from the zone under the viewport middle (`src/lib/journeyMath.ts`, pure and unit-tested) and sets `html[data-tone="dark"]` on dark zones, which switches the text to bone. `src/scripts/home-nav.ts` shows the dock after the hero and marks the active section in the dock and the progress rail. Section ids and titles are in `src/lib/sections.ts`. Every other page sits on the paper canvas with the sticky header and the compact footer.

**Type and motion.** Bricolage Grotesque (display and headings), Hanken Grotesk (body and UI) and Geist Mono (data only: dates, indices, counts), self-hosted through Fontsource. Type-scale classes in `global.css`: `.t-display`, `.t-title`, `.t-heading`, `.t-lead`, `.t-body`, `.t-mono`, `.t-label`, `.measure`. Reveal-on-scroll uses `data-reveal` (plus `style="--i:N"` for the stagger) and hides content only under `html.js`, so pages stay readable without JavaScript.

**Content.**
- **Résumé data** (profile, experience, publications, education, certifications, Medium posts) is in `constants.ts`, typed by `types.ts`.
- **Products** are the `PRODUCTS` array in `constants.ts` (type `Product`). Each is a `ProductCard` on `/products` and gets a page from `src/pages/products/[slug].astro`; the home page leads with Oyla and lists the rest. `src/lib/productMeta.ts` builds facts, links and structured-data fields. Media goes under `public/products/<slug>/`.
- **Projects** are MDX files in `src/content/projects/` (Content Layer `glob` loader; schema in `src/content.config.ts`). The file name is the URL slug. Every entry is a row on `/projects`; an entry with a body (its write-up) also gets `/projects/<slug>`. `featured` puts an entry in one of the four groups of the home page's Selected work. Grouping, ordering and link rules are in `src/lib/projects.ts`.
- **Essays** are MDX files in `src/content/essays/` (schema in `src/content.config.ts`; an entry's `id` is its file name and URL slug). `src/pages/essays/[...slug].astro` renders each through `src/layouts/EssayLayout.astro`. The three numbered courses are described in `src/lib/courses.ts`; their hubs (`/essays/rag`, `/essays/agents`, `/essays/evals`) and glossaries are thin pages around `CourseHub` and `CourseGlossary`. The home page's Writing section shows the essays listed in `HOME_ESSAYS` (`constants.ts`), in that order.

**Adding a project.** Create `src/content/projects/<slug>.mdx`:

```mdx
---
title: "Project name"
summary: "One sentence for the /projects row, the home card and the meta description."
year: 2026
category: llm            # llm | research | edge | vision | data | learning
spec: ["RAG", "Azure"]   # short spec-line tokens
stack: ["Python", "FastAPI"]
private: false           # true: closed source, no repository link
links:
  repo: "https://github.com/mftnakrsu/<repo>"
image:                   # optional; needed when the project is featured
  src: "/projects/<slug>/<file>.png"
  alt: "What the image shows"
  width: 1600
  height: 1000
---

Optional write-up, 120–350 words in `##` sections. With a body, the project gets its own page.
```

Images come from the project's own public repository (copied to `public/projects/<slug>/`) or from Unsplash: `node scripts/unsplash.mjs search "<query>"`, then `node scripts/unsplash.mjs use <photo-id>`, which registers the use and prints the `image` block with the photographer credit. Never take images from private repositories. `npm test` checks the schema rules, write-up lengths, image sizes and links. The tests also pin the approved inventory: add the slug to `INVENTORY` in `tests/content.test.ts` (under its category; `true` when it has a write-up) and raise the totals there (entries, write-ups); a `featured` entry also goes into the expected card order in `tests/home.test.ts`.

**Adding an essay.** Drop an MDX file into `src/content/essays/`, add frontmatter matching the schema (title, description, date, tags), write the prose. `/essays` and the RSS feed pick it up automatically; the home page shows only the essays in `HOME_ESSAYS`. Embed figures with the `Diagram` component:

```mdx
import Diagram from '../../components/essay/Diagram.astro';

<Diagram number="1" caption="...">
  <img src="/essays/<slug>/01-foo.svg" alt="" />
</Diagram>
```

Static SVGs go under `public/essays/<slug>/`. Interactive figures are self-contained HTML files in the same folder, embedded with `IframeFigure` (it sizes the iframe to its content).

**Styling.** Tailwind CSS 4 via the `@tailwindcss/vite` plugin; the theme is in `src/styles/global.css` (`@theme` and `@theme inline`; no `tailwind.config.js`). Long-form text (essays and project write-ups) is styled by `src/styles/prose.css` (`.prose`, plus `.prose-project` for write-ups). EssayLayout imports the KaTeX CSS; math needs `$$…$$` (inline `$…$` is off, so dollar amounts stay text).

**SEO.** `Layout.astro` sets default meta, OpenGraph and Person JSON-LD. `EssayLayout.astro` adds Article and BreadcrumbList JSON-LD and hreflang alternates for EN/TR pairs; product pages add SoftwareApplication JSON-LD. `@astrojs/sitemap` generates `/sitemap-index.xml`; `/rss.xml` serves the essay feed from the content collection.

**Path alias.** `@/*` → `src/*` (defined in `tsconfig.json`).

**Deployment.** Vercel auto-detects Astro from `astro.config.mjs`. `vercel.json` only sets `"framework": "astro"`.
