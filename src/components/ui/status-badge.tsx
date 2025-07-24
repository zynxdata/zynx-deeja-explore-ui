
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, AlertTriangle, Shield, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'critical' | 'high' | 'medium' | 'low' | 'healthy' | 'warning' | 'active';
  text?: string;
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  critical: {
    variant: 'destructive' as const,
    icon: AlertTriangle,
    defaultText: 'Critical'
  },
  high: {
    variant: 'destructive' as const,
    icon: AlertTriangle,
    defaultText: 'High'
  },
  medium: {
    variant: 'default' as const,
    icon: Shield,
    defaultText: 'Medium'
  },
  low: {
    variant: 'secondary' as const,
    icon: Shield,
    defaultText: 'Low'
  },
  healthy: {
    variant: 'default' as const,
    icon: CheckCircle,
    defaultText: 'Healthy'
  },
  warning: {
    variant: 'default' as const,
    icon: AlertTriangle,
    defaultText: 'Warning'
  },
  active: {
    variant: 'default' as const,
    icon: Clock,
    defaultText: 'Active'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  showIcon = true,
  className
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn("flex items-center gap-1", className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {text || config.defaultText}
    </Badge>
  );
};
