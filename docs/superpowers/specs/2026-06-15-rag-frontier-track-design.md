# Design Spec — RAG series Frontier Track (Parts 13–15 + Part 11 additions)

> Status: APPROVED (overall shape, 2026-06-15) → ready for implementation plan.
> Scope, finale handling, figure depth, and Part 11 code artifact all locked with the user.
> This spec is the source of truth for the implementation plan. It lives untracked on disk
> (project convention: `docs/superpowers/*` planning docs stay out of website PRs).

---

## 1. Goal

Extend the completed 12-part **"RAG from First Principles"** series with **three new 2026-frontier
parts (13, 14, 15)** plus **two new sections folded into the shipped Part 11**, drawn from the
deep-research report (`docs/superpowers/research/2026-06-15-rag-2026-additions.md`). Each new part
ships as a real blog post on mefby.com **and** a runnable, framework-free, offline companion in the
`rag-by-hand` repo — matching the existing series' bar exactly.

**Teaching ethos (unchanged):** build it by hand, understand every line; teach the *mechanism* with a
transparent offline/toy fallback where a real model/VLM/LLM isn't available.

## 2. Decisions locked with the user (2026-06-15)

1. **Scope:** all of it — Parts 13, 14, 15 **and** fold sections D (long-context vs RAG) + E
   (RAGCap-Bench sidebar) into Part 11.
2. **Finale handling:** Part 12 stays the **canonical finale** of the core series. Parts 13–15 are a
   clearly-marked **Frontier Track** continuation *after* the finale. Part 12 gets at most **one**
   surgical forward-pointer; its send-off and P1–P12 capstone are otherwise untouched.
3. **Figures:** **full flagship treatment** per new part — 2 static SVGs + 1 self-contained
   interactive HTML widget, reusing the established conventions.
4. **Part 11 code:** add a **runnable artifact** for the long-context-vs-RAG head-to-head (D),
   offline-runnable, kept as a **separate file** so the verified `rag_eval.py` stays byte-stable.

## 3. Non-goals / out of scope

- No Turkish translations (Parts 6–12 are English-only; TR pairs remain a pre-existing open
  follow-up, not part of this round).
- No "RAG is dead" framing; no context-architecture-replaces-RAG claim; no runtime tool-call
  inversion lesson (all refuted 0-3 in the research).
- Do **not** cite the Contextual Retrieval **67% / 47%** additive numbers (refuted) — only the **35%**.
- No new "four agentic patterns" lesson (Part 10 already covers Agentic RAG; refuted 1-2).
- No Tier-3 material (cross-session agent memory; CSR adaptive sparse embeddings) — orthogonal.
- No re-architecture of the site, layout, or schema. The essay schema already has every field we
  need (`codeUrl`, `ogImage`, `seriesOrder`, `lang`); no schema change.

## 4. Framing, numbering, dates

| Part | Slug | Repo folder | `seriesOrder` | `date` |
|---|---|---|---|---|
| 13 | `late-interaction-retrieval` | `part-13-late-interaction` | 13 | 2026-06-19 |
| 14 | `context-aware-chunking` | `part-14-context-aware-chunking` | 14 | 2026-06-20 |
| 15 | `adaptive-rag` | `part-15-adaptive-rag` | 15 | 2026-06-21 |

- **Dates** are forward-dated one day apart (the series already runs ahead of the real date: P11=06-17,
  P12=06-18). Effect: the three new parts **lead** the home page / RSS (date-desc) as fresh content,
  while `seriesOrder` keeps the canonical 1→15 order on `/essays`. This is intended.
- **Frontier-Track branding.** Italic series line (the first body line, period-separated per
  convention — **not** an em-dash):
  - P13: `*RAG from First Principles. Part 13 of the series, opening the Frontier Track.*`
  - P14: `*RAG from First Principles. Part 14 of the series, on the Frontier Track.*`
  - P15: `*RAG from First Principles. Part 15 of the series, and the close of the Frontier Track.*`
- **P13 intro** states plainly: the core series *ended* at Part 12 (the finale); the Frontier Track is
  optional, 2026-frontier material you reach for once the core is solid.
- **Part 12 forward-pointer (surgical):** add one short, clearly-marked block *after* the existing
  send-off — a `> 📌 **Postscript (2026)**` style note pointing to the Frontier Track. The send-off
  prose and the P1–P12 capstone checklist are NOT edited. (User may veto the pointer entirely.)
- **Part 15 close:** a *light* Frontier-Track send-off that does not compete with Part 12's finale —
  ends the track, points the reader back to "now go build," not a second grand farewell.
- **Cross-links:** new parts hook into *existing* parts, not each other (they're mutually independent
  in content). 13 → Parts 7+8; 14 → Parts 5+9; 15 → Parts 6–10. Teaser chain 13→14→15.

## 5. Authoring conventions (apply to every new part — from `rag-series-conventions`)

- **Essay file:** `src/content/essays/<slug>.mdx`. Frontmatter validated by `src/content/config.ts`:
  `title`, `description`, `date`, `tags`, `codeUrl`, `ogImage: "/og/rag-by-hand.png"`,
  `seriesOrder`, `lang: "en"`. No `# h1` (layout renders title+description). Series/part line is the
  italic first body line.
- **Article shape:** italic series line → `## What you'll learn` → `## Prerequisites` → body
  `##`/`###` sections → a `> 💡 **From experience**` callout that ships a **real first-person
  anecdote** PLUS an invisible `{/* author: swap ... */}` marker (NEVER ship a raw
  `[INSERT YOUR OWN STORY HERE]` placeholder — vetoed) → `## Key takeaways` → `## Glossary` of new
  terms → one-line teaser for the next part.
- **Voice:** first-person practitioner, warm but precise; every new term defined on first use; target
  ~2,500–3,500 words. **Em-dash-free** (U+2014 replaced with natural punctuation; word hyphens and →
  arrows kept). Keep `{` and bare `<` out of prose (MDX gotcha).
- **Figures:** import `Diagram from '../../components/essay/Diagram.astro'`; use
  `<Diagram number={n} caption="...">`. SVGs: `<img src="/essays/<slug>/x.svg" alt="..."
  class="w-full rounded-lg" />`. Interactive: import `IframeFigure from
  '../../components/essay/IframeFigure.astro'` and `<IframeFigure src="/essays/<slug>/x.html"
  title="..." height={760} />` inside a `<Diagram>`.
- **Assets:** `public/essays/<slug>/` with a `partN-` filename prefix. Interactive HTML is a single
  self-contained file (no CDN / web-fonts / external resources): Play/Pause + Next/Back + Restart +
  dots + keyboard + `aria-live` + `@media (prefers-reduced-motion)`. Scenario-toggle widgets (Part 11
  style) use `.scn` + `aria-pressed` + a single aria-live region instead of a stepped player.
- **Design tokens (verbatim):** bg `#ffffff`; surfaces `#f8fafc`/`#f1f5f9`; border `#e2e8f0`; text
  heading `#0f172a`, body `#334155`, muted `#64748b`; accents — indigo `#6366f1`/`#4f46e5` (brand/
  generation), violet `#8b5cf6` (embed/vectors), teal `#14b8a6` (retrieval/store), cyan `#06b6d4`
  (retrieve highlight), emerald `#10b981` (grounded/correct), amber `#f59e0b` (augment), rose
  `#f43f5e` (wrong/hallucination). Inter + JetBrains Mono. 14px card / 8px chip radius. Stripe/Linear/
  Vercel minimalism. **Gotcha:** `color-mix()` is unreliable inside SVG `fill=`/`stroke=` — use static
  hex there.
- **Running example continuity:** reuse the support knowledge base where natural (refund-policy doc,
  30-day window, the `E-4042` error-code chunk) so the frontier parts feel continuous with 6–12.

## 6. Repo conventions (`rag-by-hand` — from HANDOFF + project memory)

- One folder per part: `part-NN-<slug>/` containing the main `.py`, a step-by-step `.ipynb`, and a
  concise `README.md`.
- **Offline is a hard requirement.** Guard every model load / LLM / web call in `try/except` with a
  transparent deterministic fallback (numpy hashing embedder; offline grounded-extractive generate).
  Copy the pattern from `part-02-embeddings/embeddings.py`. numpy is the only hard dep.
- **Notebook style:** much more expansive than the `.py`. Per step: a markdown cell (the *why*, drawn
  from the essay) → a small code cell building state up cell-by-cell. Intro markdown (title + what
  you'll build + essay link + "Open in Colab" badge in cell 0) and a closing "what you learned / next
  part" markdown.
- **Notebooks committed OUTPUT-FREE**, built with `nbformat`, executed top-to-bottom via `nbclient`
  on **both** the real-model path **and** a forced-offline path (`HF_HOME=<empty>` +
  `HF_HUB_OFFLINE=1` + `TRANSFORMERS_OFFLINE=1` so the model load fails fast into the fallback). Fail
  on any cell with `output_type == 'error'`.
- Root `README.md`: add a table row per part (Code / Notebook / Essay links + a Colab badge). Group any
  new deps in `requirements.txt` by part (expected: none beyond numpy; the real late-chunking path
  uses `sentence-transformers`/`transformers`, already listed).
- **Commit directly to `main`; CONFIRM with the user before `git push`.** No Claude co-author trailer,
  no "Generated with Claude Code" (hard rule, see `no-claude-coauthor-trailer`).
- Install on this machine: TAI internal PyPI mirror + `--break-system-packages` (see `tai-pypi-mirror`).

---

## 7. Part 13 — Late-Interaction Retrieval

**One-liner:** token-level multi-vector retrieval scored by MaxSim — the quality paradigm sitting
between single-vector dense retrieval (Part 7) and cross-encoder reranking (Part 8), extended to
document *images* by ColPali.

**Learning objectives:** explain why mean-pooling a passage into one vector loses information; compute
MaxSim by hand; explain why doc vectors are precomputable offline (unlike a cross-encoder); reason
about the storage/accuracy tradeoff; explain (as a mechanism) how ColPali embeds page images as patch
vectors and skips OCR/chunking.

**Section outline:**
1. **Where we left off / why a new lesson** — Frontier-Track intro; recap Part 7 single-vector dense
   and Part 8 cross-encoder reranking; the gap between them.
2. **The pooling problem** — one vector per passage throws away token-level signal; a query term that
   matches one word in a long passage gets averaged out.
3. **Token-level multi-vectors** — keep a vector per token (query and doc).
4. **MaxSim** — for each query token, take the max similarity over all doc tokens, then sum. ~10 lines
   of numpy. Worked example on the refund / `E-4042` corpus.
5. **Why it's still cheap to serve** — doc multi-vectors are **precomputed offline**; only MaxSim runs
   at query time. Contrast with the cross-encoder (Part 8), which must run the model on every
   query-doc pair at query time. "Cross-encoder quality, bi-encoder serving cost."
6. **The storage tradeoff** — per-token vectors cost far more than one pooled vector; compression
   (ColBERTv2 residual / 1–2-bit) brings it down (MS MARCO ~154GB → ~16–25GB). Trivial arithmetic.
7. **ColPali / ColQwen (mechanism)** — a VLM embeds document **page images** as ~1024 patch vectors;
   MaxSim over patches; bypasses OCR and chunking entirely. Taught as a mechanism with a toy
   multi-vector stand-in (no real VLM offline). Distinct from Part 10's one-line multimodal mention.
8. **From experience** callout (real anecdote + invisible swap marker).
9. **Key takeaways / Glossary / teaser → Part 14.**

**Code artifact** `part-13-late-interaction/late_interaction.py` (+ `.ipynb` + `README.md`):
- A toy token-level embedder (real `sentence-transformers` model behind the standard try/except
  fallback; the fallback hashes tokens to deterministic vectors).
- `maxsim(query_vecs, doc_vecs)` in numpy (~10 lines).
- Rank a few docs by MaxSim vs by pooled cosine to show the difference on a term-match query.
- The storage arithmetic printed (tokens × dims × bytes, pooled vs multi-vector, with/without
  compression).
- A tiny "patch-vector" toy (a small grid of random/hashed vectors standing in for a page image's
  patches) running through the same MaxSim, to make the ColPali mechanism concrete.
- Offline, deterministic, documented Expected-output block.

**Figures:**
- Interactive `part13-maxsim-playground.html`: a query-token × doc-token similarity **grid**; each
  query token's max cell highlighted; the running sum shown as the score; a toggle between two
  candidate docs demonstrating why late interaction beats pooled cosine on a term-match query. Reuse
  the toggle + aria-live + prefers-reduced-motion conventions.
- SVG `part13-pooled-vs-multivector.svg`: one pooled vector vs a bag of per-token vectors.
- SVG `part13-maxsim.svg`: the MaxSim operation (query tokens → max over doc tokens → sum).

**Citations:** ColBERT — SIGIR 2020, arXiv 2004.12832. ColBERTv2 — NAACL 2022, arXiv 2112.01488.
ColPali — ICLR 2025, arXiv 2407.01449. (Re-verify arXiv IDs + the 154GB→16–25GB figure during draft.)

---

## 8. Part 14 — Context-Aware Chunking

**One-liner:** two training-free ways to stop a chunk from losing its document context — late chunking
(pool token spans *after* the transformer) and Contextual Retrieval (prepend an LLM-generated
situating sentence *before* embedding).

**Learning objectives:** explain how a chunk loses context (coreference, "the policy" without its
antecedent); explain late chunking's "embed-all-then-pool" mechanism and how it differs from Part 5's
static title-prepend; explain contextual retrieval's "prepend-then-embed"; know the one defensible
quantitative claim (35% top-20 failure reduction) and the avoid-list.

**Section outline:**
1. **The context-loss problem** — back to Part 5: a good chunk in isolation can be uninterpretable
   ("she" / "the refund" / "that error"). Tie to Part 9's decoupling idea.
2. **Late chunking (Jina)** — embed *all* tokens of the long doc in one pass through a long-context
   encoder, **then** pool token spans into per-chunk vectors *after* the transformer, so each chunk
   vector is contextualized by the whole document. Distinct from prepending a static title (Part 5).
3. **Contextual Retrieval (Anthropic)** — for each chunk, an LLM writes a short situating sentence
   ("This chunk is from the 2023 refund policy, section on damaged goods") and you **prepend it before
   embedding**. Cheap, drop-in.
4. **What the evidence actually says** — Contextual Embeddings alone cut top-20 retrieval failure
   **35%** (5.7% → 3.7%). **Do not** quote the 67%/47% additive numbers (refuted). One honest
   sentence on cost (an extra LLM call per chunk at index time; prompt-caching mitigates).
5. **Choosing / combining** — late chunking (no LLM, needs a long-context encoder) vs contextual
   retrieval (model-agnostic, costs LLM calls); they're composable. Small comparison table.
6. **From experience** callout (real anecdote + invisible swap marker).
7. **Key takeaways / Glossary / teaser → Part 15.**

**Code artifact** `part-14-context-aware-chunking/context_aware_chunking.py` (+ `.ipynb` + `README.md`):
- A toy long-context encoder that returns per-token embeddings; `late_chunk(...)` mean-pools token
  spans into chunk vectors. Compare a coreference query against late-chunked vs naive per-chunk
  vectors and show the buried chunk surfacing.
- `contextualize(chunk, doc)` → uses the offline `generate()` stand-in to produce a situating
  sentence, prepend, then embed. Show retrieval improving on the same query.
- Offline, deterministic, Expected-output block.

**Figures:**
- Interactive `part14-context-aware-chunking.html`: a 3-way toggle {naive / late chunking / contextual
  retrieval} over a sample doc with a coreference query; show which chunk gets retrieved under each.
  Scenario-toggle pattern (Part 11 style).
- SVG `part14-late-chunking.svg`: chunk-then-embed vs embed-all-tokens-then-pool.
- SVG `part14-contextual-retrieval.svg`: prepend situating sentence before embedding.

**Citations:** Late chunking — Jina, arXiv 2409.04701. Contextual Retrieval — Anthropic cookbook /
engineering post (35% figure). (Re-verify the 35% and the source URL during draft.)

---

## 9. Part 15 — Adaptive RAG (Frontier-Track close)

**One-liner:** a small complexity classifier routes each query to no-retrieval / single-step /
multi-step retrieval — don't pay for retrieval an easy query doesn't need, don't under-retrieve a hard
one. Unifies the pipelines from Parts 6–10.

**Learning objectives:** articulate why one fixed pipeline over- or under-serves queries; build a tiny
complexity classifier; route to the right pipeline; distinguish this (route by *complexity*) from Part
8 (query transforms) and Part 10 (route by *source*).

**Section outline:**
1. **One pipeline doesn't fit every query** — "what's our refund window?" vs "compare the refund
   windows across our three regional policies and explain the exception" need different machinery.
2. **Three routes** — no-retrieval (model already knows / chit-chat), single-step retrieve→generate
   (Part 6), multi-step decompose→retrieve→generate (Part 10 style).
3. **The complexity classifier** — a tiny deterministic rule/keyword classifier (real-model classifier
   mentioned as the production path, behind the fallback). What signals complexity.
4. **Routing among the pipelines we already built** — this is the payoff: Adaptive RAG is the
   conductor over Parts 6–10. Explicitly contrast with Part 8 (transforms the query) and Part 10
   (routes by knowledge source, not difficulty).
5. **What it buys / honest caveats** — latency/cost saved on easy queries, quality kept on hard ones;
   the ~35% latency / ~28% cost figures are **indicative/vendor**, framed as such, not hard claims;
   the classifier itself is a failure surface (misroute → under-retrieval).
6. **From experience** callout (real anecdote + invisible swap marker).
7. **Key takeaways / Glossary.**
8. **Frontier-Track close** — light send-off ending the track (not a second finale); point back to the
   capstone in Part 12 and "now go build."

**Code artifact** `part-15-adaptive-rag/adaptive_rag.py` (+ `.ipynb` + `README.md`):
- `classify_complexity(query)` → `{none, single, multi}` via deterministic rules/keywords (length,
  conjunctions, comparatives, question count, explicit "compare/and/then").
- `route(query)` dispatching to a no-retrieval answer, a single-step retrieve→generate, or a
  multi-step decompose→retrieve→generate, reusing the earlier pipeline shapes.
- Run a handful of example queries of each complexity and print the chosen route + answer. Offline,
  deterministic, Expected-output block.

**Figures:**
- Interactive `part15-complexity-router.html`: pick a query (3 examples per complexity), watch the
  classifier route it; the chosen path lights up end-to-end. Stepped-player or scenario toggle.
- SVG `part15-routing-map.svg`: one query → classifier → three paths (no-retrieval / single-step=Part 6 / multi-step=Part 10).
- SVG `part15-cost-vs-complexity.svg`: flat over-retrieval vs adaptive (cost/latency saved on easy,
  quality kept on hard).

**Citations:** Adaptive-RAG — NAACL 2024, arXiv 2403.14403. (Cost/latency % framed indicative.)

---

## 10. Part 11 additions (surgical edits to the shipped essay + new repo file)

**Edit target:** `src/content/essays/evaluating-rag.mdx` — **do not** change its `date` or
`seriesOrder` (it stays Part 11, dated 2026-06-17, in place in the ribbon). Add two new sections near
the end, before `## Key takeaways`, framed as "two 2026 questions every RAG evaluator now faces."

**Section D — Long-context vs RAG, head-to-head:**
- The honest answer to the "RAG is dead because context windows are huge now" hype.
- Setup: a **synthetic fictional corpus + inserted needles** (Starlight Academy / U-NIAH style) so the
  model's pretrained knowledge can't leak the answer. Compare LLM-alone (stuff everything in context)
  vs top-k retrieval on accuracy / cost / latency.
- Framing: the *debate* is real; the answer is "it depends" (corpus size, query type, budget) — **not**
  "RAG is dead." Self-Route (route between the two) as the pragmatic synthesis.
- Citations: U-NIAH (arXiv 2503.00353), Self-Route (EMNLP 2024, arXiv 2407.16833), LaRA (ICML 2025).

**Section E — RAGCap-Bench sidebar (clearly marked frontier / medium-confidence):**
- A short callout/sidebar, not a full section: decompose agentic RAG into intermediate capabilities
  (planning, evidence extraction, grounded reasoning, noise robustness); intermediate scores predict
  end-to-end QA. Explicitly flagged as recent/single-source — a frontier pointer, not settled canon.
- Citation: RAGCap-Bench (arXiv 2510.13910). No figure.

**New runnable artifact** `part-11-evaluating-rag/long_context_vs_rag.py` (+ `long_context_vs_rag.ipynb`):
- Pure numpy / stdlib. Build a small synthetic fictional corpus with a few inserted needles; score
  LLM-alone (everything in context) vs top-k retrieval by **substring match** on the needle; print an
  accuracy/cost(token-count)/latency(proxy) table. Offline, deterministic, Expected-output block.
- Kept **separate** from `rag_eval.py` (which stays byte-identical to its verified, site-mirrored
  copy). Root README: note the extra experiment on the Part 11 row (or a sub-bullet); keep one row.

**New figure:** SVG `part11-longcontext-vs-rag.svg` in `public/essays/evaluating-rag/` — the
accuracy/cost/latency tradeoff as corpus size grows (RAG flat-ish, long-context rising cost / lost-in-
the-middle accuracy dip). E gets no figure. No new interactive for Part 11 (it's an edit, not a new
part; reuse the existing scenario-toggle aesthetic only if a figure is genuinely warranted).

**Important:** `evaluating-rag.mdx` is already merged and mirrored. The new `long_context_vs_rag.py`
must NOT be referenced by an inline download link that expects a byte-identical site copy unless we
also drop that copy under `public/essays/evaluating-rag/`. Default: link it via the existing
`codeUrl` (the part folder) only; add a site copy only if we add an inline `.py` download link.

---

## 11. Integration & delivery

**rag-by-hand (`/home/ubuntu/Desktop/rag-by-hand`):**
- New `part-13-late-interaction/`, `part-14-context-aware-chunking/`, `part-15-adaptive-rag/`, each
  with main `.py` + `.ipynb` + `README.md`.
- Extend `part-11-evaluating-rag/` with `long_context_vs_rag.py` + `long_context_vs_rag.ipynb`.
- Root `README.md`: 3 new rows (Code / Notebook / Essay + Colab badge in each notebook's cell 0) and a
  note on the Part 11 experiment. Update the architecture/curriculum prose only as needed.
- `requirements.txt`: add deps grouped by part only if introduced (expected: none new).
- Commit to `main` (no Claude trailer). **Confirm with user before push.**

**Site (`/home/ubuntu/Desktop/mefby-main`):**
- New `src/content/essays/<slug>.mdx` × 3 with full frontmatter (`codeUrl` → the new repo part folder,
  `ogImage: /og/rag-by-hand.png`, `seriesOrder`, `lang: "en"`).
- Assets under `public/essays/<slug>/` (2 SVGs + 1 interactive HTML each; `partN-` prefix). New
  `part11-longcontext-vs-rag.svg` under `public/essays/evaluating-rag/`.
- Edit `src/content/essays/evaluating-rag.mdx` (D + E) and `src/content/essays/rag-in-production.mdx`
  (the single Part 12 forward-pointer).
- **`git add` only each change's own files — never `git add -A`** (parallel sessions leave untracked
  WIP: `easa-ai-blog.md`, `docs/superpowers/*`, sibling essay dirs). Do not touch `easa-ai-blog.md`.
  Keep planning/research docs out of the PRs.
- **`npm run build` (astro check + build) must pass** before any PR.

**PR strategy (proposed; refine in plan):** one PR per new part (P13, P14, P15) matching the
established #21/#22/#25/#26 cadence, plus one small PR for the Part 11 additions + the Part 12 pointer.
The **user merges** each. (Alternative: a single "Frontier Track" PR — decide in the plan.)

## 12. Verification (hard gates)

- Every `.py` runs **offline, exit 0**, with no network and no API key (forced fallback path).
- Every `.ipynb` built with `nbformat`, executed top-to-bottom via `nbclient` on **both** the
  real-model path **and** the forced-offline path; fail on any `output_type == 'error'` cell; commit
  **output-free**. (Re)use the `/tmp/nbverify.py`-style verifier.
- `npm run build` passes (astro check + build); `dist/essays/<slug>/index.html` + assets generate;
  home / `/essays` / RSS link the new essays; `/essays` ribbon orders 1→15.
- Interactive HTML is self-contained (no external resources) and includes keyboard + aria-live +
  prefers-reduced-motion.
- **Accuracy re-check during drafting:** re-verify each arXiv ID, venue, and number against the
  research report and (where cheap) a live web check. Honor the avoid-list (§3). Cite conservatively;
  the 35%-only rule for Part 14 is non-negotiable. No SVG/HTML renderer in this env — verify visuals by
  build + source review and ask the user to eyeball the live deploy.

## 13. Suggested implementation orchestration (for the plan, not binding)

Ultracode is on. A sensible structure: establish per-part skeletons, then draft the three new essays +
their code/notebooks in parallel (they're content-independent of each other), stitch the connective
tissue (teasers, Frontier-Track intros, cross-links) in a synthesis pass, adversarially review each
part (accuracy + voice + build), build repo artifacts and verify notebooks on both paths, then
integrate to the site and open PRs. The Part 11 edit + Part 12 pointer is a separate, smaller track.

## 14. Open questions / risks

- **Part 12 pointer placement/wording** — user may veto; default is one `Postscript (2026)` block
  after the send-off.
- **ColPali fidelity** — taught strictly as a mechanism with a toy stand-in; be explicit in the prose
  that no real VLM runs offline, to avoid over-claiming.
- **Numbers** — 154GB→16–25GB (P13), 35% (P14), ~35%/~28% (P15) must be re-verified and framed exactly
  per the research report (the last pair as indicative/vendor).
- **PR granularity** — per-part vs single PR; settle in the plan.
- **Part 11 site `.py` mirror** — only add a `public/essays/evaluating-rag/long_context_vs_rag.py`
  copy if we add an inline download link; otherwise link via `codeUrl` only.
