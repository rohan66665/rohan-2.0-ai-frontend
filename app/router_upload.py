# app/router_upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from pathlib import Path

UPLOAD_DIR = Path(__file__).resolve().parent / "data" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter()

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    try:
        saved = []
        for f in files:
            dest = UPLOAD_DIR / f.filename
            content = await f.read()
            dest.write_bytes(content)
            saved.append(f.filename)

        # yahan baad me vector_store ko update kar sakte ho agar zarurat ho
        # e.g. index_new_files(saved_paths)

        return {"status": "ok", "files": saved}
    except Exception as e:
        print("Upload error:", e)
        raise HTTPException(status_code=500, detail="Upload failed")
