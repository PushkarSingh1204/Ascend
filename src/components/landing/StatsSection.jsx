// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\StatsSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUpNumber({ endVal, duration = 1400, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    // Check if prefers-reduced-motion is active
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(endVal);
      return;
    }

    let startTime = null;
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo function: 1 - Math.pow(2, -10 * progress)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * endVal));
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(endVal);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, endVal, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection({ 
  stats = [
    { label: 'Private Scans Run', numericVal: 45200, suffix: '+', note: 'Client-Side AI' },
    { label: 'Habits Completed', numericVal: 1200000, suffix: '+', note: 'Logged Routines' },
    { label: 'Consistency Rate', numericVal: 98, suffix: '.4%', note: 'User Compliance' },
    { label: 'XP Levels Unlocked', numericVal: 320000, suffix: '+', note: 'Gamified Milestones' }
  ] 
}) {
  return (
    <section className="w-full border-t border-b border-[#1F2937] bg-[#111827]/40 py-16 px-6 md:px-12 relative z-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1 p-4"
          >
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
              <CountUpNumber endVal={stat.numericVal} suffix={stat.suffix} />
            </div>
            <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">{stat.label}</p>
            <p className="text-[11px] text-[#94A3B8] font-normal">{stat.note}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
