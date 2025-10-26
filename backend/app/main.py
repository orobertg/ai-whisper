from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db
from .routes import notes, blueprints, mindmaps, chat, evaluate, folders, suggestions

app = FastAPI(title="AI Whisper API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def _startup():
    init_db()

app.include_router(folders.router)
app.include_router(notes.router)
app.include_router(blueprints.router)
app.include_router(mindmaps.router)
app.include_router(chat.router)
app.include_router(suggestions.router)
app.include_router(evaluate.router)

@app.get("/healthz")
def healthz():
    return {"ok": True}
