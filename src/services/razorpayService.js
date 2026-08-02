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
  order,
  planTitle = "Ascend Plus",
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

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!keyId || !order?.id || !order?.amount) {
    onFailure?.('Checkout is not configured. Please try again later.');
    return;
  }

  const razorpayOptions = {
    key: keyId,
    amount: order.amount,
    order_id: order.id,
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
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
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
