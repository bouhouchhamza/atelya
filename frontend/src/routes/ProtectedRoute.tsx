import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';

export function ProtectedAdminRoute() {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-sm text-zinc-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function PublicAdminOnlyRoute() {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  if (loading) {
    return <div className="p-6 text-sm text-zinc-500">Loading...</div>;
  }
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}
