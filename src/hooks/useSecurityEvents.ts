
import { useMemo } from 'react';

export interface SecurityEvent {
  event_type: string;
  severity: string;
  count?: number;
  latest_event?: string;
  details?: any;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
}

export const useSecurityEvents = () => {
  const formatEventType = useMemo(() => (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  const getSeverityColor = useMemo(() => (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  }, []);

  const getSeverityVariant = useMemo(() => (severity: string) => {
    switch (severity) {
      case 'critical': 
      case 'high': 
        return 'destructive' as const;
      case 'medium':
        return 'default' as const;
      case 'low':
      default:
        return 'secondary' as const;
    }
  }, []);

  const formatTimestamp = useMemo(() => (timestamp: string) => {
    return new Date(timestamp).toLocaleString('th-TH');
  }, []);

  const groupEventsByType = useMemo(() => (events: SecurityEvent[]) => {
    return events.reduce((acc, event) => {
      const type = event.event_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(event);
      return acc;
    }, {} as Record<string, SecurityEvent[]>);
  }, []);

  return {
    formatEventType,
    getSeverityColor,
    getSeverityVariant,
    formatTimestamp,
    groupEventsByType,
  };
};
