// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import DashboardMockup from './DashboardMockup';

export default function HeroSection({ 
  badgeText = "Private Client-Side AI Transformation Platform",
  socialProofText = "Rated 4.9/5 by transformation seekers • 100% Private On-Device AI"
}) {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-[140px] md:pt-[160px] pb-[100px] md:pb-[120px] px-6 md:px-12 flex flex-col items-center text-center relative z-10">
      
      {/* 1. Announcement Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/25 text-[#22D3EE] text-xs font-semibold mb-8 shadow-sm"
      >
        <Sparkles size={14} strokeWidth={2} />
        <span>{badgeText}</span>
      </motion.div>

      {/* 2. Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold tracking-[-0.02em] leading-[1.08] text-[#F8FAFC] max-w-[900px] mx-auto mb-6"
      >
        Ascend Your <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#22D3EE]">
          Appearance & Habits
        </span>
      </motion.h1>

      {/* 3. Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-base sm:text-lg md:text-[18px] text-[#94A3B8] leading-relaxed max-w-[650px] mx-auto font-normal mb-10"
      >
        Ascend is a private, gamified self-transformation system that tracks facial harmony progress, schedules custom routines, and builds your transformation score with client-side AI.
      </motion.p>

      {/* 4. CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto mb-10"
      >
        <button
          onClick={() => navigate('/login')}
          className="btn-primary-v2 w-full sm:w-auto px-8 py-4 text-base"
        >
          <span>Get Started Free</span>
          <ArrowRight size={18} strokeWidth={2} className="btn-arrow" />
        </button>

        <a
          href="#workflow"
          className="btn-secondary-v2 w-full sm:w-auto px-8 py-4 text-base"
        >
          <span>Explore AI Workflow</span>
        </a>
      </motion.div>

      {/* 5. Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center gap-3 text-[#94A3B8] text-xs font-medium mb-16"
      >
        <div className="flex items-center text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" strokeWidth={1} />
          ))}
        </div>
        <span className="w-1 h-1 rounded-full bg-[#374151]"></span>
        <span>{socialProofText}</span>
      </motion.div>

      {/* 6. Interactive Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <DashboardMockup />
      </motion.div>

    </section>
  );
}
