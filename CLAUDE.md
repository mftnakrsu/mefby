# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install deps
npm run dev        # Vite dev server on http://localhost:3000 (host 0.0.0.0)
npm run build      # production build → dist/
npm run preview    # serve the built dist/ locally
```

There is no test runner, linter, or formatter configured. TypeScript is `noEmit` — type-checking happens only via the editor / `tsc --noEmit` (not wired into a script).

## Environment

The project has no required environment variables. `.env.example` is empty.

## Architecture

**Content is data, not markup.** All résumé content (profile, experience, projects, publications, education, certifications, writing, skills, employer/freelance client lists) lives in `constants.ts`. `App.tsx` renders the visible page directly from these arrays.

Editing `constants.ts` updates the rendered portfolio. Adding a new content section means: extend `types.ts`, add the array to `constants.ts`, and render it in `App.tsx`.

**Active vs. dormant components.** `App.tsx` is a single-file résumé layout (light theme, max-w-2xl) that imports only `BlogPostModal` from `components/`. The other files in `components/` (`Hero.tsx`, `Navbar.tsx`, `Stats.tsx`, `Clients.tsx`, `AnimatedSection.tsx`) and the `hooks/useScrollAnimation.ts` hook are leftovers from a previous dark-theme design with a fixed nav, hero, scroll animations, and a Recharts radar of `SKILLS`. They are not wired into the current app. Don't assume changes there are visible — either delete them or re-mount them in `App.tsx` first.

**Styling.** Tailwind is loaded via the `cdn.tailwindcss.com` script in `index.html`, with the config inlined in a `<script>` block right after it (custom `Inter` font and a `dark` color alias). There is no `tailwind.config.js`, no PostCSS, no `@tailwind` directives. `index.css` is essentially empty. Class names are authored directly in JSX.

**Importmap caveat.** `index.html` contains an `<script type="importmap">` pointing React and recharts at `aistudiocdn.com`. This is an artifact from Google AI Studio prototyping. The Vite build resolves these imports from `node_modules` (the npm packages in `package.json`); the importmap only matters if `index.html` were opened without Vite. Don't rely on it for production paths.

**Path alias.** `vite.config.ts` and `tsconfig.json` both define `@/*` → project root, but nothing currently uses it — imports are relative.

**Deployment.** `vercel.json` declares a Vite framework build with SPA fallback (`/(.*)` → `/index.html`).
