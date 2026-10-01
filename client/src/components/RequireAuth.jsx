import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../store/authContext';

export default function RequireAuth({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="p-8 text-center text-muted">Checking your session...</p>;
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <p className="p-8 text-center text-accent-700">You do not have permission to view this page.</p>;
  }

  return <Outlet />;
}