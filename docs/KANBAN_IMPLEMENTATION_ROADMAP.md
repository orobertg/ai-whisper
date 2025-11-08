# Kanban Board - Implementation Roadmap

## Project Overview

### Goals
1. **Enhanced Recent Chats**: Show more information (preview, last updated, progress)
2. **Kanban Board View**: Full project/task management system
3. **Theme Consistency**: Ensure all features work with light/dark/wallpaper modes
4. **AI Integration**: Convert mind maps and chats to actionable tasks

### Timeline: 3-4 Weeks
- **Week 1**: Foundation + Theme System
- **Week 2**: Core Kanban Features
- **Week 3**: AI Integration + Polish
- **Week 4**: Testing + Refinements

---

## PHASE 1: Enhanced Recent Chats (Week 1, Days 1-2)

### Current State
Recent chats show only:
- Project title
- Icon (mind map or chat)
- Click to open

### Desired State
Recent chats should show:
- Project title
- **Last message preview** (truncated)
- **Last updated timestamp** (relative: "2 hours ago")
- **Progress indicator** (if tasks exist)
- **Tag/category** (from folder)
- **Unread indicator** (optional future feature)

### Implementation

#### 1. Update MindMap Model
```python
# backend/app/models.py

class MindMap(SQLModel, table=True):
    # ... existing fields ...
    
    # Add new fields
    last_message_preview: Optional[str] = Field(default=None, max_length=200)
    message_count: int = Field(default=0)
    task_count: int = Field(default=0)  # Future: link to Kanban tasks
    task_completed: int = Field(default=0)  # Future: completed tasks
```

#### 2. Update Backend Endpoint
```python
# backend/app/routes/mindmaps.py

@router.get("/mindmaps/recent")
async def get_recent_mindmaps(
    limit: int = 10,
    session: AsyncSession = Depends(get_session)
):
    """Get recent mind maps with enhanced metadata."""
    result = await session.exec(
        select(MindMap)
        .order_by(MindMap.updated_at.desc())
        .limit(limit)
    )
    mindmaps = result.all()
    
    # Enrich with computed fields
    for mindmap in mindmaps:
        # Extract last message from chat_history
        if mindmap.chat_history:
            try:
                history = json.loads(mindmap.chat_history)
                if history:
                    last_msg = history[-1]
                    mindmap.last_message_preview = last_msg['content'][:200]
                    mindmap.message_count = len(history)
            except:
                pass
        
        # Calculate progress (if tasks exist)
        # TODO: Link to Kanban tasks in Phase 2
    
    return {"mindmaps": mindmaps}
```

#### 3. Update Frontend RecentChats Component

**File**: `frontend/components/Sidebar.tsx` (Recent Chats section)

```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { formatDistanceToNow } from 'date-fns';

function RecentChatCard({ chat }: { chat: RecentChat }) {
  const { getCardClass, getTextClass } = useTheme();
  
  // Calculate progress if tasks exist
  const progress = chat.task_count > 0 
    ? Math.round((chat.task_completed / chat.task_count) * 100)
    : null;
  
  return (
    <div className={`${getCardClass()} p-3 rounded-lg border cursor-pointer hover:shadow-lg transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <BubbleChatIcon size={16} className={getTextClass('muted')} />
          <h4 className={`${getTextClass('primary')} text-sm font-semibold truncate`}>
            {chat.title}
          </h4>
        </div>
        <span className={`${getTextClass('muted')} text-xs whitespace-nowrap ml-2`}>
          {formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true })}
        </span>
      </div>
      
      {/* Message Preview */}
      {chat.last_message_preview && (
        <p className={`${getTextClass('secondary')} text-xs line-clamp-2 mb-2`}>
          {chat.last_message_preview}
        </p>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Message count */}
        <div className="flex items-center gap-1">
          <MessageIcon size={12} className={getTextClass('muted')} />
          <span className={`${getTextClass('muted')} text-xs`}>
            {chat.message_count || 0}
          </span>
        </div>
        
        {/* Progress (if exists) */}
        {progress !== null && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`${getTextClass('muted')} text-xs`}>
              {progress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Deliverables
- [x] Enhanced recent chat cards with previews
- [x] Last updated timestamps
- [x] Message counts
- [x] Progress indicators (placeholder for Phase 2)

---

## PHASE 2: Theme System Centralization (Week 1, Days 3-4)

### Goal
Create a centralized theme system that works consistently across all screens.

### Tasks
1. **Create ThemeContext**
   - Implement `frontend/contexts/ThemeContext.tsx`
   - Export `useTheme()` hook
   - Provide helper functions for styling

2. **Wrap Application**
   - Add `ThemeProvider` to `layout.tsx`
   - Ensure all components have access

3. **Migrate Existing Components**
   - Update `HomeContent.tsx` to use `useTheme()`
   - Update `ChatPanel.tsx` to use `useTheme()`
   - Update `Sidebar.tsx` to use `useTheme()`
   - Update `Settings.tsx` to use `useTheme()`

4. **Test Theme Consistency**
   - Light mode (no wallpaper)
   - Dark mode (no wallpaper)
   - Light mode (with wallpaper)
   - Dark mode (with wallpaper)

### Deliverables
- [x] Centralized theme context
- [x] All existing screens migrated
- [x] Consistent styling across all views
- [x] Documentation updated

---

## PHASE 3: Backend - Kanban Database & API (Week 1-2, Days 5-8)

### Tasks

#### Day 5-6: Database Models
1. **Create Models**
   - `Task` model with all fields
   - `Column` model for status columns
   - `TaskComment` model
   - `TaskAttachment` model
   - Update `Folder` model with relationships

2. **Database Migration**
   - Create migration script
   - Add indexes for performance
   - Test with sample data

#### Day 7-8: API Endpoints
1. **Task Routes** (`backend/app/routes/tasks.py`)
   - GET `/tasks` - List with filters
   - GET `/tasks/{id}` - Get details
   - POST `/tasks` - Create
   - PUT `/tasks/{id}` - Update
   - PUT `/tasks/{id}/move` - Move to column
   - DELETE `/tasks/{id}` - Delete

2. **Column Routes** (`backend/app/routes/columns.py`)
   - GET `/columns` - List for project
   - POST `/columns` - Create
   - PUT `/columns/{id}` - Update
   - PUT `/columns/reorder` - Reorder
   - DELETE `/columns/{id}` - Delete

3. **Comment Routes** (`backend/app/routes/comments.py`)
   - GET `/tasks/{id}/comments` - List
   - POST `/tasks/{id}/comments` - Add
   - DELETE `/comments/{id}` - Delete

4. **Attachment Routes** (`backend/app/routes/attachments.py`)
   - GET `/tasks/{id}/attachments` - List
   - POST `/tasks/{id}/attachments` - Upload
   - DELETE `/attachments/{id}` - Delete

5. **Utilities**
   - Task ID generator
   - File upload handler
   - Default column initializer

### Testing
```bash
# Test all endpoints with curl or Postman
curl http://localhost:8000/columns?project_id=1
curl -X POST http://localhost:8000/tasks -d '{"title":"Test Task",...}'
```

### Deliverables
- [x] All database models created
- [x] All API endpoints implemented
- [x] Endpoints tested and documented
- [x] Sample data created

---

## PHASE 4: Frontend - Kanban Board UI (Week 2, Days 9-12)

### Component Structure

```
pages/kanban.tsx (or integrate into page.tsx)
├── KanbanBoard
    ├── KanbanHeader
    │   ├── ProjectSelector
    │   ├── ViewModeToggle (Board/List)
    │   └── FilterControls
    ├── KanbanColumns
    │   └── KanbanColumn (per status)
    │       ├── ColumnHeader
    │       └── TaskCard[]
    └── TaskDetailModal
```

### Day 9: Base Components

**1. KanbanBoard Container**
```typescript
// frontend/components/kanban/KanbanBoard.tsx

import { useTheme } from '@/contexts/ThemeContext';

export default function KanbanBoard({ 
  projectId 
}: { 
  projectId: number 
}) {
  const { isLight, hasWallpaper } = useTheme();
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Load columns and tasks
  useEffect(() => {
    loadKanbanData();
  }, [projectId]);
  
  const loadKanbanData = async () => {
    // Fetch columns
    const colsRes = await fetch(`/api/columns?project_id=${projectId}`);
    const colsData = await colsRes.json();
    setColumns(colsData.columns);
    
    // Fetch tasks
    const tasksRes = await fetch(`/api/tasks?project_id=${projectId}`);
    const tasksData = await tasksRes.json();
    setTasks(tasksData.tasks);
  };
  
  return (
    <div className="flex-1 overflow-x-auto p-6">
      <KanbanHeader projectId={projectId} />
      <KanbanColumns 
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}
```

**2. KanbanColumn Component**
```typescript
// frontend/components/kanban/KanbanColumn.tsx

import { useTheme } from '@/contexts/ThemeContext';
import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';

export default function KanbanColumn({ 
  column, 
  tasks 
}: { 
  column: Column; 
  tasks: Task[] 
}) {
  const { getKanbanColumnClass, getTextClass } = useTheme();
  const { setNodeRef } = useDroppable({ id: column.id });
  
  const columnTasks = tasks.filter(t => t.column_id === column.id);
  
  return (
    <div 
      ref={setNodeRef}
      className={`${getKanbanColumnClass()} min-w-[320px] rounded-xl p-4 border`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className={`${getTextClass('primary')} font-semibold`}>
            {column.name}
          </h3>
          <span className={`${getTextClass('muted')} text-sm`}>
            {columnTasks.length}
          </span>
        </div>
        <button className="p-1 hover:bg-black/5 rounded">
          <PlusIcon size={16} />
        </button>
      </div>
      
      {/* Tasks */}
      <div className="space-y-3">
        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
```

### Day 10: Task Card Component

```typescript
// frontend/components/kanban/TaskCard.tsx

import { useTheme } from '@/contexts/ThemeContext';
import { useDraggable } from '@dnd-kit/core';

export default function TaskCard({ task }: { task: Task }) {
  const { 
    getKanbanCardClass, 
    getPriorityBadgeClass, 
    getTextClass,
    getBadgeClass,
    isLight 
  } = useTheme();
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${getKanbanCardClass()} p-4 rounded-xl border`}
    >
      {/* Priority & Task ID */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`${getPriorityBadgeClass(task.priority)} px-2 py-0.5 rounded text-xs font-medium border`}>
            {task.priority}
          </span>
          {task.tags.map(tag => (
            <span 
              key={tag}
              className={`${getBadgeClass('blue')} px-2 py-0.5 rounded text-xs border`}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className={`${getTextClass('muted')} text-xs font-mono`}>
          {task.task_id}
        </span>
      </div>
      
      {/* Title & Description */}
      <h4 className={`${getTextClass('primary')} font-semibold text-sm mb-1`}>
        {task.title}
      </h4>
      <p className={`${getTextClass('secondary')} text-xs line-clamp-2 mb-3`}>
        {task.description}
      </p>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className={`${getTextClass('muted')} text-xs`}>Progress</span>
          <span className={`${getTextClass('primary')} text-xs font-medium`}>
            {task.progress}%
          </span>
        </div>
        <div className={`w-full h-1.5 rounded-full ${isLight ? 'bg-zinc-200' : 'bg-zinc-700'}`}>
          <div 
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
      
      {/* Footer: Avatars & Counts */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {task.assigned_users.slice(0, 3).map(userId => (
            <div 
              key={userId}
              className="w-6 h-6 rounded-full bg-zinc-300 border-2 border-white dark:border-zinc-800"
            />
          ))}
          {task.assigned_users.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-zinc-400 border-2 border-white dark:border-zinc-800 flex items-center justify-center text-xs">
              +{task.assigned_users.length - 3}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Attachment02Icon className={getTextClass('muted')} size={14} />
            <span className={`${getTextClass('muted')} text-xs`}>
              {task.attachments_count}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageAdd02Icon className={getTextClass('muted')} size={14} />
            <span className={`${getTextClass('muted')} text-xs`}>
              {task.comments_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Day 11: Drag & Drop

```typescript
// frontend/components/kanban/KanbanBoard.tsx

import { DndContext, DragEndEvent } from '@dnd-kit/core';

export default function KanbanBoard() {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id;
    const newColumnId = over.id;
    
    // Optimistic update
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, column_id: newColumnId }
        : task
    ));
    
    // API call
    try {
      await fetch(`/api/tasks/${taskId}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ column_id: newColumnId })
      });
    } catch (error) {
      // Revert on error
      loadKanbanData();
    }
  };
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <KanbanColumns columns={columns} tasks={tasks} />
    </DndContext>
  );
}
```

### Day 12: Task Detail Modal

```typescript
// frontend/components/kanban/TaskDetailModal.tsx

import { useTheme } from '@/contexts/ThemeContext';

export default function TaskDetailModal({ 
  taskId, 
  onClose 
}: { 
  taskId: number | null; 
  onClose: () => void 
}) {
  const { getCardClass, getTextClass } = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  
  if (!taskId) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`${getCardClass()} w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className={`${getTextClass('primary')} text-2xl font-bold`}>
            {task?.title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded">
            <XIcon size={20} />
          </button>
        </div>
        
        {/* Content sections: Description, Comments, Attachments */}
        {/* ... */}
      </div>
    </div>
  );
}
```

### Deliverables
- [x] Kanban board layout with columns
- [x] Task cards with all metadata
- [x] Drag and drop functionality
- [x] Task detail modal
- [x] Theme-aware styling

---

## PHASE 5: AI Integration (Week 3, Days 13-16)

### Task Generation from Mind Maps

```python
# backend/app/routes/tasks.py

@router.post("/tasks/generate-from-mindmap/{mindmap_id}")
async def generate_tasks_from_mindmap(
    mindmap_id: int,
    project_id: int,
    column_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Convert mind map nodes to Kanban tasks using AI."""
    
    # Get mind map
    mindmap = await session.get(MindMap, mindmap_id)
    if not mindmap:
        raise HTTPException(404, "Mind map not found")
    
    # Parse nodes
    nodes = json.loads(mindmap.nodes_json) if mindmap.nodes_json else []
    
    # AI analysis
    tasks_to_create = []
    for node in nodes:
        # Root nodes = High priority tasks
        # Child nodes = Medium/Low priority subtasks
        
        task_data = {
            "title": node["data"]["label"],
            "description": f"Generated from mind map: {mindmap.title}",
            "priority": "high" if node.get("parentNode") is None else "medium",
            "tags": [node["type"]] if node.get("type") else [],
            "project_id": project_id,
            "column_id": column_id,
            "created_from_mindmap_id": mindmap_id
        }
        tasks_to_create.append(task_data)
    
    # Create tasks
    created_tasks = []
    for task_data in tasks_to_create:
        task_id = await generate_task_id(session, project_id)
        task = Task(**task_data, task_id=task_id)
        session.add(task)
        created_tasks.append(task)
    
    await session.commit()
    
    return {
        "tasks_created": len(created_tasks),
        "tasks": created_tasks
    }
```

### Deliverables
- [x] Mind map → Tasks conversion
- [x] Chat → Tasks generation
- [x] Smart priority assignment
- [x] Tag extraction

---

## PHASE 6: Integration & Polish (Week 3-4, Days 17-20)

### Navigation
- Add "Board" view mode to project screens
- Toggle between Mind Map, Chat, and Kanban views
- Persist view preference per project

### Features to Polish
1. **Animations**: Smooth drag transitions
2. **Loading States**: Skeleton screens
3. **Error Handling**: User-friendly messages
4. **Empty States**: Helpful prompts
5. **Keyboard Shortcuts**: Quick actions

### Testing Checklist
- [ ] All CRUD operations work
- [ ] Drag and drop is smooth
- [ ] Theme consistency across views
- [ ] Wallpapers don't affect readability
- [ ] AI generation produces good tasks
- [ ] Mobile responsive (basic)
- [ ] No console errors
- [ ] Fast performance (100+ tasks)

---

## Success Criteria

1. ✅ Enhanced recent chats show previews and metadata
2. ✅ Centralized theme system works everywhere
3. ✅ Kanban board fully functional with drag-drop
4. ✅ Task cards show all relevant information
5. ✅ AI can generate tasks from mind maps
6. ✅ All features work in light/dark/wallpaper modes
7. ✅ Smooth animations and polish
8. ✅ No performance degradation

---

## Future Enhancements (Post-Launch)

### V2 Features
- Calendar view
- Timeline/Gantt view
- Workload view (per user)
- Time tracking
- Task dependencies
- Recurring tasks
- Advanced filtering
- Bulk operations
- Export to CSV/PDF
- Keyboard shortcuts
- Mobile app

### V3 Features
- Real-time collaboration (WebSockets)
- Multi-user assignments
- Permissions system
- Activity feed
- Email notifications
- Integrations (GitHub, Jira)
- Custom fields
- Automation rules
- Templates

---

## Questions for Review

1. **View Integration**: Should Kanban be a separate route or integrated into project view?
2. **Default Behavior**: Open projects in Mind Map or Kanban by default?
3. **Task Sync**: Should mind map nodes auto-sync with tasks?
4. **File Storage**: Where to store attachments? (local/cloud/S3)?
5. **User System**: Add basic user accounts or stay single-user?

---

Let's review this roadmap and start with Phase 1! 🚀

