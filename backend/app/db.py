import os
import sqlite3
from sqlmodel import SQLModel, create_engine, Session, select

DB_URL = os.getenv("DB_URL", "sqlite:///./data/data.db")
connect_args = {"check_same_thread": False} if DB_URL.startswith("sqlite") else {}
engine = create_engine(DB_URL, connect_args=connect_args)

def migrate_schema():
    """Handle database migrations for existing databases"""
    if not DB_URL.startswith("sqlite"):
        return  # Only handle SQLite migrations for now
    
    db_path = DB_URL.replace("sqlite:///", "")
    if not os.path.exists(db_path):
        return  # New database, no migration needed
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if mindmap table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='mindmap'")
        if not cursor.fetchone():
            conn.close()
            return  # Table doesn't exist yet
        
        # Check existing columns
        cursor.execute("PRAGMA table_info(mindmap)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add new columns if they don't exist
        migrations = []
        
        if 'last_message_preview' not in columns:
            cursor.execute("ALTER TABLE mindmap ADD COLUMN last_message_preview TEXT DEFAULT ''")
            migrations.append("last_message_preview")
        
        if 'ai_model' not in columns:
            cursor.execute("ALTER TABLE mindmap ADD COLUMN ai_model TEXT DEFAULT ''")
            migrations.append("ai_model")
        
        if 'message_count' not in columns:
            cursor.execute("ALTER TABLE mindmap ADD COLUMN message_count INTEGER DEFAULT 0")
            migrations.append("message_count")
        
        conn.commit()
        
        if migrations:
            print(f"✅ Database migration successful! Added columns: {', '.join(migrations)}")
        
    except Exception as e:
        print(f"❌ Database migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

def init_db():
    from .models import Folder
    
    # Run migrations first (for existing databases)
    migrate_schema()
    
    # Create all tables (will only create missing ones)
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
