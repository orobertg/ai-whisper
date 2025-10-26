"use client";
import { useState } from "react";
import { CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/react";

type Node = {
  id: string;
  type?: string;
  data?: {
    label?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

type Suggestion = {
  type: "add_node" | "update_node" | "add_edge" | "rename_project";
  nodeType?: string;
  label?: string;
  description?: string;
  category?: string;
  nodeId?: string;
  updates?: Record<string, any>;
  source?: string;
  target?: string;
  newTitle?: string;
  rationale: string;
};

type SuggestionCardProps = {
  suggestions: Suggestion[];
  impact: "minor" | "moderate" | "major";
  onApprove: (suggestions: Suggestion[]) => void;
  onReject: () => void;
  autoApply?: boolean;
  nodes?: Node[];  // Pass nodes to look up labels
};

export default function SuggestionCard({
  suggestions,
  impact,
  onApprove,
  onReject,
  autoApply = false,
  nodes = []
}: SuggestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(
    new Set(suggestions.map((_, idx) => idx)) // All selected by default
  );

  if (suggestions.length === 0) return null;

  const toggleSuggestion = (idx: number) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedSuggestions(newSelected);
  };

  const toggleAll = () => {
    if (selectedSuggestions.size === suggestions.length) {
      setSelectedSuggestions(new Set());
    } else {
      setSelectedSuggestions(new Set(suggestions.map((_, idx) => idx)));
    }
  };

  const getSelectedSuggestions = () => {
    return suggestions.filter((_, idx) => selectedSuggestions.has(idx));
  };

  const impactLabels = {
    minor: "Minor Change",
    moderate: "Moderate Changes",
    major: "Major Changes"
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "add_node": return "+";
      case "update_node": return "•";
      case "add_edge": return "→";
      case "rename_project": return "✎";
      default: return "•";
    }
  };

  const getNodeLabel = (nodeId: string): string => {
    const node = nodes.find(n => n.id === nodeId);
    console.log(`[SuggestionCard] Looking up node "${nodeId}":`, node?.data?.label || '(not found)');
    return node?.data?.label || nodeId;
  };

  const formatSuggestion = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case "add_node":
        return `Add ${suggestion.nodeType} node: "${suggestion.label}"`;
      case "update_node":
        return `Update node: ${suggestion.updates?.label || "modifications"}`;
      case "add_edge":
        const sourceLabel = suggestion.source ? getNodeLabel(suggestion.source) : "?";
        const targetLabel = suggestion.target ? getNodeLabel(suggestion.target) : "?";
        return `Connect nodes: ${sourceLabel} → ${targetLabel}`;
      case "rename_project":
        return `Rename project to: "${suggestion.newTitle}"`;
      default:
        return "Unknown suggestion";
    }
  };

  if (autoApply) {
    return (
      <div className="rounded-xl border border-zinc-300 bg-zinc-50 p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-zinc-600 mt-0.5 flex-shrink-0">⚡</div>
          <div className="flex-1 text-sm text-zinc-900">
            <div className="font-medium mb-1">Applying suggestions...</div>
            <div className="text-xs text-zinc-600">
              {suggestions.length} {suggestions.length === 1 ? 'change' : 'changes'} being applied to your mind map
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-300 bg-zinc-50 p-5 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm text-zinc-900">{impactLabels[impact]}</div>
            <div className="text-xs text-zinc-600 mt-0.5">
              {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-zinc-600 hover:text-zinc-900 px-2 py-1"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Select All / Deselect All */}
          {suggestions.length > 1 && (
            <div className="mb-3 flex items-center gap-2">
              <button
                onClick={toggleAll}
                className="text-xs text-zinc-600 hover:text-zinc-900 underline"
              >
                {selectedSuggestions.size === suggestions.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-xs text-zinc-500">
                ({selectedSuggestions.size} of {suggestions.length} selected)
              </span>
            </div>
          )}

          <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-visible">
            {suggestions.map((suggestion, idx) => (
              <div 
                key={idx} 
                className={`bg-white border rounded-lg p-4 transition-all ${
                  selectedSuggestions.has(idx) 
                    ? 'border-zinc-300' 
                    : 'border-zinc-200 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedSuggestions.has(idx)}
                    onChange={() => toggleSuggestion(idx)}
                    className="mt-0.5 w-4 h-4 accent-zinc-700 border-zinc-300 rounded focus:ring-zinc-500 focus:ring-1 cursor-pointer"
                  />
                  <span className="text-zinc-700 text-sm font-medium mt-0.5">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-zinc-900">{formatSuggestion(suggestion)}</div>
                    {suggestion.description && (
                      <div className="text-xs text-zinc-600 mt-2">{suggestion.description}</div>
                    )}
                    <div className="text-xs text-zinc-500 mt-2 flex items-start gap-1">
                      <span>→</span>
                      <span className="italic">{suggestion.rationale}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onApprove(getSelectedSuggestions())}
              disabled={selectedSuggestions.size === 0}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedSuggestions.size === 0
                  ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white'
              }`}
            >
              <CheckmarkCircle02Icon size={16} strokeWidth={2} />
              Apply {selectedSuggestions.size > 0 && selectedSuggestions.size !== suggestions.length 
                ? `${selectedSuggestions.size} ` 
                : ''}Change{selectedSuggestions.size !== 1 ? 's' : ''}
            </button>
            <button
              onClick={onReject}
              className="px-4 py-2.5 border border-zinc-300 hover:bg-zinc-100 rounded-lg text-sm transition-colors text-zinc-700"
            >
              <Cancel01Icon size={16} strokeWidth={2} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

