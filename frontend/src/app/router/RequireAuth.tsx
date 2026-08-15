import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@shared/lib/storeHooks';
import { selectIsAuthenticated } from '@features/auth/model/selectors';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
