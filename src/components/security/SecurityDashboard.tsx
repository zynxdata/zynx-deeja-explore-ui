
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Activity, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface SecurityEvent {
  event_type: string;
  severity: string;
  count: number;
  latest_event: string;
}

interface SecurityLog {
  id: string;
  event_type: string;
  severity: string;
  details: any; // Changed from Record<string, any> to any to match Supabase Json type
  ip_address?: string | null;
  user_agent?: string | null;
  user_id?: string | null;
  created_at: string;
}

const SecurityDashboard = () => {
  const { user } = useAuth();
  const [securitySummary, setSecuritySummary] = useState<SecurityEvent[]>([]);
  const [recentLogs, setRecentLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSecurityData = async () => {
    try {
      setRefreshing(true);

      // Get security summary via database function
      const { data: summary, error: summaryError } = await supabase
        .rpc('get_security_summary', { time_window: '1 hour' });

      if (summaryError) {
        console.error('Error fetching security summary:', summaryError);
      } else {
        setSecuritySummary(summary || []);
      }

      // Get recent security logs (last 50 events)
      const { data: logs, error: logsError } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) {
        console.error('Error fetching security logs:', logsError);
      } else {
        // Cast the data to our SecurityLog type
        setRecentLogs((logs || []) as SecurityLog[]);
      }
    } catch (error) {
      console.error('Security dashboard error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSecurityData();
      
      // Set up real-time subscription for security logs
      const subscription = supabase
        .channel('security_logs_channel')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'security_logs' },
          (payload) => {
            setRecentLogs(prev => [payload.new as SecurityLog, ...prev.slice(0, 49)]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': 
      case 'high': 
        return <AlertTriangle className="h-4 w-4" />;
      default: 
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Active Sessions</span>
            </div>
            <p className="text-2xl font-bold text-green-500">1</p>
            <p className="text-xs text-muted-foreground">Current user session</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Security Events</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">
              {securitySummary.reduce((sum, event) => sum + event.count, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Rate Limits</span>
            </div>
            <p className="text-2xl font-bold text-blue-500">Active</p>
            <p className="text-xs text-muted-foreground">Protection enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Last Check</span>
            </div>
            <p className="text-2xl font-bold text-purple-500">
              {new Date().toLocaleTimeString('th-TH', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
            <p className="text-xs text-muted-foreground">Real-time monitoring</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">สรุปเหตุการณ์</TabsTrigger>
          <TabsTrigger value="logs">บันทึกรายละเอียด</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Security Events Summary (Last Hour)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : securitySummary.length === 0 ? (
                <div className="text-center p-8">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-green-600">ไม่มีเหตุการณ์ความปลอดภัย</p>
                  <p className="text-muted-foreground">ระบบทำงานปกติในช่วงชั่วโมงที่ผ่านมา</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {securitySummary.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(event.severity)}
                        <div>
                          <p className="font-medium">{formatEventType(event.event_type)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.latest_event).toLocaleString('th-TH')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(event.severity) as any}>
                          {event.severity}
                        </Badge>
                        <Badge variant="outline">
                          {event.count} events
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : recentLogs.length === 0 ? (
                <div className="text-center p-8">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-green-600">ไม่มีบันทึกความปลอดภัย</p>
                  <p className="text-muted-foreground">ไม่มีเหตุการณ์ที่ต้องติดตาม</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(log.severity)}
                          <span className="font-medium">{formatEventType(log.event_type)}</span>
                          <Badge variant={getSeverityColor(log.severity) as any} className="text-xs">
                            {log.severity}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString('th-TH')}
                        </span>
                      </div>
                      
                      {log.details && typeof log.details === 'object' && Object.keys(log.details).length > 0 && (
                        <div className="text-sm">
                          <p className="text-muted-foreground mb-1">รายละเอียด:</p>
                          <div className="bg-muted p-2 rounded text-xs font-mono">
                            {JSON.stringify(log.details, null, 2)}
                          </div>
                        </div>
                      )}
                      
                      {(log.ip_address || log.user_agent) && (
                        <div className="text-xs text-muted-foreground">
                          {log.ip_address && <p>IP: {log.ip_address}</p>}
                          {log.user_agent && <p>User Agent: {log.user_agent.substring(0, 100)}...</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;
