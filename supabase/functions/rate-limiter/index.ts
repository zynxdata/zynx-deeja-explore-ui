
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitRequest {
  identifier: string;
  action: string;
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

serve(async (req) => {
  console.log(`🔧 Rate Limiter: ${req.method} request received`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔧 Rate Limiter: Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('🔧 Rate Limiter: Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing'
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('🚨 Rate Limiter: Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Configuration error: Missing environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestBody = await req.json();
    console.log('🔧 Rate Limiter: Request body:', requestBody);
    
    const { identifier, action, maxRequests, timeWindow }: RateLimitRequest = requestBody;

    if (!identifier || !action) {
      console.error('🚨 Rate Limiter: Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: identifier and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() - timeWindow);
    const rateLimitKey = `${identifier}:${action}`;

    console.log('🔧 Rate Limiter: Processing rate limit check:', {
      key: rateLimitKey,
      maxRequests,
      timeWindow,
      windowStart: windowStart.toISOString()
    });

    // Check existing rate limit records
    const { data: existing, error: selectError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('identifier', rateLimitKey)
      .gte('created_at', windowStart.toISOString());

    if (selectError) {
      console.error('🚨 Rate Limiter: Database select error:', selectError);
      return new Response(
        JSON.stringify({ error: 'Database error during rate limit check' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentCount = existing?.length || 0;
    console.log('🔧 Rate Limiter: Current count:', currentCount);

    if (currentCount >= maxRequests) {
      console.log(`🚨 Rate Limiter: Rate limit exceeded for ${rateLimitKey}: ${currentCount}/${maxRequests}`);
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          count: currentCount, 
          limit: maxRequests,
          resetTime: windowStart.getTime() + timeWindow
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log this request
    const { error: insertError } = await supabase
      .from('rate_limits')
      .insert({
        identifier: rateLimitKey,
        user_agent: req.headers.get('user-agent') || '',
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown',
        created_at: now.toISOString()
      });

    if (insertError) {
      console.error('🚨 Rate Limiter: Insert error:', insertError);
      // Don't fail the request for logging errors, just log and continue
    }

    // Clean up old records (optional optimization)
    try {
      await supabase
        .from('rate_limits')
        .delete()
        .lt('created_at', new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString());
    } catch (cleanupError) {
      console.error('🚨 Rate Limiter: Cleanup error (non-critical):', cleanupError);
    }

    const response = { 
      allowed: true, 
      count: currentCount + 1, 
      limit: maxRequests 
    };
    
    console.log('✅ Rate Limiter: Success response:', response);
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('🚨 Rate Limiter: Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
