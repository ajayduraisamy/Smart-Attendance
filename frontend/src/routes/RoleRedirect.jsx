import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/roles';

export default function RoleRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === ROLES.ADMIN) return <Navigate to="/app/admin" replace />;
  if (user.role === ROLES.HR) return <Navigate to="/app/hr" replace />;
  return <Navigate to="/app/employee" replace />;
}
