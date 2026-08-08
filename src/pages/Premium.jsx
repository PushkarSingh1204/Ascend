// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Premium.jsx
import React, { useState } from 'react';
import { Check, Lock, ShieldCheck, Sparkles, Star, Undo2, ArrowRight, Zap, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { openRazorpayTestCheckout } from '../services/razorpayService';
import { PRICING } from '../config/pricing';

export default function Premium() {
  const { isPremium, status, plan, daysRemaining, expiryDate, activatePlan, restorePurchase } = useSubscription();
  const navigate = useNavigate();
  
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCheckout = (planKey) => {
    setError('');
    setBusy(true);
    
    openRazorpayTestCheckout({
      planKey,
      onSuccess: async (txDetails) => {
        try {
          await activatePlan({ planKey, paymentDetails: txDetails });
          setBusy(false);
          setSuccess(true);
          setTimeout(() => navigate('/analysis'), 1200);
        } catch (err) {
          setBusy(false);
          setError(err.message || 'Failed to update subscription.');
        }
      },
      onFailure: (msg) => {
        setBusy(false);
        if (msg && !msg.includes('closed by user')) {
          setError(msg);
        }
      }
    });
  };

  const handleRestore = async () => {
    setBusy(true);
    setError('');
    try {
      await restorePurchase();
      setSuccess(true);
    } catch (e) {
      setError(e.message || 'Failed to restore subscription.');
    } finally {
      setBusy(false);
    }
  };

  const isExpiredState = status === 'expired';

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16 animate-fade-in text-foreground">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-card to-card p-8 md:p-12 text-center">
        <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
        
        <div className="relative space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-[10px] font-black tracking-widest text-primary uppercase">
            <Sparkles size={13} /> ASCEND PLUS SUBSCRIPTION
          </span>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Unlock Full Facial Harmony & AI Potential Forecast
          </h1>
          
          <p className="mx-auto max-w-2xl text-xs md:text-sm text-muted-foreground leading-relaxed">
            Upgrade your transformation journey with unlimited biometric scans, personalized skincare & exercise recommendations, and continuous AI timeline tracking.
          </p>

          {/* Subscription Status State Banners */}
          {isPremium && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 max-w-md mx-auto flex items-center justify-between text-xs font-extrabold text-emerald-400">
              <div className="flex items-center gap-2">
                <Zap size={16} />
                <span>Ascend Plus {plan === 'yearly' ? 'Yearly' : 'Monthly'} Active ({daysRemaining} Days Left)</span>
              </div>
              <button 
                onClick={() => navigate('/analysis')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-[11px] font-black hover:bg-emerald-400 cursor-pointer"
              >
                Go to Analysis
              </button>
            </div>
          )}

          {isExpiredState && (
            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 max-w-lg mx-auto space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-black text-red-400">
                <AlertCircle size={18} />
                <span>Your Ascend Plus membership has expired.</span>
              </div>
              <p className="text-xs text-muted-foreground">Renew now to restore unlimited scans and AI recommendations.</p>
              <button
                onClick={() => handleCheckout('monthly')}
                className="btn-primary-v2 px-6 py-2.5 text-xs font-black mx-auto cursor-pointer"
              >
                Renew Now · {PRICING.MONTHLY.formattedPrice}
              </button>
            </div>
          )}
        </div>
      </section>

      {success && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-center text-sm font-bold text-emerald-400">
          Subscription verified and activated successfully!
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      {/* PRICING CARDS SECTION */}
      <section className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* MONTHLY PLAN CARD */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">{PRICING.MONTHLY.name}</span>
                <h3 className="text-2xl font-black text-foreground">{PRICING.MONTHLY.title}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-wider">
                {PRICING.MONTHLY.badge}
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-foreground">{PRICING.MONTHLY.formattedPrice}</span>
              <span className="text-xs font-bold text-muted-foreground">{PRICING.MONTHLY.period}</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{PRICING.MONTHLY.description}</p>

            <div className="pt-4 border-t border-border space-y-3">
              {PRICING.MONTHLY.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleCheckout('monthly')}
            disabled={busy}
            className="btn-primary-v2 w-full justify-center py-3.5 rounded-2xl text-xs font-bold shadow-lg cursor-pointer"
          >
            {busy ? 'Opening Checkout...' : isPremium && plan === 'monthly' ? 'Current Plan (Extend)' : `Subscribe Monthly · ${PRICING.MONTHLY.formattedPrice}`}
          </button>
        </div>

        {/* YEARLY PLAN CARD */}
        <div className="rounded-3xl border-2 border-primary bg-gradient-to-b from-primary/15 via-card to-card p-8 shadow-2xl shadow-primary/10 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-white font-black text-[10px] px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-md">
            {PRICING.YEARLY.badge}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary block">{PRICING.YEARLY.name}</span>
              <h3 className="text-2xl font-black text-foreground">{PRICING.YEARLY.title}</h3>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-foreground">{PRICING.YEARLY.formattedPrice}</span>
              <span className="text-xs font-bold text-muted-foreground">{PRICING.YEARLY.period}</span>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ({PRICING.YEARLY.monthlyEquivalent}/mo)
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{PRICING.YEARLY.description}</p>

            <div className="pt-4 border-t border-border space-y-3">
              {PRICING.YEARLY.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleCheckout('yearly')}
            disabled={busy}
            className="btn-primary-v2 w-full justify-center py-3.5 rounded-2xl text-xs font-bold shadow-xl shadow-primary/30 cursor-pointer"
          >
            {busy ? 'Opening Checkout...' : isPremium && plan === 'yearly' ? 'Current Plan (Extend)' : `Subscribe Yearly · ${PRICING.YEARLY.formattedPrice}`}
          </button>
        </div>

      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="matte-card rounded-3xl border border-border p-8 space-y-6">
        <h2 className="text-xl font-black tracking-tight text-center">Feature Comparison Matrix</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase font-black tracking-widest text-[10px]">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-center">Free Tier</th>
                <th className="py-3 px-4 text-center text-primary">Monthly Plan</th>
                <th className="py-3 px-4 text-center text-accent">Yearly Plan (Save 33%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Unlimited Facial Scans", "1 Scan", "Unlimited", "Unlimited"],
                ["AI Biometric Coach", "Basic", "Unlimited 24/7", "Unlimited 24/7"],
                ["Personalized Recommendations", "Standard", "Unlimited Custom", "Unlimited Custom"],
                ["Historical Progress & Slider", "7 Days", "Unlimited History", "Unlimited History"],
                ["PDF Reports & Knowledge Vault", "Locked", "Included", "Included"],
                ["Priority AI Recommendation Engine", "Standard", "Priority", "VIP Priority Pipeline"]
              ].map(([feat, freeVal, monthVal, yearVal], i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-foreground">{feat}</td>
                  <td className="py-4 px-4 text-center text-muted-foreground">{freeVal}</td>
                  <td className="py-4 px-4 text-center font-bold text-emerald-400">{monthVal}</td>
                  <td className="py-4 px-4 text-center font-black text-accent">{yearVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RESTORE & SECURITY */}
      <section className="rounded-2xl border border-border p-6 bg-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-foreground">Need to restore a past purchase?</h3>
          <p className="text-xs text-muted-foreground">Your subscription is synchronized with your Firebase account across all devices.</p>
        </div>
        <button
          onClick={handleRestore}
          disabled={busy}
          className="btn-secondary-v2 px-4 py-2 text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Undo2 size={14} />
          <span>Restore Purchase</span>
        </button>
      </section>

    </div>
  );
}
