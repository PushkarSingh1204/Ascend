/* global process, Buffer */
import crypto from 'node:crypto';
import { adminAuth, adminDb } from './firebaseAdmin.js';

export const json = (res, status, payload) => res.status(status).json(payload);
export async function requireUser(req) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Authentication required.');
  return adminAuth.verifyIdToken(token);
}
export function razorpayAuth() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new Error('Payment provider is not configured.');
  return `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`;
}
export async function activateSubscription({ uid, paymentId, orderId }) {
  const now = new Date().toISOString();
  const subscription = { userId: uid, plan: 'ascend_plus', status: 'active', isPremium: true, paymentId, orderId, purchaseDate: now, expiryDate: null, provider: 'razorpay', updatedAt: now };
  const batch = adminDb.batch();
  batch.set(adminDb.collection('subscriptions').doc(uid), subscription, { merge: true });
  batch.set(adminDb.collection('users').doc(uid), { isPremium: true, is_premium: true, subscriptionStatus: 'active', purchaseDate: now, expiryDate: null, paymentProvider: 'razorpay', paymentId }, { merge: true });
  await batch.commit();
  return subscription;
}
export function validSignature(orderId, paymentId, signature) {
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  const supplied = Buffer.from(signature || '');
  return supplied.length === expected.length && crypto.timingSafeEqual(Buffer.from(expected), supplied);
}
