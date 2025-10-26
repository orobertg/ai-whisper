import os
from sqlmodel import SQLModel, create_engine, Session, select

DB_URL = os.getenv("DB_URL", "sqlite:///./data/data.db")
connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}
engine = create_engine(DB_URL, connect_args=connect_args)

def init_db():
    from .models import Folder
    
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    # Initialize default folders if none exist
    with Session(engine) as session:
        existing = session.exec(select(Folder)).first()
        if not existing:
            default_folders = [
                Folder(name="Work", icon="💼", color="#3b82f6"),
                Folder(name="Personal", icon="🏠", color="#10b981"),
                Folder(name="Archive", icon="📦", color="#6b7280")
            ]
            for folder in default_folders:
                session.add(folder)
            session.commit()

def get_session():
    with Session(engine) as session:
        yield session
