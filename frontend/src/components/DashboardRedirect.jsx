import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DashboardRedirect() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Redirect based on role
  switch (currentUser.role) {
    case 'industry':
      return <Navigate to="/dashboard/industry" />;
    case 'university':
      return <Navigate to="/dashboard/university" />;
    case 'admin':
      return <Navigate to="/dashboard/admin" />;
    default:
      return <Navigate to="/" />;
  }
}

export default DashboardRedirect;