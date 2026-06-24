# Agents Series — Part 0 (Site Infra) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Astro site able to host two numbered essay series ("RAG from First Principles" and the upcoming "Agents from First Principles") without their part-counts, prev/next links, banners, labels, or og-images bleeding together — leaving the live RAG series rendering byte-identically.

**Architecture:** Add a `series` discriminator field to the essay content schema (defaulting to `'rag'`), then scope every place that today counts/sorts/labels "any essay with a `seriesOrder`" so it operates *within one series* instead of across the single global collection. No new pages or essays ship in this increment; the Agents hub/glossary/og-image and the first Agents essay land in Increment 1.

**Tech Stack:** Astro 5 (static), TypeScript, Astro Content Collections + Zod, Tailwind CSS 4. Path alias `@/*` → `src/*`.

## Global Constraints

- **No test runner / linter / formatter exists** (per CLAUDE.md). The verification cycle for every task is: `npm run build` (which runs `astro check` + `astro build`) must pass, then assert rendered output by grepping the generated `dist/` HTML, plus source review. There is no `npm test`.
- **`series` defaults to `'rag'`** in the schema, so the 20 existing RAG essays need **no edits** (deliberate: this removes the "forgot to backfill → broke the RAG series" risk). Only new Agents essays set `series: 'agents'`.
- **Commit messages must NOT include any `Co-Authored-By: Claude` or "Generated with Claude Code" trailer** (standing user preference).
- **`git add` only the exact files named in each task — never `git add -A`.** Parallel CLI sessions leave unrelated untracked WIP in this repo (e.g. `easa-ai-blog.md`, sibling essay dirs); a blanket add would sweep them in.
- **Em-dash-free** in any new copy (replace `—` with natural punctuation; word hyphens and `→` arrows are fine). Existing entities use HTML `&mdash;`/`&rarr;` in markup — match the file's existing convention.
- **Series controlled vocabulary:** `'rag' | 'agents'`. The RAG core/frontier split is parts ≤12 / ≥13; the Agents split (used only by the Agents hub in Increment 1) will be ≤11 / ≥12.
- Astro components type-check their `Props` interface: if you pass a prop to a component, that prop must exist in the component's `Props` or `astro check` fails. Order tasks so each one builds green on its own.

---

## File map (this increment)

Modified (7 files), created (0), no essays touched:

- `src/content/config.ts` — add the `series` field.
- `src/layouts/EssayLayout.astro` — accept a `series` prop; series-scoped label (EN/TR) + hub link.
- `src/pages/essays/[...slug].astro` — group prev/next + `seriesTotal` by series; scope og fallback; pass `series` down.
- `src/pages/essays/rag.astro` — scope the hub's part list to `series === 'rag'`.
- `src/pages/essays/rag-glossary.astro` — scope the glossary list to `series === 'rag'`.
- `src/pages/index.astro` — scope the home course-card count to RAG; add a (hidden-until-populated) Agents card.
- `src/pages/essays/index.astro` — group the index's series block by series.

Deferred to Increment 1 (NOT in this plan): `src/pages/essays/agents.astro`, `src/pages/essays/agents-glossary.astro`, `public/og/agents-by-hand.png`, and the first Agents essay. Nothing in this increment links to `/essays/agents` at render time (the home Agents card and any Agents-series label are gated on Agents essays existing, of which there are none yet), so there is no dangling link.

---

### Task 1: Add the `series` field to the content schema (and branch)

**Files:**
- Modify: `src/content/config.ts:19-20`

**Interfaces:**
- Produces: `essay.data.series: 'rag' | 'agents'` (always defined; defaults to `'rag'`), consumed by every later task.

- [ ] **Step 1: Create the working branch**

We are on `main` (the default branch); branch before editing.

```bash
git checkout -b feat/agents-series-part0-infra
```

- [ ] **Step 2: Add the `series` field after `seriesOrder`**

In `src/content/config.ts`, insert the `series` field immediately after the `seriesOrder` line (currently line 19) and before `draft`:

```ts
    // Optional position in a numbered series; on the index these sort ascending,
    // before the non-series essays (which stay newest-first).
    seriesOrder: z.number().int().positive().optional(),
    // Which numbered series this essay belongs to. Scopes the "Part X of N" count,
    // prev/next links, the banner/label, and the og-image fallback so two series
    // (RAG, Agents) coexist without bleeding into each other. Only meaningful when
    // seriesOrder is set. Defaults to 'rag' so the 20 existing RAG essays need no
    // change; new Agents essays set series: 'agents'.
    series: z.enum(['rag', 'agents']).default('rag'),
    draft: z.boolean().default(false),
```

- [ ] **Step 3: Build to verify the schema compiles and all essays still validate**

Run: `npm run build`
Expected: PASS — `astro check` reports 0 errors; build completes. (Adding an optional, defaulted field does not invalidate any existing frontmatter.)

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts
git commit -m "feat(essays): add series discriminator field (default rag)"
```

---

### Task 2: Series-scope the label and hub link in EssayLayout

**Files:**
- Modify: `src/layouts/EssayLayout.astro:4-25` (Props + destructure), `:31-34` (label), `:138` (hub link)

**Interfaces:**
- Consumes: `series` prop (`'rag' | 'agents'`, optional, default `'rag'`).
- Produces: a series-scoped `seriesLabel` and `seriesHub`; `<EssayLayout series=... />` becomes a valid prop for Task 3 to pass.

- [ ] **Step 1: Add `series` to the `Props` interface and destructure it**

In `src/layouts/EssayLayout.astro`, inside the `Props` interface, replace the existing `  seriesOrder?: number;` line (line 20 — NOT the identical line 7, which belongs to the `SeriesLink` interface) with both lines:

```ts
  series?: 'rag' | 'agents';
  seriesOrder?: number;
```

Then change the destructure line (currently line 25) to:

```ts
const { title, description, date, tags = [], lang = 'en', slug, summary, translationSlug, codeUrl, ogImage, series = 'rag', seriesOrder, seriesTotal, prevEssay, nextEssay } = Astro.props;
```

- [ ] **Step 2: Replace the hardcoded RAG label with a series-scoped map**

Replace the current label block (lines 31-34):

```ts
const inSeries = seriesOrder != null && seriesTotal != null;
const seriesLabel = lang === 'tr'
  ? `RAG: İLK İLKELERDEN · BÖLÜM ${seriesOrder} / ${seriesTotal}`
  : `RAG FROM FIRST PRINCIPLES · PART ${seriesOrder} OF ${seriesTotal}`;
```

with:

```ts
const SERIES_META = {
  rag: { en: 'RAG FROM FIRST PRINCIPLES', tr: 'RAG: İLK İLKELERDEN', hub: '/essays/rag' },
  agents: { en: 'AGENTS FROM FIRST PRINCIPLES', tr: 'AJANLAR: İLK İLKELERDEN', hub: '/essays/agents' },
} as const;
const sm = SERIES_META[series] ?? SERIES_META.rag;
const inSeries = seriesOrder != null && seriesTotal != null;
const seriesLabel = lang === 'tr'
  ? `${sm.tr} · BÖLÜM ${seriesOrder} / ${seriesTotal}`
  : `${sm.en} · PART ${seriesOrder} OF ${seriesTotal}`;
```

- [ ] **Step 3: Point the badge link at the series hub**

Replace line 138's hardcoded hub href:

```astro
          <a href="/essays/rag" class="inline-block text-[11px] font-mono uppercase tracking-widest text-emerald-700 hover:text-emerald-800 transition-colors mb-3">{seriesLabel}</a>
```

with:

```astro
          <a href={sm.hub} class="inline-block text-[11px] font-mono uppercase tracking-widest text-emerald-700 hover:text-emerald-800 transition-colors mb-3">{seriesLabel}</a>
```

- [ ] **Step 4: Build, then confirm the RAG label and hub render identically**

Run: `npm run build`
Expected: PASS (0 check errors).

Run: `grep -o "RAG FROM FIRST PRINCIPLES · PART 1 OF 20" dist/essays/why-rag-exists/index.html`
Expected: prints `RAG FROM FIRST PRINCIPLES · PART 1 OF 20` (the default `series='rag'` reproduces the old label exactly, since `[...slug].astro` does not pass `series` yet so it defaults).

Run: `grep -c 'href="/essays/rag"' dist/essays/why-rag-exists/index.html`
Expected: a count `>= 1` (the badge link still points at the RAG hub).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/EssayLayout.astro
git commit -m "feat(essays): series-scope the EssayLayout label and hub link"
```

---

### Task 3: Group prev/next + seriesTotal by series in the essay page

**Files:**
- Modify: `src/pages/essays/[...slug].astro:5-31` (getStaticPaths), `:59-60` (og fallback + pass `series`)

**Interfaces:**
- Consumes: `essay.data.series` (Task 1), `<EssayLayout series=... />` (Task 2).
- Produces: per-essay `prevEssay` / `nextEssay` / `seriesTotal` computed within the essay's own series.

- [ ] **Step 1: Rewrite the series computation to group by series key**

Replace the body of `getStaticPaths` from the `const series = ...` block through the `return essays.map(...)` (currently lines 10-31) with:

```ts
  // Numbered series, grouped by `series` so each (RAG, Agents) has its own part
  // count and prev/next chain. Derives the "Part X of N" badge and links so they
  // can never drift from the actual content.
  const seriesByKey = new Map<string, CollectionEntry<'essays'>[]>();
  for (const e of essays) {
    if (e.data.seriesOrder == null) continue;
    const list = seriesByKey.get(e.data.series) ?? [];
    list.push(e);
    seriesByKey.set(e.data.series, list);
  }
  for (const list of seriesByKey.values()) {
    list.sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
  }

  const lite = (e: CollectionEntry<'essays'> | undefined | null) =>
    e ? { slug: e.slug, title: e.data.title, seriesOrder: e.data.seriesOrder } : null;

  return essays.map((essay) => {
    const group = essay.data.seriesOrder != null ? (seriesByKey.get(essay.data.series) ?? []) : [];
    const i = group.findIndex((e) => e.slug === essay.slug);
    const inSeries = i !== -1;
    return {
      params: { slug: essay.slug },
      props: {
        essay,
        prevEssay: inSeries && i > 0 ? lite(group[i - 1]) : null,
        nextEssay: inSeries && i < group.length - 1 ? lite(group[i + 1]) : null,
        seriesTotal: inSeries ? group.length : null,
      },
    };
  });
```

(The `CollectionEntry` type is already imported on line 2; no import change needed.)

- [ ] **Step 2: Scope the og fallback by series and pass `series` to the layout**

Replace the `ogImage` line (currently line 59) and add a `series` prop right after it:

```astro
  ogImage={essay.data.ogImage ?? (essay.data.seriesOrder != null ? '/og/rag-by-hand.png' : undefined)}
  seriesOrder={essay.data.seriesOrder}
```

with:

```astro
  ogImage={essay.data.ogImage ?? (essay.data.seriesOrder != null ? (essay.data.series === 'agents' ? '/og/agents-by-hand.png' : '/og/rag-by-hand.png') : undefined)}
  series={essay.data.series}
  seriesOrder={essay.data.seriesOrder}
```

- [ ] **Step 3: Build, then confirm RAG totals and og are unchanged**

Run: `npm run build`
Expected: PASS (0 check errors).

Run: `grep -o "PART 1 OF 20" dist/essays/why-rag-exists/index.html && grep -o "PART 20 OF 20" dist/essays/conversational-rag/index.html`
Expected: prints `PART 1 OF 20` then `PART 20 OF 20` (the RAG group still totals 20; first/last parts correct).

Run: `grep -o "rag-by-hand.png" dist/essays/embeddings/index.html | head -1`
Expected: prints `rag-by-hand.png` (RAG og fallback intact).

- [ ] **Step 4: Commit**

```bash
git add src/pages/essays/[...slug].astro
git commit -m "feat(essays): group prev/next and part-count by series"
```

---

### Task 4: Scope the RAG hub and glossary to the RAG series

**Files:**
- Modify: `src/pages/essays/rag.astro:6` (filter)
- Modify: `src/pages/essays/rag-glossary.astro:5` (filter)

**Interfaces:**
- Consumes: `essay.data.series` (Task 1).
- Produces: a RAG hub/glossary that lists only `series === 'rag'` parts (future Agents parts won't leak in).

- [ ] **Step 1: Scope the RAG hub filter**

In `src/pages/essays/rag.astro`, change the `parts` filter (line 6) from:

```ts
const parts = (await getCollection('essays', ({ data }) => !data.draft && data.seriesOrder != null))
```

to:

```ts
const parts = (await getCollection('essays', ({ data }) => !data.draft && data.seriesOrder != null && data.series === 'rag'))
```

- [ ] **Step 2: Scope the RAG glossary filter**

In `src/pages/essays/rag-glossary.astro`, change the `parts` filter (line 5) from:

```ts
const parts = (await getCollection('essays', ({ data }) => !data.draft && data.seriesOrder != null))
```

to:

```ts
const parts = (await getCollection('essays', ({ data }) => !data.draft && data.seriesOrder != null && data.series === 'rag'))
```

- [ ] **Step 3: Build, then confirm the RAG hub still lists 20 parts**

Run: `npm run build`
Expected: PASS (0 check errors).

Run: `grep -o "A 20-part course" dist/essays/rag/index.html`
Expected: prints `A 20-part course` (the hub's `{parts.length}` is still 20; `series === 'rag'` matches all 20 via the default).

Run: `grep -c "Part 20:" dist/essays/rag-glossary/index.html`
Expected: a count `>= 1` (the glossary still includes Part 20).

- [ ] **Step 4: Commit**

```bash
git add src/pages/essays/rag.astro src/pages/essays/rag-glossary.astro
git commit -m "feat(essays): scope the RAG hub and glossary to the rag series"
```

---

### Task 5: Series-scope the home page and the /essays index

**Files:**
- Modify: `src/pages/index.astro:11-17` (counts), `:110-121` (course cards)
- Modify: `src/pages/essays/index.astro:12-16` (series grouping), `:38` (banner count)

**Interfaces:**
- Consumes: `essay.data.series` (Task 1).
- Produces: home shows a RAG course card scoped to RAG count, plus an Agents card hidden until Agents essays exist; the /essays index groups RAG then Agents then dated rest.

- [ ] **Step 1: Scope the home-page series counts**

In `src/pages/index.astro`, replace the count block (currently lines 11-17):

```ts
// The RAG series is surfaced as a single "course" card, so the date-sorted
// preview shows the standalone essays instead of the course's last few chapters.
const seriesCount = allEssays.filter((e) => e.data.seriesOrder != null).length;
const standalone = allEssays.filter((e) => e.data.seriesOrder == null);
const ESSAY_PREVIEW = 4;
const essays = standalone.slice(0, ESSAY_PREVIEW);
const moreEssays = allEssays.length - essays.length;
```

with:

```ts
// Each numbered series is surfaced as a single "course" card, so the date-sorted
// preview shows the standalone essays instead of a course's last few chapters.
const seriesEssays = allEssays.filter((e) => e.data.seriesOrder != null);
const ragCount = seriesEssays.filter((e) => e.data.series === 'rag').length;
const agentsCount = seriesEssays.filter((e) => e.data.series === 'agents').length;
const standalone = allEssays.filter((e) => e.data.seriesOrder == null);
const ESSAY_PREVIEW = 4;
const essays = standalone.slice(0, ESSAY_PREVIEW);
const moreEssays = allEssays.length - essays.length;
```

- [ ] **Step 2: Use `ragCount` in the RAG card and add a hidden-until-populated Agents card**

In `src/pages/index.astro`, replace the RAG course-card block (currently lines 110-121):

```astro
        {/* RAG series surfaced as one course, with a start-here on-ramp */}
        {seriesCount > 0 && (
          <a
            href="/essays/rag"
            class="group mb-8 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/60 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <span class="text-[13px] text-zinc-600">
              <span class="font-medium text-zinc-900">RAG from First Principles</span> &mdash; a {seriesCount}-part build-it-from-scratch course
            </span>
            <span class="shrink-0 text-[11px] font-mono text-zinc-500 group-hover:text-emerald-600">Start at Part 1 &rarr;</span>
          </a>
        )}
```

with:

```astro
        {/* Numbered series surfaced as course cards, each with a start-here on-ramp */}
        {ragCount > 0 && (
          <a
            href="/essays/rag"
            class="group mb-8 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/60 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <span class="text-[13px] text-zinc-600">
              <span class="font-medium text-zinc-900">RAG from First Principles</span> &mdash; a {ragCount}-part build-it-from-scratch course
            </span>
            <span class="shrink-0 text-[11px] font-mono text-zinc-500 group-hover:text-emerald-600">Start at Part 1 &rarr;</span>
          </a>
        )}

        {agentsCount > 0 && (
          <a
            href="/essays/agents"
            class="group mb-8 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/60 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <span class="text-[13px] text-zinc-600">
              <span class="font-medium text-zinc-900">Agents from First Principles</span> &mdash; a {agentsCount}-part build-it-from-scratch course
            </span>
            <span class="shrink-0 text-[11px] font-mono text-zinc-500 group-hover:text-emerald-600">Start at Part 1 &rarr;</span>
          </a>
        )}
```

- [ ] **Step 3: Group the /essays index by series**

In `src/pages/essays/index.astro`, replace the series/rest block (currently lines 12-16):

```ts
const series = all
  .filter((e) => e.data.seriesOrder != null)
  .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
const rest = all.filter((e) => e.data.seriesOrder == null).sort(byDateDesc);
const essays = [...series, ...rest];
```

with:

```ts
const byOrder = (a: CollectionEntry<'essays'>, b: CollectionEntry<'essays'>) =>
  (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0);
const ragSeries = all.filter((e) => e.data.seriesOrder != null && e.data.series === 'rag').sort(byOrder);
const agentsSeries = all.filter((e) => e.data.seriesOrder != null && e.data.series === 'agents').sort(byOrder);
const rest = all.filter((e) => e.data.seriesOrder == null).sort(byDateDesc);
const essays = [...ragSeries, ...agentsSeries, ...rest];
```

(`CollectionEntry` is already imported on line 3.)

- [ ] **Step 4: Fix the companion-code banner count to use the RAG series length**

In `src/pages/essays/index.astro`, the banner (line 38) currently reads `the {series.length}-part series`. Since `series` was renamed, update it:

```astro
          <span class="font-medium text-zinc-900">RAG from First Principles</span> — runnable code &amp; step-by-step notebooks for the {ragSeries.length}-part series
```

- [ ] **Step 5: Build, then confirm home + index still show 20 for RAG and no Agents leakage**

Run: `npm run build`
Expected: PASS (0 check errors).

Run: `grep -o "a 20-part build-it-from-scratch course" dist/index.html`
Expected: prints `a 20-part build-it-from-scratch course` (home RAG card scoped count).

Run: `grep -c "/essays/agents" dist/index.html`
Expected: `0` (no Agents card yet — `agentsCount` is 0).

Run: `grep -o "the 20-part series" dist/essays/index.html`
Expected: prints `the 20-part series` (index banner count).

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/pages/essays/index.astro
git commit -m "feat(essays): series-scope the home cards and the essays index"
```

---

### Task 6: Integration smoke test of the Agents path (throwaway essay)

This proves the *new* series path actually works end to end (label, count, og fallback) and does not bleed into RAG — without shipping anything. The stub is created, asserted against the build, then deleted.

**Files:**
- Create then delete: `src/content/essays/zz-agents-smoke.mdx`

- [ ] **Step 1: Create a throwaway Agents-series essay**

Create `src/content/essays/zz-agents-smoke.mdx` with exactly:

```mdx
---
title: "Agents Smoke Test"
description: "Throwaway essay to verify the agents series infra. Deleted before commit."
date: 2026-06-27
tags: ["test"]
seriesOrder: 1
series: "agents"
---

Smoke test body.
```

- [ ] **Step 2: Build with the stub present**

Run: `npm run build`
Expected: PASS (0 check errors).

- [ ] **Step 3: Assert the Agents path renders correctly and RAG is untouched**

Run: `grep -o "AGENTS FROM FIRST PRINCIPLES · PART 1 OF 1" dist/essays/zz-agents-smoke/index.html`
Expected: prints `AGENTS FROM FIRST PRINCIPLES · PART 1 OF 1` (new label, scoped count of 1).

Run: `grep -o "agents-by-hand.png" dist/essays/zz-agents-smoke/index.html | head -1`
Expected: prints `agents-by-hand.png` (Agents og fallback fires for series='agents').

Run: `grep -o 'href="/essays/agents"' dist/essays/zz-agents-smoke/index.html | head -1`
Expected: prints `href="/essays/agents"` (badge links to the Agents hub).

Run: `grep -o "PART 1 OF 20" dist/essays/why-rag-exists/index.html`
Expected: still prints `PART 1 OF 20` (RAG count unaffected by the Agents essay — no bleed).

Run: `grep -o "a 1-part build-it-from-scratch course" dist/index.html`
Expected: prints `a 1-part build-it-from-scratch course` (the home Agents card now appears, scoped to 1).

- [ ] **Step 4: Delete the stub and rebuild clean**

```bash
rm src/content/essays/zz-agents-smoke.mdx
npm run build
```

Run: `test ! -d dist/essays/zz-agents-smoke && echo REMOVED`
Expected: prints `REMOVED` (the stub is gone from the build).

Run: `grep -c "/essays/agents" dist/index.html`
Expected: `0` (Agents card hidden again — back to a clean Part-0 state).

- [ ] **Step 5: Confirm the working tree is clean (nothing to commit)**

```bash
git status --porcelain src/content/essays/zz-agents-smoke.mdx
```
Expected: empty output (the stub never persisted; no commit for this task).

---

## Self-Review

**1. Spec coverage (against design spec §6 acceptance checklist):**
- (1) add `series` field → Task 1. ✓
- (2) backfill `series:'rag'` on 20 essays → **intentionally replaced** by a schema default of `'rag'` (Task 1), which makes backfill unnecessary and removes the silent-breakage risk. Documented in Global Constraints. ✓ (deviation, by design)
- (3) scope `seriesTotal`/prev/next → Task 3. ✓
- (4) parameterize the label → Task 2. ✓
- (5) parameterize the og fallback → Task 3. ✓
- (6) `/essays/agents` hub + scope `rag.astro` filter → RAG-filter scoping in Task 4; the Agents hub itself is deferred to Increment 1 (documented in the file map). ✓ (split)
- (7) glossary per-series → `rag-glossary` scoped in Task 4; `agents-glossary` deferred to Increment 1. ✓ (split)
- (8) `/og/agents-by-hand.png` → deferred to Increment 1 (only referenced by Agents essays, none of which ship here). ✓ (split)
- **Extra touchpoints found during planning (not in §6):** home `index.astro` course-card count (Task 5) and the `/essays` index series grouping (Task 5). Both covered.

**2. Placeholder scan:** No "TBD"/"TODO"/"handle edge cases"/"similar to Task N". Every edit shows full before/after code. The only created file (Task 6 stub) shows its full content. ✓

**3. Type consistency:** `series` is `'rag' | 'agents'` everywhere (schema enum, `EssayLayout` Props, `SERIES_META` keys, `[...slug]` grouping, filters in Tasks 4/5). `seriesByKey` is `Map<string, CollectionEntry<'essays'>[]>`. `byOrder` signature matches the existing `byDateDesc` shape. The `series` prop passed in Task 3 exists in the `Props` interface added in Task 2 (Task 2 precedes Task 3). ✓

---

## Downstream notes (for Increment 1, not this plan)
- Create `agents.astro` (clone of `rag.astro`, filter `series === 'agents'`, core ≤11 / frontier ≥12, Agents copy, link to the `agents-by-hand` repo) and `agents-glossary.astro`; add `public/og/agents-by-hand.png`.
- Bilingual badge gap: TR translations currently carry no `seriesOrder`, so a TR page shows no series badge. If the Agents series wants the TR badge to render, that is a separate layout change (decouple badge display from `seriesOrder` counting) — decide in Increment 1.
- `EssayRow`'s generic "Part N" badge is unambiguous in the grouped `/essays` index and does not appear for series essays on the home page (only standalone essays preview there), so it needs no change.
