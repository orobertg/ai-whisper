# Spec-Driven Development & User Control Improvements

## Overview
Major improvements to user control and workflow methodology inspired by [GitHub's Spec-Kit](https://github.com/github/spec-kit).

---

## ✅ Issue 1: Always Require User Approval

### Problem
The AI was auto-applying suggestions without giving users a chance to review or reject them. Users would see a question like "Shall I add these nodes?" but immediately see the "Apply changes" screen with no option to say "No".

### Solution

**Backend Changes** (`backend/app/routes/suggestions.py`):
```python
**Guidelines:**
- **ALWAYS set needsApproval: true for any node additions, modifications, or connections**
- Use "minor" impact only for single node additions with clear context
- Use "moderate" impact for 2-5 changes or when modifying existing nodes
- Use "major" impact for 6+ changes or significant structural changes
- **Wait for user approval before suggesting implementation - spec first, then implementation**
```

**Frontend Changes** (`frontend/components/ChatPanel.tsx`):
```typescript
// Handle suggestions - ALWAYS require user approval for transparency
if (suggestions.length > 0) {
  // Always show approval UI for all changes
  setPendingSuggestions({ suggestions, impact, messageId: assistantMessageId });
}
```

**Before:**
- AI asks "Shall I add...?"
- Auto-applies after 1 second
- No chance to decline

**After:**
- AI asks "Shall I add...?"
- Shows approval UI with clear "Apply Changes" and "Discard" buttons
- User has full control

---

## ✅ Issue 2: Multi-Connection Support

### Problem
Users wanted to connect one node to multiple other nodes easily.

### Solution

**Multiple connections are already supported** through ReactFlow handles. You can:
1. Drag from a node's right handle to one target
2. Drag from the same node's right handle to another target
3. Repeat for as many connections as needed

**AI now suggests multiple connections:**
```json
{
  "type": "add_edge",
  "source": "authentication-feature",
  "target": "jwt-service"
},
{
  "type": "add_edge",
  "source": "authentication-feature",
  "target": "session-management"
},
{
  "type": "add_edge",
  "source": "authentication-feature",
  "target": "password-reset"
}
```

**Updated AI Prompt:**
```python
**Multi-Connection Support:**
- One node can connect to many targets (e.g., one Feature → multiple Technical nodes)
- Suggest multiple edges when features need multiple implementations
- Example: "Authentication Feature" → ["JWT Service", "Session Management", "Password Reset"]
```

---

## ✅ Issue 3: Spec-Driven Development Template

### Inspiration: GitHub Spec-Kit

GitHub's [Spec-Kit](https://github.com/github/spec-kit) provides a structured methodology for AI-assisted development:

1. **Constitution** - Core principles and constraints
2. **Research** - Tech stack validation
3. **Specification** - Requirements (WHAT to build)
4. **Planning** - Technical approach (HOW to build)
5. **Tasks** - Implementation breakdown
6. **Validation** - Testing and QA

### New Template: Spec-Driven Development

**File:** `frontend/lib/templates.ts`

**Template Structure:**
```
Constitution & Principles (Notes)
         ↓
    Research & Tech Stack (Notes)
         ↓
    User Stories (User Story)
         ↓
    Feature Specifications (Feature)
         ↓
    Technical Implementation (Technical)
         ↓
    Data Schema (Data Model)
         ↓
    Implementation Checklist (To-Do)
         ↓
    Validation & Testing (To-Do)
```

**Key Nodes:**

1. **Constitution & Principles** (Notes)
   - Core principles (privacy, performance, simplicity)
   - Guides all downstream decisions
   
2. **Research & Tech Stack** (Notes)
   - Framework, database, deployment decisions
   - Informs technical implementations

3. **User Stories** (User Story)
   - As a [user], I want to [action] so that [benefit]
   - Defines requirements

4. **Feature Specifications** (Feature)
   - Detailed requirements
   - Acceptance criteria
   - Success metrics

5. **Technical Implementation** (Technical)
   - Architecture decisions
   - API design
   - Data flow

6. **Data Schema** (Data Model)
   - Database structure
   - Relationships
   - Fields

7. **Implementation Checklist** (To-Do)
   - Ordered implementation tasks
   - Setup → Models → Features → Tests → Deploy

8. **Validation & Testing** (To-Do)
   - Unit tests
   - Integration tests
   - Manual QA
   - Performance benchmarks

### Connections

The template includes logical connections showing the flow:

```
Constitution --guides--> User Stories
Constitution --informs--> Research
Research --determines--> Technical Plan
User Stories --defines--> Features
Features --specifies--> Technical Plan
Technical Plan --requires--> Data Model
Features --breaks down--> Implementation Tasks
Technical Plan --guides--> Implementation Tasks
Data Model --implements--> Implementation Tasks
Implementation Tasks --validates--> Validation
Features --acceptance criteria--> Validation
```

---

## AI Understanding of Spec-Driven Workflow

**Updated AI Prompt** (`backend/app/routes/suggestions.py`):

```python
**Spec-Driven Development Workflow:**
When working with Spec-Driven Development templates, follow this structured approach:

1. **Constitution Phase**: Establish core principles and constraints
   - Suggest adding principles as Notes nodes
   - These guide all downstream decisions
   
2. **Research Phase**: Validate tech stack and feasibility
   - Suggest research items as Notes nodes
   - Connect to technical nodes they inform
   
3. **Specification Phase**: Define WHAT before HOW
   - Start with User Stories (who/why)
   - Expand to Features (what to build)
   - Add acceptance criteria and success metrics
   - **DO NOT suggest implementation until specs are approved**
   
4. **Planning Phase**: Define technical approach
   - Technical nodes (how to build)
   - Data Models (structure)
   - Connect these to their related Features
   
5. **Task Breakdown Phase**: Break into actionable steps
   - Create To-Do nodes with ordered tasks
   - Connect tasks to their related specs
   - Respect dependencies between tasks
   
6. **Validation Phase**: Quality checks
   - Separate To-Do for testing/validation
   - Connect to Features for acceptance criteria
```

---

## Example Workflow

### Starting a New Project with Spec-Driven Template

**Step 1: Select Template**
- Choose "Spec-Driven Development" from template selector
- Mind map loads with structured workflow

**Step 2: Define Constitution**
User edits the Constitution node:
```
Core principles:
- User privacy is paramount
- Response time < 200ms
- Mobile-first design
- Test coverage > 80%
- Zero-downtime deployments
```

**Step 3: Research Phase**
User asks AI: "What's the best tech stack for a real-time chat app?"

AI responds with research and updates Research node:
```
Tech stack recommendations:
- Frontend: React + Socket.io
- Backend: Node.js + Express
- Database: PostgreSQL + Redis
- Deployment: Docker + Kubernetes
```

**Step 4: Define Requirements**
User adds user stories:
- "As a user, I want to send messages in real-time"
- "As a user, I want to see typing indicators"
- "As a user, I want message history"

**Step 5: AI Suggests Features**
AI suggests (with approval required):
- "Real-time Messaging" feature
- "Presence & Status" feature
- "Message History" feature
- Connections from user stories to features

**Step 6: Technical Planning**
User asks: "How should we implement real-time messaging?"

AI suggests:
- WebSocket service (Technical node)
- Message queue (Technical node)
- Push notifications (Technical node)
- Connections from features to technical nodes

**Step 7: Implementation Tasks**
AI breaks down into To-Do nodes:
```
Real-time Messaging Tasks:
☐ Setup Socket.io server
☐ Implement message broadcasting
☐ Add message persistence
☐ Handle disconnections
☐ Add reconnection logic
☐ Write integration tests
```

**Step 8: Validation**
AI creates validation checklist:
```
Validation Tasks:
☐ WebSocket connection stable
☐ Messages deliver < 100ms
☐ Handles 1000 concurrent users
☐ Offline messages queued
☐ All tests passing
```

---

## Benefits

### User Control
✅ **Explicit Approval** - No surprise changes  
✅ **Clear Questions** - AI asks before acting  
✅ **Visible Changes** - See exactly what will be applied  
✅ **Easy Rejection** - One-click discard  

### Multi-Connections
✅ **Flexible Architecture** - One feature → many implementations  
✅ **AI Suggestions** - Automatically suggests multiple connections  
✅ **Manual Control** - Drag to create connections as needed  

### Spec-Driven Workflow
✅ **Structured Process** - Clear phases from concept to implementation  
✅ **Constitution First** - Principles guide all decisions  
✅ **Spec Before Code** - Define WHAT before HOW  
✅ **Validation Built-in** - Quality checks integrated  
✅ **AI Guided** - AI understands and follows the methodology  

---

## Comparison: AI Whisper vs GitHub Spec-Kit

| Aspect | GitHub Spec-Kit | AI Whisper |
|--------|----------------|------------|
| **Constitution** | `memory/constitution.md` | Constitution node (Notes) |
| **Research** | `research.md` | Research node (Notes) |
| **Specification** | `specs/*/spec.md` | User Stories + Features |
| **Planning** | `specs/*/plan.md` | Technical + Data Model nodes |
| **Tasks** | `specs/*/tasks.md` | To-Do nodes |
| **Validation** | Checkpoints in tasks | Validation To-Do node |
| **Visualization** | File structure | Visual mind map |
| **AI Integration** | Claude Code commands | Real-time chat + suggestions |

### Unique Advantages of AI Whisper:
- **Visual Mind Map** - See entire project structure at a glance
- **Real-time Connections** - Visual relationships between components
- **Interactive Editing** - Double-click to edit, drag to connect
- **Parallel Workflows** - Multiple streams visible simultaneously
- **Resizable Nodes** - Expand for detail, shrink for overview
- **Chat Integration** - Conversational spec building
- **Template Library** - Start from proven patterns

---

## Files Modified

1. **`backend/app/routes/suggestions.py`**
   - Added mandatory approval requirement
   - Added Spec-Driven workflow guidance
   - Added multi-connection support

2. **`frontend/components/ChatPanel.tsx`**
   - Removed auto-apply logic
   - Always show approval UI

3. **`frontend/lib/templates.ts`**
   - Added Spec-Driven Development template
   - 8 pre-connected nodes
   - 11 logical edges

---

## Usage Tips

### For Spec-Driven Projects

1. **Start with principles** - Define your constitution first
2. **Research thoroughly** - Validate tech choices early
3. **Spec completely** - All user stories before features
4. **Plan technically** - Architecture before tasks
5. **Break down work** - Atomic, testable tasks
6. **Validate often** - Check against acceptance criteria

### For Multiple Connections

**AI Prompts:**
- "Connect the Authentication feature to all security-related technical nodes"
- "This feature needs multiple API endpoints - suggest connections"
- "What technical components does this feature depend on?"

**Manual:**
- Select source node
- Drag from right handle
- Drop on first target
- Repeat for additional targets

---

## Future Enhancements

### Planned
- [ ] Constitution validation (check if decisions align with principles)
- [ ] Progress tracking per phase
- [ ] Export to Spec-Kit format
- [ ] Import from Spec-Kit projects
- [ ] AI-suggested phase transitions
- [ ] Dependency analysis
- [ ] Critical path highlighting

### Considered
- [ ] Gantt chart view
- [ ] Resource allocation
- [ ] Time estimates per phase
- [ ] Collaboration features
- [ ] Version control integration

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Status**: Completed  
**Reference**: [GitHub Spec-Kit](https://github.com/github/spec-kit)

