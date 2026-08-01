// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\StorytellingSection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Scan, 
  Sparkles, 
  Compass, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Award,
  Zap,
  Activity
} from 'lucide-react';
import ImageSlider from '../ImageSlider';

export default function StorytellingSection() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Biometric Landmark Scan',
      shortTitle: 'Upload & Scan',
      icon: Camera,
      badge: 'Client-Side Privacy',
      desc: 'Take or upload a front-facing portrait. MediaPipe neural landmarks detect third & fifth facial proportions, jawline contours, and symmetry indices locally on your device.',
      highlights: [
        'Zero cloud photo uploads — 100% private',
        'Real-time landmark alignment grid',
        'Automatic illumination quality check'
      ],
      visual: (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-black group">
          <img src="/looksmaxing_before.jpg" alt="Step 1 Scan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-accent">
              <Scan size={16} className="animate-spin" />
              <span>MediaPipe Biometric Grid Active</span>
            </div>
          </div>
        </div>
      )
    },
    {
      number: '02',
      title: 'AI Facial Harmony Analysis',
      shortTitle: 'Face Analysis',
      icon: Scan,
      badge: 'Standardized 0-8 Scale',
      desc: 'Ascend evaluates symmetry balance, golden ratio splits, and structural harmony. Receive a standardized rating tier (Tier 0 to Tier 8 True Adam) with clear percentile rankings.',
      highlights: [
        'Standardized 0-8 rating scale classification',
        'Detailed breakdown of structural strengths (✓)',
        'Pinpointed target improvement areas (•)'
      ],
      visual: (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div>
              <span className="text-[9px] font-black uppercase text-primary tracking-widest block">Standardized Rating</span>
              <span className="text-xl font-black text-foreground">88 / 100</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Tier 6 • Chadlite
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 size={14} /> Jawline Symmetry
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold flex items-center gap-2">
              • Posture Offset Fix
            </div>
          </div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Personalized AI Recommendations',
      shortTitle: 'AI Suggestions',
      icon: Sparkles,
      badge: 'Tailored Protocols',
      desc: 'Our recommendation engine cross-references your scan headroom to generate custom orthotropic mewing holds, skincare barrier routines, and facial debloating protocols.',
      highlights: [
        'Targeted mewing, skincare & posture routines',
        'Science-backed educational guide vault',
        'Dynamic updates based on weekly compliance'
      ],
      visual: (
        <div className="space-y-3">
          {[
            { title: 'Orthotropic Mewing Protocol', category: 'Facial Harmony', time: '12 min' },
            { title: 'Retinoid Barrier Skincare Guide', category: 'Skincare', time: '8 min' },
            { title: 'Facial Debloating & Potassium Ratio', category: 'Nutrition', time: '6 min' }
          ].map((rec, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] font-bold text-primary uppercase block">{rec.category}</span>
                <span className="font-bold text-foreground">{rec.title}</span>
              </div>
              <span className="text-[10px] text-accent bg-accent/10 px-2 py-0.5 rounded-full font-bold">{rec.time}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      number: '04',
      title: 'Dynamic 30-Day Roadmap',
      shortTitle: 'Action Roadmap',
      icon: Compass,
      badge: 'Gamified Progress',
      desc: 'Follow a phased step-by-step roadmap. Complete daily routine check-ins, log water and sleep, earn XP, maintain streaks, and level up your transformation score.',
      highlights: [
        'Daily morning & evening habit checklists',
        'Gamified XP rewards & milestone streak badges',
        'Interactive calendar history log'
      ],
      visual: (
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-foreground">Phase 1: Foundation Baseline</span>
            <span className="text-accent">Week 2 of 4</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
            <div className="w-[65%] h-full bg-gradient-to-r from-primary to-accent rounded-full"></div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
            <span>Morning Posture</span>
            <span>Hydration Target</span>
            <span>Evening Journal</span>
          </div>
        </div>
      )
    },
    {
      number: '05',
      title: 'Visual Progress & Slider Track',
      shortTitle: 'Track & Slider',
      icon: Sliders,
      badge: 'Side-by-Side Comparison',
      desc: 'Use the interactive crossfade image comparison slider to inspect structural enhancements week-over-week. Document your journey with 100% private visual logs.',
      highlights: [
        'Interactive crossfade image slider',
        'Side-by-side week 1 vs week 12 baseline comparison',
        'Private timeline log persistence'
      ],
      visual: (
        <div className="rounded-2xl overflow-hidden border border-border bg-background">
          <ImageSlider 
            beforeImage="/looksmaxing_before.jpg"
            afterImage="/looksmaxing_after.jpg"
            beforeLabel="Week 1 Baseline"
            afterLabel="Week 12 Ascended"
          />
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-[140px] px-6 md:px-12 bg-secondary/20 border-t border-b border-border relative z-10">
      <div className="max-w-[1280px] mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-bold uppercase tracking-wider inline-block">
            Proven Storytelling System
          </span>
          <h2 className="text-3xl md:text-[48px] font-extrabold text-foreground tracking-tight leading-[1.12]">
            See How Ascend Works
          </h2>
          <p className="text-base md:text-[18px] text-muted-foreground leading-relaxed">
            A 5-step framework engineered to convert daily consistency into visible physical transformation.
          </p>
        </div>

        {/* Step Selector Tab Navigation */}
        <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
          {steps.map((s, idx) => {
            const IconComp = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-primary' 
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-bright'
                }`}
              >
                <IconComp size={16} />
                <span>{s.number}. {s.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Active Step Showcase */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-card border border-border p-6 md:p-10 rounded-3xl shadow-2xl"
        >
          {/* Left Description Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                STEP {steps[activeStep].number}
              </span>
              <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                {steps[activeStep].badge}
              </span>
            </div>

            <h3 className="text-2xl md:text-[32px] font-bold text-foreground leading-snug">
              {steps[activeStep].title}
            </h3>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {steps[activeStep].desc}
            </p>

            <div className="space-y-3 pt-2">
              {steps[activeStep].highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs md:text-sm text-foreground font-semibold">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary-v2 text-xs py-3 px-6"
              >
                <span>Start Free Biometric Scan</span>
                <ArrowRight size={16} className="btn-arrow" />
              </button>
            </div>
          </div>

          {/* Right Visual Component Column (6 cols) */}
          <div className="lg:col-span-6 w-full">
            {steps[activeStep].visual}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
