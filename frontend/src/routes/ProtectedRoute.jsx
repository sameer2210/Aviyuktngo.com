import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { RouteLoadingState } from '../Components/LoadingStates';

const ProtectedRoute = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <RouteLoadingState label="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;


