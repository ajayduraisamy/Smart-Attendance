
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or spinner

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && allowedRoles.length && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}