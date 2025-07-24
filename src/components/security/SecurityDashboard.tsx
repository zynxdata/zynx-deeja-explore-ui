
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeatureCard } from '@/components/ui/feature-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SecurityEventsList } from '@/components/security/SecurityEventsList';
import { useAsyncState } from '@/hooks/useAsyncState';
import { useSecurityEvents, SecurityEvent } from '@/hooks/useSecurityEvents';
import { supabase } from '@/integrations/supabase/client';
import { Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface SecurityLog {
  id: string;
  event_type: string;
  severity: string;
  details: any;
  ip_address?: string | null;
  user_agent?: string | null;
  user_id?: string | null;
  created_at: string;
}

const SecurityDashboard = () => {
  const { user } = useAuth();
  const { data: securitySummary, loading: summaryLoading, execute: fetchSummary } = useAsyncState<SecurityEvent[]>([]);
  const { data: recentLogs, loading: logsLoading, execute: fetchLogs } = useAsyncState<SecurityLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSecurityData = async () => {
    setRefreshing(true);
    
    try {
      // Get security summary
      await fetchSummary(async () => {
        const { data: summary, error } = await supabase
          .rpc('get_security_summary', { time_window: '1 hour' });

        if (error) throw error;
        return summary || [];
      });

      // Get recent logs
      await fetchLogs(async () => {
        const { data: logs, error } = await supabase
          .from('security_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        return logs as SecurityLog[];
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSecurityData();
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('security_logs_channel')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'security_logs' },
          (payload) => {
            fetchLogs(async () => {
              const { data: logs, error } = await supabase
                .from('security_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

              if (error) throw error;
              return logs as SecurityLog[];
            });
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">กรุณาเข้าสู่ระบบเพื่อดูแดชบอร์ดความปลอดภัย</p>
        </CardContent>
      </Card>
    );
  }

  const totalEvents = securitySummary?.reduce((sum, event) => sum + (event.count || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchSecurityData}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          รีเฟรช
        </Button>
      </div>

      {/* Security Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard
          title="Active Sessions"
          variant="compact"
        >
          <p className="text-2xl font-bold text-green-500">1</p>
          <p className="text-xs text-muted-foreground">Current user session</p>
        </FeatureCard>

        <FeatureCard
          title="Security Events"
          variant="compact"
        >
          <p className="text-2xl font-bold text-yellow-500">{totalEvents}</p>
          <p className="text-xs text-muted-foreground">Last hour</p>
        </FeatureCard>

        <FeatureCard
          title="Rate Limits"
          variant="compact"
        >
          <StatusBadge status="healthy" text="Active" />
          <p className="text-xs text-muted-foreground">Protection enabled</p>
        </FeatureCard>

        <FeatureCard
          title="Last Check"
          variant="compact"
        >
          <p className="text-2xl font-bold text-purple-500">
            {new Date().toLocaleTimeString('th-TH', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
          <p className="text-xs text-muted-foreground">Real-time monitoring</p>
        </FeatureCard>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">สรุปเหตุการณ์</TabsTrigger>
          <TabsTrigger value="logs">บันทึกรายละเอียด</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <SecurityEventsList
            events={securitySummary || []}
            loading={summaryLoading}
            title="Security Events Summary (Last Hour)"
            emptyMessage="ไม่มีเหตุการณ์ความปลอดภัย"
            showDetails={false}
          />
        </TabsContent>

        <TabsContent value="logs">
          <SecurityEventsList
            events={(recentLogs || []).map(log => ({
              event_type: log.event_type,
              severity: log.severity,
              details: log.details,
              ip_address: log.ip_address,
              user_agent: log.user_agent,
              created_at: log.created_at
            }))}
            loading={logsLoading}
            title="Recent Security Logs"
            emptyMessage="ไม่มีบันทึกความปลอดภัย"
            showDetails={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
