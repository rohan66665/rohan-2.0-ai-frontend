# app/rag_pipeline.py
import traceback
from app.vector_store import search
from app.groq_llm import call_groq_llm

def get_context(query: str):
    try:
        results = search(query)
        combined = ""
        sources = []

        for r in results:
            combined += f"[File: {r['filename']}] {r['text']}\n\n"
            sources.append({
                "filename": r["filename"],
                "text": r["text"][:150],
                "score": r["score"],
            })

        return combined.strip(), sources
    except Exception as e:
        print("get_context error:", e)
        traceback.print_exc()
        return "", []


def answer_rag(query: str, context_text: str):
    system_prompt = "You are Rohan 2.0 AI assistant. Use the context strictly."
    user_prompt = f"Context:\n{context_text}\n\nQuestion: {query}"

    try:
        return call_groq_llm(system_prompt, user_prompt)
    except Exception as e:
        print("LLM error:", e)
        traceback.print_exc()
        return f"LLM Error: {str(e)}"
