// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\DesignSystem.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, X, ShieldCheck } from 'lucide-react';

/**
 * Standard card with visual depth, rounded corners, and soft premium hover glows.
 */
export function Card({ 
  children, 
  className = '', 
  interactive = false, 
  onClick,
  ...props
}) {
  const CardComponent = interactive ? motion.div : 'div';
  const interactiveProps = interactive ? {
    whileHover: { y: -4, boxShadow: '0 20px 40px rgba(134, 59, 255, 0.12)', borderColor: 'rgba(134, 59, 255, 0.25)' },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  } : {};

  return (
    <CardComponent
      onClick={onClick}
      className={`card-premium ${interactive ? 'cursor-pointer' : ''} ${className}`}
      {...interactiveProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
}

/**
 * Tactile buttons with elastic spring animation feedback and loading indicators.
 */
export function Button({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary' | 'muted' | 'danger'
  loading = false, 
  fullWidth = false, 
  onClick, 
  className = '',
  ...props
}) {
  const baseStyle = "relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all select-none cursor-pointer outline-none border focus:ring-2 focus:ring-primary/40";
  const variants = {
    primary: "bg-primary text-white border-transparent hover:bg-opacity-90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-foreground border-border hover:bg-secondary/80",
    muted: "bg-transparent text-muted-foreground border-border hover:text-foreground hover:bg-secondary/40",
    danger: "bg-destructive text-white border-transparent hover:bg-opacity-90 shadow-lg shadow-destructive/20"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      onClick={loading ? undefined : onClick}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${loading ? 'opacity-70 pointer-events-none' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"></span>
          <span>Loading...</span>
        </>
      ) : children}
    </motion.button>
  );
}

/**
 * Premium input components with focus glow and error details.
 */
export function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full px-4 py-3 bg-secondary/45 border text-sm rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all ${error ? 'border-destructive focus:ring-destructive/10' : 'border-border'} ${className}`}
          {...props}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1.5 text-[10px] text-destructive font-semibold ml-1.5"
          >
            <AlertCircle size={10} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Animated SVG circular progress visualization.
 */
export function ProgressRing({ 
  percent = 0, 
  size = 120, 
  strokeWidth = 10,
  className = '',
  children
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          className="text-secondary"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <motion.circle
          className="text-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * High-fidelity, smooth skeleton shimmer placeholders to reduce layout shifts.
 */
export function Skeleton({ 
  variant = 'text', // 'text' | 'rect' | 'circle'
  width = '100%', 
  height = '20px', 
  className = '' 
}) {
  const style = {
    width,
    height: variant === 'circle' ? width : height,
  };

  const classes = {
    text: 'rounded',
    rect: 'rounded-xl',
    circle: 'rounded-full'
  };

  return (
    <div 
      style={style}
      className={`bg-secondary/40 animate-pulse overflow-hidden relative ${classes[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
    </div>
  );
}

/**
 * Reusable animated badge tag.
 */
export function Badge({ 
  children, 
  variant = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'neutral'
  className = ''
}) {
  const variants = {
    indigo: 'bg-primary/10 text-primary border-primary/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    neutral: 'bg-secondary text-muted-foreground border-border'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Accessible Modal dialog wrapper using Framer Motion.
 */
export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '' 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />
          {/* Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`w-full max-w-md glassmorphism p-6 rounded-2xl relative z-10 bg-[#0c0c14] border border-border shadow-2xl flex flex-col space-y-4 ${className}`}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
              <button 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[70vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Modal specifically for premium upgrades.
 */
export function PremiumModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ascend Plus">
      <div className="text-center space-y-5 py-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-650 to-indigo-650 flex items-center justify-center text-white mx-auto shadow-lg shadow-primary/20">
          <Sparkles size={22} className="animate-pulse" />
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-black text-foreground">Unlock Complete Self-Transformation</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Gain full access to dynamic face symmetry analyses, detailed longevity estimates, and private AI Coaching recommendations.
          </p>
        </div>
        <div className="bg-secondary/40 border border-border p-4 rounded-xl space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <ShieldCheck size={14} className="text-primary" />
            <span>AI Face Mesh Landmark Detection</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <ShieldCheck size={14} className="text-primary" />
            <span>Advanced Insights & Recommendations</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <ShieldCheck size={14} className="text-primary" />
            <span>Habit streak triggers & XP multiplier</span>
          </div>
        </div>
        <Button variant="primary" fullWidth onClick={onClose}>
          Unlock Ascend Plus — $9.99/mo
        </Button>
      </div>
    </Modal>
  );
}
