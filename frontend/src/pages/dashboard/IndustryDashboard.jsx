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

  return (
    <div className="min-h-screen bg-black flex font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <div className="w-72 bg-neutral-900 border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-lg shadow-lg">A</div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">AICON</span>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Industry Hub</p>
            <p className="text-xs font-bold text-white truncate uppercase tracking-tight">{userProfile?.profile?.name || 'Company Profile'}</p>
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
              {activeTab === 'home' ? 'Snapshot of your industrial engagements' : 'Protocol Management System'}
            </p>
          </div>
          <div className="px-5 py-2.5 bg-neutral-900 border border-white/5 rounded-xl">
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
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
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">Industrial Identity</h2>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Official Company Record</p>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-6 py-2.5 bg-white text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg"
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
              <div className="bg-neutral-900 border border-white/5 rounded-2xl p-8 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                    <span className="text-xl">🔔</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">System Update</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">Platform maintenance completed successfully.</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest italic">2 hours ago</span>
              </div>
              <div className="bg-neutral-900 border border-white/5 rounded-2xl p-8 flex items-center justify-between group hover:border-blue-500/30 transition-all opacity-60">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500">
                    <span className="text-xl">📄</span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Profile Verified</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1">Your corporate registry credentials have been validated.</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest italic">Yesterday</span>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-10 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-10 pb-6 border-b border-white/5">Account Management</h2>
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Email Notifications</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1 italic">Receive recruitment alerts and synergy proposals.</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Enterprise Security</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1 italic">Manage two-factor authentication and access logs.</p>
                  </div>
                  <button className="px-6 py-2 bg-white/5 border border-white/5 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-white hover:border-white/10 transition-all">Manage</button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Terminal Action</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mt-1 italic italic">Irreversible deletion of corporate registry.</p>
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

export default IndustryDashboard;
