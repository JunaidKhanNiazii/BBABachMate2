import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold mb-6">This is Home Page</h2>
      <p className="text-lg mb-4">
        Welcome to our Role-Based Access Control System
      </p>
      {currentUser ? (
        <div className="mt-8 p-6 bg-green-50 rounded-lg max-w-md mx-auto">
          <p className="text-green-700 font-semibold">
            You are logged in as: {currentUser.email}
          </p>
          <p className="text-green-600">
            Role: <span className="font-bold">{currentUser.role}</span>
          </p>
        </div>
      ) : (
        <p className="text-gray-600">Please login or register to access dashboard</p>
      )}
    </div>
  );
}

export default Home;