"use client";
import { useState } from 'react';
import { templates, blankTemplate, Template } from '@/lib/templates';

type TemplateSelectorProps = {
  onSelectTemplate: (template: Template) => void;
};

export default function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (template: Template) => {
    setSelectedId(template.id);
    onSelectTemplate(template);
  };

  const allTemplates = [...templates, blankTemplate];

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-2xl">
            🎯
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-gray-400">Build your next great idea</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-center">Choose Template</h2>
        <p className="text-gray-400 text-center mb-6">
          Select your preferred development platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template)}
            className={`
              relative p-6 rounded-2xl border-2 transition-all text-left
              ${
                selectedId === template.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
              }
            `}
          >
            {selectedId === template.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                {template.icon || '📦'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{template.name}</h3>
                <p className="text-xs text-gray-400">{template.category}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              {template.description}
            </p>

            {template.nodes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-zinc-800">
                <p className="text-xs text-gray-500">
                  {template.nodes.length} nodes • {template.edges.length} connections
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedId && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setSelectedId(null)}
            className="px-6 py-3 rounded-xl border-2 border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={() => {
              const template = allTemplates.find((t) => t.id === selectedId);
              if (template) handleSelect(template);
            }}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
          >
            <span>✨</span>
            Generate with AI
          </button>
        </div>
      )}
    </div>
  );
}

