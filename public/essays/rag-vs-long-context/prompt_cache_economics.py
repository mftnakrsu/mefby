"""
prompt_cache_economics.py  -  RAG from First Principles, Part 16
                              ("RAG vs Long-Context vs CAG")

When do you even need retrieval? Sometimes the cheaper move is to stuff a small,
stable corpus into the context window ONCE and reuse it. The catch everyone
quotes is "context is expensive": every retrieved or stuffed token is billed on
EVERY request. That is true at the FRESH input rate. It is much less true once
PROMPT CACHING enters the picture -- a cached input token costs roughly an order
of magnitude less than a fresh one.

This file is the accountant for that trade. It is NOT "RAG is dead" and it is NOT
"just stuff everything". It is a small, honest cost model you can run and poke at,
so the decision matrix in the essay has numbers under it instead of vibes.

The model has three strategies for answering N queries against the same corpus:

  - RAG:          embed the query, retrieve top-k chunks, and send ONLY those
                  k chunks as context. Small per-query input, but you re-send the
                  retrieved chunks fresh on every request (no stable prefix to
                  cache, because which chunks you send changes per query).
  - long_context: stuff the WHOLE corpus into the prompt on every request, at the
                  fresh input rate, every time. The naive "just use the big
                  window" baseline.
  - cag:          stuff the WHOLE corpus into the prompt ONCE as a stable,
                  cacheable PREFIX (a write at ~1.25x the fresh rate), then on
                  every subsequent request the corpus tokens are served from
                  cache at ~0.1x. This is the prompt-caching shadow of
                  Cache-Augmented Generation (CAG, arXiv 2412.15605): preload a
                  small stable corpus once and reuse the cached state.

The pricing constants below mirror the PUBLIC shape of 2025-2026 prompt-caching
on a frontier model (fresh input = 1 unit, cache write = 1.25x, cache read =
0.1x, output billed separately). They are deliberately in RELATIVE "cost units"
so the file makes a point about SHAPE, not a quote of any one vendor's price
sheet. Plug in your own provider's numbers and the conclusions move, but the
crossover behaviour does not.

Run (pure standard library, no numpy, no API key, no network):

    python3 prompt_cache_economics.py

================================ Expected output ===============================
(pasted verbatim from a real run: `python3 prompt_cache_economics.py`)

==============================================================================
PROMPT-CACHING ECONOMICS  -  RAG vs long-context vs CAG
==============================================================================
Pricing (relative cost units, per token):
  fresh input         1.000   (a token the model has never seen this call)
  cache write         1.250   (first time a stable prefix is laid down)
  cache read          0.100   (a token served from a cached prefix)
  output              5.000   (billed the same for every strategy)

Workload:
  corpus              4000 tokens (small + stable: a candidate for CAG)
  query                 40 tokens
  retrieved (top-k)    600 tokens (the slice RAG sends per query)
  answer               250 tokens
  fixed instructions   200 tokens (system prompt, stable prefix)

------------------------------------------------------------------------------
COST TO ANSWER 1 QUERY
------------------------------------------------------------------------------
  strategy        input cost  output cost     total   vs RAG
  ----------------------------------------------------------
  rag                  890.0       1250.0    2140.0    1.00x
  long_context        4240.0       1250.0    5490.0    2.57x
  cag                 5290.0       1250.0    6540.0    3.06x

  At 1 query, CAG is WORST: you paid the cache-write premium and got one read.
  The whole point of CAG is amortization, so 1 query is exactly the wrong test.

------------------------------------------------------------------------------
COST TO ANSWER 100 QUERIES (same stable corpus)
------------------------------------------------------------------------------
  strategy        input cost  output cost     total   vs RAG
  ----------------------------------------------------------
  rag                66230.0     125000.0  191230.0    1.00x
  long_context      424000.0     125000.0  549000.0    2.87x
  cag                50830.0     125000.0  175830.0    0.92x

  Now CAG has amortized the write across 100 cache reads and overtaken RAG,
  while long_context (no caching) stays ~2.9x the bill. The corpus is small
  and stable, so CAG buys you long-context's simplicity below RAG's cost.

------------------------------------------------------------------------------
THE CROSSOVER  (where CAG total drops below long-context, and below RAG)
------------------------------------------------------------------------------
  CAG beats naive long-context after  2 query.
  CAG beats RAG after 24 queries.

------------------------------------------------------------------------------
WHAT MOVES THE ANSWER: corpus size sweep (100 queries, cache read = 0.10x)
------------------------------------------------------------------------------
  corpus tokens   rag total     long_context     cag total     winner
  -------------------------------------------------------------------
           1000    191230.0         249000.0      142380.0     cag
           4000    191230.0         549000.0      175830.0     cag
          16000    191230.0        1749000.0      309630.0     rag
          64000    191230.0        6549000.0      844830.0     rag
         256000    191230.0       25749000.0     2985630.0     rag

  Reading the sweep:
    - long_context cost grows LINEARLY with corpus size on every query: it
      re-reads the whole corpus fresh each time. This is the 'just stuff it'
      tax, and it is brutal as the corpus grows.
    - CAG grows too (the cached corpus is still read, at 0.1x, every query),
      but ~10x slower than long_context. For a SMALL stable corpus it is a
      great deal; for a large one the 0.1x reads still add up.
    - RAG stays cheapest here because it sends only the top-k slice. Its cost
      is driven by k, not by corpus size -- which is exactly why a massive
      corpus points at RAG.

So: small + stable + reused  -> CAG (or plain long-context if tiny).
    massive (or fast-moving)  -> RAG.
    The pricing here is RELATIVE units; swap in your provider's real rates and
    re-run before you decide. The crossover SHAPE is the lesson, not the digits.
==============================================================================
================================================================================
"""

from dataclasses import dataclass
from typing import Optional


# ---------------------------------------------------------------------------
# Pricing, in RELATIVE cost units per token. The public shape of 2025-2026
# prompt caching on a frontier model: a fresh input token is the unit; laying
# down a cacheable prefix costs a ~1.25x write premium once; reading from that
# prefix later costs ~0.1x (an order of magnitude cheaper); output is billed the
# same no matter how the input got there. These are units, not dollars -- plug
# in your provider's real per-token rates to get a real bill.
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Pricing:
    fresh_input: float = 1.0
    cache_write: float = 1.25   # one-time premium to write a stable prefix
    cache_read: float = 0.10    # every subsequent read of that prefix
    output: float = 5.0         # same for all strategies; carried for honesty


# ---------------------------------------------------------------------------
# The workload: one small, stable corpus answered many times. Token counts are
# illustrative but in a realistic ratio (a few-thousand-token corpus, a short
# query, a top-k slice an order of magnitude smaller than the corpus, a couple-
# hundred-token answer, a fixed instruction block).
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Workload:
    corpus_tokens: int = 4000        # the whole knowledge base (small + stable)
    query_tokens: int = 40           # the user's question (volatile, never cached)
    retrieved_tokens: int = 600      # the top-k slice RAG actually sends
    answer_tokens: int = 250         # generated output, billed per strategy
    instruction_tokens: int = 200    # system prompt / fixed prefix


# ---------------------------------------------------------------------------
# Per-strategy cost to answer `n` queries against the SAME corpus.
#
# The key modelling choice is WHICH tokens are cacheable. A stable prefix can be
# cached; anything that changes per request cannot. The query always changes, so
# it is always fresh. The RETRIEVED slice changes per query too (different
# queries pull different chunks), so RAG cannot cache its context -- that is the
# subtlety the essay leans on. CAG's whole trick is that its context (the corpus)
# is the SAME every call, so it lives in the cacheable prefix.
# ---------------------------------------------------------------------------
def cost_rag(n: int, w: Workload, p: Pricing) -> dict:
    """Retrieve top-k per query; send only those chunks, fresh every time.
    Instructions are a stable prefix (cache once, read thereafter). The
    retrieved slice and the query are volatile, so they are fresh each call."""
    # instructions: one write, then (n-1) reads
    instr = w.instruction_tokens * p.cache_write + \
        w.instruction_tokens * p.cache_read * (n - 1)
    # retrieved slice + query: fresh on every one of the n calls
    per_query_fresh = (w.retrieved_tokens + w.query_tokens) * p.fresh_input
    input_cost = instr + per_query_fresh * n
    output_cost = w.answer_tokens * p.output * n
    return {"input": input_cost, "output": output_cost,
            "total": input_cost + output_cost}


def cost_long_context(n: int, w: Workload, p: Pricing) -> dict:
    """Stuff the whole corpus in on every request at the FRESH rate (the naive
    'just use the big window' baseline -- no caching at all). Instructions and
    corpus are re-read fresh every single call."""
    per_query_fresh = (w.instruction_tokens + w.corpus_tokens +
                       w.query_tokens) * p.fresh_input
    input_cost = per_query_fresh * n
    output_cost = w.answer_tokens * p.output * n
    return {"input": input_cost, "output": output_cost,
            "total": input_cost + output_cost}


def cost_cag(n: int, w: Workload, p: Pricing) -> dict:
    """Stuff the whole corpus in ONCE as a cacheable prefix (a write), then read
    it from cache on every subsequent call. This is the prompt-caching shadow of
    Cache-Augmented Generation: the corpus is the stable prefix; only the query
    is fresh. The instruction block sits in the same cacheable prefix."""
    prefix = w.instruction_tokens + w.corpus_tokens
    # the stable prefix: one write, then (n-1) cache reads
    prefix_cost = prefix * p.cache_write + prefix * p.cache_read * (n - 1)
    # the query is volatile -> fresh on every call
    query_cost = w.query_tokens * p.fresh_input * n
    input_cost = prefix_cost + query_cost
    output_cost = w.answer_tokens * p.output * n
    return {"input": input_cost, "output": output_cost,
            "total": input_cost + output_cost}


STRATEGIES = {
    "rag": cost_rag,
    "long_context": cost_long_context,
    "cag": cost_cag,
}


def table(n: int, w: Workload, p: Pricing) -> None:
    rows = {name: fn(n, w, p) for name, fn in STRATEGIES.items()}
    base = rows["rag"]["total"]
    header = (f"  {'strategy':<14}  {'input cost':>10}  {'output cost':>11}  "
              f"{'total':>8}   {'vs RAG':>6}")
    print(header)
    print("  " + "-" * (len(header) - 2))
    for name, c in rows.items():
        ratio = c["total"] / base if base else float("inf")
        print(f"  {name:<14}  {c['input']:>10.1f}  {c['output']:>11.1f}  "
              f"{c['total']:>8.1f}   {ratio:>5.2f}x")


def first_crossover(beats: str, against: str, w: Workload, p: Pricing,
                    cap: int = 100000) -> Optional[int]:
    """Smallest n at which strategy `beats` has a lower total than `against`."""
    for n in range(1, cap + 1):
        if STRATEGIES[beats](n, w, p)["total"] < \
                STRATEGIES[against](n, w, p)["total"]:
            return n
    return None


if __name__ == "__main__":
    line = "=" * 78
    p = Pricing()
    w = Workload()

    print(line)
    print("PROMPT-CACHING ECONOMICS  -  RAG vs long-context vs CAG")
    print(line)
    print("Pricing (relative cost units, per token):")
    print(f"  fresh input        {p.fresh_input:>6.3f}   "
          "(a token the model has never seen this call)")
    print(f"  cache write        {p.cache_write:>6.3f}   "
          "(first time a stable prefix is laid down)")
    print(f"  cache read         {p.cache_read:>6.3f}   "
          "(a token served from a cached prefix)")
    print(f"  output             {p.output:>6.3f}   "
          "(billed the same for every strategy)")
    print()
    print("Workload:")
    print(f"  corpus            {w.corpus_tokens:>6} tokens "
          "(small + stable: a candidate for CAG)")
    print(f"  query             {w.query_tokens:>6} tokens")
    print(f"  retrieved (top-k) {w.retrieved_tokens:>6} tokens "
          "(the slice RAG sends per query)")
    print(f"  answer            {w.answer_tokens:>6} tokens")
    print(f"  fixed instructions{w.instruction_tokens:>6} tokens "
          "(system prompt, stable prefix)")
    print()

    print("-" * 78)
    print("COST TO ANSWER 1 QUERY")
    print("-" * 78)
    table(1, w, p)
    print()
    print("  At 1 query, CAG is WORST: you paid the cache-write premium and "
          "got one read.")
    print("  The whole point of CAG is amortization, so 1 query is exactly "
          "the wrong test.")
    print()

    print("-" * 78)
    print("COST TO ANSWER 100 QUERIES (same stable corpus)")
    print("-" * 78)
    table(100, w, p)
    print()
    print("  Now CAG has amortized the write across 100 cache reads and "
          "overtaken RAG,")
    print("  while long_context (no caching) stays ~2.9x the bill. The corpus "
          "is small")
    print("  and stable, so CAG buys you long-context's simplicity below "
          "RAG's cost.")
    print()

    print("-" * 78)
    print("THE CROSSOVER  (where CAG total drops below long-context, and "
          "below RAG)")
    print("-" * 78)
    cag_vs_lc = first_crossover("cag", "long_context", w, p)
    cag_vs_rag = first_crossover("cag", "rag", w, p)
    if cag_vs_lc is not None:
        print(f"  CAG beats naive long-context after  {cag_vs_lc} query.")
    else:
        print("  CAG never beats naive long-context on this workload.")
    if cag_vs_rag is not None:
        print(f"  CAG beats RAG after {cag_vs_rag} queries.")
    else:
        r1 = cost_cag(1, w, p)["total"] / cost_rag(1, w, p)["total"]
        r100 = cost_cag(100, w, p)["total"] / cost_rag(100, w, p)["total"]
        print("  CAG never beats RAG on this workload (RAG sends far fewer "
              "input tokens),")
        print(f"  but it closes from {r1:.2f}x at 1 query to {r100:.2f}x "
              "at 100.")
    print()

    print("-" * 78)
    print("WHAT MOVES THE ANSWER: corpus size sweep (100 queries, "
          "cache read = 0.10x)")
    print("-" * 78)
    header = (f"  {'corpus tokens':>13}   {'rag total':>9}     "
              f"{'long_context':>12}     {'cag total':>9}     winner")
    print(header)
    print("  " + "-" * (len(header) - 2))
    for corpus in (1000, 4000, 16000, 64000, 256000):
        ws = Workload(corpus_tokens=corpus,
                      retrieved_tokens=w.retrieved_tokens,
                      query_tokens=w.query_tokens,
                      answer_tokens=w.answer_tokens,
                      instruction_tokens=w.instruction_tokens)
        totals = {name: fn(100, ws, p)["total"]
                  for name, fn in STRATEGIES.items()}
        winner = min(totals, key=totals.get)
        print(f"  {corpus:>13}   {totals['rag']:>9.1f}     "
              f"{totals['long_context']:>12.1f}     "
              f"{totals['cag']:>9.1f}     {winner}")
    print()
    print("  Reading the sweep:")
    print("    - long_context cost grows LINEARLY with corpus size on every "
          "query: it")
    print("      re-reads the whole corpus fresh each time. This is the "
          "'just stuff it'")
    print("      tax, and it is brutal as the corpus grows.")
    print("    - CAG grows too (the cached corpus is still read, at 0.1x, "
          "every query),")
    print("      but ~10x slower than long_context. For a SMALL stable corpus "
          "it is a")
    print("      great deal; for a large one the 0.1x reads still add up.")
    print("    - RAG stays cheapest here because it sends only the top-k "
          "slice. Its cost")
    print("      is driven by k, not by corpus size -- which is exactly why a "
          "massive")
    print("      corpus points at RAG.")
    print()
    print("So: small + stable + reused  -> CAG (or plain long-context if "
          "tiny).")
    print("    massive (or fast-moving)  -> RAG.")
    print("    The pricing here is RELATIVE units; swap in your provider's "
          "real rates and")
    print("    re-run before you decide. The crossover SHAPE is the lesson, "
          "not the digits.")
    print(line)
