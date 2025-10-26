"use client";
import { Add01Icon } from "@hugeicons/react";
import { useState } from "react";
import { Node, useReactFlow } from "reactflow";

type MindMapToolbarProps = {
  onAddNode?: (node: Node) => void;
};

export default function MindMapToolbar({ onAddNode }: MindMapToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { getNodes, setNodes, fitView } = useReactFlow();

  const addNode = (type: string) => {
    const nodes = getNodes();
    
    // Calculate position based on node type columns (same as AI logic)
    const nodeTypeColumns = {
      'userstory': 100,
      'feature': 400,
      'technical': 700,
      'datamodel': 1000,
      'todo': 100,  // Bottom left for todos
      'notes': 1300  // Far right for notes
    };
    
    const baseX = nodeTypeColumns[type as keyof typeof nodeTypeColumns] || 400;
    const sameTypeNodes = nodes.filter(n => n.type === type);
    const baseY = type === 'todo' || type === 'notes' 
      ? 400 + (sameTypeNodes.length * 180)  // Lower position for todos/notes
      : 100 + (sameTypeNodes.length * 180);

    const newNode: Node = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: { x: baseX, y: baseY },
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: "",
        ...(type === 'todo' && { todos: [] }),  // Initialize empty todos array for todo nodes
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
    
    // Optionally notify parent
    if (onAddNode) {
      onAddNode(newNode);
    }

    // Fit view to show new node
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 100);
    
    setShowMenu(false);
  };

  const nodeTypes = [
    { type: 'userstory', label: 'User Story', icon: '◉', color: 'bg-yellow-500' },
    { type: 'feature', label: 'Feature', icon: '◆', color: 'bg-blue-500' },
    { type: 'technical', label: 'Technical', icon: '⚙', color: 'bg-green-500' },
    { type: 'datamodel', label: 'Data Model', icon: '▣', color: 'bg-purple-500' },
    { type: 'todo', label: 'To-Do List', icon: '✓', color: 'bg-orange-500' },
    { type: 'notes', label: 'Notes', icon: '📝', color: 'bg-gray-500' },
  ];

  return (
    <div className="absolute bottom-6 right-6 z-10">
      {showMenu && (
        <div className="mb-3 bg-white rounded-lg shadow-2xl border border-zinc-200 p-2 space-y-1 min-w-[180px]">
          <div className="text-xs font-semibold text-zinc-600 px-3 py-1">Add Node</div>
          {nodeTypes.map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => addNode(type)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-zinc-100 rounded text-sm text-left transition-colors"
            >
              <span className={`w-6 h-6 ${color} rounded flex items-center justify-center text-white text-xs font-bold`}>
                {icon}
              </span>
              <span className="text-zinc-700">{label}</span>
            </button>
          ))}
        </div>
      )}
      
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          showMenu 
            ? 'bg-zinc-700 hover:bg-zinc-800' 
            : 'bg-zinc-900 hover:bg-zinc-800'
        }`}
        title="Add Node"
      >
        <Add01Icon size={24} className="text-white" strokeWidth={2.5} />
      </button>
    </div>
  );
}

