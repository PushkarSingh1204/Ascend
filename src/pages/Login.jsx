// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, User } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, loginGoogle, loginAnonymous } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
        navigate('/onboarding');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginAnonymous();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Guest Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative transition-colors duration-350">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Floating Logo */}
      <div className="flex items-center gap-2 mb-8 cursor-pointer z-10" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          A
        </div>
        <span className="text-xl font-bold tracking-wider text-foreground">ASCEND</span>
      </div>

      {/* Authentication Card */}
      <div className="w-full max-w-md glassmorphism p-8 rounded-2xl shadow-xl z-10 border border-border bg-card">
        
        {/* Toggle tabs */}
        <div className="flex bg-background/80 p-1.5 rounded-xl border border-border mb-8">
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${!isSignUp ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${isSignUp ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Create Account
          </button>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          {isSignUp ? 'Begin Your Transformation' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-muted-foreground text-center mb-8">
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
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/70 border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/70 border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-primary-foreground bg-primary hover:opacity-90 transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <span className="relative bg-card px-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Or Continue With</span>
        </div>

        {/* Social login */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-border hover:border-neutral-500 bg-background hover:bg-secondary/45 text-xs font-semibold text-foreground transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-muted-foreground" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.67 4.5 1.8l2.44-2.44C17.3 1.58 14.92 1 12.24 1 6.64 1 2 5.64 2 11.24s4.64 10.24 10.24 10.24c5.79 0 10.24-4.07 10.24-10.24 0-.69-.08-1.36-.22-1.95H12.24z" />
            </svg>
            Google
          </button>
          
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-border hover:border-neutral-500 bg-background hover:bg-secondary/45 text-xs font-semibold text-foreground transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <User size={14} className="text-muted-foreground" />
            Anonymous Guest
          </button>
        </div>

      </div>
    </div>
  );
}
