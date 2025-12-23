import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function AdminDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="p-8">
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-8 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">Manage the entire platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-600 mb-2">Universities</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-lg font-bold text-yellow-600 mb-2">Industries</h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-xl font-bold text-purple-600 mb-2">Admin Profile</h3>
          <p className="text-gray-600">Email: {currentUser?.email}</p>
          <p className="text-gray-600">Role: <span className="font-semibold">{currentUser?.role}</span></p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-xl font-bold text-red-600 mb-2">Admin Actions</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Manage All Users</li>
            <li>✓ View System Reports</li>
            <li>✓ Configure Settings</li>
            <li>✓ Monitor Activity</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
