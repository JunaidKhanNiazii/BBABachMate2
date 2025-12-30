import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Navigate to the generic dashboard route which handles redirection based on role
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-6 md:mx-auto pt-32 pb-24">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white mb-3 tracking-tight uppercase">Account <span className="text-blue-600">Login</span></h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">AICON Secure Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-neutral-900/50 p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-sm">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-5 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest flex items-center space-x-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="mb-8">
          <label className="block text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1">Identity Endpoint</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-800 font-bold text-sm"
            placeholder="name@organization.com"
            required
          />
        </div>

        <div className="mb-12">
          <label className="block text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1">Access Protocol</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl text-white focus:border-blue-500 focus:outline-none transition-all pr-14 placeholder:text-gray-800 font-bold text-sm"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-700 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Login'}
        </button>
      </form>

      <p className="text-center mt-10 text-gray-500 font-bold text-[10px] uppercase tracking-widest leading-loose">
        New to AICON?{' '}
        <a href="/register" className="text-white hover:text-blue-500 transition-colors ml-1 border-b border-white/10">
          Create Account
        </a>
      </p>
    </div>
  );
}

export default Login;