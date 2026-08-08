// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\config\pricing.js

/**
 * Centralized Single Source of Truth for Ascend Subscription Pricing.
 * All pages (Payments, Premium, Profile, Cards) must import pricing from here.
 * Currency is strictly USD ($).
 */
export const PRICING = {
  CURRENCY: 'USD',
  CURRENCY_SYMBOL: '$',
  
  FREE: {
    id: 'free',
    name: 'Free Tier',
    title: 'Ascend Free',
    price: 0,
    formattedPrice: '$0',
    period: 'Forever',
    durationDays: 0,
    description: 'Basic facial harmony tracking & entry routines.',
    features: [
      '1 Facial Harmony Scan',
      'Basic Daily Checklist Routines',
      'Community & Public Guides',
      'Standard XP Progression'
    ]
  },

  MONTHLY: {
    id: 'monthly',
    name: 'Monthly Plan',
    title: 'Ascend Plus Monthly',
    price: 4.99,
    formattedPrice: '$4.99',
    period: '/ month',
    durationDays: 30,
    badge: 'Most Popular',
    description: 'Full transformation toolkit billed monthly.',
    features: [
      'Unlimited Biometric Harmony Scans',
      'AI Potential Forecast & Growth Timeline',
      'Unlimited AI Coaching Recommendations',
      'Complete Knowledge Vault & PDF Blueprints',
      'Advanced Insights & Historical Charts',
      'Priority Feature Updates'
    ]
  },

  YEARLY: {
    id: 'yearly',
    name: 'Yearly Plan',
    title: 'Ascend Plus Yearly',
    price: 39.99,
    formattedPrice: '$39.99',
    period: '/ year',
    monthlyEquivalent: '$3.33',
    durationDays: 365,
    badge: 'Save 33%',
    description: 'Maximum savings for committed ascenders.',
    features: [
      'Everything in Monthly Plan',
      '33% Discount ($3.33/mo equivalent)',
      '365 Days Guaranteed Premium Access',
      'Exclusive Biomechanical Exercise Guides',
      'VIP Priority AI Recommendation Pipeline',
      'Early Access to New Biomarkers'
    ]
  }
};
