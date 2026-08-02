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
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { INITIAL_RESOURCES } from '../data/resourcesSeed';

/**
 * Seed initial resources to Firestore if the collection is empty.
 */
export const seedInitialResources = async () => {
  try {
    const collRef = collection(db, 'resources');
    const snap = await getDocs(collRef);
    if (snap.empty) {
      for (const res of INITIAL_RESOURCES) {
        const docRef = doc(db, 'resources', res.id);
        await setDoc(docRef, {
          ...res,
          trending: res.trending || false,
          featured: res.featured || false,
          status: res.status || 'published',
          createdAt: res.createdAt || new Date().toISOString(),
          updatedAt: res.updatedAt || new Date().toISOString()
        });
      }
      return INITIAL_RESOURCES;
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("Error seeding initial resources:", err);
    return INITIAL_RESOURCES;
  }
};

/**
 * Fetch all resources once (Fallback)
 */
export const getResources = async () => {
  try {
    const collRef = collection(db, 'resources');
    const snap = await getDocs(collRef);
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn("Firestore resources fetch error, using seed fallback:", err);
  }
  return seedInitialResources();
};

/**
 * Subscribe to real-time resources collection updates from Firestore.
 */
export const subscribeToResources = (onUpdate, onError) => {
  try {
    const collRef = collection(db, 'resources');
    return onSnapshot(collRef, (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        onUpdate(items);
      } else {
        seedInitialResources().then(seeded => onUpdate(seeded));
      }
    }, (err) => {
      console.warn("Firestore resources subscription error:", err);
      if (onError) onError(err);
    });
  } catch (err) {
    console.error("Failed to subscribe to resources:", err);
    return () => {};
  }
};

/**
 * Create or Update a Resource document in Firestore
 */
export const saveResource = async (resourceData) => {
  try {
    const resId = resourceData.id || `res_${Date.now()}`;
    const docRef = doc(db, 'resources', resId);
    
    const payload = {
      ...resourceData,
      id: resId,
      status: resourceData.status || 'published',
      trending: Boolean(resourceData.trending),
      featured: Boolean(resourceData.featured),
      premium: Boolean(resourceData.premium),
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

/**
 * Quick toggle flags (trending, featured, premium, status)
 */
export const updateResourceFlags = async (resourceId, flagUpdates) => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    await updateDoc(docRef, {
      ...flagUpdates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error("Update resource flags error:", err);
    throw err;
  }
};

/**
 * Delete a Resource from Firestore
 */
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

/**
 * Analytics Counters
 */
export const incrementResourceViews = async (resourceId) => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    await updateDoc(docRef, { views: increment(1) });
  } catch (err) {
    // Non-blocking
  }
};

export const incrementResourceDownloads = async (resourceId) => {
  try {
    const docRef = doc(db, 'resources', resourceId);
    await updateDoc(docRef, { downloads: increment(1) });
  } catch (err) {
    // Non-blocking
  }
};

/**
 * USER BOOKMARKS (Firestore users/{uid}/bookmarks & localStorage sync)
 */
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

/**
 * USER RESOURCE PROGRESS
 */
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
