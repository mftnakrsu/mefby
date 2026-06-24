# Design: `rag-by-hand` — companion code repo for the RAG series

- **Date:** 2026-06-15
- **Status:** Approved (pending spec review)
- **Author:** Meftun Akarsu (with Claude Code)

## Summary

Build a standalone, public GitHub repository — **`rag-by-hand`** — that turns the
12-part "RAG from First Principles" essay series on mefby.com into a complete,
runnable, learn-by-doing codebase. Then surface that repo from the website: a
per-essay **Code ↗** link and a repo banner on the essays index.

This is primarily a *completion-and-packaging* effort: 6 of the 12 parts already
ship runnable Python files (currently living as static download assets under
`public/essays/<slug>/`). The work organizes those into a coherent repo and adds
the 6 remaining artifacts: a conceptual README for Part 1 (its essay is code-free)
and runnable files for Parts 2–5 and 10 (today only inline snippets).

## Goals

1. A clonable, runnable repo where each part maps 1:1 to its essay.
2. Every part a reader can run: `cd part-XX-... && python <file>.py`.
3. Code stays faithful to the published essays (same voice, same examples, no
   contradiction with the prose).
4. The website points readers to the code with minimal, on-brand UI changes.

## Background — current state

- The series is 12 parts (English), all published and merged.
- Existing runnable files (verbatim source of truth), served as downloads from
  the essays:
  - Part 6 `public/essays/build-your-first-rag/rag_app.py` + `requirements.txt`
  - Part 7 `public/essays/retrieval-deep-dive/rag_hybrid.py`
  - Part 8 `public/essays/making-retrieval-smarter/rag_rerank.py`
  - Part 9 `public/essays/advanced-retrieval-patterns/rag_parent_document.py`
  - Part 11 `public/essays/evaluating-rag/rag_eval.py`
  - Part 12 `public/essays/rag-in-production/rag_production.py`
- Part 1 is conceptual (no code); Parts 2–5 and 10 have inline code only (no
  standalone file).
- The website is an Astro 5 static site; essays are MDX validated by a Zod schema
  in `src/content/config.ts` and rendered via `src/layouts/EssayLayout.astro`.

## Locked decisions

| Decision | Choice |
|---|---|
| Repo home | New standalone **public** repo `github.com/mftnakrsu/rag-by-hand` |
| Scope | Complete all 12 parts (organize 6 existing + write 6 new) |
| Website surfacing | Per-essay `Code ↗` link + repo banner on `/essays` |
| Code style | Framework-free, one standalone file per part, heavily commented, corpus inline (matches existing `rag_app.py` style) |
| LLM provider in examples | Keep OpenAI `gpt-4o-mini` active + commented Ollama; **add** a commented Anthropic/Claude variant (additive, no contradiction with prose) |
| License | MIT |

## Repo structure

```
rag-by-hand/
├── README.md                       # curriculum table: part → essay link + code link + run cmd; setup; philosophy
├── LICENSE                         # MIT
├── requirements.txt                # superset of deps, grouped by part in comments
├── .gitignore                      # Python
├── part-01-why-rag/
│   └── README.md                   # conceptual (essay is code-free): the pipeline in words
├── part-02-embeddings/
│   └── embeddings.py               # NEW
├── part-03-measuring-similarity/
│   └── similarity.py               # NEW
├── part-04-vector-databases/
│   └── vector_db.py                # NEW
├── part-05-chunking/
│   └── chunking.py                 # NEW
├── part-06-build-your-first-rag/
│   ├── rag_app.py                  # existing (copied verbatim)
│   └── requirements.txt            # existing (copied verbatim)
├── part-07-retrieval-deep-dive/
│   └── rag_hybrid.py               # existing (copied verbatim)
├── part-08-making-retrieval-smarter/
│   └── rag_rerank.py               # existing (copied verbatim)
├── part-09-advanced-retrieval-patterns/
│   └── rag_parent_document.py      # existing (copied verbatim)
├── part-10-advanced-architectures/
│   └── corrective_rag.py           # NEW (runnable CRAG + agentic skeleton)
├── part-11-evaluating-rag/
│   └── rag_eval.py                 # existing (copied verbatim)
└── part-12-rag-in-production/
    └── rag_production.py           # existing (copied verbatim)
```

**Source-of-truth note:** The 6 existing files stay in `public/essays/` untouched
(so current inline download links keep working). The repo holds **verbatim
copies**. These are duplicated by design; the copy step is mechanical so drift is
avoided. The 6 new artifacts live only in the repo.

## Per-part content plan

Each new file is derived directly from its essay's inline snippets and key
concepts, written in the same teaching voice (module docstring with Stack/Run
notes, numbered step comments, cross-references like "the trick from Part 3").
Each is runnable standalone and, where a model would be needed, ships a
transparent no-API-key fallback so it runs offline (the pattern the existing
essays already use).

| Part | Folder | File | Status | Core contents |
|---|---|---|---|---|
| 1 | part-01-why-rag | README.md | NEW | Conceptual: four LLM limits, retrieve-augment-generate, two-phase pipeline. No code (mirrors essay). |
| 2 | part-02-embeddings | embeddings.py | NEW | one-hot & bag-of-words baselines; `SentenceTransformer` encode; query+chunk in one space; `king−man+woman` arithmetic demo. |
| 3 | part-03-measuring-similarity | similarity.py | NEW | euclidean / dot / cosine / L2-normalize / top-k; worked numbers (`A=[3,4],B=[4,3]→0.96`) as runnable `assert`s. numpy-only. |
| 4 | part-04-vector-databases | vector_db.py | NEW | brute-force top-k; `recall@k`; HNSW-style layered search; IVF k-means; PQ sketch; brute-vs-ANN benchmark. numpy-only. |
| 5 | part-05-chunking | chunking.py | NEW | fixed-size; recursive; structure-aware; semantic; sliding-window overlap; metadata enrichment. |
| 6 | part-06-build-your-first-rag | rag_app.py (+reqs) | EXISTING | retrieve-augment-generate; local embeddings; numpy store; swappable `generate()`. |
| 7 | part-07-retrieval-deep-dive | rag_hybrid.py | EXISTING | BM25; min-max norm; weighted fusion; RRF; hybrid run. |
| 8 | part-08-making-retrieval-smarter | rag_rerank.py | EXISTING | cross-encoder rerank; two-stage retrieve-then-rerank; metadata filter. |
| 9 | part-09-advanced-retrieval-patterns | rag_parent_document.py | EXISTING | parent-document retrieval; child→parent map; search-small-return-big. |
| 10 | part-10-advanced-architectures | corrective_rag.py | NEW | runnable CRAG loop (retrieve→grade→correct/retry→grounded refusal) + agentic-ReAct skeleton; fallback scorer. |
| 11 | part-11-evaluating-rag | rag_eval.py | EXISTING | context recall; faithfulness judge; diagnose; offline eval loop. |
| 12 | part-12-rag-in-production | rag_production.py | EXISTING | semantic cache; no-context guard; prompt-injection walling. |

## LLM provider strategy

`generate()` in `rag_app.py` (and any new file that generates) keeps:

1. **OpenAI `gpt-4o-mini`** — active (matches essay prose).
2. **Ollama `llama3.1`** — commented alternative (matches essay prose).
3. **Anthropic / Claude** — NEW commented alternative, added alongside Ollama.

Adding #3 is additive: the active code path and the essay text stay identical, so
no published essay is contradicted. The repo README notes all three options.

## Website integration

Minimal, on-brand changes in the **website** repo (this repo):

1. **Schema** — add an optional `codeUrl: z.string().url().optional()` to the
   essays collection in `src/content/config.ts`.
2. **EssayLayout** — when `codeUrl` is set, render a small `Code ↗` pill in the
   header row next to the EN·TR toggle. Wire `codeUrl` through from
   `src/pages/essays/[...slug].astro`.
3. **Essays index** — add a one-line "Full code on GitHub ↗" banner to
   `src/pages/essays/index.astro` linking the repo root.
4. **Frontmatter** — set `codeUrl` on all 12 RAG essays to their part folder:

   | Essay slug | codeUrl (→ `…/rag-by-hand/tree/main/…`) |
   |---|---|
   | why-rag-exists | part-01-why-rag |
   | embeddings | part-02-embeddings |
   | measuring-similarity | part-03-measuring-similarity |
   | vector-databases | part-04-vector-databases |
   | documents-and-chunking | part-05-chunking |
   | build-your-first-rag | part-06-build-your-first-rag |
   | retrieval-deep-dive | part-07-retrieval-deep-dive |
   | making-retrieval-smarter | part-08-making-retrieval-smarter |
   | advanced-retrieval-patterns | part-09-advanced-retrieval-patterns |
   | advanced-rag-architectures | part-10-advanced-architectures |
   | evaluating-rag | part-11-evaluating-rag |
   | rag-in-production | part-12-rag-in-production |

   Base URL: `https://github.com/mftnakrsu/rag-by-hand/tree/main/<folder>`.
   Non-RAG essays are unaffected (field is optional).

## Build & publish workflow

1. Build the repo locally in a scratch directory (structure + copied files + new files + README/LICENSE/requirements).
2. Verify: stdlib/numpy files run offline; files needing `sentence-transformers`
   are smoke-tested via import + fallback logic. `astro check` for website changes.
3. Create the public repo with `gh` (account `mftnakrsu` is authenticated) and
   push. **Confirm with the user immediately before the repo is made public.**
4. Wire the website links (schema, layout, index banner, frontmatter), `astro check`, open a PR on the website repo.

## Verification / success criteria

- All 12 part folders exist; each new `.py` runs without an internet connection or API key (fallback paths).
- Existing files in the repo are byte-identical to their `public/essays/` originals.
- README curriculum table links each part to both its essay and its code.
- Website builds clean (`npm run build` / `astro check`); `Code ↗` appears only on the 12 RAG essays; index banner links the repo.
- No existing essay download link is broken.

## Out of scope (YAGNI)

- Converting the per-part files into an installable pip package.
- A dedicated series landing page (chose per-essay link + banner instead).
- Adding new download assets for parts 2–5/10 into `public/` (repo is the home).
- Translating the repo/README to Turkish (can be a later pass).
- CI for the code repo (tests/linters) — not required for a teaching repo v1.

## Open questions

None blocking. The only gated action is making the GitHub repo public, which will
be confirmed with the user at that step.
