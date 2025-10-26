"use client";
import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow, NodeResizer } from 'reactflow';

export type DataModelNodeData = {
  label: string;
  description?: string;
  fields?: string[];
};

function DataModelNode({ id, data, selected }: NodeProps<DataModelNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

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
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: label.trim() } }
            : node
        )
      );
    } else {
      setLabel(data.label);
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
    <div className="shadow-lg rounded-lg bg-purple-500 border-2 border-purple-600 min-w-[250px] max-w-[400px] hover:shadow-xl transition-shadow overflow-hidden">
      <NodeResizer 
        isVisible={selected} 
        minWidth={250} 
        minHeight={100}
        maxWidth={600}
        maxHeight={800}
        color="#a855f7"
        handleStyle={{ width: '8px', height: '8px', borderRadius: '2px' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 !bg-purple-300 !border-2 !border-purple-700 hover:!bg-purple-200 hover:scale-125 transition-transform"
        style={{ left: -8 }}
      />
      
      {/* Fixed header area */}
      <div className="px-4 py-3 border-b border-purple-600/30">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-white font-semibold text-sm mb-1 bg-purple-600 border border-purple-400 rounded px-1 w-full outline-none"
          />
        ) : (
          <div 
            className="text-white font-semibold text-sm mb-1 cursor-text hover:bg-purple-600 hover:bg-opacity-30 rounded px-1 -mx-1"
            onDoubleClick={handleDoubleClick}
            title="Double-click to edit"
          >
            ▣ {data.label}
          </div>
        )}
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
            className="text-purple-100 text-xs bg-purple-600 border border-purple-400 rounded px-2 py-1 w-full outline-none resize-none mb-2 min-h-[100px]"
            rows={5}
            placeholder="Add detailed description... (Ctrl+Enter to save)"
          />
        ) : (
          <div 
            className="text-purple-100 text-xs cursor-text hover:bg-purple-600 hover:bg-opacity-30 rounded px-1 -mx-1 mb-2 min-h-[40px] whitespace-pre-wrap"
            onDoubleClick={handleDescriptionDoubleClick}
            title="Double-click to edit description"
          >
            {data.description || <span className="text-purple-300 italic">Add detailed description...</span>}
          </div>
        )}
        {data.fields && data.fields.length > 0 && (
          <div className="mt-2 space-y-1">
            {data.fields.slice(0, 3).map((field, idx) => (
              <div key={idx} className="text-xs text-purple-100 font-mono">
                • {field}
              </div>
            ))}
            {data.fields.length > 3 && (
              <div className="text-xs text-purple-200">
                +{data.fields.length - 3} more...
              </div>
            )}
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 !bg-purple-300 !border-2 !border-purple-700 hover:!bg-purple-200 hover:scale-125 transition-transform"
        style={{ right: -8 }}
      />
    </div>
  );
}

export default memo(DataModelNode);

