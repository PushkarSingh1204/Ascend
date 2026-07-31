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
  Bell
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
      className="w-full max-w-[1100px] mx-auto relative perspective-[1000px] py-4"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Notification Badge 1 */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 right-4 md:right-8 z-30 bg-[#111827]/90 border border-[#374151] backdrop-blur-md p-3.5 rounded-[16px] shadow-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-9 h-9 rounded-xl bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
          <TrendingUp size={20} strokeWidth={2} />
        </div>
        <div>
          <span className="text-xs text-[#94A3B8] block font-medium">Symmetry Progress</span>
          <span className="text-sm font-bold text-[#F8FAFC]">+12.4% Consistency</span>
        </div>
      </motion.div>

      {/* Floating Notification Badge 2 */}
      <motion.div 
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 left-4 md:left-8 z-30 bg-[#111827]/90 border border-[#374151] backdrop-blur-md p-3.5 rounded-[16px] shadow-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center text-[#7C3AED]">
          <Award size={20} strokeWidth={2} />
        </div>
        <div>
          <span className="text-xs text-[#94A3B8] block font-medium">Achievement Unlocked</span>
          <span className="text-sm font-bold text-[#F8FAFC]">14-Day Streak Bonus</span>
        </div>
      </motion.div>

      {/* Dashboard Main Container with Restricted Glassmorphism & Spring Parallax Tilt */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="glass-restricted rounded-[24px] p-4 md:p-7 shadow-2xl border border-white/10 relative overflow-hidden"
      >
        {/* Top Header Bar inside Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#22D3EE] p-0.5">
              <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center font-bold text-[#F8FAFC] text-sm">
                A
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F8FAFC]">Transformation Workspace</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7C3AED]/20 text-[#22D3EE] border border-[#7C3AED]/30">
                  Level 12 Ascended
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">Client-side AI Biometric & Daily Routine Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-[12px] bg-[#0B1020] border border-[#1F2937] flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
              <Flame size={16} strokeWidth={2} className="text-amber-400" />
              <span>14 Day Streak</span>
            </div>
            <div className="px-3 py-1.5 rounded-[12px] bg-[#0B1020] border border-[#1F2937] flex items-center gap-2 text-xs font-semibold text-[#22C55E]">
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
              <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
                <Sparkles size={16} strokeWidth={2} className="text-[#22D3EE]" />
                Biometric Symmetry Baseline & Progress
              </span>
              <span className="text-[11px] text-[#94A3B8]">Drag slider to compare</span>
            </div>

            <div className="rounded-[16px] overflow-hidden border border-[#1F2937] bg-[#0B1020]">
              <ImageSlider 
                beforeImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                afterImage="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
                beforeLabel="Baseline Photo"
                afterLabel="Week 12 Progress"
              />
            </div>
          </div>

          {/* Right Column: Real Application Panels (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4 justify-between">
            
            {/* AI Assistant Insight Panel */}
            <div className="p-4 rounded-[16px] bg-[#0B1020] border border-[#1F2937] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Zap size={15} strokeWidth={2} className="text-[#7C3AED]" />
                  AI Coaching Insight
                </span>
                <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full font-bold">
                  Active Optimization
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Facial landmark symmetry check shows a <strong className="text-[#F8FAFC]">4.2% alignment enhancement</strong> around jawline contours compared to baseline week.
              </p>
            </div>

            {/* Today's Habits Checklist */}
            <div className="p-4 rounded-[16px] bg-[#0B1020] border border-[#1F2937] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F8FAFC]">Today's Routine Focus</span>
                <span className="text-[11px] font-bold text-[#7C3AED]">3/4 Completed</span>
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
                    className={`p-2.5 rounded-[12px] border text-xs flex items-center justify-between transition-colors ${
                      habit.done 
                        ? 'bg-[#111827] border-[#1F2937] text-[#94A3B8]' 
                        : 'bg-[#111827]/50 border-[#374151] text-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {habit.done ? (
                        <CheckCircle2 size={16} strokeWidth={2} className="text-[#22C55E]" />
                      ) : (
                        <Circle size={16} strokeWidth={2} className="text-[#94A3B8]" />
                      )}
                      <span className={habit.done ? 'line-through' : 'font-medium'}>{habit.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded-full">
                      {habit.xp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Progress Metrics Bar */}
            <div className="p-4 rounded-[16px] bg-[#0B1020] border border-[#1F2937] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity size={18} strokeWidth={2} className="text-[#22D3EE]" />
                <span className="font-semibold text-[#F8FAFC]">Weekly Compliance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-[#1F2937] rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] rounded-full"></div>
                </div>
                <span className="font-bold text-[#F8FAFC]">88%</span>
              </div>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}
