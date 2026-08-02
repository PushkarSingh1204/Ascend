// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\FeaturesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Scan, 
  Sparkles, 
  SlidersHorizontal, 
  Shield, 
  CheckCircle2, 
  Award, 
  Flame,
  ArrowRight,
  Lock,
  Layers,
  BarChart3
} from 'lucide-react';

export default function FeaturesSection() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="features" className="w-full py-[140px] px-6 md:px-12 relative z-10">
      <div className="max-w-[1280px] mx-auto space-y-[140px]">
        
        {/* Section Header */}
        <div className="text-center max-w-[650px] mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-semibold uppercase tracking-wider inline-block">
            Complete Transformation System
          </span>
          <h2 className="text-3xl md:text-[48px] font-bold text-foreground tracking-tight leading-[1.15]">
            Engineered for Precision & Absolute Privacy
          </h2>
          <p className="text-base md:text-[18px] text-muted-foreground leading-relaxed">
            Ascend replaces guesswork with client-side AI analysis, gamified habit schedules, and side-by-side baseline comparisons.
          </p>
        </div>

        {/* Feature 1: Left Text, Right Image/Visual */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary group">
              <Scan size={24} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary border border-border text-accent text-xs font-semibold">
              01 • Local Landmark Processing
            </span>
            <h3 className="text-2xl md:text-[32px] font-bold text-foreground leading-snug">
              Biometric Face Harmony Scan
            </h3>
            <p className="text-base md:text-[18px] text-muted-foreground leading-relaxed max-w-[550px]">
              Track facial symmetry, golden ratio third divisions, and structural alignment locally on your browser. Zero photos or sensitive facial data ever reach cloud servers.
            </p>
            <div className="space-y-3 pt-2">
              {[
                '100% Client-side MediaPipe landmark detection',
                'Golden ratio third & fifth proportions grid',
                'Zero cloud photo uploads for complete privacy'
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <CheckCircle2 size={18} strokeWidth={2} className="text-emerald-400" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="matte-card p-4 md:p-6 border border-border overflow-hidden group bg-card">
              <img 
                src="/looksmaxing_before.jpg" 
                alt="Biometric Scan Feature" 
                className="w-full aspect-[4/3] object-cover rounded-xl border border-border transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </motion.div>

        {/* Feature 2: Right Text, Left Image/Visual */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent group">
              <Sparkles size={24} strokeWidth={2} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary border border-border text-accent text-xs font-semibold">
              02 • Dynamic Action Blueprints
            </span>
            <h3 className="text-2xl md:text-[32px] font-bold text-foreground leading-snug">
              Personalized 30-Day Roadmaps
            </h3>
            <p className="text-base md:text-[18px] text-muted-foreground leading-relaxed max-w-[550px]">
              Turn facial analytics into clear daily habits. Receive step-by-step guidance for mewing holds, posture adjustments, skincare barriers, and hydration targets.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Tailored daily morning & evening habit checklists',
                'Milestone XP rewards, levels & streak tracking',
                'Curated guides for skincare, posture & debloating'
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <CheckCircle2 size={18} strokeWidth={2} className="text-emerald-400" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="matte-card p-6 md:p-8 border border-border space-y-4 bg-card">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-xs font-bold text-foreground">Phase 1: Foundation Protocol</span>
                <span className="text-xs font-semibold text-accent">Week 2 of 4</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Morning Posture Alignment Check', xp: '+50 XP', done: true },
                  { title: 'Hydration Target (2.5L)', xp: '+50 XP', done: true },
                  { title: 'Orthotropic Mewing Hold (15 Min)', xp: '+100 XP', done: true },
                  { title: 'Evening Reflection Journal', xp: '+75 XP', done: false }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-secondary border border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className={item.done ? 'text-emerald-400' : 'text-muted-foreground'} />
                      <span className={item.done ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}>{item.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{item.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          <div className="matte-card p-8 space-y-4 border border-border bg-card">
            <Shield size={24} className="text-primary" />
            <h4 className="text-lg font-bold text-foreground">100% Client-Side Privacy</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your photos never leave your device. All neural landmark calculations run strictly in your browser.
            </p>
          </div>

          <div className="matte-card p-8 space-y-4 border border-border bg-card">
            <Flame size={24} className="text-amber-400" />
            <h4 className="text-lg font-bold text-foreground">Gamified Streak Rewards</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Earn XP, unlock milestone badges, maintain daily streaks, and level up your transformation score.
            </p>
          </div>

          <div className="matte-card p-8 space-y-4 border border-border bg-card">
            <SlidersHorizontal size={24} className="text-accent" />
            <h4 className="text-lg font-bold text-foreground">Side-by-Side Baseline Tracking</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use the interactive crossfade slider to compare week-over-week visual enhancements side-by-side.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
