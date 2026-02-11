import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, LabelList
} from 'recharts';

const StatCard = ({ title, value, subtext, color = "blue" }) => (
  <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">{title}</h3>
    <p className="text-4xl font-black italic tracking-tighter text-white group-hover:text-blue-500 transition-colors">{value}</p>
    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-4 opacity-60">{subtext}</p>
  </div>
);

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Fetch Functions
  const fetchGlobalStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setGlobalStats(res.data.data);
    } catch (error) {
      console.error('Error fetching global stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/content?type=${selectedContentType}`);
      setContent(res.data.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      // Assuming there is an endpoint for inquiries, otherwise this might need adjustment
      // const res = await api.get('/admin/inquiries'); 
      // setInquiries(res.data.data);
      setInquiries([]); // Placeholder until endpoint is confirmed
    } catch (error) {
      console.error("Error fetching inquiries", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/verify`);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error verifying user:', error);
      alert('Failed to verify user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/admin/content/${contentId}?type=${selectedContentType}`);
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    }
  };

  const handleDeleteInquiry = async (id) => {
    // Placeholder implementation
    setInquiries(prev => prev.filter(i => i._id !== id));
  };

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

  // ... (handlers remain same)

  // Tabs config for sidebar
  const tabs = [
    { id: 'overview', label: 'Platform Overview' },
    { id: 'users', label: 'User Directory' },
    { id: 'content', label: 'Content Hub' },
    { id: 'inquiries', label: 'Inquiries' },
  ];

  // Derived Data for Charts
  const userData = globalStats ? [
    { name: 'University', value: globalStats.users.university, color: '#3b82f6' }, // Blue
    { name: 'Industry', value: globalStats.users.industry, color: '#a855f7' }, // Purple
    { name: 'Admin', value: globalStats.users.admin, color: '#22c55e' }, // Green
  ] : [];

  const contentData = globalStats ? [
    { name: 'Jobs', total: globalStats.content.industry.jobs },
    { name: 'Internships', total: globalStats.content.industry.internships },
    { name: 'Speakers', total: globalStats.content.industry.speakers },
    { name: 'Research', total: globalStats.content.industry.research },
    { name: 'Challenges', total: globalStats.content.industry.challenges },
    { name: 'FYPs', total: globalStats.content.university.fyps },
    { name: 'Projects', total: globalStats.content.university.projects },
    { name: 'Courses', total: globalStats.content.university.courses },
    { name: 'Trainings', total: globalStats.content.university.trainings },
    { name: 'Collab', total: globalStats.content.university.collaborations },
  ] : [];

  return (
    <div className="min-h-screen bg-black flex font-sans selection:bg-blue-500/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-white/5 flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-lg shadow-lg">A</div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">AICON</span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6">
          <p className="text-[9px] uppercase tracking-widest font-bold text-gray-500">System Admin</p>
          <p className="text-xs font-bold text-white truncate uppercase tracking-tight">Super Admin</p>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all group ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-gray-500 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{tab.label}</span>
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center px-4 py-3.5 rounded-xl text-gray-500 hover:bg-red-600/10 hover:text-red-500 transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Back to Home</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden text-white">
        <header className="px-6 md:px-10 py-6 md:py-8 flex justify-between items-center bg-black border-b border-white/5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-white hover:text-blue-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white uppercase mb-1 hidden md:block">{tabs.find(t => t.id === activeTab)?.label}</h1>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase mb-1 md:hidden">{tabs.find(t => t.id === activeTab)?.label}</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">System Administration • Global Protocol Management</p>
            </div>
          </div>
          <div className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-xl flex items-center space-x-4 hidden md:flex">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Authorization: Active</span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">

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
                      <div className="h-[300px] w-full min-h-[300px]">
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
                      <div className="h-[300px] w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={contentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                              dataKey="name"
                              stroke="#666"
                              fontSize={10}
                              fontWeight="bold"
                              axisLine={false}
                              tickLine={false}
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis stroke="#666" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                            <Tooltip
                              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                              contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                              <LabelList dataKey="total" position="top" fill="#fff" fontSize={10} fontWeight="bold" />
                            </Bar>
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
    </div>
  );
}

export default AdminDashboard;
