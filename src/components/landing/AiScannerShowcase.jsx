// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\AiScannerShowcase.jsx
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Scan, TrendingUp, Award, CheckCircle2, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function AiScannerShowcase() {
  // Parallax Tilt logic using Framer Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 90, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 90, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const scannerTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], [-8, 8]);

  // AI Scan Step Cycle State (0: Scan, 1: Mesh, 2: Score, 3: Recommendations)
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanStep((prev) => (prev + 1) % 4);
    }, 3500); // 14-second full loop cycle
    return () => clearInterval(timer);
  }, []);

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

  // Landmark mesh points for 3D face overlay
  const landmarks = [
    { top: '28%', left: '38%' }, { top: '28%', left: '62%' }, // Eyes
    { top: '45%', left: '50%' },                             // Nose tip
    { top: '62%', left: '42%' }, { top: '62%', left: '58%' }, // Lips
    { top: '78%', left: '50%' },                             // Chin
    { top: '68%', left: '26%' }, { top: '68%', left: '74%' }  // Jawline angles
  ];

  return (
    <div 
      className="w-full max-w-[560px] mx-auto relative perspective-[1200px] py-6 select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* FLOATING KPI CARD 1: Harmony Score */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 -left-4 md:-left-8 z-30 bg-card/90 border border-border backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-black text-sm">
          88
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Harmony Score</span>
          <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
            <TrendingUp size={12} /> 88 / 100 ↑ +5%
          </span>
        </div>
      </motion.div>

      {/* FLOATING KPI CARD 2: Today's Mission */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -top-3 -right-4 md:-right-6 z-30 bg-card/90 border border-border backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
          <Zap size={18} strokeWidth={2} />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Today's Mission</span>
          <span className="text-xs font-bold text-foreground">Drink 2.5L Water</span>
        </div>
      </motion.div>

      {/* FLOATING KPI CARD 3: AI Coach */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-4 -left-4 md:-left-6 z-30 bg-card/90 border border-border backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Sparkles size={18} strokeWidth={2} />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">AI Coach</span>
          <span className="text-xs font-bold text-foreground">3 New Suggestions</span>
        </div>
      </motion.div>

      {/* FLOATING KPI CARD 4: Level & XP */}
      <motion.div 
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute -bottom-4 -right-4 md:-right-6 z-30 bg-card/90 border border-border backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex"
      >
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Award size={18} strokeWidth={2} />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Current Level</span>
          <span className="text-xs font-bold text-foreground">Level 12 • 91% Consistency</span>
        </div>
      </motion.div>

      {/* MAIN CENTERPIECE FRAME */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="glass-restricted rounded-3xl p-4 md:p-6 shadow-2xl border border-border relative overflow-hidden bg-gradient-to-b from-card via-card/90 to-background"
      >
        {/* Status Indicator Bar */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-foreground tracking-wider uppercase text-[10px] font-black">AI Biometric Vision</span>
          </div>
          <span className="text-[10px] text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full font-bold">
            {scanStep === 0 ? 'Phase 1: Scanning' : scanStep === 1 ? 'Phase 2: Landmark Mesh' : scanStep === 2 ? 'Phase 3: Harmony Analysis' : 'Phase 4: Optimization'}
          </span>
        </div>

        {/* AI Face Image & Scanner Container */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-black group">
          
          {/* Base Image */}
          <img 
            src="/looksmaxing_before.jpg" 
            alt="AI Face Scan" 
            className="w-full h-full object-cover filter contrast-[1.05]"
          />

          {/* Laser Scanner Line */}
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            style={{ x: scannerTranslateX }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_#22D3EE] z-20"
          >
            <div className="w-full h-8 bg-gradient-to-b from-accent/30 to-transparent absolute -top-8 left-0"></div>
          </motion.div>

          {/* Biometric Mesh Overlay */}
          <AnimatePresence>
            {(scanStep >= 1) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-10 pointer-events-none"
              >
                {/* SVG Landmark Polygon Mesh */}
                <svg className="w-full h-full absolute inset-0 opacity-70">
                  <polygon 
                    points="152,100 248,100 200,162 168,220 232,220 200,280" 
                    fill="rgba(124, 58, 237, 0.15)" 
                    stroke="rgba(34, 211, 238, 0.6)" 
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <line x1="200" y1="60" x2="200" y2="300" stroke="rgba(124, 58, 237, 0.5)" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="120" y1="100" x2="280" y2="100" stroke="rgba(124, 58, 237, 0.5)" strokeWidth="1" strokeDasharray="2 2" />
                </svg>

                {/* Glowing Landmark Dots */}
                {landmarks.map((lm, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
                    style={{ top: lm.top, left: lm.left }}
                    className="absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-accent border border-white shadow-[0_0_10px_#22D3EE]"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Calculated Score Overlay (Phase 2 & 3) */}
          <AnimatePresence>
            {scanStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-3 left-3 right-3 bg-card/90 border border-border backdrop-blur-md p-3 rounded-xl z-20 flex items-center justify-between"
              >
                <div>
                  <span className="text-[9px] font-black uppercase text-primary tracking-widest block">Facial Harmony Level</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-foreground">88 / 100</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Top 14% Rank</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  Tier 6 • Chadlite
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic AI Recommendation Snippets (Phase 3) */}
        <div className="mt-4 pt-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Activity size={14} className="text-primary" />
              Targeted Biometric Fixes
            </span>
            <span className="text-muted-foreground text-[10px]">Real-Time Processing</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded-lg bg-secondary/40 border border-border flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span className="text-foreground font-semibold">Jawline Alignment +4.2%</span>
            </div>
            <div className="p-2 rounded-lg bg-secondary/40 border border-border flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span className="text-foreground font-semibold">Hydration Target 2.5L</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
