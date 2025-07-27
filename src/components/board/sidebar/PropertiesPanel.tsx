
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ComponentNode } from '../types';
import { Edit, FileText, Settings, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponent: ComponentNode | null;
  onUpdateComponent: (componentId: string, updates: Partial<ComponentNode>) => void;
  onDeleteComponent: (componentId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent
}) => {
  if (!selectedComponent) {
    return (
      <div className="w-80 border-l bg-background h-full flex items-center justify-center">
        <div className="text-center p-8">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">เลือก component เพื่อดูรายละเอียด</p>
        </div>
      </div>
    );
  }

  const IconComponent = selectedComponent.icon;

  const handleFieldUpdate = (field: keyof ComponentNode, value: any) => {
    onUpdateComponent(selectedComponent.id, { [field]: value });
  };

  return (
    <div className="w-80 border-l bg-background h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <IconComponent className="h-5 w-5" />
          <h2 className="font-semibold truncate">{selectedComponent.name}</h2>
        </div>
        <div className="flex gap-1">
          <Badge variant="outline">{selectedComponent.type}</Badge>
          <Badge variant="secondary">{selectedComponent.category}</Badge>
        </div>
      </div>

      <ScrollArea className="h-full">
        <Tabs defaultValue="info" className="p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="component-name">Name</Label>
                  <Input
                    id="component-name"
                    value={selectedComponent.name}
                    onChange={(e) => handleFieldUpdate('name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="component-description">Description</Label>
                  <Textarea
                    id="component-description"
                    value={selectedComponent.description}
                    onChange={(e) => handleFieldUpdate('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="component-file">File Path</Label>
                  <Input
                    id="component-file"
                    value={selectedComponent.file}
                    onChange={(e) => handleFieldUpdate('file', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dependencies</span>
                  <Badge variant="outline">{selectedComponent.dependencies.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="secondary">{selectedComponent.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Complexity</span>
                  <Badge variant="outline">{selectedComponent.complexity}</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Component Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="component-status">Status</Label>
                  <select
                    id="component-status"
                    value={selectedComponent.status}
                    onChange={(e) => handleFieldUpdate('status', e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="new">New</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="component-complexity">Complexity</Label>
                  <select
                    id="component-complexity"
                    value={selectedComponent.complexity}
                    onChange={(e) => handleFieldUpdate('complexity', e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="component-category">Category</Label>
                  <Input
                    id="component-category"
                    value={selectedComponent.category}
                    onChange={(e) => handleFieldUpdate('category', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit Code
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDeleteComponent(selectedComponent.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedComponent.dependencies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No dependencies</p>
                ) : (
                  <div className="space-y-1">
                    {selectedComponent.dependencies.map(dep => (
                      <div key={dep} className="text-sm p-2 bg-muted rounded">
                        {dep}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};
