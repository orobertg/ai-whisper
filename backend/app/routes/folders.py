from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from typing import Dict
from ..db import get_session
from ..models import Folder

router = APIRouter(prefix="/folders", tags=["folders"])

@router.get("/")
def list_folders(session: Session = Depends(get_session)):
    """List all folders"""
    return session.exec(select(Folder).order_by(Folder.name)).all()

@router.get("/{folder_id}")
def get_folder(folder_id: int, session: Session = Depends(get_session)):
    """Get a specific folder"""
    return session.get(Folder, folder_id)

@router.post("/")
def create_folder(payload: Dict, session: Session = Depends(get_session)):
    """Create a new folder"""
    folder = Folder(
        name=str(payload.get("name", "New Folder")).strip() or "New Folder",
        icon=str(payload.get("icon", "📁")),
        color=str(payload.get("color", "#6b7280"))
    )
    session.add(folder)
    session.commit()
    session.refresh(folder)
    return folder

@router.put("/{folder_id}")
def update_folder(folder_id: int, payload: Dict, session: Session = Depends(get_session)):
    """Update a folder"""
    folder = session.get(Folder, folder_id)
    if not folder:
        return {"error": "Folder not found"}
    
    if "name" in payload:
        folder.name = str(payload["name"]).strip() or "New Folder"
    if "icon" in payload:
        folder.icon = str(payload["icon"])
    if "color" in payload:
        folder.color = str(payload["color"])
    
    folder.updated_at = datetime.utcnow()
    session.add(folder)
    session.commit()
    session.refresh(folder)
    return folder

@router.delete("/{folder_id}")
def delete_folder(folder_id: int, session: Session = Depends(get_session)):
    """Delete a folder"""
    folder = session.get(Folder, folder_id)
    if not folder:
        return {"error": "Folder not found"}
    
    session.delete(folder)
    session.commit()
    return {"ok": True}

@router.post("/init-defaults")
def init_default_folders(session: Session = Depends(get_session)):
    """Initialize default folders (Work, Personal, Archive)"""
    # Check if folders already exist
    existing = session.exec(select(Folder)).first()
    if existing:
        return {"message": "Default folders already exist"}
    
    default_folders = [
        {"name": "Work", "icon": "💼", "color": "#3b82f6"},
        {"name": "Personal", "icon": "🏠", "color": "#10b981"},
        {"name": "Archive", "icon": "📦", "color": "#6b7280"}
    ]
    
    created = []
    for folder_data in default_folders:
        folder = Folder(**folder_data)
        session.add(folder)
        created.append(folder)
    
    session.commit()
    for folder in created:
        session.refresh(folder)
    
    return created

