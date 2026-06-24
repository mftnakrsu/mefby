# RAG from First Principles — Applied Track (Parts 16+) — Design

**Date:** 2026-06-20
**Status:** approved by author ("hepsini yap sırayla", do all in order)
**Repos:** `mefby` (essays + assets), `rag-by-hand` (runnable code + notebooks)

## Origin

A series-wide audit (4-finder workflow + web research on the 2026 frontier) surfaced a
prioritized "what else to add" list. The author approved building all of it, in order. This
spec defines the program. It reuses the locked Frontier-Track conventions (see
`2026-06-15-rag-frontier-track-design.md` and the `rag-series-conventions` memory) verbatim:
per-slug assets under `public/essays/<slug>/`, a `partN-` filename prefix, one self-contained
interactive HTML + two static SVGs per part, a runnable framework-free `.py` + step-by-step
output-free `.ipynb` + `README.md` per part folder in rag-by-hand, the shared design tokens,
em-dash-free essay prose, a `From experience` callout with an invisible author-swap marker,
`What you'll learn / Prerequisites / body / Key takeaways / Glossary / send-off` shape, and
dates one-apart so newest leads. English-only (Parts 6+ convention). No Claude attribution.

## The track

A second extension after the Frontier Track (13-15). Working name: **Applied Track**. The
spine: take the architectures Part 10 only *toured* and the gaps a 2025-era series left open,
and build each one *by hand*. Each part stands alone but cross-links forward.

| Part | Slug | Title | Date | Order | The by-hand build |
|------|------|-------|------|-------|-------------------|
| 16 | `rag-agent` | Building a RAG Agent | 2026-06-22 | 16 | A real reason/act/observe (ReAct) loop: tools (route+retrieve over >1 index, a calculator, finish), a hand-rolled controller, a termination rule; multi-hop falls out. |
| 17 | `conversational-rag` | Conversational RAG | 2026-06-23 | 17 | Multi-turn: query **condensation** (rewrite a follow-up into a standalone query using history), conversation memory, coreference ("what about the blue one?"). |
| 18 | `structured-rag` | RAG over Structured Data | 2026-06-24 | 18 | Route between **vector-over-text** and a deterministic **NL->SQL over a tiny in-memory table**, then reconcile. The series' first non-prose corpus. |
| 19 | `learned-retrieval` | Search Agents that Learn | 2026-06-25 | 19 | Retrieval as a **learned policy**: a toy single-step reward loop (Search-R1 lineage) + iterate-until-confident. Framed on durable substance, NOT "deep research" marketing. |
| 20 | `agent-memory` | Agent Memory | 2026-06-26 | 20 | write / consolidate / forget over a multi-session transcript; RAG-as-memory vs long-context vs managed memory. |
| 21 | `graphrag-by-hand` | GraphRAG by Hand | 2026-06-27 | 21 | LLM entity/relationship extraction + graph traversal; turns Part 10's GraphRAG prose into a build. Caveats the hype (hybrid BM25+vector stays the baseline). |

### Depth edits (fold into the relevant part's own PR, no new slug)

- **Part 11 `evaluating-rag`**: LLM-judge bias caveats (RAGAS<->human correlation ~0.55, a judge-bias taxonomy); a one-line mention of multi-turn (MTRAG) + nugget evaluation.
- **Parts 2 `embeddings` + 8 `making-retrieval-smarter`**: a "state of the models, mid-2026" box (MTEB, dimensionality/cost/latency, Matryoshka, multilingual; name-check Qwen3-Embedding/Reranker, Gemini Embedding, voyage-multimodal). Framed as how-to-choose, with a hard freshness caveat.
- **Part 6 `build-your-first-rag`**: real **citation / inline attribution** output (numbered references + per-sentence "which chunk supports this"), the user-facing payoff of grounding.

## Running example (continuity)

Reuse the support-knowledge-base from Parts 6-12 (refund-policy doc, error-code articles,
the `E-4042` chunk, a product-spec source). Part 16 adds a second tiny source so routing and
multi-hop are real (e.g. a `products.md` with a "made by / acquired by / warranty" chain so
the multi-hop question "what is the warranty on the earbuds made by the company that acquired
Acme?" — the exact example Part 10 used as prose — can finally be *run*).

## Per-part construction pipeline (applied to each part, in order)

1. **Verify** — research/verify any external claim or figure the essay will cite (no hype).
2. **Code** — write the runnable `.py` (framework-free, deterministic offline fallback,
   `generate()` keeps OpenAI + Ollama + a commented `claude-opus-4-8` variant); run it, capture
   expected output.
3. **Artifacts (parallel)** — derive the output-free `.ipynb` (Colab badge, verified on real +
   forced-offline paths); author the 2 SVGs + the interactive HTML on the design tokens; write
   the part README (prev/next/Series-index footer).
4. **Essay** — write `<slug>.mdx` quoting the real code, embedding the 3 figures, em-dash-free.
5. **Review** — adversarial pass for code/essay/figure consistency, citations, em-dash, a11y.
6. **Integrate** — `npm run build` clean; notebook valid+output-free; commit per repo
   (mefby via PR branch; rag-by-hand via PR branch — main pushes are gated).

## Cross-part bookkeeping

- **Part 15 send-off** currently says *"There is no Part 16 to tease ... a light send-off."*
  Update it (the way Part 12 got a postscript) to hand off into the Applied Track, pointing at
  Part 16, without disturbing the core-finale framing of Part 12.
- Each new part teases the next; Part 16-20 each end on a one-line forward teaser; the final
  part (21) gets the Applied-Track light send-off.
- mefby essays cross-link forward, so ship the new essays as **one combined PR** (like #32) so
  no forward link 404s before merge; rag-by-hand parts can ship per-part or batched.

## Out of scope / YAGNI

- No new framework dependencies anywhere; everything stays hand-rolled + offline-runnable.
- No translations (Parts 6+ are intentionally English-only).
- Frontier parts (19-21) carry hype risk; each gets a stricter Verify phase and an honest
  "when NOT to reach for this" section. If research shows a topic is thin/hype, demote it.
