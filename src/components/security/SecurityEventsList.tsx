
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSecurityEvents, SecurityEvent } from '@/hooks/useSecurityEvents';
import { Shield } from 'lucide-react';

interface SecurityEventsListProps {
  events: SecurityEvent[];
  loading?: boolean;
  title?: string;
  emptyMessage?: string;
  showDetails?: boolean;
}

export const SecurityEventsList: React.FC<SecurityEventsListProps> = ({
  events,
  loading = false,
  title = "Security Events",
  emptyMessage = "ไม่มีเหตุการณ์ความปลอดภัย",
  showDetails = false
}) => {
  const { formatEventType, getSeverityVariant, formatTimestamp } = useSecurityEvents();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <LoadingSpinner size="lg" text="กำลังโหลดข้อมูล..." />
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-green-600">{emptyMessage}</p>
          <p className="text-muted-foreground">ระบบทำงานปกติ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatEventType(event.event_type)}</span>
                  <StatusBadge 
                    status={event.severity as any} 
                    text={event.severity}
                    showIcon={true}
                  />
                  {event.count && (
                    <StatusBadge 
                      status="active" 
                      text={`${event.count} events`}
                      showIcon={false}
                    />
                  )}
                </div>
                {event.created_at && (
                  <span className="text-sm text-muted-foreground">
                    {formatTimestamp(event.created_at)}
                  </span>
                )}
              </div>
              
              {showDetails && event.details && typeof event.details === 'object' && Object.keys(event.details).length > 0 && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">รายละเอียด:</p>
                  <div className="bg-muted p-2 rounded text-xs font-mono">
                    {JSON.stringify(event.details, null, 2)}
                  </div>
                </div>
              )}
              
              {showDetails && (event.ip_address || event.user_agent) && (
                <div className="text-xs text-muted-foreground">
                  {event.ip_address && <p>IP: {event.ip_address}</p>}
                  {event.user_agent && <p>User Agent: {event.user_agent.substring(0, 100)}...</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
