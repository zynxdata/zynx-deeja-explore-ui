
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

const DebugPanel = () => {
  const { user, session, loading } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<{
    supabase: 'testing' | 'success' | 'error';
    rateLimiter: 'testing' | 'success' | 'error';
    securityMonitor: 'testing' | 'success' | 'error';
  }>({
    supabase: 'testing',
    rateLimiter: 'testing',
    securityMonitor: 'testing'
  });

  const testConnections = async () => {
    console.log('🔧 DebugPanel: Running connection tests...');
    
    // Reset status
    setConnectionStatus({
      supabase: 'testing',
      rateLimiter: 'testing',
      securityMonitor: 'testing'
    });

    // Test Supabase
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      setConnectionStatus(prev => ({
        ...prev,
        supabase: error ? 'error' : 'success'
      }));
    } catch (error) {
      console.error('🚨 DebugPanel: Supabase test failed:', error);
      setConnectionStatus(prev => ({ ...prev, supabase: 'error' }));
    }

    // Test Rate Limiter
    try {
      const { error } = await supabase.functions.invoke('rate-limiter', {
        body: {
          identifier: 'debug-test',
          action: 'test',
          maxRequests: 10,
          timeWindow: 60000
        }
      });
      setConnectionStatus(prev => ({
        ...prev,
        rateLimiter: error ? 'error' : 'success'
      }));
    } catch (error) {
      console.error('🚨 DebugPanel: Rate limiter test failed:', error);
      setConnectionStatus(prev => ({ ...prev, rateLimiter: 'error' }));
    }

    // Test Security Monitor
    try {
      const { error } = await supabase.functions.invoke('security-monitor', {
        body: {
          event_type: 'api_abuse',
          severity: 'low',
          details: { test: 'debug-panel' }
        }
      });
      setConnectionStatus(prev => ({
        ...prev,
        securityMonitor: error ? 'error' : 'success'
      }));
    } catch (error) {
      console.error('🚨 DebugPanel: Security monitor test failed:', error);
      setConnectionStatus(prev => ({ ...prev, securityMonitor: 'error' }));
    }
  };

  useEffect(() => {
    testConnections();
  }, []);

  const getStatusBadge = (status: 'testing' | 'success' | 'error') => {
    switch (status) {
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">✅ OK</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Error</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🔧 System Debug Panel
          <Button onClick={testConnections} size="sm" variant="outline">
            Retest
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auth Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Authentication</p>
            <div className="space-y-1">
              <p className="text-xs">Loading: {loading ? 'Yes' : 'No'}</p>
              <p className="text-xs">User: {user ? user.email : 'None'}</p>
              <p className="text-xs">Session: {session ? 'Active' : 'None'}</p>
            </div>
          </div>

          {/* Connection Status */}
          <div>
            <p className="text-sm font-medium">Connections</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs">Supabase:</span>
                {getStatusBadge(connectionStatus.supabase)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">Rate Limiter:</span>
                {getStatusBadge(connectionStatus.rateLimiter)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">Security Monitor:</span>
                {getStatusBadge(connectionStatus.securityMonitor)}
              </div>
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div>
          <p className="text-sm font-medium">Environment</p>
          <div className="text-xs space-y-1">
            <p>URL: {window.location.href}</p>
            <p>Origin: {window.location.origin}</p>
            <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
