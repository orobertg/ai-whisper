"use client";
import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  BackgroundVariant,
  NodeChange,
  EdgeChange,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTheme } from '@/contexts/ThemeContext';

import FeatureNode from './nodes/FeatureNode';
import TechnicalNode from './nodes/TechnicalNode';
import UserStoryNode from './nodes/UserStoryNode';
import DataModelNode from './nodes/DataModelNode';
import NotesNode from './nodes/NotesNode';
import TodoNode from './nodes/TodoNode';
import MindMapToolbar from './MindMapToolbar';
import CustomEdge from './CustomEdge';

const nodeTypes = {
  feature: FeatureNode,
  technical: TechnicalNode,
  userstory: UserStoryNode,
  datamodel: DataModelNode,
  notes: NotesNode,
  todo: TodoNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

type MindMapProps = {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
};

export default function MindMap({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
}: MindMapProps) {
  const { isLight } = useTheme();
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  
  // Use refs to track if this is the first render
  const isFirstRenderNodes = useRef(true);
  const isFirstRenderEdges = useRef(true);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      if (onEdgesChange) {
        onEdgesChange(newEdges);
      }
    },
    [edges, onEdgesChange, setEdges]
  );

  // Custom node change handler
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeInternal(changes);
      // After the internal state updates, notify parent
      // We use setTimeout to ensure state has updated
      setTimeout(() => {
        if (onNodesChange) {
          setNodes((currentNodes) => {
            onNodesChange(currentNodes);
            return currentNodes;
          });
        }
      }, 0);
    },
    [onNodesChangeInternal, onNodesChange, setNodes]
  );

  // Custom edge change handler
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChangeInternal(changes);
      // After the internal state updates, notify parent
      setTimeout(() => {
        if (onEdgesChange) {
          setEdges((currentEdges) => {
            onEdgesChange(currentEdges);
            return currentEdges;
          });
        }
      }, 0);
    },
    [onEdgesChangeInternal, onEdgesChange, setEdges]
  );

  // Propagate node changes to parent (skip first render)
  useEffect(() => {
    if (isFirstRenderNodes.current) {
      isFirstRenderNodes.current = false;
      return;
    }
    if (onNodesChange) {
      onNodesChange(nodes);
    }
  }, [nodes]);

  // Propagate edge changes to parent (skip first render)
  useEffect(() => {
    if (isFirstRenderEdges.current) {
      isFirstRenderEdges.current = false;
      return;
    }
    if (onEdgesChange) {
      onEdgesChange(edges);
    }
  }, [edges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.1}
        maxZoom={2}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: 'custom',
          animated: false,
          style: { stroke: isLight ? '#64748b' : '#71717a', strokeWidth: 2 }
        }}
        deleteKeyCode="Delete"
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (isLight) {
              switch (node.type) {
                case 'feature':
                  return '#52525b';
                case 'technical':
                  return '#71717a';
                case 'userstory':
                  return '#a1a1aa';
                case 'datamodel':
                  return '#d4d4d8';
                case 'notes':
                  return '#e4e4e7';
                default:
                  return '#3f3f46';
              }
            } else {
              // Dark theme - lighter colors
              switch (node.type) {
                case 'feature':
                  return '#a1a1aa';
                case 'technical':
                  return '#d4d4d8';
                case 'userstory':
                  return '#e4e4e7';
                case 'datamodel':
                  return '#f4f4f5';
                case 'notes':
                  return '#fafafa';
                default:
                  return '#71717a';
              }
            }
          }}
          className={isLight ? 'bg-zinc-100' : 'bg-zinc-800'}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1} 
          className={isLight ? 'bg-white' : 'bg-zinc-900'} 
        />
        <MindMapToolbar onAddNode={(node) => {
          // Manually added nodes are automatically tracked through handleNodesChange
        }} />
      </ReactFlow>
    </div>
  );
}

