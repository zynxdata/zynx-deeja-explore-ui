
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
  console.log(`🔧 Security Monitor: ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔧 Security Monitor: Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('🔧 Security Monitor: Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing'
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('🚨 Security Monitor: Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Configuration error: Missing environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestBody = await req.json();
    console.log('🔧 Security Monitor: Request body:', requestBody);
    
    const securityEvent: SecurityEvent = requestBody;

    if (!securityEvent.event_type || !securityEvent.severity) {
      console.error('🚨 Security Monitor: Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: event_type and severity are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log security event
    const eventData = {
      event_type: securityEvent.event_type,
      user_id: securityEvent.user_id,
      details: securityEvent.details || {},
      severity: securityEvent.severity,
      ip_address: securityEvent.ip_address || req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown',
      user_agent: securityEvent.user_agent || req.headers.get('user-agent') || '',
      created_at: new Date().toISOString()
    };

    console.log('🔧 Security Monitor: Logging event:', eventData);

    const { error: logError } = await supabase
      .from('security_logs')
      .insert(eventData);

    if (logError) {
      console.error('🚨 Security Monitor: Database insert error:', logError);
      return new Response(
        JSON.stringify({ error: 'Failed to log security event', details: logError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for critical events that need immediate attention
    if (securityEvent.severity === 'critical') {
      console.error('🚨 CRITICAL SECURITY EVENT:', securityEvent);
      
      // In production, you would send alerts here (email, Slack, etc.)
      // For now, we'll just log it prominently
    }

    // Check for patterns that might indicate an attack
    if (securityEvent.event_type === 'failed_auth' && securityEvent.ip_address) {
      try {
        const { data: recentFailures } = await supabase
          .from('security_logs')
          .select('id')
          .eq('event_type', 'failed_auth')
          .eq('ip_address', securityEvent.ip_address)
          .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

        if (recentFailures && recentFailures.length > 5) {
          console.log('🚨 Security Monitor: Potential brute force attack detected');
          // Potential brute force attack
          await supabase
            .from('security_logs')
            .insert({
              event_type: 'suspicious_activity',
              details: { 
                reason: 'Multiple failed auth attempts',
                failure_count: recentFailures.length,
                ip_address: securityEvent.ip_address 
              },
              severity: 'high',
              ip_address: securityEvent.ip_address,
              created_at: new Date().toISOString()
            });
        }
      } catch (patternError) {
        console.error('🚨 Security Monitor: Pattern detection error (non-critical):', patternError);
      }
    }

    const response = { success: true, logged: true };
    console.log('✅ Security Monitor: Success response:', response);
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('🚨 Security Monitor: Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
