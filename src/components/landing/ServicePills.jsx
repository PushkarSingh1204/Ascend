// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\ServicePills.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORY_OPTIONS = [
  "🧠 AI Face Analysis",
  "✨ Skincare",
  "💪 Fitness",
  "😴 Sleep",
  "📈 Progress",
  "🗺️ Roadmap",
  "🤖 AI Coach"
];

export default function ServicePills({ onSelectChange }) {
  const [selectedServices, setSelectedServices] = useState(["🧠 AI Face Analysis", "🗺️ Roadmap"]);
  const navigate = useNavigate();

  const toggleService = (service) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    
    setSelectedServices(updated);
    if (onSelectChange) onSelectChange(updated);
  };

  return (
    <div className="w-full max-w-2xl space-y-6 pt-4">
      <div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-1 flex items-center gap-2">
          <span>What sort of transformation focus?</span>
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground font-medium opacity-85">
          Select all that apply to personalize your Ascend experience
        </p>
      </div>

      {/* Category Pills Wrap */}
      <div className="flex flex-wrap gap-2.5">
        {CATEGORY_OPTIONS.map((item) => {
          const isSelected = selectedServices.includes(item);
          return (
            <motion.button
              key={item}
              type="button"
              onClick={() => toggleService(item)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-primary'
                  : 'bg-card border border-border text-foreground hover:bg-secondary/60 hover:border-border-bright'
              }`}
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check size={16} strokeWidth={2.5} />
                </motion.span>
              )}
              <span>{item}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Contingent Feedback Banner */}
      <AnimatePresence mode="wait">
        {selectedServices.length === 0 ? (
          <motion.div
            key="empty-banner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs italic text-muted-foreground pt-1"
          >
            Please click to select one or more transformation categories above.
          </motion.div>
        ) : (
          <motion.div
            key="active-banner"
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-black tracking-wider text-primary block">
                  Personalized Focus Configuration
                </span>
                <p className="text-xs md:text-sm font-bold text-foreground">
                  Ready to inquire about: <span className="text-accent">{selectedServices.join(", ")}</span>
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="btn-primary-v2 text-xs py-2 px-4 shrink-0 font-bold uppercase tracking-wider"
              >
                <span>Start Your Journey</span>
                <ArrowRight size={14} strokeWidth={2.5} className="btn-arrow" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
