// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Sparkles, 
  Image as ImageIcon, 
  CalendarDays, 
  BookOpen, 
  TrendingUp, 
  LogOut,
  Flame,
  Compass,
  ClipboardCheck,
  User,
  Calendar,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const { xp, level, streak, getXpForLevel, getXpRequiredForNextLevel } = useGame();
  const navigate = useNavigate();

  const prevLevelXp = getXpForLevel(level);
  const nextLevelXp = getXpRequiredForNextLevel(level);
  const xpInCurrentLevel = xp - prevLevelXp;
  const xpNeededForNext = nextLevelXp - prevLevelXp;
  
  const rawProgress = xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 0;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawProgress)));

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Face Harmony', path: '/analysis', icon: Sparkles },
    { name: 'Progress Slider', path: '/progress', icon: ImageIcon },
    { name: 'Routines', path: '/routine', icon: CalendarDays },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'Weekly Review', path: '/weekly-review', icon: ClipboardCheck },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Premium Tools', path: '/premium-tools', icon: Sparkles },
    { name: 'Insights', path: '/insights', icon: TrendingUp },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Limit mobile dock items to 4 core sections to keep it clean and avoid duplication
  const mobileDockItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Harmony', path: '/analysis', icon: Sparkles },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <motion.aside 
        animate={{ width: isCollapsed ? 76 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="hidden md:flex flex-col h-screen fixed left-0 top-0 glassmorphism border-r border-border z-20 text-foreground bg-card overflow-hidden"
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-border flex items-center justify-between min-h-[64px]">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <Logo size={28} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mx-auto"
              >
                <Logo size={28} onlyIcon={true} />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none transition-colors"
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Gamified Profile Widget */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 border-b border-border bg-background/25 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-indigo-400 tracking-wider">LEVEL {level}</span>
                <span className="text-[10px] font-bold text-muted-foreground">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
              </div>
              
              {/* XP Progress Bar */}
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-3 border border-border/40">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                ></motion.div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <Flame size={12} className="fill-orange-400 animate-pulse" />
                  <span className="text-[10px] font-bold">{streak}d Streak</span>
                </div>
                
                {user?.profile?.is_premium ? (
                  <span className="text-[8px] uppercase font-black tracking-widest text-indigo-400 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    Plus
                  </span>
                ) : (
                  <span className="text-[8px] uppercase font-black tracking-widest text-muted-foreground px-2 py-0.5 rounded bg-secondary border border-border">
                    Free
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_4px_20px_rgba(134,59,255,0.06)]' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent'
                }
              `}
            >
              <item.icon size={16} className="shrink-0 transition-transform group-hover:scale-110 duration-200" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
              {isCollapsed && (
                <div className="absolute left-16 bg-[#0c0c14] border border-border px-2.5 py-1 rounded-lg text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-30 delay-100">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Theme and Logout Section */}
        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {!isCollapsed && <span>Toggle Theme</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden fixed top-0 left-0 w-full h-14 glassmorphism border-b border-border z-20 flex items-center justify-between px-4 text-foreground bg-card">
        <Logo size={24} />
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <div className="flex items-center gap-1 text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Flame size={12} className="fill-orange-400" />
            <span>{streak}d</span>
          </div>
          <div className="text-[10px] font-bold bg-secondary border border-border px-2 py-0.5 rounded">
            LVL {level}
          </div>
        </div>
      </header>

      {/* MOBILE FLOATING DOCK (iOS Style, centered, floating, no visual noise, hidden on desktop) */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] h-14 rounded-2xl glassmorphism z-30 flex items-center justify-around py-1 px-2 shadow-2xl border border-border/60 bg-[#08080f]/80 backdrop-blur-md">
        {mobileDockItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-all duration-200
              ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className="transition-transform active:scale-95 duration-100" />
                <span className="text-[8px] mt-0.5 font-bold tracking-tight">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
