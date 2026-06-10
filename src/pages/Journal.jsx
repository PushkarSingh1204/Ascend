// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Journal.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getJournals, addJournalEntry } from '../services/db';
import { BookOpen, Smile, Calendar, Sparkles, MessageSquare, ChevronDown } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function Journal() {
  const { addXP, unlockBadge } = useGame();

  const [logs, setLogs] = useState([]);
  const [mood, setMood] = useState(4); // default 4/5
  const [notes, setNotes] = useState('');
  const [reflections, setReflections] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);

  useEffect(() => {
    setLogs(getJournals() || []);
  }, []);

  const moodEmojis = [
    { value: 1, label: '😫', text: 'Stressed' },
    { value: 2, label: '😒', text: 'Low' },
    { value: 3, label: '😐', text: 'Neutral' },
    { value: 4, label: '🙂', text: 'Good' },
    { value: 5, label: '⚡', text: 'Focused' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes) return;

    const updated = addJournalEntry({
      mood: parseInt(mood),
      notes,
      reflections
    });
    
    setLogs(updated);
    
    // Reward Achievements
    unlockBadge('journal_entry');
    addXP(100, "Log Daily Reflection Journal");

    // Clear inputs & show success
    setNotes('');
    setReflections('');
    setMood(4);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  if (isDistractionFree) {
    return (
      <div className="fixed inset-0 z-50 bg-[#07070b] text-neutral-100 flex flex-col p-6 md:p-12 animate-fade-in">
        <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between py-6">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-4 mb-8">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" />
              Distraction-Free Reflection
            </h2>
            <button
              onClick={() => setIsDistractionFree(false)}
              className="text-xs font-semibold text-neutral-400 hover:text-white px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-850 transition-colors"
            >
              Exit Editor
            </button>
          </div>

          <div className="flex-1 flex flex-col space-y-6">
            {/* Mood Indicator */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block">How is your focus/mood?</span>
              <div className="flex justify-between gap-2 max-w-md">
                {moodEmojis.map((emoji) => (
                  <button
                    key={emoji.value}
                    type="button"
                    onClick={() => setMood(emoji.value)}
                    className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border text-center transition-all duration-200 ${mood === emoji.value ? 'bg-purple-500/15 border-purple-500 text-purple-300 font-bold' : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white'}`}
                  >
                    <span className="text-lg block">{emoji.label}</span>
                    <span className="text-[9px] mt-1 block tracking-tighter">{emoji.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Large Activity notes text area */}
            <div className="flex-1 flex flex-col space-y-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block">Daily Activity Notes</span>
              <textarea
                placeholder="What did you focus on today? (e.g. Cleanser morning check, correct neck posture maintained, 2.5L water...)"
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 w-full bg-neutral-950/40 border border-neutral-900 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-neutral-700 font-medium leading-relaxed"
              />
            </div>

            {/* Reflections */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block">Progress Reflections (Optional)</span>
              <textarea
                placeholder="What changes have you noticed? (e.g. Jawline feels more aligned, sleep quality has increased...)"
                rows="3"
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
                className="w-full bg-neutral-950/40 border border-neutral-900 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-neutral-700 leading-relaxed"
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-end gap-4">
            <button
              onClick={() => {
                setNotes('');
                setReflections('');
                setMood(4);
                setIsDistractionFree(false);
              }}
              type="button"
              className="px-5 py-3 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              Clear & Close
            </button>
            <button
              onClick={(e) => {
                handleSubmit(e);
                setIsDistractionFree(false);
              }}
              disabled={!notes}
              className={`px-8 py-3 rounded-xl font-bold text-xs text-white transition-all duration-300 ${notes ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/10' : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed'}`}
            >
              Save Reflection Log (+100 XP)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Transformation Journal
        </h1>
        <p className="text-sm text-neutral-400">
          Reflect on daily adjustments, log mental mood indexes, and document physical posture or skin tone shifts.
        </p>
      </div>

      {/* Main Grid: Form on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Entry Form (Left Column) */}
        <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl h-fit">
          <h3 className="text-base font-bold text-white mb-6 flex items-center justify-between border-b border-neutral-800/50 pb-2">
            <span className="flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" />
              Write Today's Entry
            </span>
            <button
              type="button"
              onClick={() => setIsDistractionFree(true)}
              className="text-[10px] text-purple-400 hover:text-purple-300 font-bold border border-purple-500/20 px-2 py-0.5 rounded bg-purple-500/5 transition-colors"
            >
              Full Screen
            </button>
          </h3>

          {isSuccess && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              ✓ Log saved to history timeline! (+100 XP awarded)
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mood selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">How is your focus/mood?</label>
              <div className="flex justify-between gap-2">
                {moodEmojis.map((emoji) => (
                  <button
                    key={emoji.value}
                    type="button"
                    onClick={() => setMood(emoji.value)}
                    className={`flex-1 flex flex-col items-center p-2.5 rounded-xl border text-center transition-all duration-200 ${mood === emoji.value ? 'bg-purple-500/15 border-purple-500 text-purple-300 font-bold glow-accent' : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white'}`}
                  >
                    <span className="text-xl block">{emoji.label}</span>
                    <span className="text-[9px] mt-1 block tracking-tighter">{emoji.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Daily Activity Notes</label>
              <textarea
                placeholder="What did you focus on today? (e.g. Cleanser morning check, correct neck posture maintained, 2.5L water...)"
                required
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-neutral-600"
              />
            </div>

            {/* Reflections */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Progress Reflections</label>
              <textarea
                placeholder="What changes have you noticed? (e.g. Jawline feels more aligned, sleep quality has increased...)"
                rows="3"
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
                className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-neutral-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-md shadow-purple-600/10 flex items-center justify-center gap-2"
            >
              <Sparkles size={12} />
              Save Journal Entry
            </button>

          </form>
        </div>

        {/* History timeline (Right 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-indigo-400" />
            Previous Reflections
          </h3>

          {logs.length > 0 ? (
            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2">
              {logs.map((log) => {
                const currentMoodObj = moodEmojis.find(m => m.value === log.mood);
                return (
                  <div key={log.id} className="glassmorphism border border-neutral-800/80 p-5 rounded-2xl shadow-md space-y-4">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Calendar size={12} className="text-neutral-500" />
                        <span>{log.date}</span>
                      </div>
                      
                      {currentMoodObj && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold">
                          <span>{currentMoodObj.label}</span>
                          <span>{currentMoodObj.text}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Daily Notes</span>
                        <p className="text-neutral-300 leading-relaxed bg-neutral-950/40 p-3 rounded-xl border border-neutral-900">
                          {log.notes}
                        </p>
                      </div>
                      
                      {log.reflections && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Progress reflections</span>
                          <p className="text-neutral-300 leading-relaxed bg-neutral-950/40 p-3 rounded-xl border border-neutral-900 italic">
                            "{log.reflections}"
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8">
              <EmptyState
                icon={BookOpen}
                title="No Journal Entries"
                description="Write down your daily activity notes and progress reflections to begin compiling your visual baseline journal."
                actionText="Write reflection log"
                onAction={() => setIsDistractionFree(true)}
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
