// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getAnalyses, getWaterLog, getSleepLog, getJournals, getCheckins } from '../services/db';
import { 
  Flame, 
  Calendar, 
  Award, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Moon,
  Droplet,
  BookOpen,
  Camera,
  Compass,
  Clock,
  TrendingUp,
  Activity,
  Heart
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
  
  // Averages
  const [sleepAvg, setSleepAvg] = useState(7.2);
  const [waterAvg, setWaterAvg] = useState(1800);
  const [weeklyConsistency, setWeeklyConsistency] = useState(75);
  const [journalCompletionRate, setJournalCompletionRate] = useState(60);
  const [routineCompletionRate, setRoutineCompletionRate] = useState(80);

  // Activity Timeline State
  const [timelineItems, setTimelineItems] = useState([]);

  useEffect(() => {
    // Check checkin status
    const todayStr = new Date().toISOString().split('T')[0];
    setIsCheckedIn(dailyMissions.checkin);
    
    // Fetch latest scan
    const analyses = getAnalyses() || [];
    if (analyses.length > 0) {
      setLatestAnalysis(analyses[0]);
    }

    // Calculate dynamic averages based on mock DB logs
    const waterLog = getWaterLog() || { current: 0, target: 2000 };
    const sleepLog = getSleepLog() || { current: 0, target: 8.0 };
    setWaterAvg(waterLog.current > 0 ? Math.round((waterLog.current + 1850 * 6) / 7) : 1800);
    setSleepAvg(sleepLog.current > 0 ? Math.round(((sleepLog.current + 7.4 * 6) / 7) * 10) / 10 : 7.2);

    // Calculate weekly consistency % based on completed tasks
    const completedMilestones = roadmapMilestones.filter(m => m.completed).length;
    const routinePercent = completedMilestones > 0 ? Math.min(95, 60 + completedMilestones * 5) : 75;
    setWeeklyConsistency(routinePercent);

    // Dynamic journal and routines rates
    const journals = getJournals() || [];
    setJournalCompletionRate(Math.min(95, 40 + journals.length * 10));
    setRoutineCompletionRate(Math.min(98, 50 + getCheckins().length * 12));

    // Construct Unified Chronological Activity Timeline
    const items = [];
    
    // 1. Face Scans
    analyses.forEach(scan => {
      items.push({
        id: `t_scan_${scan.id}`,
        type: 'scan',
        title: 'Biometric Face Harmony Scan',
        desc: `Completed scan with ${scan.facial_harmony_score}% Harmony (${scan.potential_label || 'MTN'})`,
        date: scan.date,
        icon: Sparkles,
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      });
    });

    // 2. Journal Entries
    journals.forEach((entry, idx) => {
      items.push({
        id: `t_journal_${idx}`,
        type: 'journal',
        title: 'Reflective Journal Entry',
        desc: `Logged mood: "${entry.mood}" - ${entry.notes?.substring(0, 50)}...`,
        date: entry.date,
        icon: BookOpen,
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      });
    });

    // 3. Badges unlocked
    unlockedBadges.forEach(badgeId => {
      items.push({
        id: `t_badge_${badgeId}`,
        type: 'badge',
        title: 'Milestone Badge Unlocked',
        desc: `Earned "${badgeId.replace(/_/g, ' ').toUpperCase()}" achievement!`,
        date: todayStr, // simplified
        icon: Award,
        color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      });
    });

    // 4. Checkins
    getCheckins().forEach(date => {
      items.push({
        id: `t_check_${date}`,
        type: 'checkin',
        title: 'Daily Habits Check-in',
        desc: 'Morning and night routines marked active & verified.',
        date: date,
        icon: CheckCircle2,
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      });
    });

    // Sort descending by date
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTimelineItems(items.slice(0, 5));

  }, [xp, dailyMissions, roadmapMilestones, unlockedBadges]);

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

  // Daily Transformation Score: computed dynamically
  const dailyTransformationScore = Math.min(100, Math.round(
    (completedMissionsCount / 4) * 35 + (weeklyConsistency) * 0.65
  ));

  const handleCheckin = () => {
    if (isCheckedIn) return;
    performDailyCheckin("Quick check-in completed from dashboard.");
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 pb-12">
      
      {/* 1. HERO SECTION & WELCOME */}
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

        {/* Quick Check-in Button */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between items-stretch lg:w-80 shadow-xl">
          <div>
            <span className="block text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Status Check</span>
            <span className="text-sm font-bold text-white block mt-1">
              {isCheckedIn ? '🎯 Routines logged for today' : '⚡ Pending daily logs'}
            </span>
          </div>

          <button
            onClick={handleCheckin}
            disabled={isCheckedIn}
            className={`w-full py-3 rounded-xl font-bold text-xs transition-all duration-300 mt-4 cursor-pointer ${isCheckedIn ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/25' : 'bg-white text-black hover:bg-neutral-200'}`}
          >
            {isCheckedIn ? 'Check-in Completed' : 'Trigger Daily Check-in'}
          </button>
        </div>
      </section>

      {/* 2. ANALYTICAL KPI METRICS HUB */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Transformation Score', val: `${dailyTransformationScore}/100`, desc: 'Based on checkins & rules', icon: Activity, color: 'text-blue-400' },
          { label: 'Weekly Consistency', val: `${weeklyConsistency}%`, desc: 'Roadmap weekly completion index', icon: TrendingUp, color: 'text-indigo-400' },
          { label: 'Active Streak', val: `${streak} Days`, desc: 'Streaks completed logs', icon: Flame, color: 'text-orange-400' },
          { label: 'Days to Ascend', val: `${daysToAscend} Days`, desc: 'Transformation days tracker', icon: Award, color: 'text-purple-400' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glassmorphism p-5 rounded-2xl border border-neutral-800/80 flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                  {kpi.label}
                </span>
                <Icon size={14} className={kpi.color} />
              </div>
              <div>
                <span className="text-2xl font-black text-white block">{kpi.val}</span>
                <span className="text-[9px] text-neutral-500 block mt-1 leading-normal">{kpi.desc}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. DOUBLE GRID (TODAY'S MISSION & LATEST ANALYSIS) */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left: Daily Missions Checklist */}
        <div className="md:col-span-3 glassmorphism p-6 rounded-2xl border border-neutral-800/80 space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass size={16} className="text-indigo-400" />
              Daily Focus Missions
            </h3>
            <span className="text-[10px] font-bold text-neutral-500">
              {completedMissionsCount}/4 COMPLETED
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'checkin', name: 'Log Daily Check-in', desc: 'Secure streak consistency bonus', xp: 50 },
              { id: 'water', name: 'Hydration Target (2L+)', desc: 'Hydrate skin & balance fluid retention', xp: 50 },
              { id: 'sleep', name: 'Log Sleep Hours', desc: 'Ensure recovery cellular regeneration', xp: 50 },
              { id: 'journal', name: 'Write Reflection Journal', desc: 'Maintain mental clarity logging', xp: 100 }
            ].map((mission) => {
              const done = dailyMissions[mission.id];
              return (
                <div 
                  key={mission.id} 
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${done ? 'bg-neutral-900/40 border-neutral-900 text-neutral-450' : 'bg-transparent border-neutral-850 hover:border-neutral-750 text-neutral-200'}`}
                >
                  <div className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle2 size={16} className="text-indigo-500 shrink-0" />
                    ) : (
                      <Circle size={16} className="text-neutral-600 shrink-0" />
                    )}
                    <div>
                      <span className={`text-xs font-bold block ${done ? 'line-through text-neutral-500' : 'text-white'}`}>
                        {mission.name}
                      </span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">{mission.desc}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 shrink-0">
                    +{mission.xp} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Last Face Analysis Summary */}
        <div className="md:col-span-2 glassmorphism p-6 rounded-2xl border border-neutral-800/80 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-900 pb-3">
              <Sparkles size={16} className="text-blue-400" />
              Latest Scan Snapshot
            </h3>
            
            {latestAnalysis ? (
              <div className="space-y-4 pt-3">
                <div className="flex justify-between items-center bg-neutral-950/40 p-3 rounded-xl border border-neutral-900">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-500 uppercase block">Harmony Score</span>
                    <span className="text-base font-black text-white block mt-0.5">{latestAnalysis.facial_harmony_score}%</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 shrink-0">
                    {latestAnalysis.potential_label || 'MTN'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] text-neutral-400 leading-normal">
                  <div>
                    <strong className="text-neutral-500 block uppercase tracking-wider text-[8px] mb-0.5">Symmetry</strong>
                    <p>{latestAnalysis.symmetry_score}% balanced</p>
                  </div>
                  <div>
                    <strong className="text-neutral-500 block uppercase tracking-wider text-[8px] mb-0.5">Thirds Ratio</strong>
                    <p>{latestAnalysis.facial_proportion_score}% golden split</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-500 italic">
                No biometric analyses logged yet.
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/analysis')}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {latestAnalysis ? 'Start New Scan' : 'Run First Scan'}
            <ChevronRight size={14} />
          </button>
        </div>

      </section>

      {/* 4. CHRONOLOGICAL ACTIVITY TIMELINE */}
      <section className="glassmorphism p-6 rounded-2xl border border-neutral-800/80 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-neutral-900 pb-3 flex items-center gap-2">
          <Activity size={16} className="text-indigo-400" />
          Unified Activity Timeline
        </h3>

        <div className="relative border-l border-neutral-900/80 ml-3.5 pl-6 space-y-6 pt-2">
          {timelineItems.length > 0 ? (
            timelineItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative group">
                  {/* Timeline bullet dot */}
                  <span className={`absolute -left-10 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border shrink-0 z-10 ${item.color}`}>
                    <Icon size={12} />
                  </span>

                  {/* Timeline card contents */}
                  <div className="glassmorphism-interactive p-4 rounded-xl border border-neutral-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <span className="text-xs font-bold text-white block">{item.title}</span>
                      <span className="text-[10px] text-neutral-450 block mt-1">{item.desc}</span>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-500 shrink-0 uppercase tracking-widest bg-neutral-955 px-2 py-0.5 rounded border border-neutral-900">
                      {item.date}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-neutral-500 italic">
              No transformation activities logged in timeline yet. Complete a checklist to begin.
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
