// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\EmptyState.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glassmorphism p-8 rounded-2xl text-center border border-border max-w-md mx-auto flex flex-col items-center justify-center space-y-4 shadow-xl bg-card text-foreground"
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
          <Icon size={20} className="stroke-[1.5]" />
        </div>
      )}
      
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-foreground tracking-wide">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-xs leading-normal">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:opacity-90 transition-colors shadow-md shadow-primary/10 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
