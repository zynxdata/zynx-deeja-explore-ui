
import RoleGuard from '@/components/auth/RoleGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Settings, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import DebugPanel from '@/components/debug/DebugPanel';
import AdminOverview from '@/components/admin/AdminOverview';

const AdminDashboard = () => {
  
  return (
    <RoleGuard requireAdmin>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">ระบบจัดการและตรวจสอบสถานะแพลตฟอร์ม</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              ภาพรวม
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              ความปลอดภัย
            </TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Debug System
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              ระบบ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="debug">
            <DebugPanel />
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">การตั้งค่าระบบ</h3>
                <p className="text-muted-foreground">
                  ฟีเจอร์การจัดการระบบจะเพิ่มในเวอร์ชันถัดไป
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
};

export default AdminDashboard;
