// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\PremiumGate.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usePremium } from '../context/AuthContext';
import { Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * PremiumGate Component
 * Wraps premium content. Renders children if user has an active premium membership,
 * or displays a locked preview card with upgrade call-to-action if user is on Free Tier.
 */
export default function PremiumGate({ 
  children, 
  previewContent = null, 
  title = "PRO Feature Locked", 
  description = "Upgrade to Ascend God PRO to unlock unlimited biometric scans, potential forecasts, and premium guides." 
}) {
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card matte-card p-6 md:p-8 space-y-6">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Render optional teaser preview with blur */}
      {previewContent && (
        <div className="relative select-none pointer-events-none">
          <div className="blur-sm opacity-40 grayscale-[0.3]">
            {previewContent}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/80 to-card" />
        </div>
      )}

      {/* Locked Overlay Card */}
      <div className="flex flex-col items-center text-center space-y-4 py-6 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-accent shadow-xl shadow-primary/10 animate-pulse">
          <Lock size={28} />
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent text-[10px] font-black uppercase tracking-wider">
            Ascend God PRO Required
          </span>
          <h3 className="text-xl font-black text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <button
          onClick={() => navigate('/payments?analysisId=upgrade_profile')}
          className="btn-primary-v2 w-full sm:w-auto px-8 py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/25"
        >
          <Sparkles size={16} />
          <span>Upgrade to Ascend God PRO</span>
          <ArrowRight size={14} />
        </button>

        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" />
            Instant Sandbox / Razorpay Access
          </span>
          <span>•</span>
          <span>Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
}
