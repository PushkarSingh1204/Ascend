// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Payments.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { unlockAnalysis, updateProfile } from '../services/db';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function Payments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addXP, unlockBadge } = useGame();

  const analysisId = searchParams.get('analysisId');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Redirect if no analysis ID
  useEffect(() => {
    if (!analysisId) {
      navigate('/analysis');
    }
  }, [analysisId]);

  const handlePay = (e) => {
    e.preventDefault();
    setError('');

    if (!cardNumber || !expiry || !cvv || !name) {
      setError('Please fill out all payment details.');
      return;
    }

    setLoading(true);
    // Simulate transaction delay
    setTimeout(() => {
      try {
        // Set user is_premium globally for Ascend Plus
        updateProfile({ is_premium: true });

        // Unlock specific analysis if valid
        if (analysisId && analysisId !== 'upgrade_profile') {
          unlockAnalysis(analysisId);
        }
        
        setSuccess(true);
        unlockBadge('premium_unlocked');
        addXP(300, "Unlock Ascend Plus Premium");
        
        setTimeout(() => {
          navigate(analysisId === 'upgrade_profile' ? '/profile' : '/analysis');
        }, 2000);
      } catch (err) {
        setError('Transaction failed. Use any mock card info to retry.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 max-w-xl mx-auto pb-10">
      
      {/* Back to Analysis link */}
      <div>
        <button
          onClick={() => navigate('/analysis')}
          className="text-xs font-bold text-neutral-500 hover:text-neutral-300 flex items-center gap-1.5"
        >
          <ChevronLeft size={14} />
          Back to Face Harmony Scan
        </button>
      </div>

      {/* Main card */}
      <div className="glassmorphism border border-neutral-800 p-8 rounded-2xl shadow-xl space-y-6">
        
        {/* Success Splash */}
        {success ? (
          <div className="text-center py-8 space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mx-auto glow-success">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-black text-white">Payment Succeeded!</h2>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Your premium self-transformation report is unlocked. Redirecting to reports panel...
            </p>
          </div>
        ) : (
          // Checkout Form
          <>
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <CreditCard size={24} className="text-indigo-400" />
                Premium Checkout
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Unlock structural metrics, custom routines, and transformation reports.
              </p>
            </div>

            {/* Price Detail */}
            <div className="bg-neutral-950/60 border border-neutral-900/80 p-4 rounded-xl flex justify-between items-center text-xs text-neutral-400">
              <div>
                <strong className="text-white block">Premium Harmony Report</strong>
                <span className="text-[10px] text-neutral-500 block mt-0.5">One-time payment</span>
              </div>
              <span className="text-lg font-black text-white">$4.99 USD</span>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handlePay} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Alex Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-neutral-700"
                />
              </div>

              {/* Card number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Card Number</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-neutral-700"
                />
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-neutral-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-neutral-700"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                ) : (
                  <>
                    <Lock size={12} />
                    Submit Purchase ($4.99)
                  </>
                )}
              </button>
            </form>

            {/* Secure payment disclaimers */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-neutral-900/60 text-[10px] text-neutral-500">
              <div className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock size={12} className="text-emerald-500" />
                <span>Stripe Verified</span>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
