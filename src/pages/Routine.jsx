// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Routine.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { 
  getRoutines, 
  updateRoutineTask, 
  getWaterLog, 
  updateWaterLog, 
  getSleepLog, 
  updateSleepLog 
} from '../services/db';
import { 
  CheckSquare, 
  Square, 
  Droplet, 
  Moon, 
  Sparkles, 
  Sun, 
  Dumbbell, 
  Heart,
  Plus
} from 'lucide-react';

export default function Routine() {
  const { addXP, unlockBadge } = useGame();
  
  // Routines state
  const [routines, setRoutines] = useState({ morning: [], night: [], skincare: [], workout: [] });
  const [water, setWater] = useState({ current: 0, target: 2000 });
  const [sleep, setSleep] = useState({ current: 0, target: 8.0 });
  const [sleepInput, setSleepInput] = useState(7.0);

  // Load routines data on mount
  useEffect(() => {
    setRoutines(getRoutines());
    setWater(getWaterLog());
    const initialSleep = getSleepLog();
    setSleep(initialSleep);
    setSleepInput(initialSleep.current);
  }, []);

  const handleToggleTask = (category, taskId, currentStatus) => {
    const updated = updateRoutineTask(category, taskId, !currentStatus);
    setRoutines(updated);
    
    if (!currentStatus) {
      // Completed task -> Award XP
      addXP(10, `Completed task in ${category} routine`);
      
      // Check if all routines completed to award badge
      const allDone = Object.values(updated).every(list => list.every(t => t.completed));
      if (allDone) {
        unlockBadge('routine_pioneer');
      }
    }
  };

  const handleAddWater = (amount) => {
    const updated = updateWaterLog(amount);
    setWater(updated);
    
    addXP(15, `Log water intake (+${amount}ml)`);

    if (updated.current >= updated.target) {
      unlockBadge('hydration_king');
    }
  };

  const handleSaveSleep = (e) => {
    e.preventDefault();
    const updated = updateSleepLog(parseFloat(sleepInput));
    setSleep(updated);
    
    addXP(20, `Log sleep duration (${sleepInput} hours)`);

    if (updated.current >= updated.target) {
      unlockBadge('deep_sleep');
    }
  };

  // Water level height calculator
  const waterPercent = Math.min(100, Math.round((water.current / water.target) * 100));

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Transformation Routines
        </h1>
        <p className="text-sm text-neutral-400">
          Build consistency across critical self-improvement areas. Every completed activity boosts your level.
        </p>
      </div>

      {/* Grid: Checklists on Left, Logs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Morning & Night Checklists (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Morning / Night Routines Card */}
          <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white border-b border-neutral-800/50 pb-2 flex items-center gap-2">
              <Sun size={18} className="text-yellow-400" />
              Daily Checklists
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Morning Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sun size={12} /> Morning Routine
                </span>
                <div className="space-y-2">
                  {routines.morning.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleToggleTask('morning', task.id, task.completed)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs text-left transition-colors ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-neutral-950/40 border-neutral-800/85 hover:border-neutral-700 text-neutral-300'}`}
                    >
                      {task.completed ? <CheckSquare size={14} className="text-emerald-500" /> : <Square size={14} className="text-neutral-500" />}
                      <span className={task.completed ? 'line-through opacity-60' : ''}>{task.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Night Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Moon size={12} /> Night Routine
                </span>
                <div className="space-y-2">
                  {routines.night.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleToggleTask('night', task.id, task.completed)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs text-left transition-colors ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-neutral-950/40 border-neutral-800/85 hover:border-neutral-700 text-neutral-300'}`}
                    >
                      {task.completed ? <CheckSquare size={14} className="text-emerald-500" /> : <Square size={14} className="text-neutral-500" />}
                      <span className={task.completed ? 'line-through opacity-60' : ''}>{task.text}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Skincare / Workout Checklists */}
          <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white border-b border-neutral-800/50 pb-2 flex items-center gap-2">
              <Dumbbell size={18} className="text-blue-400" />
              Focus Checklists
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Skincare Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Heart size={12} /> Skincare Regime
                </span>
                <div className="space-y-2">
                  {routines.skincare.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleToggleTask('skincare', task.id, task.completed)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs text-left transition-colors ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-neutral-950/40 border-neutral-800/85 hover:border-neutral-700 text-neutral-300'}`}
                    >
                      {task.completed ? <CheckSquare size={14} className="text-emerald-500" /> : <Square size={14} className="text-neutral-500" />}
                      <span className={task.completed ? 'line-through opacity-60' : ''}>{task.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Workout Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Dumbbell size={12} /> Workout Tasks
                </span>
                <div className="space-y-2">
                  {routines.workout.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleToggleTask('workout', task.id, task.completed)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs text-left transition-colors ${task.completed ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-neutral-950/40 border-neutral-800/85 hover:border-neutral-700 text-neutral-300'}`}
                    >
                      {task.completed ? <CheckSquare size={14} className="text-emerald-500" /> : <Square size={14} className="text-neutral-500" />}
                      <span className={task.completed ? 'line-through opacity-60' : ''}>{task.text}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Logs Card (Right Column) */}
        <div className="space-y-6">
          
          {/* Water Tracker Card */}
          <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                <Droplet size={18} className="text-blue-400" />
                Water Tracker
              </h3>
              <p className="text-xs text-neutral-400">
                Log fluids. Reaching 2.5L targets awards badges.
              </p>
            </div>

            {/* Elegant Circular Progress Indicator */}
            <div className="my-8 relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                <circle cx="64" cy="64" r="50" stroke="rgba(56,189,248,0.15)" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="50" 
                  stroke="#38bdf8" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - waterPercent / 100)}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white">{waterPercent}%</span>
                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Hydrated</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs text-neutral-400 block">Logged Status</span>
                <span className="text-xl font-black text-white">{water.current} / {water.target} ml</span>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAddWater(250)}
                  className="py-2.5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 text-xs font-bold text-blue-400 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={12} /> 250ml
                </button>
                <button
                  onClick={() => handleAddWater(500)}
                  className="py-2.5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 text-xs font-bold text-blue-400 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus size={12} /> 500ml
                </button>
              </div>
            </div>
          </div>

          {/* Sleep Tracker Card */}
          <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[260px]">
            <div>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                <Moon size={18} className="text-indigo-400" />
                Sleep Tracker
              </h3>
              <p className="text-xs text-neutral-400">
                Log hours of sleep from the previous night.
              </p>
            </div>

            <form onSubmit={handleSaveSleep} className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-neutral-400 font-semibold">
                  <span>Duration: {sleepInput} hrs</span>
                  <span>Goal: {sleep.target} hrs</span>
                </div>
                
                <input
                  type="range"
                  min="4.0"
                  max="12.0"
                  step="0.5"
                  value={sleepInput}
                  onChange={(e) => setSleepInput(e.target.value)}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="bg-neutral-950/40 border border-neutral-900 px-4 py-3 rounded-xl flex justify-between items-center text-xs text-neutral-400">
                <span>Last logged:</span>
                <strong className="text-white">{sleep.current} Hours</strong>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/10"
              >
                Log Sleep (+20 XP)
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
