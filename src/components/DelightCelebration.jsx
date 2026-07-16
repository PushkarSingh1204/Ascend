// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\DelightCelebration.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Flame, Sparkles, X } from 'lucide-react';
import { Button } from './DesignSystem';

/**
 * Delight Celebration Modal to award XP, Streak milestones, and Level Up achievements.
 */
export default function DelightCelebration({ 
  isOpen, 
  onClose, 
  type = 'level_up', // 'level_up' | 'streak_milestone' | 'badge_unlocked'
  title = 'Level Up!',
  subtitle = 'You have ascended to a new height.',
  value = '',
  xpReward = 0
}) {
  
  useEffect(() => {
    if (isOpen) {
      // Play a subtle celebration sound if available
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav');
        audio.volume = 0.2;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  }, [isOpen]);

  const icons = {
    level_up: { icon: Award, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    streak_milestone: { icon: Flame, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    badge_unlocked: { icon: Sparkles, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' }
  };

  const Config = icons[type] || icons.level_up;
  const Icon = Config.icon;

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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Celebration Ring / Particle effects behind card */}
          <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

          {/* Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-full max-w-sm glassmorphism p-6 rounded-2xl relative z-10 text-center border border-border shadow-2xl space-y-5"
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Icon Sphere */}
            <motion.div 
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border ${Config.color}`}
            >
              <Icon size={32} className="stroke-[1.5]" />
            </motion.div>

            {/* Content Details */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase block">
                {type.replace(/_/g, ' ')}
              </span>
              <h3 className="text-lg font-black text-foreground tracking-tight">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {subtitle}
              </p>
            </div>

            {/* Big Value Display */}
            {value && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="text-2xl font-black text-foreground bg-secondary/40 border border-border py-2 px-4 rounded-xl inline-block"
              >
                {value}
              </motion.div>
            )}

            {/* XP Award badge */}
            {xpReward > 0 && (
              <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1 mx-auto">
                <span>+{xpReward} XP Awarded</span>
              </div>
            )}

            {/* Action close button */}
            <Button variant="primary" fullWidth onClick={onClose}>
              Continue Journey
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
