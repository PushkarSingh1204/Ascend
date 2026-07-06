// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { getProfile, updateProfile } from '../services/db';
import { 
  User, 
  Settings, 
  Flame, 
  Calendar, 
  Award, 
  Compass, 
  ShieldCheck,
  CreditCard,
  Bell,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useAuth();
  const { level, streak, longestStreak, daysToAscend } = useGame();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Preferences toggles
  const [morningReminder, setMorningReminder] = useState(true);
  const [nightReminder, setNightReminder] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  
  // Profile information
  const [nameInput, setNameInput] = useState('');
  const [isPlus, setIsPlus] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setIsPlus(profile.is_premium || false);
      setNameInput(profile.name || '');
      if (profile.preferences) {
        setMorningReminder(profile.preferences.morningReminder);
        setNightReminder(profile.preferences.nightReminder);
        setWeeklyDigest(profile.preferences.weeklyDigest);
      }
    }
  }, [user]);

  // Handle immediate re-onboarding trigger if query param present
  useEffect(() => {
    if (searchParams.get('action') === 'reonboard') {
      navigate('/onboarding?re=true');
    }
  }, [searchParams]);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    const updated = updateProfile({
      name: nameInput,
      preferences: {
        morningReminder,
        nightReminder,
        weeklyDigest
      }
    });
    setUser(prev => ({ ...prev, profile: updated }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          Profile Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your daily reminders, preferences, and Ascend Plus membership.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Card (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Avatar Profile Box */}
          <div className="glassmorphism border border-border p-6 rounded-2xl text-center flex flex-col items-center shadow-xl bg-card">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/25 border-2 border-white/10 mb-4">
              {user?.profile?.name?.substring(0, 2).toUpperCase() || 'TR'}
            </div>
            
            <h2 className="text-lg font-black text-foreground">{user?.profile?.name || 'Transformer'}</h2>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mt-1">
              Member since: {user?.profile?.join_date || 'May 2026'}
            </span>

            {/* Premium tag status */}
            <div className="mt-4 w-full">
              {isPlus ? (
                <div className="py-2.5 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="fill-indigo-400/20" />
                  Ascend Plus Active
                </div>
              ) : (
                <div className="py-2.5 px-4 rounded-xl bg-secondary border border-border text-muted-foreground text-xs font-semibold">
                  Free Member Account
                </div>
              )}
            </div>
          </div>

          {/* Core Stats Shelf */}
          <div className="glassmorphism border border-border p-5 rounded-2xl shadow-xl space-y-4 bg-card">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
              Lifetime stats
            </h3>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Flame size={14} className="text-orange-500" /> Current Streak
                </span>
                <strong className="text-foreground">{streak} days</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award size={14} className="text-yellow-500" /> Longest Streak
                </span>
                <strong className="text-foreground">{longestStreak} days</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-500" /> Days Logged
                </span>
                <strong className="text-foreground">{daysToAscend} days</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Configurations Forms (Right 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ascend Plus Subscription Promo Card */}
          {!isPlus && (
            <div className="glassmorphism p-6 rounded-2xl border border-primary bg-card shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">
                  <Sparkles size={10} />
                  <span>Ascend Plus Subscription</span>
                </div>
                <h3 className="text-lg font-black text-foreground">Unlock Unlimited Facial Scans</h3>
                <p className="text-xs text-muted-foreground max-w-md">
                  Upgrade to Ascend Plus for $4.99/mo to unlock unlimited face scans, advanced analytics charts, and premium skincare posture templates.
                </p>
              </div>

              <button
                onClick={() => navigate('/payments?analysisId=upgrade_profile')}
                className="px-6 py-3 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:opacity-90 transition-colors shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <CreditCard size={14} />
                Get Plus ($4.99)
              </button>
            </div>
          )}

          {/* Preferences forms */}
          <div className="glassmorphism border border-border p-6 rounded-2xl shadow-xl bg-card">
            <h3 className="text-base font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-3">
              <Settings size={18} className="text-primary" />
              General Preferences
            </h3>

            {isSaved && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs font-semibold">
                ✓ Preferences updated successfully.
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-6">
              {/* Profile Details */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Interface Theme preferences */}
              <div className="space-y-2.5 pt-4 border-t border-border">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Interface Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: '🌙 Dark' },
                    { id: 'light', label: '☀️ Light' },
                    { id: 'system', label: '💻 System' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${theme === t.id ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground hover:text-foreground'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification preferences */}
              <div className="space-y-3.5 pt-4 border-t border-border">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1.5">
                  <Bell size={14} className="text-muted-foreground" /> Reminders & Digest Toggles
                </label>
                
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setMorningReminder(!morningReminder)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border text-xs text-left cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-foreground block">Morning Routine Alert</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Send daily morning mewing and cleanse reminder.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${morningReminder ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${morningReminder ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNightReminder(!nightReminder)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border text-xs text-left cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-foreground block">Night Routine Alert</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Send bedtime double-cleanse and posture reminder.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${nightReminder ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${nightReminder ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeeklyDigest(!weeklyDigest)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-background border border-border text-xs text-left cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-foreground block">Weekly Digest Email</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Compile sleep, water, and face symmetry progression.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${weeklyDigest ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${weeklyDigest ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Reset/Re-onboard actions */}
              <div className="space-y-3 pt-4 border-t border-border">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Account Actions</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/profile?action=reonboard')}
                    className="flex-1 py-3 rounded-xl border border-border bg-background hover:bg-secondary/40 text-xs font-bold text-foreground flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    Reset Focus Area (Re-onboard)
                  </button>
                </div>
              </div>

              {/* Save changes CTA */}
              <div className="pt-4 border-t border-border">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Save Settings Preferences
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
