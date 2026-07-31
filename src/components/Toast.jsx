// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Toast.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-[#22C55E]" />,
    error: <AlertCircle size={18} className="text-[#EF4444]" />,
    warning: <AlertTriangle size={18} className="text-amber-400" />,
    info: <Info size={18} className="text-[#22D3EE]" />
  };

  const borders = {
    success: 'border-[#22C55E]/30 bg-[#111827]/95 text-[#F8FAFC]',
    error: 'border-[#EF4444]/30 bg-[#111827]/95 text-[#F8FAFC]',
    warning: 'border-amber-400/30 bg-[#111827]/95 text-[#F8FAFC]',
    info: 'border-[#22D3EE]/30 bg-[#111827]/95 text-[#F8FAFC]'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-[16px] border shadow-2xl backdrop-blur-md flex items-center gap-3 max-w-sm ${borders[type] || borders.info}`}
      >
        <div className="shrink-0">
          {icons[type] || icons.info}
        </div>
        <p className="text-xs font-semibold leading-relaxed flex-1">
          {message}
        </p>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#1F2937] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
