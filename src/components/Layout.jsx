// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Layout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import CommandPalette from './CommandPalette';
import AICoach from './AICoach';
import DelightCelebration from './DelightCelebration';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Monitor, 
  Trash2 
} from 'lucide-react';

export default function Layout({ children }) {
  const { levelUpAlert, setLevelUpAlert, badgeAlert, setBadgeAlert } = useGame();
  const { theme, setTheme } = useTheme();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    dismissNotification, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();

  // Collapsible sidebar state lifted up to control main layout padding dynamically
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Command palette toggle
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  // Notification menu dropdown open state
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Network state
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background bg-mesh text-foreground flex flex-col md:flex-row transition-colors duration-350">
      {/* Sidebar Navigation (with collapsible state control) */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main content viewport — dynamic left padding based on sidebar state */}
      <div 
        className={`flex-1 min-h-screen overflow-x-hidden pt-14 pb-20 md:pt-0 md:pb-0 transition-all duration-300 flex flex-col ${isCollapsed ? 'md:pl-[76px]' : 'md:pl-64'}`}
      >
        {!isOnline && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-8 py-2.5 text-center text-xs font-bold text-red-400 flex items-center justify-center gap-2 animate-pulse shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span>You are currently offline. Cloud uploads and sync features are temporarily suspended.</span>
          </div>
        )}
        
        {/* Top Header Bar (Desktop Only) */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-border bg-card/10 backdrop-blur-md">
          {/* Search mock trigger */}
          <button 
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-secondary/40 border border-border text-[11px] font-bold text-muted-foreground hover:border-primary/40 hover:bg-secondary/60 transition-all w-64 text-left cursor-pointer"
          >
            <Search size={13} className="text-muted-foreground" />
            <span className="flex-1 text-muted-foreground">Search command palette...</span>
            <span className="text-[9px] text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border font-black">
              Ctrl+K
            </span>
          </button>

          {/* Right quick controls */}
          <div className="flex items-center gap-4 relative">
            {/* Theme switcher */}
            <div className="flex bg-secondary/50 rounded-xl p-0.5 border border-border">
              <button 
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${theme === 'dark' ? 'bg-secondary text-primary' : ''}`}
                title="Dark Mode"
              >
                <Moon size={13} />
              </button>
              <button 
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${theme === 'light' ? 'bg-secondary text-primary' : ''}`}
                title="Light Mode"
              >
                <Sun size={13} />
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${theme === 'system' ? 'bg-secondary text-primary' : ''}`}
                title="System Theme"
              >
                <Monitor size={13} />
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(prev => !prev)}
                className="w-8 h-8 rounded-xl bg-secondary/50 border border-border hover:border-primary/45 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all relative cursor-pointer"
              >
                <Bell size={14} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[8px] font-black text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 glassmorphism rounded-xl border border-border shadow-2xl z-30 p-4 space-y-3 text-foreground">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Bell size={12} className="text-primary" />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1 scrollbar-none">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-2.5 rounded-xl border text-[11px] leading-relaxed relative group transition-all ${notif.read ? 'bg-transparent border-border text-muted-foreground' : 'bg-primary/5 border-primary/20 text-foreground'}`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`font-bold block ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {notif.title}
                            </span>
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="text-[9px] text-muted-foreground hover:text-red-400 absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                          <p className="mt-1 text-muted-foreground">{notif.message}</p>
                          <span className="text-[9px] text-muted-foreground block mt-1.5">
                            {new Date(notif.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="mt-1.5 text-[9px] font-bold text-primary hover:underline block cursor-pointer"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-muted-foreground italic">
                        No notifications logged yet.
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="flex justify-between pt-2 border-t border-border text-[10px] font-bold">
                      <button 
                        onClick={clearAll}
                        className="text-red-400 hover:underline cursor-pointer"
                      >
                        Clear history
                      </button>
                      <button 
                        onClick={() => setIsNotifOpen(false)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* GLOBAL SEARCH COMMAND PALETTE MODAL */}
      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
      />

      {/* AI COACH FLOATING COMPONENT */}
      <AICoach />

      {/* 1. LEVEL UP CELEBRATION MODAL */}
      <DelightCelebration
        isOpen={!!levelUpAlert}
        onClose={() => setLevelUpAlert(null)}
        type="level_up"
        title="Level Ascended!"
        subtitle="Your dedication to daily self-improvement has pushed you to the next stage of your journey."
        value={levelUpAlert ? `LVL ${levelUpAlert.newLevel}` : ''}
        xpReward={200}
      />

      {/* 2. ACHIEVEMENTS UNLOCKED MODAL */}
      <DelightCelebration
        isOpen={!!badgeAlert}
        onClose={() => setBadgeAlert(null)}
        type="badge_unlocked"
        title="Milestone Completed"
        subtitle={badgeAlert ? badgeAlert.description : ''}
        value={badgeAlert ? `"${badgeAlert.name}"` : ''}
        xpReward={badgeAlert ? badgeAlert.xp : 0}
      />
    </div>
  );
}
