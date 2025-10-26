from typing import Optional
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import Text
from datetime import datetime

class Folder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    icon: str = "📁"
    color: str = "#6b7280"  # Default gray
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Note(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mindmap_id: Optional[int] = Field(default=None, foreign_key="mindmap.id")
    title: str
    content_md: str = ""
    tags: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Blueprint(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    spec_text: str = ""   # YAML/Markdown-like blueprint content
    rationale_md: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MindMap(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    folder_id: Optional[int] = Field(default=None, foreign_key="folder.id")
    title: str
    template_id: str = ""  # e.g., "saas-app", "api-service", "blank"
    nodes_json: str = Field(sa_column=Column(Text))  # JSON string of nodes
    edges_json: str = Field(sa_column=Column(Text))  # JSON string of edges
    chat_history: str = Field(sa_column=Column(Text), default="[]")  # JSON string of chat messages
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
