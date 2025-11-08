# Kanban Board - Database Schema & API Specification

## Database Models

### 1. Task Table

```python
# backend/app/models.py

from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from typing import Optional, List
from enum import Enum

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Task(SQLModel, table=True):
    """
    Represents a task/card in the Kanban board.
    Linked to folders (projects) and columns (status).
    """
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Basic Info
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None)
    task_id: str = Field(max_length=50, index=True)  # e.g., "MKT-101"
    
    # Relationships
    project_id: int = Field(foreign_key="folders.id", index=True)
    column_id: int = Field(foreign_key="columns.id", index=True)
    
    # Metadata
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    tags: str = Field(default="[]")  # JSON array: ["Marketing", "Backend"]
    progress: int = Field(default=0, ge=0, le=100)  # 0-100
    
    # Assignments & Counts
    assigned_users: str = Field(default="[]")  # JSON array of user IDs (future)
    attachments_count: int = Field(default=0)
    comments_count: int = Field(default=0)
    
    # Dates
    due_date: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Ordering & AI
    order: int = Field(default=0)  # Order within column
    created_from_mindmap_id: Optional[int] = Field(default=None, foreign_key="mindmaps.id")
    created_from_chat: bool = Field(default=False)
    
    # Relationships (for ORM)
    # project: "Folder" = Relationship(back_populates="tasks")
    # column: "Column" = Relationship(back_populates="tasks")
    # comments: List["TaskComment"] = Relationship(back_populates="task")
    # attachments: List["TaskAttachment"] = Relationship(back_populates="task")


### 2. Column Table

```python
class Column(SQLModel, table=True):
    """
    Represents a column/status in the Kanban board.
    Each project can have custom columns.
    """
    __tablename__ = "columns"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    project_id: int = Field(foreign_key="folders.id", index=True)
    
    # Column Info
    name: str = Field(max_length=100)  # "To Do", "In Progress", "Done"
    color: str = Field(max_length=7, default="#6b7280")  # Hex color
    order: int = Field(default=0)  # Display order
    limit: Optional[int] = Field(default=None)  # WIP limit (optional)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    # project: "Folder" = Relationship(back_populates="columns")
    # tasks: List["Task"] = Relationship(back_populates="column")


### 3. TaskComment Table

```python
class TaskComment(SQLModel, table=True):
    """
    Represents a comment on a task.
    """
    __tablename__ = "task_comments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    task_id: int = Field(foreign_key="tasks.id", index=True)
    user_id: Optional[int] = Field(default=None)  # Future: user system
    
    # Content
    content: str = Field(max_length=2000)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    # task: "Task" = Relationship(back_populates="comments")


### 4. TaskAttachment Table

```python
class TaskAttachment(SQLModel, table=True):
    """
    Represents a file attachment on a task.
    """
    __tablename__ = "task_attachments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    task_id: int = Field(foreign_key="tasks.id", index=True)
    
    # File Info
    filename: str = Field(max_length=255)
    file_url: str = Field(max_length=500)  # Path or URL to file
    file_size: int = Field(default=0)  # Size in bytes
    mime_type: str = Field(max_length=100, default="application/octet-stream")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    # task: "Task" = Relationship(back_populates="attachments")
```

### 5. Update Folder Model

```python
# Add to existing Folder model
class Folder(SQLModel, table=True):
    # ... existing fields ...
    
    # New relationship fields
    # tasks: List["Task"] = Relationship(back_populates="project")
    # columns: List["Column"] = Relationship(back_populates="project")
```

## Database Migrations

### Migration Script

```python
# backend/app/db.py - Add initialization for default columns

async def init_default_columns(session, folder_id: int):
    """Create default Kanban columns for a new project."""
    default_columns = [
        {"name": "To Do", "color": "#6b7280", "order": 0},
        {"name": "In Progress", "color": "#3b82f6", "order": 1},
        {"name": "In Review", "color": "#f59e0b", "order": 2},
        {"name": "Done", "color": "#10b981", "order": 3},
    ]
    
    for col_data in default_columns:
        column = Column(
            project_id=folder_id,
            name=col_data["name"],
            color=col_data["color"],
            order=col_data["order"]
        )
        session.add(column)
    
    await session.commit()
```

## REST API Endpoints

### Task Endpoints

#### 1. List Tasks
```
GET /tasks?project_id={id}&column_id={id}
```

**Query Parameters:**
- `project_id` (required): Filter by project/folder
- `column_id` (optional): Filter by column
- `priority` (optional): Filter by priority (low/medium/high)
- `tags` (optional): Filter by tags (comma-separated)
- `search` (optional): Search in title/description

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Draft Q3 Social Media Calendar",
      "description": "Plan posts for all platforms...",
      "task_id": "MKT-101",
      "project_id": 1,
      "column_id": 1,
      "priority": "high",
      "tags": ["Marketing"],
      "progress": 40,
      "assigned_users": [],
      "attachments_count": 5,
      "comments_count": 2,
      "due_date": "2025-01-15T00:00:00Z",
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-08T15:30:00Z",
      "order": 0
    }
  ],
  "total": 1
}
```

#### 2. Get Task Details
```
GET /tasks/{id}
```

**Response:**
```json
{
  "id": 1,
  "title": "Draft Q3 Social Media Calendar",
  "description": "Plan posts for all platforms...",
  "task_id": "MKT-101",
  "project_id": 1,
  "column_id": 1,
  "priority": "high",
  "tags": ["Marketing"],
  "progress": 40,
  "assigned_users": [],
  "attachments_count": 5,
  "comments_count": 2,
  "due_date": "2025-01-15T00:00:00Z",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-08T15:30:00Z",
  "order": 0,
  "comments": [...],
  "attachments": [...]
}
```

#### 3. Create Task
```
POST /tasks
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "project_id": 1,
  "column_id": 1,
  "priority": "medium",
  "tags": ["Backend"],
  "due_date": "2025-02-01T00:00:00Z"
}
```

**Response:** (201 Created)
```json
{
  "id": 10,
  "task_id": "DEV-346",
  "title": "New Task",
  ...
}
```

#### 4. Update Task
```
PUT /tasks/{id}
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "priority": "high",
  "progress": 75
}
```

**Response:** (200 OK)
```json
{
  "id": 10,
  "title": "Updated Title",
  ...
}
```

#### 5. Move Task
```
PUT /tasks/{id}/move
```

**Request Body:**
```json
{
  "column_id": 2,
  "order": 3
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "task": {...}
}
```

#### 6. Delete Task
```
DELETE /tasks/{id}
```

**Response:** (204 No Content)

### Column Endpoints

#### 1. List Columns
```
GET /columns?project_id={id}
```

**Response:**
```json
{
  "columns": [
    {
      "id": 1,
      "project_id": 1,
      "name": "To Do",
      "color": "#6b7280",
      "order": 0,
      "limit": null,
      "task_count": 2
    },
    {
      "id": 2,
      "project_id": 1,
      "name": "In Progress",
      "color": "#3b82f6",
      "order": 1,
      "limit": 3,
      "task_count": 2
    }
  ]
}
```

#### 2. Create Column
```
POST /columns
```

**Request Body:**
```json
{
  "project_id": 1,
  "name": "Testing",
  "color": "#8b5cf6",
  "order": 2,
  "limit": 5
}
```

#### 3. Update Column
```
PUT /columns/{id}
```

**Request Body:**
```json
{
  "name": "QA Testing",
  "color": "#8b5cf6",
  "limit": 3
}
```

#### 4. Reorder Columns
```
PUT /columns/reorder
```

**Request Body:**
```json
{
  "column_orders": [
    {"id": 1, "order": 0},
    {"id": 3, "order": 1},
    {"id": 2, "order": 2}
  ]
}
```

#### 5. Delete Column
```
DELETE /columns/{id}?move_tasks_to={column_id}
```

**Query Parameters:**
- `move_tasks_to`: ID of column to move existing tasks to

### Comment Endpoints

#### 1. List Comments
```
GET /tasks/{id}/comments
```

**Response:**
```json
{
  "comments": [
    {
      "id": 1,
      "task_id": 1,
      "user_id": null,
      "content": "This looks great!",
      "created_at": "2025-01-08T10:00:00Z"
    }
  ]
}
```

#### 2. Add Comment
```
POST /tasks/{id}/comments
```

**Request Body:**
```json
{
  "content": "Great progress on this task!"
}
```

#### 3. Delete Comment
```
DELETE /comments/{id}
```

### Attachment Endpoints

#### 1. List Attachments
```
GET /tasks/{id}/attachments
```

**Response:**
```json
{
  "attachments": [
    {
      "id": 1,
      "task_id": 1,
      "filename": "design-mockup.png",
      "file_url": "/uploads/abc123.png",
      "file_size": 204800,
      "mime_type": "image/png",
      "created_at": "2025-01-05T14:00:00Z"
    }
  ]
}
```

#### 2. Upload Attachment
```
POST /tasks/{id}/attachments
```

**Request:** (multipart/form-data)
- `file`: The file to upload

**Response:**
```json
{
  "id": 5,
  "filename": "document.pdf",
  "file_url": "/uploads/xyz789.pdf",
  "file_size": 512000,
  "mime_type": "application/pdf"
}
```

#### 3. Delete Attachment
```
DELETE /attachments/{id}
```

### AI Generation Endpoints

#### 1. Generate Tasks from Mind Map
```
POST /tasks/generate-from-mindmap/{mindmap_id}
```

**Request Body:**
```json
{
  "project_id": 1,
  "column_id": 1
}
```

**Response:**
```json
{
  "tasks_created": 5,
  "tasks": [...]
}
```

**AI Logic:**
- Analyze mind map nodes and structure
- Convert root nodes to high-level tasks
- Convert child nodes to subtasks or descriptions
- Assign priorities based on node importance
- Extract tags from node types

#### 2. Generate Tasks from Chat
```
POST /tasks/generate-from-chat
```

**Request Body:**
```json
{
  "project_id": 1,
  "column_id": 1,
  "chat_history": [...],
  "context": "User wants to build a landing page"
}
```

**Response:**
```json
{
  "tasks_created": 3,
  "tasks": [
    {
      "title": "Design landing page mockup",
      "priority": "high",
      "tags": ["Design"]
    }
  ]
}
```

## Task ID Generation

### Auto-generate Task IDs
```python
# backend/app/utils/task_id_generator.py

async def generate_task_id(session, project_id: int) -> str:
    """
    Generate a unique task ID for a project.
    Format: {PROJECT_PREFIX}-{NUMBER}
    Example: MKT-101, DEV-345
    """
    # Get project/folder
    folder = await session.get(Folder, project_id)
    if not folder:
        raise ValueError(f"Project {project_id} not found")
    
    # Generate prefix from project name
    prefix = "".join([c.upper() for c in folder.name if c.isalpha()])[:3]
    if len(prefix) < 3:
        prefix = prefix.ljust(3, 'X')
    
    # Find highest number for this project
    result = await session.exec(
        select(Task.task_id)
        .where(Task.project_id == project_id)
        .where(Task.task_id.startswith(prefix))
        .order_by(Task.task_id.desc())
        .limit(1)
    )
    last_task_id = result.first()
    
    if last_task_id:
        # Extract number and increment
        try:
            last_num = int(last_task_id.split('-')[1])
            next_num = last_num + 1
        except:
            next_num = 101
    else:
        next_num = 101
    
    return f"{prefix}-{next_num}"
```

## Backend Implementation Files

### 1. Create Models File
```bash
backend/app/models.py  # Add Task, Column, TaskComment, TaskAttachment
```

### 2. Create Routes
```bash
backend/app/routes/tasks.py      # Task CRUD + move + AI generation
backend/app/routes/columns.py    # Column CRUD + reorder
backend/app/routes/comments.py   # Comment CRUD
backend/app/routes/attachments.py # Attachment upload/delete
```

### 3. Create Utilities
```bash
backend/app/utils/task_id_generator.py  # Task ID generation
backend/app/utils/file_upload.py        # File upload handling
```

### 4. Update Main App
```python
# backend/app/main.py

from app.routes import tasks, columns, comments, attachments

app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(columns.router, prefix="/columns", tags=["columns"])
app.include_router(comments.router, prefix="/comments", tags=["comments"])
app.include_router(attachments.router, prefix="/attachments", tags=["attachments"])
```

## Data Relationships

```
Folder (Project)
├── Columns (1:many)
│   └── Tasks (1:many)
│       ├── Comments (1:many)
│       └── Attachments (1:many)
└── Tasks (1:many) - direct relationship for queries

MindMap
└── Tasks (1:many) - optional source tracking
```

## Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_tasks_project_column ON tasks(project_id, column_id);
CREATE INDEX idx_tasks_order ON tasks(column_id, order);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_columns_project_order ON columns(project_id, order);
```

## Next Steps

1. ✅ Database schema designed
2. ⬜ Create SQLModel models
3. ⬜ Write database migrations
4. ⬜ Implement API endpoints
5. ⬜ Add file upload handling
6. ⬜ Test API with Postman/curl
7. ⬜ Build frontend components
8. ⬜ Implement AI task generation

Ready to implement! 🚀

