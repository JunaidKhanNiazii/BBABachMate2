import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const StatCard = ({ title, value, subtext, color = "blue" }) => (
  <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">{title}</h3>
    <p className="text-4xl font-black italic tracking-tighter text-white group-hover:text-blue-500 transition-colors">{value}</p>
    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-4 opacity-60">{subtext}</p>
  </div>
);

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState(null);

  // Content Types to manage
  const contentTypes = [
    { id: 'industry/jobs', label: 'Jobs' },
    { id: 'industry/internships', label: 'Internships' },
    { id: 'industry/speakers', label: 'Speakers' },
    { id: 'industry/research', label: 'Research' },
    { id: 'industry/challenges', label: 'Challenges' },
    { id: 'university/fyps', label: 'FYPs' },
    { id: 'university/projects', label: 'Projects' },
    { id: 'university/courses', label: 'Courses' },
    { id: 'university/trainings', label: 'Trainings' },
    { id: 'university/collaborations', label: 'Collaborations' },
  ];
  const [selectedContentType, setSelectedContentType] = useState(contentTypes[0].id);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'overview') {
      fetchGlobalStats();
      fetchUsers(); // For pending list
    } else if (activeTab === 'inquiries') {
      fetchInquiries();
    } else {
      fetchContent();
    }
  }, [activeTab, selectedContentType]);

  const fetchGlobalStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) setGlobalStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/inquiries');
      if (res.data.success) setInquiries(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${selectedContentType}`);
      if (res.data.success) setContent(res.data.data);
    } catch (err) {
      console.error(err);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle-verify`);
      if (activeTab === 'overview') {
        fetchGlobalStats();
      }
      fetchUsers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? All their data will be removed.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
      if (activeTab === 'overview') fetchGlobalStats();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/${selectedContentType}/${id}`);
      fetchContent();
      if (activeTab === 'overview') fetchGlobalStats();
    } catch (err) {
      alert('Failed to delete content');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Remove this inquiry?')) return;
    try {
      await api.delete(`/admin/inquiries/${id}`);
      fetchInquiries();
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // Data for charts
  const userData = globalStats ? [
    { name: 'Industry', value: globalStats.users.industry, color: '#3b82f6' },
    { name: 'University', value: globalStats.users.university, color: '#a855f7' }
  ] : [];

  const contentData = globalStats ? [
    { name: 'Industry', total: Object.values(globalStats.content.industry).reduce((a, b) => a + b, 0) },
    { name: 'University', total: Object.values(globalStats.content.university).reduce((a, b) => a + b, 0) }
  ] : [];

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xl shadow-lg">A</div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">AICON</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white uppercase mb-1">System Administration</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Global Protocol Management</p>
          </div>
          <div className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-xl flex items-center space-x-4">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Authorization: Active</span>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex p-1.5 bg-neutral-900 border border-white/5 rounded-2xl mb-12 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
          >
            Platform Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
          >
            User Directory
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
          >
            Content Hub
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === 'inquiries' ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}
          >
            Inquiries
          </button>
        </div>

        {/* Overview Tab content */}
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {loading && !globalStats ? (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-blue-600 animate-loading-bar"></div>
                </div>
                <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest animate-pulse">Scanning Neural Network...</p>
              </div>
            ) : globalStats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Platform Reach"
                    value={globalStats.users.total.toString().padStart(2, '0')}
                    subtext="Total Registered Entities"
                  />
                  <StatCard
                    title="Industrial Power"
                    value={globalStats.users.industry.toString().padStart(2, '0')}
                    subtext="Corporate Stakeholders"
                  />
                  <StatCard
                    title="Academic Depth"
                    value={globalStats.users.university.toString().padStart(2, '0')}
                    subtext="Education Partners"
                  />
                  <StatCard
                    title="Operational Funding"
                    value={`PKR ${(globalStats.financials.totalFunding / 1000000).toFixed(1)}M`}
                    subtext="Total Research Sponsorship"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-neutral-900 border border-white/5 p-8 rounded-3xl">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">User Distribution Analysis</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {userData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-white/5 p-8 rounded-3xl">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">Content Volume Pipeline</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={contentData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#666" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                          <YAxis stroke="#666" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                          />
                          <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden mt-8">
                  <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pending Verifications</h3>
                    <button onClick={() => setActiveTab('users')} className="text-[9px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">View All Directory</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <tbody className="divide-y divide-white/5">
                        {users.filter(u => !u.isVerified).slice(0, 5).map((user) => (
                          <tr key={user._id} className="hover:bg-white/[0.01] transition-all">
                            <td className="px-8 py-5">
                              <div className="font-bold text-white uppercase italic">{user.profile?.name || 'Undefined'}</div>
                              <div className="text-gray-600 text-[9px] font-bold uppercase tracking-tight mt-1">{user.role} • {user.email}</div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button
                                onClick={() => handleVerifyUser(user._id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/10 transition-all"
                              >
                                Authorize Access
                              </button>
                            </td>
                          </tr>
                        ))}
                        {users.filter(u => !u.isVerified).length === 0 && (
                          <tr>
                            <td className="px-8 py-10 text-center text-gray-600 font-bold text-[10px] uppercase tracking-widest italic">
                              All entities currently authorized. Platform status: SECURE.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-neutral-900 border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              {loading && users.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-blue-600 animate-loading-bar"></div>
                  </div>
                  <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest animate-pulse">Syncing Directory...</p>
                </div>
              ) : (
                <table className="min-w-full text-xs">
                  <thead className="bg-white/[0.02]">
                    <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Principal Identity</th>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Designation</th>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact</th>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-white/[0.01] transition-all">
                        <td className="px-8 py-6">
                          <div className="font-bold text-white uppercase italic">{user.profile?.name || 'Undefined'}</div>
                          <div className="text-gray-600 text-[10px] font-bold uppercase tracking-tight mt-1">{user.profile?.location || 'Unspecified'}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${user.role === 'industry' ? 'bg-blue-600/10 text-blue-500 border-blue-500/20' : user.role === 'university' ? 'bg-purple-600/10 text-purple-500 border-purple-500/20' : 'bg-white/5 text-gray-400 border-white/5'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-gray-500 italic font-medium">{user.email}</td>
                        <td className="px-8 py-6">
                          <span className={`flex items-center space-x-2 text-[9px] font-bold uppercase tracking-widest ${user.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span>{user.isVerified ? 'Authorized' : 'Pending'}</span>
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right space-x-3">
                          {user.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => handleVerifyUser(user._id)}
                                className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${user.isVerified ? 'bg-white/5 text-gray-500 hover:text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'}`}
                              >
                                {user.isVerified ? 'Revoke' : 'Authorize'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Content Moderation Tab */}
        {activeTab === 'content' && (
          <div className="bg-neutral-900 border border-white/5 rounded-2xl shadow-2xl p-8 animate-in fade-in duration-500">
            <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedContentType(type.id)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedContentType === type.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {loading && content.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center">
                <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-blue-600 animate-loading-bar"></div>
                </div>
                <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest animate-pulse">Syncing Records...</p>
              </div>
            ) : content.length === 0 ? (
              <div className="p-20 text-center border border-dashed border-white/5 rounded-2xl bg-black/10">
                <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">No records available</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20 shadow-xl">
                <table className="min-w-full text-xs">
                  <thead className="bg-white/[0.02]">
                    <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Record Details</th>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Originator</th>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date Logged</th>
                      <th className="px-8 py-6 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {content.map((item) => (
                      <tr key={item._id} className="hover:bg-white/[0.01] transition-all">
                        <td className="px-8 py-6">
                          <div className="font-bold text-white uppercase italic">{item.title || item.name}</div>
                          <div className="text-[10px] text-gray-600 font-bold uppercase tracking-tight mt-1 line-clamp-1 italic">{item.description || item.abstract || item.purpose}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-blue-600/10 text-blue-500 rounded-md flex items-center justify-center text-[9px] font-black border border-blue-500/20 uppercase italic">
                              {(item.createdBy?.profile?.name || 'U')[0]}
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{item.createdBy?.profile?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleDeleteContent(item._id)}
                            className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="bg-neutral-900 border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              {loading && inquiries.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-blue-600 animate-loading-bar"></div>
                  </div>
                  <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest animate-pulse">Retrieving Messages...</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="p-20 text-center">
                  <p className="text-gray-600 font-bold text-[10px] uppercase tracking-widest italic">No inquiries received yet.</p>
                </div>
              ) : (
                <table className="min-w-full text-xs">
                  <thead className="bg-white/[0.02]">
                    <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inquirer</th>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message</th>
                      <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sector</th>
                      <th className="px-8 py-6 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-white/[0.01] transition-all">
                        <td className="px-8 py-6">
                          <div className="font-bold text-white uppercase italic">{inq.name}</div>
                          <div className="text-gray-600 text-[10px] font-bold uppercase mt-1">{inq.email}</div>
                        </td>
                        <td className="px-8 py-6 max-w-md">
                          <p className="text-gray-400 italic leading-relaxed">{inq.message}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-blue-500/20">
                            {inq.sector}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(inq._id)}
                            className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
