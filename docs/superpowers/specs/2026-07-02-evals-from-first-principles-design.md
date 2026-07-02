# Evals from First Principles — Series Design Spec

**Status:** approved at brainstorm (lineup + scope locked 2026-07-02); this document
is the contract for the per-increment implementation plans that follow.
**Companion repo:** `github.com/mftnakrsu/evals-by-hand` (to be created)
**Series key:** `evals` (third value of the `series` discriminator, after `rag`, `agents`)
**Shape:** 11 core parts + a ~4-part frontier track, bilingual EN + TR, one offline
pure-Python/NumPy notebook per part.

---

## 1. Goal & premise

RAG taught readers to feed knowledge to an LLM. Agents taught them to give it agency.
Neither taught them **how to know any of it works.** This series makes measurement the
third pillar of the implicit curriculum: build every metric, every LLM-as-judge, and
every statistical test **by hand on tiny labeled sets**, so a reader can tell a real 2%
improvement from noise and defend a production rollout with a number instead of a vibe.

The wager (from the ideation workflow `wf_fcfb2503-06f`, top-ranked candidate at 44/50
across three independent judges): evaluation is the **purest fit** for the by-hand
format because the numbers *are* the subject. There is no abstraction to strip away.
A bootstrap CI is resampling 10 rows and re-averaging. Cohen's kappa is four cells and
two products. The unbiased pass@k estimator is one combinatorial identity checkable at
n=5. Elo/Bradley-Terry is a logistic update iterated by pencil. Judge bias (position,
verbosity, self-preference) is demonstrable numerically on a dozen paired comparisons —
which no framework tutorial does. The market is hot but prose/vendor-driven (Hamel
Husain, Eugene Yan, Braintrust/Arize blogs, the Husain–Shankar paid course); **nobody
owns the free trace-the-numbers notebook niche.** The statistics never go stale, so the
series stays relevant for years.

### Decisions locked at design approval (2026-07-02)
1. **Lineup:** 11 core parts + frontier track (§4), as listed. Approved as-is.
2. **Scope of the first pass:** spec + implementation plan only. **No code this pass.**
   Implementation begins after spec review, starting with Increment 0 (Part 0 infra).
3. **Format:** identical to `rag-by-hand` / `agents-by-hand` — bilingual EN+TR essays,
   one companion repo of offline pure-Python + Jupyter notebooks, `<Diagram>` figures.

### Defaults chosen for remaining minor decisions (override at review)
- **Repo name:** `evals-by-hand`. **Series title:** "Evals from First Principles".
- **TR series label:** `DEĞERLENDİRME: İLK İLKELERDEN` (mirrors `RAG: İLK İLKELERDEN`,
  `AJANLAR: İLK İLKELERDEN`).
- **Glossary:** per-series, `/essays/evals-glossary` (clone of `agents-glossary.astro`).
- **OG card:** new `/og/evals-by-hand.png` in the existing visual family.
- **Accent motif:** reuse the site's emerald token set; a distinct data-viz accent for
  score/uncertainty figures is settled per-figure inside each increment (not a blocker).
- **Launch cadence:** Part 1 dated one day after the last Agents part so it leads the
  index cleanly; exact date set at Increment 1 (open item §10).

---

## 2. Relationship to the RAG & Agents series (anti-overlap is load-bearing)

Two single parts already touched evaluation and must be treated as **on-ramps to
generalize, never material to re-teach as new:**

- **RAG Part 8 — "Evaluating RAG"** (`evaluating-rag.mdx`): retrieval-scoped metrics
  (recall@k, MRR, nDCG) and RAG-specific answer quality (faithfulness / context
  precision, RAGAS-style).
- **Agents Part 17 — "Grading the Agent"** (`agent-evaluation.mdx`): trajectory /
  tool-use grading and agent-specific success criteria.

**How this series stays clear of them:**
- It teaches the **general statistical discipline** those two parts assumed but never
  taught: annotator agreement, judge calibration, confidence intervals, significance
  and power, calibration, CI gating. None of that appears in RAG P8 or Agents P17.
- Where a topic legitimately overlaps (RAG retrieval metrics; agent-trajectory grading),
  the series **cross-links back** and goes one level deeper on the *measurement rigor*
  (e.g. "RAG P8 showed you recall@k; here is the confidence interval on it and whether
  your 2-point gain is real"), rather than re-deriving the domain metric.
- Frontier Part 14 (agent-trajectory evals) explicitly **builds on** Agents P17 instead
  of repeating it: same problem, added statistical treatment (trajectory match scoring,
  step-level credit assignment, judge-graded rubrics with agreement).
- The closing harness (Part 15) ties RAG P8 + Agents P17 into one general framework,
  making the two prior parts retroactively feel like appetizers for this series.

This is *deliberate, healthy self-overlap* used as an acquisition funnel — the same move
the Agents series made toward RAG P19/P20 — not accidental duplication.

---

## 3. Pedagogy & runtime model (identical to rag-by-hand / agents-by-hand)

- **Trace every number.** Each concept is instantiated on a set small enough to print:
  10 graded outputs, a 30-item labeled set, a 3×3 confusion of judges, 5 samples for
  pass@k. The reader can reproduce every figure in the essay by running the notebook.
- **Pure Python + NumPy only.** No eval framework (no OpenAI Evals, lm-eval-harness,
  RAGAS, Braintrust, DeepEval), no stats package doing the work for you — SciPy may
  appear once *to check* a hand-derived p-value, never to replace the derivation.
- **Offline & deterministic.** Every `.py` runs top-to-bottom with no API key, no
  network, no dependencies beyond NumPy, and ends with a verified `# Expected output`
  block. The "LLM judge" parts use a deterministic mock judge by default, with an
  optional real-provider path (one swappable `generate()` behind a flag, mirroring the
  other repos) so the traces are reproducible.
- **Notebooks are output-free** and rebuild the `.py` cell-by-cell.
- **One flagship interactive HTML widget + static SVGs** per part under
  `public/essays/<slug>/`, embedded via `<Diagram>` / `<IframeFigure>`.
- **A single running dataset** threads the series: a small labeled set of model outputs
  (question, gold label, candidate answer, human grade) reused from Part 1 onward, so
  each new statistical tool operates on numbers the reader already trusts.

---

## 4. The curriculum (11 core + 4 frontier)

Each part below lists its **premise**, the **by-hand computation** that is its spine
(the thing the reader traces), the **essay slug**, and the **repo folder / file**.
The "PART N OF total" badge is rendered by the layout from `seriesOrder`; total is
computed live, so it grows as parts ship.

### Core track (1–11): from a single score to a defensible CI gate

**Part 1 — What Is a Score?**
Premise: before any statistics, define the atoms — task, gold label, metric — and the
confusion matrix they all come from. By-hand: accuracy, precision, recall, F1 computed
on 10 labeled outputs, every cell of the 2×2 filled in; why accuracy lies under class
imbalance shown numerically. Slug `what-is-a-score` · `part-01-what-is-a-score/scoring_basics.py`.

**Part 2 — Building a Golden Set**
Premise: a metric is only as good as the labeled set under it. By-hand: stratified
sampling on a tiny population (proportions computed), a leakage example that inflates a
score and its fix, and turning a vague quality bar into an operational rubric.
Slug `building-a-golden-set` · `part-02-building-a-golden-set/golden_set.py`.

**Part 3 — Do Humans Even Agree?**
Premise: your labels have noise; measure it before trusting them. By-hand: raw agreement
vs Cohen's kappa on a 2×2 (the chance-correction that turns 90% into 0.6), Fleiss' kappa
for 3 raters, Krippendorff's alpha sketched — all on a printable table.
Slug `annotator-agreement` · `part-03-annotator-agreement/agreement.py`.

**Part 4 — LLM-as-Judge by Hand**
Premise: replace/scale the human grader with a model, and see exactly where it breaks.
By-hand: a rubric prompt, parsing the verdict, the confusion matrix of judge-vs-human on
the golden set, and the failure modes (ties, refusals, format drift) counted.
Slug `llm-as-judge` · `part-04-llm-as-judge/llm_judge.py`.

**Part 5 — Judging the Judge**
Premise: LLM judges have systematic, measurable biases. By-hand: position bias
(swap A/B, count flips), verbosity bias (longer answer wins how often), self-preference,
each demonstrated on a dozen paired comparisons and then *corrected* (randomize order,
average both orderings) with the corrected number shown.
Slug `judging-the-judge` · `part-05-judging-the-judge/judge_bias.py`.

**Part 6 — Uncertainty (Bootstrap CIs)**
Premise: a single score is a point estimate; report the interval. By-hand: the bootstrap
— resample a 30-item set with replacement by hand, recompute the metric, read the 2.5/97.5
percentiles — and why n=30 gives a wide interval you should respect.
Slug `bootstrap-uncertainty` · `part-06-bootstrap-uncertainty/bootstrap_ci.py`.

**Part 7 — Is the Difference Real?**
Premise: A scored 82%, B scored 84% — is B better, or is it noise? By-hand: the paired
comparison, McNemar's test on the discordant pairs, and a power/sample-size calculation
that answers "how many examples do I need to detect a 2-point gain?"
Slug `significance-testing` · `part-07-significance-testing/significance.py`.

**Part 8 — pass@k**
Premise: the code-gen / agent metric everyone quotes and few compute correctly.
By-hand: why naive pass@k is biased, the unbiased estimator derived from the combinatorial
identity, and the whole thing checked against a brute-force count at n=5, k=2.
Slug `pass-at-k` · `part-08-pass-at-k/pass_at_k.py`.

**Part 9 — Arenas (Elo & Bradley-Terry)**
Premise: how leaderboards turn pairwise battles into a single ranking. By-hand: an Elo
update after one match (expected score, K-factor), then the Bradley-Terry MLE iterated a
few steps on 4 models, and why Elo is order-dependent while BT is not.
Slug `arenas-elo-bradley-terry` · `part-09-arenas-elo-bradley-terry/arenas.py`.

**Part 10 — Calibration**
Premise: a model's confidence should mean something. By-hand: bin 10 predictions by
stated confidence, build the reliability curve, compute ECE and the Brier score, and show
what over-confidence looks like numerically.
Slug `calibration` · `part-10-calibration/calibration.py`.

**Part 11 — Regression Gates**
Premise: turn all of the above into a gate you would stake a deploy on. By-hand: an
eval-in-CI decision rule (score + CI vs a threshold), a train/eval contamination check
(n-gram overlap with the eval set), and drift detection across two runs.
Slug `regression-gates` · `part-11-regression-gates/regression_gates.py`.

### Frontier track (12–15): where evals meet production and agents

**Part 12 — The Eval Flywheel**
Premise: your best eval set is your production logs. By-hand: mining traces into labeled
examples, sampling for annotation, and the feedback loop that grows the golden set.
Slug `eval-flywheel` · `part-12-eval-flywheel/flywheel.py`.

**Part 13 — Online Evals**
Premise: offline scores are necessary, not sufficient; measure in production. By-hand:
an A/B test's effect size and significance on a small sample, guardrail metrics, and the
difference between an offline metric and a business guardrail.
Slug `online-evals` · `part-13-online-evals/online_evals.py`.

**Part 14 — Agent-Trajectory Evals** (builds on Agents P17)
Premise: grade the path, not just the final answer. By-hand: trajectory-match scoring,
step-level credit assignment, and a judge-graded rubric over a multi-step transcript with
agreement measured. Explicitly extends Agents P17 rather than repeating it.
Slug `agent-trajectory-evals` · `part-14-agent-trajectory-evals/trajectory_evals.py`.

**Part 15 — A Tiny Eval Harness** (bridges RAG P8 + Agents P17)
Premise: assemble the series into one pure-Python harness — dataset, metric, judge, CI,
gate — that you could actually run, and re-express the RAG P8 and Agents P17 evals inside
it. The capstone that makes the two prior single-parts feel like appetizers.
Slug `eval-harness` · `part-15-eval-harness/eval_harness.py`.

---

## 5. Cross-part seed-vs-harden ladder (so nothing is taught "for real" twice)

The running dataset and each primitive are *seeded* early and *hardened* later, so no
concept is rebuilt from scratch downstream:

- **The golden set** is seeded in P1 (used raw), operationalized in P2, its label noise
  measured in P3, and reused as the substrate for every metric/test P4–P15.
- **The LLM judge** is built in P4, de-biased in P5, given a confidence interval in P6,
  and dropped into the harness in P15.
- **The confidence interval** (P6) becomes the decision unit in P7 (significance), P11
  (the CI-vs-threshold gate), and P13 (A/B effect size).
- **The confusion matrix** (P1) is the shared object behind agreement (P3), judge quality
  (P4), and calibration bins (P10).
- **Contamination / leakage** is seeded as a warning in P2 and hardened into a numeric
  check in P11.

---

## 6. Part 0 — site-infra change (HARD blocker, verified against live code)

Adding a third series is **purely additive** this time — unlike the Agents Part 0, the
routing/layout is already series-aware (`[...slug].astro` groups by `e.data.series` in a
`seriesByKey` map, so `seriesTotal` and prev/next are already per-series). **No backfill
of existing essays is required.** Verified touchpoints and required edits:

**Acceptance checklist (Part 0 ships before any evals essay):**
1. `src/content/config.ts` (line 25): `series: z.enum(['rag', 'agents'])` →
   `z.enum(['rag', 'agents', 'evals'])`. Default stays `'rag'`.
2. `src/layouts/EssayLayout.astro`:
   - Prop type (line ~20) `series?: 'rag' | 'agents'` → add `'evals'`.
   - `SERIES_META` (lines ~32–35): add
     `evals: { en: 'EVALS FROM FIRST PRINCIPLES', tr: 'DEĞERLENDİRME: İLK İLKELERDEN', hub: '/essays/evals' }`.
3. `src/pages/essays/[...slug].astro` (line ~66): widen the og-image fallback from a
   two-way ternary to three-way so `series === 'evals'` → `/og/evals-by-hand.png`.
4. `src/pages/essays/index.astro` (lines ~14–17): add
   `evalsSeries = all.filter(series === 'evals').sort(byOrder)` and splice into the
   `essays` ordering (rag, agents, evals, then rest).
5. `src/pages/index.astro` (home, lines ~14–16 and ~113–135): add `evalsCount` and a
   third course card (clone the agents card, point at `/essays/evals`).
6. New `src/pages/essays/evals.astro` — clone `agents.astro`; scope its collection
   filter to `series === 'evals'`; core = order ≤ 11, frontier = order ≥ 12; update
   copy, the GitHub link to `evals-by-hand`, and the JSON-LD name/description.
7. New `src/pages/essays/evals-glossary.astro` — clone `agents-glossary.astro`, scope to
   `series === 'evals'`, update copy + hub link.
8. Add `public/og/evals-by-hand.png` (same template family as the other two cards).

**Verification:** `npm run build` (runs `astro check`) is green; the `/essays/evals`
hub renders with the Part 1 row once Increment 1 lands; existing RAG/Agents totals and
prev/next are unchanged (regression guard — confirm the RAG "Part X of 20" and Agents
"Part X of N" badges still read correctly).

---

## 7. Repo structure (`evals-by-hand`) and 1:1 essay sync

Mirrors `rag-by-hand` / `agents-by-hand` so a returning reader is instantly at home.

```
evals-by-hand/
  README.md            # one row per part: | Part | Topic | Code | Notebook | Essay | + Colab badges;
                       # offline-runtime preamble; links back to rag-by-hand + agents-by-hand + /essays/evals
  requirements.txt     # numpy; optional scipy (only to CHECK a hand-derived value); optional openai
                       # (commented Ollama + claude fallback) for the real-judge path. Note: TAI PyPI
                       # mirror + pip --break-system-packages on the author's machine.
  LICENSE  .gitignore
  shared/
    dataset.py         # the running labeled set (~30 items: question, gold, candidate, human grade)
    judge.py           # deterministic mock judge + optional swappable generate() (SDK/model-drift NOTE)
  part-01-what-is-a-score/          scoring_basics.py     + .ipynb + README.md
  part-02-building-a-golden-set/    golden_set.py         + .ipynb + README.md
  part-03-annotator-agreement/      agreement.py          + .ipynb + README.md
  part-04-llm-as-judge/             llm_judge.py          + .ipynb + README.md
  part-05-judging-the-judge/        judge_bias.py         + .ipynb + README.md
  part-06-bootstrap-uncertainty/    bootstrap_ci.py       + .ipynb + README.md
  part-07-significance-testing/     significance.py       + .ipynb + README.md
  part-08-pass-at-k/                pass_at_k.py          + .ipynb + README.md
  part-09-arenas-elo-bradley-terry/ arenas.py             + .ipynb + README.md
  part-10-calibration/              calibration.py        + .ipynb + README.md
  part-11-regression-gates/         regression_gates.py   + .ipynb + README.md
  part-12-eval-flywheel/            flywheel.py           + .ipynb + README.md
  part-13-online-evals/             online_evals.py       + .ipynb + README.md
  part-14-agent-trajectory-evals/   trajectory_evals.py   + .ipynb + README.md
  part-15-eval-harness/             eval_harness.py       + .ipynb + README.md
```

`shared/` stays tiny; each `.py` still copies in only what it needs so a single-file read
is self-contained and runs standalone. Every `.py` ends with a verified `# Expected
output` block; every `.ipynb` is output-free and rebuilds the `.py` cell-by-cell.

**Essay ↔ code mapping** (same scheme as the other repos): one essay per part at
`src/content/essays/<slug>.mdx`, where `<slug>` = the part folder slug minus the
`part-NN-` prefix (e.g. `part-01-what-is-a-score/` ↔ `what-is-a-score.mdx`). Frontmatter
`codeUrl` points at the matching folder.

---

## 8. Essay conventions (post-overhaul mefby convention)

- `src/content/essays/<slug>.mdx`; frontmatter: `title`, `description`, `date`, `tags`,
  `codeUrl`, `seriesOrder` (1–15), **`series: 'evals'`**, `lang`, `translationSlug`
  (+ `isTranslation: true` on the secondary copy).
- **No in-body italic series line** — the layout renders "PART N OF total" itself.
- Body shape (mirrors agents): `What you'll learn` → `Prerequisites` → sections with
  `<Diagram>` figures → `Key takeaways` → `Glossary` → one-line next-part teaser.
- Em-dash-free prose; each part ships one flagship self-contained interactive HTML widget
  + static SVGs under `public/essays/<slug>/`.
- **Bilingual EN + TR** pair via `lang` / `translationSlug` / `isTranslation`.
- Dates spaced one apart so newest leads the index; start date set at Increment 1.

---

## 9. Out of scope / toured-in-prose by design

- Deep dives on specific vendor eval platforms (Braintrust, Arize, LangSmith) → named in
  prose, not taught; the series teaches the primitives underneath them.
- Full RAGAS / retrieval-metric re-derivation → cross-linked to RAG P8, not repeated.
- Benchmark contamination as a research topic → toured inside P11's contamination check.
- Reward-model / preference-eval training → belongs to a post-training series, not here;
  Bradley-Terry appears in P9 only as a ranking tool, not as an RLHF reward model.
- Human-annotation tooling / labeling ops → toured inside P2, not a standalone part.

---

## 10. Open items to confirm at spec review

1. **Frontier count:** 4 parts (12–15) as listed, or trim to 3 (fold Online Evals into
   the flywheel)? Default: keep 4.
2. **Part 15 framing:** standalone capstone harness vs a two-part "harness + RAG/Agent
   revisit". Default: single capstone that re-expresses both.
3. **Launch date / cadence:** thread from the day after the last Agents part, or a fresh
   launch date that visually separates the series on the index. Default: day-after.
4. **Real-judge path:** ship the optional real-provider `generate()` in `shared/judge.py`
   from Part 4, or keep everything deterministic-mock until later. Default: optional path
   present but off by default.
5. **OG accent:** reuse the exact rag/agents card template, or introduce a subtle
   data-viz accent for this series' visual identity. Default: same family, minor accent.

---

## 11. Implementation sequencing (this spec is a roadmap, not one plan)

A 15-part bilingual series is not a single implementation unit. Like the RAG and Agents
series (each part its own branch/PR), it decomposes into increments, each with its own
writing-plans → execution → review cycle:

- **Increment 0 — Part 0 site infra (§6).** The hard blocker; purely additive, touches
  only the Astro site (no new repo yet). Smallest, highest-leverage. **First plan.**
- **Increment 1 — Part 1 + the `evals-by-hand` repo skeleton.** Stand up the repo
  (`README`, `requirements.txt`, `shared/dataset.py`, `shared/judge.py`), then Part 1's
  `.py` + `.ipynb` + essay (EN+TR) + figures. Establishes every convention the rest inherit.
- **Increments 2…15 — one part each**, in curriculum order, each its own plan/PR, reusing
  the seed-vs-harden ladder (§5) so nothing is rebuilt.

The immediate next step after spec approval is a **writing-plans pass scoped to Increment
0 (Part 0 infra)** — optionally bundled with Increment 1 if the first essay should land in
the same plan. Commits and PRs follow the author's convention: **no Claude co-author /
"Generated with Claude Code" trailer.**

---

## 12. Provenance

Topic selected via the `next-series-ideation` workflow (`wf_fcfb2503-06f`): 5 ideation
lenses (pedagogical continuity, author moat, 2026 zeitgeist with web search, by-hand
format fit, differentiation) → ~26 raw candidates merged to 12 distinct → 3 independent
judges (skeptical senior engineer, content strategist, Karpathy-style educator) scoring
authorFit / demand / differentiation / byHandFit / longevity. "Evals from First
Principles" ranked #1 at 44/50 (byHandFit 10, demand 9, longevity 9), ahead of
Inference (41.7) and VLMs (40). Lineup and scope confirmed with the author at brainstorm
2026-07-02. The decisive insight: evaluation is the one topic where the by-hand method is
not a device but the native language of the subject, in a market currently owned by prose.
