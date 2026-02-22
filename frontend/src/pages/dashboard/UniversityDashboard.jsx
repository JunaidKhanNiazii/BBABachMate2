import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ItemManager from '../../components/dashboard/ItemManager';
import api from '../../api/axios';

function UniversityDashboard() {
  const { userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex font-sans selection:bg-blue-500/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1e3a8a] border-r border-white/10 flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white text-[#1e3a8a] rounded-lg flex items-center justify-center font-black text-lg shadow-lg">A</div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">AICON</span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-white/50 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-widest font-bold text-blue-200/50">Academic Hub</p>
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
                setIsSidebarOpen(false); // Close sidebar on mobile
              }}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all group ${activeTab === tab.id
                ? 'bg-white text-[#1e3a8a] shadow-lg shadow-black/10'
                : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <Link to="/" className="flex items-center space-x-2 text-[9px] font-bold uppercase tracking-widest text-blue-200/60 hover:text-white transition-all group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Exit Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="px-4 md:px-10 py-5 md:py-8 flex justify-between items-center bg-[var(--bg-primary)] border-b border-[var(--bg-tertiary)] sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4 max-w-[70%] md:max-w-none">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="truncate">
              <h1 className="text-lg md:text-3xl font-bold text-[var(--text-primary)] tracking-tight uppercase truncate">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-[8px] md:text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-0.5 md:mt-1 truncate">
                {activeTab === 'home' ? 'Academic Analytics Overview' : 'Educational Protocol System'}
              </p>
            </div>
          </div>
          <div className="px-3 md:px-5 py-2 md:py-2.5 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl shrink-0">
            <span className="text-[8px] md:text-[9px] font-bold text-[var(--accent-secondary)] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-[var(--accent-secondary)] rounded-full animate-pulse"></span>
              <span className="hidden sm:inline">Verified Session</span>
              <span className="sm:hidden">Active</span>
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
              <MetricCard title="Opportunities" value={stats.opportunities.toString().padStart(2, '0')} label="Industry Openings" />
              <MetricCard title="Partners" value={stats.partners.toString().padStart(2, '0')} label="Active Corporations" />
              <MetricCard title="Collaborations" value={stats.collaborations.toString().padStart(2, '0')} label="Synergy Projects" />
              <MetricCard title="FYPs Posted" value={stats.fypsPosted.toString().padStart(2, '0')} label="Student Research" />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl p-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-[var(--bg-tertiary)]">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Institutional identity</h2>
                  <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">Academic Registry Record</p>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-6 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent-secondary)] transition-all shadow-lg"
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
              <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl p-8 flex items-center justify-between group hover:border-[var(--accent-secondary)]/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[var(--accent-secondary)]/10 rounded-xl flex items-center justify-center text-[var(--accent-secondary)]">
                    <span className="text-xl">🔔</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest">Synergy Protocol</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1">New industrial partnership proposal received.</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest italic">1 hour ago</span>
              </div>
              <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl p-8 flex items-center justify-between group hover:border-[var(--accent-secondary)]/30 transition-all opacity-60">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center text-[var(--text-secondary)]">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest">Academic Validation</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1">Your institutional credentials have been successfully indexed.</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest italic">Yesterday</span>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl p-10 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-10 pb-6 border-b border-[var(--bg-tertiary)]">Institutional Settings</h2>
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Academic Alerts</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1 italic">Receive notifications for student opportunities and research grants.</p>
                  </div>
                  <div className="w-12 h-6 bg-[var(--accent-secondary)] rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Security Protocol</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1 italic">Manage security keys and institutional access logs.</p>
                  </div>
                  <button className="px-6 py-2 bg-[var(--bg-tertiary)] border border-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-[var(--text-primary)] transition-all">Config</button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-[var(--bg-tertiary)]">
                  <div>
                    <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Critical Override</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1 italic">Permanent removal of academic registry record.</p>
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

          {!['home', 'profile', 'discover', 'notifications', 'settings'].includes(activeTab) && (
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
    <div className="p-6 md:p-8 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl shadow-sm flex flex-col justify-between group hover:border-[var(--accent-secondary)]/30 transition-all">
      <div>
        <h4 className="text-[9px] md:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-2xl md:text-3xl font-black text-[var(--accent-primary)] italic tracking-tighter group-hover:text-[var(--accent-secondary)] transition-colors">{value}</p>
      </div>
      <p className="text-[8px] md:text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-4 md:mt-6 opacity-60">{label}</p>
    </div>
  );
}

function ProfileField({ label, name, value, disabled, onChange, placeholder, isTextarea }) {
  const inputClass = "w-full p-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-[var(--text-primary)] text-xs font-medium focus:border-[var(--accent-secondary)] focus:outline-none transition-all placeholder:text-[var(--text-secondary)]/30 disabled:opacity-50 uppercase tracking-wide";
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3 ml-1">{label}</label>
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
    <Link to={to} className="group p-6 md:p-8 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl hover:border-[var(--accent-secondary)]/30 transition-all shadow-sm">
      <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)] mb-2 md:mb-3 tracking-tight uppercase">{title}</h3>
      <p className="text-[var(--text-secondary)] text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6 md:mb-8 opacity-70 group-hover:opacity-100 italic">
        {description}
      </p>
      <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[var(--accent-secondary)] flex items-center gap-2">
        Browse Registry <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}

export default UniversityDashboard;
