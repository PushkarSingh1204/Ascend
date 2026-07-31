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
          <span className="px-3.5 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#22D3EE] text-xs font-semibold uppercase tracking-wider inline-block">
            Complete Transformation System
          </span>
          <h2 className="text-3xl md:text-[48px] font-bold text-[#F8FAFC] tracking-tight leading-[1.15]">
            Engineered for Precision & Absolute Privacy
          </h2>
          <p className="text-base md:text-[18px] text-[#94A3B8] leading-relaxed">
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
            <div className="w-12 h-12 rounded-[16px] bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED] group">
              <Scan size={24} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#111827] border border-[#1F2937] text-[#22D3EE] text-xs font-semibold">
              01 • Local Landmark Processing
            </span>
            <h3 className="text-2xl md:text-[32px] font-bold text-[#F8FAFC] leading-snug">
              Biometric Face Harmony Scan
            </h3>
            <p className="text-base md:text-[18px] text-[#94A3B8] leading-relaxed max-w-[550px]">
              Track facial symmetry, golden ratio third divisions, and structural alignment locally on your browser. Zero photos or sensitive facial data ever reach cloud servers.
            </p>
            <div className="space-y-3 pt-2">
              {[
                '100% Client-side MediaPipe landmark detection',
                'Golden ratio third & fifth proportions grid',
                'Zero cloud photo uploads for complete privacy'
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-[#F8FAFC] font-medium">
                  <CheckCircle2 size={18} strokeWidth={2} className="text-[#22C55E]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="matte-card p-4 md:p-6 border border-[#1F2937] overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000" 
                alt="Biometric Scan Feature" 
                className="w-full h-[320px] md:h-[380px] object-cover rounded-[12px] border border-[#1F2937] transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        {/* Feature 2: Right Text, Left Visual */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="matte-card p-4 md:p-6 border border-[#1F2937] overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000" 
                alt="Optimized Habit Builder" 
                className="w-full h-[320px] md:h-[380px] object-cover rounded-[12px] border border-[#1F2937] transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="w-12 h-12 rounded-[16px] bg-[#22D3EE]/15 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] group">
              <SlidersHorizontal size={24} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#111827] border border-[#1F2937] text-[#7C3AED] text-xs font-semibold">
              02 • Behavior Engineering
            </span>
            <h3 className="text-2xl md:text-[32px] font-bold text-[#F8FAFC] leading-snug">
              Optimized Habit Schedule & XP Rewards
            </h3>
            <p className="text-base md:text-[18px] text-[#94A3B8] leading-relaxed max-w-[550px]">
              Build habit routines that stick. Schedule posture checks, mewing reminders, skincare routines, and hydration targets while earning XP to level up your status.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Custom morning and evening routine templates',
                'Hydration and sleep duration progress trackers',
                'Gamified XP levels, streak bonuses, and badges'
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-[#F8FAFC] font-medium">
                  <CheckCircle2 size={18} strokeWidth={2} className="text-[#22C55E]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature 3: Centered Bento Grid (Includes ONLY 1 Restricted Glass Card) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={sectionVariants}
          className="space-y-8"
        >
          <div className="text-center max-w-[650px] mx-auto space-y-3">
            <h3 className="text-2xl md:text-[36px] font-bold text-[#F8FAFC]">
              Integrated Transformation Pillars
            </h3>
            <p className="text-base text-[#94A3B8]">
              All core functionality operates seamlessly across device boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px]">
            {/* Bento Card 1: Restricted Glass Highlight Card (1 of 1 glass highlight on landing) */}
            <div className="glass-restricted rounded-[16px] p-8 space-y-5 transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-[12px] bg-[#7C3AED]/20 flex items-center justify-center text-[#22D3EE]">
                <Shield size={24} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h4 className="text-[24px] font-bold text-[#F8FAFC]">Private Vault Architecture</h4>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Biometric calculations and photo assets stay strictly on your local browser instance. No external server processing required.
              </p>
            </div>

            {/* Bento Card 2: Matte Card */}
            <div className="matte-card p-8 space-y-5 group">
              <div className="w-12 h-12 rounded-[12px] bg-[#111827] border border-[#1F2937] flex items-center justify-center text-[#7C3AED]">
                <Award size={24} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h4 className="text-[24px] font-bold text-[#F8FAFC]">Gamified Achievement Badges</h4>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Unlock milestone badges as you achieve 7-day, 14-day, and 30-day streak milestones and complete daily check-ins.
              </p>
            </div>

            {/* Bento Card 3: Matte Card */}
            <div className="matte-card p-8 space-y-5 group">
              <div className="w-12 h-12 rounded-[12px] bg-[#111827] border border-[#1F2937] flex items-center justify-center text-[#22D3EE]">
                <BarChart3 size={24} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <h4 className="text-[24px] font-bold text-[#F8FAFC]">Transformation Score Analytics</h4>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Monitor your composite Daily Transformation Score combining sleep hours, water log, habit checks, and reflections.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
