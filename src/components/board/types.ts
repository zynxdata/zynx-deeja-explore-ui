
import { LucideIcon } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';
import { ElementType } from 'react';

export interface ComponentNode {
  id: string;
  name: string;
  type: 'page' | 'component' | 'hook' | 'utility' | 'integration' | 'ui';
  category: string;
  icon: LucideIcon | ElementType;
  dependencies: string[];
  description: string;
  file: string;
  status: 'active' | 'deprecated' | 'new';
  complexity: 'low' | 'medium' | 'high';
}

export interface BoardNodeData extends Record<string, unknown> {
  id: string;
  name: string;
  type: string;
  category: string;
  icon: LucideIcon | ElementType;
  dependencies: string[];
  description: string;
  file: string;
  status: string;
  complexity: string;
  dependents: number;
}

export interface BoardNode extends Node {
  data: BoardNodeData;
}

export interface BoardEdge extends Edge {
  // React Flow Edge already includes markerEnd as optional
}
