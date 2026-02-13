import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ItemManager from '../../components/dashboard/ItemManager';
import api from '../../api/axios';

function IndustryDashboard() {
  const { userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(userProfile?.profile || {});
  const [stats, setStats] = useState({
    universityFYPs: 0,
    totalPartners: 0,
    activeResearch: 0,
    myPostings: 0,
    funding: 'PKR 0'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/industry/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'profile', label: 'Company Profile' },
    { id: 'jobs', label: 'Job Opportunities' },
    { id: 'internships', label: 'Internships' },
    { id: 'speakers', label: 'Expert Profiles' },
    { id: 'challenges', label: 'Challenges & Research' },
    { id: 'collaborations', label: 'Collaborations' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'settings', label: 'Account Settings' },
    { id: 'discover', label: 'Browse Universities' },
  ];

  const configs = {
    jobs: {
      title: 'Job Postings',
      endpoint: '/industry/jobs?mine=true',
      fields: [
        { name: 'title', label: 'Job Title', required: true },
        { name: 'domain', label: 'Job Category / Domain', type: 'select', options: ['IT', 'Engineering', 'Business', 'Healthcare', 'Finance', 'Marketing', 'Legal'], required: true },
        { name: 'type', label: 'Job Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract'], required: true },
        { name: 'location', label: 'Job Location (City / Remote)', required: true },
        { name: 'skills', label: 'Required Skills', type: 'multiselect', required: true },
        { name: 'education', label: 'Education Requirement', type: 'select', options: ["Bachelor's", "Master's", "PhD"], required: true },
        { name: 'experience', label: 'Experience Level', type: 'select', options: ['Fresh Graduate', '1-2 Years', '3+ Years'], required: true },
        { name: 'vacancies', label: 'Number of Vacancies', type: 'number', required: true },
        { name: 'deadline', label: 'Application Deadline', type: 'date', required: true },
        { name: 'applicationMethod', label: 'Application Method', type: 'select', options: ['Apply through AICON', 'External Link'], required: true },
        { name: 'externalLink', label: 'External Application Link (Optional)' },
        { name: 'description', label: 'Job Description', type: 'textarea', required: true, fullWidth: true },
      ]
    },
    internships: {
      title: 'Internship Programs',
      endpoint: '/industry/internships?mine=true',
      fields: [
        { name: 'title', label: 'Internship Title', required: true },
        { name: 'domain', label: 'Internship Domain / Field', type: 'select', options: ['IT', 'Engineering', 'Business', 'Design', 'Marketing', 'Healthcare'], required: true },
        { name: 'type', label: 'Internship Type', type: 'select', options: ['On-site', 'Remote', 'Hybrid'], required: true },
        { name: 'location', label: 'Internship Location (City / Remote)', required: true },
        { name: 'skills', label: 'Required Skills', type: 'multiselect', required: true },
        { name: 'preferredBackground', label: 'Preferred Academic Background', required: true },
        { name: 'duration', label: 'Internship Duration (e.g., 3 months)', required: true },
        { name: 'stipendType', label: 'Stipend Type', type: 'select', options: ['Paid', 'Unpaid'], required: true },
        { name: 'stipendAmount', label: 'Stipend Amount (If Paid)' },
        { name: 'workingHours', label: 'Working Hours / Schedule', type: 'select', options: ['Full-time', 'Part-time'], required: true },
        { name: 'vacancies', label: 'Number of Intern Positions', type: 'number', required: true },
        { name: 'deadline', label: 'Application Deadline', type: 'date', required: true },
        { name: 'applicationMethod', label: 'Application Method', type: 'select', options: ['Apply through AICON', 'External Link'], required: true },
        { name: 'description', label: 'Internship Description', type: 'textarea', required: true, fullWidth: true },
      ]
    },
    speakers: {
      title: 'Industrial Expert Profiles',
      endpoint: '/industry/speakers?mine=true',
      fields: [
        { name: 'name', label: 'Full Name', required: true },
        { name: 'designation', label: 'Designation / Job Title', required: true },
        { name: 'roleType', label: 'Expert Role Type', type: 'multiselect', placeholder: 'Guest Speaker, Advisory Board, etc.', required: true },
        { name: 'expertise', label: 'Area of Expertise', required: true },
        { name: 'experience', label: 'Industry Experience (e.g. 10+ years)', required: true },
        { name: 'organization', label: 'Current Organization', required: true },
        { name: 'engagementPreferences', label: 'Engagement Preferences', type: 'multiselect', placeholder: 'Guest Lectures, Workshops, etc.', required: true },
        { name: 'academicDomains', label: 'Preferred Academic Domains', required: true },
        { name: 'availabilityMode', label: 'Availability Mode', type: 'select', options: ['On-site', 'Online', 'Both'], required: true },
        { name: 'email', label: 'Professional Email (Optional)' },
        { name: 'linkedin', label: 'LinkedIn Profile Link (Optional)' },
        { name: 'image', label: 'Profile Photo (Optional)', type: 'file' },
        { name: 'bio', label: 'Professional Summary / Bio', type: 'textarea', fullWidth: true, required: true },
      ]
    },
    challenges: {
      title: 'Post Challenge / Research Opportunity',
      endpoint: '/industry/challenges?mine=true',
      fields: [
        { name: 'title', label: 'Opportunity Title', required: true },
        { name: 'opportunityCategory', label: 'Opportunity Category', type: 'select', options: ['Industry Challenge', 'Research Topic'], required: true },
        { name: 'fundingType', label: 'Funding Type', type: 'select', options: ['Funded', 'Non-Funded'], required: true },
        { name: 'fundingAmount', label: 'Funding Amount (If Funded)' },
        { name: 'fundingPurpose', label: 'Funding Purpose (e.g. FYP Sponsorship)' },
        { name: 'sponsorshipType', label: 'Sponsorship Type', type: 'select', options: ['Research Grant', 'FYP Sponsorship', 'Event Sponsorship', 'Equipment Support'] },
        { name: 'domain', label: 'Domain / Field', required: true },
        { name: 'expectedOutcomes', label: 'Expected Outcomes', type: 'multiselect', required: true },
        { name: 'eligibility', label: 'Eligibility Criteria', required: true },
        { name: 'deadline', label: 'Submission Deadline', type: 'date', required: true },
        { name: 'mode', label: 'Collaboration Mode', type: 'select', options: ['On-site', 'Online', 'Hybrid'], required: true },
        { name: 'description', label: 'Problem Statement / Research Description', type: 'textarea', required: true, fullWidth: true },
      ]
    },
    collaborations: {
      title: 'Strategic Collaborative Services',
      endpoint: '/industry/collaborations?mine=true',
      fields: [
        { name: 'title', label: 'Title of Collaboration', required: true },
        { name: 'nature', label: 'Collaboration Nature', type: 'select', options: ['Industry Offering Support', 'Industry Requesting Support'], required: true },
        { name: 'category', label: 'Collaboration Category', type: 'multiselect', options: ['Research', 'Consultancy', 'Training', 'Curriculum Dev', 'Technology Dev'], required: true },
        { name: 'domain', label: 'Academic / Technical Domain', required: true },
        { name: 'expectedContribution', label: 'Expected Contribution', required: true },
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ... (existing helper functions)

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
            <p className="text-[9px] uppercase tracking-widest font-bold text-blue-200/50">Industry Hub</p>
            <p className="text-xs font-bold text-white truncate uppercase tracking-tight">{userProfile?.profile?.name || 'Company Profile'}</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'home') fetchStats();
                setIsSidebarOpen(false); // Close sidebar on mobile when item clicked
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
        <header className="px-6 md:px-10 py-6 md:py-8 flex justify-between items-center bg-[var(--bg-primary)] border-b border-[var(--bg-tertiary)]">
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight uppercase">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">
                {activeTab === 'home' ? 'Professional Overview' : 'Management Console'}
              </p>
            </div>
          </div>
          <div className="px-5 py-2.5 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl">
            <span className="text-[9px] font-bold text-[var(--accent-secondary)] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-[var(--accent-secondary)] rounded-full animate-pulse"></span>
              Secure Session
            </span>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 animate-in fade-in duration-500">
              <MetricCard title="University FYPs" value={stats.universityFYPs.toString().padStart(2, '0')} label="Available Projects" />
              <MetricCard title="Total Partners" value={stats.totalPartners.toString().padStart(2, '0')} label="Educational Institutions" />
              <MetricCard title="Active Research" value={stats.activeResearch.toString().padStart(2, '0')} label="Synergy Papers" />
              <MetricCard title="My Postings" value={stats.myPostings.toString().padStart(2, '0')} label="Jobs & Internships" />
              <MetricCard title="Funding" value={stats.funding} label="Research Sponsored" />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl p-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-[var(--bg-tertiary)]">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Industrial Identity</h2>
                  <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-1">Official Company Record</p>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-6 py-2.5 bg-[var(--accent-primary)] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent-secondary)] transition-all shadow-lg"
                >
                  {isEditingProfile ? 'Cancel Edit' : 'Edit Company Info'}
                </button>
              </div>

              <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <ProfileField label="Company Name" name="name" value={profileData.name} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                <ProfileField label="Industry Type" name="industryType" value={profileData.industryType} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, industryType: e.target.value })} placeholder="E.G. IT, MANUFACTURING" />
                <ProfileField label="Official Email" name="email" value={userProfile?.email} disabled={true} />
                <ProfileField label="Contact Person" name="contactPerson" value={profileData.contactPerson} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, contactPerson: e.target.value })} />
                <ProfileField label="Designation" name="designation" value={profileData.designation} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, designation: e.target.value })} />
                <ProfileField label="Contact Number" name="contactNumber" value={profileData.contactNumber} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, contactNumber: e.target.value })} />
                <ProfileField label="HQ Address" name="address" value={profileData.location} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, location: e.target.value })} />
                <ProfileField label="Company Website" name="website" value={profileData.website} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, website: e.target.value })} />
                <div className="md:col-span-2">
                  <ProfileField label="About Company" name="description" value={profileData.description} disabled={!isEditingProfile} onChange={e => setProfileData({ ...profileData, description: e.target.value })} isTextarea />
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
                    <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest">System Update</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1">Platform maintenance completed successfully.</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest italic">2 hours ago</span>
              </div>
              <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl p-8 flex items-center justify-between group hover:border-[var(--accent-secondary)]/30 transition-all opacity-60">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center text-[var(--text-secondary)]">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest">Profile Verified</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1">Your corporate registry credentials have been validated.</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest italic">Yesterday</span>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl p-10 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-10 pb-6 border-b border-[var(--bg-tertiary)]">Account Management</h2>
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Email Notifications</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1 italic">Receive recruitment alerts and synergy proposals.</p>
                  </div>
                  <div className="w-12 h-6 bg-[var(--accent-secondary)] rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest">Enterprise Security</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1 italic">Manage two-factor authentication and access logs.</p>
                  </div>
                  <button className="px-6 py-2 bg-[var(--bg-tertiary)] border border-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-[var(--text-primary)] transition-all">Manage</button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-[var(--bg-tertiary)]">
                  <div>
                    <h4 className="text-xs font-black text-red-600 uppercase tracking-widest">Terminal Action</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tight mt-1 italic italic">Irreversible deletion of corporate registry.</p>
                  </div>
                  <button className="px-6 py-2 bg-red-600 shadow-lg shadow-red-600/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">Deactivate</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              <DiscoveryCard title="Final Year Projects" to="/fyps" description="Review academic innovation and research cycles." />
              <DiscoveryCard title="Semester Projects" to="/projects" description="Browse technical prototypes and software solutions." />
              <DiscoveryCard title="Course Offerings" to="/courses" description="Review specialized academic curricula and expertise." />
              <DiscoveryCard title="Academic Training" to="/trainings" description="Corporate-ready workshops and skill development." />
              <DiscoveryCard title="Collaborative Services" to="/collaborations" description="Respond to university-led synergy proposals." />
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
    <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl shadow-sm flex flex-col justify-between group hover:border-[var(--accent-secondary)]/30 transition-all">
      <div>
        <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-3xl font-black text-[var(--accent-primary)] italic tracking-tighter group-hover:text-[var(--accent-secondary)] transition-colors">{value}</p>
      </div>
      <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-6 opacity-60">{label}</p>
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
    <Link to={to} className="group p-8 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-2xl hover:border-[var(--accent-secondary)]/30 transition-all shadow-sm">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 tracking-tight uppercase">{title}</h3>
      <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 opacity-70 group-hover:opacity-100 italic">
        {description}
      </p>
      <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent-secondary)] flex items-center gap-2">
        Browse Registry <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  );
}

export default IndustryDashboard;
