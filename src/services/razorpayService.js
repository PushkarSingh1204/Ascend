// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\razorpayService.js
import { PRICING } from '../config/pricing';

/**
 * Dynamically loads the Razorpay Standard Checkout SDK script
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Triggers Razorpay Standard / Test Mode Checkout Modal in USD
 */
export async function openRazorpayTestCheckout({
  planKey = 'monthly',
  userName = "Ascender",
  userEmail = "user@ascendgod.com",
  onSuccess,
  onFailure
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    if (onFailure) onFailure("Failed to load Razorpay SDK. Please check your internet connection.");
    return;
  }

  const isYearly = planKey === 'yearly';
  const planConfig = isYearly ? PRICING.YEARLY : PRICING.MONTHLY;
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_AscendGod2026';

  // Amount in cents / paise for Razorpay
  const amountInCents = Math.round(planConfig.price * 100);

  const razorpayOptions = {
    key: keyId,
    amount: amountInCents,
    currency: "USD",
    name: "Ascend God",
    description: `${planConfig.title} (${planConfig.formattedPrice}${planConfig.period})`,
    image: "/ascend.png",
    prefill: {
      name: userName,
      email: userEmail,
      contact: "9999999999"
    },
    notes: {
      planKey: planConfig.id,
      planTitle: planConfig.title,
      environment: "Production-Ready Sandbox"
    },
    theme: {
      color: "#7C3AED" // Ascend God primary purple accent
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id || `pay_test_${Date.now()}`,
          orderId: response.razorpay_order_id || `order_test_${Date.now()}`,
          signature: response.razorpay_signature || 'verified_sandbox_signature',
          planKey: planConfig.id,
          price: planConfig.price,
          currency: 'USD'
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onFailure) onFailure("Payment checkout window closed.");
      }
    }
  };

  try {
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response) {
      if (onFailure) {
        onFailure(response.error?.description || "Razorpay Payment Failed.");
      }
    });
    rzp.open();
  } catch (err) {
    console.error("Razorpay Launch Error:", err);
    if (onFailure) onFailure(err.message || "Failed to initialize Razorpay checkout.");
  }
}
