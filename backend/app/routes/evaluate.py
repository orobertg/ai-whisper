from fastapi import APIRouter
from typing import Dict
from ..ai import chat

router = APIRouter(prefix="/evaluate", tags=["evaluate"])

EVALUATION_PROMPT = """You are an expert software architect evaluating a project specification.

Analyze the provided mind map and provide:
1. **Completeness Score (0-100)**: How complete is this specification?
2. **Success Probability (0-100)**: Likelihood of successfully building this MVP
3. **Key Missing Elements**: What critical components are missing?
4. **Quality Assessment**: Are existing nodes well-defined with sufficient detail?
5. **Recommendations**: Top 3 specific actions to improve the spec

Be honest and constructive. Focus on what would actually help them build a successful MVP."""

@router.post("/")
async def evaluate_mindmap(payload: Dict):
    """
    AI-powered evaluation of mind map specification quality
    """
    context = payload.get("context", {})
    
    # Build detailed context for AI
    context_str = _build_evaluation_context(context)
    
    messages = [
        {"role": "system", "content": EVALUATION_PROMPT},
        {"role": "user", "content": f"Evaluate this project specification:\n\n{context_str}"}
    ]
    
    response = await chat(messages)
    
    # Parse AI response for scores (basic parsing)
    try:
        completeness_score = _extract_score(response, "Completeness Score")
        success_score = _extract_score(response, "Success Probability")
    except:
        completeness_score = None
        success_score = None
    
    return {
        "evaluation": response,
        "ai_completeness": completeness_score,
        "ai_success": success_score
    }

def _build_evaluation_context(context: Dict) -> str:
    """Build detailed context for AI evaluation"""
    parts = []
    
    template_name = context.get("template_name", "Unknown")
    parts.append(f"Project Type: {template_name}")
    
    nodes = context.get("nodes", [])
    parts.append(f"Total Nodes: {len(nodes)}")
    
    if nodes:
        # Group and analyze nodes
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
                technology = node.get("data", {}).get("technology", "")
                fields = node.get("data", {}).get("fields", [])
                
                parts.append(f"\n  • {label}")
                if description:
                    parts.append(f"    Description: {description}")
                if technology:
                    parts.append(f"    Technology: {technology}")
                if fields and len(fields) > 0:
                    parts.append(f"    Fields: {', '.join(fields)}")
                
                # Flag incomplete nodes
                if not description or len(description.strip()) < 20:
                    parts.append(f"    ⚠️ Needs more detail")
    
    edges = context.get("edges", [])
    parts.append(f"\nConnections: {len(edges)} relationships")
    
    progress = context.get("progress", {})
    if progress:
        parts.append(f"\nCurrent Metrics:")
        parts.append(f"  Rule-based Completeness: {progress.get('completeness', 0)}%")
        parts.append(f"  Rule-based Success: {progress.get('successProbability', 0)}%")
        
        missing = progress.get("missingItems", [])
        if missing:
            parts.append(f"  Missing: {', '.join(missing)}")
    
    return "\n".join(parts)

def _extract_score(text: str, score_name: str) -> int:
    """
    Try to extract a numeric score from AI response
    Looks for patterns like "Completeness Score: 65" or "65/100"
    """
    import re
    
    # Look for the score name followed by a number
    pattern = rf"{score_name}[:\s]*(\d+)"
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return int(match.group(1))
    
    return None

