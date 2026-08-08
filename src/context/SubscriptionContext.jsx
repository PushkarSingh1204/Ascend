// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\SubscriptionContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { SubscriptionService } from '../services/subscriptionService';
import { PRICING } from '../config/pricing';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time Firestore Subscription Listener
  useEffect(() => {
    if (!user?.uid) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = SubscriptionService.subscribeToUserSubscription(user.uid, (subData) => {
      if (subData) {
        // Auto-check expiry
        const isExp = SubscriptionService.isExpired(subData);
        if (isExp && subData.status === 'active') {
          subData.status = 'expired';
        }
        setSubscription(subData);
      } else {
        // Fallback check if user.profile has legacy premium flags
        if (user?.profile?.is_premium || user?.profile?.premium) {
          const fallbackExpiry = user.profile.premiumExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          setSubscription({
            plan: 'monthly',
            planName: PRICING.MONTHLY.title,
            status: 'active',
            expiryDate: fallbackExpiry,
            nextBillingDate: fallbackExpiry,
            autoRenew: true,
            currency: 'USD',
            price: 4.99
          });
        } else {
          setSubscription(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, user?.profile]);

  // Computed state
  const isPremium = useMemo(() => {
    return SubscriptionService.isPremium(subscription);
  }, [subscription]);

  const daysRemaining = useMemo(() => {
    return SubscriptionService.getDaysRemaining(subscription);
  }, [subscription]);

  const plan = useMemo(() => {
    if (!isPremium) return 'free';
    return subscription?.plan || 'monthly';
  }, [isPremium, subscription]);

  const status = useMemo(() => {
    if (!subscription) return 'free';
    if (SubscriptionService.isExpired(subscription)) return 'expired';
    return subscription.status || 'free';
  }, [subscription]);

  // Activate Plan helper
  const activatePlan = useCallback(async ({ planKey = 'monthly', paymentDetails = {} }) => {
    if (!user?.uid) throw new Error('Authentication required');
    const updatedSub = await SubscriptionService.activateSubscription({
      uid: user.uid,
      planKey,
      paymentDetails
    });
    setSubscription(updatedSub);
    return updatedSub;
  }, [user?.uid]);

  // Cancel Subscription helper
  const cancelSubscription = useCallback(async () => {
    if (!user?.uid) return false;
    const res = await SubscriptionService.cancelSubscription(user.uid);
    setSubscription(prev => prev ? { ...prev, autoRenew: false, status: 'canceled' } : null);
    return res;
  }, [user?.uid]);

  // Restore Purchase helper
  const restorePurchase = useCallback(async () => {
    if (!user?.uid) return null;
    const sub = await SubscriptionService.restorePurchase(user.uid);
    if (sub) setSubscription(sub);
    return sub;
  }, [user?.uid]);

  // Check Status helper
  const checkStatus = useCallback(() => {
    if (subscription && SubscriptionService.isExpired(subscription)) {
      setSubscription(prev => prev ? { ...prev, status: 'expired' } : null);
      return 'expired';
    }
    return status;
  }, [subscription, status]);

  const value = useMemo(() => ({
    subscription,
    plan,
    status,
    isPremium,
    daysRemaining,
    loading,
    pricing: PRICING,
    expiryDate: subscription?.expiryDate || null,
    nextBillingDate: subscription?.nextBillingDate || null,
    activatePlan,
    cancelSubscription,
    restorePurchase,
    checkStatus
  }), [
    subscription,
    plan,
    status,
    isPremium,
    daysRemaining,
    loading,
    activatePlan,
    cancelSubscription,
    restorePurchase,
    checkStatus
  ]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used inside SubscriptionProvider');
  }
  return context;
};
