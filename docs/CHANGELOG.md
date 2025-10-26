# AI Whisper Changelog

## Phase 0: Mind Mapping Foundation (October 2025)

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

