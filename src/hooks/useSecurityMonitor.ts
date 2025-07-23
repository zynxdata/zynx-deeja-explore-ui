
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

type SecurityEventType = 'failed_auth' | 'suspicious_activity' | 'api_abuse' | 'invalid_input' | 'rate_limit_exceeded';
type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityEventDetails {
  event_type: SecurityEventType;
  details: Record<string, any>;
  severity: SecuritySeverity;
  ip_address?: string;
  user_agent?: string;
}

export const useSecurityMonitor = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (eventDetails: SecurityEventDetails) => {
    try {
      const { error } = await supabase.functions.invoke('security-monitor', {
        body: {
          ...eventDetails,
          user_id: user?.id,
          ip_address: eventDetails.ip_address || undefined,
          user_agent: eventDetails.user_agent || navigator.userAgent
        }
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security monitoring error:', error);
    }
  };

  const logFailedAuth = (details: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'failed_auth',
      details,
      severity: 'medium'
    });
  };

  const logSuspiciousActivity = (details: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'suspicious_activity',
      details,
      severity: 'high'
    });
  };

  const logApiAbuse = (details: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'api_abuse',
      details,
      severity: 'high'
    });
  };

  const logInvalidInput = (details: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'invalid_input',
      details,
      severity: 'low'
    });
  };

  const logRateLimitExceeded = (details: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'rate_limit_exceeded',
      details,
      severity: 'medium'
    });
  };

  return {
    logSecurityEvent,
    logFailedAuth,
    logSuspiciousActivity,
    logApiAbuse,
    logInvalidInput,
    logRateLimitExceeded
  };
};
