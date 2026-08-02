// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\FAQSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection({
  faqs = [
    { 
      q: 'Is my facial image data safe and private?', 
      a: 'Yes, 100%. Ascend processes all facial landmarks and scans locally on your device using MediaPipe client-side JS. No photo assets or facial coordinate matrices are ever uploaded to cloud servers.' 
    },
    { 
      q: 'What is the Daily Transformation Score?', 
      a: 'It is a composite calculated metric combining your daily habit check-ins, water logs, sleep hours, and journal reflections into a single 0-100 daily compliance score.' 
    },
    { 
      q: 'How does the Ascend Plus membership work?', 
      a: 'Ascend is free forever for logging habits, hydration, and reflection journals. Upgrading to Ascend Plus ($4.99/mo) unlocks unlimited facial symmetry scans, golden ratio reports, and historical alignment charts.' 
    },
    { 
      q: 'Can I customize my daily routine focus?', 
      a: 'Absolutely. You can update your routine focus, add custom habit targets, or re-run the onboarding guide from your settings panel at any time.' 
    }
  ]
}) {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full py-[140px] px-6 md:px-12 relative z-10">
      <div className="max-w-[800px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-xs font-semibold uppercase tracking-wider inline-block">
            Clear Answers
          </span>
          <h2 className="text-3xl md:text-[48px] font-bold text-foreground tracking-tight leading-[1.15]">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-muted-foreground">
            Everything you need to know about privacy, metrics, and transformation routines.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="matte-card overflow-hidden transition-colors border border-border bg-card"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 flex justify-between items-center text-left text-base font-bold text-foreground cursor-pointer hover:bg-secondary/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle size={18} strokeWidth={2} className="text-primary flex-shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    strokeWidth={2} 
                    className={`text-muted-foreground transition-transform duration-350 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`} 
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-2 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
