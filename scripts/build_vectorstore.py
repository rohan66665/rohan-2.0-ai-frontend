# scripts/build_vectorstore.py
import os
import glob
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"
CHUNK_SIZE = 200
OVERLAP = 40

def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=OVERLAP):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i:i+chunk_size]
        chunks.append(" ".join(chunk))
        i += chunk_size - overlap
    return chunks

def load_documents(folder="data"):
    docs = []
    for file in glob.glob(os.path.join(folder, "*")):
        ext = os.path.splitext(file)[1].lower()
        if ext not in [".txt", ".md"]:
            continue
        with open(file, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                continue
            chunks = chunk_text(content)
            for cid, chunk in enumerate(chunks):
                docs.append({
                    "text": chunk,
                    "source": os.path.basename(file),
                    "chunk_id": cid
                })
    return docs

def build_vectorstore():
    print("Loading embedding model:", MODEL_NAME)
    model = SentenceTransformer(MODEL_NAME)

    print("Loading documents from data/")
    docs = load_documents("data")

    if not docs:
        print("❌ No documents found in data/. Add txt/md files then re-run.")
        return

    texts = [d["text"] for d in docs]
    print(f"Embedding {len(texts)} chunks...")

    embeddings = model.encode(texts, convert_to_numpy=True, show_progress_bar=True)

    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    norms[norms == 0] = 1
    embeddings = embeddings / norms

    vectorstore = {
        "embeddings": embeddings,
        "docs": docs,
        "texts": texts
    }

    with open("vectorstore.pkl", "wb") as f:
        pickle.dump(vectorstore, f)

    print("✅ Vectorstore saved to vectorstore.pkl")

if __name__ == "__main__":
    build_vectorstore()
