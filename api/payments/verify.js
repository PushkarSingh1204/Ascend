import { activateSubscription, json, requireUser, validSignature } from '../_lib/payment.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const user = await requireUser(req);
    const { paymentId, orderId, signature } = req.body || {};
    if (!paymentId || !orderId || !validSignature(orderId, paymentId, signature)) return json(res, 400, { error: 'Payment signature verification failed.' });
    const subscription = await activateSubscription({ uid: user.uid, paymentId, orderId });
    return json(res, 200, { subscription });
  } catch (error) { return json(res, 400, { error: error.message || 'Payment verification failed.' }); }
}
