// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, isOnboarded } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    // Add small delay to simulate server communication
    setTimeout(() => {
      try {
        if (isSignUp) {
          signup(email, password);
          navigate('/onboarding');
        } else {
          login(email, password);
          const savedSession = localStorage.getItem('ascend_session');
          if (savedSession) {
            // Check if profile exists and has focus area
            const dbVal = JSON.parse(localStorage.getItem('ascend_transformation_database'));
            if (dbVal && dbVal.user_profile && dbVal.user_profile.focus_area) {
              navigate('/dashboard');
            } else {
              navigate('/onboarding');
            }
          } else {
            navigate('/onboarding');
          }
        }
      } catch (err) {
        setError('Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login('alex.carter@ascend.app', 'google_auth_placeholder');
      const dbVal = JSON.parse(localStorage.getItem('ascend_transformation_database'));
      if (dbVal && dbVal.user_profile && dbVal.user_profile.focus_area) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-neutral-100 flex flex-col items-center justify-center p-4 relative">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Floating Logo */}
      <div className="flex items-center gap-2 mb-8 cursor-pointer z-10" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          A
        </div>
        <span className="text-xl font-bold tracking-wider text-white">ASCEND</span>
      </div>

      {/* Authentication Card */}
      <div className="w-full max-w-md glassmorphism p-8 rounded-2xl shadow-xl z-10 border border-neutral-800">
        
        {/* Toggle tabs */}
        <div className="flex bg-neutral-950/80 p-1.5 rounded-xl border border-neutral-900 mb-8">
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${!isSignUp ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${isSignUp ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            Create Account
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isSignUp ? 'Begin Your Transformation' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-neutral-400 text-center mb-8">
          {isSignUp ? 'Create your profile to start tracking your self-transformation.' : 'Access your dashboard to update routines, log habits, and track progress.'}
        </p>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950/70 border border-neutral-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950/70 border border-neutral-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-md shadow-blue-600/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
            ) : (
              <>
                {isSignUp ? 'Start Journey' : 'Access Account'}
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-900"></div></div>
          <span className="relative bg-[#0d0d12] px-3 text-[10px] uppercase font-bold tracking-widest text-neutral-500">Or Continue With</span>
        </div>

        {/* Social login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/80 text-sm font-semibold text-neutral-300 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 fill-current text-neutral-400" viewBox="0 0 24 24">
            <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.67 4.5 1.8l2.44-2.44C17.3 1.58 14.92 1 12.24 1 6.64 1 2 5.64 2 11.24s4.64 10.24 10.24 10.24c5.79 0 10.24-4.07 10.24-10.24 0-.69-.08-1.36-.22-1.95H12.24z" />
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}
