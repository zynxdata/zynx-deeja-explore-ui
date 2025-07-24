
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'highlighted';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  variant = 'default'
}) => {
  const cardVariants = {
    default: '',
    compact: 'p-4',
    highlighted: 'border-primary/20 bg-primary/5'
  };

  return (
    <Card className={cn(cardVariants[variant], className)}>
      <CardHeader className={variant === 'compact' ? 'p-0 pb-2' : undefined}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          <CardTitle className={variant === 'compact' ? 'text-base' : undefined}>
            {title}
          </CardTitle>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      {children && (
        <CardContent className={variant === 'compact' ? 'p-0' : 'pt-0'}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};
