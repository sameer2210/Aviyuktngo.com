import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/useAdminAuth';
import { RouteLoadingState } from '../Components/LoadingStates';

export default function ProtectedAdminRoute({ children }) {
  const { isAdminLoggedIn, loading } = useAdminAuth();

  if (loading) {
    return <RouteLoadingState label="Checking admin access" />;
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
