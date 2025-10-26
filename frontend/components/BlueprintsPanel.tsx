"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Blueprint = {
  id: number;
  title: string;
  spec_text: string;
  rationale_md: string;
  created_at: string;
  updated_at: string;
};

type BlueprintsPanelProps = {
  mindmapId?: number;
};

export default function BlueprintsPanel({ mindmapId }: BlueprintsPanelProps) {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSpec, setEditSpec] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBlueprints();
  }, []);

  async function loadBlueprints() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/blueprints/`);
      if (!response.ok) throw new Error("Failed to load blueprints");
      const data = await response.json();
      setBlueprints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blueprints");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(blueprintId: number) {
    if (!confirm("Are you sure you want to delete this blueprint?")) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/blueprints/${blueprintId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete blueprint");
      await loadBlueprints();
      if (selectedBlueprint?.id === blueprintId) {
        setSelectedBlueprint(null);
        setIsViewing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blueprint");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!selectedBlueprint || !editTitle.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/blueprints/${selectedBlueprint.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          spec_text: editSpec,
        }),
      });
      if (!response.ok) throw new Error("Failed to update blueprint");
      
      const updated = await response.json();
      setSelectedBlueprint(updated);
      setIsEditing(false);
      await loadBlueprints();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update blueprint");
    } finally {
      setLoading(false);
    }
  }

  function handleView(blueprint: Blueprint) {
    setSelectedBlueprint(blueprint);
    setIsViewing(true);
    setIsEditing(false);
    setError(null);
  }

  function handleEdit(blueprint: Blueprint) {
    setSelectedBlueprint(blueprint);
    setEditTitle(blueprint.title);
    setEditSpec(blueprint.spec_text);
    setIsEditing(true);
    setIsViewing(false);
    setError(null);
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }

  function handleDownload(blueprint: Blueprint) {
    const blob = new Blob([blueprint.spec_text], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${blueprint.title.replace(/\s+/g, "_")}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClose() {
    setIsViewing(false);
    setIsEditing(false);
    setSelectedBlueprint(null);
    setError(null);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // List view
  if (!isViewing && !isEditing) {
    return (
      <div className="card space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Blueprints</div>
          <button
            onClick={loadBlueprints}
            className="text-xs text-gray-400 hover:text-gray-300"
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && blueprints.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-4">
            Loading blueprints...
          </div>
        )}

        {/* Blueprints List */}
        {!loading && blueprints.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            No blueprints yet. Use AI Assistant to generate one.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {blueprints.map((bp) => (
              <div
                key={bp.id}
                className="border border-zinc-800 rounded-lg p-3 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div 
                    className="font-medium text-sm cursor-pointer hover:text-blue-400"
                    onClick={() => handleView(bp)}
                  >
                    {bp.title}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(bp)}
                      className="text-xs text-blue-500 hover:text-blue-400 px-2 py-1"
                      disabled={loading}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDownload(bp)}
                      className="text-xs text-green-500 hover:text-green-400 px-2 py-1"
                      disabled={loading}
                      title="Download"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => handleDelete(bp.id)}
                      className="text-xs text-red-500 hover:text-red-400 px-2 py-1"
                      disabled={loading}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {formatDate(bp.updated_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // View mode
  if (isViewing && selectedBlueprint) {
    return (
      <div className="card space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Blueprint Details</div>
          <button
            onClick={handleClose}
            className="text-xs text-gray-400 hover:text-gray-300"
          >
            ✕ Close
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold mb-1">{selectedBlueprint.title}</h3>
          <div className="text-xs text-gray-500">
            Updated {formatDate(selectedBlueprint.updated_at)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(selectedBlueprint)}
            className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => handleCopy(selectedBlueprint.spec_text)}
            className="flex-1 px-3 py-2 text-sm border border-zinc-800 hover:border-zinc-700 rounded-lg"
          >
            Copy
          </button>
          <button
            onClick={() => handleDownload(selectedBlueprint)}
            className="flex-1 px-3 py-2 text-sm border border-zinc-800 hover:border-zinc-700 rounded-lg"
          >
            Download
          </button>
        </div>

        {/* Spec Content */}
        <div className="border border-zinc-800 rounded-lg p-3 max-h-96 overflow-y-auto">
          <pre className="text-xs whitespace-pre-wrap font-mono">
            {selectedBlueprint.spec_text}
          </pre>
        </div>
      </div>
    );
  }

  // Edit mode
  if (isEditing && selectedBlueprint) {
    return (
      <div className="card space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Edit Blueprint</div>
          <button
            onClick={handleClose}
            className="text-xs text-gray-400 hover:text-gray-300"
          >
            ✕ Close
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Title Input */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Title</label>
          <input
            className="w-full bg-transparent border border-zinc-800 rounded-lg px-3 py-2 text-sm"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Spec Content */}
        <div>
          <label className="text-xs text-gray-400 block mb-1">Specification (YAML)</label>
          <textarea
            className="w-full h-64 bg-transparent border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono resize-none"
            value={editSpec}
            onChange={(e) => setEditSpec(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            onClick={handleUpdate}
            disabled={loading || !editTitle.trim()}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="px-3 py-2 text-sm border border-zinc-800 hover:border-zinc-700 rounded-lg"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return null;
}

