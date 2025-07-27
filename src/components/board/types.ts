
import { LucideIcon } from 'lucide-react';

export interface ComponentNode {
  id: string;
  name: string;
  type: 'page' | 'component' | 'hook' | 'utility' | 'integration' | 'ui';
  category: string;
  icon: LucideIcon;
  dependencies: string[];
  description: string;
  file: string;
  status: 'active' | 'deprecated' | 'new';
  complexity: 'low' | 'medium' | 'high';
}

export interface BoardNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: ComponentNode & {
    dependents: number;
  };
}

export interface BoardEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}
