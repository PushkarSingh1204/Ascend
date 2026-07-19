import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { getAnalyses, getWaterLog, getSleepLog, getJournals, getCheckins } from '../services/db';
import { getOptimizedUrl } from '../services/cloudinary';
import { Card, Button, ProgressRing, Badge, Skeleton } from '../components/DesignSystem';
import { recommendationEngine } from '../services/engines/recommendationEngine.js';

import { 
  Flame, 
  Award, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
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

  // Activity Timeline State
  const [timelineItems, setTimelineItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];
      setIsCheckedIn(!!dailyMissions.checkin);
      
      // Fetch latest scan
      const analyses = await getAnalyses();
      let latestScan = null;
      if (Array.isArray(analyses) && analyses.length > 0) {
        setLatestAnalysis(analyses[0]);
        latestScan = analyses[0];
      }

      // Calculate dynamic averages based on DB logs
      const waterLog = await getWaterLog();
      const sleepLog = await getSleepLog();

      // Fetch dynamic recommendations from the engine
      if (user && user.profile) {
        const checkinDates = await getCheckins();
        const recs = await recommendationEngine.run({
          profile: user.profile,
          latestAnalysis: latestScan,
          waterLogs: waterLog ? [waterLog] : [],
          sleepLogs: sleepLog ? [sleepLog] : [],
          checkins: checkinDates || [],
          progressPhotos: []
        });
        setRecommendations(recs || []);
      }

      setWaterAvg(waterLog?.current > 0 ? Math.round((waterLog.current + 1850 * 6) / 7) : 1800);
      setSleepAvg(sleepLog?.current > 0 ? Math.round(((sleepLog.current + 7.4 * 6) / 7) * 10) / 10 : 7.2);

      // Calculate weekly consistency % based on completed tasks
      const safeMilestones = Array.isArray(roadmapMilestones) ? roadmapMilestones : [];
      const completedMilestones = safeMilestones.filter(m => m.completed).length;
      const routinePercent = completedMilestones > 0 ? Math.min(95, 60 + completedMilestones * 5) : 75;
      setWeeklyConsistency(routinePercent);

      // Construct Unified Chronological Activity Timeline
      const items = [];
      const journals = await getJournals();
      const checkinDates = await getCheckins();
      
      // 1. Face Scans
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

      // 2. Journal Entries
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

      // 3. Badges unlocked
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

      // 4. Checkins
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

      // Sort descending by date
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTimelineItems(items.slice(0, 5));
    } catch (err) {
      console.error("Dashboard Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedMissionsCount = Object.values(dailyMissions || {}).filter(Boolean).length;
  const milestonesCount = Array.isArray(roadmapMilestones) ? roadmapMilestones.length : 0;
  const milestonesCompletedCount = Array.isArray(roadmapMilestones) ? roadmapMilestones.filter(m => m.completed).length : 0;
  const badgesCount = Array.isArray(unlockedBadges) ? unlockedBadges.length : 0;

  useEffect(() => {
    fetchDashboardData();
  }, [xp, level, streak, completedMissionsCount, milestonesCount, milestonesCompletedCount, badgesCount]);

  const prevLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpRequiredForNextLevel(level);
  const xpInCurrentLevel = xp - prevLevelXp;
  const xpNeededForNext = nextLevelXp - prevLevelXp;
  const progressPercent = xpNeededForNext > 0 ? Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)) : 0;

  const [animatedXp, setAnimatedXp] = React.useState(0);

  React.useEffect(() => {
    if (xpInCurrentLevel > 0) {
      let start = 0;
      const end = xpInCurrentLevel;
      const step = Math.ceil(end / 30);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          clearInterval(timer);
          setAnimatedXp(end);
        } else {
          setAnimatedXp(start);
        }
      }, 25);
      return () => clearInterval(timer);
    } else {
      setAnimatedXp(0);
    }
  }, [xpInCurrentLevel]);

  // Determine current roadmap stage details
  const safeMilestones = Array.isArray(roadmapMilestones) ? roadmapMilestones : [];
  const nextMilestone = safeMilestones.find(m => !m.completed);
  const currentWeek = nextMilestone ? nextMilestone.week : 4;

  // Daily Transformation Score: computed dynamically
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

  // Determine Next Recommended Action based on uncompleted items or Engine Recommendations
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
    
    // Pull the top recommendation from the intelligence pipeline
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

    if (!dailyMissions.journal) {
      return {
        title: "Log Reflection Journal",
        desc: "Write down your mental focus notes or daily routines feedback.",
        actionText: "Write entry",
        onClick: () => navigate('/journal')
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Skeleton className="md:col-span-3" variant="rect" height="300px" />
          <Skeleton className="md:col-span-2" variant="rect" height="300px" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-12">
      
      {/* 1. STORYTELLING HERO: WHO AM I TODAY? */}
      <section className="flex flex-col lg:flex-row gap-6 justify-between items-stretch">
        
        {/* Profile Card with Circular XP Gauge */}
        <Card className="flex-1 p-6 flex flex-col sm:flex-row items-center gap-6 border-primary/10 shadow-[0_8px_30px_rgba(134,59,255,0.04)] hover:shadow-[0_20px_40px_rgba(134,59,255,0.08)] transition-all duration-500">
          <div className="relative group">
            <ProgressRing percent={progressPercent} size={120} strokeWidth={6}>
              <div className="w-22 h-22 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_20px_rgba(134,59,255,0.25)] relative border border-white/10 group-hover:scale-102 transition-transform duration-500">
                {user?.profile?.name?.substring(0, 2).toUpperCase() || 'TR'}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border border-primary/20 flex items-center justify-center text-xs font-black text-primary shadow-md">
                  {level}
                </div>
              </div>
            </ProgressRing>
          </div>

          <div className="flex-1 space-y-2.5 text-center sm:text-left">
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
              <span className="text-[10px] text-muted-foreground font-bold pl-1">{animatedXp} / {xpNeededForNext} XP to next level</span>
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

      {/* 2. DYNAMIC HABIT GAUGES */}
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

      {/* 3. HABIT ACTIONS & BIOMETRIC DETAILS */}
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
              { id: 'checkin', name: 'Log Daily Check-in', desc: 'Secure streak consistency bonus', xp: 50, path: () => handleCheckin() },
              { id: 'water', name: 'Hydration Target (2L+)', desc: 'Hydrate skin & balance fluid retention', xp: 50, path: () => navigate('/routine') },
              { id: 'sleep', name: 'Log Sleep Hours', desc: 'Ensure recovery cellular regeneration', xp: 50, path: () => navigate('/routine') },
              { id: 'skincare', name: 'Skincare routine completed', desc: 'Ensure daily double-cleanse complete', xp: 50, path: () => navigate('/routine') },
              { id: 'journal', name: 'Write Reflection Journal', desc: 'Maintain mental clarity logging', xp: 100, path: () => navigate('/journal') }
            ].map((mission) => {
              const done = !!dailyMissions[mission.id];
              return (
                <motion.div 
                  whileHover={{ x: done ? 0 : 4, borderColor: done ? 'rgba(255,255,255,0.05)' : 'rgba(134,59,255,0.2)' }}
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

        {/* Latest face scan details */}
        <Card className="md:col-span-2 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
              <Sparkles size={14} className="text-blue-400" />
              Latest Scan Snapshot
            </h3>
            
            {latestAnalysis ? (
              <div className="space-y-4 pt-1">
                <div className="flex gap-4 items-center">
                  {latestAnalysis.front_photo_url && (
                    <div className="w-16 h-20 rounded-xl overflow-hidden border border-border/60 shrink-0 relative bg-neutral-950">
                      <img 
                        src={getOptimizedUrl(latestAnalysis.front_photo_url)} 
                        alt="Latest scan" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center bg-secondary/35 border border-border p-2.5 rounded-xl">
                      <div>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase block">Harmony Score</span>
                        <span className="text-base font-black text-foreground block">{latestAnalysis.facial_harmony_score}%</span>
                      </div>
                      <Badge variant="indigo">{latestAnalysis.potential_label || 'MTN'}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] leading-relaxed">
                  <div className="bg-secondary/15 p-2 rounded-lg border border-border/30">
                    <strong className="text-muted-foreground block uppercase tracking-wider text-[8px] mb-0.5">Symmetry</strong>
                    <span className="text-foreground font-semibold">{latestAnalysis.symmetry_score}% balance</span>
                  </div>
                  <div className="bg-secondary/15 p-2 rounded-lg border border-border/30">
                    <strong className="text-muted-foreground block uppercase tracking-wider text-[8px] mb-0.5">Ratio Proportion</strong>
                    <span className="text-foreground font-semibold">{latestAnalysis.facial_proportion_score}% golden</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground italic">
                No biometric analyses logged yet.
              </div>
            )}
          </div>

          <Button
            variant="secondary"
            onClick={() => navigate('/analysis')}
            className="w-full mt-4"
          >
            <span>{latestAnalysis ? 'Start New Scan' : 'Run First Scan'}</span>
            <ChevronRight size={12} />
          </Button>
        </Card>
      </section>

      {/* 4. COGNITIVE PIPELINE RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            Central Intelligence Layer Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec) => (
              <Card key={rec.id} className="p-5 flex flex-col justify-between border-primary/10 bg-secondary/10 hover:bg-secondary/20 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="indigo" className="text-[8px] font-black tracking-widest">{rec.category.toUpperCase()}</Badge>
                    <span className="text-[10px] font-bold text-neutral-400">Score: {rec.score}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-foreground">{rec.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">{rec.description}</p>
                  </div>
                  <div className="border-t border-border/40 pt-2.5 space-y-1.5">
                    <p className="text-[9px] text-muted-foreground italic">
                      <strong className="text-primary not-italic font-bold">Because:</strong> {rec.reason}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-bold text-neutral-400">
                      <span>Impact: {Array(rec.impact || 3).fill('★').join('')}</span>
                      <span>Confidence: {Math.round((rec.confidence || 0.8) * 100)}%</span>
                      <span>Est: {rec.estimatedTime || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 5. ACTIVITY TIMELINE */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-3 flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          Unified Activity Timeline
        </h3>

        <Card className="p-6">
          <div className="relative border-l border-border ml-3.5 pl-6 space-y-6 py-2">
            {timelineItems.length > 0 ? (
              timelineItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="relative group">
                    <span className={`absolute -left-10 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border shrink-0 z-10 ${item.color}`}>
                      <Icon size={12} />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-xs font-bold text-foreground">{item.title}</span>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground italic">
                No timeline activity logged yet. Complete today's focus goals!
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
