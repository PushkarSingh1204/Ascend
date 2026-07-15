// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Routine.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getRoutines, updateRoutineTask, getWaterLog, updateWaterLog, getSleepLog, updateSleepLog } from '../services/db';
import { Sun, Moon, Sparkles, Smile, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Routine() {
  const { addXP, syncGameState } = useGame();
  
  // Routines and logs states
  const [routines, setRoutines] = useState({ morning: [], night: [], skincare: [], workout: [] });
  const [water, setWater] = useState({ current: 0, target: 2000 });
  const [sleep, setSleep] = useState({ current: 0, target: 8.0 });
  
  const [waterInput, setWaterInput] = useState(250);
  const [sleepInput, setSleepInput] = useState(7.5);
  const [loading, setLoading] = useState(true);

  const fetchRoutinesData = async () => {
    try {
      setLoading(true);
      const routinesData = await getRoutines();
      setRoutines(routinesData);
      
      const waterData = await getWaterLog();
      setWater(waterData);
      
      const sleepData = await getSleepLog();
      setSleep(sleepData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutinesData();
  }, []);

  const handleToggleTask = async (category, taskId, completedStatus) => {
    try {
      const updated = await updateRoutineTask(category, taskId, completedStatus);
      setRoutines(updated);
      
      // Award minor XP for checklist checks
      if (completedStatus) {
        await addXP(15, `Routine Task Completed in ${category.toUpperCase()}`);
      }
      
      await syncGameState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleWaterSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateWaterLog(parseInt(waterInput));
      setWater(updated);
      
      await addXP(20, "Logged Hydration Intake");
      await syncGameState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateSleepLog(parseFloat(sleepInput));
      setSleep(updated);
      
      await addXP(30, "Logged Sleep Recovery Hours");
      await syncGameState();
    } catch (err) {
      console.error(err);
    }
  };

  const getPercent = (curr, target) => {
    return Math.min(100, Math.round((curr / target) * 100));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
        <span className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></span>
        <span>Loading Routines...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          Daily Routine Habits
        </h1>
        <p className="text-sm text-muted-foreground">
          Perform morning/night checklists, record hydration targets, and log sleep to support cellular regeneration.
        </p>
      </div>

      {/* Grid: Skincare & Workout on left, Sleep/Water on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Checklists) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Morning & Night routines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Morning Checklist */}
            <div className="glassmorphism p-5 rounded-2xl border border-border bg-card space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                <Sun size={16} className="text-yellow-500" />
                Morning Focus
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {routines.morning.map((task) => (
                  <label key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-background border border-border hover:border-neutral-500 transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask('morning', task.id, e.target.checked)}
                      className="rounded border-border focus:ring-0 text-primary w-4 h-4 cursor-pointer"
                    />
                    <span className={task.completed ? 'line-through text-muted-foreground' : 'text-foreground font-semibold'}>
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Night Checklist */}
            <div className="glassmorphism p-5 rounded-2xl border border-border bg-card space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                <Moon size={16} className="text-purple-400" />
                Night Recovery
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {routines.night.map((task) => (
                  <label key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-background border border-border hover:border-neutral-500 transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask('night', task.id, e.target.checked)}
                      className="rounded border-border focus:ring-0 text-primary w-4 h-4 cursor-pointer"
                    />
                    <span className={task.completed ? 'line-through text-muted-foreground' : 'text-foreground font-semibold'}>
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Skincare & Workout routines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Skincare Checklist */}
            <div className="glassmorphism p-5 rounded-2xl border border-border bg-card space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                <Smile size={16} className="text-indigo-400" />
                Skincare Cycle
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {routines.skincare.map((task) => (
                  <label key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-background border border-border hover:border-neutral-500 transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask('skincare', task.id, e.target.checked)}
                      className="rounded border-border focus:ring-0 text-primary w-4 h-4 cursor-pointer"
                    />
                    <span className={task.completed ? 'line-through text-muted-foreground' : 'text-foreground font-semibold'}>
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Workout Checklist */}
            <div className="glassmorphism p-5 rounded-2xl border border-border bg-card space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                <HeartPulse size={16} className="text-emerald-450" />
                Posture & Muscles
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {routines.workout.map((task) => (
                  <label key={task.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-background border border-border hover:border-neutral-500 transition-colors cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask('workout', task.id, e.target.checked)}
                      className="rounded border-border focus:ring-0 text-primary w-4 h-4 cursor-pointer"
                    />
                    <span className={task.completed ? 'line-through text-muted-foreground' : 'text-foreground font-semibold'}>
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (Water & Sleep Logs) */}
        <div className="space-y-6">
          
          {/* Water Hydration Log */}
          <div className="glassmorphism p-5 rounded-2xl border border-border bg-card space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center justify-between border-b border-border pb-3">
              <span className="flex items-center gap-2">
                💧 Water Log
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">
                {getPercent(water.current, water.target)}% TARGET
              </span>
            </h3>

            <div className="text-center py-4 bg-background border border-border rounded-xl">
              <span className="text-3xl font-black text-foreground block">{water.current} / {water.target} ml</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mt-1 block">Hydrated Today</span>
            </div>

            <form onSubmit={handleWaterSubmit} className="flex gap-2">
              <input
                type="number"
                value={waterInput}
                onChange={(e) => setWaterInput(e.target.value)}
                className="flex-1 text-xs bg-background border border-border rounded-lg px-3 py-2 outline-none text-foreground"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                Log Water
              </button>
            </form>
          </div>

          {/* Sleep Recovery Log */}
          <div className="glassmorphism p-5 rounded-2xl border border-border bg-card space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center justify-between border-b border-border pb-3">
              <span className="flex items-center gap-2">
                🌙 Sleep Log
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">
                {getPercent(sleep.current, sleep.target)}% TARGET
              </span>
            </h3>

            <div className="text-center py-4 bg-background border border-border rounded-xl">
              <span className="text-3xl font-black text-foreground block">{sleep.current} / {sleep.target} hrs</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mt-1 block">Recovery Sleep</span>
            </div>

            <form onSubmit={handleSleepSubmit} className="flex gap-2">
              <input
                type="number"
                step="0.1"
                value={sleepInput}
                onChange={(e) => setSleepInput(e.target.value)}
                className="flex-1 text-xs bg-background border border-border rounded-lg px-3 py-2 outline-none text-foreground"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                Log Sleep
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
