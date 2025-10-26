from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from typing import Dict, Optional
from ..db import get_session
from ..models import Note

router = APIRouter(prefix="/notes", tags=["notes"])

@router.get("/")
def list_notes(mindmap_id: Optional[int] = None, session: Session = Depends(get_session)):
    query = select(Note)
    if mindmap_id is not None:
        query = query.where(Note.mindmap_id == mindmap_id)
    query = query.order_by(Note.updated_at.desc())
    return session.exec(query).all()

@router.get("/{note_id}")
def get_note(note_id: int, session: Session = Depends(get_session)):
    return session.get(Note, note_id)

@router.post("/")
def create_note(payload: Dict, session: Session = Depends(get_session)):
    note = Note(
        mindmap_id=payload.get("mindmap_id"),
        title=str(payload.get("title", "Untitled Note")).strip() or "Untitled Note",
        content_md=str(payload.get("content_md", "")),
        tags=str(payload.get("tags", ""))
    )
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@router.put("/{note_id}")
def update_note(note_id: int, payload: Dict, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        return {"error": "Note not found"}
    
    if "title" in payload:
        note.title = str(payload["title"]).strip() or "Untitled Note"
    if "content_md" in payload:
        note.content_md = str(payload["content_md"])
    if "tags" in payload:
        note.tags = str(payload["tags"])
    
    note.updated_at = datetime.utcnow()
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@router.delete("/{note_id}")
def delete_note(note_id: int, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        return {"error": "Note not found"}
    
    session.delete(note)
    session.commit()
    return {"ok": True}
