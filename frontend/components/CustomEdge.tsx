"use client";
import { useCallback } from 'react';
import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow';
import { Delete02Icon } from '@hugeicons/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = useCallback((evt: React.MouseEvent) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  }, [id, setEdges]);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <g transform={`translate(${labelX}, ${labelY})`}>
        <foreignObject
          width={24}
          height={24}
          x={-12}
          y={-12}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="flex items-center justify-center w-full h-full">
            <button
              className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 border border-red-700"
              onClick={onEdgeClick}
              title="Delete connection"
            >
              <Delete02Icon size={12} className="text-white" strokeWidth={2.5} />
            </button>
          </div>
        </foreignObject>
      </g>
    </>
  );
}

