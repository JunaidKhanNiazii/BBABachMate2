import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = React.memo(({ children, allowedRoles }) => {
  const { currentUser, userProfile, loading, profileLoading } = useAuth(); // getting userProfile

  if (loading || profileLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--bg-primary)]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-[var(--bg-tertiary)] rounded-2xl"></div>
          <div className="absolute inset-0 border-4 border-t-[var(--accent-secondary)] rounded-2xl animate-spin"></div>
        </div>
        <p className="mt-8 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] animate-pulse">Verifying Security Protocols</p>
      </div>
    );
  }

  // Must be logged in (firebase) and have a profile (mongo)
  if (!currentUser || !userProfile) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-primary)] p-6">
        <div className="w-16 h-1 w-20 bg-red-600 rounded-full mb-8"></div>
        <h1 className="text-6xl font-black text-[var(--text-primary)] mb-4 tracking-tighter uppercase">ACCESS <span className="text-red-600">DENIED</span></h1>
        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-12 text-center">Your clearance level does not permit access to this sector.</p>
        <button
          onClick={() => window.history.back()}
          className="px-10 py-4 bg-[var(--accent-primary)] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[var(--accent-secondary)] transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          Retreat to Previous Node
        </button>
      </div>
    );
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;