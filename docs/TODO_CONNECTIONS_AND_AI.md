# To-Do Node Connections and AI Integration

## Overview
Added full support for connecting To-Do nodes to other mind-map nodes and integrated To-Do nodes into the AI suggestion system.

---

## ✅ What's New

### 1. AI Understands To-Do Nodes

The AI assistant can now:
- **Suggest To-Do nodes** when you discuss implementation steps, tasks, or milestones
- **Connect To-Do nodes** to related Features, Technical components, or User Stories
- **Populate todos** with specific, measurable tasks
- **Connect todo lists** to each other (e.g., Backend Tasks → Frontend Tasks)

### 2. Automatic Connections

The AI follows a logical flow including To-Do nodes:

```
WHY → WHAT → HOW → STRUCTURE → ACTION
 ↓      ↓      ↓        ↓          ↓
User   Feature Technical Data    To-Do
Story                   Model    Lists
```

**Example Connections:**
- "Authentication Feature" → "Auth Implementation Tasks"
- "JWT Service" → "Security Testing Tasks"
- "User Management" → "Database Setup Tasks"

### 3. Manual Connections

To-Do nodes have handles on the left and right sides, allowing you to:
- **Drag connections** from any node to a To-Do node
- **Connect multiple features** to a single task list
- **Link related task lists** together

---

## How to Use

### Ask the AI to Create To-Do Nodes

**Example prompts:**
- "What are the implementation steps for the authentication feature?"
- "Create a task list for setting up the database"
- "Break down the user profile feature into actionable tasks"
- "What do I need to do to implement the API?"

### AI Will Suggest To-Do Nodes

The AI will respond with structured suggestions like:

```json
{
  "type": "add_node",
  "nodeType": "todo",
  "label": "Authentication Implementation",
  "description": "Tasks to implement user authentication",
  "todos": [
    { "text": "Setup OAuth provider", "completed": false },
    { "text": "Implement JWT middleware", "completed": false },
    { "text": "Add password reset flow", "completed": false },
    { "text": "Write authentication tests", "completed": false }
  ]
}
```

### AI Will Suggest Connections

```json
{
  "type": "add_edge",
  "source": "feature-authentication-node-id",
  "target": "todo-auth-tasks-node-id",
  "rationale": "Connect Authentication Feature to its implementation tasks"
}
```

---

## Backend Changes

### Updated Suggestion System Prompt

**File:** `backend/app/routes/suggestions.py`

**Added To-Do Node Type:**
```python
**Node Types:**
- feature: What to build (user-facing functionality)
- technical: How to build (architecture, tech stack, implementation)
- datamodel: Data structures (entities, fields, relationships)
- userstory: Who/why (user needs, acceptance criteria)
- todo: Implementation checklists (tasks, milestones, action items)  ← NEW
```

**Updated Connection Logic:**
```python
**Connection Logic (Left-to-Right Flow):**
1. **User Stories → Features**: Connect user needs to the features that fulfill them
2. **Features → Technical**: Connect what to build with how it's implemented
3. **Technical → Data Models**: Connect implementation to the data structures it uses
4. **Features → Data Models**: Connect features directly to the data they manage
5. **Features/Technical → To-Do**: Connect specifications to implementation tasks  ← NEW
6. **To-Do → To-Do**: Connect related task lists  ← NEW
```

**Added To-Do Guidelines:**
```python
**To-Do Nodes:**
- Use todo nodes to break down features/technical components into actionable task lists
- Suggest todo nodes when the user discusses implementation steps, milestones, or phases
- Connect todo nodes to their related feature/technical nodes
- Populate todos with specific, measurable tasks
- Example: "Authentication Feature" → "Auth To-Do" with tasks like 
  ["Setup OAuth provider", "Implement JWT middleware", "Add password reset flow"]
```

---

## Frontend Changes

### Updated Suggestion Types

**File:** `frontend/components/ChatPanel.tsx`

**Added todos field:**
```typescript
type Suggestion = {
  type: "add_node" | "update_node" | "add_edge" | "rename_project";
  nodeType?: string;
  label?: string;
  description?: string;
  category?: string;
  todos?: Array<{ text: string; completed: boolean }>;  // NEW
  // ... other fields
};
```

### Updated Node Positioning

**Added to-do positioning logic:**
```typescript
const nodeTypeColumns = {
  'userstory': 100,      // Far left
  'feature': 400,        // Middle-left
  'technical': 700,      // Middle-right
  'datamodel': 1000,     // Far right
  'todo': 100            // Bottom left  ← NEW
};

const baseY = suggestion.nodeType === 'todo'
  ? 400 + (sameTypeNodes.length * 180)  // Lower position for todos
  : 100 + (sameTypeNodes.length * 180); // Standard position
```

### Updated Icon Display

**Added to-do icon:**
```typescript
const getNodeTypeIcon = (nodeType: string): string => {
  switch (nodeType) {
    case "feature": return "◆";
    case "technical": return "⚙";
    case "datamodel": return "▣";
    case "userstory": return "◉";
    case "todo": return "✓";  // NEW
    case "notes": return "📝";
    default: return "•";
  }
};
```

---

## Examples

### Example 1: AI Suggests Tasks for a Feature

**User:** "I need to build a user registration system"

**AI Response:**
```
I'll add a User Registration feature and create an implementation checklist:

✓ Added:
◆ User Registration Feature
✓ Registration Implementation Tasks
  - Design registration form UI
  - Implement email validation
  - Setup password hashing
  - Create user database table
  - Add email verification
  - Write integration tests

⎯ Connected User Registration → Registration Tasks
```

### Example 2: Breaking Down Technical Work

**User:** "What do I need to do to set up the database?"

**AI Response:**
```
Let me create a database setup checklist for you:

✓ Added:
✓ Database Setup Tasks
  - Choose database (PostgreSQL recommended)
  - Design schema
  - Create migrations
  - Setup connection pooling
  - Configure backup strategy
  - Add monitoring

⎯ Connected Technical Architecture → Database Setup Tasks
```

### Example 3: Sprint Planning

**User:** "Create a sprint plan for the authentication system"

**AI Response:**
```
Here's a structured sprint plan:

✓ Added:
✓ Sprint 1: Auth Backend
  - Setup OAuth provider
  - Implement JWT service
  - Create user model
  - Add login endpoint

✓ Sprint 2: Auth Frontend
  - Build login form
  - Add session management
  - Implement token refresh
  - Add password reset UI

⎯ Connected Auth Backend → Auth Frontend
```

---

## Visual Flow

```
┌──────────────┐
│ User Story   │
│ "As a user..." │
└──────┬───────┘
       │
       ↓
┌──────────────┐     ┌──────────────┐
│   Feature    │────→│  To-Do List  │
│ "Registration"│    │ ✓ Form UI    │
└──────┬───────┘     │ ☐ Validation │
       │             │ ☐ API calls  │
       ↓             └──────────────┘
┌──────────────┐
│  Technical   │────→┌──────────────┐
│ "API Service"│     │  To-Do List  │
└──────┬───────┘     │ ✓ Endpoints  │
       │             │ ☐ Auth logic │
       ↓             │ ☐ Tests      │
┌──────────────┐     └──────────────┘
│  Data Model  │
│ "User Entity"│
└──────────────┘
```

---

## Benefits

✅ **Track Implementation** - Break down specs into actionable tasks  
✅ **Sprint Planning** - AI suggests realistic task breakdowns  
✅ **Progress Visualization** - See completed vs. remaining work  
✅ **Connected Workflow** - Link specifications to implementation  
✅ **AI-Assisted Planning** - Get smart task suggestions based on features  

---

## Files Modified

1. **`backend/app/routes/suggestions.py`** - Updated AI prompt with to-do support
2. **`frontend/components/ChatPanel.tsx`** - Added to-do handling and positioning
3. **`frontend/components/nodes/TodoNode.tsx`** - Already has connection handles
4. **`frontend/components/MindMap.tsx`** - Already registered todo node type
5. **`frontend/components/MindMapToolbar.tsx`** - Already has to-do button

---

## Testing

**Manual Connection:**
1. Create a Feature node
2. Create a To-Do node
3. Drag from Feature's right handle to To-Do's left handle
4. Connection created! ✓

**AI Connection:**
1. Ask AI: "What are the steps to implement user authentication?"
2. AI creates To-Do node with tasks
3. AI automatically connects it to the Authentication Feature
4. Review and approve the suggestions
5. Connection applied! ✓

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Status**: Completed

