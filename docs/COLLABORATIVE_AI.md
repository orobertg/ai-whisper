# Collaborative AI Mind Map System

## Overview

AI Whisper now features a **fully collaborative AI system** that works with you to build and refine your mind maps. The AI can analyze your conversations, suggest specific mind map changes, and automatically apply those changes with your approval.

## Key Features

### 🤖 Intelligent Suggestions
- **Context-Aware**: The AI analyzes your entire mind map (nodes, edges, template, progress) and conversation history
- **Structured Output**: AI provides specific, actionable suggestions in a standardized format
- **Smart Classification**: Suggestions are categorized as "minor", "moderate", or "major" impact

### ✅ Approval System
- **Minor Changes**: Auto-applied after 1 second (e.g., single node additions, clarifications)
- **Moderate/Major Changes**: Require explicit approval via the Suggestion Card UI
- **Clear Rationale**: Every suggestion includes reasoning for why it's important
- **Visual Feedback**: Suggestions appear as elegant cards with detailed information

### 🎯 Actions the AI Can Take

#### 1. Add Nodes
```typescript
{
  type: "add_node",
  nodeType: "feature|technical|datamodel|userstory",
  label: "Node Label",
  description: "Detailed description",
  category: "Category name",
  rationale: "Why this node is important"
}
```

#### 2. Update Nodes
```typescript
{
  type: "update_node",
  nodeId: "existing-node-id",
  updates: {
    label: "Updated label",
    description: "Updated description"
  },
  rationale: "Why this update is important"
}
```

#### 3. Add Connections
```typescript
{
  type: "add_edge",
  source: "source-node-id",
  target: "target-node-id",
  rationale: "Why these should be connected"
}
```

## How It Works

### Backend (Python/FastAPI)

**`/suggestions/analyze` Endpoint**
- Accepts: user message, mind map context, conversation history
- Uses AI (Ollama/OpenAI) to analyze and generate structured suggestions
- Returns: conversational message + structured suggestions + impact level

**AI System Prompt**
The AI is instructed to:
- Respond in a specific JSON format
- Provide clear rationale for each suggestion
- Consider the template and existing nodes
- Be incremental (don't overwhelm with too many suggestions)
- Ask clarifying questions when needed

### Frontend (React/TypeScript)

**SuggestionCard Component**
- Displays pending suggestions with expand/collapse
- Shows suggestion type, label, description, and rationale
- Provides "Apply Changes" and reject buttons
- Auto-apply mode for minor changes with pulsing animation

**ChatPanel Integration**
- Sends all messages to `/suggestions/analyze` endpoint
- Parses structured suggestions from AI response
- Auto-applies minor suggestions after brief delay
- Shows approval UI for moderate/major suggestions
- Handles applying changes to nodes and edges

**Mind Map Updates**
- New nodes are positioned intelligently (grouped by type)
- Node updates merge with existing data
- Edge creation maintains ReactFlow format
- All changes trigger auto-save

## User Experience

### Collaborative Flow

1. **User asks a question** about their project
2. **AI responds conversationally** while analyzing the mind map
3. **Suggestions appear** below the AI message (if any)
4. **For minor changes**: 
   - Pulsing "Applying suggestions..." indicator appears
   - Changes automatically applied after 1 second
5. **For moderate/major changes**:
   - Suggestion card appears with full details
   - User reviews each suggestion
   - User clicks "Apply Changes" or rejects
6. **Changes are applied** to the mind map
7. **Auto-save triggers** preserving both chat and mind map
8. **User can continue** chatting or manually editing

### Example Conversations

**Scenario 1: Small Addition**
```
User: "We need user authentication"
AI: "Great idea! For a SaaS app, you'll want email/password login with JWT tokens. Let me add that to your mind map."
[Auto-applies: Add "User Authentication" feature node]
```

**Scenario 2: Large Refactoring**
```
User: "Actually, let's use OAuth instead of email/password"
AI: "Switching to OAuth is a good choice for better security. This will require updating several nodes. Here's what I suggest:
1. Update 'User Authentication' to use OAuth 2.0
2. Add 'OAuth Provider Integration' node
3. Add 'Social Login Buttons' UI component
4. Connect these appropriately

Shall I make these changes?"
[Displays suggestion card with 4 changes, awaits approval]
```

## Settings & Preferences

### Theme Support
- Light, Dark, and System themes available
- Settings accessible via gear icon in top-right
- Theme preference persists in localStorage

### AI Configuration
- Ollama URL (default: `http://localhost:11434`)
- Model selection (default: `llama3.2:latest`)
- Configurable via Settings modal

## Technical Implementation

### Key Files

**Backend**
- `backend/app/routes/suggestions.py`: Suggestions endpoint
- `backend/app/ai.py`: AI provider abstraction (Ollama/OpenAI)

**Frontend**
- `frontend/components/SuggestionCard.tsx`: Suggestion display and approval UI
- `frontend/components/ChatPanel.tsx`: Chat + suggestions integration
- `frontend/app/page.tsx`: State management for nodes/edges

### Data Flow

```
User Message
    ↓
ChatPanel
    ↓
POST /suggestions/analyze
    ↓
AI Analysis (with mind map context)
    ↓
{message, suggestions[], impact, needsApproval}
    ↓
ChatPanel receives response
    ↓
If minor + !needsApproval: Auto-apply
If moderate/major: Show SuggestionCard
    ↓
User approves (or auto-apply timer expires)
    ↓
applySuggestions() modifies nodes/edges
    ↓
onNodesChange/onEdgesChange triggered
    ↓
Parent state updated
    ↓
hasUnsavedChanges = true
    ↓
Auto-save triggers (useEffect)
    ↓
PUT /mindmaps/{id} (nodes, edges, chat_history)
```

## Persistence

### Chat History
- Stored in `MindMap.chat_history` (JSON string)
- Loaded when resuming a project
- Saved after every message exchange

### Mind Map State
- Nodes and edges stored in `MindMap.nodes_json` and `edges_json`
- Auto-saved after AI modifications
- Manual save available via diskette icon

### Database Schema
```python
class MindMap(SQLModel, table=True):
    id: Optional[int]
    folder_id: Optional[int]
    title: str
    template_id: str
    nodes_json: str  # JSON array of nodes
    edges_json: str  # JSON array of edges
    chat_history: str  # JSON array of messages
    created_at: datetime
    updated_at: datetime
```

## Future Enhancements

- **Suggestion History**: Track which suggestions were accepted/rejected
- **Undo/Redo**: Allow reverting AI changes
- **Confidence Scores**: AI provides confidence level for each suggestion
- **Batch Operations**: Apply/reject multiple suggestions at once
- **Learning**: AI learns from user preferences over time
- **Conflict Resolution**: Smart handling when user manually edits while AI suggests changes

## Best Practices

### For Users
1. **Start with clear intent**: "I want to build a SaaS app with..."
2. **Review suggestions**: Don't blindly accept major changes
3. **Iterate gradually**: Work through one section at a time
4. **Save frequently**: Manual saves ensure no data loss
5. **Use folders**: Organize projects by type (Work/Personal/Archive)

### For Developers
1. **Test with real AI**: Ollama is free and runs locally
2. **Monitor suggestion quality**: Check if AI suggestions are helpful
3. **Handle errors gracefully**: AI might return invalid JSON
4. **Rate limiting**: Consider adding rate limits for API calls
5. **Cost management**: OpenAI calls can get expensive at scale

## Troubleshooting

### AI not making suggestions
- Check if Ollama is running: `curl http://localhost:11434/api/tags`
- Verify model is downloaded: `ollama list`
- Check backend logs: `docker-compose logs backend`

### Suggestions not applying
- Check browser console for JavaScript errors
- Verify `onNodesChange` and `onEdgesChange` props are passed
- Check network tab for failed API calls

### Auto-save not working
- Verify `currentMindMap.id` exists
- Check that `hasUnsavedChanges` is being set to `true`
- Look for errors in browser console

## API Reference

### POST /suggestions/analyze

**Request:**
```json
{
  "message": "User's message",
  "context": {
    "template_id": "saas-app",
    "template_name": "SaaS Application",
    "nodes": [...],
    "edges": [...],
    "progress": {...}
  },
  "history": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

**Response:**
```json
{
  "message": "AI's conversational response",
  "suggestions": [
    {
      "type": "add_node",
      "nodeType": "feature",
      "label": "User Authentication",
      "description": "Email/password login with JWT",
      "category": "Core Features",
      "rationale": "Essential for any SaaS app"
    }
  ],
  "impact": "moderate",
  "needsApproval": true
}
```

---

**Built with ❤️ for collaborative software specification**

