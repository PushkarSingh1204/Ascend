// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Routine.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { getRoutines, updateRoutineTask, getWaterLog, updateWaterLog, getSleepLog, updateSleepLog } from '../services/db';
import { Card, Button, Input, Badge, Skeleton } from '../components/DesignSystem';
import { Sun, Moon, Sparkles, Smile, ShieldCheck, HeartPulse, Trash2, CheckCircle2 } from 'lucide-react';
import { routineEngine } from '../services/engines/routineEngine.js';

export default function Routine() {
  const { addXP, syncGameState } = useGame();
  const { user } = useAuth();
  
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
      
      const waterData = await getWaterLog();
      setWater(waterData || { current: 0, target: 2000 });
      
      const sleepData = await getSleepLog();
      setSleep(sleepData || { current: 0, target: 8.0 });

      if (user && user.profile) {
        const compiled = await routineEngine.run({ profile: user.profile });
        setRoutines(compiled || { morning: [], night: [], skincare: [], workout: [] });
      } else {
        const routinesData = await getRoutines();
        setRoutines(routinesData || { morning: [], night: [], skincare: [], workout: [] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutinesData();
  }, [user]);

  const handleToggleTask = async (category, taskId, completedStatus) => {
    try {
      const updated = await updateRoutineTask(category, taskId, completedStatus);
      setRoutines(updated || { morning: [], night: [], skincare: [], workout: [] });
      
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
      setWater(updated || { current: 0, target: 2000 });
      
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
      setSleep(updated || { current: 0, target: 8.0 });
      
      await addXP(30, "Logged Sleep Recovery Hours");
      await syncGameState();
    } catch (err) {
      console.error(err);
    }
  };

  const getPercent = (curr, target) => {
    return Math.min(100, Math.round((curr / (target || 1)) * 100));
  };

  if (loading) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton variant="rect" height="100px" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2" variant="rect" height="360px" />
          <Skeleton variant="rect" height="360px" />
        </div>
      </div>
    );
  }

  // Safe checks on task categories
  const safeMorning = Array.isArray(routines?.morning) ? routines.morning : [];
  const safeNight = Array.isArray(routines?.night) ? routines.night : [];
  const safeSkincare = Array.isArray(routines?.skincare) ? routines.skincare : [];
  const safeWorkout = Array.isArray(routines?.workout) ? routines.workout : [];

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Habit Blueprint</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Daily Routine Habits
        </h1>
        <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
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
            <Card className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                <Sun size={14} className="text-yellow-500" />
                Morning Focus
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {safeMorning.map((task) => (
                  <motion.label 
                    key={task.id} 
                    whileHover={{ x: task.completed ? 0 : 3 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border hover:border-primary/15 transition-all cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask('morning', task.id, e.target.checked)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${task.completed ? 'bg-primary border-primary' : 'border-neutral-700 bg-black/25'}`}>
                      {task.completed ? <CheckCircle2 size={12} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>}
                    </div>
                    <span className={task.completed ? 'line-through text-muted-foreground text-xs' : 'text-foreground font-semibold text-xs'}>
                      {task.text}
                    </span>
                  </motion.label>
                ))}
              </div>
            </Card>

            {/* Night Checklist */}
            <Card className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                <Moon size={14} className="text-purple-400 animate-pulse" />
                Night Recovery
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {safeNight.map((task) => (
                  <motion.label 
                    key={task.id} 
                    whileHover={{ x: task.completed ? 0 : 3 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border hover:border-primary/15 transition-all cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask('night', task.id, e.target.checked)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${task.completed ? 'bg-primary border-primary' : 'border-neutral-700 bg-black/25'}`}>
                      {task.completed ? <CheckCircle2 size={12} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>}
                    </div>
                    <span className={task.completed ? 'line-through text-muted-foreground text-xs' : 'text-foreground font-semibold text-xs'}>
                      {task.text}
                    </span>
                  </motion.label>
                ))}
              </div>
            </Card>

          </div>

          {/* Skincare & Workout routines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Skincare Checklist */}
            <Card className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                <Smile size={14} className="text-indigo-400" />
                Skincare Cycle
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {safeSkincare.map((task) => (
                  <motion.label 
                    key={task.id} 
                    whileHover={{ x: task.completed ? 0 : 3 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border hover:border-primary/15 transition-all cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask('skincare', task.id, e.target.checked)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${task.completed ? 'bg-primary border-primary' : 'border-neutral-700 bg-black/25'}`}>
                      {task.completed ? <CheckCircle2 size={12} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>}
                    </div>
                    <span className={task.completed ? 'line-through text-muted-foreground text-xs' : 'text-foreground font-semibold text-xs'}>
                      {task.text}
                    </span>
                  </motion.label>
                ))}
              </div>
            </Card>

            {/* Workout Checklist */}
            <Card className="p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
                <HeartPulse size={14} className="text-emerald-400" />
                Posture & Muscles
              </h3>
              
              <div className="space-y-2.5 text-xs">
                {safeWorkout.map((task) => (
                  <motion.label 
                    key={task.id} 
                    whileHover={{ x: task.completed ? 0 : 3 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border hover:border-primary/15 transition-all cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask('workout', task.id, e.target.checked)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${task.completed ? 'bg-primary border-primary' : 'border-neutral-700 bg-black/25'}`}>
                      {task.completed ? <CheckCircle2 size={12} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>}
                    </div>
                    <span className={task.completed ? 'line-through text-muted-foreground text-xs' : 'text-foreground font-semibold text-xs'}>
                      {task.text}
                    </span>
                  </motion.label>
                ))}
              </div>
            </Card>

          </div>

        </div>

        {/* Right Column (Water & Sleep Logs) */}
        <div className="space-y-6">
          
          {/* Water Hydration Log */}
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b border-border pb-3">
              <span className="flex items-center gap-2">
                💧 Water Log
              </span>
              <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                {getPercent(water.current, water.target)}% TARGET
              </span>
            </h3>

            <div className="text-center py-4 bg-secondary/40 border border-border rounded-xl">
              <span className="text-2xl font-black text-foreground block">{water.current} / {water.target} ml</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mt-1 block">Hydrated Today</span>
            </div>

            <form onSubmit={handleWaterSubmit} className="flex gap-2">
              <input
                type="number"
                value={waterInput}
                onChange={(e) => setWaterInput(e.target.value)}
                className="flex-1 text-xs bg-secondary/40 border border-border rounded-xl px-3 py-2.5 outline-none text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <Button
                variant="primary"
                type="submit"
              >
                + Log
              </Button>
            </form>
          </Card>

          {/* Sleep Recovery Log */}
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b border-border pb-3">
              <span className="flex items-center gap-2">
                💤 Sleep Tracker
              </span>
              <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                {getPercent(sleep.current, sleep.target)}% TARGET
              </span>
            </h3>

            <div className="text-center py-4 bg-secondary/40 border border-border rounded-xl">
              <span className="text-2xl font-black text-foreground block">{sleep.current} / {sleep.target} hrs</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mt-1 block">Sleep Logged</span>
            </div>

            <form onSubmit={handleSleepSubmit} className="flex gap-2">
              <input
                type="number"
                step="0.5"
                value={sleepInput}
                onChange={(e) => setSleepInput(e.target.value)}
                className="flex-1 text-xs bg-secondary/40 border border-border rounded-xl px-3 py-2.5 outline-none text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <Button
                variant="primary"
                type="submit"
              >
                + Log
              </Button>
            </form>
          </Card>

        </div>

      </div>

    </div>
  );
}
