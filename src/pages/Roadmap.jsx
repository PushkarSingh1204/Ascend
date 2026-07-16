// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Roadmap.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Card, Button, ProgressRing, Badge, Skeleton } from '../components/DesignSystem';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Sparkles,
  ArrowRight,
  ChevronRight
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

  // Group milestones by week — guard against non-array (e.g. still loading)
  const safeMilestones = Array.isArray(roadmapMilestones) ? roadmapMilestones : [];
  const weeks = [1, 2, 3, 4].map(w => ({
    weekNum: w,
    milestones: safeMilestones.filter(m => m.week === w)
  }));

  // Determine current active week based on progress
  const getWeekStatus = (weekNum) => {
    if (weekNum === 1) return 'active';
    // Week N is unlocked if previous week has at least one completion
    const prevWeekMilestones = safeMilestones.filter(m => m.week === weekNum - 1);
    const completedPrev = prevWeekMilestones.filter(m => m.completed).length;
    if (completedPrev >= 1) return 'active';
    return 'locked';
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-4xl mx-auto pb-16">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Ascend Journey Roadmap</span>
          <h1 className="text-3xl font-black tracking-tight mb-1">
            30-Day {focusArea} Alignment
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Establish healthy habits and track weekly goals. Redefine focus areas at the end of the month to scale up.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/profile?action=reonboard')}
        >
          <span>Redefine Focus Area</span>
          <ChevronRight size={12} />
        </Button>
      </div>

      {/* 2. Overview Progress Gauge */}
      <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/10">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-sm font-black uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
            <Compass size={16} className="text-primary animate-pulse" />
            Active Transformation Progress
          </h3>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Complete daily milestones inside your week card to unlock bonus experience XP points and transition to subsequent locked weeks.
          </p>
        </div>
        
        {/* Progress reading */}
        <div className="flex items-center gap-5">
          <div className="text-center sm:text-right">
            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Timeline Completed</span>
            <span className="text-2xl font-black text-foreground">{roadmapPercent}%</span>
          </div>
          <ProgressRing percent={roadmapPercent} size={60} strokeWidth={6}>
            <span className="text-[9px] font-black text-primary">30d</span>
          </ProgressRing>
        </div>
      </Card>

      {/* 3. Week Timeline Connective List */}
      {safeMilestones.length > 0 ? (
        <section className="relative pl-6 sm:pl-8 space-y-8">
          
          {/* Vertical Connective Timeline Bar */}
          <div className="absolute left-[34px] sm:left-[42px] top-6 bottom-6 w-[2px] bg-secondary/80 pointer-events-none"></div>

          {weeks.map((week) => {
            const status = getWeekStatus(week.weekNum);
            const isLocked = status === 'locked';
            
            return (
              <div 
                key={week.weekNum}
                className="relative flex gap-4 sm:gap-6 items-start"
              >
                
                {/* Timeline Circle Indicator */}
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 z-10 mt-1.5 transition-colors duration-300 ${
                    isLocked 
                      ? 'bg-background border-border text-muted-foreground' 
                      : 'bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(134,59,255,0.15)]'
                  }`}
                >
                  <span className="text-[8px] font-black">{week.weekNum}</span>
                </div>

                <Card 
                  className={`flex-1 p-6 transition-all duration-300 ${
                    isLocked 
                      ? 'opacity-40 border-border/50 bg-background/5' 
                      : 'border-border shadow-md'
                  }`}
                >
                  
                  {/* Week Header */}
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">WEEK {week.weekNum}</span>
                      <span className="hidden sm:inline text-neutral-700">|</span>
                      <span className="text-xs font-black text-foreground">
                        {week.weekNum === 1 ? 'Establish Posture Baseline' : 
                         week.weekNum === 2 ? 'Muscle & Hydration Targets' : 
                         week.weekNum === 3 ? 'Rest & Skincare Rhythm' : 'Peak Consistency Alignment'}
                      </span>
                    </div>

                    {isLocked ? (
                      <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground bg-secondary/40 border border-border px-2 py-0.5 rounded-full">
                        <Lock size={10} />
                        <span>Locked</span>
                      </div>
                    ) : (
                      <Badge variant="indigo">
                        <Sparkles size={8} className="mr-0.5" />
                        Active Week
                      </Badge>
                    )}
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-2.5">
                    {week.milestones.map((milestone) => (
                      <button
                        key={milestone.id}
                        disabled={isLocked}
                        onClick={() => toggleMilestone(milestone.id, !milestone.completed)}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                          milestone.completed 
                            ? 'bg-primary/5 border-primary/20 text-indigo-300' 
                            : isLocked 
                              ? 'bg-background/10 border-border/30 text-muted-foreground cursor-not-allowed' 
                              : 'bg-background/25 border-border hover:border-primary/20 text-foreground'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {milestone.completed ? (
                            <CheckCircle2 size={16} className="text-primary" />
                          ) : (
                            <Circle size={16} className="text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground block">{milestone.title}</span>
                            {!milestone.completed && !isLocked && (
                              <span className="text-[8px] font-black text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                +75 XP
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground block leading-relaxed">{milestone.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                </Card>
              </div>
            );
          })}
        </section>
      ) : (
        <EmptyState
          icon={Compass}
          title="Roadmap Not Found"
          description="We couldn't construct your personal roadmap stage records. Please redefine your focus area to regenerate your 30-day timeline."
          actionText="Set focus area"
          onAction={() => navigate('/profile?action=reonboard')}
        />
      )}

    </div>
  );
}
