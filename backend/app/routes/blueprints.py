from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from datetime import datetime
from typing import Dict
from ..db import get_session
from ..models import Blueprint
from ..ai import generate_blueprint

router = APIRouter(prefix="/blueprints", tags=["blueprints"])

@router.get("/")
def list_blueprints(session: Session = Depends(get_session)):
    return session.exec(select(Blueprint).order_by(Blueprint.updated_at.desc())).all()

@router.get("/{blueprint_id}")
def get_blueprint(blueprint_id: int, session: Session = Depends(get_session)):
    return session.get(Blueprint, blueprint_id)

@router.post("/")
async def create_blueprint(payload: Dict, session: Session = Depends(get_session)):
    title = str(payload.get("title", "Untitled")).strip() or "Untitled"
    context_md = str(payload.get("context_md", ""))
    spec = await generate_blueprint(title, context_md)
    bp = Blueprint(title=title, spec_text=spec)
    session.add(bp)
    session.commit()
    session.refresh(bp)
    return bp

@router.put("/{blueprint_id}")
def update_blueprint(blueprint_id: int, payload: Dict, session: Session = Depends(get_session)):
    bp = session.get(Blueprint, blueprint_id)
    if not bp:
        return {"error": "Blueprint not found"}
    
    if "title" in payload:
        bp.title = str(payload["title"]).strip() or "Untitled"
    if "spec_text" in payload:
        bp.spec_text = str(payload["spec_text"])
    if "rationale_md" in payload:
        bp.rationale_md = str(payload["rationale_md"])
    
    bp.updated_at = datetime.utcnow()
    session.add(bp)
    session.commit()
    session.refresh(bp)
    return bp

@router.delete("/{blueprint_id}")
def delete_blueprint(blueprint_id: int, session: Session = Depends(get_session)):
    bp = session.get(Blueprint, blueprint_id)
    if not bp:
        return {"error": "Blueprint not found"}
    
    session.delete(bp)
    session.commit()
    return {"ok": True}
