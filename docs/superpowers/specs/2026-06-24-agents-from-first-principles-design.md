# Agents from First Principles — Series Design Spec

**Date:** 2026-06-24
**Status:** Design approved (shape + scope). Awaiting spec review, then implementation plan.
**Companion repo:** `agents-by-hand` (new, mirrors `rag-by-hand`)
**Series section:** "Agents from First Principles" (new Writing section on mefby.com)

This spec was produced from a 19-agent research+design workflow (11 web-verified
research facets → 3 independent curriculum proposals → adversarial critique each →
synthesis → adversarial verification). It is the successor series to the completed
20-part "RAG from First Principles."

---

## 1. Goal & premise

A second "X from First Principles, build it by hand" series, this time with the
**LLM agent** as the primary object. Same pedagogy as `rag-by-hand`: one concept
per part, a single runnable `.py` plus a cell-by-cell `.ipynb`, runs **offline**
with a transparent deterministic fallback (a real model one env flag away).

The organizing spine is **failure-driven, toy-to-deployed**: every part opens on
a concrete way the previous part's agent breaks and resolves it with **exactly one
new mechanism**. The series reads as one agent growing up — from a bare loop to a
durable, observable, secured production agent that survives a crash and an attack,
then scaled out across the MCP/A2A wire into a multi-agent system that is finally
graded by a trajectory regression gate.

**RAG is demoted to one tool** the agent may call. The two `search_*` tools from
RAG Part 19 become two entries in the agent's action space.

### Decisions locked at design approval
- **Scope: 17 parts** — 11 core + 6 frontier (mirrors the RAG core+frontier split).
- **Bilingual EN + TR from the start** (like the RAG series), each part a pair.
- **The three verifier-recommended extra beats are folded in as sidebars**, not new
  parts: (a) "the controller is a prompt + a model" (P1 + P11), (b) constrained /
  JSON-mode decoding for tool args (P1, paired with the validator), (c) transcript
  economics / prompt-KV caching as the dominant per-step cost (P11).

### Defaults chosen for the remaining minor decisions (override at review)
- **Part 0 site-infra change is required** (not optional) — see §6.
- **Reuse the RAG corpora** (refund-policy + Acme→Globex) verbatim for continuity.
- **Dates:** continue the one-day-apart, newest-leads cadence starting **2026-06-27**
  (day after RAG Part 20) so the series threads into the same index timeline.
- **Glossary:** per-series (`/essays/agents-glossary`), cloning `rag-glossary`.
- **Series label:** `AGENTS FROM FIRST PRINCIPLES` / `AJANLAR: İLK İLKELERDEN`.
- **Distinct accent palette** for agent essays (proposed: indigo = controller,
  teal = tools, amber = memory, rose = failures) + a new `/og/agents-by-hand.png`.

---

## 2. Relationship to the RAG series (anti-overlap is load-bearing)

### The honest correction
The initial framing ("RAG Part 19 hides the real LLM behind a demoted fallback;
the agents series inverts that") is **factually wrong** and is dropped entirely.
Verified against `rag-agent.mdx`: P19 already ships a real `generate()` controller
one env flag away and frames its deterministic rule controller as a **transparency
teaching choice** — the same device as P15's `classify_complexity` and P20's
condenser. There is no inversion to perform.

### What P19 / P20 already shipped (must NOT be re-taught as new)
- **P19 (RAG Agent):** a ReAct reason/act/observe loop, a four-tool palette
  (`search_policy`, `search_products`, `calculator`, `finish`), hardcoded multi-hop
  (Acme→Globex), routing, a flat `max_steps` budget, and an informal
  loop-detector note in its From-experience callout. Tools are plain Python
  functions called via **text-parsed actions, no schemas**, all **read-only**.
- **P20 (Conversational RAG):** a single flat conversational buffer + **query
  condensation** (rewrite a follow-up into a standalone question), plus a "we will
  come back to summarizing older turns" note.

### How the new series stays clear
- **Part 1 opens on the P19 agent** and names what it never named: Anthropic's
  **augmented-LLM primitive** (an LLM ringed by tools/memory/retrieval in the
  smallest loop with an explicit stop condition) and the **augmented-call → workflow
  → agent ladder** ("when NOT to build an agent"). It earns its place from minute
  one by upgrading P19's text-action tools into **typed, JSON-schema-validated tools
  the model selects from and may call more than once per turn.**
- **Every part carries a `differs_from_rag` line in its essay frontmatter / intro**
  stating how it goes beyond P19/P20 and other RAG parts.
- **Two RAG dangling threads are explicitly cashed in** (not presented as new):
  P20's "summarize older turns" promise → Part 7 (compaction); P19's informal
  loop-detector rule → Part 8 (formalized).
- **Continuity world reused:** the refund-policy + Acme→Globex corpus and the same
  deterministic-default / `generate()`-one-flag-away runtime.

---

## 3. Pedagogy & runtime model (identical to rag-by-hand)

- Each part ships **two ways to learn the same thing**: a single runnable `.py`
  (the whole idea top-to-bottom) and an output-free cell-by-cell `.ipynb` that
  rebuilds the `.py` with the WHY before each small step.
- **Offline by default, no API key.** The deterministic path is the reproducible
  DEFAULT; a real model/LLM is used automatically when available and changes only
  surface details. `generate()` is **one swappable provider function** (OpenAI
  active; Ollama + a `claude-opus-4-8` variant in comments) with the standard
  SDK/model-drift NOTE.
- Each `.py` ends with a **verified `# Expected output` block** produced by actually
  running it (deterministic path).
- **Feasibility-honesty constraints** baked in throughout (from the verifier):
  - **Parallel fan-out is simulated/sequential** in the deterministic default and
    reported as **LLM-call count + critical-path DEPTH**, never fabricated
    wall-clock (Parts 3, 14). Widget copy must match the depth-not-time framing.
  - **Reflexion's deterministic reflection is a real buffer-dependent rule** so
    convergence is genuinely *caused* by the buffer, not a scripted canned pass (P5).
  - **MCP default = in-process JSON-RPC shim** showing literal wire frames; the
    real subprocess-over-stdio path is a labeled two-local-processes/no-network CLI
    run whose transcript is **illustrative, not a frozen verified block** (P12).
  - **Observability = hand-rolled OTel-GenAI-shaped JSONL**, no otel SDK; attribute
    names hedged as `gen_ai.*`-STYLE because the semantic conventions still evolve
    (P11).
  - **`interrupt()` raises a serializable `PendingApproval`** caught at top level
    (not `sys.exit`) so notebooks stay runnable (P10).
  - **Byte-reproducible replay claim scoped to the deterministic path only**;
    real-LLM replay is best-effort (decisions cached from the journal, not
    re-generated) (P9).
  - **The toy code sandbox is explicitly illustrative**, not a real security
    boundary; the prose (figure caption + From-experience callout) must say loudly
    that real isolation is OS-level (gVisor / Firecracker / containers) (P13).
  - **The injection demo makes the deterministic controller deterministically fall
    for the poison** so the guardrail's catch is offline-visible (same device as
    RAG P12/P17) (P16).
  - **Runaway-cost figure** pinned to a verifiable public source at authoring time,
    or generalized to "a documented runaway-agent incident" (P8).

---

## 4. The curriculum (17 parts)

Each part below: track · slug · thesis (failure → mechanism) · what is built by
hand · code artifact · key figures · depends on · differs from RAG. Sidebars
folded in from the verifier are marked **[sidebar]**.

### Core track (1–11): grow one agent from a bare loop to production

**Part 1 — The Augmented LLM: a real loop with typed tools** · core ·
`augmented-llm-loop`
- **Thesis:** P19 built a ReAct loop but never named the primitive or gave tools a
  contract; the model invents a non-existent tool or passes a malformed argument
  that a text-parsed layer silently accepts → a named augmented-LLM loop with
  typed, schema-selected tools.
- **Builds:** a ~40-line reason/act/observe loop with the real `generate()`
  controller as centerpiece (deterministic rule controller as the reproducible
  offline default, framed as the same transparency device, NOT an inversion); the
  augmented-LLM primitive named; an honest stop condition (`finish` tool + step
  budget); JSON tool schemas for the P19 tools; an **argument validator that runs
  before any tool fires**; multiple-tool-calls-per-turn; the augmented-call →
  workflow → agent ladder runnable as three baselines on one question.
- **[sidebar] "the controller is a prompt + a model"** — how the system prompt and
  tool-use formatting steer the loop (reasoning vs non-reasoning models, extended
  thinking budget); set up here, paid off at P11.
- **[sidebar] constrained / JSON-mode decoding** — pair the post-hoc validator with
  a runnable constrained-decode stub showing the *upstream* fix, so "typed tools"
  covers generation, not just validation.
- **[sidebar] tool-description craft** — writing good tool names/descriptions/return
  shapes is the thing that most determines whether the real LLM controller works.
- **Figures:** `part1-loop-and-ladder.html` (flagship: stepped player single-stepping
  reason/act/observe with a toggle across the three rungs on the same Acme→Globex
  question + a live tool-schema validator rejecting a malformed call);
  `part1-augmented-llm.svg` (the primitive as series map); `part1-tool-contract.svg`
  (typed contract vs P19's text-parsed action).
- **Depends on:** RAG P19, P20.
- **Differs:** names the primitive + the when-not-to-build ladder P19 never drew;
  pulls typed JSON-schema tools + validation + multi-call-per-turn forward so it is
  beyond P19 from minute one. Does NOT re-derive the ReAct loop.

**Part 2 — When Tools Fail: retries, timeouts, and a failure taxonomy** · core ·
`robust-tool-execution`
- **Thesis:** a schema-valid tool can still throw, time out, or return garbage; one
  bad result derails the whole run → a failure taxonomy + bounded retries +
  error-as-observation recovery.
- **Builds:** a tool-execution wrapper with bounded retries + backoff + timeouts; a
  try/except boundary converting exceptions into recoverable Observations the
  controller reasons about; the **first side-effecting tool (a mock refund) with a
  local idempotency guard** so a retry never double-acts; an explicit taxonomy
  (transient / permanent / malformed / empty-result / unknown-tool → retry /
  feed-back / abort / idempotent-skip).
- **Figures:** `part2-fault-injection.html` (flagship: toggle timeout / exception /
  empty-result / flaky-then-succeeds / unknown-tool, showing the retry ladder and
  where the taxonomy recovers vs gives up); `part2-failure-taxonomy.svg`.
- **Depends on:** Part 1.
- **Differs:** P19 assumed every tool succeeds (flat `max_steps`, read-only tools);
  runtime error handling, retries/backoff/timeouts, first side-effecting tool +
  idempotency guard, and the taxonomy are all net-new. (Full idempotency-key
  treatment is hardened later in Part 9 — stated, not re-taught.)

**Part 3 — Planning the Work: plan-and-execute, ReWOO, and the tool DAG** · core ·
`planning-and-the-tool-dag`
- **Thesis:** ReAct re-decides one step at a time and pays an LLM call per hop, so
  it wanders and the bill balloons → make the PLAN a first-class artifact.
- **Builds:** three planners on one multi-hop task — Plan-and-Execute (inspectable
  plan + executor), ReWOO (plan once with `#E1/#E2` variable binding, run tools,
  synthesize in ~2 calls), and an LLMCompiler-style **tool DAG** of TaskNodes run
  by topological order with simulated parallel fan-out; deterministic rule-planner
  is the offline default. The script prints **LLM-call count and critical-path
  DEPTH** per strategy (no fabricated wall-clock).
- **Figures:** `part3-plan-modes.html` (flagship: mode toggle ReAct / P-and-E /
  ReWOO / DAG with a live call-counter + critical-path-depth readout);
  `part3-rewoo-binding.svg`; `part3-tool-dag.svg`.
- **Depends on:** Part 2.
- **Differs:** P19 has no plan object. The planner-executor family + explicit
  call/depth accounting are absent from RAG.

**Part 4 — Surviving a Broken Plan: the critic and error-triggered replanning** ·
core · `replanning-and-critic`
- **Thesis:** an up-front plan is a liability the instant the world disagrees (a SKU
  discontinued mid-run) and the DAG executor charges ahead blindly → a prospective
  critic + a replanner that revises only the remaining steps.
- **Builds:** a prospective rule/LLM critic validating Part 3's DAG before execution
  (cycles, unsatisfiable deps, missing tools, redundant steps); an error-triggered
  replanner revising only the remaining subgraph on failure (inject a
  discontinued-SKU failure); step memoization; an honest replan budget.
- **Figures:** `part4-replan.html` (flagship: inject the failure, watch the critic
  flag a bad plan up front then the replanner rewrite only the affected tail while
  completed nodes stay memoized, vs a blind executor); `part4-critic-gate.svg`.
- **Depends on:** Part 3 (the DAG is reused, not rebuilt).
- **Differs:** prospective plan critique + error-triggered partial replanning over a
  DAG have no analog in P19 (single step budget) or RAG (no plan to revise).

**Part 5 — Learning from Failure: in-loop reflection and Reflexion** · core ·
`reflection-and-reflexion`
- **Thesis:** even with replanning the agent repeats the same class of mistake
  across attempts because nothing persists what it learned → in-loop self-critique
  + cross-trial Reflexion.
- **Builds:** an in-loop self-critique step before `finish`; then Reflexion — a
  deterministic checker as the offline reward signal, a self-reflection step that
  writes a verbal post-mortem to an episodic buffer, and a retry loop that reads
  accumulated reflections before acting. The deterministic reflection is a **real
  inspectable rule** (extract the failing tool+arg from the checker, append a
  concrete avoid-X/try-Y note the next trial mechanically reads) so convergence is
  genuinely *caused* by the buffer. Seeds the episodic store Part 6 formalizes.
- **Figures:** `part5-reflexion-trials.html` (flagship: step through trials, watch
  the checker fail trial 1, a concrete reflection get appended, trial 2 read it and
  pass; a toggle removes the buffer to prove the buffer — not a script — causes
  convergence); `part5-verbal-reinforcement.svg` (with a sober note reflection can
  regress).
- **Depends on:** Part 4.
- **Differs:** neither P19 nor P20 touched self-critique / verbal reinforcement /
  cross-trial learning. Only touchpoint: RAG P11's LLM-as-judge, repurposed as an
  offline checker, not answer-quality scoring.

**Part 6 — The Four Memories: typed stores the agent edits itself** · core ·
`four-memories-self-editing`
- **Thesis:** P20's flat buffer cannot separate what HAPPENED from what is TRUE from
  how to DO a task, and P19's tools were read-only so the agent could never update
  its own state → typed four-store memory + memory the agent writes via tools.
- **Builds:** four typed stores (working / episodic / semantic / procedural) with a
  rule/LLM write-router and matching read paths; then `memory_append` and
  `memory_replace` as first-class agent TOOLS (using the Part 1 contract) over
  labeled blocks (`user_profile`, `task_state`) so the controller rewrites its own
  persistent memory in-loop (MemGPT/Letta by hand) with an OS-style
  core/recall/archival tier sketch. Vector search is demoted to the archival read
  tool only.
- **Figures:** `part6-memory-router.html` (flagship: feed a turn, watch the router
  classify it and the agent call `memory_replace` on `user_profile` live, each store
  filling a side panel); `part6-four-memories.svg`; `part6-self-editing-block.svg`.
- **Depends on:** Part 5.
- **Differs:** P20 shipped a flat buffer + condensation (a different operation);
  P19's tools only READ. Typed four-store taxonomy + write-router + memory-as-action
  are absent from RAG. **Frontmatter must state: archival read reuses RAG retrieval
  as a black-box tool — embeddings/similarity/vector-DB from RAG P2–P4 are NOT
  re-derived.**

**Part 7 — Surviving the Long Haul: compaction and forgetting** · core ·
`compaction-and-forgetting`
- **Thesis:** a long run fills the window and a store that only grows becomes noise →
  hot/warm/cold compaction + read-scoring, decay, eviction, supersession, and a
  sleep-time consolidation pass.
- **Builds:** a token-budget-triggered compaction step with hot (last-N verbatim) /
  warm (rolling decision+tool-output summary) / cold (broad summary) tiers (the
  Anthropic Compaction idea by hand); plus the forgetting axis (read-time
  importance+recency+access scoring, write-time decay/eviction/supersession of stale
  facts) and an optional consolidation pass promoting episodic logs into semantic
  facts + procedural rules. Opens by cashing in P20's "we will come back to"
  summarization note.
- **Figures:** `part7-compaction-and-decay.html` (flagship: a token meter crossing
  the threshold collapses older turns into a warm summary so the bar drops and the
  run continues; a slider tunes recency/importance and advances time to show decay,
  eviction, and a superseded policy retiring); `part7-hot-warm-cold.svg` (side by
  side with P20 condensation to mark them as different operations);
  `part7-write-manage-forget.svg`.
- **Depends on:** Part 6.
- **Differs:** compaction (compress history to survive long horizons) explicitly
  distinguished from P20 condensation (rewrite the question) and from P16/P11
  long-context tradeoffs; read/write/FORGET policies + episodic→semantic
  consolidation are territory the ever-growing RAG index never touched. Ensure the
  summary mechanism is not a thin restatement of P20's running summary.

**Part 8 — Stopping the Runaway: budgets, loop detection, and the circuit breaker**
· core · `budgets-and-circuit-breaker`
- **Thesis:** an agent that never gives up will retry forever and burn the budget →
  multi-dimensional budgets + a loop detector + a circuit breaker that trips to a
  graceful partial result.
- **Builds:** a `BudgetMeter` (steps, estimated tokens/USD, wall-clock) checked
  before every step; a loop detector for repeated identical `(action, args)` cycles,
  framed as **formalizing P19's two-identical-searches note**; a circuit breaker
  with closed → tripped → graceful-finish states.
- **Figures:** `part8-budget-meter.html` (flagship: live step/token/cost/wall-clock
  gauges with sliders for each ceiling, showing the breaker trip and a clean partial
  exit vs the uncapped runaway); `part8-loop-detector.svg`; `part8-circuit-breaker.svg`.
- **Depends on:** Part 5.
- **Differs:** generalizes P19's single `max_steps` + informal note into
  multi-dimensional budgets, a real cycle detector (framed as formalizing that note),
  and a graceful breaker.

**Part 9 — The Durable Agent: event journal, replay, and effectively-once** · core ·
`durable-agent`
- **Thesis:** the agent lives in a fragile in-memory process, so a refund halfway
  done is lost when the process is killed and a replay can re-charge a customer → an
  append-only event journal with deterministic replay, step memoization, and
  idempotency keys.
- **Builds:** an append-only event journal (`step_started`, `tool_called`,
  `tool_result`, `llm_decided`, `finished`) to JSONL/SQLite keyed by a fixed/seeded
  `run_id` with frozen timestamps, where **state is the fold over the log**;
  deterministic replay with step memoization (kill mid-run, resume, completed steps
  return cached results, only the tail re-runs); **idempotency-keyed side-effect
  tools** (record key→result, return prior result on duplicate) hardening Part 2's
  local guard into effectively-once across replay. Cross-process resume =
  kill-and-rerun-the-same-script-on-the-same-journal (not true IPC).
- **Figures:** `part9-journal-replay.html` (flagship: append events, hit KILL
  mid-step, RESUME and watch completed steps return memoized while only the
  post-crash tail re-runs; labeled as a faithful REPLAY, not a live process);
  `part9-event-journal.svg`; `part9-idempotency-key.svg`.
- **Depends on:** Parts 2, 8.
- **Differs:** crash-safety via journal + deterministic replay + step memoization,
  and idempotency keys for effectful tools, are an orthogonal durability layer the
  always-in-memory P19/P20 lacked. **Byte-reproducibility claim scoped to the
  deterministic path; real-LLM replay is best-effort.**

**Part 10 — Pause, Approve, Resume, Steer: human-in-the-loop** · core ·
`pause-approve-resume`
- **Thesis:** some actions must wait for a human (approve a large refund) and a user
  may want to correct the agent mid-run, but the durable agent cannot stop and come
  back → a journal-backed interrupt/resume + mid-run steering as a first-class action.
- **Builds:** a hand-built `interrupt()` that raises a **serializable
  `PendingApproval` caught at top level** (not `sys.exit`, so it stays
  notebook-runnable), persisting the journal and returning a pending-approval token;
  `resume(run_id, decision)` that rehydrates from the journal and continues
  (approve/deny a refund-over-threshold); a CLI two-invocation cross-process demo in
  prose; mid-run steering / a clarifying-question-back-to-the-user as a first-class
  action (not just a binary gate). Streaming progress is emitted from the same
  journal events.
- **Figures:** `part10-approve-resume.html` (flagship: agent reaches a
  refund-over-threshold, emits a token; click Approve/Deny or inject a steering
  correction and watch it resume effectively-once); `part10-interrupt-resume.svg`;
  `part10-approval-gate.svg`.
- **Depends on:** Part 9.
- **Differs:** cross-process pause/resume for approval + mid-run steering are durable
  territory distinct from P20's same-process turns; P19 had read-only tools and no
  approval gate.

**Part 11 — Shipping It: tracing, cost-per-success, and the core capstone** · core ·
`observable-agent`
- **Thesis:** a durable agent you cannot see into is undebuggable and unaccountable →
  fold the journal into OpenTelemetry-shaped spans, per-step cost/latency, and
  cost-per-success.
- **Builds:** a minimal **hand-rolled OTel-GenAI-shaped span tree** (`invoke_agent`
  root over `execute_tool` + LLM child spans carrying `gen_ai.*`-STYLE attributes:
  `operation.name`, `tool.name`, token usage, latency) emitted to JSONL from the
  journal with **no otel SDK** (real OTLP exporter as a commented one-liner,
  mirroring the `generate()` pattern); trajectory + tokens + cost + per-step latency
  + cost-per-success reconstructed from the spans; streaming progress; a ~60-line
  pluggable file/SQLite backend with Temporal/DBOS/Vercel-WDK/LangGraph toured in
  prose with honest limits; a Part-1→11 anatomy-to-production capstone checklist.
- **[sidebar] transcript economics** — the agent re-sends a growing transcript every
  step (the dominant real cost lever); a runnable demo reusing the Part 3 call-counter
  + this part's cost-per-success harness shows prompt/KV caching's effect.
- **[sidebar] controller = prompt + model (payoff)** — tie the P1 sidebar to real
  cost/latency: model choice and thinking budget show up here in the spans.
- **Figures:** `part11-span-tree.html` (flagship: one run's journal as a span tree
  `invoke_agent > execute_tool > llm` with token/cost/latency per span, a live
  streaming feed, and a cost-per-success readout); `part11-spans-from-journal.svg`
  (one log, two views); `part11-core-capstone.svg` (core-track map).
- **Depends on:** Parts 9, 10.
- **Differs:** per-step agent spans, cost-per-success, and journal-derived tracing
  are agent-specific and distinct from RAG P12's retrieval-service latency/cost
  notes. Hand-rolled OTel-shaped JSONL avoids the SDK dependency that would break the
  offline bar.

### Frontier track (12–17): open the agent to the protocol wire and multi-agent

**Part 12 — Tools as a Protocol: a minimal MCP server and host by hand** · frontier ·
`mcp-by-hand`
- **Thesis:** tools are still a hardcoded Python dict, so they cannot be shared,
  swapped, or discovered by any other host → speak the MCP wire protocol end to end.
- **Builds:** a **stdlib-only MCP server + the host/client that consumes it** (one
  part, because a wire protocol is one round-trip story): the `initialize` handshake
  (protocolVersion + capability negotiation), `tools/list`, `tools/call`, and the
  three server primitives (tools / resources / prompts), wrapping the P19 tools as
  MCP capabilities; a host that performs the handshake, lists tools, and feeds
  returned JSON schemas straight into the Part 1 controller (replacing the hardcoded
  dict), multiplexing N servers. **Default = in-process JSON-RPC shim** showing
  literal wire frames; the real subprocess-over-stdio path is a labeled
  two-processes/no-network CLI run (**illustrative transcript, not a frozen block**).
- **[sidebar] skills / progressive tool disclosure** — pairs with MCP discovery.
- **Figures:** `part12-jsonrpc-and-discovery.html` (flagship: a wire inspector
  stepping through `initialize → tools/list → tools/call` frames, then a host
  connecting to two servers and watching capability negotiation populate the palette);
  `part12-three-primitives.svg`; `part12-host-multiplex.svg`.
- **Depends on:** Parts 1, 2.
- **Differs:** replaces P19's hardcoded dict with a standardized protocol (discovered,
  schema-described capabilities over JSON-RPC + tools/resources/prompts). Entirely
  new ground; RAG was single-process hardcoded wiring.

**Part 13 — The Code-Running Tool: sandboxed execution and computer-use** · frontier ·
`code-execution-and-sandbox`
- **Thesis:** some tasks need the agent to write and run code or act on a
  screen/filesystem, not just call typed JSON functions (the dominant 2026 modality
  the series has ignored); and once it can run code it can do real damage → a
  code-execution tool behind a sandbox/permission boundary.
- **Builds:** a code-execution tool (restricted exec over the Acme→Globex data) and a
  computer-use-style surface (a tiny mock filesystem/browser acted on by structured
  commands), both wrapped in a sandbox boundary (action allowlist, resource/time cap
  reusing Part 8's `BudgetMeter`, no-network isolation, idempotency reusing Part 9's
  keys). Shows an unsafe direct exec doing damage vs the sandboxed path that contains
  it, setting up Part 16. Deterministic default runs a whitelisted toy interpreter;
  real exec is the env-flag path.
- **CRITICAL prose constraint:** the toy sandbox is **illustrative, not a real
  security boundary** (Python `exec` sandboxing is famously unsound). The figure
  caption AND the From-experience callout must say loudly that a real sandbox needs
  OS-level isolation (gVisor / Firecracker / containers).
- **Figures:** `part13-sandbox.html` (flagship: toggle sandbox on/off, watch an
  unsafe command escape — delete a file / hit the network — vs the allowlisted,
  budget-capped sandbox that blocks it); `part13-tool-classes.svg`;
  `part13-sandbox-boundary.svg`.
- **Depends on:** Parts 2, 8, 9.
- **Differs:** code-execution + computer-use as tool classes, and the sandbox/permission
  boundary, are a central 2026 modality entirely absent from RAG (read-only tools).

**Part 14 — The Supervisor and the Handoff: multi-agent, and when it hurts** ·
frontier · `supervisor-and-handoffs`
- **Thesis:** one agent with one context window cannot do breadth-first work in
  parallel and is overkill when the right move is to hand the conversation to a
  specialist → orchestrator-worker fan-out + handoff-as-a-tool-call, taught with an
  honest single-vs-multi decision framework.
- **Builds:** an orchestrator-worker (supervisor) **reusing the Part 1 agent as a
  black-box WORKER**: a lead decomposes a task, spawns N workers each with its own
  context + a typed brief (objective, output format, tool guidance, boundaries) over
  the Part 12 MCP tools, then a CitationAgent-style synthesis pass;
  handoff-as-a-tool-call transferring control AND the full live trace to a
  billing/catalog specialist (with context-handoff failure modes: truncation, role
  confusion); a shared append-only blackboard; a single-vs-supervisor-vs-debate
  harness printing tokens/steps/quality + cost-per-success (debate round 3 visibly
  regresses); the runaway-supervisor loop **reusing Part 8's circuit breaker
  (forward-referenced, not rebuilt)**. Parallelism is sequential-in-the-default,
  reported as call-count + token-isolation, not wall-clock.
- **[forward-reference] observability** — these distributed runs render as the Part
  11 span tree (close the multi-agent debugging gap).
- **Figures:** `part14-single-vs-multi.html` (flagship: toggle single / supervisor
  fan-out / proposer-critic debate over one task, read tokens/steps/quality/cost-per-
  success, including a debate round that regresses and a handoff carrying the full
  trace); `part14-orchestrator-worker.svg`; `part14-handoff-vs-blackboard.svg`.
- **Depends on:** Parts 1, 8, 12.
- **Differs:** RAG was single-agent end to end. Orchestration, parallel workers with
  separate contexts + typed briefs, agent-control handoff (categorically different
  from P15's complexity router and P18's text-vs-SQL router), the blackboard, and the
  single-vs-multi economics are net-new; the prior single agent is the worker so
  ReAct is never re-derived; the breaker is reused, not duplicated.

**Part 15 — Agent to Agent: A2A delegation across boundaries** · frontier ·
`a2a-agent-interop`
- **Thesis:** handoffs work inside one process, but a billing agent owned by another
  team is unreachable → A2A Agent Cards for discovery + JSON-RPC delegation with a
  trust/allowlist check.
- **Builds:** Agent Cards (JSON at `/.well-known/agent-card.json`: name, skills, I/O
  modes, auth); a deterministic two-agent delegation demo (a support agent discovers
  and delegates to a billing agent over JSON-RPC); a tiny local registry; a
  lightweight trust/allowlist + untrusted-annotation check (kept deliberately thin —
  the deep injection treatment is owned by Part 16). Frames **MCP = vertical (agent→
  tools), A2A = horizontal (agent→agent)**. Reuses the Part 12 in-process JSON-RPC
  transport as the default.
- **[forward-reference] observability** — A2A traces render as Part 11 spans.
- **Figures:** `part15-agent-card-delegation.html` (flagship: discover a billing
  agent via its Agent Card from the registry, run an allowlist check, delegate and
  watch the task lifecycle complete over JSON-RPC frames); `part15-mcp-vs-a2a.svg`;
  `part15-agent-card.svg`.
- **Depends on:** Parts 12, 14.
- **Differs:** agent-to-agent interop (Agent Cards, horizontal delegation, a registry)
  is entirely new; RAG was single-agent. The trust touchpoint stays thin and hands
  depth to Part 16.

**Part 16 — Securing the Agent: the lethal trifecta and untrusted tools** · frontier ·
`securing-the-agent`
- **Thesis:** an agent with real tools, memory, code execution, and access to
  untrusted content over MCP/A2A is an attack surface RAG never had, and RAG P17
  explicitly hands this off → a layered agentic-security pipeline.
- **Builds:** concrete agent attacks + defenses by hand — indirect prompt injection
  arriving through a tool result or an untrusted MCP tool description; the
  **lethal-trifecta** framing (private data + untrusted content + exfiltration
  channel); confused-deputy abuse across an MCP/A2A boundary; untrusted-code abuse of
  the Part 13 exec tool. Layered defenses: untrusted-content quarantine + provenance
  tagging, an action allowlist + the Part 10 human-approval gate as a control,
  capability scoping / least-privilege, MCP server + A2A peer trust/allowlist +
  signed-entry checks, tool-output validation. The deterministic controller is made
  to deterministically FALL FOR the poisoned instruction so the guardrail's catch is
  offline-visible; the real-LLM path reproduces it authentically.
- **Figures:** `part16-injection-vs-guardrail.html` (flagship: toggle the attack and
  defenses on/off, watch a poisoned support ticket either hijack the agent into an
  unauthorized refund/exfiltration or get caught before the effectful tool fires);
  `part16-lethal-trifecta.svg`; `part16-attack-surface.svg`.
- **Depends on:** Parts 2, 10, 12, 13, 14, 15. (State the minimum prerequisite path
  for a reader who skipped frontier protocol parts.)
- **Differs:** RAG P17 secured RETRIEVED documents in a single-shot pipeline and
  defers the act-capable case here. This secures the AGENT'S ACTION SPACE: untrusted
  tool descriptions, the lethal trifecta, confused-deputy across MCP/A2A,
  untrusted-code execution, capability scoping, approval gates as controls — a broader
  surface no RAG part covered.

**Part 17 — Grading the Agent: three-layer eval and the regression gate** · frontier ·
`agent-evaluation`
- **Thesis:** we have judged agents by eyeball, so we cannot catch a regression where
  the agent returns the right answer via a wrong, expensive path → score a run on
  three orthogonal layers + a CI-style golden-trajectory suite.
- **Builds:** replay the agent and grade one run three ways — a deterministic outcome
  check; trajectory/process metrics (tool-call set precision/recall, argument
  validity, order-aware edit distance, step count vs a golden set); component/unit
  checks. A rubric-based `generate()`-judge with a deterministic fallback whose bias
  is demonstrated **for trajectories specifically** (gameable self-narrated reasoning,
  process-score reward hacking), citing RAG P11 for the already-known answer-quality
  biases (not re-enumerated). Then a CI-style golden-trajectory suite replaying
  ~10–30 curated `(task → expected outcome + expected trajectory + budget)` cases
  under ~5 min, asserting outcome, tool-call correctness, AND an **operating
  envelope** (max steps/tool-calls/token-cost/timeout), reporting cost-per-success;
  plus a mini τ2-style verifiable-success-by-DB-state-and-policy check with
  contamination/reward-hacking caveats. The series finale.
- **[cross-reference] security eval** — replay the Part 16 attack cases as eval cases
  ("does the agent still get injected under eval?"); note multi-turn/long-horizon
  trajectory eval as the reader's extension.
- **Figures:** `part17-eval-and-gate.html` (flagship: grade a trajectory at all three
  layers — a right-outcome/wrong-trajectory case fails the process check — watch the
  judge swing under verbosity/reorder while the programmatic guard holds, then run the
  CI gate and tighten the cost envelope to flip cases red); `part17-three-layers.svg`;
  `part17-operating-envelope.svg`.
- **Depends on:** Parts 1, 2, 5.
- **Differs:** RAG P11 evaluated retrieval/generation QUALITY (RAGAS) for a single-shot
  pipeline and shipped the answer-quality judge-bias catalog (cited, not re-taught).
  Outcome/trajectory/tool-call/component scoring of a multi-step run, golden-trajectory
  regression with operating envelopes, cost-per-success, and τ2-style verifiable
  success are net-new agent material.

---

## 5. Cross-part seed-vs-harden ladder (so nothing is taught "for real" twice)

Each relevant part's frontmatter states which side of the ladder it is on:
- **Idempotency:** seeded local guard in P2 → hardened to keys (effectively-once
  across replay) in P9.
- **Loop detection:** informal note in RAG P19 → formalized `(action, args)`-cycle
  detector in P8.
- **Circuit breaker:** owned by P8 → reused (not rebuilt) in P14.
- **Budget meter:** owned by P8 → reused in P13.
- **Episodic buffer:** seeded in P5 → formalized as a typed store in P6.
- **DAG:** built in P3 → critiqued/replanned (not rebuilt) in P4.
- **JSON-RPC transport:** built in P12 → reused in P15.
- **Span tree / journal:** journal in P9 → spans in P11 → forward-referenced from
  P14/P15 for multi-agent observability.

---

## 6. Part 0 — site-infra change (HARD blocker, verified in code)

Without this, the 17 agent parts collide with RAG 1–20: `seriesTotal` inflates to
37, prev/next chains across both series, and agent essays render under the RAG
banner. Verified touchpoints: `src/content/config.ts` has no `series` field;
`src/pages/essays/[...slug].astro` (line ~13) computes `seriesTotal` and prev/next
by counting every `seriesOrder` essay in the single collection; `EssayLayout.astro`
(lines ~32–34) hardcodes the `RAG FROM FIRST PRINCIPLES` label and (line ~59) the
`/og/rag-by-hand.png` fallback; `/essays/rag` and `/essays/rag-glossary` both count
all `seriesOrder` essays unconditionally.

**Acceptance checklist (Part 0 ships before any agent essay):**
1. Add `series: 'rag' | 'agents'` to the Zod schema in `src/content/config.ts`.
2. **Backfill `series: 'rag'` on all 20 existing essays** (silent-breakage risk —
   forgetting this breaks the RAG series' totals/links).
3. Scope `seriesTotal` + prev/next by `series` in `[...slug].astro`.
4. Parameterize the series label in `EssayLayout.astro` (EN + TR).
5. Parameterize the `ogImage` fallback by series.
6. Create an `/essays/agents` hub (clone `rag.astro`) and scope `rag.astro`'s filter
   to `series === 'rag'`.
7. Decide glossary per-series vs shared (default: per-series `/essays/agents-glossary`).
8. Add `/og/agents-by-hand.png`.

---

## 7. Repo structure (`agents-by-hand`) and 1:1 essay sync

Mirrors `rag-by-hand` so a returning reader is instantly at home.

```
agents-by-hand/
  README.md            # one row per part: | Part | Topic | Code | Notebook | Essay | + Colab badges;
                       # an offline-fallback-runtime preamble; link back to rag-by-hand + /essays/agents
  requirements.txt     # stdlib-first; optional openai (commented Ollama + claude-opus-4-8);
                       # NO otel SDK, NO agent framework. Note: TAI PyPI mirror + pip --break-system-packages
  LICENSE  .gitignore
  shared/
    world.py           # refund-policy + Acme→Globex corpus, base tools, generate() (one swappable
                       # provider + SDK/model-drift NOTE) + deterministic fallback
    journal.py         # introduced in part-09, imported by 10/11/14 (state = fold over log)
  part-01-augmented-llm-loop/        augmented_llm_loop.py        + .ipynb + README.md
  part-02-robust-tool-execution/     robust_execution.py          + .ipynb + README.md
  part-03-planning-and-the-tool-dag/ planners.py                  + .ipynb + README.md
  part-04-replanning-and-critic/     replanning_critic.py         + .ipynb + README.md
  part-05-reflection-and-reflexion/  reflexion.py                 + .ipynb + README.md
  part-06-four-memories-self-editing/ four_memories.py            + .ipynb + README.md
  part-07-compaction-and-forgetting/ compaction_and_forgetting.py + .ipynb + README.md
  part-08-budgets-and-circuit-breaker/ budget_circuit_breaker.py  + .ipynb + README.md
  part-09-durable-agent/             durable_agent.py             + .ipynb + README.md
  part-10-pause-approve-resume/      pause_approve_resume.py      + .ipynb + README.md
  part-11-observable-agent/          observable_agent.py          + .ipynb + README.md
  part-12-mcp-by-hand/               mcp_server_and_host.py       + .ipynb + README.md
  part-13-code-execution-and-sandbox/ sandboxed_code_tool.py      + .ipynb + README.md
  part-14-supervisor-and-handoffs/   supervisor_and_handoffs.py   + .ipynb + README.md
  part-15-a2a-agent-interop/         a2a_delegation.py            + .ipynb + README.md
  part-16-securing-the-agent/        secure_agent.py              + .ipynb + README.md
  part-17-agent-evaluation/          agent_eval.py                + .ipynb + README.md
```

`shared/` is kept tiny (mirroring rag-by-hand's reuse pattern); each `.py` still
copies in only what it needs so a single-file read is self-contained, and still runs
standalone top-to-bottom. Every `.py` ends with a verified `# Expected output` block;
every `.ipynb` is output-free and rebuilds the `.py` cell-by-cell.

**Essay ↔ code mapping (same scheme as rag-by-hand):** one essay per part at
`src/content/essays/<slug>.mdx`, where `<slug>` = the part folder slug minus the
`part-NN-` prefix (e.g. `part-01-augmented-llm-loop/` ↔ `augmented-llm-loop.mdx`),
exactly as `rag-agent.mdx` ↔ `part-19-rag-agent` works today. Frontmatter `codeUrl`
points at the matching folder.

---

## 8. Essay conventions (post-overhaul mefby convention)

- `src/content/essays/<slug>.mdx`; frontmatter: `title`, `description`, `date`,
  `tags`, `codeUrl`, `ogImage`, `seriesOrder` (1–17), **`series: 'agents'`**, and
  `lang` / `translationSlug` (+ `isTranslation` on the secondary).
- **No in-body italic series line** — the post-overhaul layout renders "PART N OF
  total" itself.
- Body shape: `What you'll learn` → `Prerequisites` → sections → `> 💡 From
  experience` callout → `Key takeaways` → `Glossary` → one-line next-part teaser.
- Em-dash-free prose. Each part ships a flagship self-contained interactive HTML
  widget + static SVGs under `public/essays/<slug>/`.
- **Bilingual EN + TR** pair via `lang`/`translationSlug`/`isTranslation`.
- Dates one-apart so newest leads; start **2026-06-27** (day after RAG Part 20).
- Distinct accent palette proposed (indigo controller / teal tools / amber memory /
  rose failures) layered on the existing token set.

---

## 9. Out of scope / toured-in-prose by design

- Standalone Tree-of-Thoughts / self-consistency and formal LLM+P/PDDL planning →
  toured inside Parts 3 and 5 (2026 reasoning models subsume external inference-time
  search).
- Hierarchical multi-level planning → toured inside Parts 3/4.
- Cost-aware / small-model controller routing → toured inside Parts 3 and 11 (the
  call-counter sets it up).
- Skills / progressive tool disclosure → toured inside Part 12 (pairs with MCP
  discovery).

---

## 10. Open items to confirm at spec review

1. **Part 0 acceptance checklist** (§6) — confirm the scope, especially the
   `series:'rag'` backfill on all 20 existing essays.
2. **Repo + section names** — `agents-by-hand` / "Agents from First Principles".
3. **Ordering toss-ups** — budgets/breaker at P8 (vs right after planning);
   code-execution/sandbox at P13 frontier (vs core, right after error handling).
4. **P16 prerequisite path** for readers who skip the frontier protocol parts.
5. **Launch cadence** — threaded from 2026-06-27 vs a fresh launch date that visually
   separates the two series on the index.
6. **Accent palette + `/og/agents-by-hand.png`** — adopt, or keep the RAG token set.

---

## 11. Implementation sequencing (this spec is a roadmap, not one plan)

A 17-part series is not a single implementation unit. Like the RAG series (where
each part shipped as its own branch/PR), implementation decomposes into increments,
each with its own writing-plans → execution → review cycle:

- **Increment 0 — Part 0 site infra (§6).** The hard blocker. Must merge before any
  agent essay. Smallest, highest-leverage; touches only the Astro site (no new repo
  yet). **This is the first implementation plan.**
- **Increment 1 — Part 1 + the `agents-by-hand` repo skeleton.** Stand up the repo
  (`README`, `requirements.txt`, `shared/world.py`), then Part 1's `.py` + `.ipynb`
  + essay (EN+TR) + figures. Establishes every convention the rest inherit.
- **Increments 2…17 — one part each**, in curriculum order, each its own plan/PR,
  reusing the seed-vs-harden ladder (§5) so nothing is rebuilt.

Sub-projects share this spec as the contract; per-part specifics (exact prose,
figure scripts, expected-output) are settled inside each increment's plan. The
immediate next step after spec approval is a writing-plans pass scoped to
**Increment 0 (Part 0 infra)** — optionally bundled with Increment 1 if you want the
first essay in the same plan.

## 12. Provenance

Designed via the `agents-series-design` workflow (run `wf_0e178e86-6a7`): 11
web-verified research facets (agent loop/reasoning, tools/actions, MCP/protocols,
memory, planning, reflection, multi-agent, evaluation, security/safety,
production/durability, pedagogy/scope) → 3 independent curriculum proposals
(loop-first, anatomy-first, failure-driven) → adversarial critique each → synthesis
(failure-driven spine + anti-overlap discipline + the Part 0 infra catch) →
adversarial verification (verdict: needs-tweaks; all flagged tweaks folded into this
spec). The decisive non-obvious contribution was the Part 0 infra blocker, surfaced
by the anatomy-first critique and verified directly against the site code.
