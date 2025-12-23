import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function UniversityDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="p-8">
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">University Dashboard</h1>
        <p className="text-green-100">Manage student placements and industry partnerships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-600 mb-2">Your Profile</h3>
          <p className="text-gray-600">Email: {currentUser?.email}</p>
          <p className="text-gray-600">Role: <span className="font-semibold">{currentUser?.role}</span></p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-blue-600 mb-2">Quick Actions</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ View Job Postings</li>
            <li>✓ Manage Student Placements</li>
            <li>✓ Track Statistics</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 md:col-span-2">
          <h3 className="text-xl font-bold text-yellow-600 mb-4">Placement Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">0</p>
              <p className="text-gray-600">Placements</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">Applications</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-gray-600">Partners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UniversityDashboard;
