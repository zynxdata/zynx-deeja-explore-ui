
import { useState, useEffect } from 'react';
import { FeatureCard } from '@/components/ui/feature-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAsyncState } from '@/hooks/useAsyncState';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Users, Database, Shield, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  securityEvents: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

const AdminOverview = () => {
  const { user } = useAuth();
  const { data: stats, loading, execute } = useAsyncState<SystemStats>();

  const fetchSystemStats = async (): Promise<SystemStats> => {
    // Get user count from profiles table
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get recent security events
    const { count: securityCount } = await supabase
      .from('security_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Check for critical events
    const { count: criticalCount } = await supabase
      .from('security_logs')
      .select('*', { count: 'exact', head: true })
      .eq('severity', 'critical')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (criticalCount && criticalCount > 0) {
      systemHealth = 'critical';
    } else if (securityCount && securityCount > 10) {
      systemHealth = 'warning';
    }

    return {
      totalUsers: userCount || 0,
      activeUsers: 1, // Current user (simplified)
      securityEvents: securityCount || 0,
      systemHealth,
    };
  };

  useEffect(() => {
    if (user) {
      execute(fetchSystemStats);
    }
  }, [user, execute]);

  if (loading) {
    return <LoadingSpinner size="lg" text="กำลังโหลดข้อมูลระบบ..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard
          title="ผู้ใช้ทั้งหมด"
          icon={Users}
          variant="compact"
        >
          <p className="text-2xl font-bold text-primary">{stats?.totalUsers || 0}</p>
          <p className="text-xs text-muted-foreground">Registered users</p>
        </FeatureCard>

        <FeatureCard
          title="ผู้ใช้ที่ใช้งาน"
          icon={Activity}
          variant="compact"
        >
          <p className="text-2xl font-bold text-green-500">{stats?.activeUsers || 0}</p>
          <p className="text-xs text-muted-foreground">Currently online</p>
        </FeatureCard>

        <FeatureCard
          title="เหตุการณ์ความปลอดภัย"
          icon={Shield}
          variant="compact"
        >
          <p className="text-2xl font-bold text-yellow-500">{stats?.securityEvents || 0}</p>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </FeatureCard>

        <FeatureCard
          title="สถานะระบบ"
          icon={TrendingUp}
          variant="compact"
        >
          <StatusBadge 
            status={stats?.systemHealth || 'healthy'} 
            showIcon={true}
          />
          <p className="text-xs text-muted-foreground">System status</p>
        </FeatureCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureCard
          title="ฟีเจอร์หลัก"
          icon={Database}
          description="สถานะของฟีเจอร์ต่างๆ ในระบบ"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Emotional Context Chatbot</span>
              <StatusBadge status="healthy" text="Active" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Context Translator</span>
              <StatusBadge status="healthy" text="Active" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Spreadsheet</span>
              <StatusBadge status="warning" text="Beta" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Live Presentation</span>
              <StatusBadge status="warning" text="Development" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">PDF Processing</span>
              <StatusBadge status="warning" text="Planning" />
            </div>
          </div>
        </FeatureCard>

        <FeatureCard
          title="การติดตามระบบ"
          icon={AlertTriangle}
          description="เครื่องมือติดตามและจัดการระบบ"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Rate Limiting</span>
              <StatusBadge status="healthy" text="Enabled" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Security Monitoring</span>
              <StatusBadge status="healthy" text="Active" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Real-time Analytics</span>
              <StatusBadge status="healthy" text="Running" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Tracking</span>
              <StatusBadge status="healthy" text="Monitoring" />
            </div>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
};

export default AdminOverview;
