import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-blue-500/30 overflow-x-hidden flex flex-col justify-center py-20 relative">
      {/* Background Subtle Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* About Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-14 md:mb-24">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 mb-5">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-blue-800 uppercase tracking-widest">Our Strategic Identity</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.95] md:leading-[0.85] text-black animate-in fade-in slide-in-from-top-8 duration-1000 mb-8">
            AICON <span className="text-blue-600">Impact</span>
          </h1>

          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <p className="text-sm sm:text-base md:text-xl font-bold leading-tight max-w-2xl mx-auto text-black">
              Facilitating high-level collaboration between industrial progress and academic research.
            </p>
            <p className="text-[var(--text-secondary)] text-[11px] md:text-sm font-medium leading-relaxed max-w-2xl mx-auto italic border-l-4 border-blue-600 pl-4 text-left">
              AICON – Academia Industry Collaboration Network is a platform that bridges the gap, offering consulting services that drive innovation and growth.
              We provide a space for businesses and academic institutions to collaborate, share
              knowledge, and develop solutions that address real-world challenges.
            </p>
            <div className="pt-4">
              <Link to="/contact" className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl hover:shadow-blue-600/40">
                Initiate Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 border-t border-gray-100 pt-12">
          {[
            {
              num: '01',
              title: 'Mission',
              text: 'To bridge the gap between academia and industry by providing seamless collaboration opportunities, fostering innovation, and empowering students and professionals through internships, research partnerships, and skill development programs.'
            },
            {
              num: '02',
              title: 'Vision',
              text: 'To become the leading platform in Pakistan that empowers universities and industries to collaborate effectively, fostering innovation, skill development, and sustainable growth.'
            },
            {
              num: '03',
              title: 'Strategic Goals',
              text: 'We are constantly evolving our platform to integrate cutting-edge research modules, AI-driven talent matching, and strategic procurement protocols that define the next era of industrial excellence.'
            }
          ].map(({ num, title, text }) => (
            <div key={num} className="space-y-3 group p-5 md:p-6 rounded-3xl hover:bg-gray-50 transition-all duration-500 border border-transparent hover:border-gray-100">
              <div className="text-4xl md:text-5xl font-black text-blue-600/5 group-hover:text-blue-600/10 transition-colors uppercase tracking-widest leading-none">{num}</div>
              <h2 className="text-base md:text-lg font-black uppercase tracking-tight text-black border-b-2 border-blue-600 pb-2 inline-block">{title}</h2>
              <p className="text-[var(--text-secondary)] text-[12px] md:text-[13px] font-medium leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;