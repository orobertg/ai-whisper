"use client";
import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export type NotesNodeData = {
  label: string;
  content?: string;
};

function NotesNode({ data }: NodeProps<NotesNodeData>) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-gray-700 border-2 border-gray-600 min-w-[200px] max-w-[300px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div>
        <div className="text-white font-semibold text-sm mb-1">
          📝 {data.label}
        </div>
        {data.content && (
          <div className="text-gray-300 text-xs whitespace-pre-wrap">
            {data.content.slice(0, 100)}
            {data.content.length > 100 && '...'}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
}

export default memo(NotesNode);

