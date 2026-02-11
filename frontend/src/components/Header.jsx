import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = React.memo(() => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ];

  const industryLinks = [
    { to: '/jobs', label: 'Browse Jobs', icon: '💼' },
    { to: '/internships', label: 'Internships', icon: '🎓' },
    { to: '/speakers', label: 'Guest Speakers', icon: '🎤' },
    { to: '/research', label: 'Research Papers', icon: '📄' },
    { to: '/challenges', label: 'Industry Challenges', icon: '🏆' },
  ];

  const academicLinks = [
    { to: '/fyps', label: 'Final Year Projects', icon: '🎓' },
    { to: '/projects', label: 'Semester Projects', icon: '📚' },
    { to: '/courses', label: 'Course Catalog', icon: '📖' },
    { to: '/trainings', label: 'Workshops & Training', icon: '🛠️' },
    { to: '/collaborations', label: 'University Collabs', icon: '🤝' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? 'bg-black border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
        : 'bg-black/80 backdrop-blur-md py-4'
        }`}
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="font-black text-xl">A</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              AI<span className="text-blue-500">CON</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Industry Dropdown */}
            {(currentUser && (userProfile?.role === 'admin' || userProfile?.role === 'university')) && (
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown('industry')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  <span>Industry Hub</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'industry' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`absolute left-0 mt-0 w-64 pt-4 transition-all duration-200 ${activeDropdown === 'industry' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  <div className="bg-black border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                    <div className="p-3 mb-2 bg-blue-500/10 rounded-xl">
                      <p className="text-[10px] uppercase tracking-widest font-black text-blue-400 mb-1">Industry Hub</p>
                      <p className="text-xs text-gray-400">Discover professional opportunities</p>
                    </div>
                    {industryLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all group/item"
                      >
                        <span className="text-lg grayscale group-hover/item:grayscale-0 transition-all">{link.icon}</span>
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* University Dropdown */}
            {(currentUser && (userProfile?.role === 'admin' || userProfile?.role === 'industry')) && (
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown('university')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  <span>University Hub</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'university' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`absolute left-0 mt-0 w-64 pt-4 transition-all duration-200 ${activeDropdown === 'university' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  <div className="bg-black border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                    <div className="p-3 mb-2 bg-purple-500/10 rounded-xl">
                      <p className="text-[10px] uppercase tracking-widest font-black text-purple-400 mb-1">University Hub</p>
                      <p className="text-xs text-gray-400">Explore educational resources</p>
                    </div>
                    {academicLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all group/item"
                      >
                        <span className="text-lg grayscale group-hover/item:grayscale-0 transition-all">{link.icon}</span>
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xs">
                    {userProfile?.profile?.name?.charAt(0) || currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white leading-none tracking-tight">
                      {userProfile?.profile?.name || 'User'}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">
                      {userProfile?.role}
                    </span>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  <div className="absolute right-0 mt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 pt-2">
                    <div className="bg-black border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2">
                      <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                        <span className="w-5 h-5 bg-white/5 rounded-lg flex items-center justify-center">🏠</span>
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all mt-1 text-xs font-black uppercase tracking-widest"
                      >
                        <span className="w-5 h-5 bg-red-500/5 rounded-lg flex items-center justify-center">🚪</span>
                        <span>Terminal Exit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:bg-gray-200 transition-all active:scale-95"
                >
                  Join Net
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-6 pb-10 overflow-y-auto relative">
          {/* Close Button Inside Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Mobile Profile if logged in */}
          {currentUser && (
            <div className="flex items-center p-4 bg-white/5 rounded-2xl mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                {userProfile?.profile?.name?.charAt(0)}
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold text-white">{userProfile?.profile?.name}</p>
                <p className="text-xs uppercase tracking-widest text-blue-400 font-bold">{userProfile?.role}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500">Navigation</p>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="block text-2xl font-black text-white">{link.label}</Link>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              {(currentUser && (userProfile?.role === 'admin' || userProfile?.role === 'university')) && (
                <>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-500">Industry Hub</p>
                  <div className="grid grid-cols-1 gap-3">
                    {industryLinks.map((link) => (
                      <Link key={link.to} to={link.to} className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                        <span className="text-xl">{link.icon}</span>
                        <span className="text-lg font-bold">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 pt-4">
              {(currentUser && (userProfile?.role === 'admin' || userProfile?.role === 'industry')) && (
                <>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-purple-500">University Hub</p>
                  <div className="grid grid-cols-1 gap-3">
                    {academicLinks.map((link) => (
                      <Link key={link.to} to={link.to} className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                        <span className="text-xl">{link.icon}</span>
                        <span className="text-lg font-bold">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-auto pt-10 space-y-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="block w-full py-4 bg-blue-600 text-white rounded-2xl text-center font-black">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full py-4 bg-white/5 text-red-400 rounded-2xl text-center font-black">Logout</button>
              </>
            ) : (
              <>
                <Link to="/register" className="block w-full py-4 bg-white text-slate-900 rounded-2xl text-center font-black">Get Started</Link>
                <Link to="/login" className="block w-full py-4 border-2 border-white/10 text-white rounded-2xl text-center font-black">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;