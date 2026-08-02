import { adminDb } from '../_lib/firebaseAdmin.js';
import { json, requireUser } from '../_lib/payment.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try { const user = await requireUser(req); const snap = await adminDb.collection('subscriptions').doc(user.uid).get(); return json(res, 200, { subscription: snap.exists ? snap.data() : null }); }
  catch (error) { return json(res, 400, { error: error.message || 'Could not restore subscription.' }); }
}
