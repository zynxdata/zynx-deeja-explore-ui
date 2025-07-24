
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Copy, Eye, EyeOff, RefreshCw, Clock, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showToken, setShowToken] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);

  // Extract and parse token from URL
  const getTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('__lovable_token');
    return token;
  };

  // Decode JWT token to get expiry
  const parseTokenExpiry = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      return new Date(decoded.exp * 1000);
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  };

  const testConnections = async () => {
    console.log('🔧 DebugPanel: Running connection tests...');
    setIsRefreshing(true);
    
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

    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  // Auto-refresh setup
  useEffect(() => {
    testConnections();
    
    // Parse token expiry
    const token = getTokenFromUrl();
    if (token) {
      const expiry = parseTokenExpiry(token);
      setTokenExpiry(expiry);
    }

    if (!autoRefresh) return;

    const interval = setInterval(() => {
      testConnections();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusBadge = (status: 'testing' | 'success' | 'error') => {
    switch (status) {
      case 'testing':
        return <Badge variant="secondary" className="animate-pulse">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">✅ OK</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Error</Badge>;
    }
  };

  const copyToken = () => {
    const token = getTokenFromUrl();
    if (token) {
      navigator.clipboard.writeText(token);
      toast({
        title: "Token Copied",
        description: "Lovable token has been copied to clipboard",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const isTokenExpired = tokenExpiry && tokenExpiry < new Date();
  const timeUntilExpiry = tokenExpiry ? Math.max(0, tokenExpiry.getTime() - Date.now()) : 0;
  const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
  const minutesUntilExpiry = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <TooltipProvider>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              🔧 System Debug Panel
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>แสดงสถานะการเชื่อมต่อและข้อมูลระบบสำหรับการ debug</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                size="sm"
                variant={autoRefresh ? "default" : "outline"}
                className="text-xs"
              >
                {autoRefresh ? "Auto ON" : "Auto OFF"}
              </Button>
              <Button 
                onClick={testConnections} 
                size="sm" 
                variant="outline"
                disabled={isRefreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                Retest
              </Button>
            </div>
          </CardTitle>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last updated: {formatTime(lastUpdate)}
            {autoRefresh && <span className="text-green-600">(Auto-refresh: 5s)</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium">Authentication</p>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p><strong>Loading:</strong> กำลังโหลดข้อมูล auth</p>
                      <p><strong>User:</strong> ผู้ใช้ที่เข้าสู่ระบบ</p>
                      <p><strong>Session:</strong> session ที่ใช้งานอยู่</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-1">
                <p className="text-xs">
                  Loading: <Badge variant={loading ? "secondary" : "outline"}>{loading ? 'Yes' : 'No'}</Badge>
                </p>
                <p className="text-xs">
                  User: <Badge variant={user ? "default" : "secondary"}>{user ? user.email : 'None'}</Badge>
                </p>
                <p className="text-xs">
                  Session: <Badge variant={session ? "default" : "secondary"}>{session ? 'Active' : 'None'}</Badge>
                </p>
              </div>
            </div>

            {/* Connection Status */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium">Connections</p>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p><strong>Supabase:</strong> การเชื่อมต่อฐานข้อมูล</p>
                      <p><strong>Rate Limiter:</strong> ระบบจำกัดอัตราการเรียก API</p>
                      <p><strong>Security Monitor:</strong> ระบบตรวจสอบความปลอดภัย</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
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

          {/* Token Information */}
          {getTokenFromUrl() && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium">Lovable Token</p>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p><strong>Token:</strong> JWT token สำหรับ authentication กับ Lovable</p>
                      <p><strong>Expiry:</strong> เวลาหมดอายุของ token</p>
                      <p><strong>Status:</strong> สถานะปัจจุบันของ token</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs">Token:</span>
                  <div className="flex items-center gap-1">
                    <code className="text-xs bg-muted px-1 rounded font-mono">
                      {showToken 
                        ? getTokenFromUrl()?.substring(0, 50) + '...' 
                        : '••••••••••••••••••••••••••••••••••••••••••••••••••'
                      }
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={copyToken}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {tokenExpiry && (
                  <div className="text-xs space-y-1">
                    <p>
                      Status: <Badge variant={isTokenExpired ? "destructive" : "default"}>
                        {isTokenExpired ? 'Expired' : 'Valid'}
                      </Badge>
                    </p>
                    <p>Expires: {tokenExpiry.toLocaleString('th-TH')}</p>
                    {!isTokenExpired && (
                      <p className="text-muted-foreground">
                        Time remaining: {hoursUntilExpiry}h {minutesUntilExpiry}m
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Environment Info */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium">Environment</p>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs space-y-1">
                    <p><strong>URL:</strong> URL ปัจจุบันของแอป</p>
                    <p><strong>Origin:</strong> โดเมนหลักของแอป</p>
                    <p><strong>User Agent:</strong> ข้อมูล browser ของผู้ใช้</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-xs space-y-1">
              <p className="break-all">
                <span className="font-medium">URL:</span> {window.location.href}
              </p>
              <p>
                <span className="font-medium">Origin:</span> {window.location.origin}
              </p>
              <p className="break-all">
                <span className="font-medium">User Agent:</span> {navigator.userAgent.substring(0, 80)}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default DebugPanel;
