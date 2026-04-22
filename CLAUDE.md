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

- `VITE_GEMINI_API_KEY` — required for the chatbot. Read in `services/geminiService.ts` via `import.meta.env`, with a fallback to the unprefixed `GEMINI_API_KEY`. If absent, the chatbot returns a "services unavailable" message instead of crashing.
- `.env.example` is checked in and currently contains a literal-looking key string; treat it as an example, not a secret to keep.

## Architecture

**Content is data, not markup.** All résumé content (profile, experience, projects, publications, education, certifications, writing, skills, employer/freelance client lists) lives in `constants.ts`. Two consumers read it:

1. `App.tsx` renders the visible page directly from these arrays.
2. `services/geminiService.ts` — `buildContext()` interpolates the same constants into the Gemini system prompt on every request.

Editing `constants.ts` therefore updates both the rendered portfolio *and* the AI chatbot's knowledge in one place. Adding a new content section means: extend `types.ts`, add the array to `constants.ts`, render it in `App.tsx`, and (if the chatbot should know about it) reference it inside `buildContext()`.

**Active vs. dormant components.** `App.tsx` is a single-file résumé layout (light theme, max-w-2xl) that imports only `ChatBot` from `components/`. The other files in `components/` (`Hero.tsx`, `Navbar.tsx`, `Stats.tsx`, `Clients.tsx`, `AnimatedSection.tsx`) and the `hooks/useScrollAnimation.ts` hook are leftovers from a previous dark-theme design with a fixed nav, hero, scroll animations, and a Recharts radar of `SKILLS`. They are not wired into the current app. Don't assume changes there are visible — either delete them or re-mount them in `App.tsx` first.

**Chatbot flow.** `components/ChatBot.tsx` keeps message state locally, calls `sendMessageToGemini(userMessage)` per send, and renders a floating widget. Each call is independent — the Gemini SDK is invoked statelessly via `ai.models.generateContent` with `model: 'gemini-2.5-flash'` and the full context as `systemInstruction`. There is no conversation history sent to the model; if multi-turn memory is needed, the `contents` parameter has to be changed to include prior messages.

**Styling.** Tailwind is loaded via the `cdn.tailwindcss.com` script in `index.html`, with the config inlined in a `<script>` block right after it (custom `Inter` font and a `dark` color alias). There is no `tailwind.config.js`, no PostCSS, no `@tailwind` directives. `index.css` is essentially empty. Class names are authored directly in JSX.

**Importmap caveat.** `index.html` contains an `<script type="importmap">` pointing React, recharts, and `@google/genai` at `aistudiocdn.com`. This is an artifact from Google AI Studio prototyping. The Vite build resolves these imports from `node_modules` (the npm packages in `package.json`); the importmap only matters if `index.html` were opened without Vite. Don't rely on it for production paths.

**Path alias.** `vite.config.ts` and `tsconfig.json` both define `@/*` → project root, but nothing currently uses it — imports are relative.

**Deployment.** `vercel.json` declares a Vite framework build with SPA fallback (`/(.*)` → `/index.html`). The chatbot key must be set as `VITE_GEMINI_API_KEY` in Vercel's environment variables.
