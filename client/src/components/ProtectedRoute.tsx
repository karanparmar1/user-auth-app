import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { APP_ROUTES } from '../utils/constants';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    console.error('Not Authenticated!');
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  /* Future Scope: enable role-based access control */
  // if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="APP_ROUTES.HOME" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
