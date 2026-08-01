// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import Typewriter from './Typewriter';
import ServicePills from './ServicePills';
import DashboardMockup from './DashboardMockup';
import HeroVideo from './HeroVideo';

export default function HeroSection({ 
  badgeText = "Private Client-Side AI Transformation Platform",
  socialProofText = "Rated 4.9/5 by transformation seekers • 100% Private On-Device AI"
}) {
  const navigate = useNavigate();

  const trustIndicators = [
    "AI Powered",
    "Browser Privacy First",
    "Personalized Roadmaps",
    "Daily Progress Tracking"
  ];

  return (
    <section className="w-full relative min-h-screen pt-[130px] md:pt-[150px] pb-[100px] md:pb-[120px] px-6 md:px-12 flex flex-col justify-center items-center overflow-hidden z-10">
      
      {/* Background Video with Native Mouse Scrubbing */}
      <HeroVideo />

      <div className="max-w-[1280px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Content & Typewriter & Service Pills (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
          
          {/* 1. Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-accent text-xs font-semibold shadow-sm"
          >
            <Sparkles size={14} strokeWidth={2} />
            <span>{badgeText}</span>
          </motion.div>

          {/* 2. Animated Typewriter Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-[-0.02em] leading-[1.08] text-foreground">
              <Typewriter text={"Transform\nYour Best Version."} speed={42} startDelay={400} />
            </h1>
          </motion.div>

          {/* 3. Supporting Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-[18px] text-muted-foreground leading-relaxed max-w-[620px] font-normal"
          >
            AI-powered facial analysis, habit tracking, personalized transformation roadmaps, and intelligent coaching to help you become your best self.
          </motion.p>

          {/* 4. Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => navigate('/login')}
              className="btn-primary-v2 w-full sm:w-auto px-8 py-4 text-base font-bold"
            >
              <span>Start Free Analysis</span>
              <ArrowRight size={18} strokeWidth={2.5} className="btn-arrow" />
            </button>

            <a
              href="#workflow"
              className="btn-secondary-v2 w-full sm:w-auto px-8 py-4 text-base font-semibold"
            >
              <span>Explore Features</span>
            </a>
          </motion.div>

          {/* 5. Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-xs font-semibold text-muted-foreground"
          >
            {trustIndicators.map((indicator, idx) => (
              <div key={idx} className="flex items-center gap-2 text-foreground">
                <CheckCircle2 size={16} strokeWidth={2.5} className="text-emerald-400 shrink-0" />
                <span>{indicator}</span>
              </div>
            ))}
          </motion.div>

          {/* 6. Interactive Multi-Select Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pt-4 border-t border-border/60"
          >
            <ServicePills />
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Floating 3D Showcase (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 w-full flex justify-center"
        >
          <DashboardMockup />
        </motion.div>

      </div>

    </section>
  );
}
