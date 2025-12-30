import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('industry');

  // Profile Fields
  const [name, setName] = useState(''); // Company Name or University Name
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setError('');
    setLoading(true);

    const profileData = {
      name,
      description,
      location,
      website
    };

    const result = await register(email, password, role, profileData);

    if (result.success) {
      alert('Registration successful! You may need approval before accessing full features.');
      navigate('/login');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-32 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 uppercase">Account <span className="text-blue-600">Registration</span></h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Join the AICON Professional Ecosystem</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-neutral-900/50 p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl mb-12 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-4 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-12">
          <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Account Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('industry')}
              className={`flex flex-col items-start p-6 rounded-xl border transition-all group ${role === 'industry'
                ? 'border-blue-600 bg-blue-600/5 text-white shadow-xl'
                : 'border-white/5 bg-black/40 text-gray-500 hover:border-white/20'
                }`}
            >
              <span className="font-bold text-xs uppercase tracking-widest mb-1">Industry Partner</span>
              <span className="text-[9px] font-medium text-gray-500 uppercase tracking-tight text-left italic">For corporations and startups.</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('university')}
              className={`flex flex-col items-start p-6 rounded-xl border transition-all group ${role === 'university'
                ? 'border-blue-600 bg-blue-600/5 text-white shadow-xl'
                : 'border-white/5 bg-black/40 text-gray-500 hover:border-white/20'
                }`}
            >
              <span className="font-bold text-xs uppercase tracking-widest mb-1">Academic Partner</span>
              <span className="text-[9px] font-medium text-gray-500 uppercase tracking-tight text-left italic">For universities and research labs.</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="md:col-span-2">
            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Organization Name</label>
            <input
              type="text"
              placeholder={role === 'industry' ? "E.G. GOOGLE CLOUD" : "E.G. HARVARD UNIVERSITY"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-xl text-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-800 font-bold uppercase text-[10px] tracking-widest"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="ADMIN@ORGANIZATION.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-xl text-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-800 font-bold uppercase text-[10px] tracking-widest"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-xl text-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-800 pr-14 font-bold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-800 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-xl text-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-800 pr-14 font-bold"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-800 hover:text-white transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Strategic Mission</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="DESCRIBE YOUR ORGANIZATION'S MISSION..."
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-xl text-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-gray-800 h-32 font-bold uppercase text-[10px] tracking-widest leading-loose"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Register Account'}
        </button>

        <p className="text-center mt-10 text-gray-500 font-bold text-[10px] uppercase tracking-widest leading-loose">
          Already a member?{' '}
          <a href="/login" className="text-white hover:text-blue-500 transition-colors ml-1 border-b border-white/10">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;