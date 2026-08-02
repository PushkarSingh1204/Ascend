// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\WorkflowSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, CalendarCheck, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      num: '01',
      title: 'Capture Baseline Photo',
      desc: 'Perform a local MediaPipe landmark scan to benchmark facial symmetry and proportions without cloud photo uploads.',
      icon: Camera
    },
    {
      num: '02',
      title: 'Configure Daily Routines',
      desc: 'Set custom targets for posture alignment, hydration goals, skincare steps, and sleep tracking schedules.',
      icon: CalendarCheck
    },
    {
      num: '03',
      title: 'Log Daily Compliance',
      desc: 'Check off completed daily habits, log water consumption, and complete reflection journal entries to earn XP.',
      icon: TrendingUp
    },
    {
      num: '04',
      title: 'Analyze & Ascend Level',
      desc: 'Review side-by-side slider comparisons and watch your calculated Transformation Score rise week over week.',
      icon: Sparkles
    }
  ];

  return (
    <section id="workflow" className="w-full py-[140px] px-6 md:px-12 bg-card/30 border-t border-b border-border relative z-10">
      <div className="max-w-[1280px] mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-[650px] mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-semibold uppercase tracking-wider inline-block">
            Step-by-step System
          </span>
          <h2 className="text-3xl md:text-[48px] font-bold text-foreground tracking-tight leading-[1.15]">
            How the Ascend Journey Works
          </h2>
          <p className="text-base md:text-[18px] text-muted-foreground leading-relaxed">
            A structured, 4-step framework designed to turn consistency into visible transformation.
          </p>
        </div>

        {/* Workflow 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="matte-card p-8 flex flex-col justify-between space-y-6 relative group bg-card border border-border"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      STEP {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-[12px] bg-secondary border border-border flex items-center justify-center text-accent">
                      <IconComp size={20} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                  </div>
                  <h3 className="text-[20px] font-bold text-foreground leading-snug">{step.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                
                <div className="pt-4 border-t border-border flex items-center gap-2 text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                  <span>Learn workflow</span>
                  <ArrowRight size={14} strokeWidth={2} className="btn-arrow" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
