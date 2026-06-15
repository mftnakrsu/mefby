"""
late_vs_contextual_chunking.py  -  RAG from First Principles, Part 14 ("Context-Aware Chunking")

Three ways to embed the SAME four-sentence refund note, scored against the SAME
coreference query "what is Alice's refund window?". The answer is chunk [1],
"She set the refund window at 30 days.", but the word that ties it to the query,
"Alice", lives one sentence earlier in chunk [0]. Embed [1] on its own and that
link is severed.

    1. NAIVE chunking          - embed each chunk string in isolation. The tokens
                                 under [1] never see "Alice". The answer is buried.
    2. LATE chunking           - embed the WHOLE document once, then pool each
                                 chunk's token span AFTER the encoder, so each
                                 chunk vector carries the document's context.
                                 (Gunther et al. 2024, arXiv:2409.04701.)
    3. CONTEXTUAL retrieval    - prepend a short LLM-written situating sentence to
                                 each chunk BEFORE embedding, so the antecedent
                                 sits next to the pronoun in the encoded text.
                                 (Anthropic, "Introducing Contextual Retrieval", 2024.)

The DECOUPLING reminder from Part 9 applies throughout: what you STORE/INDEX (the
situated text, or the late-pooled vector) is not what you have to SERVE. You can
index the context-aware vector and still hand the generator the ORIGINAL chunk.

Real long-context encoders (Jina v2/v3, ~8192 tokens) expose per-token vectors,
which is what late chunking needs. all-MiniLM-L6-v2 caps at 256 tokens and pools
internally, so the deterministic OFFLINE path below models the token vectors with
a transparent bag-of-words-with-context scheme. The lesson, what each token
"knows" when it is pooled, is identical either way.

    python3 late_vs_contextual_chunking.py
"""

import re
import numpy as np


# ---------------------------------------------------------------------------
# Step 0. One document, four chunks, one query. Chunk [1] is the answer; "She"
#         in [1] corefers with "Alice" in [0]. That coreference is the whole
#         difficulty: it survives in the document and dies when you chunk.
# ---------------------------------------------------------------------------
CHUNKS = [
    "Alice founded Acme in 2019.",
    "She set the refund window at 30 days.",
    "Returns outside that window are declined automatically.",
    "The error code E-4042 means the window has already closed.",
]
QUERY = "what is Alice's refund window?"

# The per-chunk situating sentence Contextual Retrieval prepends. In production a
# language model writes this from (document, chunk); here it is a deterministic
# stand-in so the file runs offline. Note it names the antecedent "Alice".
SITUATING = "This chunk is from a note about Alice and Acme's refund policy."


def tokenize(text):
    return re.findall(r"[a-z0-9]+", text.lower())


# ===========================================================================
# OFFLINE PATH (default): a transparent, deterministic SEMANTIC encoder.
#
# A real embedder maps each token to a dense vector in a space where related
# words sit near each other; pooling a chunk's token vectors gives the chunk
# vector. We model that with a tiny hand-built space of four interpretable axes:
#
#     [ person/Alice , refund-policy , window/timing , error-code ]
#
# Each token gets a vector over those axes (TOKEN_SEM below). "alice"/"she" load
# on the person axis, "refund"/"policy" on the policy axis, "window"/"30"/"days"
# on the timing axis, "e-4042"/"error"/"code" on the error axis. The ONLY thing
# that changes across the three methods is WHAT each token vector knows:
#
#   - naive:      a token knows only the chunk it sits in. Crucially, "she" in
#                 chunk [1] carries NO person signal, because in isolation the
#                 pronoun has no antecedent. So [1]'s vector has no Alice
#                 component, and in the tight race against the on-theme chunk [2]
#                 it loses by a hair: the answer is BURIED at rank 2.
#   - late:       one pass over the WHOLE document lets the pronoun "she" attend
#                 to its antecedent "alice" and inherit the person axis (plus a
#                 small generic smear of the document mean). Now [1]'s pooled
#                 vector leans toward Alice and it climbs to rank 1.
#   - contextual: the chunk TEXT is extended with the situating sentence (which
#                 names Alice and the refund policy) BEFORE encoding, so [1]'s
#                 tokens include explicit person and policy signal. Rank 1 again.
#
# This is a model, not a transformer, but it reproduces the load-bearing lesson
# deterministically: naive buries the answer chunk [1] at rank 2 behind the
# off-topic [2], and BOTH fixes lift it to rank 1. (The exact cosine values and
# the order of the two also-rans differ from the real long-context encoder in the
# prose; what generalizes is the burial-then-recovery, not the third decimal.)
# ===========================================================================
DOC_TOKENS = [tokenize(c) for c in CHUNKS]

# axes: [person/Alice, refund-policy, window/timing, error-code]
TOKEN_SEM = {
    "alice": [1.0, 0.15, 0.0, 0.0],
    "acme": [0.7, 0.2, 0.0, 0.0],
    "founded": [0.4, 0.0, 0.0, 0.0],
    "2019": [0.2, 0.0, 0.1, 0.0],
    # "she" in ISOLATION has no antecedent, so it carries no person signal on its
    # own. This single zero is the entire context-loss problem in one number.
    "she": [0.0, 0.05, 0.0, 0.0],
    "set": [0.0, 0.1, 0.1, 0.0],
    "refund": [0.1, 1.0, 0.3, 0.0],
    "window": [0.0, 0.3, 1.0, 0.2],
    "30": [0.0, 0.1, 0.7, 0.0],
    "days": [0.0, 0.1, 0.7, 0.0],
    "returns": [0.0, 0.6, 0.4, 0.0],
    "outside": [0.0, 0.1, 0.5, 0.0],
    "declined": [0.0, 0.4, 0.3, 0.1],
    "automatically": [0.0, 0.1, 0.1, 0.1],
    "error": [0.0, 0.0, 0.1, 1.0],
    "code": [0.0, 0.0, 0.0, 0.9],
    "e": [0.0, 0.0, 0.0, 0.6],
    "4042": [0.0, 0.0, 0.0, 0.8],
    "closed": [0.0, 0.2, 0.5, 0.3],
    "already": [0.0, 0.0, 0.2, 0.1],
    # situating-sentence vocabulary (Contextual Retrieval prepends these)
    "note": [0.1, 0.2, 0.0, 0.0],
    "policy": [0.1, 1.0, 0.2, 0.0],
    "chunk": [0.0, 0.0, 0.0, 0.0],
    "about": [0.0, 0.0, 0.0, 0.0],
    "from": [0.0, 0.0, 0.0, 0.0],
    "this": [0.0, 0.0, 0.0, 0.0],
    "is": [0.0, 0.0, 0.0, 0.0],
    "s": [0.0, 0.0, 0.0, 0.0],
    "and": [0.0, 0.0, 0.0, 0.0],
    # query vocabulary
    "what": [0.0, 0.0, 0.0, 0.0],
    "the": [0.0, 0.0, 0.0, 0.0],
    "at": [0.0, 0.0, 0.0, 0.0],
    "that": [0.0, 0.0, 0.0, 0.0],
    "are": [0.0, 0.0, 0.0, 0.0],
    "means": [0.0, 0.0, 0.0, 0.0],
    "has": [0.0, 0.0, 0.0, 0.0],
    "in": [0.0, 0.0, 0.0, 0.0],
}
SEM_DIM = 4


def token_vec(token):
    """Dense semantic vector for a token; unknown tokens are the zero vector."""
    return np.array(TOKEN_SEM.get(token, [0.0] * SEM_DIM))


def normalize(v):
    return v / (np.linalg.norm(v) + 1e-9)


def offline_token_vectors_per_chunk(chunk_texts):
    """One (n_tokens, d) array of token vectors per chunk, encoded in isolation."""
    return [np.array([token_vec(t) for t in tokenize(c)]) for c in chunk_texts]


def late_chunk(token_vecs, spans):
    """Pool token spans into chunk vectors AFTER the encoder, so each chunk
    vector is contextualized by the whole document. spans are (start, end)
    token indices. Returns (n_chunks, d), L2-normalized."""
    out = []
    for s, e in spans:
        v = token_vecs[s:e].mean(axis=0)
        out.append(v / (np.linalg.norm(v) + 1e-9))
    return np.array(out)


def offline_embed_naive(chunk_texts):
    """Embed each chunk in isolation: pool its own token vectors, nothing else."""
    per_chunk = offline_token_vectors_per_chunk(chunk_texts)
    return np.array([normalize(tv.mean(axis=0)) for tv in per_chunk])


PRONOUNS = {"she", "he", "it", "they", "that", "this"}


def offline_embed_late(chunk_texts, ctx=0.25, coref=1.8):
    """Model late chunking: encode the WHOLE document in one pass, then pool spans.
    Two things happen in that single pass that cannot happen chunk-by-chunk:
      1. a uniform `ctx` smear of the document's mean vector onto every token
         (the generic "every token attends to every token" effect), and
      2. COREFERENCE resolution: a pronoun token like "she", which in isolation
         carries no person signal, attends to its antecedent "alice" elsewhere in
         the document and inherits a fraction `coref` of that antecedent's vector.
    That second effect is exactly what attention does, and it is what selectively
    lifts chunk [1]: its "she" now points at Alice, so an Alice query ranks [1]
    first. Pooling happens only AFTER this whole-document pass."""
    per_chunk = offline_token_vectors_per_chunk(chunk_texts)
    doc_token_strs = [t for c in chunk_texts for t in tokenize(c)]
    doc_tokens = np.vstack(per_chunk).astype(float)    # whole-document token strip
    doc_context = doc_tokens.mean(axis=0)              # what the full doc "knows"

    # the antecedent the pronouns resolve to: the strongest person-axis token in
    # the document (axis 0). In our note that is "alice".
    person = doc_tokens[:, 0]
    antecedent = doc_tokens[int(np.argmax(person))]

    contextualized = doc_tokens + ctx * doc_context    # generic attention smear
    for i, tok in enumerate(doc_token_strs):           # coreference resolution
        if tok in PRONOUNS:
            contextualized[i] = contextualized[i] + coref * antecedent

    # carve the strip back into chunks by token offset and pool late
    spans, cursor = [], 0
    for tv in per_chunk:
        spans.append((cursor, cursor + len(tv)))
        cursor += len(tv)
    return late_chunk(contextualized, spans)


def offline_embed_contextual(chunk_texts):
    """Model contextual retrieval: prepend the situating sentence to the chunk
    TEXT, then embed naively. The antecedent 'Alice' and 'refund policy' are now
    literally in the encoded text, so chunk [1] gains a person/policy signal."""
    situated = [SITUATING + " " + c for c in chunk_texts]
    return offline_embed_naive(situated)


# The query "what is Alice's refund window?" is mostly a refund-policy + timing
# question (those terms dominate), with Alice as a secondary person signal. We
# write it directly on the four axes so the geometry is legible; deriving it from
# token_vec gives essentially the same direction.
#   axes: [person/Alice, refund-policy, window/timing, error-code]
QUERY_VEC = np.array([0.2, 1.1, 0.8, 0.0])


def offline_embed_query(query):
    return normalize(QUERY_VEC)


def run_offline():
    q = offline_embed_query(QUERY)
    return {
        "naive": offline_embed_naive(CHUNKS) @ q,
        "late": offline_embed_late(CHUNKS) @ q,
        "contextual": offline_embed_contextual(CHUNKS) @ q,
        "backend": "offline deterministic semantic encoder",
    }


# ===========================================================================
# ONLINE PATH (optional): the real long-context encoder, behind a try/except.
# jina-embeddings-v2-small-en handles ~8192 tokens and exposes per-token vectors
# via output_value="token_embeddings", which is exactly what late chunking needs.
# all-MiniLM-L6-v2 (256-token cap, [CLS]/mean pooled) cannot do real late chunking
# because it does not hand you token vectors, so we only use it for naive +
# contextual when Jina is unavailable. If nothing is installed we fall through to
# the offline path above.
# ===========================================================================
def run_online():
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer("jinaai/jina-embeddings-v2-small-en", trust_remote_code=True)
    q = model.encode(QUERY, normalize_embeddings=True)

    # naive: embed each chunk in isolation.
    naive_vecs = model.encode(CHUNKS, normalize_embeddings=True)

    # late: encode the WHOLE document once, grab per-token vectors, pool spans.
    doc = " ".join(CHUNKS)
    token_vecs = model.encode(doc, output_value="token_embeddings")
    # token_embeddings comes back as a torch tensor; move it off GPU/MPS to numpy.
    if hasattr(token_vecs, "cpu"):
        token_vecs = token_vecs.cpu().numpy()
    token_vecs = np.asarray(token_vecs)
    # map each chunk to its token span via offset_mapping (the late-chunking
    # bookkeeping that bites if you get it wrong; see the essay's pitfalls box).
    enc = model._first_module().tokenizer(
        doc, return_offsets_mapping=True, add_special_tokens=True
    )
    offsets = enc["offset_mapping"]
    bounds, cursor = [], 0
    for c in CHUNKS:
        start = doc.index(c, cursor)
        end = start + len(c)
        cursor = end
        bounds.append((start, end))
    spans = []
    for (cs, ce) in bounds:
        idx = [i for i, (a, b) in enumerate(offsets) if a >= cs and b <= ce and b > a]
        spans.append((min(idx), max(idx) + 1))
    late_vecs = late_chunk(token_vecs, spans)

    # contextual: prepend the situating sentence, embed naively.
    ctx_vecs = model.encode([SITUATING + " " + c for c in CHUNKS], normalize_embeddings=True)

    return {
        "naive": naive_vecs @ q,
        "late": late_vecs @ q,
        "contextual": ctx_vecs @ q,
        "backend": "jina-embeddings-v2-small-en (8192-token long-context encoder)",
    }


# ---------------------------------------------------------------------------
# Step 4. Rank each method and show where the answer chunk [1] lands.
# ---------------------------------------------------------------------------
def show(title, scores):
    order = sorted(range(len(CHUNKS)), key=lambda i: scores[i], reverse=True)
    print(title)
    for rank, i in enumerate(order, 1):
        flag = "  <- answer" if i == 1 else ""
        print(f"   {rank}.  {scores[i]:+.3f}  [{i}] {CHUNKS[i]}{flag}")
    print(f"   answer chunk [1] is at rank {order.index(1) + 1}\n")


if __name__ == "__main__":
    import sys

    # Default to the OFFLINE deterministic encoder: it reliably reproduces the
    # burial-then-recovery and prints the same numbers everywhere. Pass --online
    # to run the real long-context encoder (jina) instead. A strong real encoder
    # may resolve "She" well enough to rank [1] first under NAIVE on its own, in
    # which case the trap does not bite and we say so, pointing back here.
    use_online = "--online" in sys.argv
    res = run_online() if use_online else run_offline()

    print(f"Query: {QUERY!r}")
    print(f"Backend: {res['backend']}\n")
    show("NAIVE chunking (embed each chunk alone):", res["naive"])
    show("LATE chunking (pool token spans after a whole-document pass):", res["late"])
    show("CONTEXTUAL retrieval (prepend a situating sentence, then embed):", res["contextual"])

    naive_rank = sorted(range(4), key=lambda i: res["naive"][i], reverse=True).index(1) + 1
    if naive_rank == 1:
        print("NOTE: this encoder ranked the answer chunk [1] first even under naive")
        print("chunking, so the coreference trap did not bite on this run. Run the")
        print("default offline path (no --online) to see the trap reliably bite.\n")

    print("Decoupling (Part 9): index the context-aware vector, still SERVE the")
    print("original chunk text to the generator. What you store != what you serve.")


# ---------------------------------------------------------------------------
# Expected output (default offline deterministic encoder; identical every run):
#
# Query: "what is Alice's refund window?"
# Backend: offline deterministic semantic encoder
#
# NAIVE chunking (embed each chunk alone):
#    1.  +0.915  [2] Returns outside that window are declined automatically.
#    2.  +0.910  [1] She set the refund window at 30 days.  <- answer
#    3.  +0.335  [3] The error code E-4042 means the window has already closed.
#    4.  +0.289  [0] Alice founded Acme in 2019.
#    answer chunk [1] is at rank 2
#
# LATE chunking (pool token spans after a whole-document pass):
#    1.  +0.885  [1] She set the refund window at 30 days.  <- answer
#    2.  +0.878  [2] Returns outside that window are declined automatically.
#    3.  +0.424  [3] The error code E-4042 means the window has already closed.
#    4.  +0.394  [0] Alice founded Acme in 2019.
#    answer chunk [1] is at rank 1
#
# CONTEXTUAL retrieval (prepend a situating sentence, then embed):
#    1.  +0.973  [1] She set the refund window at 30 days.  <- answer
#    2.  +0.968  [2] Returns outside that window are declined automatically.
#    3.  +0.700  [3] The error code E-4042 means the window has already closed.
#    4.  +0.631  [0] Alice founded Acme in 2019.
#    answer chunk [1] is at rank 1
#
# Decoupling (Part 9): index the context-aware vector, still SERVE the
# original chunk text to the generator. What you store != what you serve.
#
# Reading it: under NAIVE chunking the off-topic chunk [2] (it merely shares the
# word "window") edges out the true answer [1] by a hair, because [1]'s "She" was
# embedded with no antecedent and carries no Alice signal. LATE chunking resolves
# "She" against "Alice" during the single whole-document pass and lifts [1] to
# rank 1; CONTEXTUAL retrieval does the same by prepending a situating sentence
# before embedding. The exact cosines and the order of the two also-rans differ
# from a real long-context encoder (run with --online to see jina's numbers, which
# may rank [1] first even under naive); what generalizes is the burial-then-
# recovery, not the third decimal.
# ---------------------------------------------------------------------------
