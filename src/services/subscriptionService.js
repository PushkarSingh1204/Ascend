// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\subscriptionService.js
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { PRICING } from '../config/pricing';

/**
 * SubscriptionService
 * Centralized service for calculating subscription validity, expiry, days remaining,
 * and managing Firestore subscription documents.
 */
export const SubscriptionService = {
  
  /**
   * Compute whether a subscription is currently active & valid (Expiry > Current Date)
   */
  isPremium(subscription) {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    if (!subscription.expiryDate) return false;
    
    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    return expiry > now;
  },

  /**
   * Calculate exact days remaining until subscription expiry
   */
  getDaysRemaining(subscription) {
    if (!subscription || !subscription.expiryDate) return 0;
    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    const diffMs = expiry.getTime() - now.getTime();
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  },

  /**
   * Check if a non-free subscription has passed its expiry date
   */
  isExpired(subscription) {
    if (!subscription || subscription.status === 'free' || !subscription.expiryDate) return false;
    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    return now >= expiry;
  },

  /**
   * Fetch subscription data from Firestore for a specific user ID
   */
  async getSubscription(uid) {
    const targetUid = uid || auth.currentUser?.uid;
    if (!targetUid) return null;

    try {
      // Check subcollection users/{uid}/subscription or main user profile
      const subDocRef = doc(db, 'users', targetUid, 'subscriptions', 'current');
      const subSnap = await getDoc(subDocRef);

      if (subSnap.exists()) {
        return subSnap.data();
      }

      // Fallback check user root document
      const userDocRef = doc(db, 'users', targetUid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists() && userSnap.data().subscription) {
        return userSnap.data().subscription;
      }
    } catch (err) {
      console.warn('[SubscriptionService] getSubscription error:', err);
    }

    return null;
  },

  /**
   * Subscribe to real-time subscription document updates in Firestore
   */
  subscribeToUserSubscription(uid, onUpdate) {
    if (!uid) return () => {};

    const subDocRef = doc(db, 'users', uid, 'subscriptions', 'current');
    return onSnapshot(subDocRef, (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data());
      } else {
        // Fallback: check root user doc
        const userDocRef = doc(db, 'users', uid);
        getDoc(userDocRef).then((uSnap) => {
          if (uSnap.exists() && uSnap.data().subscription) {
            onUpdate(uSnap.data().subscription);
          } else {
            onUpdate(null);
          }
        });
      }
    }, (error) => {
      console.error('[SubscriptionService] onSnapshot error:', error);
    });
  },

  /**
   * Activate or renew a subscription upon payment verification
   */
  async activateSubscription({ uid, planKey = 'monthly', paymentDetails = {} }) {
    const targetUid = uid || auth.currentUser?.uid;
    if (!targetUid) throw new Error('User authentication required for subscription activation.');

    const isYearly = planKey === 'yearly';
    const planConfig = isYearly ? PRICING.YEARLY : PRICING.MONTHLY;
    const durationDays = planConfig.durationDays || (isYearly ? 365 : 30);

    const now = new Date();
    const expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const subscriptionData = {
      plan: isYearly ? 'yearly' : 'monthly',
      planName: planConfig.title,
      status: 'active',
      provider: paymentDetails.provider || 'razorpay',
      orderId: paymentDetails.orderId || `order_${Date.now()}`,
      paymentId: paymentDetails.paymentId || `pay_${Date.now()}`,
      subscriptionId: paymentDetails.subscriptionId || `sub_${Date.now()}`,
      purchaseDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      nextBillingDate: expiryDate.toISOString(),
      autoRenew: true,
      currency: 'USD',
      price: planConfig.price,
      updatedAt: now.toISOString()
    };

    // 1. Write to subcollection users/{uid}/subscriptions/current
    const subDocRef = doc(db, 'users', targetUid, 'subscriptions', 'current');
    await setDoc(subDocRef, subscriptionData, { merge: true });

    // 2. Also record in history users/{uid}/subscription_history/{paymentId}
    const historyDocRef = doc(db, 'users', targetUid, 'subscription_history', subscriptionData.paymentId);
    await setDoc(historyDocRef, subscriptionData);

    // 3. Update root user doc for legacy compatibility
    const userDocRef = doc(db, 'users', targetUid);
    await setDoc(userDocRef, {
      subscription: subscriptionData,
      is_premium: true,
      premium: true,
      premiumPlan: planConfig.title,
      premiumStatus: 'active',
      premiumExpiresAt: expiryDate.toISOString(),
      updatedAt: now.toISOString()
    }, { merge: true });

    return subscriptionData;
  },

  /**
   * Cancel subscription auto-renewal
   */
  async cancelSubscription(uid) {
    const targetUid = uid || auth.currentUser?.uid;
    if (!targetUid) return false;

    const updates = {
      autoRenew: false,
      status: 'canceled',
      updatedAt: new Date().toISOString()
    };

    const subDocRef = doc(db, 'users', targetUid, 'subscriptions', 'current');
    await updateDoc(subDocRef, updates).catch(() => {});

    const userDocRef = doc(db, 'users', targetUid);
    await setDoc(userDocRef, {
      'subscription.autoRenew': false,
      'subscription.status': 'canceled',
      premiumStatus: 'canceled'
    }, { merge: true }).catch(() => {});

    return true;
  },

  /**
   * Restore purchase on device login
   */
  async restorePurchase(uid) {
    return await this.getSubscription(uid);
  }
};
