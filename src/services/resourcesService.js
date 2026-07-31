// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\resourcesService.js
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  increment,
  query,
  orderBy 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { INITIAL_RESOURCES } from '../data/resourcesSeed';

// Fetch all resources from Firestore (falls back to seed data if empty/offline)
export const getResources = async () => {
  try {
    const collRef = collection(db, 'resources');
    const snap = await getDocs(collRef);
    if (!snap.empty) {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return items;
    }
  } catch (err) {
    console.warn("Firestore resources fetch error, using seed fallback:", err);
  }
  return INITIAL_RESOURCES;
};

// Create or Update a Resource document in Firestore
export const saveResource = async (resourceData) => {
  try {
    const resId = resourceData.id || `res_${Date.now()}`;
    const docRef = doc(db, 'resources', resId);
    
    const payload = {
      ...resourceData,
      id: resId,
      status: resourceData.status || 'published',
      updatedAt: new Date().toISOString()
    };

    if (!payload.createdAt) {
      payload.createdAt = new Date().toISOString();
    }
    
    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (err) {
    console.error("Save resource error:", err);
    throw err;
  }
};

// Delete a Resource from Firestore
export const deleteResource = async (resourceId) => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Delete resource error:", err);
    throw err;
  }
};

// Increment view count analytics
export const incrementResourceViews = async (resourceId) => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    await updateDoc(docRef, { views: increment(1) });
  } catch (err) {
    // Non-blocking
  }
};

// Increment download count analytics
export const incrementResourceDownloads = async (resourceId) => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    await updateDoc(docRef, { downloads: increment(1) });
  } catch (err) {
    // Non-blocking
  }
};

// --- USER BOOKMARKS (Firestore users/{uid}/bookmarks & localStorage sync) ---
export const getUserBookmarks = async () => {
  const user = auth.currentUser;
  if (!user) {
    try {
      const local = localStorage.getItem('ascend_bookmarks');
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  }

  try {
    const collRef = collection(db, 'users', user.uid, 'bookmarks');
    const snap = await getDocs(collRef);
    const bookmarks = snap.docs.map(d => d.id);
    localStorage.setItem('ascend_bookmarks', JSON.stringify(bookmarks));
    return bookmarks;
  } catch (err) {
    const local = localStorage.getItem('ascend_bookmarks');
    return local ? JSON.parse(local) : [];
  }
};

export const toggleUserBookmark = async (resourceId) => {
  const user = auth.currentUser;
  const current = await getUserBookmarks();
  const exists = current.includes(resourceId);
  const updated = exists 
    ? current.filter(id => id !== resourceId) 
    : [...current, resourceId];

  localStorage.setItem('ascend_bookmarks', JSON.stringify(updated));

  if (user) {
    try {
      const docRef = doc(db, 'users', user.uid, 'bookmarks', resourceId);
      if (exists) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { resourceId, bookmarkedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn("Bookmark sync error:", err);
    }
  }

  return updated;
};

// --- USER RESOURCE PROGRESS (Firestore users/{uid}/resourceProgress) ---
export const getUserProgress = async () => {
  const user = auth.currentUser;
  if (!user) return {};
  try {
    const collRef = collection(db, 'users', user.uid, 'resourceProgress');
    const snap = await getDocs(collRef);
    const progressMap = {};
    snap.docs.forEach(d => {
      progressMap[d.id] = d.data();
    });
    return progressMap;
  } catch (err) {
    return {};
  }
};

export const updateUserProgress = async (resourceId, progressData) => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const docRef = doc(db, 'users', user.uid, 'resourceProgress', resourceId);
    const payload = {
      resourceId,
      ...progressData,
      lastOpenedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (err) {
    return null;
  }
};
