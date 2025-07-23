
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityHealth {
  rateLimitActive: boolean;
  securityMonitorActive: boolean;
  lastHealthCheck: Date;
  criticalEventsCount: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
}

export const useSecurityHealthCheck = () => {
  const [health, setHealth] = useState<SecurityHealth>({
    rateLimitActive: false,
    securityMonitorActive: false,
    lastHealthCheck: new Date(),
    criticalEventsCount: 0,
    systemStatus: 'healthy'
  });

  const [loading, setLoading] = useState(true);

  const performHealthCheck = async () => {
    try {
      setLoading(true);

      // Check if rate limiting is working
      const rateLimitTest = await supabase.functions.invoke('rate-limiter', {
        body: {
          identifier: 'health-check',
          action: 'test',
          maxRequests: 1000,
          timeWindow: 60000
        }
      });

      // Check if security monitoring is working
      const securityTest = await supabase.functions.invoke('security-monitor', {
        body: {
          event_type: 'api_abuse',
          severity: 'low',
          details: { test: 'health-check' }
        }
      });

      // Check for critical events in last 24 hours
      const { data: criticalEvents } = await supabase
        .from('security_logs')
        .select('id')
        .eq('severity', 'critical')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const criticalCount = criticalEvents?.length || 0;
      
      let systemStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (criticalCount > 0) {
        systemStatus = 'critical';
      } else if (!rateLimitTest.data || !securityTest.data) {
        systemStatus = 'warning';
      }

      setHealth({
        rateLimitActive: !rateLimitTest.error,
        securityMonitorActive: !securityTest.error,
        lastHealthCheck: new Date(),
        criticalEventsCount: criticalCount,
        systemStatus
      });

    } catch (error) {
      console.error('Security health check failed:', error);
      setHealth(prev => ({
        ...prev,
        systemStatus: 'warning',
        lastHealthCheck: new Date()
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performHealthCheck();
    
    // Run health check every 5 minutes
    const interval = setInterval(performHealthCheck, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { health, loading, performHealthCheck };
};
