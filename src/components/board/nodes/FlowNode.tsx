
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BoardNodeData } from '../types';

interface FlowNodeProps {
  data: BoardNodeData;
  selected: boolean;
}

const FlowNode: React.FC<FlowNodeProps> = memo(({ data, selected }) => {
  const IconComponent = data.icon;
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'border-primary bg-primary/5';
      case 'component': return 'border-secondary bg-secondary/5';
      case 'hook': return 'border-accent bg-accent/5';
      case 'utility': return 'border-muted bg-muted/5';
      case 'integration': return 'border-destructive bg-destructive/5';
      case 'ui': return 'border-yellow-500 bg-yellow-500/5';
      default: return 'border-muted bg-muted/5';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'deprecated': return 'text-red-600 bg-red-100';
      case 'new': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !border-primary !w-3 !h-3"
      />
      
      <Card 
        className={`min-w-[200px] ${getTypeColor(data.type)} ${
          selected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        } transition-all cursor-pointer`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <IconComponent className="h-4 w-4" />
            <CardTitle className="text-sm font-medium">{data.name}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {data.type}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(data.status)}`}>
              {data.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-2">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {data.description}
          </p>
          
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {data.dependencies.length} deps
            </span>
            <span className="text-muted-foreground">
              {data.dependents} uses
            </span>
            <span className={getComplexityColor(data.complexity)}>
              {data.complexity}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !border-primary !w-3 !h-3"
      />
    </div>
  );
});

FlowNode.displayName = 'FlowNode';

export default FlowNode;
