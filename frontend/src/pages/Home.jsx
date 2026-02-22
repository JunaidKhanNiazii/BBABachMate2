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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-blue-500/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 blur-[120px] rounded-full translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full animate-in fade-in slide-in-from-left-4 duration-700">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Bridge the gap, build the future</span>
              </div>

              <h1 className="text-4xl md:text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] md:leading-[0.85] text-black animate-in fade-in slide-in-from-top-8 duration-1000">
                AICON <span className="text-blue-600">Academia</span><br />
                <span className="text-[var(--accent-primary)]">Industry</span><br />
                Network
              </h1>

              <p className="text-[var(--text-secondary)] text-sm md:text-lg font-bold leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                AICON – Academia Industry Collaboration Network is a platform that facilitates collaboration between industry and academia.
                Our platform bridges the gap, offering services that drive innovation and growth.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                <Link to="/register" className="group px-8 md:px-10 py-4 md:py-5 bg-[var(--accent-primary)] text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-900/40 active:scale-95 flex items-center space-x-3 text-center">
                  <span>Join as University</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
                <Link to="/register" className="group px-8 md:px-10 py-4 md:py-5 bg-white border-2 border-black text-black rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 text-center">
                  Join as Industry
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative h-[250px] md:h-[300px] lg:h-[450px] w-full">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-[var(--accent-primary)] opacity-10 blur-2xl rounded-[2.5rem] animate-pulse"></div>
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-10px_rgba(0,0,0,0.15)] border-2 border-white animate-in zoom-in-95 duration-1000">
                <img
                  src="/images/hero_realistic.png"
                  alt="Professional Collaboration"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hidden md:block">
                  <p className="text-white font-black uppercase tracking-[0.3em] text-[7px] mb-1">Network Protocol</p>
                  <p className="text-blue-100 text-[10px] font-bold">Secure cross-sector data exchange.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Industry Section - Infinite Slider */}
      <section className="py-24 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <p className="text-center text-[12px] font-black text-black uppercase tracking-[0.5em]">Empowering Excellence Across Global Partners</p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee flex items-center space-x-32 whitespace-nowrap px-16">
            {['Microsoft', 'Amazon', 'Google', 'IBM', 'Intel', 'Oracle', 'Cisco', 'Meta', 'Apple', 'NVIDIA'].map((brand, i) => (
              <div key={i} className="text-5xl font-black text-black/90 hover:text-blue-600 transition-colors cursor-default tracking-tighter">
                {brand}
              </div>
            ))}
            {/* Duplicate for infinite loop */}
            {['Microsoft', 'Amazon', 'Google', 'IBM', 'Intel', 'Oracle', 'Cisco', 'Meta', 'Apple', 'NVIDIA'].map((brand, i) => (
              <div key={`dup-${i}`} className="text-5xl font-black text-black/90 hover:text-blue-600 transition-colors cursor-default tracking-tighter">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use This Website Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--accent-primary)] mb-6 uppercase tracking-tight">Why Choose AICON?</h2>
            <p className="text-[var(--text-secondary)] font-medium text-lg italic">We provide a space for businesses and academic institutions to collaborate, share knowledge, and develop solutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🚀"
              title="Drive Innovation"
              desc="Accelerate growth by connecting industrial needs with top-tier academic research and talent."
            />
            <FeatureCard
              icon="🌉"
              title="Bridge The Gap"
              desc="A seamless bridge between theoretical knowledge and practical industrial application."
            />
            <FeatureCard
              icon="🌍"
              title="Solve Challenges"
              desc="Collaborate on real-world challenges to develop sustainable solutions for the future."
            />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-32 bg-[var(--accent-primary)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-left text-white space-y-6">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Learn how to<br />
                <span className="text-blue-400">Achieve your dream</span><br />
                Video here
              </h2>
              <p className="text-blue-100 text-lg font-medium max-w-xl">
                Watch our professional overview to understand how AICON transforms the collaborative landscape between developers, researchers, and enterprises.
              </p>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 group relative">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="AICON Overview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--accent-primary)]">What Our Customers Said</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <TestimonialCard
              name="Dr. Sarah Chen"
              role="Head of Research, Tech University"
              text="AICON has revolutionized how we secure industrial funding for our semester projects. The bridge is finally here."
            />
            <TestimonialCard
              name="James Wilson"
              role="CTO, Innovate Corp"
              text="Finding specialized talent through the recruitment portal has saved our HR department months of traditional searching."
            />
            <TestimonialCard
              name="Prof. Ahmed Khan"
              role="Dean, Engineering Faculty"
              text="The transparency in collaboration protocols makes it easy for our faculty to engage with top-tier industrial partners."
            />
          </div>
        </div>
      </section>

      {/* Metrics (Hidden as per user request to follow template which doesn't emphasize them as much, or moved to Footer) */}

      {/* FAQ Section Placeholder */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase text-[var(--accent-primary)]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "How can universities join AICON?", a: "Universities can register through our dedicated portal to start showcasing student projects and research." },
              { q: "What industries are currently partners?", a: "We partner with leading tech, engineering, and research firms globally across multiple sectors." },
              { q: "Is there a fee for academic institutions?", a: "Basic collaboration protocols are open to all accredited institutions, with premium placement available." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="font-black text-sm uppercase tracking-tight text-blue-600 mb-2">{faq.q}</p>
                <p className="text-[var(--text-secondary)] text-sm font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="py-24 px-6 md:px-0">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-[var(--accent-primary)] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
              Ready to try-out<br />this platform?
            </h2>
            <p className="text-blue-100 text-lg mb-12 max-w-xl mx-auto font-medium">
              Join thousands of researchers and industrial leaders building the future together on AICON.
            </p>
            <Link to="/register" className="inline-block px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl active:scale-95">
              Create Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="group p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:border-blue-500/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-black text-[var(--accent-primary)] mb-4 uppercase tracking-tight">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, text }) {
  return (
    <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
      <div className="w-12 h-1 bg-blue-600 mb-6 rounded-full"></div>
      <p className="text-[var(--text-secondary)] italic text-sm mb-8 leading-relaxed">"{text}"</p>
      <div className="mt-auto">
        <p className="text-xs font-black uppercase text-[var(--text-primary)] tracking-widest">{name}</p>
        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{role}</p>
      </div>
    </div>
  );
}

export default Home;