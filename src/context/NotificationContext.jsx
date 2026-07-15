// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\context\NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: 'n_1',
    title: 'Streak Milestone!',
    message: 'Congratulations! You reached a 7-day streak. Keep ascending! (+150 XP)',
    date: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
    read: false,
    type: 'streak'
  },
  {
    id: 'n_2',
    title: 'Weekly Review Ready',
    message: 'Your Weekly Review summary is ready. Click to analyze your consistency metrics.',
    date: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    read: false,
    type: 'weekly_review'
  },
  {
    id: 'n_3',
    title: 'Welcome to Ascend Plus',
    message: 'Your subscription is active. Unlock premium tools, longevity estimates, and AI Coaching.',
    date: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
    read: true,
    type: 'premium'
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('ascend_notifications');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_MOCK_NOTIFICATIONS;
    } catch {
      return INITIAL_MOCK_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('ascend_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (title, message, type = 'general') => {
    const newNotif = {
      id: 'n_' + Date.now(),
      title,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      dismissNotification,
      markAllAsRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
