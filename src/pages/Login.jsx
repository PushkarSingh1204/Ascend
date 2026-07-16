// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Login.jsx
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/DesignSystem';
import { Lock, Mail, ArrowRight, User } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, loginGoogle, loginAnonymous, user, isOnboarded } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect already authenticated users
  if (user) {
    return <Navigate to={isOnboarded ? '/dashboard' : '/onboarding'} replace />;
  }

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
      } else {
        await login(email, password);
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
    } catch (err) {
      console.error(err);
      setError(err.message || 'Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginAnonymous();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Guest Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative transition-colors duration-300">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Floating Logo */}
      <div className="flex items-center gap-2.5 mb-8 cursor-pointer z-10 select-none" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-650 flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
          A
        </div>
        <span className="text-lg font-black tracking-widest text-foreground uppercase">ASCEND</span>
      </div>

      {/* Authentication Card */}
      <Card className="w-full max-w-md p-8 shadow-2xl z-10">
        
        {/* Toggle tabs */}
        <div className="flex bg-secondary/40 p-1.5 rounded-xl border border-border mb-8">
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${!isSignUp ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${isSignUp ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Create Account
          </button>
        </div>

        <h2 className="text-2xl font-black text-foreground mb-2 text-center tracking-tight">
          {isSignUp ? 'Begin Your Journey' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-muted-foreground text-center mb-8 max-w-xs mx-auto leading-relaxed">
          {isSignUp ? 'Create your profile to start tracking your self-transformation.' : 'Access your dashboard to update routines, log habits, and track progress.'}
        </p>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-normal">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/20 border border-border rounded-xl py-3 pl-11 pr-4 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/20 border border-border rounded-xl py-3 pl-11 pr-4 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder-neutral-600"
              />
            </div>
          </div>

          {/* Action button */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
            ) : (
              <>
                <span>{isSignUp ? 'Start Journey' : 'Access Account'}</span>
                <ArrowRight size={12} className="ml-1" />
              </>
            )}
          </Button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <span className="relative bg-background px-3 text-[9px] uppercase font-black tracking-widest text-muted-foreground">Or Continue With</span>
        </div>

        {/* Social login */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={handleGoogleLogin}
            disabled={loading}
            fullWidth
          >
            <svg className="w-3.5 h-3.5 fill-current text-muted-foreground mr-1" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.67 4.5 1.8l2.44-2.44C17.3 1.58 14.92 1 12.24 1 6.64 1 2 5.64 2 11.24s4.64 10.24 10.24 10.24c5.79 0 10.24-4.07 10.24-10.24 0-.69-.08-1.36-.22-1.95H12.24z" />
            </svg>
            <span>Google</span>
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleGuestLogin}
            disabled={loading}
            fullWidth
          >
            <User size={12} className="text-muted-foreground mr-1" />
            <span>Guest Profile</span>
          </Button>
        </div>

      </Card>
    </div>
  );
}
