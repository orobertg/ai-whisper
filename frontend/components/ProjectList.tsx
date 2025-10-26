"use client";
import { useState, useEffect } from "react";
import { Template, TEMPLATES } from "@/lib/templates";

type MindMap = {
  id: number;
  title: string;
  template_id: string;
  nodes_json: string;
  edges_json: string;
  created_at: string;
  updated_at: string;
};

type ProjectListProps = {
  onSelectProject: (mindmap: MindMap) => void;
  onNewProject: () => void;
};

export default function ProjectList({
  onSelectProject,
  onNewProject,
}: ProjectListProps) {
  const [mindmaps, setMindmaps] = useState<MindMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMindmaps();
  }, []);

  const loadMindmaps = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/mindmaps/");
      if (!response.ok) throw new Error("Failed to load projects");
      const data = await response.json();
      setMindmaps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`http://localhost:8000/mindmaps/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");
      setMindmaps(mindmaps.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const getTemplateInfo = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    return template || { icon: "📋", name: "Unknown Template" };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">⚠️ {error}</p>
          <button
            onClick={loadMindmaps}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Whisper</h1>
            <p className="text-gray-400">
              Mind mapping tool for specification documentation
            </p>
          </div>
          <button
            onClick={onNewProject}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span>
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        {mindmaps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-2">No projects yet</h2>
            <p className="text-gray-400 mb-6">
              Create your first mind map to get started
            </p>
            <button
              onClick={onNewProject}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mindmaps.map((mindmap) => {
              const template = getTemplateInfo(mindmap.template_id);
              const nodesCount = JSON.parse(mindmap.nodes_json).length;
              const edgesCount = JSON.parse(mindmap.edges_json).length;

              return (
                <div
                  key={mindmap.id}
                  onClick={() => onSelectProject(mindmap)}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 hover:bg-zinc-850 cursor-pointer transition-all"
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(mindmap.id, e)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-400"
                    title="Delete project"
                  >
                    🗑️
                  </button>

                  {/* Template Icon */}
                  <div className="text-4xl mb-3">{template.icon}</div>

                  {/* Project Title */}
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                    {mindmap.title}
                  </h3>

                  {/* Template Type */}
                  <p className="text-sm text-gray-500 mb-4">{template.name}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{nodesCount} nodes</span>
                    <span>•</span>
                    <span>{edgesCount} connections</span>
                  </div>

                  {/* Updated Date */}
                  <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-gray-500">
                    Updated {formatDate(mindmap.updated_at)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

