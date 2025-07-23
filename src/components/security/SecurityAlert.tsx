
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityAlertProps {
  onDismiss?: () => void;
}

const SecurityAlert = ({ onDismiss }: SecurityAlertProps) => {
  const [criticalEvents, setCriticalEvents] = useState<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkCriticalEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('security_logs')
          .select('id')
          .eq('severity', 'critical')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        if (!error && data && data.length > 0) {
          setCriticalEvents(data.length);
          setVisible(true);
        }
      } catch (error) {
        console.error('Error checking critical events:', error);
      }
    };

    checkCriticalEvents();

    // Subscribe to new critical events
    const subscription = supabase
      .channel('critical_security_events')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'security_logs',
          filter: 'severity=eq.critical'
        },
        () => {
          setCriticalEvents(prev => prev + 1);
          setVisible(true);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible || criticalEvents === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span>
          ตรวจพบเหตุการณ์ความปลอดภัยสำคัญ {criticalEvents} รายการในระบบ
        </span>
        <Button variant="ghost" size="sm" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default SecurityAlert;
