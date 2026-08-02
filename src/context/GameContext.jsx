// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\GameContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getProfile, 
  updateProfile, 
  submitCheckin, 
  BADGES, 
  updateMission,
  updateRoadmapMilestone
} from '../services/db';
import { useAuth } from './AuthContext';
import { missionEngine } from '../services/engines/missionEngine.js';
import { roadmapEngine } from '../services/engines/roadmapEngine.js';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [daysToAscend, setDaysToAscend] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  
  // Daily missions states
  const [dailyMissions, setDailyMissions] = useState({ checkin: false, sleep: false, water: false, skincare: false, journal: false });
  const [roadmapMilestones, setRoadmapMilestones] = useState([]);
  const [roadmapPercent, setRoadmapPercent] = useState(0);

  // Alerts & Notifications
  const [notification, setNotification] = useState(null);
  const [levelUpAlert, setLevelUpAlert] = useState(null);
  const [badgeAlert, setBadgeAlert] = useState(null);

  // =========================================================
  // REBALANCED PROGRESSIVE XP FORMULA & LEVEL THRESHOLDS
  // Level 1 → 100 XP (Level 2)
  // Level 2 → 250 XP (Level 3)
  // Level 3 → 450 XP (Level 4)
  // Level 4 → 700 XP (Level 5)
  // Level 5 → 1000 XP (Level 6)
  // Formula: getXpForLevel(lvl) = 25 * (lvl - 1)^2 + 75 * (lvl - 1)
  // =========================================================
  const getXpForLevel = (lvl) => {
    if (lvl <= 1) return 0;
    const n = lvl - 1;
    return 25 * n * n + 75 * n;
  };

  const getXpRequiredForNextLevel = (lvl) => {
    return getXpForLevel(lvl + 1);
  };

  const calculateLevel = (currentXp) => {
    if (!currentXp || currentXp <= 0) return 1;
    let lvl = 1;
    while (getXpForLevel(lvl + 1) <= currentXp) {
      lvl++;
    }
    return lvl;
  };

  // Sync state on user changes and handle daily resets
  const syncGameState = async () => {
    if (user && user.profile) {
      try {
        let profile = await getProfile();
        if (!profile) return;
        
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Dynamic Daily reset trigger
        if (profile.last_active_date !== todayStr) {
          const resetMissions = { checkin: false, sleep: false, water: false, skincare: false, journal: false };
          const updatedRoutines = { ...profile.routines };
          
          if (updatedRoutines) {
            Object.keys(updatedRoutines).forEach(cat => {
              const catTasks = updatedRoutines[cat];
              if (Array.isArray(catTasks)) {
                updatedRoutines[cat] = catTasks.map(t => ({ ...t, completed: false }));
              }
            });
          }
          
          const resetSleep = profile.sleep_log ? { ...profile.sleep_log, current: 0 } : { current: 0, target: 8.0 };
          const resetWater = profile.water_log ? { ...profile.water_log, current: 0 } : { current: 0, target: 2000 };

          profile = await updateProfile({
            last_active_date: todayStr,
            daily_missions: resetMissions,
            routines: updatedRoutines,
            sleep_log: resetSleep,
            water_log: resetWater,
            daily_xp_actions: [] // Reset daily awarded XP actions
          });

          setUser(prev => ({ ...prev, profile }));
        }

        const currentXpVal = profile.xp || 0;
        setXp(currentXpVal);
        setLevel(calculateLevel(currentXpVal));
        setStreak(profile.streak || 0);
        setLongestStreak(profile.longest_streak || 0);
        setDaysToAscend(profile.days_to_ascend || 0);
        setUnlockedBadges(profile.unlocked_badges || []);
        
        // Compile daily missions using missionEngine
        const compiledMissionsList = await missionEngine.run({ profile });
        const missionsObj = {};
        compiledMissionsList.forEach(m => {
          const key = m.id.replace('mission_', '');
          missionsObj[key] = m.completed;
        });
        setDailyMissions(missionsObj);

        // Compile roadmap milestones using roadmapEngine
        const compiledMilestones = await roadmapEngine.run({ profile });
        setRoadmapMilestones(compiledMilestones || []);
        
        if (Array.isArray(compiledMilestones) && compiledMilestones.length > 0) {
          const completed = compiledMilestones.filter(m => m.completed).length;
          setRoadmapPercent(Math.round((completed / compiledMilestones.length) * 100));
        } else {
          setRoadmapPercent(0);
        }
      } catch (err) {
        console.error("GameContext syncGameState error:", err);
      }
    }
  };

  useEffect(() => {
    syncGameState();
  }, [user]);

  const triggerNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Add XP with Daily Action Deduplication
  const addXP = async (amount, reason, actionKey = null) => {
    if (!user) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const profile = user.profile || {};
    const dailyActions = Array.isArray(profile.daily_xp_actions) ? profile.daily_xp_actions : [];

    // Deduplication check: if actionKey is provided and already awarded today, skip duplicate
    if (actionKey) {
      const fullKey = `${actionKey}_${todayStr}`;
      if (dailyActions.includes(fullKey)) {
        return; // Skip duplicate daily XP
      }
      dailyActions.push(fullKey);
    }
    
    const newXp = xp + amount;
    const newLvl = calculateLevel(newXp);
    const leveledUp = newLvl > level;

    const updatedProfile = await updateProfile({
      xp: newXp,
      level: newLvl,
      daily_xp_actions: dailyActions
    });

    setXp(newXp);
    setLevel(newLvl);
    setUser(prev => ({ ...prev, profile: { ...prev.profile, ...updatedProfile } }));

    // Subtle feedback notification
    triggerNotification(`+${amount} XP: ${reason}`, 'xp');

    // Only celebrate major level up milestones
    if (leveledUp) {
      setLevelUpAlert({
        oldLevel: level,
        newLevel: newLvl
      });
    }
  };

  const unlockBadge = async (badgeId) => {
    if (!user) return;
    if (unlockedBadges.includes(badgeId)) return;

    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;

    const newBadges = [...unlockedBadges, badgeId];
    const updatedProfile = await updateProfile({
      unlocked_badges: newBadges
    });

    setUnlockedBadges(newBadges);
    setUser(prev => ({ ...prev, profile: { ...prev.profile, ...updatedProfile } }));
    
    await addXP(badge.xp || 50, `Achievement Badge: "${badge.name}"`, `badge_${badgeId}`);
    setBadgeAlert(badge);
  };

  const toggleMilestone = async (milestoneId, completedStatus) => {
    const updated = await updateRoadmapMilestone(milestoneId, completedStatus);
    setRoadmapMilestones(updated);
    
    const completed = updated.filter(m => m.completed).length;
    const pct = Math.round((completed / updated.length) * 100);
    setRoadmapPercent(pct);

    if (completedStatus) {
      await addXP(75, "Roadmap Milestone Complete", `milestone_${milestoneId}`);
    }
  };

  const performDailyCheckin = async (notes = '') => {
    if (!user) return false;
    
    const { checkins, profile } = await submitCheckin(notes);
    
    setStreak(profile.streak);
    setLongestStreak(profile.longest_streak);
    setDaysToAscend(profile.days_to_ascend);
    setUser(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));

    // Update checkin mission
    const updatedMissions = await updateMission('checkin', true);
    setDailyMissions(updatedMissions);

    // Rebalanced XP: +10 XP for daily checkin
    await addXP(10, "Daily Check-in Complete", "daily_checkin");

    // Streak Rewards:
    if (profile.streak === 7) {
      await addXP(100, "7-Day Streak Bonus!", "streak_7");
      await unlockBadge('7_day_streak');
    } else if (profile.streak === 30) {
      await addXP(250, "30-Day Streak Bonus!", "streak_30");
      await unlockBadge('30_day_streak');
    } else if (profile.streak === 100) {
      await addXP(500, "100-Day Ascension Mastery!", "streak_100");
      await unlockBadge('100_day_streak');
    }

    return true;
  };

  return (
    <GameContext.Provider value={{
      xp,
      level,
      streak,
      longestStreak,
      daysToAscend,
      unlockedBadges,
      dailyMissions,
      roadmapMilestones,
      roadmapPercent,
      notification,
      levelUpAlert,
      setLevelUpAlert,
      badgeAlert,
      setBadgeAlert,
      addXP,
      unlockBadge,
      performDailyCheckin,
      toggleMilestone,
      syncGameState,
      getXpForLevel,
      getXpRequiredForNextLevel
    }}>
      {children}
      
      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 glassmorphism px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in shadow-xl border border-border bg-card max-w-sm text-foreground">
          <div className="text-xl">
            {notification.type === 'xp' ? '⚡' : notification.type === 'level-up' ? '🎉' : notification.type === 'badge' ? '🏆' : 'ℹ️'}
          </div>
          <div>
            <p className="text-xs font-semibold">{notification.message}</p>
          </div>
        </div>
      )}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
