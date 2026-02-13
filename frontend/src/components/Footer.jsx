import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-[var(--accent-primary)] text-white rounded-xl flex items-center justify-center font-black text-xl">A</div>
              <span className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">AI<span className="text-blue-600">CON</span></span>
            </Link>
            <p className="text-[var(--text-secondary)] max-w-sm leading-relaxed font-medium text-sm">
              The premier network for bridging the gap between academia and industry.
              Accelerating innovation through strategic collaboration and shared intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-6 text-[10px] uppercase tracking-[0.2em] text-[var(--text-primary)]">Navigation</h4>
            <ul className="space-y-4 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-tight">
              <li><Link to="/" className="hover:text-blue-600 transition-all">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition-all">About Us</Link></li>
              <li><Link to="/services" className="hover:text-blue-600 transition-all">Services</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600 transition-all">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-[10px] uppercase tracking-[0.2em] text-[var(--text-primary)]">Get in Touch</h4>
            <ul className="space-y-4 text-[var(--text-secondary)] text-sm font-bold tracking-tight">
              <li className="flex items-center space-x-3">
                <span className="text-blue-600">📍</span>
                <span>Innovation District, Tech City 1</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-blue-600">📧</span>
                <a href="mailto:contact@aicon.net" className="hover:text-blue-600 transition-all">contact@aicon.net</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[var(--text-secondary)] text-[10px] uppercase tracking-widest font-black gap-6">
          <p>© 2025 AICON – ACADEMIA INDUSTRY COLLABORATION NETWORK. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-blue-600 transition-all">Twitter</a>
            <a href="#" className="hover:text-blue-600 transition-all">LinkedIn</a>
            <a href="#" className="hover:text-blue-600 transition-all">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;