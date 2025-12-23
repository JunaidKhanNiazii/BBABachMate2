import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function IndustryDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="p-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">Industry Dashboard</h1>
        <p className="text-blue-100">Manage your industry partnerships and collaborations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-blue-600 mb-2">Your Profile</h3>
          <p className="text-gray-600">Email: {currentUser?.email}</p>
          <p className="text-gray-600">Role: <span className="font-semibold">{currentUser?.role}</span></p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-600 mb-2">Quick Actions</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ View Available Positions</li>
            <li>✓ Post Job Openings</li>
            <li>✓ Manage Applications</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 md:col-span-2">
          <h3 className="text-xl font-bold text-purple-600 mb-4">Recent Activity</h3>
          <p className="text-gray-600">No recent activity. Start by posting a job opening!</p>
        </div>
      </div>
    </div>
  );
}

export default IndustryDashboard;
