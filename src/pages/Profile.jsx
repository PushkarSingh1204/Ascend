// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getProfile, updateProfile } from '../services/db';
import { useTheme } from '../context/ThemeContext';
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
    <div className="space-y-8 animate-fade-in text-neutral-100 max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-sm text-neutral-400">
          Manage your daily reminders, preferences, and Ascend Plus membership.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Card (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Avatar Profile Box */}
          <div className="glassmorphism border border-neutral-850 p-6 rounded-2xl text-center flex flex-col items-center shadow-xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-500/25 border-2 border-white/10 mb-4">
              {user?.profile?.name?.substring(0, 2).toUpperCase() || 'TR'}
            </div>
            
            <h2 className="text-lg font-black text-white">{user?.profile?.name || 'Transformer'}</h2>
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block mt-1">
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
                <div className="py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-semibold">
                  Free Member Account
                </div>
              )}
            </div>
          </div>

          {/* Core Stats Shelf */}
          <div className="glassmorphism border border-neutral-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
              Lifetime stats
            </h3>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <Flame size={14} className="text-orange-500" /> Current Streak
                </span>
                <strong className="text-white">{streak} days</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <Award size={14} className="text-yellow-500" /> Longest Streak
                </span>
                <strong className="text-white">{longestStreak} days</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-500" /> Days Logged
                </span>
                <strong className="text-white">{daysToAscend} days</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Configurations Forms (Right 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ascend Plus Subscription Promo Card */}
          {!isPlus && (
            <div className="glassmorphism p-6 rounded-2xl border border-indigo-900 bg-gradient-to-tr from-[#0a0a14] via-indigo-950/20 to-[#0a0a14] shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                  <Sparkles size={10} />
                  <span>Ascend Plus Subscription</span>
                </div>
                <h3 className="text-lg font-black text-white">Unlock Unlimited Facial Scans</h3>
                <p className="text-xs text-neutral-400 max-w-md">
                  Upgrade to Ascend Plus for $4.99/mo to unlock unlimited face scans, advanced analytics charts, and premium skincare posture templates.
                </p>
              </div>

              <button
                onClick={() => navigate('/payments?analysisId=upgrade_profile')}
                className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-500/10 flex items-center gap-1.5 shrink-0"
              >
                <CreditCard size={14} />
                Get Plus ($4.99)
              </button>
            </div>
          )}

          {/* Preferences forms */}
          <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Settings size={18} className="text-blue-400" />
              General Preferences
            </h3>

            {isSaved && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                ✓ Preferences updated successfully.
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-6">
              {/* Profile Details */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Interface Theme preferences */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-900/60">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Interface Theme</label>
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
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${theme === t.id ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300' : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification preferences */}
              <div className="space-y-3.5 pt-4 border-t border-neutral-900/60">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Bell size={14} className="text-neutral-500" /> Reminders & Digest Toggles
                </label>
                
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setMorningReminder(!morningReminder)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-950/40 border border-neutral-900 text-xs text-left"
                  >
                    <div>
                      <span className="font-bold text-white block">Morning Routine Alert</span>
                      <span className="text-[10px] text-neutral-500 mt-0.5 block">Send daily morning mewing and cleanse reminder.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${morningReminder ? 'bg-blue-500' : 'bg-neutral-800'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${morningReminder ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNightReminder(!nightReminder)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-950/40 border border-neutral-900 text-xs text-left"
                  >
                    <div>
                      <span className="font-bold text-white block">Night Routine Alert</span>
                      <span className="text-[10px] text-neutral-500 mt-0.5 block">Send night skincare checks reminder.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${nightReminder ? 'bg-blue-500' : 'bg-neutral-800'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${nightReminder ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeeklyDigest(!weeklyDigest)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-950/40 border border-neutral-900 text-xs text-left"
                  >
                    <div>
                      <span className="font-bold text-white block">Weekly Review Digest</span>
                      <span className="text-[10px] text-neutral-500 mt-0.5 block">Receive weekly averages & streak milestone summary.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${weeklyDigest ? 'bg-blue-500' : 'bg-neutral-800'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${weeklyDigest ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Monthly re-onboarding trigger */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-900 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Info size={12} className="text-neutral-400" /> Redefine focus goals
                </span>
                <p className="text-[10px] text-neutral-500 leading-normal">
                  Redefining your focus area wipes current completed markers and generates a fresh 30-day coach roadmap tailored to your updated targets.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/onboarding?re=true')}
                  className="px-4 py-2 rounded-lg border border-neutral-850 hover:border-neutral-700 bg-neutral-900 text-[10px] font-bold text-white transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={12} />
                  Redefine Journey Focus
                </button>
              </div>

              {/* Submit preferences */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-md shadow-blue-500/10"
              >
                Save Preferences
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
