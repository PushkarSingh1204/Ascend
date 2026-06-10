// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider';
import { Sparkles, CalendarDays, BookOpen, TrendingUp, ChevronRight, Award } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07070b] text-neutral-100 flex flex-col items-center overflow-x-hidden relative">
      {/* Decorative background grids and glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[800px] -left-20 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Top Navbar */}
      <header className="w-full max-w-7xl h-20 flex items-center justify-between px-6 md:px-12 border-b border-neutral-900/80 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            A
          </div>
          <span className="text-xl font-bold tracking-wider text-white">ASCEND</span>
        </div>
        
        <div>
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-full text-sm font-semibold border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/80 text-neutral-300 transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 md:px-12 pt-16 md:pt-28 pb-16 flex flex-col lg:flex-row items-center gap-12 z-10">
        {/* Left Column Text */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles size={14} />
            <span>AI-Powered Personal Transformation</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
            Ascend Your <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Appearance & Habits
            </span>
          </h1>

          <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Not a rating app. Ascend is a premium self-transformation platform that tracks facial balance metrics, optimizes daily routines, and records your personal growth journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 text-center"
            >
              Learn More
            </a>
          </div>

          {/* Micro Trust Stats */}
          <div className="pt-6 border-t border-neutral-900 flex items-center justify-center lg:justify-start gap-8 text-neutral-500 text-xs">
            <div>
              <span className="block text-white text-lg font-bold">100% Private</span>
              On-Device AI analysis
            </div>
            <div className="w-px h-8 bg-neutral-800"></div>
            <div>
              <span className="block text-white text-lg font-bold">Gamified</span>
              XP, Levels & Badges
            </div>
          </div>
        </div>

        {/* Right Column: Draggable Image Slider */}
        <div className="flex-1 w-full max-w-lg">
          <div className="p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-3xl shadow-2xl shadow-indigo-900/10">
            <ImageSlider 
              beforeImage="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80"
              afterImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
              beforeLabel="Week 1 Profile"
              afterLabel="Week 4 Profile"
            />
          </div>
          <p className="text-center text-xs text-neutral-500 mt-4 italic">
            Drag the handle to compare structural facial tracking between weeks.
          </p>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="features" className="w-full max-w-7xl px-6 md:px-12 py-24 border-t border-neutral-950 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Designed For Absolute Self-Transformation
          </h2>
          <p className="text-neutral-400">
            Transforming your appearance requires consistency across skincare, posture, sleep, and physical fitness. We provide the tools to make it visible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glassmorphism-interactive p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">AI Harmony Analysis</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Scan facial symmetry, proportion, and harmony estimates client-side. Get guidance on correctable habits without uploading photos to external servers.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glassmorphism-interactive p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Daily Routines Planner</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Maintain structured checklists for morning, night, skincare, and workouts. Log sleep hours and track hydration with custom responsive animations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glassmorphism-interactive p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Progress Journal</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Reflect daily on physical changes. Write personal logs, track mood indices, and catalog completed habits to build a written history of your glow up.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glassmorphism-interactive p-6 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">Progress Analytics</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Review transformation trend lines and consistency metrics. Grid maps track your check-ins over the year to keep you accountable.
            </p>
          </div>
        </div>
      </section>

      {/* Gamification Teaser Section */}
      <section className="w-full max-w-4xl px-6 py-16 mb-24 mx-4 glassmorphism border border-neutral-800 rounded-3xl z-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-tr from-neutral-900/60 via-indigo-950/10 to-neutral-900/60">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold">
            <Award size={12} />
            <span>Gamified Ascent System</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Earn XP & Level Up Your Habits</h3>
          <p className="text-sm text-neutral-400 max-w-md">
            Complete daily check-ins, routine tasks, and journals to earn Experience Points (XP), raise your Level, and unlock rare achievement badges.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-center min-w-[100px] shadow-lg">
            <span className="text-2xl font-extrabold text-blue-400">LVL 4</span>
            <span className="block text-[10px] text-neutral-500 uppercase mt-1">Current Level</span>
          </div>
          <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-center min-w-[100px] shadow-lg">
            <span className="text-2xl font-extrabold text-orange-400">🔥 12d</span>
            <span className="block text-[10px] text-neutral-500 uppercase mt-1">Daily Streak</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900/80 py-8 text-center text-xs text-neutral-600 mt-auto z-10">
        <p>© 2026 Ascend Self-Transformation Platform. All rights reserved.</p>
        <p className="mt-1.5 text-neutral-700">All face scans run 100% locally on your browser. We never sell your photos.</p>
      </footer>
    </div>
  );
}
