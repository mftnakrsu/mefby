# RAG Frontier Track (Parts 13–15 + Part 11 additions) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Companion spec (read first):** `docs/superpowers/specs/2026-06-15-rag-frontier-track-design.md`. This plan does not repeat the design rationale, conventions tables, or citation lists — it references the spec by section (§N). Both docs are untracked on disk (project convention).

**Goal:** Ship three new "Frontier Track" parts (13 Late-Interaction Retrieval, 14 Context-Aware Chunking, 15 Adaptive RAG) of the *RAG from First Principles* series — each as a mefby.com essay plus a runnable offline companion in `rag-by-hand` — and fold two new sections (long-context-vs-RAG, RAGCap-Bench) into the shipped Part 11.

**Architecture:** Each part = (1) a framework-free offline Python artifact in `rag-by-hand/part-NN-*/`, (2) a step-by-step output-free notebook verified on both the real-model and forced-offline paths, (3) a per-part README, (4) two static SVGs + one self-contained interactive HTML, (5) an MDX essay wired with `codeUrl`/`ogImage`/`seriesOrder`. Parts 13–15 are content-independent of each other (each builds only on existing parts 5–10), so they can be built in parallel; the connective tissue (Frontier-Track intros, next-part teasers, cross-links) is reconciled in a synthesis pass. Part 11 additions and the Part 12 pointer are a separate, smaller track.

**Tech Stack:** Astro 5 + MDX content collections + Tailwind 4 (site); numpy-only framework-free Python + `nbformat`/`nbclient`/`ipykernel` (repo); self-contained vanilla-JS/CSS HTML widgets + static SVG (figures). Offline-first with deterministic fallbacks (pattern: `part-02-embeddings/embeddings.py`).

---

## Conventions quick-reference (hard rules — full detail in spec §5, §6, §11, §12)

- **Offline is mandatory.** Every model/LLM/web call wrapped in `try/except` → deterministic numpy/stdlib fallback. numpy is the only hard dep.
- **Notebooks committed OUTPUT-FREE**, executed top-to-bottom on BOTH paths (real-model + forced-offline via `HF_HOME=<empty>` + `HF_HUB_OFFLINE=1` + `TRANSFORMERS_OFFLINE=1`); fail on any `output_type=='error'`.
- **Essays:** em-dash-free; no `# h1`; italic series line first; `## What you'll learn` → `## Prerequisites` → body → `> 💡 **From experience**` (real anecdote + invisible `{/* author: swap ... */}` marker, NEVER a raw `[INSERT...]`) → `## Key takeaways` → `## Glossary` → next-part teaser. Design tokens verbatim (spec §5). Keep `{` and bare `<` out of prose.
- **Git discipline:** rag-by-hand → commit directly to `main`, **confirm before push**. mefby → feature branch → PR → user merges; **`git add` only this change's own files, never `-A`**; never touch `easa-ai-blog.md`; keep `docs/superpowers/*` out of PRs. **No Claude co-author trailer / no "Generated with Claude Code"** anywhere.
- **Install** (this machine): `pip install --break-system-packages --index-url https://repo.tai.com.tr/repository/Pypi/simple <pkgs>`.
- **Build gate:** `cd /home/ubuntu/Desktop/mefby-main && npm run build` (astro check + build) must pass before any PR.

---

## File Structure

**rag-by-hand (`/home/ubuntu/Desktop/rag-by-hand`) — create:**
- `part-13-late-interaction/late_interaction.py` — MaxSim + multi-vector retrieval, toy patch-vector ColPali stand-in.
- `part-13-late-interaction/late_interaction.ipynb` — step-by-step notebook.
- `part-13-late-interaction/README.md`.
- `part-14-context-aware-chunking/context_aware_chunking.py` — late-chunk span pooling + contextualize-then-embed.
- `part-14-context-aware-chunking/context_aware_chunking.ipynb`.
- `part-14-context-aware-chunking/README.md`.
- `part-15-adaptive-rag/adaptive_rag.py` — complexity classifier + router over no/single/multi-step.
- `part-15-adaptive-rag/adaptive_rag.ipynb`.
- `part-15-adaptive-rag/README.md`.
- `part-11-evaluating-rag/long_context_vs_rag.py` — synthetic-corpus needle head-to-head.
- `part-11-evaluating-rag/long_context_vs_rag.ipynb`.

**rag-by-hand — modify:**
- `README.md` — add 3 curriculum rows (Code/Notebook/Essay + Colab badge in notebook cell 0) + a note on the Part 11 experiment.
- `requirements.txt` — only if a new dep is introduced (expected: none).

**mefby (`/home/ubuntu/Desktop/mefby-main`) — create:**
- `src/content/essays/late-interaction-retrieval.mdx`
- `src/content/essays/context-aware-chunking.mdx`
- `src/content/essays/adaptive-rag.mdx`
- `public/essays/late-interaction-retrieval/part13-pooled-vs-multivector.svg`
- `public/essays/late-interaction-retrieval/part13-maxsim.svg`
- `public/essays/late-interaction-retrieval/part13-maxsim-playground.html`
- `public/essays/context-aware-chunking/part14-late-chunking.svg`
- `public/essays/context-aware-chunking/part14-contextual-retrieval.svg`
- `public/essays/context-aware-chunking/part14-context-aware-chunking.html`
- `public/essays/adaptive-rag/part15-routing-map.svg`
- `public/essays/adaptive-rag/part15-cost-vs-complexity.svg`
- `public/essays/adaptive-rag/part15-complexity-router.html`
- `public/essays/evaluating-rag/part11-longcontext-vs-rag.svg`

**mefby — modify:**
- `src/content/essays/evaluating-rag.mdx` — add sections D + E + the new figure import (date/seriesOrder unchanged).
- `src/content/essays/rag-in-production.mdx` — add one `Postscript (2026)` block after the send-off.

**Verifier (temp, not committed):** `/tmp/nbverify.py` — nbclient executor for both paths.

---

## Phase 0 — Groundwork

### Task 0.1: Confirm toolchain + offline-fallback reference

**Files:** none (inspection only).

- [ ] **Step 1: Confirm Python deps importable**

Run: `python3 -c "import numpy, nbformat, nbclient, ipykernel; print(numpy.__version__)"`
Expected: prints a numpy version (e.g. `2.4.4`), exit 0. If a module is missing, install via the TAI mirror command in the conventions block.

- [ ] **Step 2: Re-read the canonical fallback pattern**

Read `/home/ubuntu/Desktop/rag-by-hand/part-02-embeddings/embeddings.py` and one later offline artifact (`part-12-rag-in-production/rag_production.py`). Confirm the `try/except` model-load → deterministic numpy/lexical fallback shape and the `Expected output` docstring/footer convention. Every new `.py` copies this shape.

- [ ] **Step 3: Confirm site builds clean on a fresh branch base**

Run: `cd /home/ubuntu/Desktop/mefby-main && git checkout main && git pull --ff-only && npm run build`
Expected: build succeeds (astro check + build, exit 0). This is the green baseline before any edits.

### Task 0.2: Re-verify every citation and number (accuracy gate)

**Files:** append findings to the spec's §14 (optional) or keep in working notes.

- [ ] **Step 1: Verify arXiv IDs + venues via web**

Use WebSearch/WebFetch (the harness reaches the internet) to confirm each: ColBERT 2004.12832 (SIGIR 2020); ColBERTv2 2112.01488 (NAACL 2022); ColPali 2407.01449 (ICLR 2025); Jina late chunking 2409.04701; Anthropic Contextual Retrieval (the **35%** top-20 failure reduction, 5.7%→3.7%); Adaptive-RAG 2403.14403 (NAACL 2024); U-NIAH 2503.00353; Self-Route 2407.16833 (EMNLP 2024); LaRA (ICML 2025); RAGCap-Bench 2510.13910.
Expected: each ID resolves to the claimed paper/venue. Record any correction.

- [ ] **Step 2: Re-confirm the contested numbers**

Confirm the ColBERTv2 MS MARCO storage figure (~154GB → ~16–25GB) and that the Contextual Retrieval **67%/47% additive** numbers are NOT to be cited (only 35%). Confirm Adaptive-RAG's latency/cost percentages are vendor/indicative (frame as such, do not state as measured fact).
Expected: a short verified-numbers note; any number that fails verification is dropped or softened in the essays.

- [ ] **Step 3: No commit** (notes only; planning docs stay untracked).

### Task 0.3: Create the notebook verifier

**Files:** Create `/tmp/nbverify.py` (temp, not committed).

- [ ] **Step 1: Write the verifier**

```python
# /tmp/nbverify.py  — execute a notebook on a given path, fail on any error cell.
import sys, os, tempfile, nbformat
from nbclient import NotebookClient

def run(path, offline):
    env = dict(os.environ)
    if offline:
        d = tempfile.mkdtemp()
        env.update(HF_HOME=d, HF_HUB_OFFLINE="1", TRANSFORMERS_OFFLINE="1")
    nb = nbformat.read(path, as_version=4)
    client = NotebookClient(nb, timeout=600, kernel_name="python3", resources={"metadata": {"path": os.path.dirname(path) or "."}})
    # NotebookClient inherits os.environ of the kernel; set it for the spawned kernel:
    os.environ.update(env)
    client.execute()
    errs = [c for c in nb.cells if c.cell_type == "code"
            for o in c.get("outputs", []) if o.get("output_type") == "error"]
    if errs:
        print(f"FAIL ({'offline' if offline else 'real'}): {len(errs)} error cell(s) in {path}")
        sys.exit(1)
    print(f"PASS ({'offline' if offline else 'real'}): {path}")

if __name__ == "__main__":
    # usage: python3 /tmp/nbverify.py <notebook> <real|offline>
    run(sys.argv[1], sys.argv[2] == "offline")
```

- [ ] **Step 2: Smoke-test the verifier on an existing notebook (both paths)**

Run: `python3 /tmp/nbverify.py /home/ubuntu/Desktop/rag-by-hand/part-12-rag-in-production/rag_production.ipynb offline`
Expected: `PASS (offline): ...`. Then run with `real`. Expected: `PASS (real): ...`. (If the existing notebook fails, the verifier env handling is wrong — fix before proceeding.)

---

## Phase 1 — Part 13: Late-Interaction Retrieval

> Spec §7. Slug `late-interaction-retrieval`; folder `part-13-late-interaction`; date 2026-06-19; seriesOrder 13.

### Task 1.1: Repo artifact `late_interaction.py`

**Files:** Create `/home/ubuntu/Desktop/rag-by-hand/part-13-late-interaction/late_interaction.py`.

- [ ] **Step 1: Write the artifact (offline, deterministic)**

Required structure (copy the §6 fallback shape from `embeddings.py`):
  - Header docstring: title, one-paragraph what/why, "runs fully offline; numpy only", and an `Expected output` block (filled in Step 3 after first run).
  - `try: from sentence_transformers import SentenceTransformer` else fallback. A `token_embed(text) -> np.ndarray (n_tokens, d)` that returns per-token vectors: real path uses the model's token embeddings if available, else a deterministic hashing embedder (hash each whitespace token → seeded RNG vector, L2-normalized). State in a printed banner which path is active.
  - The correctness-critical function (show verbatim):

```python
import numpy as np

def maxsim(query_vecs: np.ndarray, doc_vecs: np.ndarray) -> float:
    """Late-interaction score: for each query token take the max cosine
    similarity over all doc tokens, then sum. Inputs are L2-normalized
    (n_q, d) and (n_d, d), so the dot product IS cosine similarity."""
    sims = query_vecs @ doc_vecs.T          # (n_q, n_d) pairwise cosine
    return float(sims.max(axis=1).sum())    # max over doc tokens, sum over query tokens
```

  - A small corpus (reuse the support KB: refund-policy line, the `E-4042` error-code line, 2–3 distractors). Rank docs by `maxsim` vs by pooled-cosine (`mean(query_vecs) · mean(doc_vecs)`) on a term-match query (e.g. "E-4042 fix") and print both rankings to show late interaction surfacing the exact-term doc the pooled vector buries.
  - `storage_report(n_docs, avg_tokens, dim, bytes_per_dim_pooled=4, bits_per_dim_multi=...)` printing pooled vs multi-vector footprint and the compressed multi-vector footprint; mirror the MS MARCO ~154GB→~16–25GB scale in a comment, computed from the toy numbers.
  - A `colpali_patch_demo()`: build a toy "page" as a grid of hashed patch vectors (e.g. 16 patches), run `maxsim` of a text query's token vectors against the patch vectors, print the score — labeled clearly as a MECHANISM stand-in (no real VLM).
  - `if __name__ == "__main__":` runs all of the above with clear section banners.

- [ ] **Step 2: Run offline (forced fallback) and capture output**

Run: `cd /home/ubuntu/Desktop/rag-by-hand && HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 HF_HOME=$(mktemp -d) python3 part-13-late-interaction/late_interaction.py`
Expected: exit 0; banner shows the fallback path; MaxSim ranking puts the exact-term doc above the pooled-cosine ranking; storage + ColPali demo print. Copy the real output into the header `Expected output` block.

- [ ] **Step 3: Run the real path (model cached locally) to confirm both paths work**

Run: `cd /home/ubuntu/Desktop/rag-by-hand && python3 part-13-late-interaction/late_interaction.py`
Expected: exit 0 (real `all-MiniLM-L6-v2` token-embedding path or a clean documented degrade if the model lacks a token-level API — in that case keep the real path on pooled token surrogates and document it).

- [ ] **Step 4: Commit (rag-by-hand main)**

```bash
cd /home/ubuntu/Desktop/rag-by-hand
git add part-13-late-interaction/late_interaction.py
git commit -m "Add Part 13 late-interaction (MaxSim) runnable"
```
(No push yet. No Claude trailer.)

### Task 1.2: Notebook `late_interaction.ipynb`

**Files:** Create `/home/ubuntu/Desktop/rag-by-hand/part-13-late-interaction/late_interaction.ipynb`.

- [ ] **Step 1: Build the notebook with nbformat**

Author a Python builder script (run once, then discard) that emits nbformat-v4 JSON. Cells, in order: (0) markdown — title + "Open in Colab" badge (`https://colab.research.google.com/github/mftnakrsu/rag-by-hand/blob/main/part-13-late-interaction/late_interaction.ipynb`) + what you'll build + link to the essay `/essays/late-interaction-retrieval`; then for each step a markdown *why* cell (drawn from the essay outline §7) followed by a small code cell building state: imports+fallback banner → `token_embed` → `maxsim` (verbatim from the .py) → corpus → MaxSim-vs-pooled ranking → storage report → ColPali patch demo → closing markdown ("what you learned / next: Part 14"). Keep cells output-free (`outputs: []`, `execution_count: null`).

- [ ] **Step 2: Verify both execution paths**

Run: `python3 /tmp/nbverify.py /home/ubuntu/Desktop/rag-by-hand/part-13-late-interaction/late_interaction.ipynb offline`
Then: `python3 /tmp/nbverify.py .../late_interaction.ipynb real`
Expected: `PASS (offline)` and `PASS (real)`.

- [ ] **Step 3: Strip outputs (ensure committed output-free)**

Run: `cd /home/ubuntu/Desktop/rag-by-hand && jupyter nbconvert --clear-output --inplace part-13-late-interaction/late_interaction.ipynb` (or re-emit from the builder, which is already output-free).
Expected: notebook JSON has no cell outputs.

- [ ] **Step 4: Commit**

```bash
cd /home/ubuntu/Desktop/rag-by-hand
git add part-13-late-interaction/late_interaction.ipynb
git commit -m "Add Part 13 late-interaction step-by-step notebook"
```

### Task 1.3: Per-part README

**Files:** Create `/home/ubuntu/Desktop/rag-by-hand/part-13-late-interaction/README.md`.

- [ ] **Step 1: Write README** matching the existing per-part README style (parts 2–12): one-paragraph what/why, "Run it" (`python3 late_interaction.py`), "Notebook" (Colab badge/link), key idea (MaxSim), the essay link, and the offline note. Keep concise.

- [ ] **Step 2: Commit**

```bash
cd /home/ubuntu/Desktop/rag-by-hand
git add part-13-late-interaction/README.md
git commit -m "Add Part 13 README"
```

### Task 1.4: Static SVGs

**Files:** Create `public/essays/late-interaction-retrieval/part13-pooled-vs-multivector.svg` and `part13-maxsim.svg` (in the mefby repo).

- [ ] **Step 1: Author the SVGs** using the design tokens (spec §5; static hex only inside SVG — no `color-mix()`):
  - `part13-pooled-vs-multivector.svg`: left, a passage → one pooled vector (violet); right, the same passage → a row of per-token vectors. Caption-free (caption lives in MDX).
  - `part13-maxsim.svg`: query tokens (top) × doc tokens (bottom), arrows from each query token to its max doc token (cyan highlight), a sum node producing the score (indigo). Match Fig styling of existing parts.

- [ ] **Step 2: Verify well-formed XML**

Run: `cd /home/ubuntu/Desktop/mefby-main && python3 -c "import xml.dom.minidom,glob;[xml.dom.minidom.parse(f) for f in glob.glob('public/essays/late-interaction-retrieval/*.svg')];print('ok')"`
Expected: `ok` (parses without error). (No raster renderer in env; visual correctness confirmed at the build/eyeball gate.)

### Task 1.5: Interactive widget `part13-maxsim-playground.html`

**Files:** Create `public/essays/late-interaction-retrieval/part13-maxsim-playground.html`.

- [ ] **Step 1: Author the self-contained widget** (no CDN/web-fonts/external resources). A query-token × doc-token similarity grid: cells shaded by similarity; each query row's max cell outlined (the MaxSim pick); a running score readout = sum of row maxima; a toggle between two candidate docs (one exact-term match, one topical) showing late interaction preferring the exact-term doc where pooled cosine wouldn't. Controls per convention: a doc toggle (`.scn`/`aria-pressed`), keyboard support, a single `aria-live` region announcing the score, and a `@media (prefers-reduced-motion)` block. Inline `<style>`+`<script>`; design tokens verbatim.

- [ ] **Step 2: Verify well-formed + self-contained**

Run: `cd /home/ubuntu/Desktop/mefby-main && grep -nE "https?://|cdn|googleapis|unpkg|jsdelivr" public/essays/late-interaction-retrieval/part13-maxsim-playground.html || echo "no external refs"`
Expected: `no external refs`. (Behavior confirmed at the eyeball gate.)

### Task 1.6: Essay `late-interaction-retrieval.mdx`

**Files:** Create `src/content/essays/late-interaction-retrieval.mdx`.

- [ ] **Step 1: Write the frontmatter (verbatim)**

```mdx
---
title: "Late-Interaction Retrieval"
description: "Single-vector embeddings throw away token-level signal. Late interaction keeps a vector per token and scores with MaxSim, getting cross-encoder-quality matching at bi-encoder serving cost. Part 13 of a from-scratch series on Retrieval-Augmented Generation, opening the Frontier Track: ColBERT and ColBERTv2, MaxSim by hand in numpy, the storage tradeoff, and how ColPali extends late interaction to document page images without OCR or chunking."
date: 2026-06-19
tags: ["RAG", "Retrieval", "ColBERT", "ColPali", "Late Interaction", "Embeddings", "LLM", "AI"]
codeUrl: "https://github.com/mftnakrsu/rag-by-hand/tree/main/part-13-late-interaction"
ogImage: "/og/rag-by-hand.png"
seriesOrder: 13
lang: "en"
---

import Diagram from '../../components/essay/Diagram.astro';
import IframeFigure from '../../components/essay/IframeFigure.astro';

*RAG from First Principles. Part 13 of the series, opening the Frontier Track.*
```

- [ ] **Step 2: Write the body** following the §7 section outline (8 sections), ~2,500–3,500 words, em-dash-free, house voice. Place figures: `part13-pooled-vs-multivector.svg` (in the multi-vector section), `part13-maxsim.svg` (in the MaxSim section), the interactive `<IframeFigure src="/essays/late-interaction-retrieval/part13-maxsim-playground.html" title="..." height={760} />` after MaxSim is introduced. Cite ColBERT/ColBERTv2/ColPali per Task 0.2 verified values. ColPali taught strictly as mechanism (explicitly note no real VLM runs offline). Ship a real `> 💡 **From experience**` anecdote + an invisible `{/* author: swap ... */}` marker. End with a one-line teaser to Part 14 (Context-Aware Chunking).

- [ ] **Step 3: Drop a byte-identical `.py` copy ONLY if the essay adds an inline download link** (default: no inline link; link via `codeUrl` only — skip this step unless a download link is added, in which case copy `late_interaction.py` to `public/essays/late-interaction-retrieval/` and keep it byte-identical).

- [ ] **Step 4: Build**

Run: `cd /home/ubuntu/Desktop/mefby-main && npm run build`
Expected: astro check + build pass (exit 0); `dist/essays/late-interaction-retrieval/index.html` exists; home/`/essays`/RSS reference it.

- [ ] **Step 5: Commit on a feature branch (mefby) — add ONLY this part's files**

```bash
cd /home/ubuntu/Desktop/mefby-main
git checkout -b feat/part-13-late-interaction
git add src/content/essays/late-interaction-retrieval.mdx public/essays/late-interaction-retrieval/
git commit -m "Add Part 13: Late-Interaction Retrieval (Frontier Track)"
```
(Do NOT `git add -A`. PR opened later in Phase 5.)

---

## Phase 2 — Part 14: Context-Aware Chunking

> Spec §8. Slug `context-aware-chunking`; folder `part-14-context-aware-chunking`; date 2026-06-20; seriesOrder 14. **Citation rule: only the 35% figure; never 67%/47%.**

### Task 2.1: Repo artifact `context_aware_chunking.py`

**Files:** Create `/home/ubuntu/Desktop/rag-by-hand/part-14-context-aware-chunking/context_aware_chunking.py`.

- [ ] **Step 1: Write the artifact (offline, deterministic)** with the §6 fallback shape. Required pieces:
  - A toy long-context encoder `token_embed(text) -> (n_tokens, d)` (real model behind `try/except`, else deterministic hashing).
  - Late chunking (show verbatim):

```python
import numpy as np

def late_chunk(token_vecs: np.ndarray, spans: list[tuple[int, int]]) -> np.ndarray:
    """Pool token spans into chunk vectors AFTER the encoder, so each chunk
    vector is contextualized by the whole document. spans are (start, end)
    token indices. Returns (n_chunks, d), L2-normalized."""
    out = []
    for s, e in spans:
        v = token_vecs[s:e].mean(axis=0)
        out.append(v / (np.linalg.norm(v) + 1e-9))
    return np.array(out)
```

  - A naive baseline `naive_chunk_embed(chunks)` that embeds each chunk string independently. On a coreference doc (e.g. "Alice founded Acme in 2019. She set the refund window at 30 days." split so the second sentence is its own chunk), show that late chunking retrieves the "30 days" chunk for the query "what is Alice's refund window" while the naive chunk (where "She" lost its antecedent) ranks lower.
  - Contextual retrieval: `contextualize(chunk, doc) -> str` using the offline `generate()` stand-in (grounded extractive: prepend a deterministic situating sentence built from the doc title/first line). Then embed `context + chunk` and show the same retrieval improving.
  - `if __name__ == "__main__":` runs both demos with banners and an `Expected output` header block.

- [ ] **Step 2: Run offline + capture output** — `HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 HF_HOME=$(mktemp -d) python3 part-14-context-aware-chunking/context_aware_chunking.py`. Expected: exit 0; late-chunk and contextual paths both surface the right chunk. Paste output into the header block.

- [ ] **Step 3: Run real path** — `python3 part-14-context-aware-chunking/context_aware_chunking.py`. Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
cd /home/ubuntu/Desktop/rag-by-hand
git add part-14-context-aware-chunking/context_aware_chunking.py
git commit -m "Add Part 14 context-aware chunking runnable"
```

### Task 2.2: Notebook `context_aware_chunking.ipynb`

**Files:** Create the notebook.

- [ ] **Step 1: Build with nbformat** — same cell pattern as Task 1.2 (markdown-why → small code step), Colab badge cell 0 pointing at this notebook's path, essay link `/essays/context-aware-chunking`. Steps: fallback banner → `token_embed` → `late_chunk` (verbatim) → coreference demo → `contextualize` + prepend-then-embed demo → closing "next: Part 15". Output-free.
- [ ] **Step 2: Verify both paths** — `python3 /tmp/nbverify.py .../context_aware_chunking.ipynb offline` then `real`. Expected: both PASS.
- [ ] **Step 3: Ensure output-free** (re-emit or `nbconvert --clear-output --inplace`).
- [ ] **Step 4: Commit** — `git add part-14-context-aware-chunking/context_aware_chunking.ipynb && git commit -m "Add Part 14 step-by-step notebook"`.

### Task 2.3: Per-part README

- [ ] **Step 1: Write** `part-14-context-aware-chunking/README.md` (style as Task 1.3; key idea = late chunking + contextual retrieval; only-35% note).
- [ ] **Step 2: Commit** — `git add part-14-context-aware-chunking/README.md && git commit -m "Add Part 14 README"`.

### Task 2.4: Static SVGs

**Files:** `public/essays/context-aware-chunking/part14-late-chunking.svg`, `part14-contextual-retrieval.svg`.

- [ ] **Step 1: Author** — `part14-late-chunking.svg`: top row "chunk then embed" (each chunk isolated), bottom row "embed all tokens then pool" (whole-doc token strip → pooled chunk vectors), highlighting the contextualization. `part14-contextual-retrieval.svg`: a chunk + an LLM-written situating sentence prepended (amber) → embedder (violet). Design tokens; static hex.
- [ ] **Step 2: Verify XML well-formed** (minidom parse, as Task 1.4 Step 2, glob this folder). Expected: `ok`.

### Task 2.5: Interactive widget `part14-context-aware-chunking.html`

- [ ] **Step 1: Author** the self-contained scenario-toggle widget (Part 11 style): 3 scenarios {naive / late chunking / contextual retrieval} over the coreference doc; for the fixed query, show which chunk is retrieved and why under each mode; single `aria-live`, keyboard, prefers-reduced-motion, no external refs.
- [ ] **Step 2: Verify no external refs** (grep as Task 1.5 Step 2 on this file). Expected: `no external refs`.

### Task 2.6: Essay `context-aware-chunking.mdx`

- [ ] **Step 1: Frontmatter (verbatim)**

```mdx
---
title: "Context-Aware Chunking"
description: "A chunk that reads fine in isolation can be uninterpretable once it leaves its document: 'she' no longer resolves to 'Alice', 'the policy' loses its antecedent. Part 14 of a from-scratch series on Retrieval-Augmented Generation, on the Frontier Track: two training-free fixes, late chunking (pool token spans after the transformer) and Anthropic's Contextual Retrieval (prepend an LLM-written situating sentence before embedding), built by hand and compared."
date: 2026-06-20
tags: ["RAG", "Chunking", "Late Chunking", "Contextual Retrieval", "Embeddings", "Retrieval", "LLM", "AI"]
codeUrl: "https://github.com/mftnakrsu/rag-by-hand/tree/main/part-14-context-aware-chunking"
ogImage: "/og/rag-by-hand.png"
seriesOrder: 14
lang: "en"
---

import Diagram from '../../components/essay/Diagram.astro';
import IframeFigure from '../../components/essay/IframeFigure.astro';

*RAG from First Principles. Part 14 of the series, on the Frontier Track.*
```

- [ ] **Step 2: Write the body** per §8 outline (7 sections), ~2,500–3,500 words, em-dash-free. Figures: `part14-late-chunking.svg`, `part14-contextual-retrieval.svg`, interactive after both mechanisms introduced. **Cite only the 35% (5.7%→3.7%) figure; never 67%/47%.** One honest cost sentence (extra index-time LLM call; prompt-caching mitigates). Real From-experience anecdote + invisible marker. Teaser → Part 15.
- [ ] **Step 3: Build** — `npm run build`. Expected: pass; `dist/essays/context-aware-chunking/index.html` exists.
- [ ] **Step 4: Commit on its own feature branch** — `git checkout main && git checkout -b feat/part-14-context-aware-chunking`, then `git add src/content/essays/context-aware-chunking.mdx public/essays/context-aware-chunking/ && git commit -m "Add Part 14: Context-Aware Chunking (Frontier Track)"`. (Never `-A`.)

---

## Phase 3 — Part 15: Adaptive RAG (Frontier-Track close)

> Spec §9. Slug `adaptive-rag`; folder `part-15-adaptive-rag`; date 2026-06-21; seriesOrder 15.

### Task 3.1: Repo artifact `adaptive_rag.py`

**Files:** Create `/home/ubuntu/Desktop/rag-by-hand/part-15-adaptive-rag/adaptive_rag.py`.

- [ ] **Step 1: Write the artifact (offline, deterministic)** with the §6 fallback shape. Required pieces:
  - The classifier (show verbatim):

```python
import re

def classify_complexity(query: str) -> str:
    """Route a query by complexity: 'none' (no retrieval needed),
    'single' (one retrieve->generate), or 'multi' (decompose, multi-step).
    Deterministic rule/keyword classifier; a real system would use a small
    trained classifier, shown here as the fallback path."""
    q = query.lower().strip()
    if re.search(r"\b(hi|hello|thanks|who are you)\b", q) or len(q.split()) <= 2:
        return "none"
    multi_signals = ("compare", "versus", " vs ", "difference between",
                     " and then", "across", "each of", "both", "trade-off")
    if any(s in q for s in multi_signals) or q.count("?") > 1:
        return "multi"
    return "single"
```

  - `route(query, kb)` dispatching: `none` → a direct templated answer (no retrieval); `single` → retrieve top-k + grounded `generate()` (reuse the Part 6 shape); `multi` → decompose into sub-queries (split on the multi signals), retrieve per sub-query, then synthesize. All offline via the deterministic embedder + extractive `generate()` stand-in.
  - A demo running ~6 example queries (2 per class) over the support KB, printing the chosen route + a one-line answer for each.
  - `if __name__ == "__main__":` with banners + `Expected output` header block.

- [ ] **Step 2: Run offline + capture** — `HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 HF_HOME=$(mktemp -d) python3 part-15-adaptive-rag/adaptive_rag.py`. Expected: exit 0; each example routed sensibly; paste output into header.
- [ ] **Step 3: Run real path** — `python3 part-15-adaptive-rag/adaptive_rag.py`. Expected: exit 0.
- [ ] **Step 4: Commit** — `git add part-15-adaptive-rag/adaptive_rag.py && git commit -m "Add Part 15 adaptive RAG runnable"`.

### Task 3.2: Notebook `adaptive_rag.ipynb`

- [ ] **Step 1: Build with nbformat** — cell pattern as before; Colab badge cell 0; essay link `/essays/adaptive-rag`. Steps: banner → `classify_complexity` (verbatim) → the three route handlers → demo over example queries → closing Frontier-Track wrap markdown. Output-free.
- [ ] **Step 2: Verify both paths** — `python3 /tmp/nbverify.py .../adaptive_rag.ipynb offline` then `real`. Expected: both PASS.
- [ ] **Step 3: Ensure output-free.**
- [ ] **Step 4: Commit** — `git add part-15-adaptive-rag/adaptive_rag.ipynb && git commit -m "Add Part 15 step-by-step notebook"`.

### Task 3.3: Per-part README

- [ ] **Step 1: Write** `part-15-adaptive-rag/README.md` (style as Task 1.3; key idea = route by complexity over Parts 6–10).
- [ ] **Step 2: Commit** — `git add part-15-adaptive-rag/README.md && git commit -m "Add Part 15 README"`.

### Task 3.4: Static SVGs

**Files:** `public/essays/adaptive-rag/part15-routing-map.svg`, `part15-cost-vs-complexity.svg`.

- [ ] **Step 1: Author** — `part15-routing-map.svg`: one query → classifier diamond → three branches (no-retrieval / single-step=Part 6 / multi-step=Part 10), each branch labeled. `part15-cost-vs-complexity.svg`: two bars/curves — flat "always multi-step" (wasteful on easy) vs "adaptive" (cost/latency scaled to complexity); annotate "indicative" on any %s. Design tokens; static hex.
- [ ] **Step 2: Verify XML well-formed.** Expected: `ok`.

### Task 3.5: Interactive widget `part15-complexity-router.html`

- [ ] **Step 1: Author** the self-contained widget: pick one of several preset queries (≥2 per class), watch the classifier label it and the matching path light up end-to-end (no-retrieval / single / multi). Stepped-player or scenario-toggle per convention; single aria-live; keyboard; prefers-reduced-motion; no external refs.
- [ ] **Step 2: Verify no external refs.** Expected: `no external refs`.

### Task 3.6: Essay `adaptive-rag.mdx`

- [ ] **Step 1: Frontmatter (verbatim)**

```mdx
---
title: "Adaptive RAG"
description: "Not every query needs the same machinery: a greeting needs no retrieval, a fact needs one lookup, a comparison needs several. Part 15 of a from-scratch series on Retrieval-Augmented Generation and the close of the Frontier Track: a small complexity classifier that routes each query to no-retrieval, single-step, or multi-step retrieval, unifying the pipelines built across Parts 6 to 10 into one adaptive system."
date: 2026-06-21
tags: ["RAG", "Adaptive RAG", "Routing", "Query Complexity", "Retrieval", "LLM", "AI"]
codeUrl: "https://github.com/mftnakrsu/rag-by-hand/tree/main/part-15-adaptive-rag"
ogImage: "/og/rag-by-hand.png"
seriesOrder: 15
lang: "en"
---

import Diagram from '../../components/essay/Diagram.astro';
import IframeFigure from '../../components/essay/IframeFigure.astro';

*RAG from First Principles. Part 15 of the series, and the close of the Frontier Track.*
```

- [ ] **Step 2: Write the body** per §9 outline (8 sections incl. the light Frontier-Track close), ~2,500–3,500 words, em-dash-free. Figures: `part15-routing-map.svg`, `part15-cost-vs-complexity.svg`, interactive after the classifier section. Frame ~35%/~28% as indicative/vendor. Contrast explicitly with Part 8 (query transforms) and Part 10 (route by source). Real From-experience anecdote + invisible marker. Close: light send-off ending the track, pointing back to Part 12's capstone and "now go build" (NOT a competing grand finale).
- [ ] **Step 3: Build** — `npm run build`. Expected: pass; `dist/essays/adaptive-rag/index.html` exists.
- [ ] **Step 4: Commit on its own feature branch** — `git checkout main && git checkout -b feat/part-15-adaptive-rag`, then `git add src/content/essays/adaptive-rag.mdx public/essays/adaptive-rag/ && git commit -m "Add Part 15: Adaptive RAG (Frontier Track close)"`.

---

## Phase 4 — Part 11 additions

> Spec §10. Edit the shipped essay (no date/seriesOrder change) + add a separate repo artifact.

### Task 4.1: Repo artifact `long_context_vs_rag.py`

**Files:** Create `/home/ubuntu/Desktop/rag-by-hand/part-11-evaluating-rag/long_context_vs_rag.py`.

- [ ] **Step 1: Write the artifact (pure numpy/stdlib, offline)**:
  - Build a small synthetic **fictional** corpus (e.g. "Starlight Academy" facts) with a few inserted needles (unique fictional tokens), so no pretrained knowledge can leak.
  - `llm_alone(question, corpus)` — stuff the whole corpus into a context window proxy; answer by needle substring search across all of it; cost = total token count.
  - `rag(question, corpus, k)` — retrieve top-k chunks (deterministic embedder cosine), answer by needle substring search within retrieved; cost = retrieved token count.
  - Score both by substring match on the gold needle; print an accuracy / cost(tokens) / latency(proxy = tokens scanned) table across a couple of corpus sizes. Modest framing in comments: the debate is real, not "RAG is dead".
  - `if __name__ == "__main__":` + `Expected output` header.

- [ ] **Step 2: Run offline + capture** — `python3 part-11-evaluating-rag/long_context_vs_rag.py` (no model needed; pure numpy). Expected: exit 0; table prints; paste into header.
- [ ] **Step 3: Confirm `rag_eval.py` untouched** — `cd /home/ubuntu/Desktop/rag-by-hand && git status --porcelain part-11-evaluating-rag/rag_eval.py` → expected: empty (no modification). The site-mirrored copy must stay byte-identical.
- [ ] **Step 4: Commit** — `git add part-11-evaluating-rag/long_context_vs_rag.py && git commit -m "Add Part 11 long-context-vs-RAG head-to-head"`.

### Task 4.2: Notebook `long_context_vs_rag.ipynb`

- [ ] **Step 1: Build with nbformat** — Colab badge cell 0; markdown-why → code steps building the corpus, both strategies, the comparison table; closing markdown tying back to the Part 11 essay. Output-free.
- [ ] **Step 2: Verify** — `python3 /tmp/nbverify.py .../long_context_vs_rag.ipynb offline` (offline suffices; no model). Expected: PASS. (`real` also PASS since pure numpy.)
- [ ] **Step 3: Ensure output-free.**
- [ ] **Step 4: Commit** — `git add part-11-evaluating-rag/long_context_vs_rag.ipynb && git commit -m "Add Part 11 long-context-vs-RAG notebook"`.

### Task 4.3: Part 11 SVG

**Files:** Create `public/essays/evaluating-rag/part11-longcontext-vs-rag.svg`.

- [ ] **Step 1: Author** — accuracy/cost/latency vs growing corpus size: RAG flat-ish cost + steady accuracy, long-context rising cost + a lost-in-the-middle accuracy dip; "Self-Route" marker where the two cross. Design tokens; static hex.
- [ ] **Step 2: Verify XML well-formed.** Expected: `ok`.

### Task 4.4: Edit `evaluating-rag.mdx` (sections D + E)

**Files:** Modify `src/content/essays/evaluating-rag.mdx`.

- [ ] **Step 1: Add the figure import if missing** — ensure `import Diagram ...` and `IframeFigure` imports present (Diagram already used). No frontmatter change (date 2026-06-17, seriesOrder 11 unchanged).
- [ ] **Step 2: Insert two sections before `## Key takeaways`**:
  - `## Long-context models vs RAG, head to head` (Section D) — the synthetic-corpus + needles setup, the accuracy/cost/latency tradeoff, Self-Route as the pragmatic synthesis, the honest "it depends, not dead" framing; embed `part11-longcontext-vs-rag.svg` via `<Diagram>`; cite U-NIAH / Self-Route / LaRA (Task 0.2 values). Mention the runnable `long_context_vs_rag.py` (link via the part folder).
  - `### A frontier note: capability-level evaluation` (Section E) — short, clearly flagged as recent/medium-confidence; RAGCap-Bench's intermediate capabilities; cite 2510.13910. No figure.
  - Em-dash-free; keep voice consistent with the rest of Part 11.
- [ ] **Step 3: Build** — `npm run build`. Expected: pass; `dist/essays/evaluating-rag/index.html` regenerates with the new sections.
- [ ] **Step 4: Commit on a branch (with the Part 12 pointer, Task 5.1)** — branch created in Task 5.1; do not commit yet if doing both edits together. Otherwise: `git checkout main && git checkout -b feat/part-11-frontier-additions && git add src/content/essays/evaluating-rag.mdx public/essays/evaluating-rag/part11-longcontext-vs-rag.svg && git commit -m "Part 11: add long-context-vs-RAG + capability-eval sections"`.

---

## Phase 5 — Part 12 pointer, integration, PRs, final verification

### Task 5.1: Part 12 forward-pointer

**Files:** Modify `src/content/essays/rag-in-production.mdx`.

- [ ] **Step 1: Add one block after the send-off** (after the final send-off paragraph, before/after the closing — do NOT edit the send-off prose or the P1–P12 capstone). Example:

```mdx
> 📌 **Postscript (2026).** The twelve parts above are the complete core of this series. If you want to keep going, a short Frontier Track picks up three 2026 advances that build directly on what you now know: [Late-Interaction Retrieval](/essays/late-interaction-retrieval) (Part 13), [Context-Aware Chunking](/essays/context-aware-chunking) (Part 14), and [Adaptive RAG](/essays/adaptive-rag) (Part 15).
```

- [ ] **Step 2: Build** — `npm run build`. Expected: pass; Part 12 page regenerates with the postscript; the three frontier links resolve (they exist after Phases 1–3).
- [ ] **Step 3: Commit** — on `feat/part-11-frontier-additions` (combine with Task 4.4) or its own branch: `git add src/content/essays/rag-in-production.mdx && git commit -m "Part 12: add Frontier Track postscript"`.

### Task 5.2: rag-by-hand root README rows

**Files:** Modify `/home/ubuntu/Desktop/rag-by-hand/README.md`.

- [ ] **Step 1: Add 3 curriculum rows** for Parts 13/14/15 (Code / Notebook / Essay links + Colab badge), matching the existing table's columns and the Colab-badge format used in earlier rows. Add a sub-note on the Part 11 `long_context_vs_rag` experiment (one line, no new row needed). Verify the essay URLs match the slugs.
- [ ] **Step 2: Sanity-check links** — `grep -nE "part-1[3-5]|long_context_vs_rag|late-interaction|context-aware-chunking|adaptive-rag" README.md`. Expected: rows present and consistent.
- [ ] **Step 3: Commit** — `git add README.md && git commit -m "README: add Parts 13-15 + Part 11 experiment to curriculum"`.

### Task 5.3: Full repo verification (rag-by-hand)

- [ ] **Step 1: Run every new `.py` offline** — for each of the 4 new `.py`, run with forced-offline env; expect exit 0.
- [ ] **Step 2: Re-verify all new notebooks both paths** — run `/tmp/nbverify.py` (offline + real) on all 4 new notebooks; expect 8 PASS.
- [ ] **Step 3: Confirm all notebooks output-free** — `cd /home/ubuntu/Desktop/rag-by-hand && python3 -c "import nbformat,glob;[print(f) for f in glob.glob('part-1*/**/*.ipynb',recursive=True) if any(c.get('outputs') for c in nbformat.read(f,4).cells if c.cell_type=='code')]"`. Expected: prints nothing (all clean).
- [ ] **Step 4: Confirm `rag_eval.py` + other prior files unchanged** — `git status` shows only the new/intended files staged across commits; `git log --oneline -12` shows the Part 13–15 + Part 11 commits, no Claude trailer.

### Task 5.4: Push rag-by-hand (CONFIRM with user first)

- [ ] **Step 1: Show the user the pending commits** — `git log --oneline origin/main..main` and a one-line summary. Ask explicit permission to push.
- [ ] **Step 2: Push only after approval** — `git push origin main`. Expected: fast-forward; verify on GitHub the new folders + README render and Colab badges resolve.

### Task 5.5: Open site PRs (user merges)

- [ ] **Step 1: Push the four feature branches** — `feat/part-13-late-interaction`, `feat/part-14-context-aware-chunking`, `feat/part-15-adaptive-rag`, `feat/part-11-frontier-additions` (the last includes the Part 12 postscript). For each: `git push -u origin <branch>`.
- [ ] **Step 2: Open a PR per branch** via `gh pr create` with a body describing the part, the figures, and the offline companion. **No "Generated with Claude Code" in any PR body.** Note that PRs depend on rag-by-hand being pushed (Task 5.4) so `codeUrl` links resolve.
- [ ] **Step 3: Confirm each PR builds** (Vercel preview / local `npm run build` already green) and hand the PR list to the user to merge.

### Task 5.6: Post-merge memory update

- [ ] **Step 1: Update memory** — after the user merges, update `rag-by-hand-project.md` and `rag-series-conventions.md` (and `MEMORY.md` index hooks) to record: series extended to 15 parts via a Frontier Track; Part 12 remains the core finale with a postscript; Part 11 gained long-context-vs-RAG + RAGCap-Bench; new slugs/folders; the only-35% rule honored. Per the memory rules, update existing files rather than duplicate.

---

## Self-Review

**Spec coverage:** §4 framing → Phase 0–5 (dates/slugs in each frontmatter block, Frontier-Track lines verbatim). §5 conventions → conventions quick-ref + every essay task. §6 repo conventions → every `.py`/notebook/README task + Task 5.3. §7 Part 13 → Phase 1. §8 Part 14 → Phase 2. §9 Part 15 → Phase 3. §10 Part 11 → Phase 4. §11 integration/PRs → Phase 5. §12 verification → Task 0.3, per-part verify steps, Task 5.3. §13 orchestration → reflected in phase independence note (Architecture). §14 open items → all resolved by approved defaults (slugs set; Part 12 postscript included; per-part PRs; Part 11 one SVG; `.py` site-mirror skipped unless inline link added).

**Placeholder scan:** No "TBD/TODO/handle edge cases". Correctness-critical functions (`maxsim`, `late_chunk`, `classify_complexity`) shown verbatim; frontmatter shown verbatim; essay prose specified by outline + claims + citations + word target (correct altitude — prose is the execution output, not pre-written here). The `Expected output` header blocks are filled from the first real run (each `.py` task says so), not left blank in the artifact.

**Type/name consistency:** `maxsim(query_vecs, doc_vecs)`, `late_chunk(token_vecs, spans)`, `classify_complexity(query) -> {'none','single','multi'}`, `route(query, kb)`, `token_embed(text) -> (n_tokens, d)`, `contextualize(chunk, doc)`, `llm_alone`/`rag` — names consistent across plan and notebook tasks. Slugs ↔ folders ↔ codeUrl consistent across §4, frontmatter, README rows, and the Part 12 postscript links.
