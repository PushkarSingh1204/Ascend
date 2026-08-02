/* global process, Buffer */
import crypto from 'node:crypto';
import { activateSubscription, json } from '../_lib/payment.js';

export const config = { api: { bodyParser: false } };
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const chunks = []; for await (const chunk of req) chunks.push(chunk); const raw = Buffer.concat(chunks);
    const signature = req.headers['x-razorpay-signature'];
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex');
    const supplied = Buffer.from(signature || '');
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(expected), supplied)) return json(res, 400, { error: 'Invalid webhook signature.' });
    const event = JSON.parse(raw.toString());
    if (event.event === 'payment.captured') { const payment = event.payload.payment.entity; const uid = payment.notes?.userId; if (uid) await activateSubscription({ uid, paymentId: payment.id, orderId: payment.order_id }); }
    return json(res, 200, { ok: true });
  } catch (error) { return json(res, 400, { error: error.message || 'Webhook handling failed.' }); }
}
