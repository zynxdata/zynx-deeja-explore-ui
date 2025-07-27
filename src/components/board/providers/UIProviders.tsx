
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TooltipProvider } from '@/components/ui/tooltip';

interface UIProvidersProps {
  children: React.ReactNode;
}

export const UIProviders: React.FC<UIProvidersProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </TooltipProvider>
  );
};
