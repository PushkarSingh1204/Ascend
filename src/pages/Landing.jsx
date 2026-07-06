// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ImageSlider from '../components/ImageSlider';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  CalendarDays, 
  BookOpen, 
  TrendingUp, 
  ChevronRight, 
  Award, 
  Shield, 
  Flame, 
  Zap, 
  Check, 
  ChevronDown, 
  Moon, 
  Droplet,
  Sun,
  Activity,
  Sliders
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { label: 'Private Scans Run', val: '45,200+' },
    { label: 'Daily Habits Complete', val: '1.2M+' },
    { label: 'Consistency Streaks', val: '98.4%' },
    { label: 'XP Levels Unlocked', val: '320K+' }
  ];

  const features = [
    {
      title: 'Biometric Face Harmony Scan',
      desc: 'Track facial symmetry and golden ratio proportions locally on your device. Keep all image assets 100% private.',
      img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
      badge: 'Privacy First'
    },
    {
      title: 'Optimized Habit Builder',
      desc: 'Build habits that stick. Morning mewing, posture alignment checks, skincare, and water tracking schedules.',
      img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
      badge: 'Consistency'
    },
    {
      title: 'Transformation Timeline Slider',
      desc: 'Log weekly photos and use our side-by-side interactive comparison slider to visualize structural improvements.',
      img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
      badge: 'Visual Baselines'
    }
  ];

  const faqs = [
    { q: 'Is my facial data safe and private?', a: 'Yes, 100%. Ascend processes all facial landmarks and scans locally on your device using MediaPipe client-side. No photo assets are ever uploaded to cloud servers.' },
    { q: 'What is the Daily Transformation Score?', a: 'It is a calculated metric that combines your daily habit check-ins, water log, sleep hours, and journal entries to give you a single compliance score.' },
    { q: 'How does the Ascend Plus membership work?', a: 'Ascend is free to log habits and journals. Upgrading to Ascend Plus ($4.99/mo) unlocks unlimited face symmetry scans, comparative reports, and detailed insights charts.' },
    { q: 'Can I change my journey focus?', a: 'Absolutely. You can restart the onboarding process at any time from your settings panel to reset your transformation goals.' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center overflow-x-hidden relative transition-colors duration-350">
      
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[800px] -left-20 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Top Navbar */}
      <header className="w-full max-w-7xl h-20 flex items-center justify-between px-6 md:px-12 border-b border-border z-10 bg-background/50 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            A
          </div>
          <span className="text-xl font-bold tracking-wider text-foreground">ASCEND</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-full text-sm font-semibold border border-border bg-card hover:bg-secondary/40 text-foreground transition-all duration-300 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="w-full max-w-7xl px-6 md:px-12 pt-16 md:pt-28 pb-16 flex flex-col lg:flex-row items-center gap-12 z-10">
        {/* Left Column Text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles size={14} />
            <span>Private AI Transformation Companion</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Ascend Your <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Appearance & Habits
            </span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Not a rating app. Ascend is a private, gamified self-transformation system that tracks symmetry progress, schedules custom routines, and builds your transformation score.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-650/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Get Started Free
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-muted-foreground hover:text-foreground bg-card border border-border transition-all duration-300 text-center"
            >
              Learn More
            </a>
          </div>

          {/* Micro Trust Stats */}
          <div className="pt-6 border-t border-border flex items-center justify-center lg:justify-start gap-8 text-muted-foreground text-xs">
            <div>
              <span className="block text-foreground text-lg font-bold">100% Private</span>
              On-Device AI analysis
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div>
              <span className="block text-foreground text-lg font-bold">Gamified Journey</span>
              XP, Levels & Badges
            </div>
          </div>
        </motion.div>

        {/* Right Column: Floating Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full max-w-lg relative"
        >
          {/* Main Dashboard preview frame */}
          <div className="p-3 bg-card border border-border rounded-3xl shadow-2xl relative z-10 overflow-hidden">
            <ImageSlider 
              beforeImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
              afterImage="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80"
              beforeLabel="Baseline"
              afterLabel="Month 3"
            />
          </div>

          {/* Floating preview badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 bg-card border border-border p-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-20"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-450">
              <TrendingUp size={16} />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block font-bold">Symmetry Improvement</span>
              <span className="text-xs font-black text-foreground">+12.4%</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Transformation Statistics Section */}
      <section className="w-full max-w-7xl px-6 md:px-12 py-16 border-t border-b border-border bg-card/20 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {stat.val}
              </span>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bento Features Grid */}
      <section id="features" className="w-full max-w-7xl px-6 md:px-12 py-24 space-y-16 z-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Complete Transformation System
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore features optimized for skincare routines, hydration consistency, and posture correction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              key={idx} 
              className="card-premium p-5 flex flex-col justify-between space-y-6 bg-card"
            >
              <div className="space-y-3">
                <span className="inline-block text-[10px] font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                  {feat.badge}
                </span>
                <h3 className="text-base font-bold text-foreground">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
              <img 
                src={feat.img} 
                alt={feat.title} 
                className="w-full h-40 object-cover rounded-xl border border-border"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Dashboard Preview Section */}
      <section className="w-full max-w-7xl px-6 md:px-12 py-20 flex flex-col lg:flex-row items-center gap-12 z-10">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block">Dashboard Hub</span>
          <h2 className="text-3xl font-extrabold text-foreground">
            Gamified Analytics Center
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
            Earn experience points (XP) for logged daily goals. Unlock badges and level up as you complete routines, write journals, and monitor stats.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-3">
              <Award className="text-yellow-500" size={20} />
              <div className="text-left">
                <span className="text-[10px] text-muted-foreground block font-bold">Current Level</span>
                <span className="text-xs font-black">Level 12 Ascended</span>
              </div>
            </div>
            <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-3">
              <Flame className="text-orange-500" size={20} />
              <div className="text-left">
                <span className="text-[10px] text-muted-foreground block font-bold">Daily Streak</span>
                <span className="text-xs font-black">14 Days Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard visual mockup */}
        <div className="flex-1 w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="font-bold text-foreground">Daily Focus Missions</span>
            <span className="text-[10px] font-bold text-muted-foreground">3/4 Done</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Log Daily Check-in', active: true, xp: 50 },
              { label: 'Hydration Target (2L+)', active: true, xp: 50 },
              { label: 'Log Sleep Duration', active: true, xp: 50 },
              { label: 'Write Reflection Journal', active: false, xp: 100 }
            ].map((m, idx) => (
              <div key={idx} className={`p-2.5 rounded-lg border flex justify-between items-center ${m.active ? 'bg-secondary/40 border-border text-muted-foreground' : 'bg-transparent border-border text-foreground'}`}>
                <span>{m.label}</span>
                <span className="text-[8px] font-black text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">+{m.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section className="w-full max-w-7xl px-6 md:px-12 py-24 border-t border-border z-10">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-muted-foreground">
            Transformation is accessible. Choose the roadmap tier that fits your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free Tier */}
          <div className="glassmorphism p-8 rounded-2xl border border-border bg-card space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Free Tier</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">$0</span>
                <span className="text-xs text-muted-foreground">/ forever</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log daily habits, hydration progress, write reflection journals, and track streaks.
              </p>
              <ul className="space-y-2.5 text-xs text-muted-foreground pt-4 border-t border-border">
                {['Log habits & sleep', 'Write reflection journals', 'Streak tracking & levels', '1 free facial scan'].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check size={12} className="text-primary" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl border border-border bg-background hover:bg-secondary/40 text-xs font-bold text-foreground transition-all cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Premium Tier */}
          <div className="glassmorphism p-8 rounded-2xl border border-primary bg-card space-y-6 flex flex-col justify-between relative">
            <div className="absolute top-4 right-4 bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
              Popular
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">Ascend Plus</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">$4.99</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock full access to advanced biometric parameters, reports, and AI facial analytics scans.
              </p>
              <ul className="space-y-2.5 text-xs text-muted-foreground pt-4 border-t border-border">
                {['Unlimited facial symmetry scans', 'Golden ratio third divisions', 'Comparative tracking reports', 'Skincare routine matching tips'].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check size={12} className="text-primary" />
                    <span className="text-foreground font-semibold">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:opacity-90 transition-all shadow-lg shadow-primary/10 cursor-pointer"
            >
              Start Ascend Plus
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="w-full max-w-3xl px-6 py-20 border-t border-border z-10">
        <h2 className="text-2xl font-extrabold text-foreground text-center mb-10">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 flex justify-between items-center text-xs font-bold text-foreground text-left cursor-pointer hover:bg-secondary/20"
              >
                <span>{faq.q}</span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="p-4 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="w-full border-t border-border py-12 px-6 md:px-12 bg-card/40 z-10 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-500 to-indigo-650 flex items-center justify-center font-bold text-white text-[10px]">
              A
            </div>
            <span className="font-bold tracking-wider text-foreground">ASCEND</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#features" className="hover:text-foreground">Features</a>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">© 2026 Ascend transformation. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
