
import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import FlowNode from './nodes/FlowNode';
import { BoardHeader } from './BoardHeader';
import { NodesPalette } from './sidebar/NodesPalette';
import { PropertiesPanel } from './sidebar/PropertiesPanel';
import { UIProviders } from './providers/UIProviders';
import { ComponentNode, BoardNodeData } from './types';

const nodeTypes = {
  flowNode: FlowNode,
};

interface BoardCanvasProps {
  components: ComponentNode[];
}

export const BoardCanvas: React.FC<BoardCanvasProps> = ({ components }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  // Convert components to nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Create nodes in grid layout
    const gridSize = Math.ceil(Math.sqrt(components.length));
    
    components.forEach((component, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      const dependents = components.filter(c => 
        c.dependencies.includes(component.id)
      ).length;
      
      const nodeData: BoardNodeData = {
        ...component,
        dependents
      };
      
      nodes.push({
        id: component.id,
        type: 'flowNode',
        position: { 
          x: col * 300 + 50, 
          y: row * 200 + 50 
        },
        data: nodeData
      });
    });

    // Create edges based on dependencies
    components.forEach(component => {
      component.dependencies.forEach(depId => {
        if (components.find(c => c.id === depId)) {
          edges.push({
            id: `${depId}-${component.id}`,
            source: depId,
            target: component.id,
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'hsl(var(--primary))' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: 'hsl(var(--primary))'
            }
          });
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [components]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const selectedComponent = useMemo(() => {
    if (!selectedNodeId) return null;
    return components.find(c => c.id === selectedNodeId) || null;
  }, [selectedNodeId, components]);

  const filteredNodes = useMemo(() => {
    if (!searchTerm) return nodes;
    
    return nodes.filter(node => {
      const data = node.data as BoardNodeData;
      return data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             data.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [nodes, searchTerm]);

  const selectedNodes = useMemo(() => {
    return nodes.filter(node => node.selected).length;
  }, [nodes]);

  const onZoomIn = useCallback(() => {
    // ReactFlow zoom functionality will be handled by Controls component
  }, []);

  const onZoomOut = useCallback(() => {
    // ReactFlow zoom functionality will be handled by Controls component
  }, []);

  const onZoomToFit = useCallback(() => {
    // ReactFlow fit view functionality
  }, []);

  const onReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNodeId(null);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onDragStart = useCallback((component: ComponentNode) => {
    // Handle drag start for adding new nodes
    console.log('Dragging component:', component.name);
  }, []);

  const onUpdateComponent = useCallback((componentId: string, updates: Partial<ComponentNode>) => {
    setNodes(nds => 
      nds.map(node => 
        node.id === componentId 
          ? { ...node, data: { ...node.data, ...updates } as BoardNodeData }
          : node
      )
    );
  }, [setNodes]);

  const onDeleteComponent = useCallback((componentId: string) => {
    setNodes(nds => nds.filter(node => node.id !== componentId));
    setEdges(eds => eds.filter(edge => 
      edge.source !== componentId && edge.target !== componentId
    ));
    setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  const backgroundVariant: BackgroundVariant = showGrid ? 'lines' : 'dots';

  return (
    <UIProviders>
      <div className="h-screen flex flex-col bg-background">
        <BoardHeader
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onZoomToFit={onZoomToFit}
          onReset={onReset}
          onToggleGrid={() => setShowGrid(!showGrid)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalNodes={components.length}
          selectedNodes={selectedNodes}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <NodesPalette
            components={components}
            onDragStart={onDragStart}
          />
          
          <div className="flex-1 relative">
            <ReactFlow
              nodes={filteredNodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              className="bg-background"
            >
              <Background 
                variant={backgroundVariant}
                gap={20} 
                size={1}
                color="hsl(var(--border))"
              />
              <Controls 
                position="top-right"
                className="bg-background border rounded-lg shadow-sm"
              />
              <MiniMap 
                position="bottom-right"
                className="bg-background border rounded-lg shadow-sm"
                nodeColor="hsl(var(--primary))"
                maskColor="hsl(var(--muted))"
              />
            </ReactFlow>
          </div>
          
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={onUpdateComponent}
            onDeleteComponent={onDeleteComponent}
          />
        </div>
      </div>
    </UIProviders>
  );
};
