# Evals Series — Part 0 Infra + Part 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `evals` as the third numbered series on mefby.com (infra + hub/glossary pages), then ship Part 1 ("What Is a Score?") as a bilingual EN+TR essay backed by the new `evals-by-hand` companion repo skeleton and a Part 1 notebook.

**Architecture:** Two increments. Increment 0 is a *purely additive* change to the already-series-aware Astro site — extend the `series` discriminator to a third value and clone the RAG/Agents hub + glossary pages. Increment 1 stands up the `evals-by-hand` repo (self-contained parts, no shared module — matching how `agents-by-hand` is actually built) and ships Part 1's runnable `.py` + `.ipynb` + bilingual essay + figures.

**Tech Stack:** Astro 5 (static, `astro check` via `npm run build`), Tailwind CSS 4, MDX Content Collections with a Zod schema, KaTeX; companion code is pure Python 3 + NumPy (offline, deterministic, zero framework).

## Global Constraints

- **Series key is `evals`** — third value of the `series` enum, after `rag`, `agents`. Default stays `'rag'`.
- **Purely additive infra:** `[...slug].astro` already groups by `e.data.series` (a `seriesByKey` map), so `seriesTotal` + prev/next are already per-series. **Do NOT backfill existing essays; do NOT touch RAG/Agents totals.**
- **TR series label:** `DEĞERLENDİRME: İLK İLKELERDEN`. EN label: `EVALS FROM FIRST PRINCIPLES`. Hub: `/essays/evals`.
- **Companion repo:** `evals-by-hand`, created locally at `/home/ubuntu/Desktop/evals-by-hand`, mirroring `/home/ubuntu/Desktop/agents-by-hand`. Remote: `github.com/mftnakrsu/evals-by-hand` (push is a manual/opt-in step, not in this plan).
- **Repo parts are self-contained:** NO `shared/` directory (agents-by-hand has none). Each part folder holds `<name>.py` + `<name>.ipynb` + `README.md`; each `.py` runs standalone top-to-bottom and ends with a verified `# Expected output` block. Notebooks are output-free and rebuild the `.py` cell by cell.
- **Companion code is offline, deterministic, pure Python + NumPy.** No eval framework, no network, no API key required. SciPy may appear only to *check* a hand-derived value, never to compute it.
- **Essay conventions:** frontmatter `series: "evals"`, `seriesOrder` (1 for this part), `codeUrl` → the matching repo folder; body shape `What you'll learn` → `Prerequisites` → sections with `<Diagram>` → `Key takeaways` → `Glossary` → one-line next-part teaser. **No in-body series line** (layout renders "PART N OF total"). **Em-dash-free prose.** Bilingual EN+TR pair via `lang`/`translationSlug`/`isTranslation`.
- **No test runner exists.** Verification = `npm run build` (green `astro check`) for the site, and `python3 <file>.py` output matching its `# Expected output` block for code.
- **Commits/PRs carry NO Claude co-author / "Generated with Claude Code" trailer** (author preference).
- **Verification before completion:** never mark a step done without running its stated command and seeing the expected result.

Reference implementations to mirror (read before editing): `src/pages/essays/agents.astro`, `src/pages/essays/agents-glossary.astro`, `src/content/essays/augmented-llm-loop.mdx` (+ `-tr`), and `/home/ubuntu/Desktop/agents-by-hand/part-01-augmented-llm-loop/`.

---

# Increment 0 — Part 0 site infra

Ships before any evals essay. After it, `/essays/evals` renders (with an empty list until Part 1), and existing RAG/Agents pages are byte-for-byte unaffected in behavior.

## Task 0.1: Extend the series discriminator (schema, layout, og fallback)

**Files:**
- Modify: `src/content/config.ts:25`
- Modify: `src/layouts/EssayLayout.astro:20` and `:32-35`
- Modify: `src/pages/essays/[...slug].astro:66`

**Interfaces:**
- Produces: the string literal `'evals'` is now a valid `series` value across the schema, the `EssayLayout` prop type, `SERIES_META`, and the og-image fallback. Later tasks (hub, essays) rely on `SERIES_META.evals` and the `/og/evals-by-hand.png` fallback existing.

- [ ] **Step 1: Extend the Zod enum**

In `src/content/config.ts`, change line 25 from:
```ts
    series: z.enum(['rag', 'agents']).default('rag'),
```
to:
```ts
    series: z.enum(['rag', 'agents', 'evals']).default('rag'),
```

- [ ] **Step 2: Widen the layout prop type and add SERIES_META entry**

In `src/layouts/EssayLayout.astro`, change the prop type (line ~20) from:
```ts
  series?: 'rag' | 'agents';
```
to:
```ts
  series?: 'rag' | 'agents' | 'evals';
```
Then in the `SERIES_META` object (lines ~32-35) add the third entry:
```ts
const SERIES_META = {
  rag: { en: 'RAG FROM FIRST PRINCIPLES', tr: 'RAG: İLK İLKELERDEN', hub: '/essays/rag' },
  agents: { en: 'AGENTS FROM FIRST PRINCIPLES', tr: 'AJANLAR: İLK İLKELERDEN', hub: '/essays/agents' },
  evals: { en: 'EVALS FROM FIRST PRINCIPLES', tr: 'DEĞERLENDİRME: İLK İLKELERDEN', hub: '/essays/evals' },
} as const;
```

- [ ] **Step 3: Make the og-image fallback three-way**

In `src/pages/essays/[...slug].astro`, line 66 currently reads:
```ts
  ogImage={essay.data.ogImage ?? (essay.data.seriesOrder != null ? (essay.data.series === 'agents' ? '/og/agents-by-hand.png' : '/og/rag-by-hand.png') : undefined)}
```
Replace the inner series ternary with a lookup so all three series map correctly:
```ts
  ogImage={essay.data.ogImage ?? (essay.data.seriesOrder != null ? ({ rag: '/og/rag-by-hand.png', agents: '/og/agents-by-hand.png', evals: '/og/evals-by-hand.png' }[essay.data.series]) : undefined)}
```

- [ ] **Step 4: Build to verify types**

Run: `npm run build`
Expected: PASS — `astro check` reports 0 errors, build completes. (No evals essays exist yet, so nothing renders under the new series; this only proves the discriminator widening type-checks.)

- [ ] **Step 5: Commit**

```bash
git add src/content/config.ts src/layouts/EssayLayout.astro src/pages/essays/[...slug].astro
git commit -m "feat(evals): add 'evals' as the third series discriminator value"
```

## Task 0.2: Surface the evals series in the two index listings

**Files:**
- Modify: `src/pages/essays/index.astro:14-17`
- Modify: `src/pages/index.astro` (counts ~14-16; course cards ~113-135)

**Interfaces:**
- Consumes: the `'evals'` series value from Task 0.1.
- Produces: the `/essays` archive orders rag→agents→evals→rest; the home page shows a third course card when `evalsCount > 0`.

- [ ] **Step 1: Add evals to the archive ordering**

In `src/pages/essays/index.astro`, after the `agentsSeries` line (line 15) add an `evalsSeries` line, and splice it into the `essays` array (line 17):
```ts
const ragSeries = all.filter((e) => e.data.seriesOrder != null && e.data.series === 'rag').sort(byOrder);
const agentsSeries = all.filter((e) => e.data.seriesOrder != null && e.data.series === 'agents').sort(byOrder);
const evalsSeries = all.filter((e) => e.data.seriesOrder != null && e.data.series === 'evals').sort(byOrder);
const rest = all.filter((e) => e.data.seriesOrder == null).sort(byDateDesc);
const essays = [...ragSeries, ...agentsSeries, ...evalsSeries, ...rest];
```

- [ ] **Step 2: Add the home-page count**

In `src/pages/index.astro`, after the `agentsCount` line (~15) add:
```ts
const evalsCount = seriesEssays.filter((e) => e.data.series === 'evals').length;
```

- [ ] **Step 3: Add the third course card**

In `src/pages/index.astro`, immediately after the closing `)}` of the `{agentsCount > 0 && ( ... )}` block (~line 135), add a clone pointing at `/essays/evals`:
```astro
        {evalsCount > 0 && (
          <a
            href="/essays/evals"
            class="group mb-8 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/60 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <span class="text-[13px] text-zinc-600">
              <span class="font-medium text-zinc-900">Evals from First Principles</span> &mdash; a {evalsCount}-part build-it-from-scratch course
            </span>
            <span class="shrink-0 text-[11px] font-mono text-zinc-500 group-hover:text-emerald-600">Start at Part 1 &rarr;</span>
          </a>
        )}
```

- [ ] **Step 4: Build to verify**

Run: `npm run build`
Expected: PASS. With no evals essays yet, `evalsCount === 0` so the card is hidden and the archive is unchanged — this proves the edits compile and don't disturb existing output.

- [ ] **Step 5: Commit**

```bash
git add src/pages/essays/index.astro src/pages/index.astro
git commit -m "feat(evals): list the evals series on the home page and essays archive"
```

## Task 0.3: Create the `/essays/evals` hub page

**Files:**
- Create: `src/pages/essays/evals.astro` (clone of `src/pages/essays/agents.astro`)

**Interfaces:**
- Consumes: essays with `series === 'evals'` (none yet; page renders with an empty list and no "start" button until Part 1).
- Produces: the hub at `/essays/evals` with a core (≤11) / frontier (≥12) split, linked from `SERIES_META.evals.hub`.

- [ ] **Step 1: Clone and rewrite the hub**

Create `src/pages/essays/evals.astro` by copying `agents.astro` and changing exactly these things:
- Collection filter: `data.series === 'evals'` (both places it appears).
- `itemListJsonLd.name`: `'Evals from First Principles'`; `.description`: `'A from-scratch course on evaluating LLM systems, built by hand.'`
- `<Layout title>`: `"Evals from First Principles — Meftun Akarsu"`.
- `<Layout description>` and the intro `<p>`: replace with evals copy, e.g.:
  > Most eval advice is prose and dashboards. This one builds the measurement stack by hand, one concept at a time, so you can tell a real 2% gain from noise: metrics and the confusion matrix, golden sets, annotator agreement, LLM-as-judge and its biases, confidence intervals, significance and power, pass@k, arenas, calibration, and a CI regression gate. Every part runs on a small labeled set you can trace end to end, with runnable code and an interactive figure.
- Core header: `Core track · Parts 1&ndash;11`. Frontier header: `Frontier track · Parts 12&ndash;{parts.length}`.
- Frontier intro `<p>`: `The production and agent territory you reach for once the offline gate is solid: the eval flywheel, online A/B and guardrail metrics, agent-trajectory evals, and a tiny end-to-end harness.`
- Companion-code link `href`: `https://github.com/mftnakrsu/evals-by-hand`.
- Keep the exact same core/frontier split logic (`(p.data.seriesOrder ?? 0) <= 11` / `>= 12`).

- [ ] **Step 2: Build and verify the hub renders**

Run: `npm run build`
Expected: PASS. Then run `npm run preview` and open `/essays/evals`: the page renders with the intro and an empty (or absent) list; no crash from `first` being undefined (the `{first && (...)}` guard already handles it).

- [ ] **Step 3: Commit**

```bash
git add src/pages/essays/evals.astro
git commit -m "feat(evals): add the /essays/evals series hub page"
```

## Task 0.4: Create the `/essays/evals-glossary` page and the OG card

**Files:**
- Create: `src/pages/essays/evals-glossary.astro` (clone of `agents-glossary.astro`)
- Create: `public/og/evals-by-hand.png`

**Interfaces:**
- Consumes: essays with `series === 'evals'` and an anchor `#glossary` in each (Part 1 supplies the first).
- Produces: `/essays/evals-glossary` reference index; `/og/evals-by-hand.png` satisfies the fallback wired in Task 0.1 Step 3.

- [ ] **Step 1: Clone the glossary index**

Create `src/pages/essays/evals-glossary.astro` by copying `agents-glossary.astro` and changing: the collection filter to `data.series === 'evals'`; the back-link and body links from `/essays/agents` to `/essays/evals`; `<Layout title>` to `"Evals Glossary — Meftun Akarsu"`; the heading to `Evals Glossary`; and the description/intro copy to reference "Evals from First Principles".

- [ ] **Step 2: Produce the OG card**

Create `public/og/evals-by-hand.png` in the same visual family as `public/og/agents-by-hand.png` (same dimensions and layout template, title "Evals from First Principles"). If image generation is unavailable at execution time, copy `agents-by-hand.png` to the new filename as a temporary stand-in and note it as an open follow-up — the fallback must resolve to a real file so social cards don't 404.

Run: `test -f public/og/evals-by-hand.png && echo OK`
Expected: `OK`.

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS. Open `/essays/evals-glossary` in preview: renders with an empty list until Part 1.

- [ ] **Step 4: Commit**

```bash
git add src/pages/essays/evals-glossary.astro public/og/evals-by-hand.png
git commit -m "feat(evals): add the evals glossary index page and OG card"
```

---

# Increment 1 — `evals-by-hand` skeleton + Part 1

## Task 1.1: Stand up the `evals-by-hand` repo skeleton

**Files (new repo at `/home/ubuntu/Desktop/evals-by-hand/`):**
- Create: `README.md`, `requirements.txt`, `LICENSE`, `.gitignore`

**Interfaces:**
- Produces: the repo root that Part 1's folder (Task 1.2) lives in; the README part-table that each future part appends a row to.

- [ ] **Step 1: Initialize the repo**

```bash
mkdir -p /home/ubuntu/Desktop/evals-by-hand
cd /home/ubuntu/Desktop/evals-by-hand && git init
```

- [ ] **Step 2: Write `requirements.txt`**

Mirror `agents-by-hand`'s tone (loose bounds, offline-first). Content:
```
# evals-by-hand — dependencies. Loose, protective bounds only.
#
# EVERY part runs offline with NO API key and NO framework: pure Python + NumPy
# is the reproducible default. The LLM-as-judge parts default to a deterministic
# mock judge; a real provider is one env flag away via a swappable generate().

numpy>=1.24               # the only hard dependency; all metrics/tests are hand-derived on top of it

# Optional — only to CHECK a hand-derived value against a library (never to compute it):
scipy>=1.10               # e.g. verify a McNemar / bootstrap result

# Optional "real judge" path — pick ONE provider (all optional):
openai>=1.0,<2            # hosted; the default real generate()
anthropic                 # hosted; the Claude variant
requests>=2.28            # only for a local Ollama generation path
```

- [ ] **Step 3: Write `.gitignore` and `LICENSE`**

Copy `.gitignore` and `LICENSE` from `/home/ubuntu/Desktop/agents-by-hand/` (same MIT license + Python/Jupyter ignores):
```bash
cp /home/ubuntu/Desktop/agents-by-hand/.gitignore /home/ubuntu/Desktop/evals-by-hand/.gitignore
cp /home/ubuntu/Desktop/agents-by-hand/LICENSE /home/ubuntu/Desktop/evals-by-hand/LICENSE
```

- [ ] **Step 4: Write `README.md`**

Mirror the `agents-by-hand` README structure (intro, "build it by hand" ethos, sequel framing pointing back to rag-by-hand + agents-by-hand, a one-row-per-part table). Include only the Part 1 row for now (later parts append rows). The table header:
```markdown
| Part | Topic | Code | Notebook | Essay |
|---|---|---|---|---|
| 1 | What Is a Score? metrics and the confusion matrix by hand | [scoring_basics.py](part-01-what-is-a-score/scoring_basics.py) | [notebook](part-01-what-is-a-score/scoring_basics.ipynb) | [read](https://www.mefby.com/essays/what-is-a-score) |
```
Intro must state: companion code for the **Evals from First Principles** series on mefby.com; the third by-hand series after rag-by-hand and agents-by-hand; every part offline, pure Python + NumPy, self-contained single-file read, `.py` + step-by-step `.ipynb`.

- [ ] **Step 5: Commit the skeleton**

```bash
cd /home/ubuntu/Desktop/evals-by-hand
git add README.md requirements.txt LICENSE .gitignore
git commit -m "chore: evals-by-hand repo skeleton"
```

## Task 1.2: Part 1 companion code — `scoring_basics.py`

**Files:**
- Create: `/home/ubuntu/Desktop/evals-by-hand/part-01-what-is-a-score/scoring_basics.py`

**Interfaces:**
- Produces: functions `confusion(gold, pred) -> (tp, fp, fn, tn)`, `accuracy`, `precision`, `recall`, `f1` — all pure Python on lists of 0/1 ints — plus a `__main__` trace that prints the balanced-set metrics and the class-imbalance demonstration. The exact printed numbers are the source of truth the essay and notebook must cite.

- [ ] **Step 1: Write the file**

Complete, runnable content (self-contained, no imports beyond stdlib; NumPy is intentionally not needed for Part 1's arithmetic and is introduced later):
```python
"""
Evals from First Principles — Part 1: What Is a Score?

The atoms of every eval: a task, a gold label, and a metric. We build the
2x2 confusion matrix by hand from 10 graded outputs, derive accuracy /
precision / recall / F1 from its four counts, then show on an imbalanced
set why accuracy alone lies. Pure Python, offline, deterministic.
"""

# --- The task -------------------------------------------------------------
# A support-ticket classifier decides "urgent" (1) vs "not urgent" (0).
# We have 10 tickets, each with a human GOLD label and the MODEL's PRED.
# gold[i] and pred[i] describe the same ticket.
GOLD = [1, 1, 1, 0, 0, 1, 0, 0, 1, 0]
PRED = [1, 1, 0, 0, 1, 1, 0, 0, 0, 0]


def confusion(gold, pred):
    """Return (tp, fp, fn, tn) — the four cells of the 2x2, counted by hand."""
    tp = fp = fn = tn = 0
    for g, p in zip(gold, pred):
        if g == 1 and p == 1:
            tp += 1
        elif g == 0 and p == 1:
            fp += 1
        elif g == 1 and p == 0:
            fn += 1
        else:  # g == 0 and p == 0
            tn += 1
    return tp, fp, fn, tn


def accuracy(tp, fp, fn, tn):
    """Fraction of ALL predictions that were correct."""
    total = tp + fp + fn + tn
    return (tp + tn) / total if total else 0.0


def precision(tp, fp):
    """Of the ones we CALLED urgent, how many really were? Guard 0/0 -> 0.0."""
    return tp / (tp + fp) if (tp + fp) else 0.0


def recall(tp, fn):
    """Of the ones that WERE urgent, how many did we catch? Guard 0/0 -> 0.0."""
    return tp / (tp + fn) if (tp + fn) else 0.0


def f1(prec, rec):
    """Harmonic mean of precision and recall. Guard 0+0 -> 0.0."""
    return 2 * prec * rec / (prec + rec) if (prec + rec) else 0.0


def report(gold, pred, label):
    tp, fp, fn, tn = confusion(gold, pred)
    acc = accuracy(tp, fp, fn, tn)
    prec = precision(tp, fp)
    rec = recall(tp, fn)
    f = f1(prec, rec)
    print(f"{label}")
    print(f"  n = {len(gold)}  (positives in gold: {tp + fn}, negatives: {fp + tn})")
    print(f"  confusion:  TP={tp}  FP={fp}  FN={fn}  TN={tn}")
    print(f"  accuracy  = (TP+TN)/n         = ({tp}+{tn})/{tp+fp+fn+tn} = {acc:.2f}")
    print(f"  precision = TP/(TP+FP)        = {tp}/({tp}+{fp}) = {prec:.2f}")
    print(f"  recall    = TP/(TP+FN)        = {tp}/({tp}+{fn}) = {rec:.2f}")
    print(f"  F1        = 2PR/(P+R)         = {f:.2f}")
    return acc, prec, rec, f


if __name__ == "__main__":
    line = "=" * 72
    print(line)
    print("PART 1 - WHAT IS A SCORE? metrics from the 2x2 confusion matrix.")
    print(line)

    report(GOLD, PRED, "A balanced set (5 urgent, 5 not):")

    print("\n" + "-" * 72)
    print("WHY ACCURACY LIES: an imbalanced set (2 urgent out of 20).")
    print("A lazy model that ALWAYS predicts 'not urgent' looks great on accuracy")
    print("but catches zero urgent tickets.")
    print("-" * 72)
    imb_gold = [1, 1] + [0] * 18            # 2 urgent, 18 not
    imb_pred = [0] * 20                      # always "not urgent"
    report(imb_gold, imb_pred, "Always-negative baseline:")
    print("\n  -> 90% accurate, 0% recall. Accuracy hid a model that is useless")
    print("     at the only job that matters. This is why we need the whole 2x2.")
    print(line)

# Expected output:
# ========================================================================
# PART 1 - WHAT IS A SCORE? metrics from the 2x2 confusion matrix.
# ========================================================================
# A balanced set (5 urgent, 5 not):
#   n = 10  (positives in gold: 5, negatives: 5)
#   confusion:  TP=3  FP=1  FN=2  TN=4
#   accuracy  = (TP+TN)/n         = (3+4)/10 = 0.70
#   precision = TP/(TP+FP)        = 3/(3+1) = 0.75
#   recall    = TP/(TP+FN)        = 3/(3+2) = 0.60
#   F1        = 2PR/(P+R)         = 0.67
#
# ------------------------------------------------------------------------
# WHY ACCURACY LIES: an imbalanced set (2 urgent out of 20).
# A lazy model that ALWAYS predicts 'not urgent' looks great on accuracy
# but catches zero urgent tickets.
# ------------------------------------------------------------------------
# Always-negative baseline:
#   n = 20  (positives in gold: 2, negatives: 18)
#   confusion:  TP=0  FP=0  FN=2  TN=18
#   accuracy  = (TP+TN)/n         = (0+18)/20 = 0.90
#   precision = TP/(TP+FP)        = 0/(0+0) = 0.00
#   recall    = TP/(TP+FN)        = 0/(0+2) = 0.00
#   F1        = 2PR/(P+R)         = 0.00
#
#   -> 90% accurate, 0% recall. Accuracy hid a model that is useless
#      at the only job that matters. This is why we need the whole 2x2.
# ========================================================================
```

- [ ] **Step 2: Run and verify the output matches the expected block**

Run: `cd /home/ubuntu/Desktop/evals-by-hand && python3 part-01-what-is-a-score/scoring_basics.py`
Expected: stdout matches the `# Expected output:` block verbatim (TP=3/FP=1/FN=2/TN=4; accuracy 0.70, precision 0.75, recall 0.60, F1 0.67; then accuracy 0.90 / recall 0.00 on the imbalanced set). If any number differs, fix the code (not the expected block) until they agree.

- [ ] **Step 3: Commit**

```bash
cd /home/ubuntu/Desktop/evals-by-hand
git add part-01-what-is-a-score/scoring_basics.py
git commit -m "feat(part-01): scoring_basics.py — confusion matrix + metrics by hand"
```

## Task 1.3: Part 1 notebook + folder README

**Files:**
- Create: `/home/ubuntu/Desktop/evals-by-hand/part-01-what-is-a-score/scoring_basics.ipynb`
- Create: `/home/ubuntu/Desktop/evals-by-hand/part-01-what-is-a-score/README.md`

**Interfaces:**
- Consumes: the functions and numbers from Task 1.2.
- Produces: an output-free notebook that rebuilds `scoring_basics.py` cell by cell, and a folder README.

- [ ] **Step 1: Author the notebook**

Create `scoring_basics.ipynb` as a valid nbformat-4 JSON notebook, **output-free** (`"outputs": []`, `"execution_count": null` on every code cell). Cell sequence, each code cell preceded by a short markdown cell explaining the *why*:
1. md: title + "what you'll build"; 2. code: `GOLD`/`PRED` + the task framing; 3. md: what the 2x2 is; 4. code: `confusion()` + call it, comment the four counts; 5. md: the four metrics in words; 6. code: `accuracy`/`precision`/`recall`/`f1` + compute on the balanced set; 7. md: why accuracy lies under imbalance; 8. code: the always-negative baseline on 2/20 + the metrics; 9. md: recap tying to the essay's Key takeaways.

Mirror the structure/style of `/home/ubuntu/Desktop/agents-by-hand/part-01-augmented-llm-loop/augmented_llm_loop.ipynb`.

- [ ] **Step 2: Verify the notebook is valid and output-free**

Run:
```bash
cd /home/ubuntu/Desktop/evals-by-hand
python3 -c "import json,sys; nb=json.load(open('part-01-what-is-a-score/scoring_basics.ipynb')); assert nb['nbformat']==4; assert all((c.get('outputs')==[] and c.get('execution_count') is None) for c in nb['cells'] if c['cell_type']=='code'), 'has outputs'; print('OK', len(nb['cells']), 'cells')"
```
Expected: `OK <n> cells` with no assertion error.

- [ ] **Step 3: Write the folder README**

Create `part-01-what-is-a-score/README.md`: one paragraph on what the part teaches, how to run (`python3 scoring_basics.py`), and a link to the essay (`https://www.mefby.com/essays/what-is-a-score`). Mirror `agents-by-hand/part-01-.../README.md`.

- [ ] **Step 4: Commit**

```bash
cd /home/ubuntu/Desktop/evals-by-hand
git add part-01-what-is-a-score/scoring_basics.ipynb part-01-what-is-a-score/README.md
git commit -m "feat(part-01): step-by-step notebook + folder README"
```

## Task 1.4: Part 1 figures (static SVG + interactive HTML)

**Files (in mefby-main):**
- Create: `public/essays/what-is-a-score/part1-confusion-matrix.svg`
- Create: `public/essays/what-is-a-score/part1-metrics-explorer.html`

**Interfaces:**
- Produces: two figure assets the essay embeds via `<Diagram>` (SVG) and `<IframeFigure>` (HTML). The HTML figure is self-contained same-origin (auto-fit by `IframeFigure.astro`).

- [ ] **Step 1: Static confusion-matrix SVG**

Create `part1-confusion-matrix.svg`: a labeled 2×2 grid (rows = gold urgent/not, columns = predicted urgent/not) with the balanced set's counts placed in each cell (TP=3, FP=1, FN=2, TN=4), and the four metric formulas (accuracy/precision/recall/F1) with their worked values (0.70/0.75/0.60/0.67) beside it. Use the site palette (emerald accent, zinc text). Include a descriptive `<title>`/`<desc>` for accessibility since the essay's `<img alt>` will also describe it.

- [ ] **Step 2: Interactive metrics explorer**

Create `part1-metrics-explorer.html` as a single self-contained file (inline CSS + vanilla JS, no external requests). It renders the 10-ticket balanced set as toggleable predictions (click a ticket to flip its prediction) and live-updates TP/FP/FN/TN + accuracy/precision/recall/F1, plus a class-balance slider that reproduces the "accuracy stays high while recall collapses" story. Palette matches the site (light background, emerald accent). No scrollbars (the layout auto-fits).

- [ ] **Step 3: Verify assets load in the build**

Run: `cd /home/ubuntu/Desktop/mefby-main && npm run build`
Expected: PASS (static assets under `public/` are copied as-is). Open `part1-metrics-explorer.html` directly in a browser and confirm it runs offline and updates on interaction.

- [ ] **Step 4: Commit**

```bash
cd /home/ubuntu/Desktop/mefby-main
git add public/essays/what-is-a-score/
git commit -m "feat(evals): Part 1 figures — confusion-matrix SVG + metrics explorer"
```

## Task 1.5: Part 1 essay (English) — `what-is-a-score.mdx`

**Files:**
- Create: `src/content/essays/what-is-a-score.mdx`

**Interfaces:**
- Consumes: `SERIES_META.evals` (Task 0.1), the figures (Task 1.4), `codeUrl` → the repo folder (Task 1.2).
- Produces: the first `series: 'evals'` essay, so `/essays/evals`, the archive, the home card, and the glossary index all populate. Its `translationSlug` points at the TR copy (Task 1.6).

- [ ] **Step 1: Write the frontmatter**

```mdx
---
title: "What Is a Score?"
description: "Before any statistic, evals need three atoms: a task, a gold label, and a metric. Part 1 builds the 2x2 confusion matrix by hand from ten graded outputs, derives accuracy, precision, recall, and F1 from its four counts, and shows on an imbalanced set why accuracy alone lies."
date: 2026-07-04
tags: ["Evals", "LLM", "Metrics", "Precision", "Recall", "F1", "AI"]
seriesOrder: 1
series: "evals"
codeUrl: "https://github.com/mftnakrsu/evals-by-hand/tree/main/part-01-what-is-a-score"
lang: "en"
translationSlug: "what-is-a-score-tr"
---

import Diagram from '../../components/essay/Diagram.astro';
import IframeFigure from '../../components/essay/IframeFigure.astro';
```
(The `date` is a default — reconcile with the actual last Agents part date at execution so this essay leads the index; see spec §10 open item 3.)

- [ ] **Step 2: Write the body**

Follow the section shape and register of `augmented-llm-loop.mdx`. Required sections, in order, with these load-bearing contents:
- `## What you'll learn` — name the three atoms (task, gold label, metric); state that this opens the Evals from First Principles series, the sequel to RAG and Agents; promise the confusion matrix + four metrics + the accuracy-lies lesson, all traced on ten outputs.
- `## Prerequisites` — basic Python; no stats background; the companion file [scoring_basics.py] runs offline with no dependencies.
- `## The three atoms` — task, gold label, metric, on the urgent-ticket example.
- `## The confusion matrix` — introduce TP/FP/FN/TN; embed **Fig 1** (`<Diagram number={1}>` wrapping `part1-confusion-matrix.svg` with a full descriptive `alt`); cite the exact balanced-set counts (TP=3, FP=1, FN=2, TN=4).
- `## Four numbers from four counts` — derive accuracy=0.70, precision=0.75, recall=0.60, F1=0.67, each with its formula, matching `scoring_basics.py` verbatim.
- `## Why accuracy lies` — the 2-of-20 imbalanced set; the always-negative baseline scoring accuracy 0.90 but recall 0.00; embed the interactive **Fig 2** via `<IframeFigure src="/essays/what-is-a-score/part1-metrics-explorer.html" title="Interactive metrics explorer" />`.
- `## Key takeaways` — 4-6 bullets (atoms; the 2x2 is the source of all four metrics; precision vs recall trade; accuracy lies under imbalance; a score is a point estimate — foreshadow Part 6's confidence interval).
- `## Glossary` — define: gold label, confusion matrix, true/false positive/negative, accuracy, precision, recall, F1, class imbalance. Ends with the `---` + one-line teaser for **Part 2, Building a Golden Set**.

Constraints: em-dash-free; no in-body "Part 1 of N" line; prose numbers must equal the `.py` output exactly.

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS. In preview, `/essays/what-is-a-score` renders under the `EVALS FROM FIRST PRINCIPLES · PART 1 OF 1` banner (links to `/essays/evals`), both figures show, the Code pill links to the repo folder, `/essays/evals` now lists Part 1 with a working "Start with Part 1" button, and the home page shows the evals course card.

- [ ] **Step 4: Commit**

```bash
git add src/content/essays/what-is-a-score.mdx
git commit -m "feat(evals): Part 1 essay (EN) — What Is a Score?"
```

## Task 1.6: Part 1 essay (Turkish) — `what-is-a-score-tr.mdx`

**Files:**
- Create: `src/content/essays/what-is-a-score-tr.mdx`

**Interfaces:**
- Consumes: everything Task 1.5 produced.
- Produces: the TR counterpart; the pair cross-links via the language toggle and is counted once in listings (TR hidden by `isTranslation: true`).

- [ ] **Step 1: Write the frontmatter**

```mdx
---
title: "Bir Skor Nedir?"
description: "Her istatistikten önce, değerlendirmenin üç atomu vardır: bir görev, bir altın etiket ve bir metrik. Bölüm 1, on notlanmış çıktıdan elle 2x2 hata matrisini kurar; dört sayısından doğruluk, kesinlik, duyarlılık ve F1'i türetir; dengesiz bir kümede doğruluğun tek başına neden yanılttığını gösterir."
date: 2026-07-04
tags: ["Değerlendirme", "LLM", "Metrikler", "Kesinlik", "Duyarlılık", "F1", "Türkçe"]
seriesOrder: 1
series: "evals"
codeUrl: "https://github.com/mftnakrsu/evals-by-hand/tree/main/part-01-what-is-a-score"
lang: "tr"
translationSlug: "what-is-a-score"
isTranslation: true
---

import Diagram from '../../components/essay/Diagram.astro';
import IframeFigure from '../../components/essay/IframeFigure.astro';
```

- [ ] **Step 2: Translate the body**

A faithful Turkish translation of the EN body (Task 1.5 Step 2), same sections, same figures (same `src`; translate captions and `alt`), same numbers. Match the register of `augmented-llm-loop-tr.mdx`. Section headers in Turkish (e.g. `## Ne öğreneceksin`, `## Ön koşullar`, `## Üç atom`, `## Hata matrisi`, `## Dört sayıdan dört metrik`, `## Doğruluk neden yanıltır`, `## Önemli çıkarımlar`, `## Sözlük`), ending with the `---` + Bölüm 2 teaser.

- [ ] **Step 3: Build and verify the pair**

Run: `npm run build`
Expected: PASS. In preview: `/essays/what-is-a-score-tr` renders under the `DEĞERLENDİRME: İLK İLKELERDEN · BÖLÜM 1 / 1` banner; the EN↔TR toggle switches between the two; the archive/home count Part 1 exactly once (TR hidden); the bilingual count on `/essays` increments.

- [ ] **Step 4: Commit**

```bash
git add src/content/essays/what-is-a-score-tr.mdx
git commit -m "feat(evals): Part 1 essay (TR) — Bir Skor Nedir?"
```

---

## Self-review (completed against the spec)

**Spec coverage:** Part 0 infra checklist §6 items 1-8 → Tasks 0.1-0.4 (config enum, layout prop+META, og fallback, index listings, hub, glossary, og asset). Repo skeleton §7 → Task 1.1 (corrected: **no `shared/`**, matching the real agents-by-hand layout). Part 1 curriculum §4 (confusion matrix, accuracy/precision/recall/F1, accuracy-lies-under-imbalance) → Tasks 1.2-1.6. Pedagogy §3 (offline, pure Python, traced numbers, expected-output block, output-free notebook, one interactive widget) → Tasks 1.2-1.4. Essay conventions §8 (frontmatter, section shape, em-dash-free, bilingual, glossary) → Tasks 1.5-1.6.

**Deviations from spec, flagged:** the spec §3/§7 described a `shared/dataset.py` + `shared/judge.py`; the live `agents-by-hand` repo has **no shared module** (each part is self-contained), so this plan drops `shared/` and keeps Part 1 self-contained. This is faithful to the established repo pattern; the spec's shared/ was aspirational. Judge/dataset reuse is revisited when Part 4 (LLM-as-judge) actually needs it.

**Placeholder scan:** the only non-verbatim deliverables are prose (essay bodies) and visual assets (SVG/HTML/PNG), which are specified by exact structure + required numbers + acceptance criteria rather than finished bytes — appropriate for prose/design tasks. All code (`scoring_basics.py`) and all site edits are given verbatim with exact numbers and expected output.

**Type/name consistency:** `series: 'evals'`, hub `/essays/evals`, glossary `/essays/evals-glossary`, repo `evals-by-hand`, essay slug `what-is-a-score` (+ `-tr`), folder `part-01-what-is-a-score`, file `scoring_basics.py`, functions `confusion/accuracy/precision/recall/f1/report`, og `/og/evals-by-hand.png` — consistent across every task and matching the spec.

**Verification model:** every task ends in `npm run build` (site) or `python3 scoring_basics.py` output-match (code) plus a commit, since the repo has no unit-test runner.
