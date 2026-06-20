"""
Adaptive RAG: one classifier, three routes.
RAG from First Principles, Part 15. The conductor in front of the pipelines we
built across Parts 6 to 10. A tiny deterministic complexity classifier reads
cheap signals from the query and routes it down the cheapest path that can still
answer it:

  - none   : small talk or a fact the model already holds. NO retrieval. A
             templated reply. The cheapest path (Part 6 lookup deliberately skipped).
  - single : the Part 6 retrieve-then-generate loop. One lookup, one answer.
  - multi  : the Part 10 decompose-retrieve-synthesize shape. Split the query into
             sub-queries, retrieve each separately, synthesize one answer.

Everything here is mocked deliberately. There is no real LLM call: "generate" is
a templated string that names the chunk it is grounded in. The load-bearing part
is the CONTROL FLOW (the classifier, the three-way dispatch, the decomposition
and per-sub-query retrieval in the multi route), not the toy similarity scores.

Run:
  python rag_router.py

If sentence-transformers is installed (as in the run that produced the Expected
output below) it uses real embeddings, so each single/multi sub-query lands on
the semantically nearest chunk. Without it, the file falls back to a tiny lexical
hashing embedder so it still RUNS on numpy alone; the retrieved chunk may then be
crude, but the ROUTE each query takes is identical either way, because the route
comes from classify_complexity, which never touches embeddings.
"""

import re

import numpy as np

# ---------------------------------------------------------------------------
# Embedding: a real model if available, else a tiny deterministic hashing
# embedder so the file runs on numpy alone (same fallback pattern as the other
# companions in this series). Only the control flow below is the point.
# ---------------------------------------------------------------------------
try:
    from sentence_transformers import SentenceTransformer

    _model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed(texts):
        return _model.encode(texts, normalize_embeddings=True)

    BACKEND = "sentence-transformers"

except Exception:  # no model / no network: deterministic bag-of-hashed-words
    import hashlib

    _DIM = 1024  # wide enough that distinct words rarely collide

    def _bucket(token):
        # a STABLE hash (process-independent), unlike the builtin hash()
        return int(hashlib.md5(token.encode()).hexdigest(), 16) % _DIM

    def embed(texts):
        out = np.zeros((len(texts), _DIM), dtype=float)
        for i, t in enumerate(texts):
            for tok in re.findall(r"[a-z0-9]+", t.lower()):  # drop punctuation
                out[i, _bucket(tok)] += 1.0
        norms = np.linalg.norm(out, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        return out / norms

    BACKEND = "offline-hashing-fallback"


# ---------------------------------------------------------------------------
# The support knowledge base, reused from the earlier parts. The refund,
# warranty, E-4042, and shipping chunks are the running example of the series.
# ---------------------------------------------------------------------------
KNOWLEDGE_BASE = [
    "Refunds are accepted within 30 days of purchase, provided the item is unused and in its original packaging.",
    "All electronics include a one-year limited warranty covering manufacturing defects.",
    "Error E-4042 means the payment was declined; re-enter the card details or use a different card, then retry checkout.",
    "Standard shipping takes 3 to 5 business days; express shipping arrives the next business day.",
]


def retrieve(query, k=1):
    """Embed the query, score by cosine similarity against every chunk, keep top-k.
    Same retriever shape as Part 6; here k defaults to 1 (one chunk per lookup)."""
    qv = embed([query])[0]
    mv = embed(KNOWLEDGE_BASE)
    scores = mv @ qv
    order = np.argsort(-scores)[:k]
    return [(KNOWLEDGE_BASE[i], float(scores[i])) for i in order]


# ---------------------------------------------------------------------------
# THE COMPLEXITY CLASSIFIER. This is the function reproduced verbatim in the
# essay; it is the only part of the routing logic that is not free to vary,
# because every routing decision in Part 15 comes straight out of it.
# ---------------------------------------------------------------------------
def classify_complexity(query: str) -> str:
    q = query.lower().strip()
    if re.search(r"\b(hi|hello|thanks|who are you)\b", q) or len(q.split()) <= 2:
        return "none"
    multi_signals = ("compare", "versus", " vs ", "difference between",
                     " and then", "across", "each of", "both", "trade-off")
    if any(s in q for s in multi_signals) or q.count("?") > 1:
        return "multi"
    return "single"


# ---------------------------------------------------------------------------
# Decomposition for the multi route. The essay's contrast with Part 8 matters
# here: a bare "and" only SPLITS a query that already routed multi; it is not
# itself a routing signal. We split on comparison/conjunction connectives and
# strip the comparative framing so each sub-query is a plain lookup.
# ---------------------------------------------------------------------------
def decompose(query: str):
    q = query.strip().rstrip("?.")
    q = re.sub(r"^(what is|whats|what's) the difference between\s+", "", q, flags=re.I)
    q = re.sub(r"^compare\s+", "", q, flags=re.I)
    q = re.sub(r",?\s*and explain the difference$", "", q, flags=re.I)
    parts = re.split(r"\s+(?:and then|versus|vs\.?|and|,)\s+", q, flags=re.I)
    subs = [p.strip() for p in parts if p.strip()]
    # Turn each fragment back into a question so it retrieves like a normal lookup.
    return [f"What is the {s}?" if not s.lower().startswith("how") else s for s in subs]


# ---------------------------------------------------------------------------
# A mocked generator. No real LLM call: it names the chunk(s) it is grounded in,
# so the Expected output shows exactly which evidence each route gathered.
# ---------------------------------------------------------------------------
def generate(label, evidence):
    if not evidence:
        return f"[{label}] (no context retrieved)"
    grounded = " | ".join(repr(e) for e in evidence)
    return f"[{label}] grounded in: {grounded}"


# ---------------------------------------------------------------------------
# THE ROUTER. Classify, then dispatch to the matching pipeline:
#   none   -> templated reply, NO retrieval (the index is never touched).
#   single -> retrieve-then-generate (the Part 6 loop), one lookup.
#   multi  -> decompose -> retrieve EACH sub-query -> synthesize (the Part 10 shape).
# Returns (route, answer, retrievals) so the demo can show the work.
# ---------------------------------------------------------------------------
def route(query: str):
    r = classify_complexity(query)

    if r == "none":
        # Recognize we did NOT need the Part 6 lookup. Reply directly.
        return r, "[none] Hi! How can I help with your order today?", 0

    if r == "single":
        hits = retrieve(query, k=1)              # one lookup answers it
        answer = generate("single", [t for t, _ in hits])
        return r, answer, len(hits)

    # multi: split the one hard query into simpler sub-queries, retrieve each
    # independently, then synthesize the gathered evidence into one answer.
    subs = decompose(query)
    gathered, n_retrievals = [], 0
    for sub in subs:
        hits = retrieve(sub, k=1)
        n_retrievals += len(hits)
        if hits:
            gathered.append(hits[0][0])
    answer = generate("multi", gathered)
    return r, answer, n_retrievals


if __name__ == "__main__":
    # The six demo queries the prose lists: two per class.
    DEMO = [
        # none: small talk, never touches the index.
        "Hi there",
        "thanks",
        # single: a plain factual lookup, one retrieval each.
        "What is our refund window?",
        "How do I fix the E-4042 error?",
        # multi: comparisons, decomposed into two sub-queries each.
        "Compare the refund window and the warranty period, and explain the difference",
        "What is the difference between the refund window and the warranty period?",
    ]

    print(f"backend: {BACKEND}\n")
    for q in DEMO:
        r, answer, n = route(q)
        print(f"Q: {q}")
        print(f"   route={r}  retrievals={n}")
        print(f"   {answer}\n")

    # Confirm the routes match what the prose states.
    expected = {
        "Hi there": "none",
        "thanks": "none",
        "What is our refund window?": "single",
        "How do I fix the E-4042 error?": "single",
        "Compare the refund window and the warranty period, and explain the difference": "multi",
        "What is the difference between the refund window and the warranty period?": "multi",
    }
    ok = all(classify_complexity(q) == want for q, want in expected.items())
    print("all six routes match the prose:", ok)

# Expected output (with sentence-transformers installed):
# backend: sentence-transformers
#
# Q: Hi there
#    route=none  retrievals=0
#    [none] Hi! How can I help with your order today?
#
# Q: thanks
#    route=none  retrievals=0
#    [none] Hi! How can I help with your order today?
#
# Q: What is our refund window?
#    route=single  retrievals=1
#    [single] grounded in: 'Refunds are accepted within 30 days of purchase, provided the item is unused and in its original packaging.'
#
# Q: How do I fix the E-4042 error?
#    route=single  retrievals=1
#    [single] grounded in: 'Error E-4042 means the payment was declined; re-enter the card details or use a different card, then retry checkout.'
#
# Q: Compare the refund window and the warranty period, and explain the difference
#    route=multi  retrievals=2
#    [multi] grounded in: 'Refunds are accepted within 30 days of purchase, provided the item is unused and in its original packaging.' | 'All electronics include a one-year limited warranty covering manufacturing defects.'
#
# Q: What is the difference between the refund window and the warranty period?
#    route=multi  retrievals=2
#    [multi] grounded in: 'Refunds are accepted within 30 days of purchase, provided the item is unused and in its original packaging.' | 'All electronics include a one-year limited warranty covering manufacturing defects.'
#
# all six routes match the prose: True
#
# The routes are deterministic: they come from classify_complexity, which never
# touches embeddings, so the offline fallback takes the SAME six routes. Only the
# similarity scores (and so, in the crude fallback, possibly which chunk a lookup
# lands on) differ between backends; the route labels do not.
