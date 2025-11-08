# Phase 2 Feature Specification & Implementation Plan

**Date:** November 6, 2025  
**Version:** v0.4.0 Planning  
**Status:** 📋 Specification Phase

---

## 🎯 Overview

This document outlines the next major features for AI Whisper, focusing on enhanced project management, AI provider configuration, UI customization, and improved mind map interactions.

---

## 📊 Feature Categories

### 1. 🗂️ Enhanced Project Management & Hierarchy
### 2. ⚙️ AI Provider Configuration
### 3. 🎨 UI Customization (Wallpapers & Themes)
### 4. 🗺️ Mind Map UX Improvements

---

## 1. 🗂️ Enhanced Project Management & Hierarchy

### Current State
- **Folders** - Work, Personal, Archive (flat structure)
- **Projects** (Mind Maps) - Individual mind maps with chat history
- **No project grouping** - Each mind map is standalone

### Proposed Hierarchy

```
📁 Folders (e.g., Work, Personal, Archive)
  └── 📊 Projects (e.g., "SaaS Dashboard", "Mobile App")
      └── 💬 Chats/Sessions (e.g., "Initial Planning", "Feature Discussion")
          └── 🗺️ Mind Map (nodes, edges, chat history)
```

**Hierarchy Levels:**
1. **Folder** - Top-level organization (Work, Personal, etc.)
2. **Project** - Collection of related chats/sessions
3. **Chat/Session** - Individual conversation with its own mind map

### Features

#### 1.1 Project Management
- **Create Project** - New container for multiple chats
- **Project Metadata**:
  - Name/Title
  - Description
  - Created/Updated timestamps
  - Folder assignment
  - Tags (optional)
- **Project Dashboard** - View all chats within a project
- **Project Settings** - Edit name, description, move to folder

#### 1.2 Multi-Chat Support
- **Create New Chat in Project** - Start fresh conversation while keeping project context
- **Chat List** - View all chats within a project
- **Chat Metadata**:
  - Title (auto-generated from first message)
  - Created/Updated timestamps
  - Message count
  - Node count (from mind map)
- **Switch Between Chats** - Navigate between chats in same project
- **Chat Inheritance** (optional) - New chats can see/reference previous chats in project

#### 1.3 Delete Functionality
- **Delete Chat** - Remove individual chat and its mind map
  - Confirmation dialog
  - Option to archive instead of delete
- **Delete Project** - Remove project and all its chats
  - Warning about number of chats that will be deleted
  - Confirmation with project name input
- **Delete Folder** - Remove folder and all projects/chats
  - Warning about cascade deletion
  - Confirmation required
- **Soft Delete** - Move to "Trash" folder with 30-day retention (optional)

#### 1.4 Cross-Project AI Conversations
- **Project Context Search** - AI can search across user's projects
- **Reference Previous Work** - AI can cite information from other projects
- **Pattern Recognition** - AI learns from user's project patterns
- **Settings Toggle** - User can enable/disable cross-project AI access
- **Privacy Controls** - Exclude specific projects from AI cross-referencing

### Database Schema Changes

```typescript
// New Models
Project {
  id: number
  folder_id: number (foreign key)
  name: string
  description: string
  tags: string[] (JSON)
  created_at: datetime
  updated_at: datetime
}

Chat {
  id: number
  project_id: number (foreign key)
  title: string
  chat_history: string (JSON)
  created_at: datetime
  updated_at: datetime
}

MindMap {
  id: number
  chat_id: number (foreign key) // Changed from standalone
  nodes_json: string
  edges_json: string
  created_at: datetime
  updated_at: datetime
}
```

---

## 2. ⚙️ AI Provider Configuration

### Current State
- Ollama hardcoded as default
- OpenAI mentioned but not fully integrated
- No UI for switching providers
- Configuration via environment variables only

### Proposed Features

#### 2.1 Provider Management UI
**Location:** Settings Modal → New "AI Providers" Tab

**Supported Providers:**
1. **Ollama (Local)**
   - Base URL (default: http://localhost:11434)
   - Model selection (llama3.2, mistral, deepseek-r1, etc.)
   - Auto-detect available models
   - Connection status indicator
   
2. **OpenAI**
   - API Key input
   - Model selection (GPT-4, GPT-4-Turbo, GPT-3.5-Turbo)
   - Organization ID (optional)
   - Usage tracking
   
3. **Anthropic Claude**
   - API Key input
   - Model selection (Claude 3 Opus, Sonnet, Haiku)
   
4. **Google Gemini**
   - API Key input
   - Model selection (Gemini Pro, Gemini Ultra)
   
5. **DeepSeek**
   - API Key input
   - Model selection (DeepSeek Coder, DeepSeek Chat)
   
6. **HuggingFace (Future)**
   - API Token
   - Model selection from HF hub

#### 2.2 Provider Configuration Fields
```typescript
ProviderConfig {
  provider: "ollama" | "openai" | "anthropic" | "google" | "deepseek"
  enabled: boolean
  
  // Ollama
  ollama_base_url?: string
  ollama_model?: string
  
  // API-based providers
  api_key?: string
  organization_id?: string
  model?: string
  
  // Advanced settings
  temperature?: number (0-1)
  max_tokens?: number
  top_p?: number
  stream?: boolean
}
```

#### 2.3 UI Components

**Settings Modal Structure:**
```
⚙️ Settings
  ├── 🎨 Appearance (existing)
  ├── 🤖 AI Providers (NEW)
  │   ├── Provider Selection
  │   │   ├── [x] Ollama (Local)
  │   │   ├── [ ] OpenAI
  │   │   ├── [ ] Anthropic Claude
  │   │   └── [ ] Google Gemini
  │   ├── Active Provider: [Ollama ▼]
  │   └── Provider-Specific Settings
  │       └── [Current provider config form]
  └── 🔧 Advanced (optional)
```

**Provider Configuration Card:**
```
┌─────────────────────────────────────┐
│ 🤖 Ollama (Local)                   │
│                                     │
│ Status: ● Connected                 │
│                                     │
│ Base URL                            │
│ [http://localhost:11434        ]   │
│                                     │
│ Model                               │
│ [llama3.2:latest            ▼]    │
│                                     │
│ Advanced Settings ▼                 │
│ ├─ Temperature: [0.7    ]          │
│ ├─ Max Tokens:  [2048   ]          │
│ └─ Stream:      [x] Enabled        │
│                                     │
│ [Test Connection] [Save]            │
└─────────────────────────────────────┘
```

#### 2.4 Model Detection & Validation
- **Ollama**: Call `/api/tags` to list available models
- **API Providers**: Validate API key with test request
- **Connection Status**: Real-time status indicator (green/red dot)
- **Error Messages**: Clear feedback on connection issues

#### 2.5 Provider Storage
- Save to localStorage (for quick access)
- Optionally save to database (for multi-device sync)
- Encrypt API keys before storage
- Never log API keys

---

## 3. 🎨 UI Customization (Wallpapers & Themes)

### Current State
- Light/Dark/System theme toggle
- Solid background colors
- No wallpaper support

### Proposed Features

#### 3.1 Wallpaper System

**Wallpaper Options:**
1. **None** (default solid background)
2. **Gradient Presets** (10-15 curated gradients)
3. **Pattern Library** (subtle patterns: dots, grid, waves)
4. **Custom Upload** (user's own images)
5. **Unsplash Integration** (curated backgrounds - optional)

**Wallpaper Properties:**
```typescript
Wallpaper {
  id: string
  type: "none" | "gradient" | "pattern" | "image" | "unsplash"
  name: string
  preview_url: string
  
  // For gradients
  gradient?: {
    colors: string[]
    direction: "to-br" | "to-r" | "to-b" | etc.
  }
  
  // For patterns
  pattern?: {
    type: "dots" | "grid" | "waves" | "noise"
    color: string
    opacity: number
  }
  
  // For images
  image_url?: string
  
  // Computed
  tone: "light" | "dark" // Auto-detected or manual
  average_brightness: number (0-255)
}
```

#### 3.2 Automatic Contrast Adjustment

**Brightness Detection:**
- Calculate average luminance of wallpaper
- Formula: `luminance = (0.299*R + 0.587*G + 0.114*B)`
- Threshold: `< 128` = dark, `>= 128` = light

**Text Contrast Rules:**
```typescript
// Dark wallpaper
if (brightness < 128) {
  userMessages: "bg-white text-gray-900"
  aiMessages: "bg-gray-100 text-gray-900"
  inputBox: "bg-white/90 text-gray-900 border-white/20"
}

// Light wallpaper
if (brightness >= 128) {
  userMessages: "bg-gray-900 text-white"
  aiMessages: "bg-gray-800 text-white"
  inputBox: "bg-gray-900/90 text-white border-gray-900/20"
}
```

**Dynamic Adjustments:**
- Message bubbles with backdrop-blur for readability
- Input box with semi-transparent background
- Button colors adjusted for contrast
- Sidebar overlay dimming

#### 3.3 Wallpaper Selector UI

**Settings Modal → Appearance Tab:**
```
🎨 Appearance

┌─ Background Wallpaper ──────────────┐
│                                     │
│ [None] [Gradients] [Patterns] [Upload]
│                                     │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐          │
│ │  │ │  │ │  │ │  │ │  │          │
│ └──┘ └──┘ └──┘ └──┘ └──┘          │
│                                     │
│ Tone: [Auto-detect ▼]              │
│ ├─ ○ Auto-detect (recommended)     │
│ ├─ ○ Force Light                   │
│ └─ ○ Force Dark                    │
│                                     │
│ Preview: [Show in Chat]             │
└─────────────────────────────────────┘
```

**Gradient Presets:**
1. Ocean (blue-purple)
2. Sunset (orange-pink)
3. Forest (green-teal)
4. Lavender (purple-pink)
5. Midnight (dark-blue-black)
6. Cherry (red-pink)
7. Mint (green-blue)
8. Peach (orange-yellow)
9. Steel (gray-blue)
10. Aurora (multi-color)

#### 3.4 Implementation Approach
- Store wallpaper choice in localStorage
- Apply CSS classes dynamically based on tone
- Use CSS custom properties for colors
- Lazy-load wallpaper images
- Optimize images (WebP, compression)

---

## 4. 🗺️ Mind Map UX Improvements

### Current State
- Basic node dragging
- Delete via keyboard (Delete key)
- No undo/redo
- Small connection handles

### Proposed Features

#### 4.1 Hover Action Icons

**Node Hover State:**
```
┌─────────────────────────────┐
│ [🗑️]              [↶] [↷]  │ ← Hover icons appear
│                             │
│   Feature Node              │
│   Authentication System     │
│                             │
│   Description text here...  │
└─────────────────────────────┘
```

**Icon Positions:**
- **Delete** (🗑️ rubbish bin): Top-right corner
- **Undo** (↶): Top-right, next to delete
- **Redo** (↷): Top-right, next to undo

**Icons Used (from hugeicons):**
- `Delete01Icon` or `Delete02Icon` - Delete/trash
- `UndoIcon` or `ArrowTurnBackwardIcon` - Undo
- `RedoIcon` or `ArrowTurnForwardIcon` - Redo

**Behavior:**
- Icons appear on node hover (opacity fade-in)
- Icons disappear on hover out (opacity fade-out)
- Delete requires confirmation dialog
- Undo/Redo shows toast with action performed

#### 4.2 Enhanced Connection Handles

**Current Issue:**
- Small handle area (~8px)
- Hard to click precisely
- Confusing which handle is which

**Solution:**
- Increase handle size to 16-20px
- Add hover highlight (scale + glow)
- Color-code handles:
  - Source handles: Blue
  - Target handles: Green
- Show handle labels on hover
- Larger clickable area (invisible padding)

**Implementation:**
```typescript
// ReactFlow custom handle style
const handleStyle = {
  width: 16,
  height: 16,
  border: '2px solid #fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  transition: 'all 0.2s ease',
};

const handleHoverStyle = {
  transform: 'scale(1.3)',
  boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)',
};
```

#### 4.3 Delete Node Functionality

**Delete Confirmation Dialog:**
```
┌────────────────────────────────┐
│  Delete Node?                  │
│                                │
│  Are you sure you want to      │
│  delete "Authentication"?      │
│                                │
│  This will also remove:        │
│  • 2 connections               │
│  • Associated data             │
│                                │
│  [Cancel]    [Delete]          │
└────────────────────────────────┘
```

**Delete Behavior:**
- Click rubbish bin icon
- Show confirmation dialog
- On confirm:
  - Remove node from mind map
  - Remove all connected edges
  - Update progress metrics
  - Save to database
  - Show toast: "Node deleted"

#### 4.4 Undo/Redo System

**Action History:**
```typescript
type Action = {
  type: "add_node" | "delete_node" | "update_node" | 
        "add_edge" | "delete_edge" | "move_node"
  timestamp: Date
  data: {
    before: any  // State before action
    after: any   // State after action
  }
}

// History stack
const history: Action[] = []
const historyIndex: number = 0
```

**Undo/Redo Behavior:**
- **Undo**: Revert to previous state, move historyIndex back
- **Redo**: Apply next state, move historyIndex forward
- **Max History**: 50 actions (configurable)
- **Keyboard Shortcuts**:
  - Undo: `Ctrl+Z` / `Cmd+Z`
  - Redo: `Ctrl+Y` / `Cmd+Shift+Z`
- **Visual Feedback**: Toast showing "Undone: Added node"

**Actions to Track:**
- Add node
- Delete node
- Update node (edit label, description)
- Move node (position change)
- Add connection
- Delete connection

#### 4.5 Additional UX Improvements

**Mini-map Enhancements:**
- Click to navigate to area
- Highlight visible area
- Toggle mini-map visibility

**Zoom Controls:**
- Zoom slider (10% - 200%)
- Fit to screen button
- Reset zoom button
- Keyboard shortcuts: `+` / `-` to zoom

**Node Selection:**
- Multi-select with Ctrl+Click
- Drag-select multiple nodes
- Bulk actions (delete, move)

---

## 📋 Implementation Task Breakdown

### Phase 2.1: Project Hierarchy & Management (2-3 weeks)

#### Task Group A: Database Schema & API
- [ ] **A1**: Create `Project` model and database table
- [ ] **A2**: Update `Chat` model to reference `Project`
- [ ] **A3**: Update `MindMap` model to reference `Chat`
- [ ] **A4**: Create migration scripts for schema changes
- [ ] **A5**: Create `/projects/` API endpoints (CRUD)
- [ ] **A6**: Update `/mindmaps/` endpoints to work with new hierarchy
- [ ] **A7**: Create `/chats/` API endpoints (CRUD)
- [ ] **A8**: Implement delete endpoints with cascade logic
- [ ] **A9**: Add soft-delete / trash functionality (optional)

#### Task Group B: Frontend - Project Management
- [ ] **B1**: Create `ProjectList` component
- [ ] **B2**: Create `ProjectCard` component
- [ ] **B3**: Create `ChatList` component within project
- [ ] **B4**: Update `HomeScreen` to show projects instead of mind maps
- [ ] **B5**: Create "New Project" dialog
- [ ] **B6**: Create "New Chat in Project" button
- [ ] **B7**: Update navigation flow (Folder → Project → Chat → Mind Map)
- [ ] **B8**: Add breadcrumb navigation

#### Task Group C: Delete Functionality
- [ ] **C1**: Create `ConfirmDeleteDialog` component
- [ ] **C2**: Add delete button to chat items
- [ ] **C3**: Add delete button to project items
- [ ] **C4**: Implement cascade delete warning
- [ ] **C5**: Add delete confirmation with name input
- [ ] **C6**: Show deletion progress/feedback
- [ ] **C7**: Add "Move to Trash" option

#### Task Group D: Cross-Project AI
- [ ] **D1**: Design cross-project context schema
- [ ] **D2**: Create project indexing system
- [ ] **D3**: Update AI prompt to include cross-project context
- [ ] **D4**: Add privacy controls in settings
- [ ] **D5**: Implement project exclusion list
- [ ] **D6**: Add "Reference: [Project Name]" in AI responses
- [ ] **D7**: Test cross-project understanding

**Estimated Time**: 2-3 weeks  
**Priority**: High  
**Dependencies**: None

---

### Phase 2.2: AI Provider Configuration (1-2 weeks)

#### Task Group E: Backend Provider Support
- [ ] **E1**: Abstract AI provider interface
- [ ] **E2**: Implement Ollama provider class
- [ ] **E3**: Implement OpenAI provider class
- [ ] **E4**: Implement Anthropic provider class
- [ ] **E5**: Implement Google Gemini provider class
- [ ] **E6**: Implement DeepSeek provider class
- [ ] **E7**: Create provider factory/selector
- [ ] **E8**: Add provider validation endpoint
- [ ] **E9**: Implement model detection for Ollama

#### Task Group F: Frontend Provider UI
- [ ] **F1**: Add "AI Providers" tab to Settings modal
- [ ] **F2**: Create `ProviderSelector` component
- [ ] **F3**: Create `ProviderConfigCard` component (Ollama)
- [ ] **F4**: Create `ProviderConfigCard` component (OpenAI)
- [ ] **F5**: Create `ProviderConfigCard` component (Anthropic)
- [ ] **F6**: Create `ProviderConfigCard` component (Google)
- [ ] **F7**: Add "Test Connection" functionality
- [ ] **F8**: Add connection status indicators
- [ ] **F9**: Store provider config in localStorage
- [ ] **F10**: Update chat UI to show active provider

#### Task Group G: Security & Validation
- [ ] **G1**: Implement API key encryption
- [ ] **G2**: Add API key masking in UI (show ****1234)
- [ ] **G3**: Validate provider configuration before save
- [ ] **G4**: Handle provider errors gracefully
- [ ] **G5**: Add rate limiting info/warnings

**Estimated Time**: 1-2 weeks  
**Priority**: High  
**Dependencies**: None

---

### Phase 2.3: Wallpaper & Theme Customization (1 week)

#### Task Group H: Wallpaper System
- [ ] **H1**: Design wallpaper data structure
- [ ] **H2**: Create gradient preset library (10 gradients)
- [ ] **H3**: Create pattern library (5 patterns)
- [ ] **H4**: Implement brightness detection algorithm
- [ ] **H5**: Create wallpaper storage system
- [ ] **H6**: Add custom image upload functionality

#### Task Group I: Contrast Adjustment
- [ ] **I1**: Calculate wallpaper average brightness
- [ ] **I2**: Implement dynamic color scheme switching
- [ ] **I3**: Update message bubble styles based on tone
- [ ] **I4**: Update input box styles based on tone
- [ ] **I5**: Add backdrop-blur for readability
- [ ] **I6**: Test contrast ratios (WCAG compliance)

#### Task Group J: Wallpaper Selector UI
- [ ] **J1**: Add "Background" section to Appearance settings
- [ ] **J2**: Create `WallpaperGrid` component
- [ ] **J3**: Create `WallpaperPreview` component
- [ ] **J4**: Add tone override options (Auto/Light/Dark)
- [ ] **J5**: Add live preview in settings
- [ ] **J6**: Save wallpaper choice to localStorage
- [ ] **J7**: Apply wallpaper on chat screen

**Estimated Time**: 1 week  
**Priority**: Medium  
**Dependencies**: None

---

### Phase 2.4: Mind Map UX Improvements (1-2 weeks)

#### Task Group K: Hover Action Icons
- [ ] **K1**: Add hover state detection to custom nodes
- [ ] **K2**: Create `NodeActionIcons` component
- [ ] **K3**: Import Delete, Undo, Redo icons from hugeicons
- [ ] **K4**: Position icons in top-right corner
- [ ] **K5**: Add fade-in/out animations
- [ ] **K6**: Style icons (size, color, hover effects)
- [ ] **K7**: Integrate delete confirmation dialog

#### Task Group L: Enhanced Connection Handles
- [ ] **L1**: Update ReactFlow handle styles (larger size)
- [ ] **L2**: Add handle hover effects (scale, glow)
- [ ] **L3**: Color-code handles (blue for source, green for target)
- [ ] **L4**: Add invisible padding around handles
- [ ] **L5**: Test handle clickability on all node types
- [ ] **L6**: Add handle labels on hover (optional)

#### Task Group M: Undo/Redo System
- [ ] **M1**: Design action history data structure
- [ ] **M2**: Implement history stack with pointer
- [ ] **M3**: Track add_node actions
- [ ] **M4**: Track delete_node actions
- [ ] **M5**: Track update_node actions
- [ ] **M6**: Track add_edge actions
- [ ] **M7**: Track delete_edge actions
- [ ] **M8**: Implement undo function
- [ ] **M9**: Implement redo function
- [ ] **M10**: Add keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- [ ] **M11**: Show toast feedback for undo/redo
- [ ] **M12**: Limit history to 50 actions
- [ ] **M13**: Clear history on project switch

#### Task Group N: Additional Improvements
- [ ] **N1**: Add zoom slider to toolbar
- [ ] **N2**: Add "Fit to Screen" button
- [ ] **N3**: Add keyboard zoom shortcuts (+/-)
- [ ] **N4**: Enhance mini-map interactivity
- [ ] **N5**: Add multi-select functionality (Ctrl+Click)
- [ ] **N6**: Add drag-select area
- [ ] **N7**: Add bulk delete for multiple nodes

**Estimated Time**: 1-2 weeks  
**Priority**: Medium  
**Dependencies**: None

---

## 📅 Recommended Implementation Order

### Sprint 1 (Week 1-2): Foundation
1. **AI Provider Configuration** (Phase 2.2)
   - Most requested feature
   - Relatively independent
   - High user value

### Sprint 2 (Week 3-4): Project Management
2. **Project Hierarchy** (Phase 2.1 - Parts A, B)
   - Database schema changes
   - Frontend project management
   - Foundation for multi-chat

### Sprint 3 (Week 5-6): Chat & Delete
3. **Multi-Chat & Delete** (Phase 2.1 - Parts C, D)
   - Multiple chats per project
   - Delete functionality
   - Cross-project AI

### Sprint 4 (Week 7): UX Polish
4. **Mind Map UX** (Phase 2.4)
   - Hover icons
   - Enhanced handles
   - Undo/Redo

5. **Wallpaper System** (Phase 2.3)
   - Visual customization
   - Nice-to-have polish

---

## 🧪 Testing Requirements

### Functional Tests
- [ ] Create/Read/Update/Delete projects
- [ ] Create/Read/Update/Delete chats within projects
- [ ] Switch between chats in same project
- [ ] AI provider switching works correctly
- [ ] Model detection works for each provider
- [ ] Wallpaper brightness detection is accurate
- [ ] Text contrast is readable on all wallpapers
- [ ] Node deletion with edge cleanup
- [ ] Undo/Redo for all action types
- [ ] Connection handles are easy to use

### Integration Tests
- [ ] Database migrations run successfully
- [ ] Cascade deletes work correctly
- [ ] Cross-project AI can reference other projects
- [ ] Provider API keys are encrypted
- [ ] Wallpaper persists across sessions

### User Acceptance Tests
- [ ] Users can organize projects effectively
- [ ] Users can switch AI providers easily
- [ ] Users find wallpapers enhance experience
- [ ] Users find mind map editing intuitive
- [ ] Delete confirmations prevent accidents

---

## 📊 Success Metrics

### User Engagement
- Average number of projects per user
- Average chats per project
- Provider switch frequency
- Wallpaper customization rate
- Undo/Redo usage frequency

### Performance
- Project load time < 500ms
- Provider switching < 1s
- Wallpaper brightness detection < 100ms
- Undo/Redo action < 50ms

### Quality
- Delete error rate < 1%
- Provider connection success rate > 95%
- Wallpaper contrast compliance > 98%
- User satisfaction > 4.5/5

---

## 🚀 Next Steps

1. **Review this specification** - Validate requirements
2. **Prioritize features** - Decide implementation order
3. **Set timeline** - Assign deadlines for each sprint
4. **Start with Sprint 1** - AI Provider Configuration
5. **Iterate and improve** - Gather feedback and adjust

---

**Document Status:** 📋 Ready for Review  
**Next Action:** Approval and Sprint 1 kickoff  
**Estimated Total Time:** 6-8 weeks for all features  
**Version:** 1.0

