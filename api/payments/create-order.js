import { json, requireUser, razorpayAuth } from '../_lib/payment.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const user = await requireUser(req);
    const response = await fetch('https://api.razorpay.com/v1/orders', { method: 'POST', headers: { Authorization: razorpayAuth(), 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 49900, currency: 'INR', receipt: `ascend_${user.uid.slice(0, 18)}_${Date.now()}`, notes: { userId: user.uid, plan: 'ascend_plus' } }) });
    const order = await response.json();
    if (!response.ok) throw new Error(order.error?.description || 'Could not create a secure payment order.');
    return json(res, 200, { order: { id: order.id, amount: order.amount, currency: order.currency } });
  } catch (error) { return json(res, 400, { error: error.message || 'Unable to create order.' }); }
}
