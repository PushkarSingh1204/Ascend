// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\GameContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getProfile, 
  updateProfile, 
  submitCheckin, 
  BADGES, 
  getDailyMissions, 
  updateMission,
  getRoadmapMilestones,
  updateRoadmapMilestone
} from '../services/db';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [daysToAscend, setDaysToAscend] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  
  // New upgraded states
  const [dailyMissions, setDailyMissions] = useState({ checkin: false, sleep: false, water: false, skincare: false, journal: false });
  const [roadmapMilestones, setRoadmapMilestones] = useState([]);
  const [roadmapPercent, setRoadmapPercent] = useState(0);

  // Notification states
  const [notification, setNotification] = useState(null);
  const [levelUpAlert, setLevelUpAlert] = useState(null);
  const [badgeAlert, setBadgeAlert] = useState(null);

  // Sync state on user changes
  const syncGameState = () => {
    if (user && user.profile) {
      setXp(user.profile.xp || 0);
      setLevel(user.profile.level || 1);
      setStreak(user.profile.streak || 0);
      setLongestStreak(user.profile.longest_streak || 0);
      setDaysToAscend(user.profile.days_to_ascend || 0);
      setUnlockedBadges(user.profile.unlocked_badges || []);
      
      const missions = getDailyMissions();
      setDailyMissions(missions);

      const milestones = getRoadmapMilestones();
      setRoadmapMilestones(milestones);
      if (milestones.length > 0) {
        const completed = milestones.filter(m => m.completed).length;
        setRoadmapPercent(Math.round((completed / milestones.length) * 100));
      } else {
        setRoadmapPercent(0);
      }
    }
  };

  useEffect(() => {
    syncGameState();
  }, [user]);

  // Level formula: level = floor(sqrt(xp / 100)) + 1
  const calculateLevel = (currentXp) => {
    return Math.floor(Math.sqrt(currentXp / 100)) + 1;
  };

  const getXpForLevel = (lvl) => {
    if (lvl <= 1) return 0;
    return Math.pow(lvl - 1, 2) * 100;
  };

  const getXpRequiredForNextLevel = (lvl) => {
    return getXpForLevel(lvl + 1);
  };

  const triggerNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const addXP = (amount, reason) => {
    if (!user) return;
    
    const newXp = xp + amount;
    const newLvl = calculateLevel(newXp);
    const leveledUp = newLvl > level;

    const updatedProfile = updateProfile({
      xp: newXp,
      level: newLvl
    });

    setXp(newXp);
    setLevel(newLvl);
    setUser(prev => ({ ...prev, profile: { ...prev.profile, ...updatedProfile } }));

    // Non-interruptive simple toast for general XP logging
    triggerNotification(`+${amount} XP: ${reason}`, 'xp');

    if (leveledUp) {
      setLevelUpAlert({
        oldLevel: level,
        newLevel: newLvl
      });
    }
  };

  const unlockBadge = (badgeId) => {
    if (!user) return;
    if (unlockedBadges.includes(badgeId)) return;

    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;

    const newBadges = [...unlockedBadges, badgeId];
    const updatedProfile = updateProfile({
      unlocked_badges: newBadges
    });

    setUnlockedBadges(newBadges);
    setUser(prev => ({ ...prev, profile: { ...prev.profile, ...updatedProfile } }));
    
    // Award badge XP
    addXP(badge.xp, `Achievement Badge: "${badge.name}"`);
    
    // Major badge unlocks receive a full screen alert
    setBadgeAlert(badge);
  };

  const toggleMilestone = (milestoneId, completedStatus) => {
    const updated = updateRoadmapMilestone(milestoneId, completedStatus);
    setRoadmapMilestones(updated);
    
    const completed = updated.filter(m => m.completed).length;
    const pct = Math.round((completed / updated.length) * 100);
    setRoadmapPercent(pct);

    if (completedStatus) {
      addXP(75, "Roadmap Weekly Milestone Cleared");
    }
  };

  const performDailyCheckin = (notes = '') => {
    if (!user) return false;
    
    const { checkins, profile } = submitCheckin(notes);
    
    setStreak(profile.streak);
    setLongestStreak(profile.longest_streak);
    setDaysToAscend(profile.days_to_ascend);
    setUser(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));

    // Update checkin mission
    const updatedMissions = updateMission('checkin', true);
    setDailyMissions(updatedMissions);

    // Award XP
    addXP(50, "Daily Check-in Complete");

    // Major Streak achievements trigger badge unlocks
    if (profile.streak === 7) {
      unlockBadge('7_day_streak');
    }
    if (profile.streak === 30) {
      unlockBadge('30_day_streak');
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
        <div className="fixed bottom-6 right-6 z-50 glassmorphism px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in shadow-xl border border-neutral-800/80 bg-neutral-900/95 max-w-sm">
          <div className="text-xl">
            {notification.type === 'xp' ? '⚡' : notification.type === 'level-up' ? '🎉' : notification.type === 'badge' ? '🏆' : 'ℹ|'}
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{notification.message}</p>
          </div>
        </div>
      )}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
