# app/llm_client.py
from dotenv import load_dotenv
import os, requests, json, time

# load .env from project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_BASE = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
# model env name: set in .env to a supported Groq model (recommended: llama3-70b-8192 or mixtral-8x7b-32768)
GROQ_LLM_MODEL = os.getenv("GROQ_LLM_MODEL", "llama3-70b-8192")

if not GROQ_API_KEY:
    raise RuntimeError("❌ GROQ_API_KEY missing in .env")

HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

CHAT_URL = f"{GROQ_BASE}/chat/completions"  # compatible endpoint

def generate_answer(prompt: str, model: str = None) -> str:
    """Non-streaming LLM call returning final string"""
    model = model or GROQ_LLM_MODEL
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 800,
        "temperature": 0.0,
    }
    try:
        r = requests.post(CHAT_URL, json=payload, headers=HEADERS, timeout=60)
    except Exception as e:
        return f"❌ LLM request failed: {e}"

    if r.status_code != 200:
        return f"❌ LLM Error {r.status_code} → {r.text}"

    try:
        body = r.json()
        return body["choices"][0]["message"]["content"]
    except Exception as e:
        return f"❌ LLM parse error: {e} - response: {r.text}"


def generate_stream(prompt: str, model: str = None):
    """Generator streaming tokens/chunks for frontend streaming UI"""
    model = model or GROQ_LLM_MODEL
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": True,
        "max_tokens": 800,
        "temperature": 0.0,
    }
    try:
        with requests.post(CHAT_URL, json=payload, headers=HEADERS, stream=True, timeout=300) as r:
            if r.status_code != 200:
                yield f"❌ LLM Error {r.status_code} → {r.text}"
                return
            # Groq/OpenAI streaming returns lines prefixed with "data: "
            for line in r.iter_lines(decode_unicode=True):
                if not line:
                    continue
                text = line.strip()
                # Each event line usually like: data: {...}
                if text.startswith("data:"):
                    data = text[len("data:"):].strip()
                else:
                    data = text
                if data in ("[DONE]", ""):
                    break
                try:
                    obj = json.loads(data)
                    # Try to get chunk content
                    # OpenAI-style: obj["choices"][0]["delta"].get("content")
                    choices = obj.get("choices") or []
                    if choices:
                        delta = choices[0].get("delta", {})
                        content = delta.get("content")
                        if content:
                            yield content
                except Exception:
                    # fallback: yield raw text chunk
                    yield data
    except Exception as e:
        yield f"❌ LLM streaming failed: {e}"
