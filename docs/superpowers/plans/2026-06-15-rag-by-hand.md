# rag-by-hand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a standalone public GitHub repo (`rag-by-hand`) that turns the 12-part "RAG from First Principles" essay series into runnable, framework-free code, and surface it from mefby.com via a per-essay `Code ↗` link and a repo banner.

**Architecture:** Two independent work streams. **Stream A** assembles the repo in a fresh directory `/home/ubuntu/Desktop/rag-by-hand/` — copying the 6 existing runnable files verbatim from `public/essays/`, placing the 6 already-authored-and-verified new artifacts from `/home/ubuntu/Desktop/rag-by-hand-draft/`, adding README/LICENSE/requirements, then creating + pushing the GitHub repo. **Stream B** edits the Astro website (this repo, branch `feat/rag-by-hand`) to add an optional `codeUrl` field and render it. Stream B can be done before or after Stream A; the `codeUrl` values are known in advance.

**Tech Stack:** Python 3.12 + NumPy (repo code, no test runner — verification is "run the file, expect exit 0" + `py_compile`); Astro 5 + Zod + Tailwind (website, verified with `astro check`); `gh` CLI (already authenticated as `mftnakrsu`) for repo creation.

**Verification note:** This codebase has no test runner/linter (per CLAUDE.md). TDD's red-green loop is adapted: for Python files the "test" is executing the file offline and asserting exit 0 (the new files already embed `assert`s on the essays' worked examples); for website changes the "test" is `astro check` passing plus `grep` confirming the rendered wiring.

**Pre-verified inputs (already on disk):**
- Existing runnable files (copy sources): `public/essays/{build-your-first-rag/rag_app.py, build-your-first-rag/requirements.txt, retrieval-deep-dive/rag_hybrid.py, making-retrieval-smarter/rag_rerank.py, advanced-retrieval-patterns/rag_parent_document.py, evaluating-rag/rag_eval.py, rag-in-production/rag_production.py}`
- New artifacts authored + run offline (exit 0 confirmed): `/home/ubuntu/Desktop/rag-by-hand-draft/{part-01-why-rag/README.md, part-02-embeddings/embeddings.py, part-03-measuring-similarity/similarity.py, part-04-vector-databases/vector_db.py, part-05-chunking/chunking.py, part-10-advanced-architectures/corrective_rag.py}`

**Slug → part-folder map (used by Stream A folders and Stream B `codeUrl`):**

| Essay slug | Part folder |
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

Repo URL base: `https://github.com/mftnakrsu/rag-by-hand/tree/main/<part-folder>`

---

## Stream A — Build & publish the `rag-by-hand` repo

### Task A1: Scaffold the repo directory, .gitignore, and LICENSE

**Files:**
- Create: `/home/ubuntu/Desktop/rag-by-hand/` and the 12 part folders
- Create: `/home/ubuntu/Desktop/rag-by-hand/.gitignore`
- Create: `/home/ubuntu/Desktop/rag-by-hand/LICENSE`

- [ ] **Step 1: Create the directory tree**

Run:
```bash
cd /home/ubuntu/Desktop
mkdir -p rag-by-hand/{part-01-why-rag,part-02-embeddings,part-03-measuring-similarity,part-04-vector-databases,part-05-chunking,part-06-build-your-first-rag,part-07-retrieval-deep-dive,part-08-making-retrieval-smarter,part-09-advanced-retrieval-patterns,part-10-advanced-architectures,part-11-evaluating-rag,part-12-rag-in-production}
```

- [ ] **Step 2: Write `.gitignore`**

```gitignore
__pycache__/
*.py[cod]
.venv/
venv/
.env
.DS_Store
*.egg-info/
.ipynb_checkpoints/
```

- [ ] **Step 3: Write `LICENSE` (MIT)**

```text
MIT License

Copyright (c) 2026 Meftun Akarsu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 4: Verify the tree exists**

Run: `find /home/ubuntu/Desktop/rag-by-hand -maxdepth 1 | sort`
Expected: 12 `part-*` directories plus `.gitignore` and `LICENSE`.

---

### Task A2: Copy the 6 existing runnable files verbatim

**Files:**
- Copy into: `part-06-build-your-first-rag/rag_app.py`, `part-06-build-your-first-rag/requirements.txt`, `part-07-retrieval-deep-dive/rag_hybrid.py`, `part-08-making-retrieval-smarter/rag_rerank.py`, `part-09-advanced-retrieval-patterns/rag_parent_document.py`, `part-11-evaluating-rag/rag_eval.py`, `part-12-rag-in-production/rag_production.py`

- [ ] **Step 1: Copy each file from `public/essays/` to its part folder**

Run:
```bash
SRC=/home/ubuntu/Desktop/mefby-main/public/essays
DST=/home/ubuntu/Desktop/rag-by-hand
cp "$SRC/build-your-first-rag/rag_app.py"               "$DST/part-06-build-your-first-rag/rag_app.py"
cp "$SRC/build-your-first-rag/requirements.txt"         "$DST/part-06-build-your-first-rag/requirements.txt"
cp "$SRC/retrieval-deep-dive/rag_hybrid.py"             "$DST/part-07-retrieval-deep-dive/rag_hybrid.py"
cp "$SRC/making-retrieval-smarter/rag_rerank.py"        "$DST/part-08-making-retrieval-smarter/rag_rerank.py"
cp "$SRC/advanced-retrieval-patterns/rag_parent_document.py" "$DST/part-09-advanced-retrieval-patterns/rag_parent_document.py"
cp "$SRC/evaluating-rag/rag_eval.py"                    "$DST/part-11-evaluating-rag/rag_eval.py"
cp "$SRC/rag-in-production/rag_production.py"           "$DST/part-12-rag-in-production/rag_production.py"
```

- [ ] **Step 2: Verify byte-identical copies**

Run:
```bash
SRC=/home/ubuntu/Desktop/mefby-main/public/essays
DST=/home/ubuntu/Desktop/rag-by-hand
diff "$SRC/build-your-first-rag/rag_app.py" "$DST/part-06-build-your-first-rag/rag_app.py" && \
diff "$SRC/retrieval-deep-dive/rag_hybrid.py" "$DST/part-07-retrieval-deep-dive/rag_hybrid.py" && \
diff "$SRC/making-retrieval-smarter/rag_rerank.py" "$DST/part-08-making-retrieval-smarter/rag_rerank.py" && \
diff "$SRC/advanced-retrieval-patterns/rag_parent_document.py" "$DST/part-09-advanced-retrieval-patterns/rag_parent_document.py" && \
diff "$SRC/evaluating-rag/rag_eval.py" "$DST/part-11-evaluating-rag/rag_eval.py" && \
diff "$SRC/rag-in-production/rag_production.py" "$DST/part-12-rag-in-production/rag_production.py" && \
echo "ALL IDENTICAL"
```
Expected: `ALL IDENTICAL` (no diff output).

- [ ] **Step 3: Smoke-test the zero-dependency existing files run offline**

Run: `python3 /home/ubuntu/Desktop/rag-by-hand/part-11-evaluating-rag/rag_eval.py >/dev/null && python3 /home/ubuntu/Desktop/rag-by-hand/part-12-rag-in-production/rag_production.py >/dev/null && echo OK`
Expected: `OK` (these two are standard-library-only per the essays; the others require sentence-transformers and are not run here).

---

### Task A3: Add the commented Anthropic/Claude `generate()` variant to the repo's `rag_app.py`

**Files:**
- Modify: `/home/ubuntu/Desktop/rag-by-hand/part-06-build-your-first-rag/rag_app.py` (insert after the existing Ollama comment block, before the `Step 7` section)

This is additive — the active `generate()` (OpenAI) and every line the essay shows stay unchanged; we only append a third commented backend after the existing Ollama one. Syntax is the current Anthropic Messages API (`model="claude-opus-4-8"`, `max_tokens` required, no `temperature` — removed on Opus 4.8; `resp.content[0].text`).

- [ ] **Step 1: Insert the Claude comment block**

Find this existing block (the Ollama alternative, ending around line 117):
```python
# Local, zero-cost alternative (Ollama). Swap this in for generate() above:
#
# def generate(prompt):
#     import requests
#     r = requests.post(
#         "http://localhost:11434/api/generate",
#         json={"model": "llama3.1", "prompt": prompt, "stream": False},
#     )
#     return r.json()["response"]
```

Immediately after it, add:
```python


# Anthropic / Claude alternative. Swap this in for generate() above:
#
# def generate(prompt):
#     from anthropic import Anthropic
#     client = Anthropic()                        # reads ANTHROPIC_API_KEY from the env
#     resp = client.messages.create(
#         model="claude-opus-4-8",                # check current model names
#         max_tokens=1024,                        # required by the Messages API
#         messages=[{"role": "user", "content": prompt}],
#     )                                           # (no temperature: removed on Opus 4.8)
#     return resp.content[0].text
```

- [ ] **Step 2: Verify the file still parses**

Run: `python3 -m py_compile /home/ubuntu/Desktop/rag-by-hand/part-06-build-your-first-rag/rag_app.py && echo OK`
Expected: `OK` (the addition is comments only, so this confirms no accidental code edit).

---

### Task A4: Place the 6 verified new artifacts and re-verify they run

**Files:**
- Copy into: `part-01-why-rag/README.md`, `part-02-embeddings/embeddings.py`, `part-03-measuring-similarity/similarity.py`, `part-04-vector-databases/vector_db.py`, `part-05-chunking/chunking.py`, `part-10-advanced-architectures/corrective_rag.py`

These were authored from the essays and already run offline (exit 0). This task moves them into the repo and re-confirms.

- [ ] **Step 1: Copy the new artifacts from the draft dir**

Run:
```bash
D=/home/ubuntu/Desktop/rag-by-hand-draft
R=/home/ubuntu/Desktop/rag-by-hand
cp "$D/part-01-why-rag/README.md"                      "$R/part-01-why-rag/README.md"
cp "$D/part-02-embeddings/embeddings.py"              "$R/part-02-embeddings/embeddings.py"
cp "$D/part-03-measuring-similarity/similarity.py"   "$R/part-03-measuring-similarity/similarity.py"
cp "$D/part-04-vector-databases/vector_db.py"        "$R/part-04-vector-databases/vector_db.py"
cp "$D/part-05-chunking/chunking.py"                 "$R/part-05-chunking/chunking.py"
cp "$D/part-10-advanced-architectures/corrective_rag.py" "$R/part-10-advanced-architectures/corrective_rag.py"
```

- [ ] **Step 2: Run each new Python file offline and assert exit 0**

Run:
```bash
R=/home/ubuntu/Desktop/rag-by-hand
set -e
for f in part-02-embeddings/embeddings.py part-03-measuring-similarity/similarity.py part-04-vector-databases/vector_db.py part-05-chunking/chunking.py part-10-advanced-architectures/corrective_rag.py; do
  python3 "$R/$f" >/dev/null && echo "PASS $f"
done
```
Expected: five `PASS` lines, no traceback.

- [ ] **Step 3: Remove any `__pycache__` created by the runs**

Run: `find /home/ubuntu/Desktop/rag-by-hand -name __pycache__ -type d -exec rm -rf {} + 2>/dev/null; echo done`
Expected: `done`

---

### Task A5: Write `requirements.txt`

**Files:**
- Create: `/home/ubuntu/Desktop/rag-by-hand/requirements.txt`

- [ ] **Step 1: Write the file**

```text
# rag-by-hand — dependencies, grouped by part.
# Pinning is omitted for learning; pin versions for anything real.

# The math throughout (Parts 2-9). These parts run offline, no API key.
numpy

# Part 2 (real embeddings) and Parts 6, 8 (local models): sentence-transformers.
# Parts 2-5 fall back to a transparent pure-Python stand-in if it's absent.
sentence-transformers

# Part 6 generation — pick ONE provider (all optional):
openai          # hosted; the default generate() in rag_app.py
anthropic       # hosted; the Claude variant of generate()
requests        # only for the local Ollama generation path

# Part 6 "real vector database" upgrade section:
chromadb
```

- [ ] **Step 2: Verify**

Run: `test -s /home/ubuntu/Desktop/rag-by-hand/requirements.txt && echo OK`
Expected: `OK`

---

### Task A6: Write the top-level `README.md`

**Files:**
- Create: `/home/ubuntu/Desktop/rag-by-hand/README.md`

- [ ] **Step 1: Write the README**

````markdown
# rag-by-hand

Build a Retrieval-Augmented Generation system from first principles — one runnable
Python file per concept, no frameworks hiding the moving parts. Companion code for
the 12-part **RAG from First Principles** series on
[mefby.com](https://www.mefby.com/essays).

> "Build it by hand, understand every line."

Each folder maps 1:1 to an essay. The early parts (2–5) are pure NumPy / standard
library and run offline with no API key. Part 6 assembles them into a working
"chat with your documents" app; Parts 7–12 layer on hybrid retrieval, reranking,
advanced patterns, evaluation, and production hardening.

## The series

| Part | Topic | Code | Essay |
|---|---|---|---|
| 1 | Why RAG Exists | [part-01-why-rag](part-01-why-rag/) (concept) | [read](https://www.mefby.com/essays/why-rag-exists) |
| 2 | Embeddings | [embeddings.py](part-02-embeddings/embeddings.py) | [read](https://www.mefby.com/essays/embeddings) |
| 3 | Measuring Similarity | [similarity.py](part-03-measuring-similarity/similarity.py) | [read](https://www.mefby.com/essays/measuring-similarity) |
| 4 | Vector Databases & Indexing | [vector_db.py](part-04-vector-databases/vector_db.py) | [read](https://www.mefby.com/essays/vector-databases) |
| 5 | Documents & Chunking | [chunking.py](part-05-chunking/chunking.py) | [read](https://www.mefby.com/essays/documents-and-chunking) |
| 6 | Build Your First RAG | [rag_app.py](part-06-build-your-first-rag/rag_app.py) | [read](https://www.mefby.com/essays/build-your-first-rag) |
| 7 | Retrieval Deep Dive | [rag_hybrid.py](part-07-retrieval-deep-dive/rag_hybrid.py) | [read](https://www.mefby.com/essays/retrieval-deep-dive) |
| 8 | Making Retrieval Smarter | [rag_rerank.py](part-08-making-retrieval-smarter/rag_rerank.py) | [read](https://www.mefby.com/essays/making-retrieval-smarter) |
| 9 | Advanced Retrieval Patterns | [rag_parent_document.py](part-09-advanced-retrieval-patterns/rag_parent_document.py) | [read](https://www.mefby.com/essays/advanced-retrieval-patterns) |
| 10 | Advanced RAG Architectures | [corrective_rag.py](part-10-advanced-architectures/corrective_rag.py) | [read](https://www.mefby.com/essays/advanced-rag-architectures) |
| 11 | Evaluating RAG | [rag_eval.py](part-11-evaluating-rag/rag_eval.py) | [read](https://www.mefby.com/essays/evaluating-rag) |
| 12 | RAG in Production | [rag_production.py](part-12-rag-in-production/rag_production.py) | [read](https://www.mefby.com/essays/rag-in-production) |

## Quick start

```bash
git clone https://github.com/mftnakrsu/rag-by-hand
cd rag-by-hand
pip install -r requirements.txt

# Parts 2–5 run offline, no API key:
python part-03-measuring-similarity/similarity.py

# Part 6 — the full app. Set one provider (below), then:
python part-06-build-your-first-rag/rag_app.py
```

## LLM providers

The generation step (Part 6 onward) is isolated behind a single `generate(prompt)`
function so the provider is a one-line swap. Three backends are shown:
**OpenAI** (the default), **Ollama** (local, free, no key), and
**Anthropic / Claude**. Set the matching API key — or run Ollama locally — and
swap the function body. The retrieval, chunking, and similarity code is provider-
agnostic and needs no key at all.

## License

MIT — see [LICENSE](LICENSE).
````

- [ ] **Step 2: Verify all README code-links resolve to real files**

Run:
```bash
cd /home/ubuntu/Desktop/rag-by-hand
for p in part-01-why-rag/README.md part-02-embeddings/embeddings.py part-03-measuring-similarity/similarity.py part-04-vector-databases/vector_db.py part-05-chunking/chunking.py part-06-build-your-first-rag/rag_app.py part-07-retrieval-deep-dive/rag_hybrid.py part-08-making-retrieval-smarter/rag_rerank.py part-09-advanced-retrieval-patterns/rag_parent_document.py part-10-advanced-architectures/corrective_rag.py part-11-evaluating-rag/rag_eval.py part-12-rag-in-production/rag_production.py; do
  test -f "$p" || echo "MISSING: $p"
done; echo "checked"
```
Expected: `checked` with no `MISSING` lines.

---

### Task A7: Initialize git and make the initial commit

**Files:**
- Create: `/home/ubuntu/Desktop/rag-by-hand/.git/`

- [ ] **Step 1: Init, stage, commit**

Run:
```bash
cd /home/ubuntu/Desktop/rag-by-hand
git init -b main
git add .
git -c user.name="mftnakrsu" -c user.email="meftunakrsu@gmail.com" commit -m "$(cat <<'EOF'
Initial commit: RAG from First Principles, parts 1-12

Runnable, framework-free companion code for the 12-part series on mefby.com.
Parts 2-5 run offline (NumPy/stdlib); Part 6 assembles a full RAG app;
Parts 7-12 add hybrid retrieval, reranking, advanced patterns, evaluation,
and production hardening.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 2: Verify the commit and file inventory**

Run: `cd /home/ubuntu/Desktop/rag-by-hand && git log --oneline -1 && git ls-files | wc -l && git status --porcelain`
Expected: one commit line; **17** tracked files; clean working tree (no porcelain output).

The 17 files: 4 root (`.gitignore`, `LICENSE`, `requirements.txt`, `README.md`) + 13 part files (`part-01-why-rag/README.md`; `part-02..05` one `.py` each = 4; `part-06` has `rag_app.py` + `requirements.txt` = 2; `part-07..12` one `.py` each = 6). If the count differs, run `git ls-files` and reconcile against Tasks A1–A6 before proceeding.

---

### Task A8: Create the public GitHub repo and push  ⚠️ USER-GATED

**Files:** none local (creates the remote)

- [ ] **Step 1: Confirm with the user before going public**

This is an outward-facing, hard-to-reverse action. Ask the user: "Ready to create the **public** repo `github.com/mftnakrsu/rag-by-hand` and push?" Proceed only on explicit yes. (If they prefer private first, use `--private` and they can flip it later.)

- [ ] **Step 2: Verify `gh` auth, then create + push**

Run:
```bash
cd /home/ubuntu/Desktop/rag-by-hand
gh auth status
gh repo create rag-by-hand --public --source=. --remote=origin --push \
  --description "Build RAG from first principles — runnable, framework-free companion code for the 12-part series on mefby.com"
```
Expected: repo created; `main` pushed; command prints the repo URL.

- [ ] **Step 3: Verify the remote**

Run: `cd /home/ubuntu/Desktop/rag-by-hand && git remote -v && gh repo view --json url,visibility -q '.url + " " + .visibility'`
Expected: `origin` points at `github.com/mftnakrsu/rag-by-hand`; visibility `PUBLIC`.

---

## Stream B — Website integration (repo: mefby-main, branch: feat/rag-by-hand)

### Task B1: Add the optional `codeUrl` field to the essay schema

**Files:**
- Modify: `/home/ubuntu/Desktop/mefby-main/src/content/config.ts`

- [ ] **Step 1: Add the field**

Find:
```ts
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
```
Replace with:
```ts
    tags: z.array(z.string()).default([]),
    // Optional link to the essay's companion code (a folder in the rag-by-hand repo).
    codeUrl: z.string().url().optional(),
    draft: z.boolean().default(false),
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /home/ubuntu/Desktop/mefby-main && npx astro check 2>&1 | tail -5`
Expected: no new errors referencing `config.ts` / `codeUrl` (a clean run, or only pre-existing unrelated warnings).

---

### Task B2: Render a `Code ↗` pill in EssayLayout

**Files:**
- Modify: `/home/ubuntu/Desktop/mefby-main/src/layouts/EssayLayout.astro`

- [ ] **Step 1: Add `codeUrl` to the Props interface and destructuring**

Find:
```ts
interface Props {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  lang?: string;
  translationSlug?: string;
}
const { title, description, date, tags = [], lang = 'en', translationSlug } = Astro.props;
```
Replace with:
```ts
interface Props {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  lang?: string;
  translationSlug?: string;
  codeUrl?: string;
}
const { title, description, date, tags = [], lang = 'en', translationSlug, codeUrl } = Astro.props;
```

- [ ] **Step 2: Render the pill in the header row**

Find the header `<div>` that holds the back link and language nav:
```astro
      <div class="flex items-center justify-between mb-12">
        <a href="/" class="text-xs text-zinc-400 hover:text-emerald-600 transition-colors">&larr; {backLabel}</a>
        {translationSlug && (
          <nav class="flex items-center gap-1" aria-label="Language">
```
Replace the opening of that block (down to and including the `<nav ...>` line) with a wrapper that holds both the code pill and the language nav on the right:
```astro
      <div class="flex items-center justify-between mb-12">
        <a href="/" class="text-xs text-zinc-400 hover:text-emerald-600 transition-colors">&larr; {backLabel}</a>
        <div class="flex items-center gap-2">
          {codeUrl && (
            <a
              href={codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full text-zinc-500 border border-zinc-200 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
              aria-label="View the code for this essay on GitHub"
            >Code <span aria-hidden="true">&#8599;</span></a>
          )}
          {translationSlug && (
          <nav class="flex items-center gap-1" aria-label="Language">
```

- [ ] **Step 3: Close the new wrapper div**

The language `<nav>` currently closes like this:
```astro
            )
            ))}
          </nav>
        )}
      </div>
```
Replace it with (adds `</div>` to close the new flex wrapper):
```astro
            )
            ))}
          </nav>
          )}
        </div>
      </div>
```

- [ ] **Step 4: Verify markup compiles**

Run: `cd /home/ubuntu/Desktop/mefby-main && npx astro check 2>&1 | tail -5`
Expected: no new errors referencing `EssayLayout.astro`.

---

### Task B3: Pass `codeUrl` through from the dynamic route

**Files:**
- Modify: `/home/ubuntu/Desktop/mefby-main/src/pages/essays/[...slug].astro`

- [ ] **Step 1: Forward the prop**

Find:
```astro
<EssayLayout
  title={essay.data.title}
  description={essay.data.description}
  date={essay.data.date}
  tags={essay.data.tags}
  lang={essay.data.lang}
  translationSlug={essay.data.translationSlug}
>
```
Replace with:
```astro
<EssayLayout
  title={essay.data.title}
  description={essay.data.description}
  date={essay.data.date}
  tags={essay.data.tags}
  lang={essay.data.lang}
  translationSlug={essay.data.translationSlug}
  codeUrl={essay.data.codeUrl}
>
```

- [ ] **Step 2: Verify**

Run: `cd /home/ubuntu/Desktop/mefby-main && npx astro check 2>&1 | tail -5`
Expected: no new errors.

---

### Task B4: Add the repo banner to the essays index

**Files:**
- Modify: `/home/ubuntu/Desktop/mefby-main/src/pages/essays/index.astro`

- [ ] **Step 1: Insert the banner above the essay list**

Find:
```astro
      <h1 class="text-2xl font-semibold text-zinc-900 mb-1">Essays</h1>
      <p class="text-sm text-zinc-400 mb-10">{essays.length} essays · available in English &amp; Türkçe</p>

      <ul class="border-t border-zinc-100">
```
Replace with:
```astro
      <h1 class="text-2xl font-semibold text-zinc-900 mb-1">Essays</h1>
      <p class="text-sm text-zinc-400 mb-10">{essays.length} essays · available in English &amp; Türkçe</p>

      <a
        href="https://github.com/mftnakrsu/rag-by-hand"
        target="_blank"
        rel="noopener noreferrer"
        class="group mb-8 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50/60 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
      >
        <span class="text-[13px] text-zinc-600">
          <span class="font-medium text-zinc-900">RAG from First Principles</span> — runnable code for the 12-part series
        </span>
        <span class="shrink-0 text-[11px] font-mono text-zinc-400 group-hover:text-emerald-600">Code on GitHub &#8599;</span>
      </a>

      <ul class="border-t border-zinc-100">
```

- [ ] **Step 2: Verify**

Run: `cd /home/ubuntu/Desktop/mefby-main && npx astro check 2>&1 | tail -5`
Expected: no new errors.

---

### Task B5: Add `codeUrl` frontmatter to the 12 RAG essays

**Files (modify the frontmatter of each):**
- `src/content/essays/why-rag-exists.mdx`
- `src/content/essays/embeddings.mdx`
- `src/content/essays/measuring-similarity.mdx`
- `src/content/essays/vector-databases.mdx`
- `src/content/essays/documents-and-chunking.mdx`
- `src/content/essays/build-your-first-rag.mdx`
- `src/content/essays/retrieval-deep-dive.mdx`
- `src/content/essays/making-retrieval-smarter.mdx`
- `src/content/essays/advanced-retrieval-patterns.mdx`
- `src/content/essays/advanced-rag-architectures.mdx`
- `src/content/essays/evaluating-rag.mdx`
- `src/content/essays/rag-in-production.mdx`

> Only English originals get the link. Do **not** edit the `-tr` translation files (`why-rag-exists-tr.mdx`, etc.) — they are hidden from listings and out of scope. Non-RAG essays (aselsan, easa, graph-rag-language, uav-doctrine) are untouched.

- [ ] **Step 1: Add a `codeUrl:` line to each frontmatter**

In each file, inside the `---` frontmatter block, add a `codeUrl:` line immediately after the `tags:` line (or anywhere within the block). Use the exact value for that slug:

| File | Line to add |
|---|---|
| why-rag-exists.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-01-why-rag'` |
| embeddings.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-02-embeddings'` |
| measuring-similarity.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-03-measuring-similarity'` |
| vector-databases.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-04-vector-databases'` |
| documents-and-chunking.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-05-chunking'` |
| build-your-first-rag.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-06-build-your-first-rag'` |
| retrieval-deep-dive.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-07-retrieval-deep-dive'` |
| making-retrieval-smarter.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-08-making-retrieval-smarter'` |
| advanced-retrieval-patterns.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-09-advanced-retrieval-patterns'` |
| advanced-rag-architectures.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-10-advanced-architectures'` |
| evaluating-rag.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-11-evaluating-rag'` |
| rag-in-production.mdx | `codeUrl: 'https://github.com/mftnakrsu/rag-by-hand/tree/main/part-12-rag-in-production'` |

For each file, read the frontmatter first to find the `tags:` line, then insert the matching `codeUrl:` line after it (match the file's existing quote style if it differs).

- [ ] **Step 2: Verify all 12 are set and no `-tr` file was touched**

Run:
```bash
cd /home/ubuntu/Desktop/mefby-main
grep -rl "codeUrl:" src/content/essays/*.mdx | sort
echo "--- count (expect 12) ---"
grep -rl "codeUrl:" src/content/essays/*.mdx | wc -l
echo "--- must be empty (no -tr files) ---"
grep -rl "codeUrl:" src/content/essays/*-tr.mdx 2>/dev/null
```
Expected: 12 English RAG files listed; count `12`; the last grep prints nothing.

---

### Task B6: Build the site and commit Stream B

**Files:** none new

- [ ] **Step 1: Full build (runs `astro check` + `astro build`)**

Run: `cd /home/ubuntu/Desktop/mefby-main && npm run build 2>&1 | tail -20`
Expected: build completes; `dist/` written; no errors. The 12 essay pages render with the `Code ↗` pill.

- [ ] **Step 2: Spot-check the rendered pill in the built HTML**

Run: `grep -l "rag-by-hand" /home/ubuntu/Desktop/mefby-main/dist/essays/build-your-first-rag/index.html && grep -c "rag-by-hand" /home/ubuntu/Desktop/mefby-main/dist/essays/index.html`
Expected: the essay page path is printed (pill present) and the index shows ≥1 match (banner present).

- [ ] **Step 3: Commit on the feature branch**

Run:
```bash
cd /home/ubuntu/Desktop/mefby-main
git add src/content/config.ts src/layouts/EssayLayout.astro src/pages/essays/index.astro 'src/content/essays/*.mdx' src/pages/essays/'[...slug].astro'
git commit -m "$(cat <<'EOF'
feat(essays): link each RAG essay to its rag-by-hand code

Add an optional codeUrl frontmatter field, render a "Code ↗" pill in the
essay header when set, add a repo banner to the /essays index, and point
all 12 RAG series essays at their part folder in github.com/mftnakrsu/rag-by-hand.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```
Expected: one commit; `dist/` is gitignored so it is not committed (verify with `git status --porcelain` — should be clean except possibly the untracked `easa-ai-blog.md` which is left alone).

---

### Task B7: Push the branch and open a PR  ⚠️ USER-GATED

- [ ] **Step 1: Confirm with the user**, then push + open PR

Run:
```bash
cd /home/ubuntu/Desktop/mefby-main
git push -u origin feat/rag-by-hand
gh pr create --base main --head feat/rag-by-hand \
  --title "Link RAG essays to the rag-by-hand code repo" \
  --body "$(cat <<'EOF'
Adds a per-essay **Code ↗** link and a repo banner on /essays pointing to the new
companion code repo **github.com/mftnakrsu/rag-by-hand** (runnable, framework-free
code for all 12 parts of the RAG series).

- `codeUrl` optional field added to the essay schema
- `Code ↗` pill rendered in EssayLayout when set
- repo banner on the /essays index
- `codeUrl` set on all 12 English RAG essays

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
Expected: branch pushed; PR URL printed.

---

## Self-review — spec coverage

- ✅ New standalone public repo `rag-by-hand` → Tasks A1, A7, A8
- ✅ Complete all 12 parts (6 existing copied + 6 new authored/verified) → A2, A4
- ✅ Framework-free, one runnable file per part, offline-runnable → verified A2/A4
- ✅ LLM provider: OpenAI active + Ollama + new Claude variant → A3
- ✅ Per-essay `Code ↗` link → B1, B2, B3, B5
- ✅ Repo banner on /essays → B4
- ✅ MIT license, requirements, README curriculum mapping to essays → A1, A5, A6
- ✅ Existing `public/essays/` download files left intact (copies, not moves) → A2 (cp, not mv)
- ✅ `-tr` translations untouched → B5 note + verification
- ✅ Public-repo creation gated on user confirmation → A8 step 1; PR gated → B7 step 1
- ✅ Build verified clean → B6
