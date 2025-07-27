import React from 'react';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { Card } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requireAdmin?: boolean;
  requireOwner?: boolean;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  requireAdmin = false,
  requireOwner = false,
  fallback
}) => {
  const { role, loading, isAdmin, isOwner, isAdminOrOwner } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <LoadingSpinner size="sm" text="กำลังตรวจสอบสิทธิ์..." />
        </Card>
      </div>
    );
  }

  // Check specific role requirements
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!role || !roles.includes(role)) {
      return fallback || (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">ไม่มีสิทธิ์เข้าถึง</h3>
            <p className="text-muted-foreground">
              คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ ต้องมีบทบาท: {roles.join(', ')}
            </p>
          </Card>
        </div>
      );
    }
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin && !isOwner) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">ต้องมีสิทธิ์ผู้ดูแลระบบ</h3>
          <p className="text-muted-foreground">
            หน้านี้สำหรับผู้ดูแลระบบเท่านั้น
          </p>
        </Card>
      </div>
    );
  }

  // Check owner requirement
  if (requireOwner && !isOwner) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">ต้องมีสิทธิ์เจ้าของระบบ</h3>
          <p className="text-muted-foreground">
            หน้านี้สำหรับเจ้าของระบบเท่านั้น
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;