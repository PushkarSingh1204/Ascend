/* global process */
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
  if (!serviceAccount.project_id) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured.');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
