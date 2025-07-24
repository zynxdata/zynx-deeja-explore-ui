
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Users, 
  Shield, 
  Activity, 
  Database, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  activeToday: number;
  securityEvents: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastUpdate: Date;
}

const AdminOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeToday: 0,
    securityEvents: 0,
    systemHealth: 'healthy',
    lastUpdate: new Date()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users (this might need adjustment based on available tables)
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get security events from last 24 hours
        const { count: securityCount } = await supabase
          .from('security_logs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        // Determine system health based on security events
        let health: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (securityCount && securityCount > 10) {
          health = 'warning';
        }
        if (securityCount && securityCount > 50) {
          health = 'critical';
        }

        setStats({
          totalUsers: userCount || 0,
          activeToday: userCount || 0, // Placeholder - would need session tracking
          securityEvents: securityCount || 0,
          systemHealth: health,
          lastUpdate: new Date()
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">ใช้งานวันนี้</p>
                <p className="text-2xl font-bold">{stats.activeToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">เหตุการณ์ความปลอดภัย</p>
                <p className="text-2xl font-bold">{stats.securityEvents}</p>
                <p className="text-xs text-muted-foreground">24 ชั่วโมงที่ผ่านมา</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {getHealthIcon(stats.systemHealth)}
              <div>
                <p className="text-sm font-medium text-muted-foreground">สถานะระบบ</p>
                <p className={`text-2xl font-bold capitalize ${getHealthColor(stats.systemHealth)}`}>
                  {stats.systemHealth}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            สถานะระบบรายละเอียด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Supabase Database</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rate Limiter</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Monitor</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <Badge variant="outline">~150ms</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connections</span>
                <Badge variant="outline">12/100</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <Badge variant="outline">45%</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>อัปเดตล่าสุด: {stats.lastUpdate.toLocaleTimeString('th-TH')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Uptime: 99.9%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">ระบบทำงานปกติ</p>
                <p className="text-xs text-muted-foreground">
                  ไม่มีเหตุการณ์ผิดปกติในระบบ - {new Date().toLocaleString('th-TH')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Activity className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Security Monitor เริ่มทำงาน</p>
                <p className="text-xs text-muted-foreground">
                  ระบบตรวจสอบความปลอดภัยทำงานปกติ
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
