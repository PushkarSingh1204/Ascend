import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getAnalyses, getWaterLog, getSleepLog, getJournals, getCheckins } from '../services/db';
import { getOptimizedUrl } from '../services/cloudinary';
import { Card, Button, Badge, Skeleton } from '../components/DesignSystem';
import { recommendationEngine } from '../services/engines/recommendationEngine.js';
import { getFacialHarmonyRating } from '../utils/facialHarmonyScale';
import XpProgressBar from '../components/game/XpProgressBar';
import PotentialForecastCard from '../components/game/PotentialForecastCard';

import { 
  Flame, 
  Award, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Activity,
  TrendingUp,
  Compass,
  BookOpen,
  Calendar,
  Zap,
  ArrowRight
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
    performDailyCheckin
  } = useGame();

  const navigate = useNavigate();

  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [waterLog, setWaterLog] = useState({ current: 0, target: 2000 });
  const [sleepLog, setSleepLog] = useState({ current: 0, target: 8.0 });
  const [timelineItems, setTimelineItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Checks if user checked in today
  const todayStr = new Date().toISOString().split('T')[0];
  const isCheckedIn = user?.profile?.last_active_date === todayStr && dailyMissions?.checkin;

  // Calculates weekly consistency %
  const weeklyConsistency = user?.profile?.streak ? Math.min(100, Math.round((user.profile.streak / 7) * 100)) : 71;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch latest scan and history
      const analyses = await getAnalyses();
      if (Array.isArray(analyses) && analyses.length > 0) {
        setAnalysisHistory(analyses);
        setLatestAnalysis(analyses[0]);
      }

      // 2. Fetch Logs
      const water = await getWaterLog();
      if (water) setWaterLog(water);

      const sleep = await getSleepLog();
      if (sleep) setSleepLog(sleep);

      // 3. Run Recommendation Engine
      if (user?.profile) {
        const recs = await recommendationEngine.run({
          profile: user.profile,
          latestAnalysis: analyses && analyses[0] ? analyses[0] : null,
          waterLog: water || { current: 0, target: 2000 },
          sleepLog: sleep || { current: 0, target: 8.0 }
        });
        setRecommendations(recs || []);
      }

      // 4. Build Recent Activity Timeline
      const items = [];
      const journals = await getJournals();
      const checkinDates = await getCheckins();
      
      const safeAnalyses = Array.isArray(analyses) ? analyses : [];
      safeAnalyses.forEach(scan => {
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

      const safeJournals = Array.isArray(journals) ? journals : [];
      safeJournals.forEach((entry) => {
        items.push({
          id: `t_journal_${entry.id}`,
          type: 'journal',
          title: 'Reflective Journal Entry',
          desc: `Logged mood: "${entry.mood || 'Normal'}" - ${(entry.notes || '').substring(0, 50)}...`,
          date: entry.date,
          icon: BookOpen,
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
        });
      });

      const safeBadges = Array.isArray(unlockedBadges) ? unlockedBadges : [];
      safeBadges.forEach(badgeId => {
        items.push({
          id: `t_badge_${badgeId}`,
          type: 'badge',
          title: 'Milestone Badge Unlocked',
          desc: `Earned "${badgeId.replace(/_/g, ' ').toUpperCase()}" achievement!`,
          date: todayStr,
          icon: Award,
          color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
        });
      });

      const safeCheckins = Array.isArray(checkinDates) ? checkinDates : [];
      safeCheckins.forEach(date => {
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

      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTimelineItems(items.slice(0, 5));
    } catch (err) {
      console.error("Dashboard Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedMissionsCount = Object.values(dailyMissions || {}).filter(Boolean).length;

  useEffect(() => {
    fetchDashboardData();
  }, [xp, level, streak, completedMissionsCount]);

  const safeMilestones = Array.isArray(roadmapMilestones) ? roadmapMilestones : [];
  const nextMilestone = safeMilestones.find(m => !m.completed);
  const currentWeek = nextMilestone ? nextMilestone.week : 4;

  const dailyTransformationScore = Math.min(100, Math.round(
    (completedMissionsCount / 5) * 35 + (weeklyConsistency) * 0.65
  ));

  const handleCheckin = async () => {
    if (isCheckedIn) return;
    await performDailyCheckin("Quick check-in completed from dashboard.");
    await fetchDashboardData();
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getNextRecommendedAction = () => {
    if (!isCheckedIn) {
      return {
        title: "Log Today's Check-in",
        desc: "Complete your morning and night habit logs to maintain your consistency streak.",
        actionText: "Verify habits now",
        onClick: () => handleCheckin()
      };
    }
    if (!latestAnalysis) {
      return {
        title: "Run First Biometric Scan",
        desc: "Upload a frontal and profile view photo to map your baseline facial proportions.",
        actionText: "Start scan",
        onClick: () => navigate('/analysis')
      };
    }
    if (recommendations && recommendations.length > 0) {
      const topRec = recommendations[0];
      return {
        title: topRec.title,
        desc: `${topRec.description} | Reason: ${topRec.reason}`,
        actionText: `Focus on ${topRec.category.toUpperCase()}`,
        onClick: () => {
          if (['skincare', 'sleep', 'posture', 'fitness'].includes(topRec.category)) {
            navigate('/routine');
          } else {
            navigate('/roadmap');
          }
        }
      };
    }
    return {
      title: "View Current Roadmap",
      desc: "All daily targets are clear. Check your upcoming milestone routines for this week.",
      actionText: "Open roadmap",
      onClick: () => navigate('/roadmap')
    };
  };

  const nextAction = getNextRecommendedAction();

  if (loading) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton variant="rect" height="120px" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton variant="rect" height="100px" />
          <Skeleton variant="rect" height="100px" />
          <Skeleton variant="rect" height="100px" />
          <Skeleton variant="rect" height="100px" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-12">
      
      {/* 1. STORYTELLING HERO: WHO AM I TODAY? */}
      <section className="flex flex-col lg:flex-row gap-6 justify-between items-stretch">
        
        {/* Profile Card */}
        <Card className="flex-1 p-6 flex flex-col sm:flex-row items-center gap-6 border-primary/10 shadow-xl">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-accent flex items-center justify-center text-white font-black text-2xl shadow-lg relative border border-white/10">
              {user?.profile?.name?.substring(0, 2).toUpperCase() || 'TR'}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border border-primary/20 flex items-center justify-center text-xs font-black text-primary shadow-md">
                {level}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div>
              <h1 className="text-2xl font-black tracking-tight mb-0.5 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                {getGreeting()}, {user?.profile?.name || 'Transformer'}
              </h1>
              <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center sm:justify-start gap-1">
                <span>Active Stage:</span>
                <span className="text-primary font-black uppercase tracking-wider text-[10px]">Week {currentWeek}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">
                  {currentWeek === 1 ? 'Posture Alignment' : currentWeek === 2 ? 'Muscle & Hydration' : currentWeek === 3 ? 'Rest & Skincare' : 'Peak Consistency'}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <Flame size={12} className="fill-orange-400 animate-pulse" />
                <span className="text-[10px] font-black">{streak}d Streak</span>
              </div>
              <Badge variant="indigo">LVL {level}</Badge>
            </div>
          </div>
        </Card>

        {/* Next Recommended Action Command */}
        <Card className="p-6 lg:w-80 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/20 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Next Recommended Step</span>
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
              <Zap size={12} className="text-yellow-400 fill-yellow-400" />
              {nextAction.title}
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {nextAction.desc}
            </p>
          </div>

          <Button 
            variant={isCheckedIn ? 'muted' : 'primary'} 
            className="mt-4" 
            onClick={nextAction.onClick}
          >
            <span>{nextAction.actionText}</span>
            <ArrowRight size={12} />
          </Button>
        </Card>
      </section>

      {/* 2. REBALANCED XP PROGRESS BAR COMPONENT */}
      <section>
        <XpProgressBar />
      </section>

      {/* 3. DYNAMIC HABIT GAUGES */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Transformation Index', val: `${dailyTransformationScore}%`, desc: "Today's habits ratio", icon: Activity, color: 'text-primary', glow: 'shadow-[0_8px_30px_rgba(134,59,255,0.02)]' },
          { label: 'Weekly Consistency', val: `${weeklyConsistency}%`, desc: 'Weekly target completion', icon: TrendingUp, color: 'text-cyan-400', glow: 'shadow-[0_8px_30px_rgba(79,191,255,0.02)]' },
          { label: 'Habit Streak', val: `${streak} Days`, desc: 'Consecutive active log', icon: Flame, color: 'text-orange-400', glow: 'shadow-[0_8px_30px_rgba(249,115,22,0.02)]' },
          { label: 'Est. Days to Ascend', val: `${daysToAscend} Days`, desc: 'Overall horizon target', icon: Award, color: 'text-purple-400', glow: 'shadow-[0_8px_30px_rgba(168,85,247,0.02)]' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} interactive className={`p-5 flex flex-col justify-between h-28 border-border/60 hover:border-primary/10 ${kpi.glow}`}>
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-extrabold">
                  {kpi.label}
                </span>
                <div className={`p-1.5 rounded-lg bg-secondary/50 border border-border/20`}>
                  <Icon size={12} className={kpi.color} />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-foreground block tracking-tight leading-none mb-1">{kpi.val}</span>
                <span className="text-[9px] text-muted-foreground block">{kpi.desc}</span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* 4. PREMIUM AI POTENTIAL FORECAST CARD */}
      <section>
        <PotentialForecastCard 
          profile={user?.profile || {}} 
          latestScan={latestAnalysis} 
          scanHistory={analysisHistory} 
        />
      </section>

      {/* 5. HABIT ACTIONS & BIOMETRIC DETAILS */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Daily Mission checklist */}
        <Card className="md:col-span-3 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Compass size={14} className="text-primary" />
              Daily Focus Missions
            </h3>
            <span className="text-[9px] font-black text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
              {completedMissionsCount}/5 COMPLETED
            </span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'checkin', name: 'Log Daily Check-in', desc: 'Secure streak consistency bonus', xp: 10, path: () => handleCheckin() },
              { id: 'water', name: 'Hydration Target (2L+)', desc: 'Hydrate skin & balance fluid retention', xp: 10, path: () => navigate('/routine') },
              { id: 'sleep', name: 'Log Sleep Hours', desc: 'Ensure recovery cellular regeneration', xp: 15, path: () => navigate('/routine') },
              { id: 'skincare', name: 'Skincare routine completed', desc: 'Ensure daily double-cleanse complete', xp: 15, path: () => navigate('/routine') },
              { id: 'journal', name: 'Write Reflection Journal', desc: 'Maintain mental clarity logging', xp: 10, path: () => navigate('/journal') }
            ].map((mission) => {
              const done = !!dailyMissions[mission.id];
              return (
                <motion.div 
                  whileHover={{ x: done ? 0 : 4 }}
                  onClick={mission.path}
                  key={mission.id} 
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${done ? 'bg-secondary/15 border-border/40 text-muted-foreground/80 opacity-75' : 'bg-secondary/40 border-border text-foreground'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${done ? 'bg-primary border-primary text-white' : 'border-neutral-700 bg-black/25'}`}>
                      {done ? (
                        <CheckCircle2 size={12} className="text-white" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-650"></span>
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {mission.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground block mt-0.5">{mission.desc}</span>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded border shrink-0 ${done ? 'text-muted-foreground/50 border-neutral-800' : 'text-primary bg-primary/5 border-primary/10'}`}>
                    +{mission.xp} XP
                  </span>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Biometric Scan Quick Card */}
        <Card className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                Latest Biometric Scan
              </h3>
              <span className="text-[9px] text-muted-foreground font-semibold">
                {latestAnalysis ? latestAnalysis.date : 'No scan'}
              </span>
            </div>

            {latestAnalysis ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 border border-border">
                  {latestAnalysis.photo_url ? (
                    <img 
                      src={getOptimizedUrl(latestAnalysis.photo_url, { width: 120, height: 120, crop: 'fill', gravity: 'face' })} 
                      alt="Biometric scan" 
                      className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      SCAN
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-foreground">{latestAnalysis.facial_harmony_score}%</span>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {getFacialHarmonyRating(latestAnalysis.facial_harmony_score).tier}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Symmetry: {latestAnalysis.symmetry_score}% | Proportion: {latestAnalysis.facial_proportion_score}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground italic border border-dashed border-border rounded-xl">
                No biometric scan uploaded yet.
              </div>
            )}
          </div>

          <Button 
            variant="secondary" 
            className="w-full justify-center" 
            onClick={() => navigate('/analysis')}
          >
            <span>{latestAnalysis ? 'View Full Biometric Analysis' : 'Run First Scan'}</span>
            <ChevronRight size={14} />
          </Button>
        </Card>
      </section>

    </div>
  );
}
