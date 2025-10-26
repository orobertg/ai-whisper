"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AIPanel({ context }: { context: string }) {
  const [title, setTitle] = useState("My Feature");
  const [out, setOut] = useState("");

  async function gen() {
    const r = await fetch(`${API}/blueprints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, context_md: context })
    });
    const j = await r.json();
    setOut(j.spec_text || JSON.stringify(j, null, 2));
  }

  return (
    <div className="card space-y-3">
      <div className="text-sm font-semibold">AI Assistant</div>
      <input className="w-full bg-transparent border border-zinc-800 rounded-xl px-3 py-2"
             value={title} onChange={e=>setTitle(e.target.value)} />
      <button className="btn" onClick={gen}>Generate Blueprint</button>
      <pre className="text-xs whitespace-pre-wrap">{out}</pre>
    </div>
  );
}
