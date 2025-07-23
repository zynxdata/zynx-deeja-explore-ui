
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RateLimitResponse {
  allowed: boolean;
  count: number;
  limit: number;
  resetTime?: number;
}

export const useServerRateLimit = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkRateLimit = async (
    identifier: string,
    action: string,
    maxRequests: number = 10,
    timeWindow: number = 60000 // 1 minute default
  ): Promise<RateLimitResponse> => {
    setIsChecking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('rate-limiter', {
        body: {
          identifier,
          action,
          maxRequests,
          timeWindow
        }
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        // Default to allowing if service is unavailable
        return { allowed: true, count: 0, limit: maxRequests };
      }

      return data as RateLimitResponse;
    } catch (error) {
      console.error('Rate limit error:', error);
      // Default to allowing if service is unavailable
      return { allowed: true, count: 0, limit: maxRequests };
    } finally {
      setIsChecking(false);
    }
  };

  return { checkRateLimit, isChecking };
};
