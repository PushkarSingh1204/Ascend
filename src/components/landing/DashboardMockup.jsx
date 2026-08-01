// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\DashboardMockup.jsx
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ImageSlider from '../ImageSlider';
import { 
  Sparkles, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  Circle, 
  Award, 
  Activity,
  Zap,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function DashboardMockup() {
  // Parallax Tilt logic using Framer Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="w-full max-w-[1100px] mx-auto relative perspective-[1000px] py-4 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Notification Badge 1 */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 right-4 md:right-8 z-30 bg-card/90 border border-border backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <TrendingUp size={20} strokeWidth={2} />
        </div>
        <div>
          <span className="text-xs text-muted-foreground block font-medium">Symmetry Progress</span>
          <span className="text-sm font-bold text-foreground">+12.4% Consistency</span>
        </div>
      </motion.div>

      {/* Floating Notification Badge 2 */}
      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 left-4 md:left-8 z-30 bg-card/90 border border-border backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
          <Award size={20} strokeWidth={2} />
        </div>
        <div>
          <span className="text-xs text-muted-foreground block font-medium">Achievement Unlocked</span>
          <span className="text-sm font-bold text-foreground">14-Day Streak Bonus</span>
        </div>
      </motion.div>

      {/* Dashboard Main Container with Glassmorphism & Parallax Tilt */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="glass-restricted rounded-3xl p-4 md:p-7 shadow-2xl border border-border relative overflow-hidden"
      >
        {/* Top Header Bar inside Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5 shadow-md shadow-primary/20">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center font-bold text-foreground text-sm">
                A
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Transformation Workspace</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-accent border border-primary/30">
                  Level 12 Ascended
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Client-side AI Biometric & Daily Routine Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-secondary/50 border border-border flex items-center gap-2 text-xs font-semibold text-foreground">
              <Flame size={16} strokeWidth={2} className="text-amber-400" />
              <span>14 Day Streak</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-secondary/50 border border-border flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck size={16} strokeWidth={2} />
              <span>100% Private</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          
          {/* Left Column: Interactive Image Comparison Slider (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <Sparkles size={16} strokeWidth={2} className="text-accent" />
                Biometric Symmetry Baseline & Progress
              </span>
              <span className="text-[11px] text-muted-foreground">Drag slider to compare</span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border bg-background">
              <ImageSlider 
                beforeImage="/looksmaxing_before.jpg"
                afterImage="/looksmaxing_after.jpg"
                beforeLabel="Baseline Photo"
                afterLabel="Week 12 Progress"
              />
            </div>
          </div>

          {/* Right Column: Real Application Panels (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4 justify-between">
            
            {/* AI Assistant Insight Panel */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Zap size={15} strokeWidth={2} className="text-primary" />
                  AI Coaching Insight
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  Active Optimization
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Facial landmark symmetry check shows a <strong className="text-foreground">4.2% alignment enhancement</strong> around jawline contours compared to baseline week.
              </p>
            </div>

            {/* Standardized 0-8 Rating Scale Badge */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-primary tracking-widest block mb-0.5">
                  Facial Harmony Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-foreground">88 / 100</span>
                  <span className="text-[10px] font-bold text-emerald-400">Top 14% Rank</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Tier 6 • Chadlite
              </span>
            </div>

            {/* Today's Habits Checklist */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Today's Routine Focus</span>
                <span className="text-[11px] font-bold text-primary">3/4 Completed</span>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Morning Posture Check', done: true, xp: '+50 XP' },
                  { title: 'Hydration Target (2.5L)', done: true, xp: '+50 XP' },
                  { title: 'Daily Symmetry Scan', done: true, xp: '+100 XP' },
                  { title: 'Evening Reflection Journal', done: false, xp: '+75 XP' },
                ].map((habit, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      habit.done 
                        ? 'bg-card border-border text-muted-foreground' 
                        : 'bg-card/50 border-border/80 text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {habit.done ? (
                        <CheckCircle2 size={16} strokeWidth={2} className="text-emerald-400" />
                      ) : (
                        <Circle size={16} strokeWidth={2} className="text-muted-foreground" />
                      )}
                      <span className={habit.done ? 'line-through' : 'font-medium'}>{habit.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {habit.xp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Progress Metrics Bar */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity size={18} strokeWidth={2} className="text-accent" />
                <span className="font-semibold text-foreground">Weekly Compliance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden border border-border">
                  <div className="w-[88%] h-full bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>
                <span className="font-bold text-foreground">88%</span>
              </div>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}
