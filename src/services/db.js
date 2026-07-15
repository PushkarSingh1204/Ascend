// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\db.js
import { doc, getDoc, updateDoc, setDoc, collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from './firebase';

// Available badges configuration
export const BADGES = [
  { id: 'first_step', name: 'First Step', description: 'Complete your first onboarding session', icon: '🐣', xp: 100, category: 'Transformation' },
  { id: '7_day_streak', name: 'Weekly Warrior', description: 'Log in 7 days in a row', icon: '🔥', xp: 300, category: 'Consistency' },
  { id: '30_day_streak', name: 'Dedicated Ascender', description: 'Log in 30 days in a row', icon: '👑', xp: 1000, category: 'Consistency' },
  { id: 'routine_pioneer', name: 'Habit Builder', description: 'Complete all morning and night routines', icon: '📅', xp: 200, category: 'Routine' },
  { id: 'hydration_king', name: 'Hydration Hero', description: 'Drink 2.5L+ water in a single day', icon: '💧', xp: 150, category: 'Routine' },
  { id: 'deep_sleep', name: 'Rest & Recover', description: 'Log 8+ hours of sleep', icon: '🌙', xp: 100, category: 'Routine' },
  { id: 'journal_entry', name: 'Self-Reflector', description: 'Write your first journal entry', icon: '📝', xp: 100, category: 'Journal' },
  { id: 'first_analysis', name: 'Visual Baseline', description: 'Complete your first face harmony analysis', icon: '👁️', xp: 250, category: 'Analysis' },
  { id: 'premium_unlocked', name: 'Limitless Potential', description: 'Unlock Ascend Plus premium features', icon: '⚡', xp: 500, category: 'Transformation' },
];

const ROADMAP_TEMPLATES = {
  Face: [
    { id: 'rm_1', week: 1, title: 'Posture & Alignment', text: 'Complete daily chin-tucks and posture stretching for 5 days', completed: false },
    { id: 'rm_2', week: 1, title: 'Nasal Breathing', text: 'Practice continuous nasal breathing and mouth tape check', completed: false },
    { id: 'rm_3', week: 1, title: 'Hydration Base', text: 'Reach daily water intake target 5 times this week', completed: false },
    { id: 'rm_4', week: 2, title: 'Massage & Muscle Tone', text: 'Perform masseter muscle massage twice to relieve tension', completed: false },
    { id: 'rm_5', week: 2, title: 'Cold Face Rinses', text: 'Rinse face with cold water every morning to reduce puffiness', completed: false },
    { id: 'rm_6', week: 2, title: 'Daily Mewing Check', text: 'Check resting tongue posture 3 times daily', completed: false },
    { id: 'rm_7', week: 3, title: 'Sleep Hygiene', text: 'Aim for 8 hours of sleep for 5 nights this week', completed: false },
    { id: 'rm_8', week: 3, title: 'Consistent Skincare', text: 'Wash and moisturize face morning & night', completed: false },
    { id: 'rm_9', week: 3, title: 'Week 3 Progress Photo', text: 'Upload Week 3 progress photo to log timeline', completed: false },
    { id: 'rm_10', week: 4, title: 'Consistency Streak', text: 'Log active check-in 7 days straight', completed: false },
    { id: 'rm_11', week: 4, title: 'Reflective Journaling', text: 'Write 3 entries in your transformation journal', completed: false },
    { id: 'rm_12', week: 4, title: 'Final Scan Comparison', text: 'Compare current harmony score with baseline', completed: false }
  ],
  Fitness: [
    { id: 'rm_1', week: 1, title: 'Posture Baseline', text: 'Perform spinal alignment stretches for 5 days', completed: false },
    { id: 'rm_2', week: 1, title: 'Active Start', text: 'Log 15 min cardio 3 times this week', completed: false },
    { id: 'rm_3', week: 1, title: 'Hydration Target', text: 'Drink 2L+ water daily for 5 days', completed: false },
    { id: 'rm_4', week: 2, title: 'Core Engagement', text: 'Perform plank and posture checks twice daily', completed: false },
    { id: 'rm_5', week: 2, title: 'Resistance Training', text: 'Complete 3 resistance workouts', completed: false },
    { id: 'rm_6', week: 2, title: 'Sleep Recovery', text: 'Log 7.5+ hours of sleep for 5 nights', completed: false },
    { id: 'rm_7', week: 3, title: 'Stretching Routine', text: 'Perform active stretching daily after workouts', completed: false },
    { id: 'rm_8', week: 3, title: 'Hydration Consistency', text: 'Meet daily water targets every day', completed: false },
    { id: 'rm_9', week: 3, title: 'Week 3 Body Photo', text: 'Upload Week 3 progress photo', completed: false },
    { id: 'rm_10', week: 4, title: 'Cardio Velocity', text: 'Perform 20 min high intensity cardio', completed: false },
    { id: 'rm_11', week: 4, title: 'Consistency Peak', text: 'Log check-in 7 days straight', completed: false },
    { id: 'rm_12', week: 4, title: 'Milestone Review', text: 'Perform weekly review and check XP growth', completed: false }
  ],
  Grooming: [
    { id: 'rm_1', week: 1, title: 'Skin Cleanse', text: 'Establish a morning cleanser routine', completed: false },
    { id: 'rm_2', week: 1, title: 'Posture Awareness', text: 'Stretches for facial/neck posture alignment', completed: false },
    { id: 'rm_3', week: 1, title: 'Hydration Base', text: 'Drink 2.5L water daily for 4 days', completed: false },
    { id: 'rm_4', week: 2, title: 'Night Cleanse', text: 'Moisturize face before bed daily', completed: false },
    { id: 'rm_4b', week: 2, title: 'Hair & Scalp Health', text: 'Implement specialized hair wash routine twice', completed: false },
    { id: 'rm_5', week: 2, title: 'Sun Protection', text: 'Apply sunscreen daily in the morning', completed: false },
    { id: 'rm_7', week: 3, title: 'Rest Cycle', text: 'Get 8 hours of sleep for 5 nights', completed: false },
    { id: 'rm_8', week: 3, title: 'Exfoliate Weekly', text: 'Apply mild chemical exfoliant twice', completed: false },
    { id: 'rm_9', week: 3, title: 'Week 3 Progress Photo', text: 'Upload Week 3 progress photo', completed: false },
    { id: 'rm_10', week: 4, title: 'Daily Checkin', text: 'Log check-in 7 days straight', completed: false },
    { id: 'rm_11', week: 4, title: 'Self Reflection', text: 'Complete 3 journal logs', completed: false },
    { id: 'rm_12', week: 4, title: 'Base Comparison', text: 'Review skin clarity and facial harmony scan', completed: false }
  ],
  Overall: [
    { id: 'rm_1', week: 1, title: 'Routines Setup', text: 'Create morning and night checklists', completed: false },
    { id: 'rm_2', week: 1, title: 'Posture Alignment', text: 'Stretches for facial/neck posture alignment', completed: false },
    { id: 'rm_3', week: 1, title: 'Water Benchmark', text: 'Drink 2.5L water daily for 5 days', completed: false },
    { id: 'rm_4', week: 2, title: 'Skincare Base', text: 'Wash and moisturize face daily', completed: false },
    { id: 'rm_5', week: 2, title: 'Active Cardio', text: 'Log 15 min cardio 3 times this week', completed: false },
    { id: 'rm_6', week: 2, title: 'Sleep Cycles', text: 'Get 7.5+ hours of sleep for 5 nights', completed: false },
    { id: 'rm_7', week: 3, title: 'Tongue Posture', text: 'Practice correct resting tongue posture (mewing)', completed: false },
    { id: 'rm_8', week: 3, title: 'Hydration Target', text: 'Meet water target 6 times this week', completed: false },
    { id: 'rm_9', week: 3, title: 'Week 3 Progress Photo', text: 'Upload Week 3 progress photo', completed: false },
    { id: 'rm_10', week: 4, title: 'Logging Streak', text: 'Log check-in 7 days straight', completed: false },
    { id: 'rm_11', week: 4, title: 'Mindful Journal', text: 'Write 3 entries in your journal', completed: false },
    { id: 'rm_12', week: 4, title: 'Final Scan Comparison', text: 'Compare current harmony score with baseline', completed: false }
  ]
};

const DEFAULT_ROUTINES = {
  morning: [
    { id: 'm1', text: 'Tongue posture check (mewing)', completed: false },
    { id: 'm2', text: 'Face cleanse with cold water', completed: false },
    { id: 'm3', text: 'Drink 500ml water', completed: false }
  ],
  night: [
    { id: 'n1', text: 'Cleanse and apply moisturizer', completed: false },
    { id: 'n2', text: 'Tongue posture / neck alignment check', completed: false },
    { id: 'n3', text: 'Read for 15 mins (wind down)', completed: false }
  ],
  skincare: [
    { id: 's1', text: 'Gentle Cleanser', completed: false },
    { id: 's2', text: 'Vitamin C Serum (Morning)', completed: false },
    { id: 's3', text: 'Moisturizer with SPF 30 (Morning)', completed: false },
    { id: 's4', text: 'Hyaluronic Acid / Night Serum', completed: false }
  ],
  workout: [
    { id: 'w1', text: 'Posture correction exercises (10 min)', completed: false },
    { id: 'w2', text: 'Neck stretches & chin tucks', completed: false },
    { id: 'w3', text: 'Cardio / High intensity workout (20 min)', completed: false },
    { id: 'w4', text: 'Jaw muscle alignment exercise', completed: false }
  ]
};

// Retrieve User main profile helper
export const getProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  const userDocRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userDocRef);
  return snap.exists() ? snap.data() : null;
};

// Update user profile helper
export const updateProfile = async (updates) => {
  const user = auth.currentUser;
  if (!user) return null;
  const userDocRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userDocRef);
  const data = snap.exists() ? snap.data() : {};
  const updated = { ...data, ...updates };
  
  if (updated.streak > updated.longest_streak) {
    updated.longest_streak = updated.streak;
  }
  
  await setDoc(userDocRef, updated);
  return updated;
};

// Get Routines checklist list
export const getRoutines = async () => {
  const profile = await getProfile();
  if (!profile || !profile.routines) {
    // If not found, write and return default routines
    const defaultRoutines = { ...DEFAULT_ROUTINES };
    await updateProfile({ routines: defaultRoutines });
    return defaultRoutines;
  }
  return profile.routines;
};

// Toggle checklist task completed status
export const updateRoutineTask = async (category, taskId, completed) => {
  const profile = await getProfile();
  if (!profile || !profile.routines) return DEFAULT_ROUTINES;
  
  const routines = { ...profile.routines };
  const idx = routines[category].findIndex(t => t.id === taskId);
  if (idx !== -1) {
    routines[category][idx].completed = completed;
    
    // Auto flag daily missions
    const dailyMissions = { ...profile.daily_missions };
    if (category === 'skincare') {
      dailyMissions.skincare = routines.skincare.every(t => t.completed);
    }
    
    await updateProfile({ routines, daily_missions: dailyMissions });
  }
  return routines;
};

// Get daily missions checklist
export const getDailyMissions = async () => {
  const profile = await getProfile();
  if (!profile) return { checkin: false, sleep: false, water: false, skincare: false, journal: false };
  if (!profile.daily_missions) {
    const defaultMissions = { checkin: false, sleep: false, water: false, skincare: false, journal: false };
    await updateProfile({ daily_missions: defaultMissions });
    return defaultMissions;
  }
  return profile.daily_missions;
};

// Update custom daily mission status
export const updateMission = async (missionKey, status) => {
  const profile = await getProfile();
  if (!profile) return {};
  const dailyMissions = { ...profile.daily_missions, [missionKey]: status };
  await updateProfile({ daily_missions: dailyMissions });
  return dailyMissions;
};

// Get Roadmap milestones list
export const getRoadmapMilestones = async () => {
  const profile = await getProfile();
  if (!profile) return [];
  if (!profile.roadmap_milestones) {
    const template = ROADMAP_TEMPLATES[profile.focus_area || 'Face'] || ROADMAP_TEMPLATES.Face;
    await updateProfile({ roadmap_milestones: template });
    return template;
  }
  return profile.roadmap_milestones;
};

// Toggle milestone checkmark
export const updateRoadmapMilestone = async (milestoneId, completed) => {
  const profile = await getProfile();
  if (!profile || !profile.roadmap_milestones) return [];
  const milestones = [...profile.roadmap_milestones];
  const idx = milestones.findIndex(m => m.id === milestoneId);
  if (idx !== -1) {
    milestones[idx].completed = completed;
    await updateProfile({ roadmap_milestones: milestones });
  }
  return milestones;
};

// Regenerate templates based on focus area
export const regenerateRoadmap = async (focusArea) => {
  const template = ROADMAP_TEMPLATES[focusArea] || ROADMAP_TEMPLATES.Face;
  const milestones = JSON.parse(JSON.stringify(template));
  await updateProfile({ 
    focus_area: focusArea,
    roadmap_milestones: milestones 
  });
  return milestones;
};

// Retrieve sleep logs
export const getSleepLog = async () => {
  const profile = await getProfile();
  if (!profile || !profile.sleep_log) {
    const defaultSleep = { current: 0, target: 8.0 };
    await updateProfile({ sleep_log: defaultSleep });
    return defaultSleep;
  }
  return profile.sleep_log;
};

// Log sleep efficiency hours
export const updateSleepLog = async (hours) => {
  const profile = await getProfile();
  if (!profile) return { current: 0, target: 8.0 };
  const sleepLog = { ...profile.sleep_log, current: hours };
  const dailyMissions = { ...profile.daily_missions, sleep: hours >= sleepLog.target };
  await updateProfile({ sleep_log: sleepLog, daily_missions: dailyMissions });
  return sleepLog;
};

// Retrieve water metrics log
export const getWaterLog = async () => {
  const profile = await getProfile();
  if (!profile || !profile.water_log) {
    const defaultWater = { current: 0, target: 2000 };
    await updateProfile({ water_log: defaultWater });
    return defaultWater;
  }
  return profile.water_log;
};

// Log water hydration intake ml
export const updateWaterLog = async (amount) => {
  const profile = await getProfile();
  if (!profile) return { current: 0, target: 2000 };
  const waterLog = { ...profile.water_log };
  waterLog.current = Math.max(0, waterLog.current + amount);
  const dailyMissions = { ...profile.daily_missions, water: waterLog.current >= waterLog.target };
  await updateProfile({ water_log: waterLog, daily_missions: dailyMissions });
  return waterLog;
};

// --- SUBCOLLECTION CALLS ---

// Get Journals subcollection
export const getJournals = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  const collRef = collection(db, 'users', user.uid, 'journals');
  const snap = await getDocs(collRef);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Add entry reflections journal
export const addJournalEntry = async (entry) => {
  const user = auth.currentUser;
  if (!user) return [];
  const collRef = collection(db, 'users', user.uid, 'journals');
  const newDoc = {
    date: new Date().toISOString().split('T')[0],
    ...entry
  };
  await addDoc(collRef, newDoc);
  await updateMission('journal', true);
  return getJournals();
};

// Get Progress visual photos list
export const getProgressPhotos = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  const collRef = collection(db, 'users', user.uid, 'progress_photos');
  const snap = await getDocs(collRef);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Upload progress photo to storage and log to Firestore
export const addProgressPhoto = async (photoBase64, notes) => {
  const user = auth.currentUser;
  if (!user) return [];
  
  // 1. Upload base64 image data to Storage bucket
  const filename = `progress_${Date.now()}.jpg`;
  const storageRef = ref(storage, `progress_photos/${user.uid}/${filename}`);
  await uploadString(storageRef, photoBase64, 'data_url');
  const downloadUrl = await getDownloadURL(storageRef);

  // 2. Add document record in Firestore
  const collRef = collection(db, 'users', user.uid, 'progress_photos');
  const existing = await getProgressPhotos();
  const weekNum = existing.length + 1;
  
  const newPhotoDoc = {
    date: new Date().toISOString().split('T')[0],
    week_number: weekNum,
    photo_url: downloadUrl,
    notes: notes || `Week ${weekNum} Progress Photo`
  };
  await addDoc(collRef, newPhotoDoc);
  return getProgressPhotos();
};

// Get facial harmony scans list
export const getAnalyses = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  const collRef = collection(db, 'users', user.uid, 'scans');
  const snap = await getDocs(collRef);
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Save a new face symmetry harmony analysis
export const saveAnalysis = async (analysis) => {
  const user = auth.currentUser;
  if (!user) return null;

  // Upload front image if base64
  let frontUrl = analysis.front_photo_url;
  if (frontUrl && frontUrl.startsWith('data:image')) {
    const refFront = ref(storage, `scans/${user.uid}/front_${Date.now()}.jpg`);
    await uploadString(refFront, frontUrl, 'data_url');
    frontUrl = await getDownloadURL(refFront);
  }

  // Upload side image if base64
  let sideUrl = analysis.side_photo_url;
  if (sideUrl && sideUrl.startsWith('data:image')) {
    const refSide = ref(storage, `scans/${user.uid}/side_${Date.now()}.jpg`);
    await uploadString(refSide, sideUrl, 'data_url');
    sideUrl = await getDownloadURL(refSide);
  }

  const collRef = collection(db, 'users', user.uid, 'scans');
  const newScan = {
    date: new Date().toISOString().split('T')[0],
    front_photo_url: frontUrl,
    side_photo_url: sideUrl,
    is_premium_unlocked: true,
    ...analysis
  };
  
  const docRef = await addDoc(collRef, newScan);
  return { id: docRef.id, ...newScan };
};

// Unlock reports for single scan
export const unlockAnalysis = async (analysisId) => {
  const user = auth.currentUser;
  if (!user) return null;
  const docRef = doc(db, 'users', user.uid, 'scans', analysisId);
  await updateDoc(docRef, { is_premium_unlocked: true });
  return { id: analysisId, is_premium_unlocked: true };
};

// Get check-ins history dates
export const getCheckins = async () => {
  const profile = await getProfile();
  return profile ? (profile.checkins || []) : [];
};

// Trigger check-in, update streak tracking
export const submitCheckin = async (notes = '') => {
  const profile = await getProfile();
  if (!profile) return { checkins: [], profile: {} };

  const todayStr = new Date().toISOString().split('T')[0];
  const checkins = profile.checkins ? [...profile.checkins] : [];
  
  if (!checkins.includes(todayStr)) {
    checkins.push(todayStr);
    
    const dailyMissions = { ...profile.daily_missions, checkin: true };
    const daysToAscend = (profile.days_to_ascend || 0) + 1;
    
    // Recalculate streak
    let streak = 1;
    let checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1);
    
    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (checkins.includes(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    const updates = {
      checkins,
      daily_missions: dailyMissions,
      days_to_ascend: daysToAscend,
      streak
    };
    
    const updatedProfile = await updateProfile(updates);
    return { checkins, profile: updatedProfile };
  }
  
  return { checkins, profile };
};
