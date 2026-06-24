import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/useAdminAuth';

export default function ProtectedAdminRoute({ children }) {
  const { isAdminLoggedIn, loading } = useAdminAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
