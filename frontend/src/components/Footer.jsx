import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 text-white py-20">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black text-xl">A</div>
              <span className="text-2xl font-black tracking-tighter">AI<span className="text-blue-500">CON</span></span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
              The premier intelligence portal for cross-sector innovation and organizational collaboration.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[10px] uppercase tracking-[0.2em] text-blue-500">Infrastructure</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-bold">
              <li><Link to="/" className="hover:text-white transition-all">Portal Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-all">Mission Data</Link></li>
              <li><Link to="/services" className="hover:text-white transition-all">Service Protocols</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-all">Support Desk</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[10px] uppercase tracking-[0.2em] text-gray-400">Networking</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-bold">
              <li><a href="#" className="hover:text-white transition-all">Digital LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-all">Global Network</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-600 text-[10px] uppercase tracking-widest font-black gap-6">
          <p>© 2025 AICON. PLATFORM CORE v4.0</p>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-gray-500">Developed by <span className="text-white">Junaid Ameer Khan</span></p>
            <a href="mailto:jdseller44@gmail.com" className="text-blue-500 hover:text-blue-400 transition-all">jdseller44@gmail.com</a>
          </div>
          <p>AUTHORIZED ACCESS ONLY</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;