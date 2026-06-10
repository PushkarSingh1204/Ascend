// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\GameContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, updateProfile, submitCheckin, BADGES } from '../services/db';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [daysToAscend, setDaysToAscend] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  
  // Notification states
  const [notification, setNotification] = useState(null);
  const [levelUpAlert, setLevelUpAlert] = useState(null);

  // Sync with Auth user profile
  useEffect(() => {
    if (user && user.profile) {
      setXp(user.profile.xp || 0);
      setLevel(user.profile.level || 1);
      setStreak(user.profile.streak || 0);
      setDaysToAscend(user.profile.days_to_ascend || 0);
      setUnlockedBadges(user.profile.unlocked_badges || []);
    }
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
    }, 4000);
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

    triggerNotification(`+${amount} XP: ${reason}`, 'xp');

    if (leveledUp) {
      setLevelUpAlert({
        oldLevel: level,
        newLevel: newLvl
      });
      triggerNotification(`🎉 Level Up! You reached Level ${newLvl}!`, 'level-up');
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
    triggerNotification(`🏆 Achievement Unlocked: ${badge.name}!`, 'badge');
  };

  const performDailyCheckin = (notes = '') => {
    if (!user) return false;
    
    const { checkins, profile } = submitCheckin(notes);
    
    // If checkin succeeded (it was a new day checkin)
    const todayStr = new Date().toISOString().split('T')[0];
    const isNewCheckin = checkins.includes(todayStr);

    setStreak(profile.streak);
    setDaysToAscend(profile.days_to_ascend);
    setUser(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));

    // Award checkin XP
    addXP(50, "Daily Check-in");

    // Check streak achievements
    if (profile.streak >= 7) {
      unlockBadge('7_day_streak');
    }
    if (profile.streak >= 30) {
      unlockBadge('30_day_streak');
    }

    return true;
  };

  return (
    <GameContext.Provider value={{
      xp,
      level,
      streak,
      daysToAscend,
      unlockedBadges,
      notification,
      levelUpAlert,
      setLevelUpAlert,
      addXP,
      unlockBadge,
      performDailyCheckin,
      getXpForLevel,
      getXpRequiredForNextLevel
    }}>
      {children}
      
      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 glassmorphic p-4 rounded-xl flex items-center gap-3 animate-bounce shadow-lg glow-primary max-w-sm">
          <div className="text-xl">
            {notification.type === 'xp' ? '⚡' : notification.type === 'level-up' ? '🎉' : notification.type === 'badge' ? '🏆' : 'ℹ️'}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{notification.message}</p>
          </div>
        </div>
      )}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
