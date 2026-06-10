// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\db.js

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

// 30-Day roadmap templates grouped by focus areas
const ROADMAP_TEMPLATES = {
  Face: [
    { id: 'rm_1', week: 1, title: 'Posture & Alignment', text: 'Complete daily chin-tucks and posture stretching for 5 days', completed: true },
    { id: 'rm_2', week: 1, title: 'Nasal Breathing', text: 'Practice continuous nasal breathing and mouth tape check', completed: true },
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
    { id: 'rm_1', week: 1, title: 'Posture Baseline', text: 'Perform spinal alignment stretches for 5 days', completed: true },
    { id: 'rm_2', week: 1, title: 'Active Start', text: 'Log 15 min cardio 3 times this week', completed: true },
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
    { id: 'rm_1', week: 1, title: 'Skin Cleanse', text: 'Establish a morning cleanser routine', completed: true },
    { id: 'rm_2', week: 1, title: 'Posture Awareness', text: 'Stretches for facial/neck posture alignment', completed: true },
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
    { id: 'rm_1', week: 1, title: 'Routines Setup', text: 'Create morning and night checklists', completed: true },
    { id: 'rm_2', week: 1, title: 'Posture Alignment', text: 'Stretches for facial/neck posture alignment', completed: true },
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

const INITIAL_MOCK_DATA = {
  user_profile: {
    name: "Alex Carter",
    join_date: "2026-05-25",
    age: 24,
    gender: "Male",
    height_cm: 180,
    weight_kg: 75,
    goal_description: "I want to improve my posture, establish a daily skincare routine, and track my facial symmetry definition.",
    focus_area: "Face",
    previous_experience: "Beginner",
    is_premium: false, // Ascend Plus subscription flag
    xp: 1450,
    level: 4,
    days_to_ascend: 15,
    streak: 12,
    longest_streak: 18,
    unlocked_badges: ['first_step', 'routine_pioneer', 'journal_entry'],
    preferences: {
      morningReminder: true,
      nightReminder: true,
      weeklyDigest: true
    }
  },
  // Active daily missions status
  daily_missions: {
    checkin: false,
    sleep: false,
    water: false,
    skincare: false,
    journal: false
  },
  // Roadmap milestones list
  roadmap_milestones: ROADMAP_TEMPLATES.Face,
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
      is_premium_unlocked: true,
      landmarks_json: {},
      suggestions: {
        posture: ["Incorporate daily chin tuck posture exercises.", "Practice correct resting tongue posture (mewing).", "Maintain optimal systemic hydration."],
        lifestyle: ["Aim for consistent 8-hour sleep cycles to decrease puffiness.", "Reduce blue light exposure 1 hour before bed.", "Gentle under-eye massage in the morning."],
        skincare: ["Wear broad-spectrum sunscreen daily.", "Apply moisturizer before sleep.", "Wash face with cold water to tighten skin appearance."]
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
  const db = getDB();
  if (!db.user_profile) {
    db.user_profile = { ...INITIAL_MOCK_DATA.user_profile };
    saveDB(db);
  }
  return db.user_profile;
};

export const updateProfile = (updates) => {
  const db = getDB();
  db.user_profile = { ...db.user_profile, ...updates };
  
  // Calculate longest streak
  if (db.user_profile.streak > db.user_profile.longest_streak) {
    db.user_profile.longest_streak = db.user_profile.streak;
  }
  
  saveDB(db);
  return db.user_profile;
};

export const getRoutines = () => {
  const db = getDB();
  if (!db.routines) {
    db.routines = { ...INITIAL_MOCK_DATA.routines };
    saveDB(db);
  }
  return db.routines;
};

export const updateRoutineTask = (category, taskId, completed) => {
  const db = getDB();
  const index = db.routines[category].findIndex(t => t.id === taskId);
  if (index !== -1) {
    db.routines[category][index].completed = completed;
    
    // Check if skincare checklist complete to award mission
    if (category === 'skincare') {
      const allSkincareDone = db.routines.skincare.every(t => t.completed);
      db.daily_missions.skincare = allSkincareDone;
    }
    
    saveDB(db);
  }
  return db.routines;
};

export const getDailyMissions = () => {
  const db = getDB();
  if (!db.daily_missions) {
    db.daily_missions = { ...INITIAL_MOCK_DATA.daily_missions };
    saveDB(db);
  }
  return db.daily_missions;
};

export const updateMission = (missionKey, status) => {
  const db = getDB();
  db.daily_missions[missionKey] = status;
  saveDB(db);
  return db.daily_missions;
};

export const getRoadmapMilestones = () => {
  const db = getDB();
  if (!db.roadmap_milestones) {
    db.roadmap_milestones = [ ...ROADMAP_TEMPLATES.Face ];
    saveDB(db);
  }
  return db.roadmap_milestones;
};

export const updateRoadmapMilestone = (milestoneId, completed) => {
  const db = getDB();
  const index = db.roadmap_milestones.findIndex(m => m.id === milestoneId);
  if (index !== -1) {
    db.roadmap_milestones[index].completed = completed;
    saveDB(db);
  }
  return db.roadmap_milestones;
};

export const regenerateRoadmap = (focusArea) => {
  const db = getDB();
  const template = ROADMAP_TEMPLATES[focusArea] || ROADMAP_TEMPLATES.Face;
  // Deep clone template
  db.roadmap_milestones = JSON.parse(JSON.stringify(template));
  db.user_profile.focus_area = focusArea;
  saveDB(db);
  return db.roadmap_milestones;
};

export const getWaterLog = () => {
  const db = getDB();
  if (!db.water_log) {
    db.water_log = { ...INITIAL_MOCK_DATA.water_log };
    saveDB(db);
  }
  return db.water_log;
};

export const updateWaterLog = (amount) => {
  const db = getDB();
  db.water_log.current = Math.max(0, db.water_log.current + amount);
  
  // Set water daily mission if targets met
  if (db.water_log.current >= db.water_log.target) {
    db.daily_missions.water = true;
  } else {
    db.daily_missions.water = false;
  }
  
  saveDB(db);
  return db.water_log;
};

export const getSleepLog = () => {
  const db = getDB();
  if (!db.sleep_log) {
    db.sleep_log = { ...INITIAL_MOCK_DATA.sleep_log };
    saveDB(db);
  }
  return db.sleep_log;
};

export const updateSleepLog = (hours) => {
  const db = getDB();
  db.sleep_log.current = hours;
  
  // Set sleep daily mission if targets met
  if (db.sleep_log.current >= db.sleep_log.target) {
    db.daily_missions.sleep = true;
  } else {
    db.daily_missions.sleep = false;
  }
  
  saveDB(db);
  return db.sleep_log;
};

export const getJournals = () => {
  const db = getDB();
  if (!db.journals) {
    db.journals = [ ...INITIAL_MOCK_DATA.journals ];
    saveDB(db);
  }
  return db.journals;
};

export const addJournalEntry = (entry) => {
  const db = getDB();
  const newEntry = {
    id: 'j_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    ...entry
  };
  db.journals.unshift(newEntry);
  
  // Mark journal daily mission complete
  db.daily_missions.journal = true;
  
  saveDB(db);
  return db.journals;
};

export const getProgressPhotos = () => {
  const db = getDB();
  if (!db.progress_photos) {
    db.progress_photos = [ ...INITIAL_MOCK_DATA.progress_photos ];
    saveDB(db);
  }
  return db.progress_photos;
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
  const db = getDB();
  if (!db.face_analyses) {
    db.face_analyses = [ ...INITIAL_MOCK_DATA.face_analyses ];
    saveDB(db);
  }
  return db.face_analyses;
};

export const saveAnalysis = (analysis) => {
  const db = getDB();
  const newAnalysis = {
    id: 'a_' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    is_premium_unlocked: true, // Comparisons are Free, unlock reports immediately
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
  const db = getDB();
  if (!db.checkins) {
    db.checkins = [ ...INITIAL_MOCK_DATA.checkins ];
    saveDB(db);
  }
  return db.checkins;
};

export const submitCheckin = (notes = '') => {
  const db = getDB();
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (!db.checkins.includes(todayStr)) {
    db.checkins.push(todayStr);
    
    // Mark checkin daily mission complete
    db.daily_missions.checkin = true;
    
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
    if (streak > db.user_profile.longest_streak) {
      db.user_profile.longest_streak = streak;
    }
    
    saveDB(db);
  }
  return { checkins: db.checkins, profile: db.user_profile };
};
