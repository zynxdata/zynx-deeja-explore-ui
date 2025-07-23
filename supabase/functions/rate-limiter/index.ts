
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { identifier, action, maxRequests, timeWindow }: RateLimitRequest = await req.json();

    if (!identifier || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() - timeWindow);
    const rateLimitKey = `${identifier}:${action}`;

    // Check existing rate limit records
    const { data: existing, error: selectError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('identifier', rateLimitKey)
      .gte('created_at', windowStart.toISOString());

    if (selectError) {
      console.error('Rate limit check error:', selectError);
      return new Response(
        JSON.stringify({ error: 'Rate limit check failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentCount = existing?.length || 0;

    if (currentCount >= maxRequests) {
      console.log(`Rate limit exceeded for ${rateLimitKey}: ${currentCount}/${maxRequests}`);
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
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        created_at: now.toISOString()
      });

    if (insertError) {
      console.error('Rate limit logging error:', insertError);
    }

    // Clean up old records (optional optimization)
    await supabase
      .from('rate_limits')
      .delete()
      .lt('created_at', new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString());

    return new Response(
      JSON.stringify({ 
        allowed: true, 
        count: currentCount + 1, 
        limit: maxRequests 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Rate limiter error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
