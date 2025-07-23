
-- Create rate_limits table for server-side rate limiting
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_rate_limits_identifier_created ON public.rate_limits(identifier, created_at);
CREATE INDEX idx_rate_limits_created_at ON public.rate_limits(created_at);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access (edge functions)
CREATE POLICY "Service role can manage rate limits" 
  ON public.rate_limits 
  FOR ALL 
  USING (true);

-- Create security_logs table for security event monitoring
CREATE TABLE public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('failed_auth', 'suspicious_activity', 'api_abuse', 'invalid_input', 'rate_limit_exceeded')),
  user_id UUID,
  details JSONB,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for security logs
CREATE INDEX idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX idx_security_logs_severity ON public.security_logs(severity);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at);
CREATE INDEX idx_security_logs_user_id ON public.security_logs(user_id);

-- Enable RLS for security logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage security logs" 
  ON public.security_logs 
  FOR ALL 
  USING (true);

-- Create function to clean up old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Create function to get security events summary
CREATE OR REPLACE FUNCTION get_security_summary(time_window INTERVAL DEFAULT INTERVAL '1 hour')
RETURNS TABLE (
  event_type TEXT,
  severity TEXT,
  count BIGINT,
  latest_event TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.event_type,
    sl.severity,
    COUNT(*) as count,
    MAX(sl.created_at) as latest_event
  FROM public.security_logs sl
  WHERE sl.created_at >= NOW() - time_window
  GROUP BY sl.event_type, sl.severity
  ORDER BY count DESC;
END;
$$;
