
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
  Globe,
  Code,
  Palette,
  Box,
  Activity,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Heart
} from 'lucide-react';

interface ComponentNode {
  id: string;
  name: string;
  type: 'page' | 'component' | 'hook' | 'utility' | 'integration' | 'ui';
  category: string;
  icon: React.ElementType;
  dependencies: string[];
  description: string;
  file: string;
  status: 'active' | 'deprecated' | 'new';
  complexity: 'low' | 'medium' | 'high';
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
    description: 'หน้าแรกของแพลตฟอร์ม Zynx CaaS',
    file: 'src/pages/Index.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'chat',
    name: 'Chat',
    type: 'page',
    category: 'Pages',
    icon: MessageSquare,
    dependencies: ['auth-provider', 'context-router', 'context-indicator', 'input-validator'],
    description: 'หน้าแชทกับ AI Deeja',
    file: 'src/pages/Chat.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'image-generator',
    name: 'ImageGenerator',
    type: 'page',
    category: 'Pages',
    icon: Image,
    dependencies: ['auth-provider', 'input-validator', 'secure-storage'],
    description: 'หน้าสร้างรูปภาพด้วย AI',
    file: 'src/pages/ImageGenerator.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'research',
    name: 'Research',
    type: 'page',
    category: 'Pages',
    icon: Search,
    dependencies: [],
    description: 'หน้าค้นคว้าและข้อมูล',
    file: 'src/pages/Research.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'admin-dashboard',
    name: 'AdminDashboard',
    type: 'page',
    category: 'Pages',
    icon: Settings,
    dependencies: ['role-guard', 'security-dashboard', 'debug-panel', 'admin-overview'],
    description: 'แดชบอร์ดสำหรับผู้ดูแลระบบ',
    file: 'src/pages/AdminDashboard.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'admin-setup',
    name: 'AdminSetup',
    type: 'page',
    category: 'Pages',
    icon: Users,
    dependencies: ['create-owner-user'],
    description: 'หน้าตั้งค่าผู้ดูแลระบบเริ่มต้น',
    file: 'src/pages/AdminSetup.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'security',
    name: 'Security',
    type: 'page',
    category: 'Pages',
    icon: Shield,
    dependencies: ['role-guard', 'security-dashboard'],
    description: 'หน้าจัดการความปลอดภัย',
    file: 'src/pages/Security.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'component-flowchart-page',
    name: 'ComponentFlowchart',
    type: 'page',
    category: 'Pages',
    icon: GitBranch,
    dependencies: ['component-flowchart'],
    description: 'หน้าแสดง Component Architecture',
    file: 'src/pages/ComponentFlowchart.tsx',
    status: 'new',
    complexity: 'low'
  },
  {
    id: 'not-found',
    name: 'NotFound',
    type: 'page',
    category: 'Pages',
    icon: XCircle,
    dependencies: [],
    description: 'หน้า 404 Not Found',
    file: 'src/pages/NotFound.tsx',
    status: 'active',
    complexity: 'low'
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
    file: 'src/components/AppSidebar.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'hero-section',
    name: 'HeroSection',
    type: 'component',
    category: 'Core',
    icon: Globe,
    dependencies: [],
    description: 'ส่วนหลักของหน้าแรก',
    file: 'src/components/HeroSection.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'navigation',
    name: 'Navigation',
    type: 'component',
    category: 'Core',
    icon: GitBranch,
    dependencies: ['auth-provider'],
    description: 'แถบนำทางหลัก',
    file: 'src/components/Navigation.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'footer',
    name: 'Footer',
    type: 'component',
    category: 'Core',
    icon: Box,
    dependencies: [],
    description: 'ส่วนท้ายของเว็บไซต์',
    file: 'src/components/Footer.tsx',
    status: 'active',
    complexity: 'low'
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
    file: 'src/components/auth/AuthProvider.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'auth-page',
    name: 'AuthPage',
    type: 'component',
    category: 'Authentication',
    icon: Users,
    dependencies: ['auth-provider'],
    description: 'หน้าเข้าสู่ระบบและสมัครสมาชิก',
    file: 'src/components/auth/AuthPage.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'protected-route',
    name: 'ProtectedRoute',
    type: 'component',
    category: 'Authentication',
    icon: Shield,
    dependencies: ['auth-provider'],
    description: 'เส้นทางที่ต้องเข้าสู่ระบบ',
    file: 'src/components/auth/ProtectedRoute.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'role-guard',
    name: 'RoleGuard',
    type: 'component',
    category: 'Authentication',
    icon: Shield,
    dependencies: ['user-role'],
    description: 'ตรวจสอบสิทธิ์ตามบทบาท',
    file: 'src/components/auth/RoleGuard.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'with-auth',
    name: 'withAuth',
    type: 'component',
    category: 'Authentication',
    icon: Lock,
    dependencies: ['auth-provider'],
    description: 'HOC สำหรับการยืนยันตัวตน',
    file: 'src/components/auth/withAuth.tsx',
    status: 'active',
    complexity: 'medium'
  },

  // Chat & AI Components
  {
    id: 'context-engine',
    name: 'ContextEngine',
    type: 'component',
    category: 'Chat & AI',
    icon: Brain,
    dependencies: [],
    description: 'เครื่องมือวิเคราะห์และแสดงบริบท AI',
    file: 'src/components/ContextEngine.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'context-router',
    name: 'ContextRouter',
    type: 'component',
    category: 'Chat & AI',
    icon: Brain,
    dependencies: ['language-detector', 'emotion-detector'],
    description: 'เราเตอร์สำหรับวิเคราะห์บริบท',
    file: 'src/components/chat/ContextRouter.ts',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'context-indicator',
    name: 'ContextIndicator',
    type: 'component',
    category: 'Chat & AI',
    icon: Zap,
    dependencies: [],
    description: 'แสดงสถานะบริบทปัจจุบัน',
    file: 'src/components/chat/ContextIndicator.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'emotion-detector',
    name: 'EmotionDetector',
    type: 'component',
    category: 'Chat & AI',
    icon: Heart,
    dependencies: [],
    description: 'ตรวจจับอารมณ์จากข้อความ',
    file: 'src/components/chat/EmotionDetector.ts',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'language-detector',
    name: 'LanguageDetector',
    type: 'component',
    category: 'Chat & AI',
    icon: Globe,
    dependencies: [],
    description: 'ตรวจจับภาษาจากข้อความ',
    file: 'src/components/chat/LanguageDetector.ts',
    status: 'active',
    complexity: 'medium'
  },

  // Security Components
  {
    id: 'security-dashboard',
    name: 'SecurityDashboard',
    type: 'component',
    category: 'Security',
    icon: Shield,
    dependencies: ['security-events', 'security-health-check', 'security-events-list'],
    description: 'แดชบอร์ดความปลอดภัย',
    file: 'src/components/security/SecurityDashboard.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'security-events-list',
    name: 'SecurityEventsList',
    type: 'component',
    category: 'Security',
    icon: Activity,
    dependencies: ['security-events'],
    description: 'แสดงรายการเหตุการณ์ความปลอดภัย',
    file: 'src/components/security/SecurityEventsList.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'input-validator',
    name: 'InputValidator',
    type: 'component',
    category: 'Security',
    icon: Shield,
    dependencies: [],
    description: 'ตรวจสอบความถูกต้องของข้อมูลนำเข้า',
    file: 'src/components/security/InputValidator.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'advanced-input-validator',
    name: 'AdvancedInputValidator',
    type: 'component',
    category: 'Security',
    icon: Shield,
    dependencies: ['input-validator'],
    description: 'ตรวจสอบข้อมูลขั้นสูง',
    file: 'src/components/security/AdvancedInputValidator.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'security-alert',
    name: 'SecurityAlert',
    type: 'component',
    category: 'Security',
    icon: AlertTriangle,
    dependencies: ['supabase-client'],
    description: 'แจ้งเตือนความปลอดภัย',
    file: 'src/components/security/SecurityAlert.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'security-headers',
    name: 'SecurityHeaders',
    type: 'component',
    category: 'Security',
    icon: Shield,
    dependencies: [],
    description: 'จัดการ Security Headers',
    file: 'src/components/security/SecurityHeaders.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'secure-error-boundary',
    name: 'SecureErrorBoundary',
    type: 'component',
    category: 'Security',
    icon: Shield,
    dependencies: [],
    description: 'จัดการข้อผิดพลาดอย่างปลอดภัย',
    file: 'src/components/security/SecureErrorBoundary.tsx',
    status: 'active',
    complexity: 'high'
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
    file: 'src/components/admin/AdminOverview.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'admin-user-management',
    name: 'AdminUserManagement',
    type: 'component',
    category: 'Admin',
    icon: Users,
    dependencies: ['supabase-client', 'user-role'],
    description: 'จัดการผู้ใช้ระบบ',
    file: 'src/components/admin/AdminUserManagement.tsx',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'create-owner-user',
    name: 'CreateOwnerUser',
    type: 'component',
    category: 'Admin',
    icon: Users,
    dependencies: ['supabase-client'],
    description: 'สร้างผู้ใช้เจ้าของระบบ',
    file: 'src/components/admin/CreateOwnerUser.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'debug-panel',
    name: 'DebugPanel',
    type: 'component',
    category: 'Admin',
    icon: Code,
    dependencies: [],
    description: 'แผงตรวจสอบข้อผิดพลาด',
    file: 'src/components/debug/DebugPanel.tsx',
    status: 'active',
    complexity: 'medium'
  },

  // Flowchart Components
  {
    id: 'component-flowchart',
    name: 'ComponentFlowchart',
    type: 'component',
    category: 'Visualization',
    icon: GitBranch,
    dependencies: [],
    description: 'แสดงผังโครงสร้าง Components',
    file: 'src/components/flowchart/ComponentFlowchart.tsx',
    status: 'active',
    complexity: 'high'
  },

  // UI Components
  {
    id: 'ui-button',
    name: 'Button',
    type: 'ui',
    category: 'UI Components',
    icon: Box,
    dependencies: [],
    description: 'ปุ่มพื้นฐาน',
    file: 'src/components/ui/button.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-card',
    name: 'Card',
    type: 'ui',
    category: 'UI Components',
    icon: Box,
    dependencies: [],
    description: 'การ์ดแสดงข้อมูล',
    file: 'src/components/ui/card.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-badge',
    name: 'Badge',
    type: 'ui',
    category: 'UI Components',
    icon: Box,
    dependencies: [],
    description: 'ป้ายแสดงสถานะ',
    file: 'src/components/ui/badge.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-alert',
    name: 'Alert',
    type: 'ui',
    category: 'UI Components',
    icon: AlertTriangle,
    dependencies: [],
    description: 'แจ้งเตือน',
    file: 'src/components/ui/alert.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-avatar',
    name: 'Avatar',
    type: 'ui',
    category: 'UI Components',
    icon: User,
    dependencies: [],
    description: 'รูปโปรไฟล์ผู้ใช้',
    file: 'src/components/ui/avatar.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-checkbox',
    name: 'Checkbox',
    type: 'ui',
    category: 'UI Components',
    icon: CheckCircle,
    dependencies: [],
    description: 'ช่องเลือก',
    file: 'src/components/ui/checkbox.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-calendar',
    name: 'Calendar',
    type: 'ui',
    category: 'UI Components',
    icon: Clock,
    dependencies: [],
    description: 'ปฏิทิน',
    file: 'src/components/ui/calendar.tsx',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'ui-tabs',
    name: 'Tabs',
    type: 'ui',
    category: 'UI Components',
    icon: Layers,
    dependencies: [],
    description: 'แท็บ',
    file: 'src/components/ui/tabs.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-loading-spinner',
    name: 'LoadingSpinner',
    type: 'ui',
    category: 'UI Components',
    icon: Activity,
    dependencies: [],
    description: 'ตัวโหลด',
    file: 'src/components/ui/loading-spinner.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-status-badge',
    name: 'StatusBadge',
    type: 'ui',
    category: 'UI Components',
    icon: Box,
    dependencies: [],
    description: 'ป้ายแสดงสถานะ',
    file: 'src/components/ui/status-badge.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-collapsible',
    name: 'Collapsible',
    type: 'ui',
    category: 'UI Components',
    icon: Layers,
    dependencies: [],
    description: 'พื้นที่ยุบ/ขยายได้',
    file: 'src/components/ui/collapsible.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-aspect-ratio',
    name: 'AspectRatio',
    type: 'ui',
    category: 'UI Components',
    icon: Box,
    dependencies: [],
    description: 'อัตราส่วนภาพ',
    file: 'src/components/ui/aspect-ratio.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-breadcrumb',
    name: 'Breadcrumb',
    type: 'ui',
    category: 'UI Components',
    icon: GitBranch,
    dependencies: [],
    description: 'เส้นทางการนำทาง',
    file: 'src/components/ui/breadcrumb.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'ui-drawer',
    name: 'Drawer',
    type: 'ui',
    category: 'UI Components',
    icon: Layers,
    dependencies: [],
    description: 'ลิ้นชักเลื่อน',
    file: 'src/components/ui/drawer.tsx',
    status: 'active',
    complexity: 'medium'
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
    file: 'src/hooks/useUserRole.ts',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'secure-storage',
    name: 'useSecureStorage',
    type: 'hook',
    category: 'Hooks',
    icon: Lock,
    dependencies: [],
    description: 'เก็บข้อมูลอย่างปลอดภัย',
    file: 'src/hooks/useSecureStorage.ts',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'security-monitor',
    name: 'useSecurityMonitor',
    type: 'hook',
    category: 'Hooks',
    icon: Shield,
    dependencies: ['supabase-client'],
    description: 'ตรวจสอบความปลอดภัย',
    file: 'src/hooks/useSecurityMonitor.ts',
    status: 'active',
    complexity: 'high'
  },
  {
    id: 'security-events',
    name: 'useSecurityEvents',
    type: 'hook',
    category: 'Hooks',
    icon: Shield,
    dependencies: ['supabase-client'],
    description: 'จัดการเหตุการณ์ความปลอดภัย',
    file: 'src/hooks/useSecurityEvents.ts',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'security-health-check',
    name: 'useSecurityHealthCheck',
    type: 'hook',
    category: 'Hooks',
    icon: Shield,
    dependencies: ['supabase-client'],
    description: 'ตรวจสอบสุขภาพความปลอดภัย',
    file: 'src/hooks/useSecurityHealthCheck.ts',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'use-mobile',
    name: 'useMobile',
    type: 'hook',
    category: 'Hooks',
    icon: Box,
    dependencies: [],
    description: 'ตรวจสอบการใช้งานบนมือถือ',
    file: 'src/hooks/use-mobile.tsx',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'use-toast',
    name: 'useToast',
    type: 'hook',
    category: 'Hooks',
    icon: AlertTriangle,
    dependencies: [],
    description: 'จัดการ Toast notifications',
    file: 'src/hooks/use-toast.ts',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'use-async-state',
    name: 'useAsyncState',
    type: 'hook',
    category: 'Hooks',
    icon: Activity,
    dependencies: [],
    description: 'จัดการ Async state',
    file: 'src/hooks/useAsyncState.ts',
    status: 'active',
    complexity: 'medium'
  },
  {
    id: 'use-server-rate-limit',
    name: 'useServerRateLimit',
    type: 'hook',
    category: 'Hooks',
    icon: Shield,
    dependencies: [],
    description: 'จำกัดอัตราการเรียก API',
    file: 'src/hooks/useServerRateLimit.ts',
    status: 'active',
    complexity: 'medium'
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
    file: 'src/integrations/supabase/client.ts',
    status: 'active',
    complexity: 'low'
  },
  {
    id: 'supabase-types',
    name: 'SupabaseTypes',
    type: 'integration',
    category: 'Integrations',
    icon: Code,
    dependencies: [],
    description: 'ประเภทข้อมูล Supabase',
    file: 'src/integrations/supabase/types.ts',
    status: 'active',
    complexity: 'low'
  },

  // Utilities
  {
    id: 'utils',
    name: 'Utils',
    type: 'utility',
    category: 'Utilities',
    icon: Settings,
    dependencies: [],
    description: 'ฟังก์ชันช่วยเหลือทั่วไป',
    file: 'src/lib/utils.ts',
    status: 'active',
    complexity: 'low'
  }
];

const ComponentFlowchart: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(componentData.map(c => c.category)))];
  
  const filteredComponents = componentData.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesComplexity = complexityFilter === 'all' || c.complexity === complexityFilter;
    
    return matchesCategory && matchesSearch && matchesStatus && matchesComplexity;
  });

  const getTypeColor = (type: ComponentNode['type']) => {
    switch (type) {
      case 'page': return 'bg-primary/10 border-primary text-primary';
      case 'component': return 'bg-secondary/10 border-secondary text-secondary-foreground';
      case 'hook': return 'bg-accent/10 border-accent text-accent-foreground';
      case 'utility': return 'bg-muted/10 border-muted text-muted-foreground';
      case 'integration': return 'bg-destructive/10 border-destructive text-destructive-foreground';
      case 'ui': return 'bg-agi-yellow/10 border-agi-yellow text-foreground';
      default: return 'bg-muted/10 border-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: ComponentNode['status']) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'deprecated': return 'text-red-600';
      case 'new': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getComplexityColor = (complexity: ComponentNode['complexity']) => {
    switch (complexity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
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
          <div className="mt-4 text-sm text-muted-foreground">
            ทั้งหมด {componentData.length} Components | {categories.length - 1} Categories
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="dependencies">ความสัมพันธ์</TabsTrigger>
            <TabsTrigger value="analytics">วิเคราะห์</TabsTrigger>
            <TabsTrigger value="details">รายละเอียด</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  ตัวกรอง
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">ค้นหา</label>
                    <Input
                      placeholder="ค้นหา component..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">หมวดหมู่</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'ทั้งหมด' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">สถานะ</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="all">ทั้งหมด</option>
                      <option value="active">ใช้งาน</option>
                      <option value="new">ใหม่</option>
                      <option value="deprecated">เลิกใช้</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">ความซับซ้อน</label>
                    <select
                      value={complexityFilter}
                      onChange={(e) => setComplexityFilter(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="all">ทั้งหมด</option>
                      <option value="low">ต่ำ</option>
                      <option value="medium">กลาง</option>
                      <option value="high">สูง</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredComponents.map(component => {
                const IconComponent = component.icon;
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
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-sm">{component.name}</CardTitle>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {component.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                        <span className={`text-xs font-medium ${getStatusColor(component.status)}`}>
                          {component.status}
                        </span>
                        <span className={`text-xs ${getComplexityColor(component.complexity)}`}>
                          {component.complexity}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2">
                        {component.description}
                      </p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Deps: {component.dependencies.length}</span>
                        <span>{dependents.filter(d => d.dependencies.includes(component.id)).length} uses</span>
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
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{selectedComponent.type}</Badge>
                      <Badge variant="secondary">{selectedComponent.category}</Badge>
                      <Badge className={getStatusColor(selectedComponent.status)}>
                        {selectedComponent.status}
                      </Badge>
                      <Badge className={getComplexityColor(selectedComponent.complexity)}>
                        {selectedComponent.complexity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      📁 {selectedComponent.file}
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
                                <Badge variant="outline" className="text-xs ml-auto">
                                  {dep.type}
                                </Badge>
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
                              <Badge variant="outline" className="text-xs ml-auto">
                                {dependent.type}
                              </Badge>
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

          <TabsContent value="analytics" className="space-y-6">
            {/* Component Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">ประเภท Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['page', 'component', 'hook', 'utility', 'integration', 'ui'].map(type => {
                      const count = componentData.filter(c => c.type === type).length;
                      return (
                        <div key={type} className="flex justify-between">
                          <span className="text-sm capitalize">{type}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">สถานะ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['active', 'new', 'deprecated'].map(status => {
                      const count = componentData.filter(c => c.status === status).length;
                      return (
                        <div key={status} className="flex justify-between">
                          <span className="text-sm capitalize">{status}</span>
                          <Badge className={getStatusColor(status as ComponentNode['status'])}>{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">ความซับซ้อน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['low', 'medium', 'high'].map(complexity => {
                      const count = componentData.filter(c => c.complexity === complexity).length;
                      return (
                        <div key={complexity} className="flex justify-between">
                          <span className="text-sm capitalize">{complexity}</span>
                          <Badge className={getComplexityColor(complexity as ComponentNode['complexity'])}>{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">ไม่มี deps</span>
                      <Badge variant="secondary">
                        {componentData.filter(c => c.dependencies.length === 0).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">1-3 deps</span>
                      <Badge variant="secondary">
                        {componentData.filter(c => c.dependencies.length >= 1 && c.dependencies.length <= 3).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">4+ deps</span>
                      <Badge variant="destructive">
                        {componentData.filter(c => c.dependencies.length > 3).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Components */}
            <Card>
              <CardHeader>
                <CardTitle>Components ที่ถูกใช้บ่อย</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {componentData
                    .map(c => ({
                      ...c,
                      usageCount: componentData.filter(comp => comp.dependencies.includes(c.id)).length
                    }))
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .slice(0, 10)
                    .map(component => (
                      <div 
                        key={component.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedNode(component.id)}
                      >
                        <div className="flex items-center gap-2">
                          <component.icon className="h-4 w-4" />
                          <span className="font-medium">{component.name}</span>
                        </div>
                        <Badge variant="secondary">{component.usageCount} uses</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {component.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {component.dependencies.length} deps
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <span className={`text-xs ${getStatusColor(component.status)}`}>
                                  {component.status}
                                </span>
                                <span className={`text-xs ${getComplexityColor(component.complexity)}`}>
                                  {component.complexity}
                                </span>
                              </div>
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

        {/* Overall Statistics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>สถิติรวมระบบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{componentData.filter(c => c.type === 'page').length}</div>
                <div className="text-sm text-muted-foreground">Pages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{componentData.filter(c => c.type === 'component').length}</div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{componentData.filter(c => c.type === 'hook').length}</div>
                <div className="text-sm text-muted-foreground">Hooks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-agi-yellow">{componentData.filter(c => c.type === 'ui').length}</div>
                <div className="text-sm text-muted-foreground">UI Components</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">{componentData.filter(c => c.type === 'utility').length}</div>
                <div className="text-sm text-muted-foreground">Utilities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">{componentData.filter(c => c.type === 'integration').length}</div>
                <div className="text-sm text-muted-foreground">Integrations</div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {componentData.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {componentData.filter(c => c.status === 'new').length}
                  </div>
                  <div className="text-sm text-muted-foreground">New</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {componentData.filter(c => c.complexity === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Complexity</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">
                    {Math.round(componentData.reduce((acc, c) => acc + c.dependencies.length, 0) / componentData.length * 10) / 10}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Dependencies</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentFlowchart;
