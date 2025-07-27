
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ComponentNode } from '../types';

interface NodesPaletteProps {
  components: ComponentNode[];
  onDragStart: (component: ComponentNode) => void;
}

export const NodesPalette: React.FC<NodesPaletteProps> = ({
  components,
  onDragStart
}) => {
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, ComponentNode[]>();
    components.forEach(component => {
      const category = component.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(component);
    });
    return Array.from(categoryMap.entries());
  }, [components]);

  const [openCategories, setOpenCategories] = React.useState<Set<string>>(
    new Set(categories.map(([category]) => category))
  );

  const toggleCategory = (category: string) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(category)) {
      newOpenCategories.delete(category);
    } else {
      newOpenCategories.add(category);
    }
    setOpenCategories(newOpenCategories);
  };

  return (
    <div className="w-80 border-r bg-background h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Components Palette</h2>
        <p className="text-sm text-muted-foreground">
          ลาก component ไปยัง board
        </p>
      </div>
      
      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          {categories.map(([category, categoryComponents]) => (
            <Collapsible
              key={category}
              open={openCategories.has(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category}</span>
                    <Badge variant="secondary" className="text-xs">
                      {categoryComponents.length}
                    </Badge>
                  </div>
                  {openCategories.has(category) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-1 ml-2">
                {categoryComponents.map(component => {
                  const IconComponent = component.icon;
                  return (
                    <Card
                      key={component.id}
                      className="cursor-grab hover:shadow-sm transition-shadow"
                      draggable
                      onDragStart={() => onDragStart(component)}
                    >
                      <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {component.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {component.type}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
