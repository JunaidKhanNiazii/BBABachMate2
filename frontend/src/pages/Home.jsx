import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

function Home() {
  const { currentUser, userProfile } = useAuth();
  const [stats, setStats] = useState({
    universities: 0,
    industries: 0,
    projects: 0,
    funding: '0'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sector: 'University Sector',
    message: ''
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await api.get('/public-stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching public stats:', err);
      }
    };
    fetchPublicStats();
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryLoading(true);
    setInquiryStatus({ type: '', message: '' });

    try {
      const res = await api.post('/inquiries', formData);
      if (res.data.success) {
        setInquiryStatus({ type: 'success', message: 'Inquiry submitted successfully!' });
        setFormData({ name: '', email: '', sector: 'University Sector', message: '' });
      }
    } catch (err) {
      setInquiryStatus({ type: 'error', message: err.response?.data?.message || 'Failed to submit' });
    } finally {
      setInquiryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-44 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-left">
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase leading-[1.2]">
                AICON <span className="text-blue-600">Academia Industry</span><br />
                Collaboration Network
              </h1>
              <p className="text-gray-400 text-sm md:text-base mb-10 max-w-xl leading-relaxed font-medium">
                Bridge the gap between industrial requirements and academic innovation.
                We facilitate professional partnerships and talent acquisition through
                a streamlined collaborative ecosystem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                  Get Started
                </Link>
                <Link to="/services" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                  Our Services
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img
                src="/images/hero_collaboration.png"
                alt="AICON Professional Network"
                className="w-full rounded-2xl shadow-2xl grayscale-[0.3] hover:grayscale-0 transition-all duration-700 aspect-video object-cover border border-white/5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-32 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-2xl font-black uppercase tracking-tight border-b-2 border-blue-600 inline-block pb-1 mb-4">Services Overview</h2>
            <p className="text-gray-500 text-sm font-medium tracking-wide">Strategic integration for academic and industrial growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/40 p-8 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
              <img
                src="/images/academic_research.png"
                alt="Academic Service"
                className="w-full h-48 object-cover rounded-xl mb-8 grayscale opacity-80"
              />
              <h3 className="text-xl font-black uppercase mb-4">University Protocols</h3>
              <ul className="space-y-3">
                {['FYP Collaborations', 'Research Commercialization', 'Training Programs', 'Open House Events'].map(item => (
                  <li key={item} className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center space-x-3">
                    <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black/40 p-8 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
              <img
                src="/images/industry_sector.png"
                alt="Industry Service"
                className="w-full h-48 object-cover rounded-xl mb-8 grayscale opacity-80"
              />
              <h3 className="text-xl font-black uppercase mb-4">Industry Protocols</h3>
              <ul className="space-y-3">
                {['Talent Acquisition', 'Internship Management', 'Technical Challenges', 'Strategic Funding'].map(item => (
                  <li key={item} className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center space-x-3">
                    <span className="w-1 h-1 bg-gray-600"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Metric number={stats.universities.toString()} label="UNIVERSITIES" />
            <Metric number={stats.industries.toString()} label="INDUSTRIES" />
            <Metric number={stats.funding} label="FUNDING" />
            <Metric number={stats.projects.toString()} label="PROJECTS" />
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-32 bg-neutral-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase mb-4">Professional Inquiry</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Global support and strategic coordination.</p>
          </div>

          <div className="bg-black p-8 md:p-12 rounded-2xl border border-white/10">
            <form onSubmit={handleInquirySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inquiryStatus.message && (
                <div className={`md:col-span-2 p-4 rounded-xl text-xs font-bold uppercase tracking-widest ${inquiryStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {inquiryStatus.message}
                </div>
              )}
              <input
                type="text"
                required
                className="px-6 py-4 bg-neutral-900 border border-white/5 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-600"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                required
                className="px-6 py-4 bg-neutral-900 border border-white/5 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-600"
                placeholder="Business Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <select
                className="md:col-span-2 px-6 py-4 bg-neutral-900 border border-white/5 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all text-white"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              >
                <option>University Sector</option>
                <option>Industrial Sector</option>
              </select>
              <textarea
                required
                className="md:col-span-2 px-6 py-4 bg-neutral-900 border border-white/5 rounded-xl text-xs font-bold h-32 outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-600"
                placeholder="Inquiry Details"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
              <button
                type="submit"
                disabled={inquiryLoading}
                className="md:col-span-2 bg-blue-600 text-white py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {inquiryLoading ? 'Transmitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ number, label }) {
  return (
    <div className="p-8 bg-neutral-900/40 border border-white/5 rounded-xl text-center">
      <div className="text-3xl font-black mb-2">{number}</div>
      <div className="text-[10px] uppercase font-black text-gray-600 tracking-widest">{label}</div>
    </div>
  );
}

export default Home;