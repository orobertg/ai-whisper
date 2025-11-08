# AI Whisper

**AI-powered specification assistant for solo developers** - Create project specifications through AI-guided conversations and visual mind mapping.

AI Whisper combines conversational AI, structured templates, and node-based mind mapping to help you build complete project specifications. Self-hostable with local LLM support (Ollama) or cloud AI (OpenAI).

---

## ✨ Features

### 🏠 **Modern Home Screen**
- Time-based greetings (Good morning/afternoon/evening)
- Quick chat input with template selection
- Folder organization for projects
- Recent conversations with timestamps
- Weather widget and AI model status

### 💬 **AI Chat Assistant**
- Conversational project planning
- AI suggests nodes and connections automatically
- Chat history persistence per project
- Streaming responses with thinking indicator
- Suggestion approval system (review before applying)
- Focus mode for distraction-free chat
- Smart resumption with context

### 🗺️ **Mind Map Editor**
- **6 specialized node types:**
  - 🔷 Feature Node - Core functionality
  - ⚙️ Technical Node - Implementation details
  - 👤 User Story Node - User needs and personas
  - 📊 Data Model Node - Database schemas
  - 📝 Notes Node - Freeform notes
  - ✅ Todo Node - Task lists with checkboxes
- Drag-and-drop positioning
- Connection lines showing dependencies
- Minimap and zoom controls
- Auto-save (configurable)

### 📋 **Template System**
- **SaaS Application** - Auth, dashboard, billing, settings
- **API Service** - Endpoints, authentication, validation
- **Mobile App** - Screens, navigation, state management
- **Spec-Driven Development** - Structured spec workflow
- **Blank Canvas** - Start from scratch

### 📁 **Project Organization**
- Folder system (Work, Personal, Archive)
- Project list with search
- Recent projects sidebar
- Auto-save with timestamps

### ⚙️ **Settings & Customization**
- Theme selection (Light/Dark/System)
- AI provider switching (Ollama/OpenAI)
- Model selection per provider
- Custom background options
- Chat color customization

### 🎨 **UI/UX**
- Sidebar toggle for expanded mind map view
- Resizable panels
- Smooth animations and transitions
- Monochromatic, minimal design
- Keyboard shortcuts
- Mobile-responsive layout

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- (Optional) Ollama installed locally for local AI

### Setup

1. **Clone and navigate to the project**
```bash
cd aiwhisper
```

2. **Configure environment (optional)**

Create a `.env` file in the root directory:

```bash
# AI Provider: "ollama" (local) or "openai" (API)
AI_PROVIDER=ollama

# If using OpenAI:
OPENAI_API_KEY=your_api_key_here

# If using Ollama (default):
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest

# Backend API URL for frontend
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

3. **Start services**
```bash
docker compose up -d --build
```

4. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

5. **Using Ollama (Local AI)**

If using Ollama, make sure it's running:
```bash
# Check Ollama is running
curl http://localhost:11434

# Pull a model if needed
ollama pull llama3.2
```

### First Use

1. Open http://localhost:3000
2. Type a message in the chat input or click "Create project"
3. Select a template or start from scratch
4. Chat with AI to build your specification
5. AI will suggest nodes and connections - approve or reject them
6. Your work auto-saves to your local database

---

## 📚 Documentation

- **[Quick Start Guide](QUICK_START_NEW_FEATURES.md)** - Detailed walkthrough of new features
- **[Roadmap](docs/ROADMAP.md)** - Development roadmap and future features
- **[Changelog](docs/CHANGELOG.md)** - Version history and updates
- **[Architecture](docs/)** - Technical documentation

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ReactFlow** - Mind mapping
- **Hugeicons** - Icon system

### Backend
- **FastAPI** - Python web framework
- **SQLModel** - Database ORM (SQLite)
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### AI Integration
- **Ollama** - Local LLM support
- **OpenAI API** - Cloud AI (GPT-4, etc.)
- Pluggable architecture for other providers

### Infrastructure
- **Docker Compose** - Multi-container orchestration
- **SQLite** - Embedded database (zero config)

---

## 📁 Project Structure

```
aiwhisper/
├── frontend/              # Next.js frontend
│   ├── app/              # App router pages
│   ├── components/       # React components
│   │   ├── nodes/       # Custom ReactFlow nodes
│   │   ├── HomeScreen.tsx
│   │   ├── MindMap.tsx
│   │   ├── ChatPanel.tsx
│   │   └── Settings.tsx
│   └── lib/              # Utilities and templates
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routes/      # API endpoints
│   │   ├── models.py    # Database models
│   │   ├── ai.py        # AI integration
│   │   └── main.py      # App entry
│   └── requirements.txt
├── docs/                 # Documentation
├── docker-compose.yml
└── README.md
```

---

## 🎯 Use Cases

- **Project Planning**: Start a new project with AI guidance
- **Specification Writing**: Convert ideas into structured specs
- **Requirement Gathering**: Organize and document requirements
- **Architecture Design**: Map out system components and connections
- **MVP Scoping**: Define a minimum viable product scope
- **Documentation**: Create visual documentation

---

## 🔧 Development

### Run locally (without Docker)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

See the configuration section in Quick Start above for all available env vars.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Check the [Roadmap](docs/ROADMAP.md) for planned features
2. Open an issue to discuss your idea
3. Submit a PR with tests and documentation

---

## 📄 License

[Add your license here]

---

## 🙏 Acknowledgments

- Built with [ReactFlow](https://reactflow.dev/)
- Icons by [Hugeicons](https://hugeicons.com/)
- Inspired by GitHub Spec-Kit and specification-driven development

---

**Status**: ✅ Active Development | 🎉 Phase 1 MVP Complete | 📋 Phase 2 Planned

**Latest Updates (Nov 6, 2025):**
- ✅ Export to Markdown/YAML with download (Nov 5)
- ✅ Comprehensive AI context extraction (Nov 5)
- ✅ All Phase 1 MVP features complete (Nov 5)
- 📋 Phase 2 specification complete (Nov 6)
  - AI Provider Configuration (Ollama, OpenAI, Anthropic, Google, DeepSeek)
  - Project Hierarchy (Folders → Projects → Chats)
  - Wallpaper Backgrounds with auto-contrast
  - Mind Map UX (hover icons, undo/redo, enhanced handles)

For detailed documentation, see:
- [FEATURES.md](FEATURES.md) - Complete feature inventory
- [PHASE_2_FEATURE_SPEC.md](PHASE_2_FEATURE_SPEC.md) - Phase 2 detailed specification
- [PHASE_2_TASK_BREAKDOWN.md](PHASE_2_TASK_BREAKDOWN.md) - Implementation tasks
- [QUICK_START_NEW_FEATURES.md](QUICK_START_NEW_FEATURES.md) - Testing guide
- [PHASE_1_MVP_COMPLETION_SUMMARY.md](PHASE_1_MVP_COMPLETION_SUMMARY.md) - MVP completion
