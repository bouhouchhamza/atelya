import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAdminAuth } from './AdminAuthContext';

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-sm text-primary-600 dark:text-primary-400">Loading admin session...</div>;
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/admin/login" replace state={{ from }} />;
  }

  return <>{children}</>;
}

export function PublicAdminRoute({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAdminAuth();

  if (loading) {
    return <div className="p-6 text-sm text-primary-600 dark:text-primary-400">Loading admin session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
