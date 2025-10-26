# AI Whisper

**Mind mapping for solo developers** - Transform visual planning into AI-generated specifications.

AI Whisper guides you through structured project planning with templates, node-based mind mapping, and AI-powered specification generation. Self-hostable for privacy and control.

## Quick start
```bash
cp .env.example .env   # add your OPENAI_API_KEY or set AI_PROVIDER=ollama
docker compose up -d --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000/docs
```

## Features
- 🎯 **Template-based planning** - SaaS, API, Mobile App, or custom
- 🗺️ **Node-based mind mapping** - Feature, Technical, User Story, Data Model nodes
- 🤖 **AI-guided workflow** - Smart questions to complete your specifications
- 📄 **YAML spec generation** - Export structured documentation
- 🔒 **Self-hostable** - Your data, your infrastructure

## Stack
- Frontend: Next.js (App Router) + Tailwind + ReactFlow
- Backend: FastAPI + SQLModel (SQLite)
- AI: OpenAI or Ollama (switch via env)

## Folders
- `frontend/` — web app (mind map, templates, AI panel)
- `backend/` — API (mind maps, notes, blueprints)
