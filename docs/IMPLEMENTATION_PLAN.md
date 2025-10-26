# AI Whisper - AI-First Implementation Plan
## 2-Month MVP Development

**Timeline:** 8 weeks  
**Priority:** High - Don't skip details, make it excellent  
**Reference Design:** Synapse AI interface (clean sidebar, minimal chat)

---

## ✅ Confirmed Scope & Priorities

### User Experience
- ✅ Single-user, local-first (no multi-user complexity)
- ✅ Desktop-first, mobile-responsive
- ✅ Authentication: End of project only (very low priority)
- ✅ Real weather API integration

### Attachments (Priority Order)
1. **Web links** (Phase 4, Week 5) - Highest priority
2. **PDFs** (Phase 4, Week 6) - Medium priority  
3. **Images** (Phase 4, Week 7) - Lower priority
   - Image understanding > OCR
   - OCR is 3rd priority within images

### Storage & Infrastructure
- ✅ Local file storage (no cloud/S3)
- ✅ SQLite database (existing)
- ✅ Simple, straightforward architecture

### AI Features
- ✅ Auto-generate conversation summaries
- ✅ **Streaming responses** (character-by-character) - Core experience
- ✅ Model priority: **Ollama → GPT-4 → Claude**
- ✅ Test with Ollama (free), minimal cloud API usage

### Export
- ✅ YAML spec export (already exists)
- ✅ **NEW: Lucid Chart CSV export** for mind maps

---

## 📅 8-Week Development Schedule

### **Week 1-2: Phase 1 - AI-First Home Screen**

#### Week 1: Core Layout & Components
**Goal:** Replace project list with AI-first home screen

**Tasks:**
- [ ] **Day 1-2: Home Screen Layout**
  - Create new `HomeScreen` component
  - Synapse-style sidebar (left side, folders/history)
  - Main area for greeting and quick actions
  - Header with weather widget & model selector
  
- [ ] **Day 3-4: Greeting & Quick Actions**
  - Time-based greeting (Good morning/afternoon/evening)
  - User name storage (localStorage for now)
  - Quick action cards:
    - 🚀 Create New Project
    - 📂 Open Existing Project  
    - 📋 Browse Templates
    - 💡 Brainstorm with AI
  - Card hover effects, clean design
  
- [ ] **Day 5: Recent Conversations**
  - Create `ChatSession` model in backend
  - List past conversations in sidebar
  - Store title, summary, timestamp
  - Click to resume conversation

#### Week 2: Weather, Model Selector & Polish
**Tasks:**
- [ ] **Day 1-2: Weather Widget**
  - Integrate OpenWeatherMap API (free tier)
  - Browser geolocation for user location
  - Display: temp, condition, city name
  - Small icon, minimal design
  - Error handling (offline, API failure)
  
- [ ] **Day 3-4: Model Selector**
  - Dropdown showing current model
  - Support: Ollama (default), GPT-4, Claude
  - Store selection in localStorage
  - Show connection status (green/red dot)
  - Model switching logic
  
- [ ] **Day 5: Polish & Testing**
  - Responsive layout (desktop → mobile)
  - Animation transitions
  - Empty states (no conversations yet)
  - User testing & feedback

**Deliverable:** Beautiful AI-first home screen that welcomes users

---

### **Week 3-4: Phase 2 - Enhanced Full-Screen Chat**

#### Week 3: Full-Screen Chat UI
**Goal:** Transform chat into beautiful, minimal full-screen experience

**Tasks:**
- [ ] **Day 1-2: Full-Screen Layout**
  - Chat view component (takes full viewport)
  - Smooth transition from home screen
  - Exit button to return home
  - Persistent sidebar (Synapse-style) or hide on mobile
  
- [ ] **Day 3-4: Message Bubbles Redesign**
  - Minimal, clean design
  - User: right-aligned, subtle blue
  - AI: left-aligned, light gray
  - Markdown rendering (bold, italic, lists, code)
  - Code syntax highlighting
  - Message timestamps (subtle, hover)
  
- [ ] **Day 5: Enhanced Input**
  - Multi-line textarea with auto-expand
  - Attachment button (prep for Phase 4)
  - Send button (+ Enter to send)
  - Shift+Enter for new line
  - Character counter (optional)

#### Week 4: Streaming & Interactions
**Goal:** Make chat feel alive with streaming responses

**Tasks:**
- [ ] **Day 1-3: Streaming Responses** ⚡
  - Backend: Implement SSE (Server-Sent Events) streaming
  - Frontend: Character-by-character display
  - Typing animation (smooth, natural)
  - Handle interruptions (stop generation)
  - Error handling for stream failures
  
- [ ] **Day 4: Message Actions**
  - Copy message button
  - Regenerate response
  - Edit previous message (re-send)
  - Thumbs up/down feedback (store in DB)
  
- [ ] **Day 5: Polish & Testing**
  - Loading states (animated dots)
  - "AI is thinking..." indicator
  - Scroll to bottom on new message
  - Performance testing (long conversations)
  - Mobile responsive chat

**Deliverable:** Smooth, beautiful chat experience with streaming

---

### **Week 5-6: Phase 3 - Conversational Project Creation**

#### Week 5: Guided Onboarding
**Goal:** AI guides users to create projects through conversation

**Tasks:**
- [ ] **Day 1-2: Onboarding Flow**
  - "Brainstorm with AI" triggers guided flow
  - AI conversation script:
    - "What are you building?"
    - "Who is it for?"
    - "What problems does it solve?"
    - "What's your tech stack?"
  - Store responses as structured data
  
- [ ] **Day 3-4: Template Suggestion Logic**
  - Based on answers, AI suggests template
  - "Sounds like a SaaS app - let me suggest a template"
  - User can accept or continue brainstorming
  - Confidence scoring for suggestions
  
- [ ] **Day 5: Progressive Node Creation**
  - As user chats, create mind map nodes in background
  - Parse conversation for features, requirements
  - Tag nodes with types (feature, technical, etc.)

#### Week 6: Mind Map Transition
**Goal:** Seamless transition from chat to mind map

**Tasks:**
- [ ] **Day 1-2: Transition UI**
  - "Ready to see your project?" prompt
  - Smooth animation from chat → mind map
  - Mind map pre-populated with discussed items
  - Show what was generated
  
- [ ] **Day 3-4: Bi-directional Sync**
  - Mind map changes reflected in chat context
  - AI aware of manual node edits
  - "I see you added a new feature..."
  - Context preservation
  
- [ ] **Day 5: View Toggle**
  - Switch between chat, mind map, split view
  - Keyboard shortcut (Cmd/Ctrl + \)
  - Persistent view preference

**Deliverable:** Natural flow from conversation to visualization

---

### **Week 7: Phase 4 - Web Links & Context**

#### Week 7: Web Link Integration
**Goal:** Users can share links for context/inspiration

**Tasks:**
- [ ] **Day 1-2: Link Input**
  - Detect URLs in chat messages
  - Show preview card (title, description, image)
  - Store links with conversation
  
- [ ] **Day 3-4: Web Scraping**
  - Backend: Extract content from URLs
  - Use BeautifulSoup or Playwright
  - Extract: title, description, main content
  - Handle rate limiting, timeouts
  
- [ ] **Day 4-5: AI Context Integration**
  - Feed extracted content to AI
  - "Based on the article you shared..."
  - AI references links in responses
  - Show which links were used in context

**Deliverable:** Users can share web links for AI context

---

### **Week 8: Phase 5 - Polish, Export & Launch Prep**

#### Week 8: Final Features & Testing
**Goal:** Complete MVP, ready for use

**Tasks:**
- [ ] **Day 1-2: Lucid Chart CSV Export** 📊
  - Read lucid_mindmap_csv_guide.md
  - Implement CSV export endpoint
  - Download button in mind map view
  - Test with Lucid Chart import
  
- [ ] **Day 2-3: Conversation Management**
  - Auto-generate conversation summaries (AI)
  - Trigger: After 10 messages or on exit
  - Store summary with session
  - Search conversations (simple text search)
  - Delete conversations
  
- [ ] **Day 4: Model Switching Logic**
  - Ensure Ollama → GPT-4 → Claude works
  - Graceful fallback if model unavailable
  - Display model used per message
  - Usage tracking (tokens, costs)
  
- [ ] **Day 5: Final Polish**
  - Bug fixes from testing
  - Performance optimization
  - Documentation (README, user guide)
  - Demo video/screenshots

**Deliverable:** Polished, production-ready MVP

---

## 🎨 Design Guidelines (Synapse Reference)

### Layout
```
┌─────────────────────────────────────────────────┐
│ [Logo] AI Whisper     [Weather] [Model] [User] │ Header
├──────────┬──────────────────────────────────────┤
│ Folders  │                                      │
│ ├─Work   │         Main Content Area           │
│ ├─Personal│         (Home/Chat/Mind Map)        │
│          │                                      │
│ History  │                                      │
│ • Chat 1 │                                      │
│ • Chat 2 │                                      │
│ • Chat 3 │                                      │
│          │                                      │
│ [+ New]  │                                      │
└──────────┴──────────────────────────────────────┘
```

### Colors (Synapse-inspired)
- Background: Deep dark (#0a0a0a, #1a1a1a)
- Sidebar: Slightly lighter (#1e1e1e)
- Text: White/off-white (#ffffff, #e0e0e0)
- Accent: Purple/blue (#8b5cf6, #3b82f6)
- User messages: Soft blue (#2563eb)
- AI messages: Dark gray (#27272a)

### Typography
- Font: Inter or SF Pro (clean, modern)
- Headings: Bold, larger
- Body: Regular, 14-16px
- Code: Monospace (JetBrains Mono, Fira Code)

---

## 🔧 Technical Stack Decisions

### Frontend
- **Framework:** Next.js (existing)
- **Styling:** Tailwind CSS (existing)
- **State:** React Context or Zustand (for global state)
- **Streaming:** EventSource API (SSE)

### Backend
- **Framework:** FastAPI (existing)
- **Database:** SQLite (existing)
- **AI:** OpenAI SDK (streaming), Ollama API
- **Weather:** OpenWeatherMap API (free tier)
- **Web Scraping:** BeautifulSoup4 + httpx

### New Dependencies Needed
```python
# Backend (requirements.txt)
beautifulsoup4==4.12.2  # Web scraping
html2text==2020.1.16    # Convert HTML to markdown
```

```json
// Frontend (package.json)
// None needed - use native EventSource for streaming
```

---

## 📝 Implementation Order (Next 2 Weeks)

### This Week (Week 1): Home Screen Foundation
1. Create `HomeScreen` component with layout
2. Build quick action cards
3. Implement greeting logic
4. Add recent conversations sidebar
5. Basic navigation structure

### Next Week (Week 2): Home Screen Polish
1. Weather API integration
2. Model selector dropdown
3. Responsive design
4. Animation & transitions
5. User testing

**Then:** Move to Phase 2 (Full-Screen Chat)

---

## 🎯 Success Criteria

### Week 1-2 (Phase 1)
- ✅ Beautiful home screen replaces project list
- ✅ Quick actions work (create, open, template, brainstorm)
- ✅ Recent conversations display with summaries
- ✅ Weather widget shows real data
- ✅ Model selector allows switching
- ✅ Responsive on desktop and mobile

### Week 3-4 (Phase 2)
- ✅ Full-screen chat with minimal design
- ✅ Streaming responses work smoothly
- ✅ Message actions (copy, regenerate)
- ✅ Clean, unobtrusive interface
- ✅ Fast and responsive

### Week 5-6 (Phase 3)
- ✅ AI guides users through project creation
- ✅ Smart template suggestions
- ✅ Smooth transition to mind map
- ✅ Mind map pre-populated from chat

### Week 7 (Phase 4)
- ✅ Web links can be shared
- ✅ Content extracted and used by AI
- ✅ Link previews display nicely

### Week 8 (Phase 5)
- ✅ Lucid Chart CSV export works
- ✅ Auto-generated summaries
- ✅ All models (Ollama, GPT-4, Claude) work
- ✅ Polished, production-ready

---

## 🚀 Let's Start!

**Ready to begin Week 1, Day 1:**  
Building the foundation of the AI-first home screen.

Should I start implementing the `HomeScreen` component with the Synapse-style layout?

