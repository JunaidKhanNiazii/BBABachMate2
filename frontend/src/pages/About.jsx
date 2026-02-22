import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-blue-500/30 overflow-x-hidden flex flex-col justify-center py-20">
      {/* Background Subtle Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        {/* About Hero Section - Centered Typographic */}
        <div className="text-center max-w-4xl mx-auto mb-20 md:mb-24">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Our Strategic Identity</span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.95] md:leading-[0.85] text-black animate-in fade-in slide-in-from-top-8 duration-1000 mb-10">
            AICON <span className="text-blue-600">Impact</span>
          </h1>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <p className="text-base md:text-xl font-bold leading-tight max-w-2xl mx-auto text-black">
              Facilitating high-level collaboration between industrial progress and academic research.
            </p>
            <p className="text-[var(--text-secondary)] text-[11px] md:text-sm font-medium leading-relaxed max-w-2xl mx-auto italic border-l-4 border-blue-600 pl-4 text-left">
              AICON – Academia Industry Collaboration Network is a platform that bridges the gap, offering consulting services that drive innovation and growth.
              We provide a space for businesses and academic institutions to collaborate, share
              knowledge, and develop solutions that address real-world challenges.
            </p>
            <div className="pt-6">
              <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl hover:shadow-blue-600/40">
                Initiate Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section - Enhanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 border-t border-gray-100 pt-16">
          <div className="space-y-4 group p-6 rounded-3xl hover:bg-gray-50 transition-all duration-500">
            <div className="text-5xl font-black text-blue-600/5 group-hover:text-blue-600/10 transition-colors uppercase tracking-widest leading-none">01</div>
            <h2 className="text-lg font-black uppercase tracking-tight text-black border-b-2 border-blue-600 pb-2 inline-block">Mission</h2>
            <p className="text-[var(--text-secondary)] text-[13px] font-medium leading-relaxed">
              To bridge the gap between academia and industry by providing seamless collaboration
              opportunities, fostering innovation, and empowering students and professionals
              through internships, research partnerships, and skill development programs.
            </p>
          </div>

          <div className="space-y-4 group p-6 rounded-3xl hover:bg-gray-50 transition-all duration-500">
            <div className="text-5xl font-black text-blue-600/5 group-hover:text-blue-600/10 transition-colors uppercase tracking-widest leading-none">02</div>
            <h2 className="text-lg font-black uppercase tracking-tight text-black border-b-2 border-blue-600 pb-2 inline-block">Vision</h2>
            <p className="text-[var(--text-secondary)] text-[13px] font-medium leading-relaxed">
              To become the leading platform in Pakistan that empowers universities and industries
              to collaborate effectively, fostering innovation, skill development, and sustainable
              growth.
            </p>
          </div>

          <div className="space-y-4 group p-6 rounded-3xl hover:bg-gray-50 transition-all duration-500">
            <div className="text-5xl font-black text-blue-600/5 group-hover:text-blue-600/10 transition-colors uppercase tracking-widest leading-none">03</div>
            <h2 className="text-lg font-black uppercase tracking-tight text-black border-b-2 border-blue-600 pb-2 inline-block">Strategic Goals</h2>
            <p className="text-[var(--text-secondary)] text-[13px] font-medium leading-relaxed">
              We are constantly evolving our platform to integrate cutting-edge research modules,
              AI-driven talent matching, and strategic procurement protocols that define the next
              era of industrial excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;