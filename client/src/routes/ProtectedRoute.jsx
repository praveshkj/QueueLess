import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Loader } from '../components/common/Loader.jsx';
import { APP_ROUTES } from '../constants/routes.js';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen message="Authenticating..." />;
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to login while preserving target route
    return <Navigate to={APP_ROUTES.PUBLIC.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};
