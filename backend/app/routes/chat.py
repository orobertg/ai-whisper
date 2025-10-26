from fastapi import APIRouter
from typing import Dict, List
from ..ai import chat

router = APIRouter(prefix="/chat", tags=["chat"])

SYSTEM_PROMPT = """You are an AI assistant helping solo developers create complete specification documents for their projects.

Your role:
- Help users understand and improve their mind map specifications
- Suggest missing components based on the project template
- **Recommend logical connections between nodes** to show dependencies and relationships
- Answer questions about best practices for their stack
- Guide them toward a complete, buildable MVP specification

When analyzing their mind map:
- Look at node types: feature (what to build), technical (how to build), datamodel (data structure), userstory (who/why)
- Check for completeness based on template requirements
- Suggest specific nodes they should add
- **Identify missing connections** between related nodes (e.g., "Authentication should connect to Dashboard", "API connects to Database")
- Recommend connection types: "requires", "uses", "links to", "reads/writes", "protected by", "documented in"
- Help fill in missing details

The mind map flows **left to right**, with earlier components on the left connecting to dependent components on the right.

Be concise, actionable, and encouraging. Focus on helping them build a successful MVP."""

@router.post("/")
async def chat_with_ai(payload: Dict):
    """
    Chat endpoint that receives user message and mind map context
    """
    user_message = payload.get("message", "")
    mind_map_context = payload.get("context", {})
    conversation_history = payload.get("history", [])
    
    # Build context string from mind map
    context_str = _build_context_string(mind_map_context)
    
    # Build messages for AI
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    
    # Add conversation history
    for msg in conversation_history:
        messages.append({
            "role": msg.get("role", "user"),
            "content": msg.get("content", "")
        })
    
    # Add current message with context
    user_content = f"{user_message}\n\n<MindMapContext>\n{context_str}\n</MindMapContext>"
    messages.append({
        "role": "user",
        "content": user_content
    })
    
    # Get AI response
    response = await chat(messages)
    
    return {
        "message": response,
        "context_used": bool(context_str)
    }

def _build_context_string(context: Dict) -> str:
    """
    Convert mind map context into readable string for AI
    """
    if not context:
        return "No mind map loaded yet."
    
    parts = []
    
    # Project info
    template_id = context.get("template_id", "unknown")
    template_name = context.get("template_name", "Unknown Template")
    parts.append(f"Project Template: {template_name} ({template_id})")
    
    # Progress metrics
    progress = context.get("progress", {})
    if progress:
        completeness = progress.get("completeness", 0)
        success_prob = progress.get("successProbability", 0)
        parts.append(f"Specification Completeness: {completeness}%")
        parts.append(f"Success Probability: {success_prob}%")
        
        missing = progress.get("missingItems", [])
        if missing:
            parts.append(f"Missing Requirements: {', '.join(missing)}")
    
    # Nodes
    nodes = context.get("nodes", [])
    if nodes:
        parts.append(f"\nTotal Nodes: {len(nodes)}")
        
        # Group by type
        by_type = {}
        for node in nodes:
            node_type = node.get("type", "unknown")
            if node_type not in by_type:
                by_type[node_type] = []
            by_type[node_type].append(node)
        
        for node_type, type_nodes in by_type.items():
            parts.append(f"\n{node_type.upper()} Nodes ({len(type_nodes)}):")
            for node in type_nodes:
                label = node.get("data", {}).get("label", "Unnamed")
                description = node.get("data", {}).get("description", "")
                parts.append(f"  - {label}")
                if description:
                    parts.append(f"    Description: {description[:100]}")
    
    # Edges/connections
    edges = context.get("edges", [])
    if edges:
        parts.append(f"\nConnections ({len(edges)} relationships):")
        for edge in edges:
            source = edge.get("source", "unknown")
            target = edge.get("target", "unknown")
            label = edge.get("label", "")
            
            # Find node labels for better readability
            source_node = next((n for n in nodes if n.get("id") == source), None)
            target_node = next((n for n in nodes if n.get("id") == target), None)
            
            source_label = source_node.get("data", {}).get("label", source) if source_node else source
            target_label = target_node.get("data", {}).get("label", target) if target_node else target
            
            connection_str = f"  - {source_label} → {target_label}"
            if label:
                connection_str += f" ({label})"
            parts.append(connection_str)
    else:
        parts.append("\n⚠️ No connections defined yet. Nodes should be connected to show dependencies and relationships.")
    
    return "\n".join(parts)

