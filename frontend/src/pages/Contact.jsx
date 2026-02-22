import React, { useState } from 'react';
import api from '../api/axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sector: 'University Sector',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.post('/inquiries', formData);
      if (res.data.success) {
        setStatus({ type: 'success', message: 'Inquiry submitted successfully! We will contact you soon.' });
        setFormData({ name: '', email: '', sector: 'University Sector', message: '' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to submit inquiry' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto py-32 px-6 lg:px-8">
        <div className="max-w-3xl mb-24">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6 tracking-tight uppercase">
            CONTACT <span className="text-[var(--accent-secondary)]">US</span>
          </h1>
          <p className="text-[var(--text-secondary)] font-medium text-sm leading-relaxed max-w-2xl">
            Inquire about strategic partnerships or technical support.
            Our team coordinates global collaboration requests within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-[var(--bg-secondary)] p-8 md:p-12 rounded-2xl  shadow-[0_15px_20px_rgba(59,130,246,0.6)] ">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {status.message && (
                  <div className={`md:col-span-2 p-4 rounded-xl text-xs font-bold uppercase tracking-widest ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {status.message}
                  </div>
                )}
                <input
                  type="text"
                  required
                  className="px-6 py-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-xs font-bold outline-none focus:border-[var(--accent-secondary)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  required
                  className="px-6 py-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-xs font-bold outline-none focus:border-[var(--accent-secondary)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40"
                  placeholder="Business Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <select
                  className="md:col-span-2 px-6 py-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-xs font-bold outline-none focus:border-[var(--accent-secondary)] transition-all text-[var(--text-primary)]"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                >
                  <option>University Sector</option>
                  <option>Industrial Sector</option>
                </select>
                <textarea
                  required
                  className="md:col-span-2 px-6 py-4 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-xl text-xs font-bold h-40 outline-none focus:border-[var(--accent-secondary)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40"
                  placeholder="Detailed Inquiry"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
                <button
                  type="submit"
                  disabled={loading}
                  className="md:col-span-2 bg-blue-600 text-white py-5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Transmitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-10 rounded-2xl shadow-sm">
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-[var(--text-primary)]">DIRECT LINE</h3>
              <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px] mb-6 leading-relaxed">
                Operating Hours:<br />
                <span className="text-[var(--text-primary)]">09:00 - 18:00 UTC</span>
              </p>
              <a href="mailto:contact@aicon.net" className="text-[var(--accent-secondary)] font-black uppercase tracking-widest text-[11px]">contact@aicon.net</a>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] p-10 rounded-2xl shadow-sm">
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight text-[var(--text-primary)]">LOCATION</h3>
              <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                Innovation District,<br />
                Tech City 1, Node AI-24.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;