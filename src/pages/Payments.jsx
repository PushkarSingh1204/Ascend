// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Payments.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { unlockAnalysis, updateProfile } from '../services/db';
import { openRazorpayTestCheckout } from '../services/razorpayService';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ChevronLeft, Zap, Sparkles, Check, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function Payments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { addXP, unlockBadge } = useGame();

  const analysisId = searchParams.get('analysisId');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');

  // Redirect if no analysis ID
  useEffect(() => {
    if (!analysisId) {
      navigate('/analysis');
    }
  }, [analysisId]);

  const handlePaymentSuccess = async (txDetails) => {
    setLoading(true);
    try {
      // Set user is_premium globally for Ascend God Plus
      const updatedProfile = await updateProfile({ is_premium: true });
      setUser(prev => ({ ...prev, profile: updatedProfile }));

      // Unlock specific analysis if valid
      if (analysisId && analysisId !== 'upgrade_profile') {
        await unlockAnalysis(analysisId);
      }

      setPaymentDetails(txDetails);
      setSuccess(true);
      await unlockBadge('premium_unlocked');
      await addXP(300, "Unlock Ascend God PRO Membership");

      setTimeout(() => {
        navigate(analysisId === 'upgrade_profile' ? '/profile' : '/analysis');
      }, 2500);
    } catch (err) {
      console.error("Payment sync error:", err);
      setError("Failed to update profile after payment. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchRazorpay = () => {
    setError('');
    openRazorpayTestCheckout({
      amountInINR: 499,
      planTitle: "Ascend God PRO Membership",
      userName: user?.profile?.name || "Transformer",
      userEmail: user?.email || "user@ascendgod.com",
      onSuccess: (tx) => handlePaymentSuccess(tx),
      onFailure: (errMsg) => {
        console.warn("Razorpay Test Payment Failure:", errMsg);
        if (errMsg && !errMsg.includes("closed by user")) {
          setError(errMsg);
        }
      }
    });
  };

  // Simulated instant test payment trigger for fast testing
  const handleInstantTestPayment = () => {
    handlePaymentSuccess({
      paymentId: `pay_test_${Math.random().toString(36).substring(2, 10)}`,
      orderId: `order_test_${Math.random().toString(36).substring(2, 10)}`,
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

        {/* Razorpay Test Mode Indicator Banner */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-extrabold">
          <AlertCircle size={16} className="shrink-0" />
          <span>Razorpay Test Mode Active: Sandbox environment enabled (No real money charged).</span>
        </div>

        {/* Success Screen */}
        {success ? (
          <div className="text-center py-8 space-y-5 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground">Razorpay Test Payment Successful!</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Your PRO membership has been activated. Redirecting to your unlocked biometric transformation report...
              </p>
            </div>

            {paymentDetails && (
              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border text-start space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment ID:</span>
                  <span className="text-foreground font-bold">{paymentDetails.paymentId}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">VERIFIED (Test Mode)</span>
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
                  Unlock full facial harmony metrics, custom routines & PDF reports.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-accent font-black text-xs">
                PRO PASS
              </span>
            </div>

            {/* Plan Breakdown Card */}
            <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <strong className="text-sm font-extrabold text-foreground block">Ascend God PRO Pass</strong>
                  <span className="text-[10px] text-muted-foreground block">Lifetime access & unlimited biometric scans</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-foreground block">₹499</span>
                  <span className="text-[10px] text-emerald-400 font-bold block">($4.99 USD equivalent)</span>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-2 text-xs">
                {[
                  "Full Facial Harmony & Symmetry Index mapping",
                  "AI Potential Forecast & Timeline estimation",
                  "Personalized Skincare, Sleep & Hydration Engine routines",
                  "300 Bonus XP & Achievement Badge unlock"
                ].map((feat, i) => (
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
                    <span>Pay ₹499 via Razorpay Test Gateway</span>
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
                <span>Simulate Instant Test Approval (Skip Modal)</span>
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
