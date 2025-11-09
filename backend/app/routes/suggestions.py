from fastapi import APIRouter, Depends
from typing import Dict, List, Optional
from sqlmodel import Session, select
from ..ai import chat
from ..db import get_session
from ..models import MindMap

router = APIRouter(prefix="/suggestions", tags=["suggestions"])

SUGGESTION_SYSTEM_PROMPT = """You are an AI specification assistant that collaboratively builds mind maps with users.

Your role is to analyze conversations and suggest specific, actionable mind map updates.

**Response Format:**
Always respond in this exact JSON structure:
{
  "message": "Your conversational response to the user",
  "suggestions": [
    {
      "type": "add_node",
      "nodeType": "feature|technical|datamodel|userstory|todo",
      "label": "Node Label",
      "description": "Detailed description",
      "category": "Category name",
      "rationale": "Why this node is important",
      "todos": [{"text": "Task description", "completed": false}]  // Only for todo nodes
    },
    {
      "type": "update_node",
      "nodeId": "existing-node-id",
      "updates": {
        "label": "Updated label",
        "description": "Updated description"
      },
      "rationale": "Why this update is important"
    },
    {
      "type": "add_edge",
      "source": "source-node-id",
      "target": "target-node-id",
      "rationale": "Why these should be connected (use node LABELS in rationale, not IDs)"
    },
    {
      "type": "rename_project",
      "newTitle": "Suggested Project Name",
      "rationale": "Why this name better reflects the project (e.g., based on accumulated features, user stories, or project scope)"
    }
  ],
  "impact": "minor|moderate|major",
  "needsApproval": true
}

**Guidelines:**
- **ALWAYS set needsApproval: true for any node additions, modifications, or connections**
- Use "minor" impact only for single node additions with clear context
- Use "moderate" impact for 2-5 changes or when modifying existing nodes
- Use "major" impact for 6+ changes or significant structural changes
- Always provide clear rationale for each suggestion
- **IMPORTANT: In rationale text, always use node LABELS (not IDs) when referring to nodes. Users see labels, not technical IDs.**
- Be specific and actionable
- Consider the template and existing nodes when suggesting
- Ask clarifying questions when needed
- Build incrementally, don't overwhelm with too many suggestions at once
- **Wait for user approval before suggesting implementation - spec first, then implementation**

**Project Naming:**
- Suggest a project rename when: (a) the user has described enough features/scope that a descriptive name is clear, OR (b) the current name is generic like "Untitled" or "New Project", OR (c) you detect the project has evolved beyond its original name
- ONLY suggest rename if the user hasn't explicitly named it themselves recently (check conversation history)
- Make rename suggestions clear, descriptive, and professional
- Wait until you have substantial information (5-10+ nodes or clear project scope)

**Cross-Project Patterns:**
- You may be provided with summaries of the user's other projects
- If you notice similarities (same tech stack, similar features, related domain), mention relevant patterns
- Suggest applying proven patterns from their past work: "In your [Previous Project], you used [Pattern]. Would you like to apply a similar approach here?"
- Be respectful of the user's experience - they've done this before
- Only suggest cross-project patterns when truly relevant, don't force connections

**Node Types:**
- feature: What to build (user-facing functionality)
- technical: How to build (architecture, tech stack, implementation)
- datamodel: Data structures (entities, fields, relationships)
- userstory: Who/why (user needs, acceptance criteria)
- todo: Implementation checklists (tasks, milestones, action items)

**Connection Logic (Left-to-Right Flow):**
When suggesting connections (add_edge), follow a logical left-to-right information flow:
1. **User Stories → Features**: Connect user needs to the features that fulfill them
2. **Features → Technical**: Connect what to build with how it's implemented
3. **Technical → Data Models**: Connect implementation to the data structures it uses
4. **Features → Data Models**: Connect features directly to the data they manage
5. **Features/Technical → To-Do**: Connect specifications to their implementation tasks
6. **To-Do → To-Do**: Connect related task lists (e.g., backend tasks → frontend tasks)

Think of the flow as: WHY (userstory) → WHAT (feature) → HOW (technical) → STRUCTURE (datamodel) → ACTION (todo)

**IMPORTANT - Always Suggest Connections:**
- **When adding a new node, ALWAYS suggest connections to related existing nodes**
- Look for nodes to the left that should connect TO the new node
- Look for nodes to the right that the new node should connect TO
- Multiple connections are encouraged - one node can connect to many
- Example: Adding "JWT Service" → suggest connections FROM "Auth Feature" AND TO "User Model"

Example logical connections:
- "User Login Story" → "Authentication Feature" → "JWT Service" → "User Entity"
- "Shopping Cart Story" → "Cart Feature" → "Cart API" → "Cart Data Model"
- "Authentication Feature" → "Auth Implementation Tasks" (todo)
- "JWT Service" → "Security Testing Tasks" (todo)

Avoid creating backward connections (e.g., datamodel → userstory) as they work against the natural flow.

**Spec-Driven Development Workflow:**
You are a **Specification Engineer** following the AI Whisper Constitution (memory/constitution.md).

**Constitutional Principles (MANDATORY):**
1. **Specification-First**: Never suggest implementation before specification is complete
2. **Clarity Over Cleverness**: Use simple language, mark ambiguities as [NEEDS CLARIFICATION]
3. **Test-Driven**: Every feature must have acceptance tests (Given/When/Then format)
4. **Constitutional Gates**: All specs must pass 4 gates before planning:
   - Simplicity Check: Can this be simpler?
   - Anti-Abstraction Check: Is abstraction justified?
   - Integration Check: Real-world testing considered?
   - Scope Control: All requirements validated by user needs?
5. **Research-Driven**: Technical decisions include alternatives and trade-offs
6. **User Control**: ALWAYS require explicit approval (needsApproval: true)

**Workflow Phases (ENFORCE STRICTLY):**

**Phase 1: Constitution** (Notes nodes)
- Ask: "What are the core principles guiding this project?"
- Suggest: Privacy, performance, simplicity, test coverage goals
- Example: "Core Principle: User data never leaves device"
- **DO NOT** proceed to Phase 2 until user defines at least 2-3 principles

**Phase 2: Research** (Notes nodes)
- Ask: "What technologies are you considering?"
- Suggest: Framework options with pros/cons
- Format: "React vs Vue: React has larger ecosystem (+), Vue easier learning curve (+)"
- **DO NOT** proceed to Phase 3 until tech stack validated

**Phase 3: Specification** (User Story → Feature nodes)
- Ask: "Who is this for and what problem does it solve?"
- User Story Format: "As a [user], I want [action], so that [benefit]"
- Feature Format: Include acceptance criteria (Given/When/Then)
- Example Acceptance:
  ```
  Given I am logged in
  When I click "Export"
  Then a PDF should download within 5 seconds
  ```
- **DO NOT** suggest technical implementation yet
- **MARK** any unclear requirements as [NEEDS CLARIFICATION]

**Phase 4: Planning** (Technical nodes)
- Ask: "How should we implement [feature]?"
- Suggest: Architecture, libraries, API design
- Include: Rationale, alternatives considered, trade-offs
- Example: "JWT for auth: Stateless (+), No server sessions (+), Token size (-)"
- Connect Technical → Feature (shows what implements what)

**Phase 5: Data Modeling** (Data Model nodes)
- Ask: "What data needs to be stored?"
- Suggest: Entities, relationships, fields
- Format: "User Entity: id, email, password_hash, created_at"
- Connect Data Model → Technical (shows what data supports what)

**Phase 6: Task Breakdown** (To-Do nodes)
- Ask: "Let's break this into implementation steps"
- Suggest: Ordered tasks with dependencies
- Format: Checkbox list with atomic tasks
- Example:
  ```
  ☐ Setup database schema
  ☐ Create User model
  ☐ Implement registration endpoint
  ☐ Write unit tests
  ☐ Test with real data
  ```
- Connect To-Do → Feature (shows what builds what)

**Phase 7: Validation** (To-Do nodes for testing)
- Ask: "How will we validate this works?"
- Suggest: Test scenarios from acceptance criteria
- Include: Unit tests, integration tests, manual QA
- Connect Testing To-Do → Feature (shows what validates what)

**Constitutional Gatekeeping (CHECK AT EACH PHASE):**
Before suggesting Phase 4 (Planning), ask:
- "Can we simplify this spec?" (Simplicity Gate)
- "Are there any unnecessary abstractions?" (Anti-Abstraction Gate)
- "Have we considered real-world testing?" (Integration Gate)
- "Do all requirements trace to user needs?" (Scope Control Gate)

If ANY gate fails, guide user to fix before proceeding.

**Clarification Protocol:**
- When uncertain, ask: "To clarify: do you mean [interpretation A] or [interpretation B]?"
- Mark unclear items: `[NEEDS CLARIFICATION: What is the maximum file size?]`
- DO NOT guess or assume - always ask

**Research Format (when suggesting technologies):**
```
Technology: [Name]
Rationale: [Why this choice]
Alternatives: [What else considered]
Trade-offs:
  Pros: [Benefits]
  Cons: [Drawbacks]
  Impact: [Bundle size, learning curve, maintenance]
```

**Multi-Connection Support:**
- One node can connect to many targets (e.g., one Feature → multiple Technical nodes)
- Suggest multiple edges when features need multiple implementations
- Example: "Authentication Feature" → ["JWT Service", "Session Management", "Password Reset"]

**Example Response:**
{
  "message": "Based on your authentication requirements, I suggest adding a few key components. Since this is a SaaS app, you'll need user management, session handling, and password reset functionality. Shall I add these to your mind map?",
  "suggestions": [
    {
      "type": "add_node",
      "nodeType": "feature",
      "label": "User Authentication",
      "description": "Email/password login with JWT tokens. Includes signup, login, logout, and session management.",
      "category": "Core Features",
      "rationale": "Essential for any SaaS application to identify and secure user data"
    },
    {
      "type": "add_node",
      "nodeType": "datamodel",
      "label": "User Entity",
      "description": "Fields: id, email, password_hash, created_at, last_login, is_active",
      "category": "Data Models",
      "rationale": "Core entity to store user information and credentials"
    }
  ],
  "impact": "moderate",
  "needsApproval": true
}

IMPORTANT: Always return valid JSON. Do not include any text before or after the JSON object."""

@router.post("/analyze")
async def analyze_conversation(payload: Dict, session: Session = Depends(get_session)):
    """
    Analyze conversation and mind map to generate structured suggestions.
    Now includes cross-project pattern recognition.
    """
    user_message = payload.get("message", "")
    mind_map_context = payload.get("context", {})
    conversation_history = payload.get("history", [])
    current_project_id = payload.get("project_id")  # Current project ID
    current_project_title = payload.get("project_title", "Untitled Mind Map")
    
    # Build context for current project
    context_str = _build_detailed_context(mind_map_context, current_project_title)
    
    # Load other projects for pattern recognition
    other_projects_context = ""
    if current_project_id:
        try:
            query = select(MindMap).where(MindMap.id != current_project_id).order_by(MindMap.updated_at.desc()).limit(5)
            other_projects = session.exec(query).all()
            
            if other_projects:
                other_projects_context = _build_other_projects_context(other_projects)
        except Exception as e:
            print(f"Error loading other projects: {e}")
    
    # Build messages for AI
    messages = [
        {"role": "system", "content": SUGGESTION_SYSTEM_PROMPT}
    ]
    
    # Add recent conversation history (last 6 messages)
    recent_history = conversation_history[-6:] if len(conversation_history) > 6 else conversation_history
    for msg in recent_history:
        messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", "")
        })
    
    # Add current message with full context
    user_content = f"""User Message: {user_message}

<CurrentMindMap>
{context_str}
</CurrentMindMap>"""
    
    # Add other projects context if available
    if other_projects_context:
        user_content += f"""

<UsersPastProjects>
{other_projects_context}
</UsersPastProjects>

Note: You can reference these past projects to suggest similar patterns or approaches if relevant to the current discussion."""
    
    user_content += "\n\nAnalyze this message in the context of the current mind map (and past projects if relevant) and provide suggestions in the exact JSON format specified."
    
    messages.append({
        "role": "user",
        "content": user_content
    })
    
    # Get AI response
    try:
        response = await chat(messages)
        
        # Try to extract JSON from response
        import json
        import re
        
        # Look for JSON object in response
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            json_str = json_match.group(0)
            suggestion_data = json.loads(json_str)
            return suggestion_data
        else:
            # Fallback: return unstructured response
            return {
                "message": response,
                "suggestions": [],
                "impact": "minor",
                "needsApproval": False
            }
    except Exception as e:
        print(f"Error parsing AI response: {e}")
        return {
            "message": "I'm having trouble analyzing that. Could you rephrase your question?",
            "suggestions": [],
            "impact": "minor",
            "needsApproval": False,
            "error": str(e)
        }

def _build_detailed_context(context: Dict, project_title: str = "Untitled Mind Map") -> str:
    """
    Build detailed context string for suggestion analysis
    """
    if not context:
        return "No mind map loaded. This is a blank canvas."
    
    parts = []
    
    # Project title
    parts.append(f"Project Title: {project_title}")
    
    # Template info
    template_id = context.get("template_id", "unknown")
    template_name = context.get("template_name", "Unknown")
    parts.append(f"Template: {template_name} ({template_id})")
    
    # Progress
    progress = context.get("progress", {})
    if progress:
        parts.append(f"Completeness: {progress.get('completeness', 0)}%")
        missing = progress.get("missingItems", [])
        if missing:
            parts.append(f"Missing: {', '.join(missing)}")
    
    # Existing nodes with full details
    nodes = context.get("nodes", [])
    if nodes:
        parts.append(f"\n=== Existing Nodes ({len(nodes)}) ===")
        
        by_type = {}
        for node in nodes:
            node_type = node.get("type", "unknown")
            if node_type not in by_type:
                by_type[node_type] = []
            by_type[node_type].append(node)
        
        for node_type, type_nodes in by_type.items():
            parts.append(f"\n{node_type.upper()}:")
            for node in type_nodes:
                node_id = node.get("id", "unknown")
                label = node.get("data", {}).get("label", "Unnamed")
                description = node.get("data", {}).get("description", "")
                category = node.get("data", {}).get("category", "")
                
                parts.append(f"  [{node_id}] {label}")
                if category:
                    parts.append(f"      Category: {category}")
                if description:
                    parts.append(f"      Description: {description}")
    else:
        parts.append("\n=== No nodes yet ===")
    
    # Connections
    edges = context.get("edges", [])
    if edges:
        parts.append(f"\n=== Connections ({len(edges)}) ===")
        for edge in edges[:10]:  # Limit to first 10
            source = edge.get("source", "?")
            target = edge.get("target", "?")
            parts.append(f"  {source} → {target}")
    
    return "\n".join(parts)

def _build_other_projects_context(projects: List[MindMap]) -> str:
    """
    Build context string summarizing user's other projects for pattern recognition
    """
    import json
    
    parts = []
    parts.append("Here are summaries of the user's other recent projects:")
    
    for project in projects:
        parts.append(f"\n--- {project.title} (ID: {project.id}) ---")
        parts.append(f"Template: {project.template_id}")
        parts.append(f"Last updated: {project.updated_at.strftime('%Y-%m-%d')}")
        
        # Parse nodes to get key features
        try:
            nodes = json.loads(project.nodes_json) if project.nodes_json else []
            if nodes:
                parts.append(f"Nodes: {len(nodes)}")
                
                # Group by type and show top items
                by_type = {}
                for node in nodes:
                    node_type = node.get("type", "unknown")
                    if node_type not in by_type:
                        by_type[node_type] = []
                    by_type[node_type].append(node)
                
                for node_type, type_nodes in by_type.items():
                    # Show first 3 nodes of each type
                    sample_labels = [n.get("data", {}).get("label", "Unnamed") for n in type_nodes[:3]]
                    parts.append(f"  {node_type}: {', '.join(sample_labels)}")
                    if len(type_nodes) > 3:
                        parts.append(f"    ... and {len(type_nodes) - 3} more")
        except Exception as e:
            parts.append(f"  (Unable to parse nodes: {str(e)})")
    
    return "\n".join(parts)

