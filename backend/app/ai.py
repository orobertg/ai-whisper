import os, httpx

AI_PROVIDER = os.getenv("AI_PROVIDER", "openai")
OLLAMA_BASE = os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

SYSTEM_SPEC = (
    "You are a pragmatic software architect. "
    "Produce a concise, buildable blueprint for the requested feature. "
    "Sections: "
    "1) Overview "
    "2) Data model (entities/fields) "
    "3) API endpoints "
    "4) UI Components "
    "5) Milestones (MVP -> 1.0) "
    "Use markdown headings. Keep it specific and actionable."
)

async def _chat_ollama(messages):
    # Use llama3.2 or fallback to another available model
    model = os.getenv("OLLAMA_MODEL", "llama3.2:latest")
    async with httpx.AsyncClient(timeout=120) as c:
        r = await c.post(
            f"{OLLAMA_BASE}/api/chat", 
            json={"model": model, "messages": messages, "stream": False}
        )
        r.raise_for_status()
        data = r.json()
        # Handle Ollama's response format
        if "message" in data and "content" in data["message"]:
            return data["message"]["content"]
        return data.get("content") or str(data)

async def _chat_openai(messages, model="gpt-4o-mini"):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    body = {"model": model, "messages": messages}
    async with httpx.AsyncClient(timeout=120) as c:
        r = await c.post("https://api.openai.com/v1/chat/completions", headers=headers, json=body)
        r.raise_for_status()
        data = r.json()
        return data["choices"][0]["message"]["content"]

async def chat(messages):
    if AI_PROVIDER.lower() == "ollama":
        return await _chat_ollama(messages)
    return await _chat_openai(messages)

async def generate_blueprint(title: str, context_md: str) -> str:
    messages = [
        {"role":"system","content":SYSTEM_SPEC},
        {"role":"user","content":f"# Title: {title}\n\n## Context\n{context_md}"}
    ]
    return await chat(messages)
