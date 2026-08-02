// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\game\XpProgressBar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Award, Zap, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function XpProgressBar({ compact = false }) {
  const { 
    xp, 
    level, 
    streak, 
    getXpForLevel, 
    getXpRequiredForNextLevel,
    levelUpAlert,
    setLevelUpAlert
  } = useGame();

  const prevLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpRequiredForNextLevel(level);
  const xpInCurrentLevel = xp - prevLevelXp;
  const xpNeededForNext = nextLevelXp - prevLevelXp;

  const rawPercent = xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawPercent)));

  // Smooth animated counter over 1000ms
  const [animatedXp, setAnimatedXp] = useState(xpInCurrentLevel);

  useEffect(() => {
    let start = animatedXp;
    const end = xpInCurrentLevel;
    if (start === end) return;

    const duration = 1000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic easing
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (end - start) * easeProgress);

      setAnimatedXp(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setAnimatedXp(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [xpInCurrentLevel]);

  if (compact) {
    return (
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <div className="flex items-center gap-1.5 text-foreground">
            <Zap size={14} className="text-primary" />
            <span>Level {level}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold">
            {animatedXp} / {xpNeededForNext} XP
          </span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
          >
            <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-pulse" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="matte-card p-6 rounded-3xl border border-border bg-card shadow-2xl relative overflow-hidden space-y-5">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Level Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent p-0.5 shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center font-black text-foreground text-lg">
              {level}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-foreground">Level {level} Transformation</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/15 text-accent border border-primary/30">
                Paced Progression
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Sustainable long-term XP reward curve</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-extrabold flex items-center gap-1.5">
            <Flame size={16} className="fill-orange-400 animate-pulse" />
            <span>{streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-muted-foreground">Progress to Level {level + 1}</span>
          <span className="text-foreground font-extrabold">
            {animatedXp} / {xpNeededForNext} XP ({progressPercent}%)
          </span>
        </div>

        {/* Multi-Layer Animated Bar */}
        <div className="relative w-full h-3.5 bg-secondary rounded-full overflow-hidden border border-border p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-primary via-indigo-500 to-accent rounded-full relative shadow-[0_0_12px_#7C3AED]"
          >
            {/* Shimmer Light Bar */}
            <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-pulse" />
          </motion.div>
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground font-semibold pt-1">
          <span>Level {level} ({prevLevelXp} XP)</span>
          <span>{xpNeededForNext - animatedXp} XP remaining</span>
          <span>Level {level + 1} ({nextLevelXp} XP)</span>
        </div>
      </div>

      {/* Level Up Celebration Modal */}
      <AnimatePresence>
        {levelUpAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="matte-card p-8 max-w-sm w-full text-center space-y-6 bg-card border border-primary/40 shadow-2xl rounded-3xl relative">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center text-accent text-3xl animate-bounce">
                <Trophy size={40} />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-black uppercase tracking-wider">
                  Major Milestone
                </span>
                <h3 className="text-2xl font-black text-foreground">Ascended to Level {levelUpAlert.newLevel}!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your consistency is paying off. Keep building your daily routines to unlock higher tiers.
                </p>
              </div>

              <button
                onClick={() => setLevelUpAlert(null)}
                className="btn-primary-v2 w-full text-center"
              >
                <span>Continue Ascent</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
