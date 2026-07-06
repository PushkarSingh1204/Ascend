// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  Image as ImageIcon, 
  CalendarDays, 
  BookOpen, 
  TrendingUp, 
  LogOut,
  Flame,
  Award,
  Compass,
  ClipboardCheck,
  User,
  Users,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';

export default function Sidebar() {
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

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glassmorphism border-r border-neutral-800/80 z-20 text-neutral-200">
        {/* Logo Section */}
        <div className="p-6 border-b border-neutral-800/50 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            A
          </div>
          <span className="text-xl font-bold tracking-wider text-white bg-clip-text bg-gradient-to-r from-white to-neutral-400">
            ASCEND
          </span>
        </div>

        {/* Gamified Profile Widget */}
        <div className="p-5 border-b border-neutral-800/50 bg-neutral-900/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400 tracking-wider">LEVEL {level}</span>
            <span className="text-xs text-neutral-500">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
          </div>
          
          {/* XP Progress Bar */}
          <div className="w-full h-2 bg-neutral-850 rounded-full overflow-hidden mb-4 border border-neutral-800">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            {/* Streak widget */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Flame size={14} className="fill-orange-400 animate-pulse" />
              <span className="text-xs font-bold">{streak}d Streak</span>
            </div>
            
            {/* Premium Indicator */}
            {user?.profile?.is_premium ? (
              <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25">
                Ascend Plus
              </span>
            ) : (
              <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                Free Tier
              </span>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border-l-2 border-blue-500 pl-3.5 shadow-md shadow-blue-500/5' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }
              `}
            >
              <item.icon size={16} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-neutral-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-red-400 hover:bg-red-950/10 transition-all duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & BOTTOM NAV */}
      <header className="md:hidden fixed top-0 left-0 w-full h-14 glassmorphism border-b border-neutral-800/80 z-20 flex items-center justify-between px-4 text-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            A
          </div>
          <span className="font-bold tracking-wider text-sm">ASCEND</span>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-7 h-7 rounded-lg bg-neutral-850 border border-neutral-805 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
          </button>

          <div className="flex items-center gap-1 text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full text-xs font-semibold">
            <Flame size={12} className="fill-orange-400" />
            <span>{streak}d</span>
          </div>
          <div className="text-xs font-bold bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded">
            LVL {level}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Scrollable horizontally or compact icons) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 glassmorphism border-t border-neutral-800/80 z-20 flex items-center justify-around px-1 pb-safe">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
              ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-neutral-500 hover:text-neutral-300'}
            `}
          >
            <item.icon size={16} />
            <span className="text-[8px] mt-0.5 font-medium tracking-tight truncate max-w-full">
              {item.name.substring(0, 5)}
            </span>
          </NavLink>
        ))}
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
            ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-neutral-500'}
          `}
        >
          <User size={16} />
          <span className="text-[8px] mt-0.5 font-medium tracking-tight">Profile</span>
        </NavLink>
      </nav>
    </>
  );
}
