// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\razorpayService.js

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
 * Triggers Razorpay Test Mode Checkout Modal
 * @param {Object} options Configuration object (amount, name, email, planName, onSuccess, onFailure)
 */
export async function openRazorpayTestCheckout({
  amountInINR = 499,
  planTitle = "Ascend God PRO Membership",
  userName = "Transformer",
  userEmail = "user@ascendgod.com",
  onSuccess,
  onFailure
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    if (onFailure) onFailure("Failed to load Razorpay SDK. Please check internet connectivity.");
    return;
  }

  // Razorpay Test Mode Key ID (Sandbox environment)
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_AscendGod2026';

  const razorpayOptions = {
    key: keyId,
    amount: amountInINR * 100, // Amount in paise (₹499 -> 49900 paise)
    currency: "INR",
    name: "Ascend God",
    description: `${planTitle} (Test Mode Sandbox)`,
    image: "/ascend.png",
    prefill: {
      name: userName,
      email: userEmail,
      contact: "9999999999"
    },
    notes: {
      environment: "Test Sandbox Mode",
      platform: "Ascend God"
    },
    theme: {
      color: "#7C3AED" // Ascend God primary purple accent
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || `test_order_${Date.now()}`,
          signature: response.razorpay_signature || 'sandbox_test_signature'
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onFailure) onFailure("Payment modal closed by user.");
      }
    }
  };

  try {
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response) {
      if (onFailure) {
        onFailure(response.error?.description || "Razorpay Test Payment Failed.");
      }
    });
    rzp.open();
  } catch (err) {
    console.error("Razorpay Test Mode Launch Error:", err);
    if (onFailure) onFailure(err.message || "Failed to initialize Razorpay modal.");
  }
}
