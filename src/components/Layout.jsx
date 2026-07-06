// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Layout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import CommandPalette from './CommandPalette';
import AICoach from './AICoach';
import { 
  Award, 
  Star, 
  Trophy, 
  Sparkles, 
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

  // Command palette toggle
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  // Notification menu dropdown open state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
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
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row transition-colors duration-350">
      {/* Navigation menu */}
      <Sidebar />
      
      {/* Main content viewport */}
      <div className="flex-1 min-h-screen overflow-x-hidden pt-14 pb-16 md:pt-0 md:pb-0 md:pl-64 flex flex-col">
        
        {/* Top Header Bar (Desktop Only, since mobile header is inside Sidebar) */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-neutral-900 bg-neutral-950/20 backdrop-blur-md">
          {/* Left search mock input trigger */}
          <button 
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-850 text-[11px] font-bold text-neutral-400 hover:border-neutral-700 transition-colors w-64 text-left cursor-pointer"
          >
            <Search size={13} className="text-neutral-500" />
            <span className="flex-1 text-neutral-500">Search...</span>
            <span className="text-[9px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800 font-black">
              Ctrl+K
            </span>
          </button>

          {/* Right quick controls: theme + notification bell */}
          <div className="flex items-center gap-4 relative">
            {/* Theme switcher */}
            <div className="flex bg-neutral-900 rounded-lg p-0.5 border border-neutral-850">
              <button 
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded text-neutral-500 hover:text-white transition-colors cursor-pointer ${theme === 'dark' ? 'bg-neutral-800 text-indigo-400' : ''}`}
                title="Dark Mode"
              >
                <Moon size={13} />
              </button>
              <button 
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded text-neutral-500 hover:text-white transition-colors cursor-pointer ${theme === 'light' ? 'bg-neutral-800 text-indigo-400' : ''}`}
                title="Light Mode"
              >
                <Sun size={13} />
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded text-neutral-500 hover:text-white transition-colors cursor-pointer ${theme === 'system' ? 'bg-neutral-800 text-indigo-400' : ''}`}
                title="System Theme"
              >
                <Monitor size={13} />
              </button>
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(prev => !prev)}
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-850 hover:border-neutral-750 flex items-center justify-center text-neutral-400 hover:text-white transition-all relative cursor-pointer"
              >
                <Bell size={14} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 border border-neutral-900 text-[8px] font-black text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Bell dropdown panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 glassmorphism rounded-xl border border-neutral-800 shadow-2xl z-30 p-4 space-y-3 bg-[#0c0c12]">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Bell size={12} className="text-indigo-400" />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-indigo-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification items list */}
                  <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1 scrollbar-none">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-2.5 rounded-lg border text-[11px] leading-relaxed relative group transition-all ${notif.read ? 'bg-transparent border-neutral-900 text-neutral-450' : 'bg-indigo-500/5 border-indigo-500/10 text-neutral-200'}`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`font-bold block ${notif.read ? 'text-neutral-400' : 'text-white'}`}>
                              {notif.title}
                            </span>
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="text-[9px] text-neutral-600 hover:text-red-400 absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                          <p className="mt-1 text-neutral-400">{notif.message}</p>
                          <span className="text-[9px] text-neutral-500 block mt-1.5">
                            {new Date(notif.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="mt-1.5 text-[9px] font-bold text-indigo-400 hover:underline block cursor-pointer"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-xs text-neutral-500 italic">
                        No notifications logged yet.
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="flex justify-between pt-2 border-t border-neutral-900 text-[10px] font-bold">
                      <button 
                        onClick={clearAll}
                        className="text-red-400 hover:underline cursor-pointer"
                      >
                        Clear history
                      </button>
                      <button 
                        onClick={() => setIsNotifOpen(false)}
                        className="text-neutral-500 hover:text-white cursor-pointer"
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

      {/* AI COACH OVERLAY PANEL */}
      <AICoach />

      {/* 1. LEVEL UP CELEBRATION MODAL OVERLAY */}
      {levelUpAlert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glassmorphism glow-accent p-8 rounded-2xl text-center relative overflow-hidden flex flex-col items-center">
            {/* Background glowing particles */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

            {/* Glowing Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/20">
              <Award size={32} className="stroke-[1.5]" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-white mb-1.5 tracking-tight bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              LEVEL ASCENDED!
            </h2>
            
            <p className="text-neutral-400 text-xs mb-6 max-w-xs leading-normal">
              Your dedication to daily self-improvement has pushed you to the next stage of your journey.
            </p>

            {/* Level Comparison */}
            <div className="flex items-center gap-6 justify-center mb-6 bg-neutral-950/60 border border-neutral-900 px-6 py-4 rounded-xl">
              <div className="text-center">
                <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Previous</span>
                <span className="text-sm font-bold text-neutral-400">LVL {levelUpAlert.oldLevel}</span>
              </div>
              
              <div className="text-neutral-700 text-sm font-bold">➔</div>

              <div className="text-center">
                <span className="text-[10px] text-purple-400 font-bold block uppercase tracking-wider">Ascended</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  LVL {levelUpAlert.newLevel}
                </span>
              </div>
            </div>

            {/* XP details */}
            <div className="flex items-center gap-1.5 text-[10px] text-yellow-400 bg-yellow-400/5 border border-yellow-400/10 px-3 py-1.5 rounded-full mb-8">
              <Star size={10} className="fill-yellow-400" />
              <span>Level-up bonus experience credited</span>
            </div>

            {/* Action button */}
            <button
              onClick={() => setLevelUpAlert(null)}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 cursor-pointer"
            >
              Continue Transcending
            </button>
          </div>
        </div>
      )}

      {/* 2. ACHIEVEMENTS UNLOCKED OVERLAY */}
      {badgeAlert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glassmorphism glow-primary p-8 rounded-2xl text-center relative overflow-hidden flex flex-col items-center">
            {/* Background glowing particles */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>

            {/* Glowing Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-sky-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
              <Trophy size={30} className="stroke-[1.5] text-yellow-400" />
            </div>

            {/* Badge Icon Display */}
            <div className="text-4xl mb-4 animate-bounce">{badgeAlert.icon}</div>

            {/* Title */}
            <h2 className="text-xl font-black text-white mb-1 tracking-tight">
              MILESTONE COMPLETED
            </h2>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
              "{badgeAlert.name}" Unlocked
            </p>
            
            <p className="text-neutral-400 text-xs mb-6 max-w-xs leading-normal">
              {badgeAlert.description}
            </p>

            {/* XP details */}
            <div className="flex items-center gap-1.5 text-[10px] text-yellow-400 bg-yellow-400/5 border border-yellow-400/10 px-3 py-1.5 rounded-full mb-8">
              <Sparkles size={10} />
              <span>+{badgeAlert.xp} XP Achievement Bonus Awarded</span>
            </div>

            {/* Action button */}
            <button
              onClick={() => setBadgeAlert(null)}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 cursor-pointer"
            >
              Collect Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
