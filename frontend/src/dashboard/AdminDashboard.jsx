import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const { currentUser, getPendingUsers, approveUser, rejectUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);

        // Fetch pending users
        const pending = await getPendingUsers();
        setPendingUsers(pending);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveUser = async (userId, role) => {
    setActionLoading(userId);
    const result = await approveUser(userId, role);
    if (result.success) {
      // Refresh data
      const updatedPending = await getPendingUsers();
      setPendingUsers(updatedPending);

      // Update users list
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);

      alert('User approved successfully!');
    } else {
      alert('Error approving user: ' + result.error);
    }
    setActionLoading(null);
  };

  const handleRejectUser = async (userId) => {
    setActionLoading(userId);
    const result = await rejectUser(userId);
    if (result.success) {
      // Refresh pending users
      const updatedPending = await getPendingUsers();
      setPendingUsers(updatedPending);
      alert('User rejected successfully!');
    } else {
      alert('Error rejecting user: ' + result.error);
    }
    setActionLoading(null);
  };

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
          <p>Welcome, {currentUser?.email}</p>
          <p className="text-purple-200">Manage Users and Platform Settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">System Overview</h3>
            <p className="text-gray-600 mb-4">
              You have full system control and can manage all users and settings.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{pendingUsers.length}</div>
                <div className="text-sm text-gray-600">Pending Approvals</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Admin Privileges</h3>
            <ul className="space-y-2">
              <li>• Approve/Reject user registrations</li>
              <li>• Assign user roles</li>
              <li>• View all user data</li>
              <li>• System configuration</li>
              <li>• Audit user activities</li>
            </ul>
          </div>
        </div>

        {/* Pending Approvals Section */}
        {pendingUsers.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold mb-4">Pending User Approvals</h3>
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="border p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-600">Requested: {user.accountType}</p>
                    <p className="text-sm text-gray-500">
                      Registered: {new Date(user.createdAt?.toDate?.() || user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveUser(user.id, user.accountType)}
                      disabled={actionLoading === user.id}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionLoading === user.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleRejectUser(user.id)}
                      disabled={actionLoading === user.id}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === user.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Users Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">All System Users</h3>

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Role</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Account Type</th>
                    <th className="py-2 px-4 border">Registered</th>
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
                          user.role === 'university' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">
                        <span className={`px-2 py-1 rounded text-sm ${
                          user.status === 'approved' ? 'bg-green-100 text-green-800' :
                          user.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">{user.accountType || 'N/A'}</td>
                      <td className="py-2 px-4 border">
                        {user.createdAt ? new Date(user.createdAt?.toDate?.() || user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;