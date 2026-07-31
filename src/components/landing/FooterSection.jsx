import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../Logo';

export default function FooterSection() {
  const navigate = useNavigate();

  return (
    <footer className="w-full border-t border-[#1F2937] bg-[#0B1020] relative z-10 overflow-hidden">
      
      {/* Tiny Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#F8FAFC 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Large Bottom Call To Action */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-[100px] pb-[80px] text-center relative z-10 border-b border-[#1F2937]">
        <div className="max-w-[700px] mx-auto space-y-6">
          <h2 className="text-3xl md:text-[48px] font-bold text-[#F8FAFC] tracking-tight leading-[1.15]">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-base md:text-[18px] text-[#94A3B8] leading-relaxed">
            Join thousands tracking biometric symmetry, building consistent habit routines, and ascending level by level.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary-v2 w-full sm:w-auto px-8 py-4 text-base"
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} strokeWidth={2} className="btn-arrow" />
            </button>
          </div>
          <p className="text-xs text-[#94A3B8] flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck size={14} strokeWidth={2} className="text-[#22C55E]" />
            <span>100% Client-side privacy • No credit card required</span>
          </p>
        </div>
      </div>

      {/* Footer Navigation & Copyright */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 text-xs text-[#94A3B8]">
        <Logo size={32} />

        <div className="flex items-center gap-6 font-medium">
          <a href="#features" className="hover:text-[#F8FAFC] transition-colors">Features</a>
          <a href="#workflow" className="hover:text-[#F8FAFC] transition-colors">Workflow</a>
          <a href="#testimonials" className="hover:text-[#F8FAFC] transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-[#F8FAFC] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[#F8FAFC] transition-colors">FAQ</a>
        </div>

        <div>
          <span>© 2026 Ascend Self-Transformation Platform. All rights reserved.</span>
        </div>
      </div>

    </footer>
  );
}
