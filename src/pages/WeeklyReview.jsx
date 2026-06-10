// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\WeeklyReview.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getWaterLog, getSleepLog, getJournals, getRoadmapMilestones, getCheckins } from '../services/db';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { 
  ClipboardCheck, 
  Moon, 
  Droplet, 
  Sparkles, 
  Flame, 
  ChevronLeft, 
  Trophy,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function WeeklyReview() {
  const { user } = useAuth();
  const { xp, level, streak } = useGame();
  const navigate = useNavigate();

  // Metrics states
  const [sleepData, setSleepData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [summary, setSummary] = useState({
    avgSleep: 0,
    waterConsistency: 0,
    routineCompletion: 0,
    xpEarned: 450, // default target achievements
    journalsLogged: 0,
    streakMilestone: ''
  });

  useEffect(() => {
    // 1. Gather sleep log
    const sleep = getSleepLog();
    const water = getWaterLog();
    const journals = getJournals();
    const milestones = getRoadmapMilestones();
    const checkins = getCheckins();

    // Generate last 7 days mock metrics based on user's current inputs for a dynamic feel
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Create curve data for sleep
    const mockSleepHistory = [
      { day: 'Mon', hours: 7.2, target: 8.0 },
      { day: 'Tue', hours: 6.8, target: 8.0 },
      { day: 'Wed', hours: 7.5, target: 8.0 },
      { day: 'Thu', hours: 8.0, target: 8.0 },
      { day: 'Fri', hours: 7.4, target: 8.0 },
      { day: 'Sat', hours: sleep.current > 0 ? sleep.current : 7.0, target: 8.0 },
      { day: 'Sun', hours: 7.8, target: 8.0 }
    ];

    // Create bar data for water
    const mockWaterHistory = [
      { day: 'Mon', amount: 1800, target: 2500 },
      { day: 'Tue', amount: 2000, target: 2500 },
      { day: 'Wed', amount: 2500, target: 2500 },
      { day: 'Thu', amount: 2200, target: 2500 },
      { day: 'Fri', amount: 2600, target: 2500 },
      { day: 'Sat', amount: water.current > 0 ? water.current : 1500, target: 2500 },
      { day: 'Sun', amount: 2300, target: 2500 }
    ];

    setSleepData(mockSleepHistory);
    setWaterData(mockWaterHistory);

    // Calculate aggregates
    const avgSleep = parseFloat((mockSleepHistory.reduce((acc, curr) => acc + curr.hours, 0) / 7).toFixed(1));
    const waterConsistencyDays = mockWaterHistory.filter(w => w.amount >= w.target).length;
    
    const completedMilestones = milestones.filter(m => m.completed).length;
    const totalMilestones = milestones.length;
    const routinePct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    let streakMilestoneText = 'Keep logging in to hit your 7-day streak badge!';
    if (streak >= 7 && streak < 30) {
      streakMilestoneText = '🔥 7-Day Streak Achieved! Next target is 30 days!';
    } else if (streak >= 30) {
      streakMilestoneText = '👑 30-Day Streak Achieved! You are an elite Ascender!';
    }

    setSummary({
      avgSleep,
      waterConsistency: waterConsistencyDays,
      routineCompletion: routinePct,
      xpEarned: 350 + completedMilestones * 75,
      journalsLogged: journals.length,
      streakMilestone: streakMilestoneText
    });
  }, [streak]);

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
          aria-label="Back to Dashboard"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Weekly Review</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Performance Summary
          </h1>
        </div>
      </div>

      {/* Row 1: KPI Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Sleep KPI */}
        <div className="glassmorphism p-5 rounded-2xl border border-neutral-850 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Sleep Average</span>
            <Moon size={14} className="text-purple-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">{summary.avgSleep} hrs</span>
            <span className="block text-[10px] text-neutral-400 mt-1">Goal: 8.0 hrs / night</span>
          </div>
        </div>

        {/* Water KPI */}
        <div className="glassmorphism p-5 rounded-2xl border border-neutral-850 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Hydration Targets</span>
            <Droplet size={14} className="text-sky-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">{summary.waterConsistency} / 7 days</span>
            <span className="block text-[10px] text-neutral-400 mt-1">2.5L target met days</span>
          </div>
        </div>

        {/* Routines KPI */}
        <div className="glassmorphism p-5 rounded-2xl border border-neutral-850 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Roadmap Milestones</span>
            <CheckCircle2 size={14} className="text-indigo-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">{summary.routineCompletion}%</span>
            <span className="block text-[10px] text-neutral-400 mt-1">Milestones completed</span>
          </div>
        </div>

        {/* XP Earned KPI */}
        <div className="glassmorphism p-5 rounded-2xl border border-neutral-850 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">XP Earned</span>
            <Sparkles size={14} className="text-yellow-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">+{summary.xpEarned} XP</span>
            <span className="block text-[10px] text-neutral-400 mt-1">Weekly level progress</span>
          </div>
        </div>

      </section>

      {/* Row 2: Charts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sleep Line Curve Chart */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Moon size={14} className="text-purple-400" />
              Sleep Duration Curve
            </h3>
            <span className="text-[10px] text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded-full border border-purple-500/15 font-semibold">
              Last 7 Days
            </span>
          </div>

          <div className="w-full h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepData} margin={{ left: -25, right: 10, top: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: 10 }} />
                <YAxis domain={[4, 10]} stroke="#6b7280" style={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ background: '#0d0d12', border: '1px solid #2e303a', borderRadius: '12px', fontSize: 11 }}
                />
                <Area type="monotone" dataKey="hours" name="Hours Slept" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#sleepGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Intake Bar Chart */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Droplet size={14} className="text-sky-400" />
              Hydration Intake Consistency
            </h3>
            <span className="text-[10px] text-sky-400 bg-sky-500/5 px-2 py-0.5 rounded-full border border-sky-500/15 font-semibold">
              Last 7 Days
            </span>
          </div>

          <div className="w-full h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: 10 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ background: '#0d0d12', border: '1px solid #2e303a', borderRadius: '12px', fontSize: 11 }}
                />
                <Bar dataKey="amount" name="Water Logged (ml)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* Row 3: Reflections & Streaks Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak Milestones Card */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-4 md:col-span-2 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <Flame size={14} className="text-orange-500 animate-pulse" />
            Streak Milestones
          </h3>
          
          <div className="bg-neutral-950/60 border border-neutral-900 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Trophy size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-normal">
                {summary.streakMilestone}
              </p>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Consistency is key to permanent self-improvement. Check-in daily.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 justify-around text-center pt-2">
            <div>
              <span className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Journals Logged</span>
              <strong className="text-lg font-black text-white">{summary.journalsLogged} Entries</strong>
            </div>
            <div className="w-px h-8 bg-neutral-900"></div>
            <div>
              <span className="block text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Daily focus checks</span>
              <strong className="text-lg font-black text-white">Active</strong>
            </div>
          </div>
        </div>

        {/* Coach Advice Card */}
        <div className="glassmorphism border border-neutral-850 p-6 rounded-2xl shadow-xl flex flex-col justify-between bg-gradient-to-br from-neutral-900/60 via-indigo-950/10 to-neutral-900/60">
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
              <ClipboardCheck size={14} className="text-indigo-400" />
              Coach Reflection
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              "Your sleep habits are stabilizing, but try to drink water earlier in the day to prevent sodium retention. Consistency on mewing checkups will ensure long-term posture alignment benefits."
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-900 mt-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
              A
            </div>
            <span className="text-[10px] font-bold text-neutral-400">Ascend AI Coach System</span>
          </div>
        </div>

      </section>

    </div>
  );
}
