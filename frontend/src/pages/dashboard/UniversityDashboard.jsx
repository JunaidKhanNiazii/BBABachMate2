import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ItemManager from '../../components/dashboard/ItemManager';
import api from '../../api/axios';

function UniversityDashboard() {
  const { userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(userProfile?.profile || {});
  const [stats, setStats] = useState({
    opportunities: 0,
    partners: 0,
    collaborations: 0,
    fypsPosted: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/university/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };


  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'profile', label: 'University Profile' },
    { id: 'fyps', label: 'Post FYP Project' },
    { id: 'products', label: 'Products & Services' },
    { id: 'courses', label: 'Courses & Training' },
    { id: 'openhouse', label: 'Open House' },
    { id: 'collaborations', label: 'Collaborative Services' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'settings', label: 'Account Settings' },
    { id: 'discover', label: 'Browse Industry' },
  ];

  const configs = {
    fyps: {
      title: 'Final Year Projects',
      endpoint: '/university/fyps?mine=true',
      fields: [
        { name: 'title', label: 'Project Title', required: true },
        { name: 'domain', label: 'Project Category / Domain', type: 'select', options: ['Software Engineering', 'AI', 'Business', 'Mechanical', 'Electrical'], required: true },
        { name: 'type', label: 'Project Status', type: 'select', options: ['Completed', 'Ongoing'], required: true },
        { name: 'students', label: 'Student Name(s)', required: true },
        { name: 'degree', label: 'Degree Program', type: 'select', options: ['BS', 'MS', 'PhD'], required: true },
        { name: 'department', label: 'Department', required: true },
        { name: 'supervisor', label: 'Lead Supervisor', required: true },
        { name: 'tools', label: 'Tools / Technologies Used', type: 'multiselect', required: true },
        { name: 'outcomes', label: 'Project Outcomes', type: 'multiselect', options: ['Research', 'Prototype', 'Product', 'Application'], required: true },
        { name: 'collaborationInterest', label: 'Open for Industry Collaboration?', type: 'select', options: ['Yes', 'No'], required: true },
        { name: 'collaborationType', label: 'Collaboration Type (If Yes)', type: 'multiselect', options: ['Development', 'Commercialization', 'Testing', 'Funding'] },
        { name: 'problemStatement', label: 'Problem Statement', type: 'textarea', required: true, fullWidth: true },
        { name: 'solution', label: 'Solution Overview', type: 'textarea', required: true, fullWidth: true },
        { name: 'links', label: 'GitHub / Repository Link (Optional)' },
      ]
    },
    products: {
      title: 'Post Product / Service',
      endpoint: '/university/products?mine=true',
      fields: [
        { name: 'name', label: 'Product / Service Name', required: true },
        { name: 'type', label: 'Type', type: 'select', options: ['Product', 'Service'], required: true },
        { name: 'domain', label: 'Category / Domain', type: 'select', options: ['Software', 'Hardware', 'Healthcare', 'Education', 'Energy'], required: true },
        { name: 'developedBy', label: 'Developed By', type: 'select', options: ['Students', 'Faculty', 'Research Lab', 'Mixed Team'], required: true },
        { name: 'status', label: 'Development Status', type: 'select', options: ['Prototype', 'Tested', 'Ready for Market', 'Under Development'], required: true },
        { name: 'supportNeeded', label: 'Industry Support Needed', type: 'multiselect', options: ['Manufacturing', 'Funding', 'Market Launch', 'Licensing', 'Mentorship'], required: true },
        { name: 'targetMarket', label: 'Target Market', required: true },
        { name: 'ipStatus', label: 'IP Status', type: 'select', options: ['Patent Filed', 'Patent Granted', 'No Patent', 'In Process'], required: true },
        { name: 'problemAddressed', label: 'Problem Addressed', type: 'textarea', required: true, fullWidth: true },
        { name: 'description', label: 'Product / Service Description', type: 'textarea', required: true, fullWidth: true },
        { name: 'features', label: 'Unique Features / Innovation', type: 'textarea', required: true, fullWidth: true },
      ]
    },
    courses: {
      title: 'Course / Training Program',
      endpoint: '/university/courses?mine=true',
      fields: [
        { name: 'title', label: 'Program Title', required: true },
        { name: 'type', label: 'Program Type', type: 'select', options: ['Course', 'Training Program', 'Workshop', 'Certification'], required: true },
        { name: 'domain', label: 'Category / Domain', type: 'select', options: ['AI', 'Software Development', 'Project Management', 'Finance'], required: true },
        { name: 'duration', label: 'Duration (e.g. 6 weeks)', required: true },
        { name: 'mode', label: 'Mode of Delivery', type: 'select', options: ['On-site', 'Online', 'Hybrid'], required: true },
        { name: 'dates', label: 'Program Schedule (Start - End)', required: true },
        { name: 'instructor', label: 'Instructor / Trainer Name', required: true },
        { name: 'fee', label: 'Training Fee (Free / Amount)', required: true },
        { name: 'seats', label: 'Seats Available', type: 'number', required: true },
        { name: 'deadline', label: 'Registration Deadline', type: 'date', required: true },
        { name: 'industryEnrollment', label: 'Open for Industry Enrollment', type: 'select', options: ['Yes', 'No'], required: true },
        { name: 'overview', label: 'Program Overview', type: 'textarea', required: true, fullWidth: true },
      ]
    },
    openhouse: {
      title: 'Open House Nominations',
      endpoint: '/university/openhouse?mine=true',
      fields: [
        { name: 'title', label: 'Event Title', required: true },
        { name: 'type', label: 'Event Type', type: 'select', options: ['Physical', 'Virtual', 'Hybrid'], required: true },
        { name: 'date', label: 'Event Date', type: 'date', required: true },
        { name: 'time', label: 'Event Time', required: true },
        { name: 'venue', label: 'Venue / Meeting Link', required: true },
        { name: 'participation', label: 'Who Can Participate', required: true },
        { name: 'roles', label: 'Industry Roles', type: 'multiselect', options: ['Evaluation', 'Recruitment', 'Sponsorship', 'Collaboration'], required: true },
        { name: 'deadline', label: 'Nomination Deadline', type: 'date', required: true },
        { name: 'description', label: 'Event Description', type: 'textarea', required: true, fullWidth: true },
      ]
    },
    collaborations: {
      title: 'Strategic Collaborative Services',
      endpoint: '/university/collaborations?mine=true',
      fields: [
        { name: 'title', label: 'Title of Collaboration', required: true },
        { name: 'nature', label: 'Collaboration Nature', type: 'select', options: ['University Offering Support', 'University Requesting Support'], required: true },
        { name: 'category', label: 'Collaboration Category', type: 'multiselect', options: ['Research', 'Consultancy', 'Training', 'Curriculum Dev', 'Technology Transfer'], required: true },
        { name: 'domain', label: 'Academic / Technical Domain', required: true },
        { name: 'expectedContribution', label: 'Expected Contribution', required: true },
        { name: 'supportType', label: 'Support / Resource Type', type: 'multiselect', options: ['Facilities', 'Expertise', 'Student Teams', 'Financial'], required: true },
        { name: 'duration', label: 'Collaboration Duration', type: 'select', options: ['Short-term', 'Long-term'], required: true },
        { name: 'mode', label: 'Collaboration Mode', type: 'select', options: ['On-site', 'Online', 'Hybrid'], required: true },
        { name: 'description', label: 'Detailed Description', type: 'textarea', required: true, fullWidth: true },
      ]
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const res = await updateProfile(profileData);
    if (res.success) {
      setIsEditingProfile(false);
      alert('Profile updated successfully');
    } else {
      alert('Update failed: ' + res.error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <div className="w-72 bg-neutral-900 border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-lg shadow-lg">A</div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">AICON</span>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Academic Hub</p>
            <p className="text-xs font-bold text-white truncate uppercase tracking-tight">{userProfile?.profile?.name || 'University Profile'}</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'home') fetchStats();
              }}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all group ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                : 'text-gray-500 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Link to="/" className="flex items-center space-x-2 text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-all group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Exit Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-10 py-8 flex justify-between items-center bg-black border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">
              {activeTab === 'home' ? 'Academic Analytics Overview' : 'Educational Protocol System'}
            </p>
          </div>
          <div className="px-5 py-2.5 bg-neutral-900 border border-white/5 rounded-xl">
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
              Verified Session
            </span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
              <MetricCard title="Opportunities" value={stats.opportunities.toString().padStart(2, '0')} label="Industry Openings" />
              <MetricCard title="Partners" value={stats.partners.toString().padStart(2, '0')} label="Active Corporations" />
              <MetricCard title="Collaborations" value={stats.collaborations.toString().padStart(2, '0')} label="Synergy Projects" />
              <MetricCard title="FYPs Posted" value={stats.fypsPosted.toString().padStart(2, '0')} label="Student Research" />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">Institutional identity</h2>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Academic Registry Record</p>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-6 py-2.5 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg"
                >
                  {isEditingProfile ? 'Cancel Edit' : 'Edit University Info'}
                </button>
              </div>

              <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <ProfileField label="University Name" name="name" value={profileData.name} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                <ProfileField label="University Type" name="universityType" value={profileData.universityType} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, universityType: e.target.value })} placeholder="PUBLIC / PRIVATE" />
                <ProfileField label="Authorized Person" name="authPerson" value={profileData.authPerson} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, authPerson: e.target.value })} />
                <ProfileField label="Designation" name="designation" value={profileData.designation} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, designation: e.target.value })} />
                <ProfileField label="Contact Number" name="contactNumber" value={profileData.contactNumber} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, contactNumber: e.target.value })} />
                <ProfileField label="Campus Address" name="address" value={profileData.location} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, location: e.target.value })} />
                <ProfileField label="Departments" name="departments" value={profileData.departments} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, departments: e.target.value })} placeholder="E.G. CS, EE, BUSINESS" />
                <ProfileField label="Website URL" name="website" value={profileData.website} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, website: e.target.value })} />
                <div className="md:col-span-2">
                  <ProfileField label="About University" name="description" value={profileData.description} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, description: e.target.value })} isTextarea />
                </div>
                {isEditingProfile && (
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="px-10 py-4 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-neutral-900 border border-white/5 rounded-2xl p-8 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                    <span className="text-xl">🔔</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Synergy Protocol</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">New industrial partnership proposal received.</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest italic">1 hour ago</span>
              </div>
              <div className="bg-neutral-900 border border-white/5 rounded-2xl p-8 flex items-center justify-between group hover:border-blue-500/30 transition-all opacity-60">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Academic Validation</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">Your institutional credentials have been successfully indexed.</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest italic">Yesterday</span>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-10 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-10 pb-6 border-b border-white/5">Institutional Settings</h2>
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Academic Alerts</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1 italic italic">Receive notifications for student opportunities and research grants.</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Security Protocol</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1 italic italic">Manage security keys and institutional access logs.</p>
                  </div>
                  <button className="px-6 py-2 bg-white/5 border border-white/5 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-white hover:border-white/10 transition-all">Config</button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Critical Override</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1 italic italic italic">Permanent removal of academic registry record.</p>
                  </div>
                  <button className="px-6 py-2 bg-red-600 shadow-lg shadow-red-600/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">Decommission</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              <DiscoveryCard title="Job Postings" to="/jobs" description="Explore industrial career paths and opportunities." />
              <DiscoveryCard title="Internships" to="/internships" description="Review practical training and student placement programs." />
              <DiscoveryCard title="Guest Speakers" to="/speakers" description="Connect with industrial thought leaders." />
              <DiscoveryCard title="Industrial Research" to="/research" description="Browse technical papers and research publications." />
              <DiscoveryCard title="Industry Challenges" to="/challenges" description="Review problem statements and industrial challenges." />
              <DiscoveryCard title="Collaborative Services" to="/collaborations" description="Respond to industry-led synergy proposals." />
            </div>
          )}

          {!['home', 'profile', 'discover'].includes(activeTab) && (
            <div className="animate-in fade-in duration-500">
              <ItemManager key={activeTab} {...configs[activeTab]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, label }) {
  return (
    <div className="p-8 bg-neutral-900 border border-white/5 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-blue-500/30 transition-all">
      <div>
        <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-3xl font-black text-white italic tracking-tighter group-hover:text-blue-500 transition-colors">{value}</p>
      </div>
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-6 opacity-60">{label}</p>
    </div>
  );
}

function ProfileField({ label, name, value, disabled, onChange, placeholder, isTextarea }) {
  const inputClass = "w-full p-4 bg-black border border-white/5 rounded-xl text-white text-xs font-medium focus:border-blue-500/50 focus:outline-none transition-all placeholder-gray-800 disabled:opacity-50 uppercase tracking-wide";
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 ml-1">{label}</label>
      {isTextarea ? (
        <textarea name={name} value={value} disabled={disabled} onChange={onChange} className={inputClass + " h-32"} placeholder={placeholder || `ENTER ${label.toUpperCase()}`} />
      ) : (
        <input name={name} value={value} disabled={disabled} onChange={onChange} className={inputClass} placeholder={placeholder || `ENTER ${label.toUpperCase()}`} />
      )}
    </div>
  );
}

function DiscoveryCard({ title, to, description }) {
  return (
    <Link to={to} className="group p-8 bg-neutral-900 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all shadow-xl">
      <h3 className="text-lg font-bold text-white mb-3 tracking-tight uppercase">{title}</h3>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 opacity-70 group-hover:opacity-100 italic">
        {description}
      </p>
      <div className="text-[9px] font-bold uppercase tracking-widest text-blue-500 flex items-center gap-2">
        Browse Registry <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}

export default UniversityDashboard;
