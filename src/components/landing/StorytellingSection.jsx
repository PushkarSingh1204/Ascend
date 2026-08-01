// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\StorytellingSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  UploadCloud, 
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
  Activity,
  ChevronRight,
  FileCheck,
  RotateCcw,
  Check
} from 'lucide-react';
import ImageSlider from '../ImageSlider';

export default function StorytellingSection() {
  const navigate = useNavigate();
  const [activeScene, setActiveScene] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const resumeTimerRef = useRef(null);

  // Parallax Tilt logic using Framer Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 80, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 80, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);
  const floatX = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);
  const floatY = useTransform(mouseYSpring, [-0.5, 0.5], [-8, 8]);

  // Automated 5-scene cycle loop (~3.5s per scene)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % 5);
    }, 3600);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle user manual scene tab selection
  const handleSelectScene = (index) => {
    setActiveScene(index);
    setIsAutoPlaying(false);

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 7000);
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const workflowButtons = [
    { label: 'Upload & Scan', scene: 0, icon: UploadCloud, badge: 'Scene 1' },
    { label: 'Face Analysis', scene: 1, icon: Scan, badge: 'Scene 2' },
    { label: 'AI Suggestions', scene: 2, icon: Sparkles, badge: 'Scene 3' },
    { label: 'Action Roadmap', scene: 3, icon: Compass, badge: 'Scene 4' },
    { label: 'Track & Slider', scene: 4, icon: Sliders, badge: 'Scene 5' },
  ];

  // MediaPipe facial landmarks for Scene 2
  const landmarks = [
    { top: '30%', left: '40%' }, { top: '30%', left: '60%' }, // Eyes
    { top: '46%', left: '50%' },                             // Nose tip
    { top: '64%', left: '42%' }, { top: '64%', left: '58%' }, // Lips
    { top: '80%', left: '50%' },                             // Chin
    { top: '70%', left: '28%' }, { top: '70%', left: '72%' }  // Jawline
  ];

  return (
    <section 
      id="how-it-works" 
      className="w-full py-[120px] md:py-[150px] px-6 md:px-12 bg-background relative z-10 overflow-hidden border-t border-b border-border select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Ambient Orbs & Mesh Texture */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-accent/10 blur-[140px] pointer-events-none -z-10" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="max-w-[1280px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Automated AI Transformation OS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[52px] font-black text-foreground tracking-tight leading-[1.08]">
            See How Ascend Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Five-stage AI transformation sequence from biometric upload to visible physical results.
          </p>
        </div>

        {/* 5 WORKFLOW BUTTONS (FLOATING ABOVE THE SHOWCASE STAGE) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none z-30 relative">
          {workflowButtons.map((btn, idx) => {
            const IconComp = btn.icon;
            const isActive = activeScene === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectScene(idx)}
                className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shrink-0 transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-lg ${
                  isActive 
                    ? 'bg-primary text-white shadow-primary/30 border border-primary scale-[1.03] ring-2 ring-primary/40' 
                    : 'bg-card/90 backdrop-blur-md border border-border text-muted-foreground hover:text-foreground hover:border-border-bright'
                }`}
              >
                <IconComp size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-accent' : ''} />
                <span>{btn.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'
                }`}>
                  {btn.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* LARGE INTERACTIVE CUSTOM ASCEND SHOWCASE STAGE */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="w-full max-w-[1140px] mx-auto glass-restricted rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl border border-border relative overflow-hidden bg-card/70 backdrop-blur-xl min-h-[480px] sm:min-h-[540px] md:min-h-[580px] flex flex-col justify-between"
        >
          {/* Stage Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border z-20">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-foreground">
                Ascend Neural Engine • Stage 0{activeScene + 1}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-secondary/80 border border-border text-muted-foreground">
                Autoplay: <strong className={isAutoPlaying ? 'text-emerald-400' : 'text-amber-400'}>{isAutoPlaying ? 'ACTIVE' : 'PAUSED'}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-accent font-bold hidden sm:inline-block">
                Client-Side Privacy 100%
              </span>
            </div>
          </div>

          {/* DYNAMIC SCENE DISPLAY AREA */}
          <div className="py-6 sm:py-8 my-auto z-20">
            <AnimatePresence mode="wait">
              
              {/* SCENE 1: UPLOAD & SCAN */}
              {activeScene === 0 && (
                <motion.div
                  key="scene-1"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.45 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-6 space-y-5">
                    <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                      STEP 01 • UPLOAD & SCAN
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                      Client-Side Biometric Photo Upload
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Upload front and profile portraits. Photos are processed locally on your browser using WebAssembly neural networks — zero server uploads guaranteed.
                    </p>
                    
                    {/* Animated Progress Status */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-bold text-foreground">
                        <span>Neural Encryption Progress</span>
                        <span className="text-emerald-400">100% Complete</span>
                      </div>
                      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden border border-border">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary via-accent to-emerald-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                    {/* Drag & Drop Photo Slot 1 */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-dashed border-primary/50 bg-black/60 p-2 flex flex-col justify-between group">
                      <img src="/looksmaxing_before.jpg" alt="Front Photo" className="w-full h-full object-cover rounded-xl filter contrast-[1.05]" />
                      <div className="absolute inset-2 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl flex items-end p-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                          <Check size={14} /> Front Angle Locked
                        </div>
                      </div>
                    </div>

                    {/* Drag & Drop Photo Slot 2 */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-dashed border-accent/40 bg-secondary/30 p-4 flex flex-col items-center justify-center text-center space-y-3 group">
                      <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-foreground block">Side Profile Photo</span>
                        <span className="text-[10px] text-muted-foreground">Drag or tap to add</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Optional
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCENE 2: AI FACE ANALYSIS */}
              {activeScene === 1 && (
                <motion.div
                  key="scene-2"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.45 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-6 space-y-5">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      STEP 02 • AI FACE ANALYSIS
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                      MediaPipe 3D Landmark & Harmony Mapping
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Instant evaluation of symmetry ratios, third & fifth facial balance, jawline sharpness, and golden ratio alignment mapped to standardized tiers.
                    </p>

                    {/* Animated Metric Cards */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Facial Symmetry</span>
                        <span className="text-base font-black text-emerald-400">89.4% Balanced</span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Jaw Definition</span>
                        <span className="text-base font-black text-accent">4.2% Angular</span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Facial Thirds</span>
                        <span className="text-base font-black text-foreground">Golden 1:1:1</span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase block">Standardized Tier</span>
                        <span className="text-base font-black text-purple-400">Tier 6 • Chadlite</span>
                      </div>
                    </div>
                  </div>

                  {/* Face Image with Laser Scanner Line & Mesh Dots */}
                  <div className="lg:col-span-6 flex justify-center">
                    <div className="relative w-full max-w-[360px] aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-black">
                      <img src="/looksmaxing_before.jpg" alt="Scanning Face" className="w-full h-full object-cover filter contrast-[1.08]" />
                      
                      {/* Vertical Laser Scanner */}
                      <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_#22D3EE] z-20"
                      />

                      {/* SVG Landmark Polygon Mesh */}
                      <svg className="w-full h-full absolute inset-0 opacity-80 z-10">
                        <polygon points="135,80 225,80 180,140 150,195 210,195 180,245" fill="rgba(124, 58, 237, 0.15)" stroke="rgba(34, 211, 238, 0.7)" strokeWidth="1.5" strokeDasharray="3 2" />
                      </svg>

                      {/* Landmark Dots */}
                      {landmarks.map((lm, idx) => (
                        <motion.div
                          key={idx}
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
                          style={{ top: lm.top, left: lm.left }}
                          className="absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full bg-accent border border-white z-20 shadow-[0_0_10px_#22D3EE]"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SCENE 3: AI RECOMMENDATIONS */}
              {activeScene === 2 && (
                <motion.div
                  key="scene-3"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        STEP 03 • AI RECOMMENDATIONS
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                        Targeted Fix Protocols & Impact Scores
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground font-semibold">
                      4 Priority Action Protocols Generated
                    </span>
                  </div>

                  {/* Recommendation Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: 'Orthotropic Mewing Hold', priority: 'High Priority', impact: '+12.4%', reason: 'Palate Expansion & Maxillary Support', category: 'Harmony' },
                      { title: 'Retinoid Barrier Routine', priority: 'High Priority', impact: '+8.5%', reason: 'Collagen Turnover & Surface Texture', category: 'Skincare' },
                      { title: 'Facial Debloating & Potassium', priority: 'Medium Priority', impact: '+6.2%', reason: 'Subcutaneous Water Retention Reduction', category: 'Nutrition' },
                      { title: 'Forward Head Posture Fix', priority: 'High Priority', impact: '+9.0%', reason: 'Cervical Spine Decompression', category: 'Posture' }
                    ].map((card, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all space-y-2.5 shadow-lg group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                            {card.category} Protocol
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {card.priority}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-foreground group-hover:text-accent transition-colors">
                          {card.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium">
                          {card.reason}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                          <span className="text-muted-foreground">Estimated Impact</span>
                          <span className="font-extrabold text-emerald-400">{card.impact} Gain</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SCENE 4: 30-DAY ROADMAP */}
              {activeScene === 3 && (
                <motion.div
                  key="scene-4"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                        STEP 04 • 30-DAY ROADMAP
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                        Phased Routine & Gamified Milestones
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                      <Award size={16} />
                      <span>Level 12 • 2,450 XP Earned</span>
                    </div>
                  </div>

                  {/* 4-Week Connected Roadmap Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                    {[
                      { week: 'Week 1', title: 'Foundation Baseline', status: 'Completed', xp: '+400 XP' },
                      { week: 'Week 2', title: 'Habit & Posture Lock', status: 'Active Focus', xp: '+600 XP' },
                      { week: 'Week 3', title: 'Collagen & Debloat', status: 'Locked', xp: '+700 XP' },
                      { week: 'Week 4', title: 'Ascension Re-Scan', status: 'Milestone', xp: '+1000 XP' }
                    ].map((step, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-card border border-border space-y-3 relative">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-accent">{step.week}</span>
                          <span className="text-[10px] font-bold text-emerald-400">{step.xp}</span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden border border-border">
                          <div className={`h-full rounded-full ${idx <= 1 ? 'bg-gradient-to-r from-primary to-accent w-full' : 'bg-muted w-0'}`} />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-semibold block">{step.status}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SCENE 5: TRACK PROGRESS & SLIDER */}
              {activeScene === 4 && (
                <motion.div
                  key="scene-5"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.45 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-5 space-y-5">
                    <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                      STEP 05 • TRACK PROGRESS
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                      Side-by-Side Visual Comparison & Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Drag the interactive slider to inspect structural enhancements week-over-week. Document your journey with 100% private timeline logs.
                    </p>

                    <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-foreground">Weekly Compliance Rating</span>
                        <span className="text-emerald-400">91% Streak</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
                        <div className="w-[91%] h-full bg-gradient-to-r from-primary via-accent to-emerald-400 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="rounded-2xl overflow-hidden border border-border bg-background shadow-2xl">
                      <ImageSlider 
                        beforeImage="/looksmaxing_before.jpg"
                        afterImage="/looksmaxing_after.jpg"
                        beforeLabel="Week 1 Baseline"
                        afterLabel="Week 12 Ascended"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Stage Bottom Bar CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border z-20">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Ready to begin your biometric transformation?</span>
            </div>
            
            <button
              onClick={() => navigate('/login')}
              className="btn-primary-v2 text-xs py-3 px-6 w-full sm:w-auto font-bold shadow-lg shadow-primary/20"
            >
              <span>Start Free Biometric Analysis</span>
              <ArrowRight size={16} strokeWidth={2.5} className="btn-arrow" />
            </button>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
