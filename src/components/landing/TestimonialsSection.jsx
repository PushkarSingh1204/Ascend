// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\landing\TestimonialsSection.jsx
import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection({
  testimonials = [
    {
      name: 'Alex R.',
      role: 'Member since Month 1',
      text: 'Ascend completely changed how I approach daily self-care routines. The privacy-first facial symmetry check gave me concrete feedback without uploading my photos anywhere.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: 'Marcus K.',
      role: 'Level 14 Ascended',
      text: 'The habit tracker and XP level system keep me accountable every single morning. Reaching a 30-day streak felt genuinely rewarding.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: 'Elena S.',
      role: 'Routine Tracker',
      text: 'Having a side-by-side photo comparison slider allows me to see subtle posture and alignment improvements over 12 weeks. Essential tool.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: 'David L.',
      role: 'Private Beta Tester',
      text: 'Client-side processing was a non-negotiable for me. Ascend delivers biometric metrics locally without compromise.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    }
  ]
}) {
  // Duplicate list to achieve continuous infinite marquee loop
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="w-full py-[140px] px-6 md:px-12 relative z-10 overflow-hidden">
      <div className="max-w-[1280px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-[650px] mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#22D3EE] text-xs font-semibold uppercase tracking-wider inline-block">
            Member Experiences
          </span>
          <h2 className="text-3xl md:text-[48px] font-bold text-[#F8FAFC] tracking-tight leading-[1.15]">
            Trusted by Dedicated Self-Improvers
          </h2>
          <p className="text-base md:text-[18px] text-[#94A3B8] leading-relaxed">
            Real member feedback on local biometric privacy, streak accountability, and daily habit consistency.
          </p>
        </div>

        {/* Infinite Marquee Container */}
        <div className="marquee-container py-4">
          <div className="marquee-content">
            {marqueeItems.map((item, idx) => (
              <div 
                key={idx} 
                className="w-[320px] sm:w-[380px] matte-card p-6 flex flex-col justify-between space-y-6 flex-shrink-0"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" strokeWidth={1} />
                      ))}
                    </div>
                    <Quote size={20} strokeWidth={2} className="text-[#374151]" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-normal">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#1F2937]">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full object-cover border border-[#1F2937]"
                    loading="lazy"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#F8FAFC] block">{item.name}</span>
                    <span className="text-[11px] text-[#22D3EE] font-medium">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
