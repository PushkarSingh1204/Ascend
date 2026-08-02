import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { useAuth } from './AuthContext';
import { openRazorpayTestCheckout } from '../services/razorpayService';

const SubscriptionContext = createContext(null);

async function api(path, body) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error('Please sign in before upgrading.');
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body || {}) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Payment service is unavailable.');
  return data;
}

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const checkSubscription = useCallback(async () => {
    if (!user?.uid) { setSubscription(null); setLoading(false); return null; }
    const result = await api('/api/payments/subscription');
    setSubscription(result.subscription || null);
    return result.subscription;
  }, [user?.uid]);
  useEffect(() => {
    if (!user?.uid) { setSubscription(null); setLoading(false); return undefined; }
    setLoading(true);
    return onSnapshot(doc(db, 'subscriptions', user.uid), (snapshot) => {
      setSubscription(snapshot.exists() ? snapshot.data() : null);
      setLoading(false);
    }, () => setLoading(false));
  }, [user?.uid]);
  const isPremium = subscription?.isPremium === true && subscription?.status === 'active';
  const upgrade = useCallback(async ({ onSuccess, onFailure } = {}) => {
    try {
      const { order } = await api('/api/payments/create-order', { plan: 'ascend_plus' });
      await openRazorpayTestCheckout({ order, userName: user?.profile?.name, userEmail: user?.email,
        onSuccess: async (payment) => { try { const verified = await api('/api/payments/verify', payment); await checkSubscription(); onSuccess?.(verified.subscription); } catch (error) { onFailure?.(error.message); } },
        onFailure
      });
    } catch (error) { onFailure?.(error.message); }
  }, [checkSubscription, user?.email, user?.profile?.name]);
  const value = useMemo(() => ({ subscription, isPremium, loading, upgrade, restorePurchase: checkSubscription, checkSubscription }), [subscription, isPremium, loading, upgrade, checkSubscription]);
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}
export const useSubscription = () => { const context = useContext(SubscriptionContext); if (!context) throw new Error('useSubscription must be used inside SubscriptionProvider'); return context; };
