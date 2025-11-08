# Kanban Board - Feature Planning

## Overview
Add a comprehensive Kanban board view for project and task management, integrating with existing folders, AI chat, and mind map features.

## Goals
1. **Visual Project Management**: Drag-and-drop task organization across status columns
2. **Seamless Integration**: Works with existing folders, projects, and AI functionality
3. **Theme Consistency**: Fully respects light/dark themes and wallpaper settings
4. **Collaboration Ready**: Track progress, assignments, comments, and attachments
5. **AI-Powered**: Generate tasks from AI conversations and mind maps

## Inspiration Analysis (Attached Screenshot)
### Key Features Observed:
- **Column-based workflow**: To Do → In Progress → In Review (customizable)
- **Rich task cards** with:
  - Priority badges (High/Medium/Low)
  - Category tags (Marketing, Backend, Figma Design, Content)
  - Task IDs (MKT-101, DEV-345, etc.)
  - Progress bars with percentages
  - Team member avatars
  - Attachment/comment counts
- **Project sidebar**: Quick navigation between projects
- **View modes**: Board, List, Calendar, Timeline, Workload
- **Controls**: Filter, Sort, Group functionality

## Current System Integration Points

### Existing Features to Leverage:
1. **Folders** → Map to "Projects" in Kanban view
2. **Mind Maps** → Can be converted to task lists
3. **AI Chat** → Auto-generate tasks from conversations
4. **Theme System** → Extend to Kanban cards and columns
5. **Wallpapers** → Apply background to Kanban board

### Current Data Models:
- `Folder`: Has `id`, `name`, `icon`, `color`
- `MindMap`: Has `id`, `title`, `template_id`, `folder_id`, `nodes_json`, `chat_history`
- `Node`: Mind map nodes that could represent tasks

## New Data Models Required

### Task Model
```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  task_id: string;  // e.g., "MKT-101", "DEV-345"
  project_id: number;  // Links to Folder
  column_id: number;  // Which column/status
  priority: 'low' | 'medium' | 'high';
  tags: string[];  // e.g., ["Marketing", "Backend"]
  progress: number;  // 0-100
  assigned_users: number[];  // User IDs
  attachments_count: number;
  comments_count: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  order: number;  // For ordering within column
  created_from_mindmap?: number;  // Optional: source mind map
  created_from_chat?: boolean;  // Optional: AI-generated
}
```

### Column Model
```typescript
interface Column {
  id: number;
  project_id: number;  // Links to Folder
  name: string;  // "To Do", "In Progress", "In Review", "Done"
  color: string;  // Column accent color
  order: number;  // Display order
  limit?: number;  // Optional WIP limit
}
```

### TaskComment Model
```typescript
interface TaskComment {
  id: number;
  task_id: number;
  user_id?: number;
  content: string;
  created_at: string;
}
```

### TaskAttachment Model
```typescript
interface TaskAttachment {
  id: number;
  task_id: number;
  filename: string;
  file_url: string;
  file_size: number;
  created_at: string;
}
```

## Backend API Endpoints

### Tasks
- `GET /tasks?project_id={id}` - List tasks for a project
- `GET /tasks/{id}` - Get task details
- `POST /tasks` - Create task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task
- `PUT /tasks/{id}/move` - Move task to different column/order
- `POST /tasks/generate-from-mindmap/{mindmap_id}` - AI: Convert mind map to tasks
- `POST /tasks/generate-from-chat` - AI: Generate tasks from chat context

### Columns
- `GET /columns?project_id={id}` - List columns for a project
- `POST /columns` - Create column
- `PUT /columns/{id}` - Update column
- `DELETE /columns/{id}` - Delete column
- `PUT /columns/reorder` - Reorder columns

### Comments
- `GET /tasks/{id}/comments` - List comments
- `POST /tasks/{id}/comments` - Add comment
- `DELETE /comments/{id}` - Delete comment

### Attachments
- `GET /tasks/{id}/attachments` - List attachments
- `POST /tasks/{id}/attachments` - Upload attachment
- `DELETE /attachments/{id}` - Delete attachment

## Frontend Component Structure

```
KanbanBoard (Main view)
├── KanbanHeader
│   ├── ProjectSelector (links to folders)
│   ├── ViewModeSelector (Board/List/Timeline)
│   └── Controls (Filter/Sort/Group)
├── KanbanColumns
│   └── KanbanColumn (for each status)
│       ├── ColumnHeader (name, count, add button)
│       └── TaskCard[] (draggable cards)
│           ├── TaskCardHeader (priority, tags, ID)
│           ├── TaskCardContent (title, description)
│           ├── TaskCardProgress (progress bar)
│           └── TaskCardFooter (avatars, counts)
└── TaskDetailModal (opens when clicking a card)
    ├── TaskHeader
    ├── TaskDescription
    ├── TaskMetadata (assignees, dates, priority)
    ├── TaskComments
    └── TaskAttachments
```

## Theme Integration Strategy

### Theme-Aware Components
All Kanban components must support:
1. **Light/Dark Mode**: Proper text/background colors
2. **Wallpaper Mode**: Semi-transparent cards with backdrop-blur
3. **Color Consistency**: Use existing color palette

### Kanban-Specific Theme Classes

#### Card Styling
```typescript
// Light mode
const lightCardClass = "bg-white border-zinc-200 text-zinc-900"

// Dark mode
const darkCardClass = "bg-zinc-800 border-zinc-700 text-white"

// Light mode with wallpaper
const lightWallpaperCardClass = "bg-white/95 backdrop-blur-sm border-zinc-200 shadow-lg"

// Dark mode with wallpaper
const darkWallpaperCardClass = "bg-zinc-900/90 backdrop-blur-md border-white/20 shadow-xl"
```

#### Column Styling
```typescript
// Light mode
const lightColumnClass = "bg-zinc-50 border-zinc-200"

// Dark mode
const darkColumnClass = "bg-zinc-900 border-zinc-800"

// With wallpaper (both modes)
const wallpaperColumnClass = "bg-black/10 backdrop-blur-sm border-white/10"
```

### Priority Badge Colors
Must work in all theme modes:
```typescript
const priorityColors = {
  high: {
    light: "bg-red-100 text-red-700 border-red-200",
    dark: "bg-red-900/30 text-red-400 border-red-800",
    wallpaperLight: "bg-red-100/90 text-red-700 border-red-200",
    wallpaperDark: "bg-red-900/50 text-red-300 border-red-700/50"
  },
  medium: {
    light: "bg-orange-100 text-orange-700 border-orange-200",
    dark: "bg-orange-900/30 text-orange-400 border-orange-800",
    wallpaperLight: "bg-orange-100/90 text-orange-700 border-orange-200",
    wallpaperDark: "bg-orange-900/50 text-orange-300 border-orange-700/50"
  },
  low: {
    light: "bg-green-100 text-green-700 border-green-200",
    dark: "bg-green-900/30 text-green-400 border-green-800",
    wallpaperLight: "bg-green-100/90 text-green-700 border-green-200",
    wallpaperDark: "bg-green-900/50 text-green-300 border-green-700/50"
  }
}
```

## User Stories

### US1: Basic Task Management
**As a user**, I want to create tasks with titles, descriptions, and priorities, so I can organize my work.

### US2: Visual Workflow
**As a user**, I want to drag tasks between columns, so I can visualize progress.

### US3: Project Organization
**As a user**, I want to view tasks by project/folder, so I can focus on one area at a time.

### US4: AI Task Generation
**As a user**, I want to convert my mind map nodes into tasks, so I can execute on my planning.

### US5: Collaboration
**As a user**, I want to comment on tasks and see attachments, so I can collaborate with my team.

### US6: Progress Tracking
**As a user**, I want to see progress bars on tasks, so I know how much work is complete.

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create database models (Task, Column, TaskComment, TaskAttachment)
- [ ] Implement backend API endpoints
- [ ] Create base Kanban components (Board, Column, Card)
- [ ] Set up drag-and-drop functionality
- [ ] Implement basic CRUD operations

### Phase 2: Theme Integration (Week 1-2)
- [ ] Create centralized theme utility for Kanban
- [ ] Apply theme-aware styling to all components
- [ ] Test with light/dark modes
- [ ] Test with wallpaper backgrounds
- [ ] Ensure accessibility (color contrast)

### Phase 3: Rich Features (Week 2)
- [ ] Add task detail modal
- [ ] Implement comments system
- [ ] Implement attachments system
- [ ] Add progress tracking
- [ ] Add priority and tag filtering

### Phase 4: AI Integration (Week 3)
- [ ] Mind map → Task conversion
- [ ] AI chat → Task generation
- [ ] Smart task suggestions
- [ ] Auto-categorization

### Phase 5: Advanced Views (Week 3-4)
- [ ] List view
- [ ] Calendar view (optional)
- [ ] Timeline view (optional)
- [ ] Advanced filtering and sorting

## Technical Considerations

### Drag and Drop
- Library: `@dnd-kit/core` (already used in ReactFlow)
- Handle optimistic updates
- Smooth animations
- Auto-scroll on drag near edges

### Performance
- Virtualize long task lists
- Lazy load task details
- Debounce search/filter
- Optimize re-renders with React.memo

### State Management
- Tasks state in parent (page.tsx)
- Real-time updates via API polling or WebSockets (future)
- Optimistic UI updates

### Data Persistence
- Auto-save on drag/drop
- Draft saving for task creation
- Conflict resolution (future: multi-user)

## Open Questions

1. **User Management**: Do we need user accounts, or continue with single-user mode?
2. **Real-time Collaboration**: Add WebSockets for live updates?
3. **Task IDs**: Auto-generate (MKT-101) or user-defined?
4. **Default Columns**: Should projects start with standard columns, or custom?
5. **Permissions**: Who can move/edit tasks in shared projects?
6. **Notifications**: Alert users on task assignments/comments?
7. **Time Tracking**: Add time estimates and actual time spent?
8. **Recurring Tasks**: Support for repeating tasks?

## Success Metrics

- [ ] Users can create and organize tasks visually
- [ ] Drag-and-drop works smoothly with animations
- [ ] Theme consistency maintained across all views
- [ ] AI generates relevant tasks from mind maps
- [ ] Performance remains fast with 100+ tasks per project
- [ ] Mobile-responsive design

## Next Steps

1. Review and approve this plan
2. Create detailed UI mockups
3. Design database schema
4. Implement Phase 1 (Foundation)
5. Iterate based on user feedback

