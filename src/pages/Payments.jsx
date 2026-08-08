// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Payments.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useGame } from '../context/GameContext';
import { unlockAnalysis } from '../services/db';
import { openRazorpayTestCheckout } from '../services/razorpayService';
import { PRICING } from '../config/pricing';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ChevronLeft, Zap, Sparkles, Check, AlertCircle, Calendar } from 'lucide-react';
import Logo from '../components/Logo';

export default function Payments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activatePlan } = useSubscription();
  const { addXP, unlockBadge } = useGame();

  const analysisId = searchParams.get('analysisId');
  const initialPlan = searchParams.get('plan') === 'yearly' ? 'yearly' : 'monthly';
  const [selectedPlanKey, setSelectedPlanKey] = useState(initialPlan);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');

  const activePlanConfig = selectedPlanKey === 'yearly' ? PRICING.YEARLY : PRICING.MONTHLY;

  const handlePaymentSuccess = async (txDetails) => {
    setLoading(true);
    try {
      // Activate subscription in Firestore using SubscriptionService via SubscriptionContext
      const activatedSub = await activatePlan({
        planKey: selectedPlanKey,
        paymentDetails: txDetails
      });

      // Unlock specific analysis if valid
      if (analysisId && analysisId !== 'upgrade_profile') {
        await unlockAnalysis(analysisId);
      }

      setPaymentDetails(activatedSub);
      setSuccess(true);
      await unlockBadge('premium_unlocked');
      await addXP(300, `Unlock ${activePlanConfig.title}`);

      setTimeout(() => {
        navigate(analysisId === 'upgrade_profile' ? '/profile' : '/analysis');
      }, 2500);
    } catch (err) {
      console.error("Payment activation error:", err);
      setError("Failed to update subscription after payment. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchRazorpay = () => {
    setError('');
    openRazorpayTestCheckout({
      planKey: selectedPlanKey,
      userName: user?.profile?.name || user?.displayName || "Ascender",
      userEmail: user?.email || "user@ascendgod.com",
      onSuccess: (tx) => handlePaymentSuccess(tx),
      onFailure: (errMsg) => {
        console.warn("Razorpay Checkout Failure:", errMsg);
        if (errMsg && !errMsg.includes("closed by user")) {
          setError(errMsg);
        }
      }
    });
  };

  const handleInstantTestPayment = () => {
    handlePaymentSuccess({
      paymentId: `pay_sandbox_${Math.random().toString(36).substring(2, 10)}`,
      orderId: `order_sandbox_${Math.random().toString(36).substring(2, 10)}`,
      signature: 'sandbox_test_signature'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-xl mx-auto pb-12">
      
      {/* Back Link */}
      <div>
        <button
          onClick={() => navigate('/analysis')}
          className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft size={14} />
          Back to Biometric Scans
        </button>
      </div>

      {/* Main Payment Container */}
      <div className="matte-card border border-border p-8 rounded-3xl bg-card shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Razorpay Test Mode Banner */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-extrabold">
          <AlertCircle size={16} className="shrink-0" />
          <span>Razorpay Test Mode Active: Sandbox environment enabled (USD {activePlanConfig.formattedPrice}).</span>
        </div>

        {/* Success Screen */}
        {success ? (
          <div className="text-center py-8 space-y-5 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground">Ascend Plus Activated!</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Your {activePlanConfig.title} ({activePlanConfig.durationDays} days) has been recorded in Firebase Firestore. Redirecting to your dashboard...
              </p>
            </div>

            {paymentDetails && (
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border text-left space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Plan:</span>
                  <span className="text-foreground font-bold">{paymentDetails.planName || activePlanConfig.title}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment ID:</span>
                  <span className="text-foreground font-bold">{paymentDetails.paymentId}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Expiry Date:</span>
                  <span className="text-emerald-400 font-bold">
                    {paymentDetails.expiryDate ? new Date(paymentDetails.expiryDate).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Razorpay Checkout Portal */
          <>
            <div className="flex items-center justify-between">
              <div>
                <Logo size={40} showText={true} />
                <p className="text-xs text-muted-foreground mt-1">
                  Unlock full facial harmony metrics, AI Potential Forecast & PRO guides.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent font-black text-xs">
                PRO PASS
              </span>
            </div>

            {/* Plan Selector */}
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-secondary/40 border border-border">
              <button
                type="button"
                onClick={() => setSelectedPlanKey('monthly')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${selectedPlanKey === 'monthly' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span>Monthly Plan</span>
                <span className="text-sm font-black">{PRICING.MONTHLY.formattedPrice} / mo</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlanKey('yearly')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 relative ${selectedPlanKey === 'yearly' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className="absolute -top-2.5 bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Save 33%
                </span>
                <span>Yearly Plan</span>
                <span className="text-sm font-black">{PRICING.YEARLY.formattedPrice} / yr</span>
              </button>
            </div>

            {/* Plan Breakdown Card */}
            <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <strong className="text-sm font-extrabold text-foreground block">{activePlanConfig.title}</strong>
                  <span className="text-[10px] text-muted-foreground block">{activePlanConfig.durationDays} Days Guaranteed Premium Access</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-foreground block">{activePlanConfig.formattedPrice}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">USD Billing</span>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-2 text-xs">
                {activePlanConfig.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-foreground font-medium">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Primary Action Button: Open Razorpay Modal */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleLaunchRazorpay}
                disabled={loading}
                className="btn-primary-v2 w-full justify-center text-sm py-4 rounded-2xl shadow-xl shadow-primary/20 cursor-pointer"
              >
                {loading ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <>
                    <CreditCard size={18} />
                    <span>Pay {activePlanConfig.formattedPrice} USD via Razorpay Gateway</span>
                  </>
                )}
              </button>

              {/* Secondary Option: Instant Sandbox Test Trigger */}
              <button
                onClick={handleInstantTestPayment}
                disabled={loading}
                className="btn-secondary-v2 w-full justify-center text-xs py-3 rounded-xl border-dashed border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Zap size={14} className="text-amber-400" />
                <span>Simulate Instant Test Activation (Skip Modal)</span>
              </button>
            </div>

            {/* Security Footer */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-border text-[10px] text-muted-foreground font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Razorpay Standard Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock size={14} className="text-emerald-400" />
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
