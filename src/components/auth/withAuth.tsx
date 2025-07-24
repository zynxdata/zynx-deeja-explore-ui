
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface WithAuthProps {
  redirectTo?: string;
  requiresAuth?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) {
  const { redirectTo = '/auth', requiresAuth = true } = options;

  return function AuthenticatedComponent(props: P) {
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
}
