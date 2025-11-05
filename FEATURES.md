# AI Whisper - Feature Documentation

Complete list of all implemented features in AI Whisper as of **November 2025 (v0.3.0)**.

---

## 🏠 Home Screen & Navigation

### Home Dashboard
- **Time-based greetings** - Displays "Good morning/afternoon/evening" based on system time
- **User personalization** - Shows user name in greeting (default: "there")
- **Quick chat input** - Prominent search-style input box for starting conversations
- **Model selector** - Dropdown to switch between Ollama, GPT-4, Claude, DeepSeek
- **Weather widget** - Placeholder for current weather (UI ready, API integration pending)
- **AI status indicator** - Shows current AI provider and connection status

### Quick Actions
- **Create project** - Opens template selector in expandable panel
- **Open project** - Shows list of all projects with timestamps
- **Quick chat** - Start conversation without selecting a template

### Navigation
- **Folder sidebar** - Left sidebar with folder navigation
- **Recent projects** - Shows last 3-5 projects in selected folder
- **"All Projects" view** - See all projects across folders
- **Folder filtering** - Click folder to filter projects

---

## 📁 Project Organization

### Folder System
- **Create folders** - Organize projects into categories
- **Pre-defined folders** - Work, Personal, Archive with custom icons
- **Custom icons** - Each folder can have a unique icon (📁, 💼, 🏠, 📦)
- **Custom colors** - Folders have color-coded borders and highlights
- **Folder selection** - Choose folder when creating new project
- **Folder-based filtering** - View projects by folder

### Project Management
- **Project list** - View all saved mind maps
- **Recent projects** - Quick access to recently edited projects
- **Project metadata** - Title, template type, last updated timestamp
- **Project timestamps** - Relative time display (2h ago, 3 days ago, etc.)
- **Project deletion** - Remove projects from database
- **Auto-save** - Automatic saving of mind map state (configurable interval)

---

## 🗺️ Mind Map Editor

### Node Types (6 types)

#### 1. Feature Node 🔷
- **Purpose:** Define core functionality and features
- **Fields:**
  - Label (title)
  - Description (details)
  - Status (todo/in-progress/done)
  - Priority (low/medium/high)
- **Color:** Blue gradient
- **Use cases:** User-facing features, capabilities

#### 2. Technical Node ⚙️
- **Purpose:** Implementation details and technical specs
- **Fields:**
  - Label (component name)
  - Description (technical details)
  - Technology (framework/tool)
- **Color:** Green gradient
- **Use cases:** Architecture, tech stack, infrastructure

#### 3. User Story Node 👤
- **Purpose:** User needs and requirements
- **Fields:**
  - Label (story title)
  - Description (as a [user], I want [action] so that [benefit])
  - Persona (user type)
- **Color:** Yellow gradient
- **Use cases:** User requirements, acceptance criteria

#### 4. Data Model Node 📊
- **Purpose:** Database schemas and data structures
- **Fields:**
  - Label (model name)
  - Description (purpose)
  - Fields (array of field names)
- **Color:** Purple gradient
- **Use cases:** Database design, API schemas

#### 5. Notes Node 📝
- **Purpose:** Freeform notes and documentation
- **Fields:**
  - Label (note title)
  - Content (markdown-supported text)
- **Color:** Gray gradient
- **Use cases:** Research, decisions, reminders

#### 6. Todo Node ✅
- **Purpose:** Task lists and checklists
- **Fields:**
  - Label (list name)
  - Description (context)
  - Todos (array of tasks with checkboxes)
- **Features:**
  - ✅ Interactive checkboxes
  - 📊 Progress bar showing completion %
  - ➕ Add new tasks inline
  - 🗑️ Delete completed tasks
- **Color:** Teal gradient
- **Use cases:** Implementation checklists, QA tasks

### Mind Map Controls
- **Drag & Drop** - Reposition nodes freely
- **Zoom & Pan** - Navigate large mind maps
- **Minimap** - Bird's eye view of entire map
- **Connection drawing** - Click and drag between nodes to create edges
- **Connection types** - Label connections (requires, uses, links to, etc.)
- **Delete** - Press Delete key to remove nodes or edges
- **Background grid** - Dotted grid for visual alignment
- **Auto-layout** - AI suggestions position nodes intelligently

### Mind Map Toolbar
- **Add node buttons** - Quick buttons for each node type
- **Node counter** - Shows count of each node type
- **Edge counter** - Shows total connections
- **Template info** - Displays active template name

### Canvas Features
- **Full-screen mode** - Expand mind map by hiding sidebar (⋮⋮ button)
- **Sidebar toggle** - Show/hide right panels
- **Responsive layout** - 2/3 width for map, 1/3 for sidebar (when visible)
- **Background customization** - Light/dark backgrounds (in Settings)

---

## 💬 AI Chat Assistant

### Chat Interface
- **Conversational AI** - Natural language interaction
- **Welcome message** - AI introduces itself on new projects
- **Message bubbles** - Clean, monochromatic design
- **User messages** - Right-aligned, dark background
- **AI messages** - Left-aligned, lighter background
- **Markdown support** - Code blocks, lists, formatting in AI responses

### Chat Features
- **Streaming responses** - Character-by-character animation
- **Thinking indicator** - Rotating AI logo while processing
- **Message history** - Scroll through entire conversation
- **Auto-scroll** - Automatically scrolls to latest message
- **Scroll indicator** - Shows when new messages arrive off-screen
- **Message actions** (in focus mode):
  - 📋 Copy message to clipboard
  - 🔄 Resend/regenerate response
  - 👍 Thumbs up feedback
  - 👎 Thumbs down feedback

### AI Suggestions
- **Automatic analysis** - AI analyzes mind map and suggests improvements
- **Node suggestions** - AI recommends new nodes to add
- **Connection suggestions** - AI identifies missing relationships
- **Update suggestions** - AI proposes changes to existing nodes
- **Rename suggestions** - AI suggests better project titles
- **Impact assessment** - Labels suggestions as minor/moderate/major

### Suggestion Approval System
- **Review before apply** - All AI changes require user approval
- **Suggestion cards** - Visual display of proposed changes
- **Node type icons** - Shows what type of node will be added
- **Rationale display** - AI explains why each change is suggested
- **Approve/Reject buttons** - User controls what gets applied
- **Applied confirmation** - System message showing what was changed
- **Rejected acknowledgment** - AI confirms rejection and continues

### Chat Persistence
- **History saving** - Conversations saved to database per project
- **Smart resumption** - Continue from where you left off
- **Context retention** - AI remembers entire conversation history
- **Long conversation handling** - Offers summary for chats with 30+ messages
- **Cross-session continuity** - Resume conversations days/weeks later

### Chat Focus Mode
- **Fullscreen chat** - Expand chat to fill entire viewport (⛶ button)
- **Distraction-free** - Hides mind map and other UI elements
- **Larger input** - 3-row message input area in focus mode
- **Quick navigation** - Buttons to return to mind map or open settings
- **Exit button** - ✕ to close focus mode

---

## ⚙️ Settings & Customization

### Settings Modal
- **Gear icon (⚙️)** - Top-right corner access
- **Modal overlay** - Clean, centered modal design
- **Click outside to close** - Intuitive dismissal

### Theme Settings
- **Three theme options:**
  1. **System preference** - Follows OS dark/light mode
  2. **Light mode** - Light backgrounds and dark text
  3. **Dark mode** - Dark backgrounds and light text
- **Visual previews** - Each theme shows miniature UI preview
- **Instant preview** - See changes before saving
- **Theme persistence** - Saved to localStorage

### Appearance Options
- **Custom background** - Toggle for custom background graphics
- **Chat color** - Toggle for colorful vs monochromatic chat bubbles
- **Toggle switches** - Modern iOS-style toggles

### AI Provider Settings (UI Ready, Backend Integration Needed)
- **Provider selection** - Dropdown for Ollama, OpenAI, Claude, etc.
- **Model selection** - Choose specific model per provider
- **Connection status** - Green checkmark when connected

---

## 📋 Templates

### Available Templates

#### 1. SaaS Application 🚀
- **Pre-loaded nodes:**
  - Authentication (Feature)
  - Dashboard (Feature)
  - User Settings (Feature)
  - Billing & Subscriptions (Feature)
  - User Model (Data Model)
  - REST API (Technical)
- **Pre-defined connections** - Auth → Dashboard, Settings → Database, etc.
- **Use case:** Building a software-as-a-service product

#### 2. API Service ⚡
- **Pre-loaded nodes:**
  - API Endpoints (Feature)
  - Authentication (Technical - JWT)
  - Request Validation (Technical)
  - API Documentation (Feature)
  - Data Models (Data Model)
- **Pre-defined connections** - Endpoints → Auth, Validation → Models
- **Use case:** Building a RESTful API or backend service

#### 3. Mobile App 📱
- **Pre-loaded nodes:**
  - Splash Screen (Feature)
  - Onboarding (Feature)
  - Home Screen (Feature)
  - Navigation (Technical)
  - State Management (Technical)
- **Pre-defined connections** - Splash → Onboarding → Home, Home → Navigation/State
- **Use case:** Building a mobile application (React Native, Flutter, etc.)

#### 4. Spec-Driven Development 📋
- **8-phase workflow:**
  1. Constitution & Principles (Notes)
  2. Research & Tech Stack (Notes)
  3. User Stories (User Story)
  4. Feature Specification (Feature)
  5. Technical Implementation (Technical)
  6. Data Schema (Data Model)
  7. Implementation Tasks (Todo)
  8. Validation & Testing (Todo)
- **Use case:** Structured specification workflow inspired by GitHub Spec-Kit

#### 5. Blank Canvas 📄
- **Empty mind map** - Start from scratch
- **No pre-loaded nodes** - Full creative freedom
- **Use case:** Custom projects that don't fit templates

### Template Features
- **Node counts** - Shows how many nodes and connections in each template
- **Template icons** - Emoji icons for visual distinction
- **Template descriptions** - Clear explanation of what each template is for
- **Template preview** - See node/edge count before selecting
- **Expandable selection** - Click template card to select, shows folder picker

---

## 🔌 Backend & API

### Database (SQLite)
- **MindMap table** - Stores mind map data, nodes, edges, chat history
- **Folder table** - Stores folder metadata
- **Note table** - Stores additional notes (legacy, may merge with Notes nodes)
- **Blueprint table** - Stores generated specifications (future feature)
- **JSON serialization** - Nodes and edges stored as JSON strings
- **Timestamps** - created_at, updated_at for all records
- **Foreign keys** - Folder relationships

### API Endpoints

#### Mind Maps (`/mindmaps/`)
- `GET /mindmaps/` - List all mind maps (with optional folder filter)
- `GET /mindmaps/{id}` - Get specific mind map with all data
- `POST /mindmaps/` - Create new mind map
- `PUT /mindmaps/{id}` - Update mind map (nodes, edges, chat history)
- `DELETE /mindmaps/{id}` - Delete mind map

#### Folders (`/folders/`)
- `GET /folders/` - List all folders
- `GET /folders/{id}` - Get specific folder
- `POST /folders/` - Create new folder
- `PUT /folders/{id}` - Update folder
- `DELETE /folders/{id}` - Delete folder

#### AI Suggestions (`/suggestions/`)
- `POST /suggestions/analyze` - Analyze mind map and get AI suggestions
  - Accepts: user message, context, history, project_id, project_title
  - Returns: AI message, suggestions array, impact level, approval flag

#### Chat (`/chat/`)
- `POST /chat/` - Send message to AI (legacy, being replaced by /suggestions/)

### AI Integration
- **Ollama support** - Local LLM via Ollama API
- **OpenAI support** - Cloud AI via OpenAI API
- **Environment configuration** - Switch providers via env vars
- **Context building** - Extracts full mind map context for AI
- **System prompts** - Specialized prompts for specification assistance

---

## 🎨 UI/UX Features

### Design System
- **Monochromatic palette** - Zinc/gray color scheme
- **Gradient accents** - Node types use subtle gradients
- **Icon system** - Hugeicons throughout
- **Consistent spacing** - Tailwind spacing scale (px-4, py-2, etc.)
- **Border radius** - Rounded corners for modern feel (rounded-lg, rounded-xl)
- **Shadows** - Subtle shadows for depth

### Animations & Transitions
- **Smooth transitions** - All state changes animated
- **Hover effects** - Button and card hover states
- **Slide-in animations** - Template and project lists expand smoothly
- **Fade transitions** - Modal and overlay animations
- **Loading animations** - Spinning indicators, rotating logos

### Responsive Design
- **Desktop-first** - Optimized for desktop/laptop use
- **Tablet support** - Responsive breakpoints with Tailwind
- **Mobile support** - Works on mobile devices (limited)
- **Flexible layouts** - Panels resize and stack appropriately

### Accessibility
- **Keyboard navigation** - Enter to send messages, Delete to remove nodes
- **Focus indicators** - Visible focus states on interactive elements
- **Semantic HTML** - Proper heading hierarchy, button roles
- **Color contrast** - WCAG-compliant text contrast ratios

---

## 🚧 Partially Implemented Features

These features have UI/infrastructure but are not fully functional:

### Export System
- ⏳ **Blueprint generation** - Convert mind map to YAML/Markdown spec
- ⏳ **Export to file** - Download as .md, .yaml, .pdf
- ⏳ **Copy to clipboard** - Copy formatted specification
- ⏳ **Export to GitHub** - Create issues/PRs from mind map

### Weather Widget
- ✅ **UI present** - Widget exists in home screen header
- ⏳ **API integration** - Not connected to real weather service
- ⏳ **Geolocation** - Automatic location detection pending
- ⏳ **User preferences** - Custom location selection pending

### Multi-Model Support
- ✅ **UI present** - Dropdown shows multiple models
- ⏳ **Backend switching** - Only Ollama/OpenAI fully implemented
- ⏳ **Model-specific settings** - Temperature, max tokens, etc.

---

## 📊 Progress Tracking

### Metrics Calculated
- **Completeness %** - Based on nodes added vs template requirements
- **Success probability %** - Heuristic based on completeness and connections
- **Missing items** - List of recommended nodes not yet added
- **Node counts** - Count of each node type
- **Edge counts** - Total connections between nodes

### Visual Indicators
- **Status badges** - Todo/In Progress/Done on feature nodes
- **Priority labels** - Low/Medium/High on feature nodes
- **Progress bars** - Completion % on todo nodes
- **Color coding** - Node colors indicate type at a glance

---

## 🔐 Security & Privacy

### Data Storage
- **Local database** - All data in SQLite file on your machine
- **No cloud sync** - Data never leaves your computer (when self-hosted)
- **Docker isolation** - Services run in containers

### AI Privacy
- **Ollama option** - Run AI completely locally (no data sent to cloud)
- **API key security** - OpenAI keys stored in env vars (not in code)
- **Context control** - Users control what data is sent to AI

---

## ✅ Feature Summary

**Implemented:** 95+ features across 7 major categories  
**In Progress:** 10 features (export, weather, multi-model)  
**Planned:** 20+ features in Phase 2-4 roadmap

---

**Last Updated:** November 5, 2025  
**Version:** v0.3.0  
**Status:** Active Development - Phase 2 In Progress

For technical implementation details, see source code and inline documentation.

