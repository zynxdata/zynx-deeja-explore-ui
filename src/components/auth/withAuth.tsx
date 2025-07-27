
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export interface WithAuthOptions {
  redirectTo?: string;
  requiresAuth?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
): React.FC<P> {
  const { redirectTo = '/auth', requiresAuth = true } = options;

  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      );
    }

    if (requiresAuth && !user) {
      return <Navigate to={redirectTo} replace />;
    }

    if (!requiresAuth && user && redirectTo !== '/auth') {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}

export default withAuth;
