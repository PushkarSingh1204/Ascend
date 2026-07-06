// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\CommandPalette.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useGame } from '../context/GameContext';
import { getJournals, getAnalyses } from '../services/db';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  User, 
  Compass, 
  CheckCircle,
  Eye,
  Settings,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { addNotification } = useNotifications();
  const { performDailyCheckin } = useGame();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Load searchable database items
  const journals = getJournals() || [];
  const analyses = getAnalyses() || [];

  // Build items list
  const pages = [
    { name: 'Go to Dashboard', category: 'Pages', action: () => navigate('/dashboard'), icon: Compass },
    { name: 'Go to Roadmap', category: 'Pages', action: () => navigate('/roadmap'), icon: Compass },
    { name: 'Go to Face Harmony Scan', category: 'Pages', action: () => navigate('/analysis'), icon: Sparkles },
    { name: 'Go to Progress Slider', category: 'Pages', action: () => navigate('/progress'), icon: Eye },
    { name: 'Go to Routines Checklist', category: 'Pages', action: () => navigate('/routine'), icon: Calendar },
    { name: 'Go to Journal Log', category: 'Pages', action: () => navigate('/journal'), icon: BookOpen },
    { name: 'Go to Weekly Review', category: 'Pages', action: () => navigate('/weekly-review'), icon: CheckCircle },
    { name: 'Go to Premium Tools', category: 'Pages', action: () => navigate('/premium-tools'), icon: Sparkles },
    { name: 'Go to Insights Reports', category: 'Pages', action: () => navigate('/analytics'), icon: TrendingUp },
    { name: 'Go to Profile Preferences', category: 'Pages', action: () => navigate('/profile'), icon: User }
  ];

  const actions = [
    { 
      name: "Complete Today's Daily Checkin", 
      category: 'Quick Actions', 
      action: () => {
        performDailyCheckin("Checked-in from command palette.");
        addNotification("Daily Checkin Complete", "Logged consistency point from command palette.", "general");
        onClose();
      }, 
      icon: CheckCircle 
    },
    { 
      name: `Switch Theme (Current: ${theme})`, 
      category: 'Quick Actions', 
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        addNotification("Theme Changed", `Switched UI theme to ${theme === 'dark' ? 'light' : 'dark'}.`, "general");
        onClose();
      }, 
      icon: theme === 'dark' ? Sun : Moon 
    },
    { 
      name: 'Start New Face Analysis', 
      category: 'Quick Actions', 
      action: () => { navigate('/analysis'); onClose(); }, 
      icon: Sparkles 
    }
  ];

  // Dynamic journal entries search
  const journalItems = journals.map(entry => ({
    name: `Journal: "${entry.notes?.substring(0, 40)}..." (${entry.mood})`,
    category: 'Journal Entries',
    action: () => { navigate('/journal'); onClose(); },
    icon: BookOpen
  }));

  // Dynamic face analysis reports search
  const analysisItems = analyses.map(scan => ({
    name: `Harmony Scan Report: ${scan.date} (${scan.facial_harmony_score}% Score)`,
    category: 'Facial Analyses',
    action: () => { navigate('/analysis'); onClose(); },
    icon: Sparkles
  }));

  // Combine everything
  const allItems = [...actions, ...pages, ...journalItems, ...analysisItems];

  // Filter items based on query
  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8); // Max 8 results to keep UI tight

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Palette Container */}
      <div className="w-full max-w-xl glassmorphism rounded-2xl border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[440px] bg-[#0c0c12]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-900 bg-neutral-950/20">
          <Search className="text-neutral-500 shrink-0" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search pages, journals, analyses, settings, actions..."
            className="w-full text-sm bg-transparent outline-none text-white placeholder-neutral-500 font-medium"
          />
          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-neutral-950/40">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors text-xs ${isSelected ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-transparent border border-transparent text-neutral-300 hover:bg-neutral-900/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={14} className={isSelected ? 'text-indigo-400' : 'text-neutral-500'} />
                    <div>
                      <span className="font-bold block">{item.name}</span>
                      <span className="text-[9px] text-neutral-500 font-semibold uppercase mt-0.5 tracking-wider block">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {isSelected && <ChevronRight size={14} className="text-indigo-400 shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-neutral-500 italic">
              No matching pages, journals, or actions found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-neutral-950/80 border-t border-neutral-900/60 flex justify-between items-center text-[10px] text-neutral-500 font-medium">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Ascend Command Center</span>
        </div>
      </div>
    </div>
  );
}
