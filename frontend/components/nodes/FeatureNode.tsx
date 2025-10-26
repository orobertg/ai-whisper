"use client";
import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';

export type FeatureNodeData = {
  label: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
};

function FeatureNode({ id, data, selected }: NodeProps<FeatureNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

  const statusColors = {
    'todo': 'bg-gray-600',
    'in-progress': 'bg-blue-600',
    'done': 'bg-green-600'
  };

  const priorityIndicator = {
    'low': '●',
    'medium': '●●',
    'high': '●●●'
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (label.trim() && label !== data.label) {
      // Update node data
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: label.trim() } }
            : node
        )
      );
    } else {
      setLabel(data.label); // Revert if empty
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLabel(data.label);
      setIsEditing(false);
    }
  };

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(data.description || '');
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
      descriptionRef.current.select();
    }
  }, [isEditingDescription]);

  const handleDescriptionDoubleClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (description !== data.description) {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, description: description.trim() } }
            : node
        )
      );
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleDescriptionBlur();
    } else if (e.key === 'Escape') {
      setDescription(data.description || '');
      setIsEditingDescription(false);
    }
  };

  return (
    <div className="shadow-lg rounded-lg bg-blue-500 border-2 border-blue-600 min-w-[250px] max-w-[400px] hover:shadow-xl transition-shadow overflow-hidden">
      <NodeResizer 
        isVisible={selected} 
        minWidth={250} 
        minHeight={100}
        maxWidth={600}
        maxHeight={800}
        color="#3b82f6"
        handleStyle={{ width: '8px', height: '8px', borderRadius: '2px' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 !bg-blue-300 !border-2 !border-blue-700 hover:!bg-blue-200 hover:scale-125 transition-transform"
        style={{ left: -8 }}
      />
      
      {/* Fixed header area */}
      <div className="px-4 py-3 border-b border-blue-600/30">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="text-white font-semibold text-sm mb-1 bg-blue-600 border border-blue-400 rounded px-1 w-full outline-none"
              />
            ) : (
              <div 
                className="text-white font-semibold text-sm mb-1 cursor-text hover:bg-blue-600 hover:bg-opacity-30 rounded px-1 -mx-1"
                onDoubleClick={handleDoubleClick}
                title="Double-click to edit"
              >
                {data.label}
              </div>
            )}
          </div>
          {data.priority && (
            <span className="text-blue-200 text-xs flex-shrink-0">
              {priorityIndicator[data.priority]}
            </span>
          )}
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="px-4 py-3 max-h-[200px] overflow-y-auto scrollbar-thin">
        {isEditingDescription ? (
          <textarea
            ref={descriptionRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            onKeyDown={handleDescriptionKeyDown}
            className="text-blue-100 text-xs bg-blue-600 border border-blue-400 rounded px-2 py-1 w-full outline-none resize-none min-h-[100px]"
            rows={5}
            placeholder="Add detailed description... (Ctrl+Enter to save)"
          />
        ) : (
          <div 
            className="text-blue-100 text-xs cursor-text hover:bg-blue-600 hover:bg-opacity-30 rounded px-1 -mx-1 min-h-[40px] whitespace-pre-wrap"
            onDoubleClick={handleDescriptionDoubleClick}
            title="Double-click to edit description"
          >
            {data.description || <span className="text-blue-300 italic">Add detailed description...</span>}
          </div>
        )}

        {data.status && (
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded ${statusColors[data.status]} text-white`}>
              {data.status}
            </span>
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 !bg-blue-300 !border-2 !border-blue-700 hover:!bg-blue-200 hover:scale-125 transition-transform"
        style={{ right: -8 }}
      />
    </div>
  );
}

export default memo(FeatureNode);

