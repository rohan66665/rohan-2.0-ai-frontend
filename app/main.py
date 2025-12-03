# app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

print("🔍 Loading ENV from:", ENV_PATH)
if os.path.exists(ENV_PATH):
    load_dotenv(ENV_PATH)
else:
    print("❌ .env NOT FOUND")

print("🔑 GROQ Key Loaded:", os.getenv("GROQ_API_KEY"))

from app.router_chat import router as chat_router
from app.router_upload import router as upload_router

app = FastAPI(title="Rohan 2.0 — AI Chatbot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
