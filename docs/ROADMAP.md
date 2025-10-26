# AI Whisper Roadmap

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
    ANSWER: No, not initially. Keep it simple. Export to markdown specification documents.
  - Iterate on blueprints with AI chat?
    ANSWER: Yes.
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

### Phase 0: Foundation - Mind Mapping UI (CRITICAL)
**Goal:** Transform blank canvas into structured mind mapping tool with templates

**Current Problem:** The app has a blank tldraw canvas, but needs to be a **structured mind mapping tool** with node-based workflow and templates.

**Required Changes:**
1. **Node-based UI** - Replace free-form drawing with structured nodes/connections
   - Node types: Specification documents, features, user stories, technical requirements
   - Connection types: Dependencies, relationships, hierarchy
   - Visual indicators for completion status, priority, etc.

2. **Template System** - Pre-built templates for different project types
   - **SaaS Application** template (auth, dashboard, API, database, deployment)
   - **API Service** template (endpoints, data models, authentication, docs)
   - **Mobile App** template (screens, navigation, state, backend integration)
   - **Full-Stack Web App** template (frontend components, backend services, database)
   - **Microservices Architecture** template (services, communication, infrastructure)
   - Custom template creation and saving

3. **Template Selection Screen** - Similar to shown in images
   - Card-based template selector on project creation
   - Template preview/description
   - "Start from scratch" option

4. **Guided Workflow** - AI assistant guides through filling out nodes
   - Ask clarifying questions per node type
   - Suggest missing components
   - Validate completeness

### Phase 1: Complete the MVP Loop (2-3 weeks)
**Goal:** Create a fully functional single-user experience with persistence

1. **Canvas/Mind Map persistence** - Save/load node-based canvas state to SQLite
2. **Node CRUD operations** - Create, read, update, delete nodes and connections
3. **List views** - Show past projects/mind maps with search/filter
4. **Canvas → AI integration** - Extract nodes/structure and pass to AI for spec generation
5. **Edit/delete** - CRUD operations for notes and blueprints

### Phase 2: Enhance AI Workflow (2-3 weeks)
**Goal:** Make AI generation more powerful and customizable

5. **Multi-turn chat** - Let users refine blueprints through conversation
6. **Template system** - Predefined blueprint formats (API spec, feature doc, architecture, etc.)
7. **Context selection UI** - Checkboxes to choose which notes/canvas to include
8. **Export options** - Copy as markdown, save as file, export to GitHub

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

