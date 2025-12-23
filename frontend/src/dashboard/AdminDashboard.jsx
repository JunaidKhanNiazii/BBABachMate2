import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p>Welcome, {currentUser.email}</p>
          <p className="text-purple-200">Manage Users and Platform Settings</p>
        </div>
      
      <div className="flex-grow bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="bg-gradient-to-r from-purple-500 to-purple-800 text-white p-6 rounded-lg mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p>Welcome, {currentUser.email}</p>
            <p className="text-purple-200">Role: System Administrator (Full Control)</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">System Overview</h3>
              <p className="text-gray-600">
                You have full system control and can manage all users and settings.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Admin Privileges</h3>
              <ul className="space-y-2">
                <li>• Manage All Users</li>
            <li>• System Configuration</li>
            <li>• Role Assignment</li>
            <li>• View All Data</li>
            <li>• Audit Logs</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">System Users</h3>
        
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Account Type</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'industry' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">{user.accountType || 'N/A'}</td>
                    <td className="py-2 px-4 border">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;