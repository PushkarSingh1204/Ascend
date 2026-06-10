// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Roadmap.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Lock, 
  ChevronRight, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function Roadmap() {
  const { user } = useAuth();
  const { 
    roadmapMilestones, 
    roadmapPercent, 
    toggleMilestone, 
    syncGameState 
  } = useGame();
  
  const navigate = useNavigate();

  // Re-sync state on mount to ensure updates align
  useEffect(() => {
    syncGameState();
  }, []);

  const focusArea = user?.profile?.focus_area || 'Face';

  // Group milestones by week
  const weeks = [1, 2, 3, 4].map(w => ({
    weekNum: w,
    milestones: roadmapMilestones.filter(m => m.week === w)
  }));

  // Determine current active week based on progress
  const getWeekStatus = (weekNum) => {
    if (weekNum === 1) return 'active';
    // Week N is unlocked if previous week has at least one completion
    const prevWeekMilestones = roadmapMilestones.filter(m => m.week === weekNum - 1);
    const completedPrev = prevWeekMilestones.filter(m => m.completed).length;
    if (completedPrev >= 1) return 'active';
    return 'locked';
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 max-w-4xl mx-auto pb-10">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">Coach Roadmap</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            30-Day {focusArea} Journey
          </h1>
          <p className="text-sm text-neutral-400">
            Establish healthy habits and track weekly goals. Redefine focus areas at the end of the month.
          </p>
        </div>

        <button
          onClick={() => navigate('/profile?action=reonboard')}
          className="px-4 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/80 text-xs font-semibold text-neutral-300 transition-all duration-200"
        >
          Redefine Journey Focus
        </button>
      </div>

      {/* Overview Progress Card */}
      <section className="glassmorphism border border-neutral-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-tr from-neutral-900/60 via-indigo-950/10 to-neutral-900/60">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Compass size={18} className="text-indigo-400" />
            Active Transformation Progress
          </h3>
          <p className="text-xs text-neutral-400 max-w-md">
            Complete weekly milestones to unlock bonus XP and progress to the next week stage.
          </p>
        </div>
        
        {/* Progress reading */}
        <div className="flex items-center gap-4">
          <div className="text-center sm:text-right">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block">Completed</span>
            <span className="text-2xl font-black text-white">{roadmapPercent}%</span>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center relative shadow-md shadow-indigo-500/5">
            <div className="absolute inset-1 rounded-full bg-neutral-900 flex items-center justify-center text-[10px] font-bold text-indigo-300">
              30d
            </div>
          </div>
        </div>
      </section>

      {/* Week Timeline List */}
      {roadmapMilestones.length > 0 ? (
        <section className="space-y-6">
          {weeks.map((week) => {
            const status = getWeekStatus(week.weekNum);
            const isLocked = status === 'locked';
            
            return (
              <div 
                key={week.weekNum}
                className={`glassmorphism border p-6 rounded-2xl transition-all duration-300 ${isLocked ? 'border-neutral-900/60 opacity-50 bg-neutral-950/20' : 'border-neutral-800/80 shadow-md'}`}
              >
                
                {/* Week Header */}
                <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-500">WEEK {week.weekNum}</span>
                    <span className="text-neutral-700">|</span>
                    <span className="text-xs font-bold text-white">
                      {week.weekNum === 1 ? 'Establish Alignment' : 
                       week.weekNum === 2 ? 'Muscle & Hydration' : 
                       week.weekNum === 3 ? 'Rest & Skincare Consistency' : 'Peak Performance Consistency'}
                    </span>
                  </div>

                  {isLocked ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500">
                      <Lock size={12} />
                      <span>Locked</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/15">
                      <Sparkles size={10} />
                      <span>Active Stage</span>
                    </div>
                  )}
                </div>

                {/* Milestones list */}
                <div className="space-y-3">
                  {week.milestones.map((milestone) => (
                    <button
                      key={milestone.id}
                      disabled={isLocked}
                      onClick={() => toggleMilestone(milestone.id, !milestone.completed)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${milestone.completed ? 'bg-indigo-500/5 border-indigo-500/25 text-indigo-300' : isLocked ? 'bg-neutral-950/20 border-neutral-900/60 text-neutral-500 cursor-not-allowed' : 'bg-neutral-950/40 border-neutral-850 hover:border-neutral-700 text-neutral-300'}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {milestone.completed ? (
                          <CheckCircle2 size={16} className="text-indigo-400" />
                        ) : (
                          <Circle size={16} className="text-neutral-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white block">{milestone.title}</span>
                          {!milestone.completed && !isLocked && (
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                              +75 XP
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-400 block leading-relaxed">{milestone.text}</span>
                      </div>
                    </button>
                  ))}
                </div>

              </div>
            );
          })}
        </section>
      ) : (
        <EmptyState
          icon={Compass}
          title="No Roadmap Generated"
          description="We couldn't load your self-transformation roadmap. Redefine your focus area to regenerate your 30-day journey template."
          actionText="Redefine Focus"
          onAction={() => navigate('/profile?action=reonboard')}
        />
      )}

    </div>
  );
}
