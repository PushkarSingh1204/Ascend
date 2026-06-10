// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { BADGES, getAnalyses } from '../services/db';
import { 
  Flame, 
  Calendar, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  Lock,
  PlusCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    xp, 
    level, 
    streak, 
    daysToAscend, 
    unlockedBadges, 
    performDailyCheckin,
    getXpForLevel,
    getXpRequiredForNextLevel
  } = useGame();
  
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkinNotes, setCheckinNotes] = useState('');
  const [latestAnalysis, setLatestAnalysis] = useState(null);

  // Check if user already checked in today
  useEffect(() => {
    const database = JSON.parse(localStorage.getItem('ascend_transformation_database'));
    if (database && database.checkins) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (database.checkins.includes(todayStr)) {
        setIsCheckedIn(true);
      }
    }
    
    // Fetch latest analysis
    const analyses = getAnalyses();
    if (analyses && analyses.length > 0) {
      setLatestAnalysis(analyses[0]);
    }
  }, [xp]); // re-evaluate when XP changes (checkin updates XP)

  const handleCheckin = (e) => {
    e.preventDefault();
    if (isCheckedIn) return;

    const success = performDailyCheckin(checkinNotes);
    if (success) {
      setIsCheckedIn(true);
      setCheckinNotes('');
    }
  };

  const prevLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpRequiredForNextLevel(level);
  const xpInCurrentLevel = xp - prevLevelXp;
  const xpNeededForNext = nextLevelXp - prevLevelXp;
  const progressPercent = xpNeededForNext > 0 ? Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)) : 0;

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100">
      
      {/* Welcome & Streak Banner */}
      <section className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1.5">
            Welcome Back, {user?.profile?.name || 'Transformer'}
          </h1>
          <p className="text-sm text-neutral-400">
            "Your appearance is a reflection of your daily consistency." Keep rising.
          </p>
        </div>

        {/* Dynamic streaks display */}
        <div className="flex items-center gap-4 bg-neutral-900/40 border border-neutral-800/80 px-4 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame size={20} className="fill-orange-400 animate-pulse" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Active Streak</span>
              <span className="text-sm font-extrabold text-white">{streak} Days</span>
            </div>
          </div>

          <div className="w-px h-8 bg-neutral-800"></div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Days to Ascend</span>
              <span className="text-sm font-extrabold text-white">{daysToAscend} Days</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: XP Progress Card & Quick Check-in */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* XP Progression Card */}
        <div className="lg:col-span-2 glassmorphism border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden bg-gradient-to-tr from-neutral-900/60 via-indigo-950/15 to-neutral-900/60 shadow-xl">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">Rank Status</span>
                <h2 className="text-2xl font-black text-white">LEVEL {level} ASCENDER</h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Award size={24} />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>{xpInCurrentLevel} XP accumulated</span>
              <span>Next Level: {xpNeededForNext} XP ({xpNeededForNext - xpInCurrentLevel} remaining)</span>
            </div>
            
            {/* Glow XP Bar */}
            <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900 p-0.5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full glow-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800/40 text-xs text-neutral-400">
            <span>Total Experience: <strong>{xp} XP</strong></span>
            <span>Progress: <strong>{progressPercent}% Complete</strong></span>
          </div>
        </div>

        {/* Quick Check-in Module */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              Daily Check-in
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Confirm your presence today to retain your streak and gain +50 XP.
            </p>
          </div>

          <form onSubmit={handleCheckin} className="space-y-4">
            {!isCheckedIn ? (
              <>
                <input
                  type="text"
                  placeholder="Notes on today's focus (optional)"
                  value={checkinNotes}
                  onChange={(e) => setCheckinNotes(e.target.value)}
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-neutral-600"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-md shadow-blue-500/10"
                >
                  Log Attendance (+50 XP)
                </button>
              </>
            ) : (
              <div className="w-full p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center space-y-2">
                <span className="text-2xl block">🎉</span>
                <span className="block text-xs font-bold text-emerald-400 uppercase tracking-widest">Attendance Recorded</span>
                <span className="block text-[10px] text-neutral-500">Streak updated to {streak} days. Return tomorrow.</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Grid: Actions & Latest Analysis Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quick Actions Card */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Quick Portals</h3>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/analysis')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition-all duration-200 text-left"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-400" />
                Scan Face Harmony
              </span>
              <ChevronRight size={14} className="text-neutral-500" />
            </button>

            <button 
              onClick={() => navigate('/routine')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition-all duration-200 text-left"
            >
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400" />
                Open Routines Log
              </span>
              <ChevronRight size={14} className="text-neutral-500" />
            </button>

            <button 
              onClick={() => navigate('/journal')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition-all duration-200 text-left"
            >
              <span className="flex items-center gap-2">
                <PlusCircle size={14} className="text-purple-400" />
                Write Journal Log
              </span>
              <ChevronRight size={14} className="text-neutral-500" />
            </button>
          </div>
        </div>

        {/* Latest Analysis Summary Widget */}
        <div className="md:col-span-2 glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-bold text-white">Biometric Harmony Estimate</h3>
            {latestAnalysis && (
              <span className="text-[10px] font-bold text-neutral-500">Recorded: {latestAnalysis.date}</span>
            )}
          </div>

          {latestAnalysis ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4">
              <div className="text-center sm:text-left bg-neutral-900/40 border border-neutral-800 p-3.5 rounded-xl">
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Harmony Score</span>
                <span className="text-2xl font-black text-blue-400">{latestAnalysis.facial_harmony_score}%</span>
              </div>
              <div className="text-center sm:text-left bg-neutral-900/40 border border-neutral-800 p-3.5 rounded-xl">
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Symmetry</span>
                <span className="text-2xl font-black text-indigo-400">{latestAnalysis.symmetry_score}%</span>
              </div>
              <div className="text-center sm:text-left bg-neutral-900/40 border border-neutral-800 p-3.5 rounded-xl">
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Proportions</span>
                <span className="text-2xl font-black text-purple-400">{latestAnalysis.facial_proportion_score}%</span>
              </div>
              <div className="text-center sm:text-left bg-neutral-900/40 border border-neutral-800 p-3.5 rounded-xl">
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Potential</span>
                <span className="text-2xl font-black text-emerald-400">{latestAnalysis.improvement_potential_score}%</span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-neutral-500 text-xs italic">
              No face analysis records found. Complete a scan to calculate structural balance metrics.
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-neutral-900/60">
            <button 
              onClick={() => navigate('/analysis')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Go to Face Harmony Panel
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Achievement Badges Section */}
      <section className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Award size={18} className="text-yellow-400" />
            Ascension Milestones
          </h3>
          <p className="text-xs text-neutral-400">
            Unlock achievement badges by logging daily streaks, completing routines, and saving reflections.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`p-4 rounded-xl border text-center relative flex flex-col items-center justify-between transition-all duration-300 ${isUnlocked ? 'bg-neutral-900/40 border-yellow-500/25 glow-accent' : 'bg-neutral-950/20 border-neutral-900/80 opacity-40'}`}
              >
                {!isUnlocked && (
                  <div className="absolute top-2 right-2 text-neutral-600">
                    <Lock size={12} />
                  </div>
                )}
                
                <span className={`text-3xl block filter drop-shadow-md mb-2 ${isUnlocked ? 'animate-pulse' : 'grayscale'}`}>
                  {badge.icon}
                </span>
                
                <div>
                  <span className="block text-xs font-extrabold text-white truncate max-w-full">{badge.name}</span>
                  <span className="block text-[9px] text-neutral-500 mt-1 leading-normal leading-tight px-1">
                    {badge.description}
                  </span>
                </div>

                <span className={`text-[8px] font-bold uppercase tracking-wider block mt-3 px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500' : 'bg-neutral-900 border border-neutral-800 text-neutral-600'}`}>
                  +{badge.xp} XP
                </span>
              </div>
            );
          })}
        </div>
      </section>
      
    </div>
  );
}
