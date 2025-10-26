"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Note = {
  id: number;
  mindmap_id: number | null;
  title: string;
  content_md: string;
  tags: string;
  created_at: string;
  updated_at: string;
};

type NotesEditorProps = {
  mindmapId?: number;
};

export default function NotesEditor({ mindmapId }: NotesEditorProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mindmapId) {
      loadNotes();
    }
  }, [mindmapId]);

  async function loadNotes() {
    if (!mindmapId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/notes?mindmap_id=${mindmapId}`);
      if (!response.ok) throw new Error("Failed to load notes");
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        // Update existing note
        const response = await fetch(`${API}/notes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content_md: content }),
        });
        if (!response.ok) throw new Error("Failed to update note");
      } else {
        // Create new note
        const response = await fetch(`${API}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mindmap_id: mindmapId,
            title,
            content_md: content,
          }),
        });
        if (!response.ok) throw new Error("Failed to create note");
      }

      // Reset form
      setTitle("");
      setContent("");
      setIsCreating(false);
      setEditingId(null);

      // Reload notes
      await loadNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(noteId: number) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note");
      await loadNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content_md);
    setIsCreating(true);
  }

  function handleCancel() {
    setTitle("");
    setContent("");
    setIsCreating(false);
    setEditingId(null);
    setError(null);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!mindmapId) {
    return (
      <div className="card">
        <div className="text-sm text-gray-500">
          Select or create a mind map to add notes
        </div>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Notes</div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-lg"
            disabled={loading}
          >
            + New Note
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="space-y-3 border border-zinc-800 rounded-lg p-3">
          <div className="text-sm font-medium">
            {editingId ? "Edit Note" : "New Note"}
          </div>
          <input
            className="w-full bg-transparent border border-zinc-800 rounded-lg px-3 py-2 text-sm"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
          <textarea
            className="w-full h-32 bg-transparent border border-zinc-800 rounded-lg px-3 py-2 text-sm resize-none"
            placeholder="Write your notes here... (Markdown supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <div className="flex gap-2">
            <button
              className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              onClick={handleSave}
              disabled={loading || !title.trim()}
            >
              {loading ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
            <button
              className="px-3 py-2 text-sm border border-zinc-800 hover:border-zinc-700 rounded-lg"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !isCreating && (
        <div className="text-center text-sm text-gray-500 py-4">
          Loading notes...
        </div>
      )}

      {/* Notes List */}
      {!loading && notes.length === 0 && !isCreating && (
        <div className="text-center text-sm text-gray-500 py-8">
          No notes yet. Click "New Note" to get started.
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border border-zinc-800 rounded-lg p-3 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-medium text-sm">{note.title}</div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-xs text-blue-500 hover:text-blue-400 px-2 py-1"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-xs text-red-500 hover:text-red-400 px-2 py-1"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {note.content_md && (
                <div className="text-sm text-gray-400 whitespace-pre-wrap mb-2">
                  {note.content_md}
                </div>
              )}
              <div className="text-xs text-gray-600">
                {formatDate(note.updated_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
