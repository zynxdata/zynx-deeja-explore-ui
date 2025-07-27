
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  Layers, 
  Shield, 
  Users, 
  Brain, 
  MessageSquare, 
  Image, 
  FileText, 
  Search,
  Settings,
  Lock,
  Zap,
  Database,
  Globe
} from 'lucide-react';

interface ComponentNode {
  id: string;
  name: string;
  type: 'page' | 'component' | 'hook' | 'utility' | 'integration';
  category: string;
  icon: React.ElementType;
  dependencies: string[];
  description: string;
  file: string;
}

const componentData: ComponentNode[] = [
  // Pages
  {
    id: 'index',
    name: 'Index',
    type: 'page',
    category: 'Pages',
    icon: Globe,
    dependencies: ['hero-section'],
    description: 'หน้าแรกของแพลตฟอร์ม',
    file: 'src/pages/Index.tsx'
  },
  {
    id: 'chat',
    name: 'Chat',
    type: 'page',
    category: 'Pages',
    icon: MessageSquare,
    dependencies: ['auth-provider', 'context-router', 'context-indicator', 'input-validator'],
    description: 'หน้าแชทกับ AI Deeja',
    file: 'src/pages/Chat.tsx'
  },
  {
    id: 'image-generator',
    name: 'ImageGenerator',
    type: 'page',
    category: 'Pages',
    icon: Image,
    dependencies: ['auth-provider', 'input-validator', 'secure-storage'],
    description: 'หน้าสร้างรูปภาพด้วย AI',
    file: 'src/pages/ImageGenerator.tsx'
  },
  {
    id: 'research',
    name: 'Research',
    type: 'page',
    category: 'Pages',
    icon: Search,
    dependencies: [],
    description: 'หน้าค้นคว้าและข้อมูล',
    file: 'src/pages/Research.tsx'
  },
  {
    id: 'admin-dashboard',
    name: 'AdminDashboard',
    type: 'page',
    category: 'Pages',
    icon: Settings,
    dependencies: ['role-guard', 'security-dashboard', 'debug-panel', 'admin-overview'],
    description: 'แดชบอร์ดสำหรับผู้ดูแลระบบ',
    file: 'src/pages/AdminDashboard.tsx'
  },
  {
    id: 'admin-setup',
    name: 'AdminSetup',
    type: 'page',
    category: 'Pages',
    icon: Users,
    dependencies: ['create-owner-user'],
    description: 'หน้าตั้งค่าผู้ดูแลระบบเริ่มต้น',
    file: 'src/pages/AdminSetup.tsx'
  },
  {
    id: 'security',
    name: 'Security',
    type: 'page',
    category: 'Pages',
    icon: Shield,
    dependencies: ['role-guard', 'security-dashboard'],
    description: 'หน้าจัดการความปลอดภัย',
    file: 'src/pages/Security.tsx'
  },

  // Core Components
  {
    id: 'app-sidebar',
    name: 'AppSidebar',
    type: 'component',
    category: 'Core',
    icon: Layers,
    dependencies: ['auth-provider', 'user-role'],
    description: 'แถบนำทางหลักของแอป',
    file: 'src/components/AppSidebar.tsx'
  },
  {
    id: 'hero-section',
    name: 'HeroSection',
    type: 'component',
    category: 'Core',
    icon: Globe,
    dependencies: [],
    description: 'ส่วนหลักของหน้าแรก',
    file: 'src/components/HeroSection.tsx'
  },
  {
    id: 'navigation',
    name: 'Navigation',
    type: 'component',
    category: 'Core',
    icon: GitBranch,
    dependencies: ['auth-provider'],
    description: 'แถบนำทางหลัก',
    file: 'src/components/Navigation.tsx'
  },

  // Authentication Components
  {
    id: 'auth-provider',
    name: 'AuthProvider',
    type: 'component',
    category: 'Authentication',
    icon: Lock,
    dependencies: ['supabase-client'],
    description: 'ผู้ให้บริการการยืนยันตัวตน',
    file: 'src/components/auth/AuthProvider.tsx'
  },
  {
    id: 'auth-page',
    name: 'AuthPage',
    type: 'component',
    category: 'Authentication',
    icon: Users,
    dependencies: ['auth-provider'],
    description: 'หน้าเข้าสู่ระบบและสมัครสมาชิก',
    file: 'src/components/auth/AuthPage.tsx'
  },
  {
    id: 'protected-route',
    name: 'ProtectedRoute',
    type: 'component',
    category: 'Authentication',
    icon: Shield,
    dependencies: ['auth-provider'],
    description: 'เส้นทางที่ต้องเข้าสู่ระบบ',
    file: 'src/components/auth/ProtectedRoute.tsx'
  },
  {
    id: 'role-guard',
    name: 'RoleGuard',
    type: 'component',
    category: 'Authentication',
    icon: Shield,
    dependencies: ['user-role'],
    description: 'ตรวจสอบสิทธิ์ตามบทบาท',
    file: 'src/components/auth/RoleGuard.tsx'
  },
  {
    id: 'with-auth',
    name: 'withAuth',
    type: 'component',
    category: 'Authentication',
    icon: Lock,
    dependencies: ['auth-provider'],
    description: 'HOC สำหรับการยืนยันตัวตน',
    file: 'src/components/auth/withAuth.tsx'
  },

  // Chat Components
  {
    id: 'context-router',
    name: 'ContextRouter',
    type: 'component',
    category: 'Chat',
    icon: Brain,
    dependencies: ['language-detector', 'emotion-detector'],
    description: 'เราเตอร์สำหรับวิเคราะห์บริบท',
    file: 'src/components/chat/ContextRouter.ts'
  },
  {
    id: 'context-indicator',
    name: 'ContextIndicator',
    type: 'component',
    category: 'Chat',
    icon: Zap,
    dependencies: [],
    description: 'แสดงสถานะบริบทปัจจุบัน',
    file: 'src/components/chat/ContextIndicator.tsx'
  },
  {
    id: 'emotion-detector',
    name: 'EmotionDetector',
    type: 'component',
    category: 'Chat',
    icon: Brain,
    dependencies: [],
    description: 'ตรวจจับอารมณ์จากข้อความ',
    file: 'src/components/chat/EmotionDetector.ts'
  },
  {
    id: 'language-detector',
    name: 'LanguageDetector',
    type: 'component',
    category: 'Chat',
    icon: Globe,
    dependencies: [],
    description: 'ตรวจจับภาษาจากข้อความ',
    file: 'src/components/chat/LanguageDetector.ts'
  },

  // Security Components
  {
    id: 'security-dashboard',
    name: 'SecurityDashboard',
    type: 'component',
    category: 'Security',
    icon: Shield,
    dependencies: ['security-events', 'security-health-check'],
    description: 'แดshบอร์ดความปลอดภัย',
    file: 'src/components/security/SecurityDashboard.tsx'
  },
  {
    id: 'input-validator',
    name: 'InputValidator',
    type: 'component',
    category: 'Security',
    icon: Shield,
    dependencies: [],
    description: 'ตรวจสอบความถูกต้องของข้อมูลนำเข้า',
    file: 'src/components/security/InputValidator.tsx'
  },
  {
    id: 'security-alert',
    name: 'SecurityAlert',
    type: 'component',
    category: 'Security',
    icon: Shield,
    dependencies: [],
    description: 'แจ้งเตือนความปลอดภัย',
    file: 'src/components/security/SecurityAlert.tsx'
  },

  // Admin Components
  {
    id: 'admin-overview',
    name: 'AdminOverview',
    type: 'component',
    category: 'Admin',
    icon: Settings,
    dependencies: ['user-role'],
    description: 'ภาพรวมระบบสำหรับผู้ดูแล',
    file: 'src/components/admin/AdminOverview.tsx'
  },
  {
    id: 'create-owner-user',
    name: 'CreateOwnerUser',
    type: 'component',
    category: 'Admin',
    icon: Users,
    dependencies: ['supabase-client'],
    description: 'สร้างผู้ใช้เจ้าของระบบ',
    file: 'src/components/admin/CreateOwnerUser.tsx'
  },
  {
    id: 'debug-panel',
    name: 'DebugPanel',
    type: 'component',
    category: 'Admin',
    icon: Settings,
    dependencies: [],
    description: 'แผงตรวจสอบข้อผิดพลาด',
    file: 'src/components/debug/DebugPanel.tsx'
  },

  // Hooks
  {
    id: 'user-role',
    name: 'useUserRole',
    type: 'hook',
    category: 'Hooks',
    icon: Users,
    dependencies: ['auth-provider', 'supabase-client'],
    description: 'จัดการบทบาทผู้ใช้',
    file: 'src/hooks/useUserRole.ts'
  },
  {
    id: 'secure-storage',
    name: 'useSecureStorage',
    type: 'hook',
    category: 'Hooks',
    icon: Lock,
    dependencies: [],
    description: 'เก็บข้อมูลอย่างปลอดภัย',
    file: 'src/hooks/useSecureStorage.ts'
  },
  {
    id: 'security-monitor',
    name: 'useSecurityMonitor',
    type: 'hook',
    category: 'Hooks',
    icon: Shield,
    dependencies: ['supabase-client'],
    description: 'ตรวจสอบความปลอดภัย',
    file: 'src/hooks/useSecurityMonitor.ts'
  },
  {
    id: 'security-events',
    name: 'useSecurityEvents',
    type: 'hook',
    category: 'Hooks',
    icon: Shield,
    dependencies: ['supabase-client'],
    description: 'จัดการเหตุการณ์ความปลอดภัย',
    file: 'src/hooks/useSecurityEvents.ts'
  },
  {
    id: 'security-health-check',
    name: 'useSecurityHealthCheck',
    type: 'hook',
    category: 'Hooks',
    icon: Shield,
    dependencies: ['supabase-client'],
    description: 'ตรวจสอบสุขภาพความปลอดภัย',
    file: 'src/hooks/useSecurityHealthCheck.ts'
  },

  // Integrations
  {
    id: 'supabase-client',
    name: 'SupabaseClient',
    type: 'integration',
    category: 'Integrations',
    icon: Database,
    dependencies: [],
    description: 'การเชื่อมต่อฐานข้อมูล Supabase',
    file: 'src/integrations/supabase/client.ts'
  }
];

const ComponentFlowchart: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(componentData.map(c => c.category)))];
  const filteredComponents = selectedCategory === 'all' 
    ? componentData 
    : componentData.filter(c => c.category === selectedCategory);

  const getTypeColor = (type: ComponentNode['type']) => {
    switch (type) {
      case 'page': return 'bg-primary/10 border-primary';
      case 'component': return 'bg-secondary/10 border-secondary';
      case 'hook': return 'bg-accent/10 border-accent';
      case 'utility': return 'bg-muted/10 border-muted';
      case 'integration': return 'bg-destructive/10 border-destructive';
      default: return 'bg-muted/10 border-muted';
    }
  };

  const getTypeIcon = (type: ComponentNode['type']) => {
    switch (type) {
      case 'page': return Globe;
      case 'component': return Layers;
      case 'hook': return Zap;
      case 'utility': return Settings;
      case 'integration': return Database;
      default: return FileText;
    }
  };

  const selectedComponent = selectedNode ? componentData.find(c => c.id === selectedNode) : null;
  const dependents = selectedNode 
    ? componentData.filter(c => c.dependencies.includes(selectedNode))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Component Architecture Flowchart
          </h1>
          <p className="text-muted-foreground text-lg">
            ระบบแผนผังโครงสร้าง Components ของ Zynx CaaS Platform
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="dependencies">ความสัมพันธ์</TabsTrigger>
            <TabsTrigger value="details">รายละเอียด</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'ทั้งหมด' : category}
                </Button>
              ))}
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredComponents.map(component => {
                const IconComponent = component.icon;
                const TypeIcon = getTypeIcon(component.type);
                return (
                  <Card 
                    key={component.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${getTypeColor(component.type)} ${
                      selectedNode === component.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedNode(component.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <CardTitle className="text-sm">{component.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {component.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2">
                        {component.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Dependencies: {component.dependencies.length}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-6">
            {selectedComponent ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Selected Component */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <selectedComponent.icon className="h-5 w-5" />
                      {selectedComponent.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{selectedComponent.description}</p>
                    <div className="space-y-2">
                      <Badge variant="outline">{selectedComponent.type}</Badge>
                      <Badge variant="secondary">{selectedComponent.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedComponent.file}
                    </p>
                  </CardContent>
                </Card>

                {/* Dependencies & Dependents */}
                <div className="space-y-4">
                  {/* Dependencies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Dependencies ({selectedComponent.dependencies.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedComponent.dependencies.length === 0 ? (
                        <p className="text-muted-foreground text-sm">ไม่มี dependencies</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedComponent.dependencies.map(depId => {
                            const dep = componentData.find(c => c.id === depId);
                            return dep ? (
                              <div 
                                key={depId}
                                className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50"
                                onClick={() => setSelectedNode(depId)}
                              >
                                <dep.icon className="h-4 w-4" />
                                <span className="text-sm">{dep.name}</span>
                              </div>
                            ) : (
                              <div key={depId} className="text-sm text-muted-foreground">
                                {depId} (not found)
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Dependents */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Used by ({dependents.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dependents.length === 0 ? (
                        <p className="text-muted-foreground text-sm">ไม่มี components ที่ใช้งาน</p>
                      ) : (
                        <div className="space-y-2">
                          {dependents.map(dependent => (
                            <div 
                              key={dependent.id}
                              className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted/50"
                              onClick={() => setSelectedNode(dependent.id)}
                            >
                              <dependent.icon className="h-4 w-4" />
                              <span className="text-sm">{dependent.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">เลือก Component เพื่อดูความสัมพันธ์</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6">
              {categories.slice(1).map(category => {
                const categoryComponents = componentData.filter(c => c.category === category);
                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        {category} ({categoryComponents.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryComponents.map(component => (
                          <div 
                            key={component.id}
                            className={`p-3 rounded border ${getTypeColor(component.type)} cursor-pointer hover:shadow-md`}
                            onClick={() => setSelectedNode(component.id)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <component.icon className="h-4 w-4" />
                              <span className="font-medium text-sm">{component.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {component.description}
                            </p>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {component.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {component.dependencies.length} deps
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>สถิติระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{componentData.filter(c => c.type === 'page').length}</div>
                <div className="text-sm text-muted-foreground">Pages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{componentData.filter(c => c.type === 'component').length}</div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{componentData.filter(c => c.type === 'hook').length}</div>
                <div className="text-sm text-muted-foreground">Hooks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{componentData.filter(c => c.type === 'utility').length}</div>
                <div className="text-sm text-muted-foreground">Utilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{componentData.filter(c => c.type === 'integration').length}</div>
                <div className="text-sm text-muted-foreground">Integrations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentFlowchart;
