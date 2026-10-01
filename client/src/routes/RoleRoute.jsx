import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Loader } from '../components/common/Loader.jsx';
import { APP_ROUTES } from '../constants/routes.js';

export const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen message="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.PUBLIC.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={APP_ROUTES.PUBLIC.UNAUTHORIZED} replace />;
  }

  return children;
};
