// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Simulate reading active session from database / localStorage
    const savedSession = localStorage.getItem('ascend_session');
    if (savedSession) {
      const profile = getProfile();
      setUser({
        id: 'user_123',
        email: 'alex.carter@ascend.app',
        profile: profile
      });
      // Check if user finished onboarding
      if (profile && profile.focus_area) {
        setIsOnboarded(true);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    // In mock mode, we approve all login attempts for simplicity
    localStorage.setItem('ascend_session', 'mock_token_xyz');
    const profile = getProfile();
    setUser({
      id: 'user_123',
      email: email,
      profile: profile
    });
    if (profile && profile.focus_area) {
      setIsOnboarded(true);
    }
    setLoading(false);
    return true;
  };

  const signup = (email, password) => {
    setLoading(true);
    localStorage.setItem('ascend_session', 'mock_token_xyz');
    // Initialize profile base
    const baseProfile = updateProfile({
      name: email.split('@')[0],
      is_premium: false,
      xp: 100, // starting gift
      level: 1,
      days_to_ascend: 1,
      streak: 1,
      unlocked_badges: ['first_step']
    });
    setUser({
      id: 'user_123',
      email: email,
      profile: baseProfile
    });
    setIsOnboarded(false);
    setLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('ascend_session');
    setUser(null);
    setIsOnboarded(false);
  };

  const completeOnboarding = (profileData) => {
    const updated = updateProfile(profileData);
    setUser(prev => ({ ...prev, profile: updated }));
    setIsOnboarded(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isOnboarded, completeOnboarding, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
