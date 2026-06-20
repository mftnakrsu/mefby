"""
rag_maxsim.py  -  RAG from First Principles, Part 13 ("Late-Interaction Retrieval")

The whole point of late interaction in one runnable file: rank the same four
documents two ways for the query "E-4042 error", and watch the rankings
DISAGREE at the top. Pooled cosine (the Part 7 way, one vector per document)
buries the document that literally contains the code under a short generic
"error" distractor. MaxSim (one vector per token, then for each query token
take its best match over the doc tokens and sum) surfaces the exact-term
document instead. That disagreement is the entire lesson.

Run:
  python3 rag_maxsim.py                       # offline, deterministic, no network
  pip install sentence-transformers numpy     # optional: swap in a real model

Embedder note: by default this uses a transparent deterministic HASHING
embedder so the file runs on any machine with no model and no network. A hash
has no idea that "refund" and "reimbursement" are cousins the way a trained
model does; it exists only so the *shape* of late interaction is runnable and
inspectable. If sentence-transformers is installed, set USE_REAL_MODEL = True
to embed with all-MiniLM-L6-v2 instead. The exact decimals below come from the
hashing fallback; with a real model the magnitudes shift but the conclusion
(MaxSim flips the exact-term doc to the top) holds. Library and model names
move fast and I have a knowledge cutoff; treat them as a snapshot.
"""

import hashlib
import re

import numpy as np

# Flip to True to embed with a real model if sentence-transformers is installed.
USE_REAL_MODEL = False
DIM = 384  # all-MiniLM-L6-v2 width, so the two paths share a shape


# ---------------------------------------------------------------------------
# The same four-document support corpus the Part 13 prose uses. The first
# document is the exact-term doc: it buries the code E-4042 in a long batch-
# reconciliation report. The second is the short generic "error" distractor.
# ---------------------------------------------------------------------------
CORPUS = [
    "Our internal billing log emits the diagnostic identifier E-4042 during the "
    "nightly batch reconciliation run when a ledger entry fails to settle.",
    "A general error occurred while loading the page.",
    "Standard shipping takes three to five business days to most destinations.",
    "Refunds are accepted within 30 days of purchase if the item is unused.",
]

QUERY = "E-4042 error"


def tokenize(text):
    # split on non-alphanumerics, so the code E-4042 becomes the two tokens
    # `e` and `4042`, the way a real WordPiece tokenizer splits it (see the
    # Part 13 Diagram 1 caption). Identical tokens in query and doc then match.
    return re.findall(r"[a-z0-9]+", text.lower())


# ---------------------------------------------------------------------------
# Token embedding. token_embed(text) returns an (n_tokens, DIM) array: one
# vector per token, L2-normalized so a plain dot product reads as cosine.
# This is the multi-vector representation, in contrast to one pooled vector.
# ---------------------------------------------------------------------------
def _hash_vector(token):
    """Deterministic unit vector for a token. Identical tokens (the query's
    '4042' and a document's '4042') map to the SAME vector, so an exact match
    scores about 1.0. Honest about its limits: no synonym knowledge at all."""
    digest = hashlib.sha256(token.encode("utf-8")).digest()
    # stretch the 32-byte digest deterministically up to DIM floats
    raw = (digest * (DIM // len(digest) + 1))[:DIM]
    v = np.frombuffer(raw, dtype=np.uint8).astype(np.float64) - 127.5
    return v


if USE_REAL_MODEL:
    from sentence_transformers import SentenceTransformer

    _model = SentenceTransformer("all-MiniLM-L6-v2")  # check current model names

    def token_embed(text):
        # one row per token; embed each token on its own as a stand-in for the
        # transformer's per-token hidden states, then L2-normalize.
        toks = tokenize(text)
        vecs = _model.encode(toks, normalize_embeddings=True)
        return np.asarray(vecs, dtype=np.float64)
else:
    def token_embed(text):
        toks = tokenize(text)
        vecs = np.stack([_hash_vector(t) for t in toks])
        norms = np.linalg.norm(vecs, axis=1, keepdims=True)
        return vecs / norms  # L2-normalize: dot product IS cosine


def pooled_embed(text):
    """The Part 7 way: average the per-token vectors into ONE vector, then
    re-normalize. This is the step that dilutes a rare decisive token."""
    toks = token_embed(text)
    mean = toks.mean(axis=0)
    return mean / np.linalg.norm(mean)


# ---------------------------------------------------------------------------
# MaxSim: for each query token take the max cosine over all doc tokens, then
# sum. Inputs are L2-normalized (n_q, d) and (n_d, d), so the dot product IS
# cosine similarity. This is the entire late-interaction scoring rule.
# ---------------------------------------------------------------------------
def maxsim(query_vecs, doc_vecs):
    sims = query_vecs @ doc_vecs.T          # (n_q, n_d) pairwise cosine
    return float(sims.max(axis=1).sum())    # max over doc tokens, sum over query tokens


def rank(scores):
    """Doc indices sorted by score, best first."""
    return sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)


def show(title, ranked, scores):
    print(title)
    for r, i in enumerate(ranked, start=1):
        tag = ""
        if i == 0:
            tag = " [exact term]"
        elif i == 1:
            tag = " [DISTRACTOR]"
        print(f"  rank {r}  score={scores[i]:+.3f}  {CORPUS[i][:54]}...{tag}")
    print()


# ---------------------------------------------------------------------------
if __name__ == "__main__":
    path = "all-MiniLM-L6-v2" if USE_REAL_MODEL else "offline hashing fallback"
    print(f"Embedder path: {path}")
    print(f"Query: {QUERY!r}\n")

    q_tokens = token_embed(QUERY)
    q_pooled = pooled_embed(QUERY)

    # Rank 1: pooled cosine, one vector per document (Part 7).
    pooled_scores = [float(q_pooled @ pooled_embed(d)) for d in CORPUS]
    show("Ranking by POOLED cosine (one vector per doc, Part 7):",
         rank(pooled_scores), pooled_scores)

    # Rank 2: MaxSim, one vector per token (late interaction).
    maxsim_scores = [maxsim(q_tokens, token_embed(d)) for d in CORPUS]
    show("Ranking by MaxSim (token-level late interaction):",
         rank(maxsim_scores), maxsim_scores)

    # ColPali in miniature: keep maxsim unchanged, change what the doc tokens
    # ARE. A 4x4 grid of 16 deterministic vectors stands in for a page's patch
    # embeddings; the query stays ordinary text. Same maxsim call.
    rng = np.random.default_rng(13)
    page_patches = rng.standard_normal((16, DIM))
    page_patches /= np.linalg.norm(page_patches, axis=1, keepdims=True)
    page_query = token_embed("refund window policy")
    print("ColPali in miniature (same maxsim, doc tokens are page patches):")
    print(f"  toy page: {page_patches.shape[0]} patch vectors x {DIM} dims")
    print(f"  maxsim(query tokens, page patches) = {maxsim(page_query, page_patches):.3f}")


# ---------------------------------------------------------------------------
# Expected output (deterministic, offline hashing fallback):
#
# Embedder path: offline hashing fallback
# Query: 'E-4042 error'
#
# Ranking by POOLED cosine (one vector per doc, Part 7):
#   rank 1  score=+0.503  A general error occurred while loading the page.... [DISTRACTOR]
#   rank 2  score=+0.441  Our internal billing log emits the diagnostic identifi... [exact term]
#   rank 3  score=+0.022  Standard shipping takes three to five business days to...
#   rank 4  score=-0.161  Refunds are accepted within 30 days of purchase if the...
#
# Ranking by MaxSim (token-level late interaction):
#   rank 1  score=+2.269  Our internal billing log emits the diagnostic identifi... [exact term]
#   rank 2  score=+1.766  A general error occurred while loading the page.... [DISTRACTOR]
#   rank 3  score=+1.133  Standard shipping takes three to five business days to...
#   rank 4  score=+0.573  Refunds are accepted within 30 days of purchase if the...
#
# ColPali in miniature (same maxsim, doc tokens are page patches):
#   toy page: 16 patch vectors x 384 dims
#   maxsim(query tokens, page patches) = 0.253
#
# The rankings DISAGREE at the top, which is the whole lesson. Pooled cosine
# ranks the short generic "error" distractor FIRST (it shares the topical word
# and is short, so that word dominates its pooled vector). MaxSim flips it: the
# query tokens "e" and "4042" find their exact matches among the doc tokens, and
# the max rewards those strong hits no matter how much unrelated text surrounds
# them, so the exact-term doc wins. The distractor still matches "error" but
# cannot manufacture a "4042" it does not contain. The exact magnitudes are an
# artifact of this lightweight hashing stand-in (a hash has no synonym sense, and
# its all-positive byte structure inflates pooled cosines a little); with a real
# model the numbers shift but the rank inversion holds. The Part 13 prose shows
# the same example run through the repo's reference embedder, where pooling
# buries the exact-term doc one rank lower still.
# ---------------------------------------------------------------------------
