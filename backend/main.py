import os
import sys
import time
import json
import shutil
import numpy as np
import soundfile as sf
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request, WebSocket
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

class SafeStaticFiles(StaticFiles):
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            if scope["type"] == "websocket":
                await send({"type": "websocket.close", "code": 1000})
            return
        await super().__call__(scope, receive, send)

# Setup correct console encoding on Windows to prevent UnicodeDecodeError
sys.stdout.reconfigure(encoding='utf-8')

app = FastAPI(title="OmniVoice Sandbox Playground API")

# Direct developer and standard origins for CORS mapping
DEV_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEV_ORIGINS + ["*"], # Open for standalone local usage safety
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
PLAYGROUND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "agy_tmp", "playground"))
REF_DIR = os.path.join(PLAYGROUND_DIR, "ref")
METADATA_FILE = os.path.join(PLAYGROUND_DIR, "metadata.json")
SPEAKERS_FILE = os.path.join(PLAYGROUND_DIR, "speakers.json")

os.makedirs(PLAYGROUND_DIR, exist_ok=True)
os.makedirs(REF_DIR, exist_ok=True)

def load_metadata():
    if not os.path.exists(METADATA_FILE):
        return []
    try:
        with open(METADATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_metadata(data):
    try:
        with open(METADATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[Playground API] Error saving metadata: {e}")

def load_speakers():
    if not os.path.exists(SPEAKERS_FILE):
        return {}
    try:
        with open(SPEAKERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def save_speakers(data):
    try:
        with open(SPEAKERS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[Playground API] Error saving speakers: {e}")

class GeneratePlaygroundRequest(BaseModel):
    text: str
    mode: str  # "instruct" or "clone"
    language: Optional[str] = "Auto"
    instruct: Optional[str] = None
    ref_audio_filename: Optional[str] = None
    ref_text: Optional[str] = None
    speed: Optional[float] = None
    duration: Optional[float] = None
    num_step: int = 32
    guidance_scale: float = 2.0
    denoise: bool = True
    postprocess_output: bool = True

class ApplyVoiceRequest(BaseModel):
    entry_id: str
    speaker: str
    mode: str # "clone" or "params"

# Router endpoints
router = APIRouter(prefix="/api/playground")

@router.get("/history")
async def get_playground_history():
    return load_metadata()

@router.post("/upload-ref")
async def upload_playground_ref(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".wav"):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận định dạng file .wav")
    
    filename = f"ref_{int(time.time())}_{file.filename}"
    file_path = os.path.join(REF_DIR, filename)
    
    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi lưu file upload: {e}")
        
    return {"filename": filename, "path": file_path}

@router.post("/generate")
async def generate_playground_voice(req: GeneratePlaygroundRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Văn bản không được để trống")
    
    filename = f"play_{int(time.time())}_{int(np.random.randint(1000, 9999))}.wav"
    output_path = os.path.join(PLAYGROUND_DIR, filename)
    
    ref_audio_path = None
    if req.mode == "clone" and req.ref_audio_filename:
        sandbox_path = os.path.join(REF_DIR, req.ref_audio_filename)
        if os.path.exists(sandbox_path):
            ref_audio_path = sandbox_path
        else:
            raise HTTPException(status_code=404, detail="Không tìm thấy file ref audio được yêu cầu")

    # Import state cleanly and fetch generator singleton
    from state import get_audio_generator
    audio_generator = get_audio_generator()
    
    try:
        t_start = time.time()
        
        audio = audio_generator.generate(
            text=req.text,
            ref_audio_path=ref_audio_path,
            ref_text=req.ref_text,
            instruct=req.instruct,
            speed=req.speed or 1.0,
            denoise=req.denoise,
            postprocess_output=req.postprocess_output,
            num_step=req.num_step,
            guidance_scale=req.guidance_scale,
            duration=req.duration
        )
        
        t_duration = time.time() - t_start
        
        # Save output audio
        sf.write(output_path, audio[0], 24000)
        
        # Read duration details
        info = sf.info(output_path)
        audio_len = info.frames / info.samplerate
        
    except Exception as e:
        print(f"[Playground API] Lỗi khi sinh âm thanh: {e}")
        if os.path.exists(output_path):
            os.remove(output_path)
        raise HTTPException(status_code=500, detail=f"Lỗi suy luận OmniVoice: {e}")
        
    # Save to JSON metadata
    new_entry = {
        "id": f"play_{int(time.time())}",
        "filename": filename,
        "text": req.text,
        "mode": req.mode,
        "language": req.language or "Auto",
        "instruct": req.instruct if req.mode == "instruct" else None,
        "ref_audio": req.ref_audio_filename if req.mode == "clone" else None,
        "ref_text": req.ref_text if req.mode == "clone" else None,
        "speed": req.speed or 1.0,
        "duration_limit": req.duration,
        "audio_duration": round(audio_len, 2),
        "num_step": req.num_step,
        "guidance_scale": req.guidance_scale,
        "denoise": req.denoise,
        "postprocess_output": req.postprocess_output,
        "generation_time": round(t_duration, 2),
        "timestamp": int(time.time())
    }
    
    history = load_metadata()
    history.insert(0, new_entry)
    save_metadata(history)
    
    return new_entry

@router.get("/audio/{filename}")
async def get_playground_audio(filename: str, request: Request):
    file_path = os.path.join(PLAYGROUND_DIR, filename)
    if not os.path.exists(file_path):
        # Look in ref directory as a fallback for custom uploads
        ref_path = os.path.join(REF_DIR, filename)
        if os.path.exists(ref_path):
            file_path = ref_path
        else:
            raise HTTPException(status_code=404, detail="Không tìm thấy file audio")
    
    origin = request.headers.get("origin", "*")
    return FileResponse(
        file_path,
        media_type="audio/wav",
        headers={"Access-Control-Allow-Origin": origin}
    )

@router.delete("/clear")
async def clear_playground_history():
    try:
        if os.path.exists(PLAYGROUND_DIR):
            shutil.rmtree(PLAYGROUND_DIR)
        os.makedirs(PLAYGROUND_DIR, exist_ok=True)
        os.makedirs(REF_DIR, exist_ok=True)
        save_metadata([])
        save_speakers({})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi dọn dẹp Sandbox: {e}")
    return {"status": "success"}

@router.delete("/delete/{id}")
async def delete_playground_entry(id: str):
    history = load_metadata()
    entry_to_remove = None
    for item in history:
        if item["id"] == id:
            entry_to_remove = item
            break
            
    if not entry_to_remove:
        raise HTTPException(status_code=404, detail="Không tìm thấy mục yêu cầu")
        
    file_path = os.path.join(PLAYGROUND_DIR, entry_to_remove["filename"])
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"[Playground API] Lỗi khi xóa file {file_path}: {e}")
            
    history = [item for item in history if item["id"] != id]
    save_metadata(history)
    return {"status": "success"}

@router.post("/apply-to-speaker")
async def apply_playground_voice(req: ApplyVoiceRequest):
    history = load_metadata()
    entry = None
    for item in history:
        if item["id"] == req.entry_id:
            entry = item
            break
            
    if not entry:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi thử nghiệm trong lịch sử")
        
    speakers = load_speakers()
    from state import normalize_speaker_id
    speaker_id = normalize_speaker_id(req.speaker)
    
    if req.mode == "clone":
        speakers[speaker_id] = {
            "mode": "clone",
            "ref_audio": entry["ref_audio"],
            "ref_text": entry["ref_text"]
        }
    else:
        speakers[speaker_id] = {
            "mode": "params",
            "instruct": entry["instruct"]
        }
        
    save_speakers(speakers)
    return {"status": "success"}

app.include_router(router)

# Dummy WebSocket route to quiet FlowKit extension connection attempts
@app.websocket("/ws/flowkit")
async def dummy_flowkit_websocket(websocket: WebSocket):
    await websocket.accept()
    await websocket.close(code=1000)

# Mount production React builds automatically if they exist
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", SafeStaticFiles(directory=frontend_dist, html=True), name="frontend")
    print(f"[Main Server] Automatically serving compiled frontend from: {frontend_dist}")
else:
    print("[Main Server] Frontend dist folder not found. API routes are active on port 8000, please run Vite dev server separately on port 5173.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
