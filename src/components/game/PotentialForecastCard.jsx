// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\game\PotentialForecastCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Info, 
  ChevronDown, 
  ShieldCheck, 
  Clock, 
  Target,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { calculatePotentialForecast } from '../../services/engines/potentialForecastEngine';

export default function PotentialForecastCard({ profile = {}, latestScan = null, scanHistory = [] }) {
  const [showExplanation, setShowExplanation] = useState(false);

  const forecast = calculatePotentialForecast(profile, latestScan, scanHistory);

  const currentPct = forecast.currentHarmony;
  const potentialPct = forecast.potentialHarmony;
  const headroomWidth = Math.max(0, potentialPct - currentPct);

  const getConfidenceBadgeColor = (level) => {
    if (level === 'High') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (level === 'Medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  return (
    <div className="matte-card p-6 md:p-8 space-y-6 border border-border bg-card shadow-2xl relative overflow-hidden">
      {/* Ambient Gradient Blur Overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-md shadow-accent/10">
            <Sparkles size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-foreground">AI Potential Forecast</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                Predictive Model
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Long-term physical symmetry & compliance trajectory</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Confidence:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getConfidenceBadgeColor(forecast.confidenceLevel)}`}>
            <ShieldCheck size={14} />
            <span>{forecast.confidenceLevel} ({forecast.confidencePercent}%)</span>
          </span>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Score */}
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-1">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">Current Score</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-foreground">{forecast.currentHarmony}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <span className="text-[10px] text-muted-foreground block">Verified Baseline</span>
        </div>

        {/* Potential Score */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/25 space-y-1">
          <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider block">Potential Score</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-accent">{forecast.potentialHarmony}</span>
            <span className="text-xs text-accent/80">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold block">Max Headroom</span>
        </div>

        {/* Estimated Gain */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Projected Gain</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-400">+{forecast.estimatedGain}</span>
            <span className="text-xs text-emerald-400/80">Pts</span>
          </div>
          <span className="text-[10px] text-emerald-400/90 font-medium block">Achievable Upgrade</span>
        </div>

        {/* Estimated Timeline */}
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-1">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">Target Horizon</span>
          <div className="flex items-center gap-1.5 pt-0.5">
            <Clock size={16} className="text-primary" />
            <span className="text-base font-extrabold text-foreground">{forecast.timelineMonths}</span>
          </div>
          <span className="text-[10px] text-muted-foreground block">Consistent Compliance</span>
        </div>
      </div>

      {/* DUAL LAYER COMPARISON PROGRESS BAR */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-foreground flex items-center gap-2">
            <Target size={16} className="text-primary" />
            Current Harmony ({currentPct}%) vs Potential Limit ({potentialPct}%)
          </span>
          <span className="text-emerald-400">+{forecast.estimatedGain} Pts Optimization Headroom</span>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-5 bg-secondary rounded-full overflow-hidden border border-border p-0.5">
          {/* Layer 1: Current Score Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentPct}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative z-10"
          />

          {/* Layer 2: Potential Forecast Headroom Bar */}
          <motion.div
            initial={{ left: `${currentPct}%`, width: 0 }}
            animate={{ left: `${currentPct}%`, width: `${headroomWidth}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0.5 bottom-0.5 bg-gradient-to-r from-accent/30 via-emerald-400/40 to-emerald-400/80 rounded-r-full z-0 border-l border-white/20 shadow-[0_0_12px_#22C55E]"
          >
            {/* Animated Shimmer Overlay */}
            <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-pulse" />
          </motion.div>
        </div>

        <div className="flex justify-between text-[10px] text-muted-foreground font-semibold px-1">
          <span>0 (Baseline)</span>
          <span>Current: {currentPct}</span>
          <span className="text-emerald-400 font-extrabold">Forecast Target: {potentialPct}</span>
          <span>100 (Max Adam)</span>
        </div>
      </div>

      {/* EXPLAINABILITY COLLAPSIBLE PANEL */}
      <div className="pt-2">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center justify-between w-full p-3 rounded-xl bg-secondary/40 border border-border text-xs font-bold text-foreground hover:bg-secondary/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info size={16} className="text-accent" />
            <span>Why this estimate? AI Forecast Rationale</span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-300 ${showExplanation ? 'rotate-180 text-accent' : 'text-muted-foreground'}`} />
        </button>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 rounded-xl bg-secondary/20 border border-border/70 text-xs space-y-3">
                <p className="text-muted-foreground leading-relaxed font-normal">
                  {forecast.summaryReason}
                </p>

                <div className="space-y-2 pt-1 border-t border-border/60">
                  <span className="text-[10px] font-black uppercase text-accent tracking-wider block">Key Positive Drivers</span>
                  {forecast.keyDrivers.map((driver, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-foreground font-semibold">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
