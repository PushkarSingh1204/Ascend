// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\PricingSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap } from 'lucide-react';

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="w-full py-[140px] px-6 md:px-12 border-t border-border relative z-10">
      <div className="max-w-[1280px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-[650px] mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-semibold uppercase tracking-wider inline-block">
            Transparent Options
          </span>
          <h2 className="text-3xl md:text-[48px] font-bold text-foreground tracking-tight leading-[1.15]">
            Simple, Accessible Roadmap Tiers
          </h2>
          <p className="text-base md:text-[18px] text-muted-foreground leading-relaxed">
            Start tracking daily habits for free, or unlock unlimited biometric scans and historical trend reports.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto items-center">
          
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="matte-card p-8 flex flex-col justify-between space-y-8 bg-card border border-border"
          >
            <div className="space-y-6">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Starter Tier</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$0</span>
                <span className="text-xs text-muted-foreground">/ forever</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Log daily routines, hydration targets, reflection journals, and track streaks.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border">
                {[
                  'Log daily habits & sleep',
                  'Write reflection journals',
                  'Streak tracking & levels',
                  '1 baseline facial scan'
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check size={16} strokeWidth={2} className="text-emerald-400" />
                    <span className="text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="btn-secondary-v2 w-full text-center"
            >
              <span>Get Started Free</span>
            </button>
          </motion.div>

          {/* Center Plan: Ascend Plus */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="matte-card p-8 md:p-10 flex flex-col justify-between space-y-8 relative lg:scale-[1.04] border-primary shadow-2xl shadow-primary/15 z-20 bg-card"
          >
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-primary to-accent text-white px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Zap size={18} strokeWidth={2} className="text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Ascend Plus</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-foreground">$4.99</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Full access to advanced local biometric parameters, reports, and AI facial analytics scans.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-foreground pt-4 border-t border-border">
                {[
                  'Unlimited facial symmetry scans',
                  'Golden ratio third divisions',
                  'Comparative timeline tracking reports',
                  'Skincare & posture alignment tips'
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check size={16} strokeWidth={2} className="text-accent" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="btn-primary-v2 w-full text-center"
            >
              <span>Upgrade to Plus</span>
              <ArrowRight size={16} strokeWidth={2.5} className="btn-arrow" />
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="matte-card p-8 flex flex-col justify-between space-y-8 bg-card border border-border"
          >
            <div className="space-y-6">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Pro / Annual</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$39</span>
                <span className="text-xs text-muted-foreground">/ year</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Best value for long-term consistency. Save over 35% with annual billing.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border">
                {[
                  'Includes all Ascend Plus features',
                  'Priority processing engine',
                  'Export report PDFs & data',
                  'All future updates & guides'
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check size={16} strokeWidth={2} className="text-emerald-400" />
                    <span className="text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="btn-secondary-v2 w-full text-center"
            >
              <span>Choose Annual</span>
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
