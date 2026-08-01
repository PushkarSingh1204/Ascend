// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\HeroSection.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Typewriter from './Typewriter';
import AiScannerShowcase from './AiScannerShowcase';

export default function HeroSection({ 
  badgeText = "Private Client-Side AI Transformation Platform"
}) {
  const navigate = useNavigate();

  // Apple-level Mouse Parallax Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  // Hero left content parallax shift (8-12px)
  const contentX = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const contentY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  // Floating showcase cards counter-shift
  const showcaseX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const showcaseY = useTransform(springY, [-0.5, 0.5], [10, -10]);

  // Ambient gradient orb shift
  const orbX = useTransform(springX, [-0.5, 0.5], [-25, 25]);
  const orbY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return;
      const xPct = e.clientX / window.innerWidth - 0.5;
      const yPct = e.clientY / window.innerHeight - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="w-full relative min-h-screen pt-[130px] md:pt-[150px] pb-[100px] md:pb-[120px] px-6 md:px-12 flex flex-col justify-center items-center overflow-hidden z-10">
      
      {/* Futuristic Background Blur Orbs & Grid Texture */}
      <motion.div 
        style={{ x: orbX, y: orbY }}
        className="absolute top-1/4 left-1/6 w-[450px] h-[450px] rounded-full bg-primary/15 blur-[120px] pointer-events-none -z-10" 
      />
      <motion.div 
        style={{ x: showcaseX, y: showcaseY }}
        className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[130px] pointer-events-none -z-10" 
      />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-[1280px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Clean Content & Typewriter Headline (7 cols) */}
        <motion.div 
          style={{ x: contentX, y: contentY }}
          className="lg:col-span-7 flex flex-col items-start text-left space-y-8"
        >
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold tracking-[-0.02em] leading-[1.06] text-foreground">
              <Typewriter text={"Transform\nYour Best Version."} speed={42} startDelay={400} />
            </h1>
          </motion.div>

          {/* 3. Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-[18px] text-muted-foreground leading-relaxed max-w-[600px] font-normal"
          >
            AI-powered facial analysis, daily habit tracking, personalized transformation roadmaps, and an intelligent AI coach designed around YOU.
          </motion.p>

          {/* 4. ONLY TWO BUTTONS (No CTA clutter, No service pills) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2"
          >
            {/* Primary Button */}
            <button
              onClick={() => navigate('/login')}
              className="btn-primary-v2 w-full sm:w-auto px-8 py-4 text-base font-bold shadow-xl shadow-primary/25"
            >
              <span>Start Free Analysis</span>
              <ArrowRight size={18} strokeWidth={2.5} className="btn-arrow" />
            </button>

            {/* Secondary Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary-v2 w-full sm:w-auto px-8 py-4 text-base font-semibold"
            >
              <span>See How It Works</span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-muted-foreground"
          >
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>100% Client-Side Privacy</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle2 size={16} className="text-accent" />
              <span>No Credit Card Required</span>
            </div>
          </motion.div>

        </motion.div>

        {/* RIGHT COLUMN: Interactive AI Centerpiece (5 cols) */}
        <motion.div
          style={{ x: showcaseX, y: showcaseY }}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 w-full flex justify-center"
        >
          <AiScannerShowcase />
        </motion.div>

      </div>

    </section>
  );
}
