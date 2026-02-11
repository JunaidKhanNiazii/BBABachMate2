import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DashboardRedirect() {
  const { userProfile, loading, profileLoading } = useAuth();

  if (loading || profileLoading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/5 rounded-xl"></div>
        <div className="absolute inset-0 border-4 border-t-white rounded-xl animate-spin"></div>
      </div>
      <p className="mt-6 text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] animate-pulse">Authenticating Identity</p>
    </div>
  );

  if (!userProfile || !userProfile.role) {
    return <Navigate to="/login" />;
  }

  // Redirect based on role
  switch (userProfile.role) {
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