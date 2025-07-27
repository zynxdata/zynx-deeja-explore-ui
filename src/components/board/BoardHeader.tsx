
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Settings, 
  Search,
  RotateCcw,
  Maximize2,
  Grid3x3
} from 'lucide-react';

interface BoardHeaderProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onReset: () => void;
  onToggleGrid: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalNodes: number;
  selectedNodes: number;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onReset,
  onToggleGrid,
  searchTerm,
  onSearchChange,
  totalNodes,
  selectedNodes
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Component Board</h1>
          <Badge variant="secondary">{totalNodes} nodes</Badge>
          {selectedNodes > 0 && (
            <Badge variant="default">{selectedNodes} selected</Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหา components..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={onZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onZoomToFit}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToggleGrid}>
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
