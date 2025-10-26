"use client";
import { useState } from "react";
import { ProgressMetrics, getProgressColor, getProgressBarColor } from "@/lib/progress";
import { Node, Edge } from "reactflow";
import { Template } from "@/lib/templates";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type ProgressIndicatorsProps = {
  metrics: ProgressMetrics;
  nodes: Node[];
  edges: Edge[];
  template: Template | null;
};

export default function ProgressIndicators({ metrics, nodes, edges, template }: ProgressIndicatorsProps) {
  const [showTooltip, setShowTooltip] = useState<'completeness' | 'probability' | 'ai' | null>(null);
  const [aiEvaluation, setAiEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleAIEvaluation = async () => {
    if (isEvaluating) return;
    
    setIsEvaluating(true);
    try {
      const context = {
        template_id: template?.id || "blank",
        template_name: template?.name || "Blank Canvas",
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          data: node.data,
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          label: edge.label,
        })),
        progress: metrics,
      };
      
      const response = await fetch(`${API}/evaluate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });
      
      if (!response.ok) throw new Error("Failed to evaluate");
      
      const data = await response.json();
      setAiEvaluation(data.evaluation);
      setShowTooltip('ai');
    } catch (error) {
      console.error("Evaluation error:", error);
      setAiEvaluation("Failed to get AI evaluation. Please try again.");
      setShowTooltip('ai');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      {/* Spec Completeness */}
      <div 
        className="relative flex items-center gap-2 cursor-help"
        onMouseEnter={() => setShowTooltip('completeness')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <div className="text-sm text-gray-400">Completeness:</div>
        <div className="flex items-center gap-2">
          {/* Progress Bar */}
          <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressBarColor(metrics.completeness)}`}
              style={{ width: `${metrics.completeness}%` }}
            />
          </div>
          {/* Percentage */}
          <div className={`text-sm font-semibold min-w-[3rem] ${getProgressColor(metrics.completeness)}`}>
            {metrics.completeness}%
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip === 'completeness' && (
          <div className="absolute top-full mt-2 left-0 z-50 w-64 bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-xl">
            <div className="text-xs font-semibold mb-2">Specification Completeness</div>
            <div className="text-xs text-gray-400 mb-2">
              Based on required node types for this template
            </div>
            {metrics.missingItems.length > 0 ? (
              <div>
                <div className="text-xs font-medium text-yellow-500 mb-1">Missing:</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  {metrics.missingItems.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-xs text-green-500">✓ All requirements met!</div>
            )}
          </div>
        )}
      </div>

      {/* Success Probability */}
      <div 
        className="relative flex items-center gap-2 cursor-help"
        onMouseEnter={() => setShowTooltip('probability')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <div className="text-sm text-gray-400">Success:</div>
        <div className="flex items-center gap-2">
          {/* Circular Progress */}
          <svg className="w-10 h-10 transform -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-zinc-800"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - metrics.successProbability / 100)}`}
              className={`transition-all duration-500 ${getProgressBarColor(metrics.successProbability).replace('bg-', 'text-')}`}
              strokeLinecap="round"
            />
          </svg>
          {/* Percentage */}
          <div className={`text-sm font-semibold min-w-[3rem] ${getProgressColor(metrics.successProbability)}`}>
            {metrics.successProbability}%
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip === 'probability' && (
          <div className="absolute top-full mt-2 right-0 z-50 w-72 bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-xl">
            <div className="text-xs font-semibold mb-2">Success Probability</div>
            <div className="text-xs text-gray-400 mb-3">
              AI-estimated likelihood of successfully building this MVP based on:
            </div>
            <ul className="text-xs text-gray-400 space-y-1.5">
              <li>• <span className="text-white">Completeness</span> - Meeting template requirements (60%)</li>
              <li>• <span className="text-white">Diversity</span> - Variety of node types (20%)</li>
              <li>• <span className="text-white">Connections</span> - Logical relationships (10%)</li>
              <li>• <span className="text-white">Detail</span> - Node descriptions depth (10%)</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-zinc-800 text-xs">
              {metrics.successProbability >= 80 && (
                <span className="text-green-500">🎯 Excellent! Ready to build.</span>
              )}
              {metrics.successProbability >= 60 && metrics.successProbability < 80 && (
                <span className="text-blue-500">👍 Good foundation, add more details.</span>
              )}
              {metrics.successProbability >= 40 && metrics.successProbability < 60 && (
                <span className="text-yellow-500">⚠️ Needs more work. Fill missing requirements.</span>
              )}
              {metrics.successProbability < 40 && (
                <span className="text-red-500">❌ Incomplete. Add required nodes first.</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Node Count Summary */}
      <div className="text-xs text-gray-500">
        {Object.keys(metrics.nodeTypeCounts).length} types • {' '}
        {Object.values(metrics.nodeTypeCounts).reduce((a, b) => a + b, 0)} nodes
      </div>

      {/* AI Evaluation Button */}
      <div className="relative">
        <button
          onClick={handleAIEvaluation}
          disabled={isEvaluating}
          className="px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg flex items-center gap-2 transition-colors"
        >
          🤖 {isEvaluating ? "Evaluating..." : "Ask AI"}
        </button>

        {/* AI Evaluation Popup */}
        {showTooltip === 'ai' && aiEvaluation && (
          <div className="absolute top-full mt-2 right-0 z-50 w-96 max-h-96 overflow-y-auto bg-zinc-900 border border-purple-600 rounded-lg p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-purple-400">🤖 AI Evaluation</div>
              <button
                onClick={() => setShowTooltip(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-gray-300 whitespace-pre-wrap">
              {aiEvaluation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

