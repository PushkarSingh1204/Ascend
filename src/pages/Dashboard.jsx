// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { BADGES, getAnalyses, getWaterLog, getSleepLog, getJournals } from '../services/db';
import { 
  Flame, 
  Calendar, 
  Award, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  PlusCircle,
  User,
  Compass,
  Moon,
  Droplet,
  BookOpen,
  Camera,
  Layers
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    xp, 
    level, 
    streak, 
    daysToAscend, 
    unlockedBadges, 
    dailyMissions,
    roadmapMilestones,
    roadmapPercent,
    performDailyCheckin,
    getXpForLevel,
    getXpRequiredForNextLevel
  } = useGame();
  
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  
  // Snapshot averages
  const [sleepAvg, setSleepAvg] = useState(7.2);
  const [waterAvg, setWaterAvg] = useState(1800);
  const [weeklyConsistency, setWeeklyConsistency] = useState(75);

  useEffect(() => {
    // Check checkin status
    const todayStr = new Date().toISOString().split('T')[0];
    setIsCheckedIn(dailyMissions.checkin);
    
    // Fetch latest scan
    const analyses = getAnalyses();
    if (analyses && analyses.length > 0) {
      setLatestAnalysis(analyses[0]);
    }

    // Calculate dynamic averages based on mock DB logs
    const waterLog = getWaterLog();
    const sleepLog = getSleepLog();
    setWaterAvg(waterLog.current > 0 ? Math.round((waterLog.current + 1850 * 6) / 7) : 1800);
    setSleepAvg(sleepLog.current > 0 ? Math.round(((sleepLog.current + 7.4 * 6) / 7) * 10) / 10 : 7.2);

    // Calculate weekly consistency % based on completed tasks
    const completedMilestones = roadmapMilestones.filter(m => m.completed).length;
    const routinePercent = completedMilestones > 0 ? Math.min(95, 60 + completedMilestones * 5) : 75;
    setWeeklyConsistency(routinePercent);

  }, [xp, dailyMissions, roadmapMilestones]);

  const prevLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpRequiredForNextLevel(level);
  const xpInCurrentLevel = xp - prevLevelXp;
  const xpNeededForNext = nextLevelXp - prevLevelXp;
  const progressPercent = xpNeededForNext > 0 ? Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)) : 0;

  // Count active daily missions completed
  const completedMissionsCount = Object.values(dailyMissions).filter(Boolean).length;

  // Determine current roadmap stage details
  const nextMilestone = roadmapMilestones.find(m => !m.completed);
  const currentWeek = nextMilestone ? nextMilestone.week : 4;

  const handleCheckin = () => {
    if (isCheckedIn) return;
    performDailyCheckin("Quick check-in completed from dashboard.");
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="flex flex-col lg:flex-row gap-6 justify-between items-stretch">
        
        {/* Welcome & Level progress bar */}
        <div className="flex-1 glassmorphism border border-neutral-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-tr from-neutral-900/60 via-indigo-950/15 to-neutral-900/60 shadow-xl">
          {/* Glowing Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/25 relative border border-white/10 shrink-0">
            {user?.profile?.name?.substring(0, 2).toUpperCase() || 'TR'}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-black text-indigo-400">
              {level}
            </div>
          </div>

          <div className="flex-1 space-y-3 w-full text-center sm:text-left">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white mb-0.5">
                Rise & Focus, {user?.profile?.name || 'Transformer'}
              </h1>
              <p className="text-xs text-neutral-400">
                Stage {currentWeek}: {currentWeek === 1 ? 'Posture Alignment' : currentWeek === 2 ? 'Muscle & Hydration' : currentWeek === 3 ? 'Rest & Skincare' : 'Peak Consistency'}
              </p>
            </div>

            {/* XP progress slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-neutral-500 font-bold">
                <span>LVL {level}</span>
                <span>{xpInCurrentLevel} / {xpNeededForNext} XP</span>
              </div>
              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Streaks Card */}
        <div className="glassmorphism border border-neutral-800 px-6 py-5 rounded-2xl flex items-center justify-around gap-6 lg:w-80 shadow-xl">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2">
              <Flame size={20} className="fill-orange-400 animate-pulse" />
            </div>
            <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Active Streak</span>
            <span className="text-lg font-black text-white mt-0.5 block">{streak} Days</span>
          </div>

          <div className="w-px h-12 bg-neutral-800/80"></div>

          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
              <Calendar size={20} />
            </div>
            <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Days Active</span>
            <span className="text-lg font-black text-white mt-0.5 block">{daysToAscend} Days</span>
          </div>
        </div>
      </section>

      {/* 2. TRANSFORMATION JOURNEY WIDGET */}
      <section className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass size={16} className="text-indigo-400" />
            Transformation Journey Roadmap
          </h3>
          <span className="text-xs font-extrabold text-indigo-400">{roadmapPercent}% Complete</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 bg-neutral-950/40 border border-neutral-900 p-4 rounded-xl">
          <div className="space-y-1 flex-1">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">Next Milestone</span>
            <span className="text-xs font-semibold text-white block">
              {nextMilestone ? nextMilestone.title : 'All Milestones Cleared! Redefine Focus.'}
            </span>
            <p className="text-[11px] text-neutral-400 leading-normal">
              {nextMilestone ? nextMilestone.text : 'Complete monthly re-onboarding in profile settings to start a new 30-day template.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/roadmap')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            Open Roadmap
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-900">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${roadmapPercent}%` }}
          ></div>
        </div>
      </section>

      {/* 3. TRANSFORMATION SNAPSHOT */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Transformation Snapshot</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <div className="glassmorphism p-4 rounded-xl border border-neutral-800/80 text-center">
            <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Consistency</span>
            <span className="text-xl font-black text-blue-400 mt-1 block">{weeklyConsistency}%</span>
            <span className="text-[9px] text-neutral-500 mt-1 block">Weekly Score</span>
          </div>

          <div className="glassmorphism p-4 rounded-xl border border-neutral-800/80 text-center">
            <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Missions Daily</span>
            <span className="text-xl font-black text-indigo-400 mt-1 block">{completedMissionsCount} / 5</span>
            <span className="text-[9px] text-neutral-500 mt-1 block">Completed Today</span>
          </div>

          <div className="glassmorphism p-4 rounded-xl border border-neutral-800/80 text-center">
            <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Sleep Average</span>
            <span className="text-xl font-black text-purple-400 mt-1 block">{sleepAvg} hrs</span>
            <span className="text-[9px] text-neutral-500 mt-1 block">Last 7 Days</span>
          </div>

          <div className="glassmorphism p-4 rounded-xl border border-neutral-800/80 text-center">
            <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Water Average</span>
            <span className="text-xl font-black text-sky-400 mt-1 block">{Math.round(waterAvg/100)/10}L</span>
            <span className="text-[9px] text-neutral-500 mt-1 block">Daily Hydration</span>
          </div>

          <div className="glassmorphism p-4 rounded-xl border border-neutral-800/80 text-center col-span-2 md:col-span-1">
            <span className="block text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Last Face Scan</span>
            <span className="text-xs font-extrabold text-emerald-400 mt-2 block truncate px-1">
              {latestAnalysis ? latestAnalysis.date : 'No scans yet'}
            </span>
            <span className="text-[9px] text-neutral-500 mt-1 block">Harmony Report</span>
          </div>

        </div>
      </section>

      {/* 4. DAILY MISSIONS (TODAY'S TASKS) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Missions Checklist (Left 2 Columns) */}
        <div className="lg:col-span-2 glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              Daily Active Missions
            </h3>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900">
              Completed: {completedMissionsCount} / 5
            </span>
          </div>

          <div className="space-y-3">
            {[
              { key: 'checkin', name: 'Log Daily Attendance', xp: 50, action: handleCheckin, path: null, icon: CheckCircle2, status: isCheckedIn },
              { key: 'sleep', name: 'Log Sleep Duration', xp: 30, action: () => navigate('/routine'), path: '/routine', icon: Moon, status: dailyMissions.sleep },
              { key: 'water', name: 'Reach Water Hydration Target', xp: 30, action: () => navigate('/routine'), path: '/routine', icon: Droplet, status: dailyMissions.water },
              { key: 'skincare', name: 'Complete Skincare Checklists', xp: 40, action: () => navigate('/routine'), path: '/routine', icon: Sparkles, status: dailyMissions.skincare },
              { key: 'journal', name: 'Write Reflection Journal Log', xp: 50, action: () => navigate('/journal'), path: '/journal', icon: BookOpen, status: dailyMissions.journal }
            ].map((mission) => (
              <div 
                key={mission.key}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-xs transition-colors ${mission.status ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-neutral-950/40 border-neutral-900 text-neutral-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mission.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-900 border border-neutral-800 text-neutral-500'}`}>
                    <mission.icon size={16} />
                  </div>
                  <div>
                    <span className={`block font-bold text-white ${mission.status ? 'line-through opacity-50' : ''}`}>
                      {mission.name}
                    </span>
                    <span className="text-[9px] text-neutral-500 mt-0.5 block font-medium">+{mission.xp} XP reward</span>
                  </div>
                </div>

                {mission.status ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> Complete
                  </span>
                ) : (
                  <button
                    onClick={mission.action}
                    className="px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 text-[10px] font-bold hover:text-white transition-colors"
                  >
                    {mission.key === 'checkin' ? 'Check-in' : 'Complete'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Grid (Right Column) */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white">Coach Actions</h3>
          
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button 
              onClick={() => navigate('/analysis')}
              className="glassmorphism-interactive p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2 group"
            >
              <Sparkles size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white block mt-1">Start Scan</span>
            </button>

            <button 
              onClick={() => navigate('/routine')}
              className="glassmorphism-interactive p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2 group"
            >
              <Calendar size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white block mt-1">Check Routines</span>
            </button>

            <button 
              onClick={() => navigate('/journal')}
              className="glassmorphism-interactive p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2 group"
            >
              <BookOpen size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white block mt-1">Write Journal</span>
            </button>

            <button 
              onClick={() => navigate('/progress')}
              className="glassmorphism-interactive p-4 rounded-xl text-center flex flex-col items-center justify-center gap-2 group"
            >
              <Camera size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-white block mt-1">Log Photo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. ACHIEVEMENTS CABINET */}
      <section className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Award size={16} className="text-yellow-400" />
            Earned Milestones
          </h3>
          <p className="text-xs text-neutral-400">
            Unlock achievements through daily transformational focus logs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div 
                key={badge.id}
                title={`${badge.name}: ${badge.description}`}
                className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center relative transition-all duration-300 ${isUnlocked ? 'bg-neutral-900/30 border-yellow-500/20' : 'bg-neutral-950/20 border-neutral-900/50 opacity-20 select-none'}`}
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <span className="block text-[9px] font-extrabold text-white truncate max-w-full">{badge.name}</span>
                <span className="block text-[8px] text-neutral-500 font-medium mt-0.5 tracking-tight">{badge.category}</span>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
