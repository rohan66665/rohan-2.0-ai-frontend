# app/vector_store.py
import os
import pickle
from typing import Dict, List
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss

ROOT = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(ROOT, "data")
os.makedirs(DATA_DIR, exist_ok=True)

INDEX_PATH = os.path.join(DATA_DIR, "vector.index")
META_PATH = os.path.join(DATA_DIR, "metadata.pkl")

LOCAL_EMBED_MODEL = os.getenv("LOCAL_EMBED_MODEL", "all-MiniLM-L6-v2")
embedder = SentenceTransformer(LOCAL_EMBED_MODEL)


def _embed_texts(texts: List[str]) -> np.ndarray:
    embs = embedder.encode(texts, convert_to_numpy=True)
    norms = np.linalg.norm(embs, axis=1, keepdims=True)
    norms[norms == 0] = 1
    return embs / norms


def build_vectorstore(doc_texts: Dict[str, str]):
    texts = []
    metas = []

    for fn, txt in doc_texts.items():
        texts.append(txt)
        metas.append({"filename": fn, "text": txt})

    print("[vector-store] Embedding", len(texts), "documents")
    embs = _embed_texts(texts).astype("float32")

    dim = embs.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embs)

    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "wb") as f:
        pickle.dump(metas, f)

    print("[vector-store] Saved index & metadata")


def search(query: str, k=4):
    if not os.path.exists(INDEX_PATH):
        return []

    q_emb = _embed_texts([query]).astype("float32")
    index = faiss.read_index(INDEX_PATH)

    D, I = index.search(q_emb, k)
    with open(META_PATH, "rb") as f:
        metas = pickle.load(f)

    results = []
    for score, idx in zip(D[0], I[0]):
        if idx < 0 or idx >= len(metas):
            continue
        m = metas[int(idx)]
        results.append({
            "filename": m["filename"],
            "text": m["text"],
            "score": float(score)
        })

    return results
