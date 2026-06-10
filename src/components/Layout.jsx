// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\components\Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { useGame } from '../context/GameContext';
import { Award, Star } from 'lucide-react';

export default function Layout({ children }) {
  const { levelUpAlert, setLevelUpAlert } = useGame();

  return (
    <div className="min-h-screen bg-[#07070b] text-neutral-100 flex flex-col md:flex-row">
      {/* Navigation menus */}
      <Sidebar />
      
      {/* Main content viewport */}
      <main className="flex-1 min-h-screen overflow-x-hidden pt-14 pb-16 md:pt-0 md:pb-0 md:pl-64 flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* LEVEL UP CELEBRATORY MODAL OVERLAY */}
      {levelUpAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md glassmorphism glow-accent p-8 rounded-2xl text-center relative overflow-hidden flex flex-col items-center">
            {/* Background glowing particles */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Glowing Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-6 animate-bounce shadow-lg shadow-purple-500/20">
              <Award size={40} className="stroke-[1.5]" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              LEVEL ASCENDED!
            </h2>
            
            <p className="text-neutral-400 text-sm mb-6 max-w-xs">
              Your dedication to daily self-improvement has pushed you to the next stage of your journey.
            </p>

            {/* Level Comparison */}
            <div className="flex items-center gap-6 justify-center mb-8 bg-neutral-900/60 border border-neutral-800/80 px-6 py-4 rounded-xl">
              <div className="text-center">
                <span className="text-xs text-neutral-500 font-semibold block uppercase">Previous</span>
                <span className="text-xl font-bold text-neutral-400">LVL {levelUpAlert.oldLevel}</span>
              </div>
              
              {/* Arrow symbol */}
              <div className="text-neutral-600 text-lg font-bold">➔</div>

              <div className="text-center">
                <span className="text-xs text-purple-400 font-semibold block uppercase">Ascended</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  LVL {levelUpAlert.newLevel}
                </span>
              </div>
            </div>

            {/* Sub-award details */}
            <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/5 border border-yellow-400/10 px-3 py-1.5 rounded-full mb-8">
              <Star size={12} className="fill-yellow-400" />
              <span>+100 XP Level-up Bonus Awarded</span>
            </div>

            {/* Action button */}
            <button
              onClick={() => setLevelUpAlert(null)}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-md shadow-purple-600/15"
            >
              Continue Transcending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
