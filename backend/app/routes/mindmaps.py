from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from typing import Dict, Optional
import json
from ..db import get_session
from ..models import MindMap

router = APIRouter(prefix="/mindmaps", tags=["mindmaps"])

@router.get("/")
def list_mindmaps(folder_id: Optional[int] = None, session: Session = Depends(get_session)):
    """List mind maps, optionally filtered by folder"""
    query = select(MindMap)
    if folder_id is not None:
        query = query.where(MindMap.folder_id == folder_id)
    query = query.order_by(MindMap.updated_at.desc())
    return session.exec(query).all()

@router.get("/{mindmap_id}")
def get_mindmap(mindmap_id: int, session: Session = Depends(get_session)):
    return session.get(MindMap, mindmap_id)

@router.post("/")
def create_mindmap(payload: Dict, session: Session = Depends(get_session)):
    title = str(payload.get("title", "Untitled Mind Map")).strip() or "Untitled Mind Map"
    template_id = str(payload.get("template_id", "blank"))
    nodes = payload.get("nodes", [])
    edges = payload.get("edges", [])
    folder_id = payload.get("folder_id")  # Optional folder assignment
    
    mindmap = MindMap(
        title=title,
        template_id=template_id,
        nodes_json=json.dumps(nodes),
        edges_json=json.dumps(edges),
        folder_id=folder_id
    )
    session.add(mindmap)
    session.commit()
    session.refresh(mindmap)
    return mindmap

@router.put("/{mindmap_id}")
def update_mindmap(mindmap_id: int, payload: Dict, session: Session = Depends(get_session)):
    mindmap = session.get(MindMap, mindmap_id)
    if not mindmap:
        return {"error": "Mind map not found"}

    if "title" in payload:
        mindmap.title = str(payload["title"]).strip() or "Untitled Mind Map"
    if "nodes" in payload:
        mindmap.nodes_json = json.dumps(payload["nodes"])
    if "edges" in payload:
        mindmap.edges_json = json.dumps(payload["edges"])
    if "folder_id" in payload:
        mindmap.folder_id = payload["folder_id"]
    if "chat_history" in payload:
        chat_history = payload["chat_history"]
        mindmap.chat_history = json.dumps(chat_history)
        
        # Update enhanced metadata for recent chats
        if isinstance(chat_history, list) and len(chat_history) > 0:
            # Update message count
            mindmap.message_count = len(chat_history)
            
            # Get last message as preview (truncate to 100 chars)
            last_message = chat_history[-1]
            if isinstance(last_message, dict):
                content = last_message.get("content", "")
                if isinstance(content, str):
                    mindmap.last_message_preview = content[:100] + ("..." if len(content) > 100 else "")
        else:
            mindmap.message_count = 0
            mindmap.last_message_preview = ""
    
    # Allow explicit AI model updates
    if "ai_model" in payload:
        mindmap.ai_model = str(payload["ai_model"])

    mindmap.updated_at = datetime.utcnow()
    session.add(mindmap)
    session.commit()
    session.refresh(mindmap)
    return mindmap

@router.delete("/{mindmap_id}")
def delete_mindmap(mindmap_id: int, session: Session = Depends(get_session)):
    mindmap = session.get(MindMap, mindmap_id)
    if not mindmap:
        return {"error": "Mind map not found"}
    
    session.delete(mindmap)
    session.commit()
    return {"ok": True}

