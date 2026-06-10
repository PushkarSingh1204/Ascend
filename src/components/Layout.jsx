// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { useGame } from '../context/GameContext';
import { Award, Star, Trophy, Sparkles } from 'lucide-react';

export default function Layout({ children }) {
  const { levelUpAlert, setLevelUpAlert, badgeAlert, setBadgeAlert } = useGame();

  return (
    <div className="min-h-screen bg-[#07070b] text-neutral-100 flex flex-col md:flex-row">
      {/* Navigation menu */}
      <Sidebar />
      
      {/* Main content viewport */}
      <main className="flex-1 min-h-screen overflow-x-hidden pt-14 pb-16 md:pt-0 md:pb-0 md:pl-64 flex flex-col">
        <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>

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
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300"
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
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
            >
              Collect Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
