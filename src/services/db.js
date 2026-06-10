// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\db.js

// Available badges config
export const BADGES = [
  { id: 'first_step', name: 'First Step', description: 'Complete your first onboarding session', icon: '🐣', xp: 100 },
  { id: '7_day_streak', name: 'Weekly Warrior', description: 'Log in 7 days in a row', icon: '🔥', xp: 300 },
  { id: '30_day_streak', name: 'Dedicated Ascender', description: 'Log in 30 days in a row', icon: '👑', xp: 1000 },
  { id: 'routine_pioneer', name: 'Habit Builder', description: 'Complete all morning and night routines', icon: '📅', xp: 200 },
  { id: 'hydration_king', name: 'Hydration Hero', description: 'Drink 2.5L+ water in a single day', icon: '💧', xp: 150 },
  { id: 'deep_sleep', name: 'Rest & Recover', description: 'Log 8+ hours of sleep', icon: '🌙', xp: 100 },
  { id: 'journal_entry', name: 'Self-Reflector', description: 'Write your first journal entry', icon: '📝', xp: 100 },
  { id: 'first_analysis', name: 'Visual Baseline', description: 'Complete your first face harmony analysis', icon: '👁️', xp: 250 },
  { id: 'premium_unlocked', name: 'Limitless Potential', description: 'Unlock a premium harmony report', icon: '⚡', xp: 500 },
];

const INITIAL_MOCK_DATA = {
  user_profile: {
    name: "Alex Carter",
    age: 24,
    gender: "Male",
    height_cm: 180,
    weight_kg: 75,
    goal_description: "I want to improve my posture, establish a daily skincare routine, and track my facial symmetry definition.",
    focus_area: "Face",
    previous_experience: "Beginner",
    is_premium: false,
    xp: 1450,
    level: 4,
    days_to_ascend: 15,
    streak: 12,
    unlocked_badges: ['first_step', 'routine_pioneer', 'journal_entry']
  },
  // Dates during which the user has logged in
  checkins: [
    "2026-05-25", "2026-05-26", "2026-05-27", "2026-05-28", "2026-05-29",
    "2026-05-30", "2026-05-31", "2026-06-01", "2026-06-02", "2026-06-03",
    "2026-06-04", "2026-06-05", "2026-06-06", "2026-06-07", "2026-06-08"
  ],
  routines: {
    morning: [
      { id: 'm1', text: 'Tongue posture check (mewing)', completed: true },
      { id: 'm2', text: 'Face cleanse with cold water', completed: true },
      { id: 'm3', text: 'Drink 500ml water', completed: false }
    ],
    night: [
      { id: 'n1', text: 'Cleanse and apply moisturizer', completed: false },
      { id: 'n2', text: 'Tongue posture / neck alignment check', completed: false },
      { id: 'n3', text: 'Read for 15 mins (wind down)', completed: false }
    ],
    skincare: [
      { id: 's1', text: 'Gentle Cleanser', completed: true },
      { id: 's2', text: 'Vitamin C Serum (Morning)', completed: false },
      { id: 's3', text: 'Moisturizer with SPF 30 (Morning)', completed: true },
      { id: 's4', text: 'Hyaluronic Acid / Night Serum', completed: false }
    ],
    workout: [
      { id: 'w1', text: 'Posture correction exercises (10 min)', completed: true },
      { id: 'w2', text: 'Neck stretches & chin tucks', completed: true },
      { id: 'w3', text: 'Cardio / High intensity workout (20 min)', completed: false },
      { id: 'w4', text: 'Jaw muscle alignment exercise', completed: false }
    ]
  },
  water_log: {
    current: 1250, // in ml
    target: 2500 // in ml
  },
  sleep_log: {
    current: 7.5, // in hours
    target: 8.0 // in hours
  },
  journals: [
    {
      id: "j1",
      date: "2026-06-05",
      mood: 4,
      notes: "Started my posture stretches early today. Feeling energetic. Skincare routine is feeling like second nature now.",
      reflections: "My skin looks noticeably clearer than two weeks ago. Posture stretches are helping with shoulder tension."
    },
    {
      id: "j2",
      date: "2026-06-07",
      mood: 5,
      notes: "Completed a full workout and drank plenty of water. Sleep was excellent last night.",
      reflections: "Focusing on nose-breathing and proper neck alignment makes me feel much more confident and alert."
    }
  ],
  progress_photos: [
    {
      id: "p1",
      date: "2026-05-20",
      week_number: 1,
      photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      notes: "Baseline photo. Focus is on upright posture and jaw relaxation."
    },
    {
      id: "p2",
      date: "2026-06-03",
      week_number: 3,
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      notes: "Two weeks in. Face looks a bit less puffy. Skin health is improving."
    }
  ],
  face_analyses: [
    {
      id: "a_initial",
      date: "2026-05-25",
      front_photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      side_photo_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      facial_harmony_score: 64,
      symmetry_score: 61,
      facial_proportion_score: 66,
      improvement_potential_score: 85,
      is_premium_unlocked: false,
      landmarks_json: {},
      suggestions: {
        jawline: ["Incorporate daily chin tuck posture exercises.", "Practice correct resting tongue posture (mewing).", "Maintain optimal systemic hydration."],
        eyes: ["Aim for consistent 8-hour sleep cycles to decrease puffiness.", "Reduce blue light exposure 1 hour before bed.", "Gentle under-eye massage in the morning."],
        skin: ["Wear broad-spectrum sunscreen daily.", "Apply moisturizer before sleep.", "Wash face with cold water to tighten skin appearance."]
      }
    }
  ]
};

const DB_KEY = 'ascend_transformation_database';

// Initialize Database
export const initializeDB = () => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_MOCK_DATA));
  }
};

// Retrieve complete database
const getDB = () => {
  initializeDB();
  return JSON.parse(localStorage.getItem(DB_KEY));
};

// Save database
const saveDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- DATA ACCESSORS ---

export const getProfile = () => {
  return getDB().user_profile;
};

export const updateProfile = (updates) => {
  const db = getDB();
  db.user_profile = { ...db.user_profile, ...updates };
  saveDB(db);
  return db.user_profile;
};

export const getRoutines = () => {
  return getDB().routines;
};

export const updateRoutineTask = (category, taskId, completed) => {
  const db = getDB();
  const index = db.routines[category].findIndex(t => t.id === taskId);
  if (index !== -1) {
    db.routines[category][index].completed = completed;
    saveDB(db);
  }
  return db.routines;
};

export const getWaterLog = () => {
  return getDB().water_log;
};

export const updateWaterLog = (amount) => {
  const db = getDB();
  db.water_log.current = Math.max(0, db.water_log.current + amount);
  saveDB(db);
  return db.water_log;
};

export const getSleepLog = () => {
  return getDB().sleep_log;
};

export const updateSleepLog = (hours) => {
  const db = getDB();
  db.sleep_log.current = hours;
  saveDB(db);
  return db.sleep_log;
};

export const getJournals = () => {
  return getDB().journals;
};

export const addJournalEntry = (entry) => {
  const db = getDB();
  const newEntry = {
    id: 'j_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    ...entry
  };
  db.journals.unshift(newEntry);
  saveDB(db);
  return db.journals;
};

export const getProgressPhotos = () => {
  return getDB().progress_photos;
};

export const addProgressPhoto = (photoUrl, notes) => {
  const db = getDB();
  const weekNum = db.progress_photos.length + 1;
  const newPhoto = {
    id: 'p_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    week_number: weekNum,
    photo_url: photoUrl,
    notes: notes || `Week ${weekNum} Progress`
  };
  db.progress_photos.push(newPhoto);
  saveDB(db);
  return db.progress_photos;
};

export const getAnalyses = () => {
  return getDB().face_analyses;
};

export const saveAnalysis = (analysis) => {
  const db = getDB();
  const newAnalysis = {
    id: 'a_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    is_premium_unlocked: false,
    ...analysis
  };
  db.face_analyses.unshift(newAnalysis);
  saveDB(db);
  return newAnalysis;
};

export const unlockAnalysis = (analysisId) => {
  const db = getDB();
  const index = db.face_analyses.findIndex(a => a.id === analysisId);
  if (index !== -1) {
    db.face_analyses[index].is_premium_unlocked = true;
    saveDB(db);
    return db.face_analyses[index];
  }
  return null;
};

export const getCheckins = () => {
  return getDB().checkins;
};

export const submitCheckin = (notes = '') => {
  const db = getDB();
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (!db.checkins.includes(todayStr)) {
    db.checkins.push(todayStr);
    
    // Increment days to ascend
    db.user_profile.days_to_ascend += 1;
    
    // Recalculate streak
    let streak = 1;
    let checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1);
    
    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (db.checkins.includes(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    db.user_profile.streak = streak;
    saveDB(db);
  }
  return { checkins: db.checkins, profile: db.user_profile };
};
