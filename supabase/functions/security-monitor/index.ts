
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SecurityEvent {
  event_type: 'failed_auth' | 'suspicious_activity' | 'api_abuse' | 'invalid_input' | 'rate_limit_exceeded';
  user_id?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address?: string;
  user_agent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const securityEvent: SecurityEvent = await req.json();

    if (!securityEvent.event_type || !securityEvent.severity) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log security event
    const { error: logError } = await supabase
      .from('security_logs')
      .insert({
        event_type: securityEvent.event_type,
        user_id: securityEvent.user_id,
        details: securityEvent.details,
        severity: securityEvent.severity,
        ip_address: securityEvent.ip_address || req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: securityEvent.user_agent || req.headers.get('user-agent') || '',
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Security logging error:', logError);
      return new Response(
        JSON.stringify({ error: 'Failed to log security event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for critical events that need immediate attention
    if (securityEvent.severity === 'critical') {
      console.error('CRITICAL SECURITY EVENT:', securityEvent);
      
      // In production, you would send alerts here (email, Slack, etc.)
      // For now, we'll just log it prominently
    }

    // Check for patterns that might indicate an attack
    if (securityEvent.event_type === 'failed_auth') {
      const recentFailures = await supabase
        .from('security_logs')
        .select('count')
        .eq('event_type', 'failed_auth')
        .eq('ip_address', securityEvent.ip_address)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

      if (recentFailures.data && recentFailures.data.length > 5) {
        // Potential brute force attack
        await supabase
          .from('security_logs')
          .insert({
            event_type: 'suspicious_activity',
            details: { 
              reason: 'Multiple failed auth attempts',
              failure_count: recentFailures.data.length,
              ip_address: securityEvent.ip_address 
            },
            severity: 'high',
            ip_address: securityEvent.ip_address,
            created_at: new Date().toISOString()
          });
      }
    }

    return new Response(
      JSON.stringify({ success: true, logged: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Security monitor error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
