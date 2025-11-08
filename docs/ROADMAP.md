# AI Whisper Roadmap

## 📊 Current Status (November 2025)

**Version:** v0.4.0  
**Phase:** 2 (AI Workflow Enhancement) - Sprint 1 Complete  
**Completion:** Phase 0 ✅ | Phase 1 ✅ | Phase 2 🚧 (Sprint 1 ✅) | Phase 3 ⏳ | Phase 4 ⏳

### Recent Milestones
- ✅ **Phase 0 Complete** - Mind mapping foundation with ReactFlow (October 2025)
- ✅ **Phase 1 Complete** - Full MVP with persistence, folders, chat history, **EXPORT** (November 5, 2025)
- ✅ **Sprint 1 Complete** - Multi-provider AI configuration (Ollama, OpenAI, Anthropic, Google, DeepSeek) (November 7, 2025)
- 🚧 **Phase 2 In Progress** - Enhanced AI capabilities (multi-model, custom prompts)

---

## Overview
AI Whisper is a **mind mapping tool for solo developers** that transforms visual project planning into AI-generated specification documents. 

### Product Vision
Unlike generic brainstorming tools, AI Whisper provides:
- **Structured templates** for different project types (SaaS, API, Mobile App, etc.)
- **Node-based mind mapping** (not freeform drawing) to organize requirements
- **AI-guided workflow** that asks the right questions to extract complete specifications
- **Specification generation** that converts your mind map into production-ready YAML docs
- **Self-hostable** for privacy and control

### Core User Journey
1. **Start from template** → Select project type (SaaS, API, etc.) or blank canvas
2. **Build mind map** → Add nodes for features, requirements, user stories
3. **AI assistance** → Answer questions, get suggestions, validate completeness
4. **Generate specs** → Export structured YAML specifications for development
5. **Iterate** → Refine and regenerate as project evolves

This document outlines strategic questions, technical improvements, and a phased development roadmap.

---

## Key Questions to Address

### 1. User & Value Proposition
- **Who is your primary user?** Solo developers? Teams? Product managers? Designers?
  ANSWER: Solo Developers

- **What's the core job-to-be-done?** Is it "spec generation from rough ideas" or "collaborative brainstorming" or "personal knowledge management"?
- **What makes this different from Notion + ChatGPT?** What's your unique value proposition?
  ANSWER: Spec generation from rough ideas. Asks the questions which need to be answered about developing good specification documentation but with a visual layout with good templating and guidance. Strong opinion toward self-hosting with the option of selecting local LLMs or SAS versions from OpenAI and HuggingFace, DeepSeek, Claude or Co-Pilot.

### 2. Core Workflow
- **How does canvas → notes → AI flow work?** Currently, the AI panel gets a static context string. Should it:
  - Auto-extract canvas shapes/text via tldraw's API?
    ANSWER: Yes, it should auto extract canvas shapes. This is not a drawing application, this is more of a Mind Mapping type application with nodes - the Nodes can be notes, or they can be document templates meant to enable the solo developer to get the right specifications together with solid guidance from an AI Assistant who's sole purpose is to extract the best specifications from the solo developer producing a good break-down of the specifications of the app to get to the best MVP.
  - Read all saved notes and combine them?
    Could be useful to combine them in a large document afterward, but this is based on how we categorize the specification documents. Topics and general outlines might contain multiple separate specification documents or one complete one. The user decides.
  - Let users select which notes/canvas elements to include?
    ANSWER: Yes, the user can determine which elements to include.
- **What happens after blueprint generation?** Can users:
  - Export to GitHub issues/PRs?
    ANSWER: No, not initially. Keep it simple. Export to markdown specification documents first. Then, we can export to Github later.
  - Iterate on blueprints with AI chat?
    ANSWER: Yes. Prefer to guide the user with an active AI which introduces itself and makes the process of learning how  to use the app easier, but also leads the effort in getting the right questions answered for a fully built-out set of specifications. However, the AI should offer to simplify the approach and make sure the basics are covered.
  - Share with others?
    ANSWER: No, exports specification documents perhaps to a github repo but definitely to a local folder.

### 3. Data Persistence & Management
- **Where is canvas data saved?** Currently only notes and blueprints are in the database 
   ANSWER: Yes, these should persist
- **Can users view/edit past blueprints and notes?** The UI only shows creation, not listing.
   ANSWER: This can be another phase.

- **Do users need versioning/history** for their blueprints?
   ANSWER: A separate later phase can include this feature.


### 4. AI Quality & Customization
- **Is the blueprint format standardized?** (e.g., always YAML, always certain sections)
  ANSWER: Always YAML.
- **Can users customize the AI prompt/style?** Different users might want different output formats
 ANSWER: A separate later phase can include this feature.
- **How do you handle multi-turn refinement?** Currently it's one-shot generation
 ANSWER: A separate later phase can include this feature.
---

## Development Roadmap

### ✅ Phase 0: Foundation - Mind Mapping UI (COMPLETED)
**Goal:** Transform blank canvas into structured mind mapping tool with templates

**Status:** ✅ **COMPLETE** - October 2025

**Completed Features:**
1. ✅ **Node-based UI** - Replaced free-form drawing with structured nodes/connections
   - ✅ 6 Node types: Feature, Technical, User Story, Data Model, Notes, Todo
   - ✅ Connection types: Dependencies, relationships, hierarchy
   - ✅ Visual indicators for completion status, priority, etc.

2. ✅ **Template System** - Pre-built templates for different project types
   - ✅ **SaaS Application** template (auth, dashboard, billing, settings, API, database)
   - ✅ **API Service** template (endpoints, auth, validation, docs, models)
   - ✅ **Mobile App** template (splash, onboarding, home, navigation, state)
   - ✅ **Spec-Driven Development** template (constitution, research, specs, implementation)
   - ✅ **Blank Canvas** option

3. ✅ **Template Selection Screen**
   - ✅ Card-based template selector on project creation
   - ✅ Template preview/description with node counts
   - ✅ "Start from scratch" option
   - ✅ Folder selection during template creation

4. ✅ **AI-Guided Workflow** - AI assistant guides through filling out nodes
   - ✅ Ask clarifying questions about project
   - ✅ Suggest missing components automatically
   - ✅ Validate completeness with progress metrics
   - ✅ Approval workflow for AI suggestions

### ✅ Phase 1: Complete the MVP Loop (COMPLETED)
**Goal:** Create a fully functional single-user experience with persistence

**Status:** ✅ **COMPLETE** - November 5, 2025

**Completed Features:**
1. ✅ **Canvas/Mind Map persistence** - Auto-save mind map state to SQLite (2-second delay)
2. ✅ **Node CRUD operations** - Create, read, update, delete nodes and connections
3. ✅ **List views** - Show past projects with search/filter by folder
4. ✅ **Canvas → AI integration** - Extract full node structure and pass to AI
5. ✅ **Better AI context extraction** - Comprehensive context with nodes, edges, template, progress
6. ✅ **Chat history persistence** - Save/load conversation history per project
7. ✅ **Folder organization** - Create and organize projects in folders
8. ✅ **Project management** - Full CRUD for mind maps and projects
9. ✅ **Home screen** - Modern UI with recent projects and quick actions
10. ✅ **Settings system** - Theme, AI provider, and customization options
11. ✅ **Export blueprints** - Export to Markdown and YAML with download/copy
    - ✅ Markdown format with full node details
    - ✅ YAML format with structured data
    - ✅ Copy to clipboard functionality
    - ✅ Download as file (.md or .yaml)
    - ✅ Live preview before export

### 📋 Phase 2: Enhanced Features & UX (PLANNED)
**Goal:** Advanced project management, AI configuration, and UX polish

**Status:** 📋 **PLANNING COMPLETE** - Ready to start Sprint 1

**See:** [PHASE_2_FEATURE_SPEC.md](../PHASE_2_FEATURE_SPEC.md) for full specification

**Phase 2 Features (v0.4.0):**

#### Sprint 1: AI Provider Configuration (Week 1-2) ✅ COMPLETE
**Status:** ✅ **COMPLETE** - November 7, 2025

**Completed Features:**
1. ✅ **Multi-provider support** - Ollama, OpenAI, Anthropic, Google Gemini, DeepSeek
   - ✅ Base AIProvider interface with abstract methods
   - ✅ 5 provider implementations with streaming support
   - ✅ Provider factory for easy instantiation
2. ✅ **Provider settings UI** - Configuration panel in settings modal
   - ✅ Tabbed settings interface (Appearance | AI Providers)
   - ✅ Provider selection dropdown
   - ✅ API key input with show/hide toggle
   - ✅ Base URL configuration
3. ✅ **Model selection** - Choose specific models per provider
   - ✅ "Load models" button to fetch available models
   - ✅ Manual model input fallback
   - ✅ Default models for each provider
4. ✅ **Connection validation** - Test provider connections
   - ✅ One-click connection testing
   - ✅ Real-time status feedback (green/red indicators)
   - ✅ Detailed error messages and model discovery
5. ✅ **API key management** - Secure storage
   - ✅ LocalStorage persistence (local only, never sent to servers)
   - ✅ Show/hide toggle for security

**API Endpoints:**
- `GET /providers/available` - List all providers
- `GET /providers/info` - Get provider metadata
- `POST /providers/test` - Test connection
- `POST /providers/models` - List available models
- `POST /providers/validate` - Validate configuration

**Documentation:** See `docs/SPRINT_1_COMPLETE.md` for full details

#### Sprint 2: Project Hierarchy (Week 3-4)
6. ⏳ **Project system** - Folders → Projects → Chats → Mind Maps
7. ⏳ **Multi-chat per project** - Multiple conversations within one project
8. ⏳ **Project management** - Create, edit, organize projects
9. ⏳ **Breadcrumb navigation** - Easy navigation through hierarchy

#### Sprint 3: Advanced Features (Week 5-6)
10. ⏳ **Delete functionality** - Delete chats, projects, folders with confirmation
11. ⏳ **Cross-project AI** - AI can reference information across projects
12. ⏳ **Privacy controls** - Control which projects AI can access

#### Sprint 4: UX Polish (Week 7-8)
13. ⏳ **Wallpaper backgrounds** - Custom backgrounds with auto-contrast
14. ⏳ **Node hover icons** - Delete, undo, redo buttons on hover
15. ⏳ **Enhanced connection handles** - Larger, easier-to-use handles
16. ⏳ **Undo/Redo system** - Full action history with keyboard shortcuts
17. ⏳ **Improved zoom/pan** - Better mind map navigation

**Estimated Time:** 6-8 weeks  
**Documentation:** Complete ✅  
**Next Step:** Begin Sprint 1

### Phase 3: Collaboration & Sharing (3-4 weeks)
**Goal:** Enable team workflows and sharing

9. **Authentication** - User accounts (start simple with email/password)
10. **Workspaces** - Organize projects/contexts
11. **Sharing** - Share blueprints via link (read-only or collaborative)
12. **Real-time collaboration** - Multiple users on same canvas (WebSocket + yjs)

### Phase 4: Power Features (ongoing)
**Goal:** Advanced features for power users and enterprises

13. **Version control** - Git-like diffing for blueprints
14. **Integrations** - GitHub, Jira, Linear, Notion
15. **AI agents** - Auto-generate code scaffolding, tests, docs from blueprints
16. **Canvas templates** - Pre-made diagrams (system architecture, user flows, etc.)

---

## Implementation Considerations: Mind Mapping

### Library Comparison

#### Option 1: ReactFlow (Recommended)
**Pros:**
- Most popular React flow/node library (30k+ stars)
- Excellent documentation and examples
- Built-in features: zoom, pan, minimap, edge types
- Custom node components easy to create
- Good TypeScript support
- Active maintenance

**Cons:**
- Learning curve for custom features
- Need to build template system on top

**Recommended for:** Production-ready, well-supported solution

#### Option 2: Xyflow (ReactFlow v2)
**Pros:**
- Modern rewrite of ReactFlow
- Better performance
- Cleaner API

**Cons:**
- Newer, less battle-tested
- Smaller community

#### Option 3: Build on tldraw
**Pros:**
- Already integrated
- Full control over behavior
- Familiar to team

**Cons:**
- More work to create node system
- Need to build everything from scratch
- Not purpose-built for mind mapping

**Decision Needed:** ReactFlow is likely the best choice for speed + quality.

### Template Data Structure

```yaml
template:
  id: "saas-app-template"
  name: "SaaS Application"
  description: "Full-stack SaaS boilerplate with auth and dashboard"
  category: "Product/SaaS"
  nodes:
    - id: "auth"
      type: "feature"
      label: "Authentication"
      position: { x: 100, y: 100 }
      data:
        description: "User login, signup, password reset"
        questions:
          - "What auth provider? (Email/Google/GitHub)"
          - "MFA required?"
    - id: "dashboard"
      type: "feature"
      label: "Dashboard"
      position: { x: 300, y: 100 }
  edges:
    - id: "e1"
      source: "auth"
      target: "dashboard"
      label: "requires"
```

### Node Types to Support

1. **Feature Node** - Core functionality (blue)
2. **Technical Requirement** - Implementation details (green)
3. **User Story** - User needs (yellow)
4. **Data Model** - Database/API schemas (purple)
5. **External Service** - Third-party integrations (orange)
6. **Question/Decision** - Unresolved items (red)

---

## Immediate Technical Improvements

### Critical Fixes
1. **Canvas persistence** - Currently tldraw state is lost on refresh
2. **Error handling** - Add try/catch, loading states, error toasts in frontend
3. **Environment config** - Create `.env.example` file (referenced in README but missing)

### Code Quality
4. **API validation** - Use Pydantic models instead of `Dict` in blueprints endpoint
5. **Frontend state management** - Consider React Query/SWR for API calls
6. **Type safety** - Define proper TypeScript types for API responses
7. **Database migrations** - Add Alembic for schema versioning

### UX Enhancements
8. **Loading states** - Show spinner during AI generation
9. **Toast notifications** - User feedback for save/error events
10. **Responsive design** - Optimize for mobile/tablet
11. **Keyboard shortcuts** - Power user accessibility

---

## Strategic Considerations

### Positioning Options
- **"Mind map to MVP"** - Visual project planning → AI-generated specifications
- **"Notion + Miro + AI for solo developers"** - Template-driven mind mapping + spec generation
- **"AI-powered specification assistant"** - Guide developers through structured planning with templates
- **"Self-hosted alternative to v0/Bolt with planning layer"** - Plan first, generate code later

### Monetization Paths
- **Freemium:** Free self-hosted, paid cloud with collaboration features
- **Usage-based:** Free tier, pay for AI generations beyond limit
- **Enterprise:** Self-hosted + support/custom integrations

### Competitive Analysis
**Compare against:**
- Notion AI (collaborative docs + AI)
- Gamma (AI presentation builder)
- Beautiful.ai (AI-powered design)
- Miro AI (collaborative whiteboard + AI)

**Your edge:**
- Self-hostable (privacy & control)
- Developer-focused workflow
- Integrated canvas + notes + AI in one tool
- Open architecture for extensions

---

## Quick Wins (Next Steps)

### Critical Priority: Mind Mapping Foundation
**These are ESSENTIAL to transform the product into a proper mind mapping tool:**

1. **Choose mind mapping library** - Evaluate options:
   - ReactFlow (most popular, flexible, good docs)
   - Xyflow (ReactFlow v2, modern)
   - Mermaid (diagram-as-code, limited interactivity)
   - Custom on tldraw (more work, full control)
   
2. **Create basic node types** - Start with 3-5 node types:
   - Feature node (what to build)
   - Technical Requirement node (how to build)
   - User Story node (who/why)
   - Notes node (freeform)
   
3. **Build template selection screen** - Like the image shown:
   - Card grid layout
   - Start with 2-3 templates
   - "Blank canvas" option
   
4. **Simple template: SaaS App** - First template to prove concept:
   - Pre-populate nodes: Auth, Dashboard, Settings, Database, Deployment
   - Show connections between components
   - Let user customize/add/remove nodes

### Secondary Priority: Core Functionality
5. **Make canvas persistent** - Save node/connection state to database
6. **Extract node content** - Pass structured node data to AI
7. **Improve AI prompt** - Use node structure to generate better specs
8. **Add loading states** - Show spinner/progress during AI generation

---

## Success Metrics to Track

### User Engagement
- Notes created per session
- Blueprints generated per week
- Canvas usage time
- Return user rate

### Product Quality
- Blueprint generation success rate
- Average time to first blueprint
- User-reported bugs/issues
- Feature request themes

### Business Goals
- Active self-hosters
- Cloud sign-ups (if applicable)
- API usage patterns
- Conversion rates (free → paid)

---

## Open Questions

### Mind Mapping & Templates
1. Should templates be editable/customizable by users, or fixed?
2. How many default templates should we ship with?
3. Should users be able to share templates with others?
4. What's the right level of structure vs. flexibility in nodes?
5. Should we support nested/hierarchical nodes or keep it flat?
6. How do we handle very large mind maps (100+ nodes)?

### Core Functionality
7. Should canvas support multiple pages/tabs (multiple mind maps per project)?
8. What's the ideal blueprint output format? (Markdown? YAML? Custom structure?)
   - **ANSWER:** Always YAML
9. Should notes support rich formatting beyond markdown?
10. Do users need offline mode?
11. Should there be a CLI for power users?

### Future Features
12. Should we support mind map export to other formats (PDF, PNG, Miro, etc.)?
13. How do we handle AI suggestions for node connections?
14. Should the AI be able to create/modify nodes directly?

---

## Contributing

If you're interested in contributing to AI Whisper, please:
1. Check the Phase 1 roadmap items above
2. Open an issue to discuss your proposed changes
3. Follow the coding standards in the existing codebase
4. Submit a PR with tests and documentation

---

*Last updated: October 2025*

