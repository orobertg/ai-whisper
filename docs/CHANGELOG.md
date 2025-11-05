# AI Whisper Changelog

All notable changes to AI Whisper will be documented in this file.

---

## [v0.3.0] - November 2025 - Home Screen & Chat Focus

### 🎉 Major Features

#### Modern Home Screen
- **Time-based greetings** - Good morning/afternoon/evening based on system time
- **Quick action cards** - Create project, Open project, Quick Chat buttons
- **Folder organization** - Work, Personal, Archive folders for project management
- **Recent conversations** - Shows last 3-5 projects with timestamps
- **Model status indicator** - Shows current AI provider (Ollama/OpenAI) with connection status
- **Weather widget placeholder** - UI for future weather integration
- **Sidebar navigation** - Folder filtering and project browsing

#### Chat Focus Mode
- **Fullscreen chat interface** - Expand AI chat to full screen with ⛶ button
- **Distraction-free experience** - Hide mind map and other panels
- **Expanded message input** - Larger text area (3 rows) in focus mode
- **Quick navigation** - Buttons to switch between mind map and settings
- **Keyboard-friendly** - ESC to exit focus mode

#### Settings Modal
- **Appearance customization** - Light/Dark/System theme with visual previews
- **Theme persistence** - Settings saved to localStorage
- **Custom background toggle** - Enable/disable custom backgrounds
- **Chat color toggle** - Customize chat bubble colors
- **Clean modal design** - Modern card-based settings interface

#### UI/UX Improvements
- **Sidebar toggle** - ⋮⋮ button to hide/show right sidebar
- **Mind map expansion** - Canvas expands to full width when sidebar hidden
- **Smooth animations** - Page transitions and state changes
- **Responsive design** - Works on desktop, tablet, and mobile
- **Icon consistency** - Using Hugeicons throughout

### 🐛 Bug Fixes
- Fixed chat history not loading on project resume
- Fixed settings not persisting across page reloads
- Fixed sidebar panels overlapping on small screens
- Fixed focus mode not properly hiding elements
- Improved auto-scroll behavior in chat

### 🎨 UI/UX Polish
- Monochromatic color scheme for cleaner look
- Better contrast in dark mode
- Improved button hover states
- More consistent spacing and padding
- Better loading states and transitions

---

## [v0.2.0] - October 2025 - AI Chat & Suggestions

### 🎉 Major Features

#### AI Chat Integration
- **Real-time chat** with AI assistant
- **Streaming responses** with character-by-character animation
- **Thinking indicator** with rotating logo animation
- **Chat history persistence** - Saves to database per project
- **Smart resumption** - Continues conversations from where you left off
- **Context-aware** - AI knows about your entire mind map

#### AI Suggestions System
- **Automatic suggestions** - AI analyzes your project and suggests improvements
- **Node creation suggestions** - AI recommends new nodes to add
- **Connection suggestions** - AI identifies missing relationships
- **Approval workflow** - Review all changes before applying
- **Impact assessment** - Shows minor/moderate/major impact labels
- **Applied changes feedback** - Confirmation messages showing what was changed

#### Enhanced AI Capabilities
- **Multi-turn conversations** - Natural back-and-forth dialogue
- **Project context extraction** - AI reads all nodes, edges, and progress
- **Template awareness** - AI knows which template you're using
- **Progress tracking** - AI identifies missing requirements
- **Smart suggestions** - Proactive recommendations based on best practices

#### Folder System
- **Project organization** - Create folders (Work, Personal, Archive, etc.)
- **Folder filtering** - View projects by folder
- **Folder metadata** - Custom icons and colors per folder
- **Folder API** - Full CRUD endpoints for folder management
- **Database model** - Added `Folder` table with relationships

#### Todo Node Type
- **Checklist support** - Create todo lists directly in mind map
- **Checkbox interaction** - Click to toggle completion status
- **Progress tracking** - Visual progress bar showing completion
- **AI integration** - AI can suggest todo items with pre-filled tasks
- **Persistent state** - Todo completion saved to database

### 🔧 Technical Improvements
- Added `/suggestions/analyze` endpoint for smart AI analysis
- Implemented suggestion approval/rejection system
- Created structured suggestion types (add_node, update_node, add_edge, rename_project)
- Added impact calculation for changes
- Improved AI prompt engineering for better suggestions
- Added `chat_history` field to MindMap model
- Created folder management API (`/folders/`)
- Enhanced node positioning logic for better auto-layout
- Added database migration support

---

## [v0.1.0] - October 2025 - Mind Mapping Foundation (Phase 0)

### 🚀 Major Features Added

#### 1. **ReactFlow Integration**
- Installed ReactFlow library for node-based mind mapping
- Replaced basic tldraw canvas with structured node system
- Added zoom, pan, minimap, and background grid controls

#### 2. **Custom Node Types** (5 types)
Created specialized nodes for different planning needs:
- **Feature Node** (Blue) - Core functionality with status and priority
- **Technical Node** (Green) - Implementation details and technology stack
- **User Story Node** (Yellow) - User needs and personas
- **Data Model Node** (Purple) - Database schemas and fields
- **Notes Node** (Gray) - Freeform notes and annotations

#### 3. **Template System**
Built pre-configured templates for common project types:
- **SaaS Application** - Auth, Dashboard, Settings, Billing, Database, API
- **API Service** - Endpoints, Authentication, Validation, Docs, Models
- **Mobile App** - Splash, Onboarding, Home, Navigation, State Management
- **Blank Canvas** - Start from scratch option

#### 4. **Template Selection Screen**
- Card-based UI for choosing project templates
- Visual preview with node/connection counts
- "Generate with AI" button for selected template
- Back navigation to switch templates

#### 5. **Backend API for Mind Maps**
- New `MindMap` model in database (SQLite)
- Full CRUD API endpoints:
  - `GET /mindmaps` - List all mind maps
  - `GET /mindmaps/{id}` - Get specific mind map
  - `POST /mindmaps` - Create new mind map
  - `PUT /mindmaps/{id}` - Update mind map
  - `DELETE /mindmaps/{id}` - Delete mind map
- JSON storage for nodes and edges

### 🎨 UI/UX Improvements

- **New Home Page Flow**:
  1. Template selector on first load
  2. Mind map editor with template
  3. Header showing template info and node/edge count
  4. Back button to return to template selection

- **Responsive Layout**:
  - 2/3 width for mind map canvas
  - 1/3 width for AI panel and notes sidebar
  - Full-screen mind map experience

- **Visual Indicators**:
  - Color-coded nodes by type
  - Animated edges for dependencies
  - Status badges (todo/in-progress/done)
  - Priority indicators (low/medium/high)
  - Technology stack labels

### 📁 New Files Created

**Frontend:**
- `components/MindMap.tsx` - Main ReactFlow component
- `components/TemplateSelector.tsx` - Template selection UI
- `components/nodes/FeatureNode.tsx`
- `components/nodes/TechnicalNode.tsx`
- `components/nodes/UserStoryNode.tsx`
- `components/nodes/DataModelNode.tsx`
- `components/nodes/NotesNode.tsx`
- `lib/templates.ts` - Template definitions

**Backend:**
- `app/routes/mindmaps.py` - Mind map CRUD API
- Updated `app/models.py` - Added MindMap model
- Updated `app/main.py` - Registered mindmaps router

**Documentation:**
- `docs/ROADMAP.md` - Added Phase 0 and implementation details
- `docs/CHANGELOG.md` - This file

### 🔧 Technical Changes

- Added ReactFlow dependencies to frontend
- Updated page.tsx to be a client component with state management
- Added JSON serialization for nodes/edges in backend
- Proper TypeScript types throughout
- No linter errors

### 📊 Stats

- **5 custom node types** created
- **3 pre-built templates** + blank canvas
- **10+ new files** created
- **Full CRUD API** for mind maps
- **Zero linter errors**

### ✅ Completed TODOs

1. ✅ Install ReactFlow package in frontend
2. ✅ Create MindMap component to replace Canvas
3. ✅ Create custom node types (Feature, Technical, UserStory, etc.)
4. ✅ Create template selection screen
5. ✅ Create first template (SaaS App) with sample nodes
6. ✅ Update backend to store mind map data

### 🎯 Next Steps (Phase 1)

From the roadmap, the next priorities are:
1. **Canvas/Mind Map persistence** - Auto-save mind map state
2. **Node editing** - Click to edit node properties
3. **Add node toolbar** - UI to add new nodes of different types
4. **List view** - Show all saved mind maps
5. **Export functionality** - Generate YAML specs from mind map
6. **AI integration** - Extract mind map and generate specifications

### 🐛 Known Issues

- Mind map state not yet persisted (only template loaded)
- No way to edit node properties after creation
- No toolbar to add new nodes
- AI panel doesn't extract mind map data yet
- Canvas component still exists but is unused

### 📝 Breaking Changes

- **Home page is now client component** (was server component)
- **Canvas.tsx is deprecated** (replaced by MindMap.tsx)
- **New database model** requires migration (auto-created on startup)

---

**Deployment Status:** ✅ Successfully deployed
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- New endpoint: http://localhost:8000/mindmaps

---

*Generated: October 19, 2025*

