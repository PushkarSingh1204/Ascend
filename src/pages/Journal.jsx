// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Journal.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getJournals, addJournalEntry } from '../services/db';
import { BookOpen, Calendar, Sparkles } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function Journal() {
  const { addXP, unlockBadge } = useGame();

  const [logs, setLogs] = useState([]);
  const [mood, setMood] = useState(4); // default 4/5
  const [notes, setNotes] = useState('');
  const [reflections, setReflections] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterMood, setFilterMood] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchJournalLogs = async () => {
    try {
      setLoading(true);
      const data = await getJournals();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalLogs();
  }, []);

  const moodEmojis = [
    { value: 1, label: '😫', text: 'Stressed' },
    { value: 2, label: '😒', text: 'Low' },
    { value: 3, label: '😐', text: 'Neutral' },
    { value: 4, label: '🙂', text: 'Good' },
    { value: 5, label: '⚡', text: 'Focused' }
  ];

  const filteredLogs = logs.filter(log => {
    const matchMood = filterMood === 'all' || log.mood === parseInt(filterMood);
    const matchDate = !filterDate || log.date.includes(filterDate);
    const matchKeyword = !searchKeyword || 
      (log.notes && log.notes.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (log.reflections && log.reflections.toLowerCase().includes(searchKeyword.toLowerCase()));
    
    return matchMood && matchDate && matchKeyword;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes) return;

    try {
      setLoading(true);
      const updated = await addJournalEntry({
        mood: parseInt(mood),
        notes,
        reflections
      });
      
      setLogs(updated);
      
      // Reward Achievements
      await unlockBadge('journal_entry');
      await addXP(100, "Log Daily Reflection Journal");

      // Clear inputs & show success
      setNotes('');
      setReflections('');
      setMood(4);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error("Journal Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isDistractionFree) {
    return (
      <div className="fixed inset-0 z-50 bg-background text-foreground flex flex-col p-6 md:p-12 animate-fade-in">
        <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-between py-6">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Distraction-Free Reflection
            </h2>
            <button
              onClick={() => setIsDistractionFree(false)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3.5 py-2 rounded-xl bg-card border border-border transition-colors cursor-pointer"
            >
              Exit Editor
            </button>
          </div>

          <div className="flex-1 flex flex-col space-y-6">
            {/* Mood Indicator */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">How is your focus/mood?</span>
              <div className="flex justify-between gap-2 max-w-md">
                {moodEmojis.map((emoji) => (
                  <button
                    key={emoji.value}
                    type="button"
                    onClick={() => setMood(emoji.value)}
                    className={`flex-1 flex flex-col items-center py-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${mood === emoji.value ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="text-lg block">{emoji.label}</span>
                    <span className="text-[9px] mt-1 block tracking-tighter">{emoji.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Large Activity notes text area */}
            <div className="flex-1 flex flex-col space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Daily Activity Notes</span>
              <textarea
                placeholder="What did you focus on today? (e.g. Cleanser morning check, correct neck posture maintained, 2.5L water...)"
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 w-full bg-card border border-border rounded-2xl p-6 text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted-foreground font-medium leading-relaxed"
              />
            </div>

            {/* Reflections */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Progress Reflections (Optional)</span>
              <textarea
                placeholder="What changes have you noticed? (e.g. Jawline feels more aligned, sleep quality has increased...)"
                rows="3"
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
                className="w-full bg-card border border-border rounded-2xl p-4 text-xs text-foreground focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted-foreground leading-relaxed"
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border flex justify-end gap-4">
            <button
              onClick={() => {
                setNotes('');
                setReflections('');
                setMood(4);
                setIsDistractionFree(false);
              }}
              type="button"
              className="px-5 py-3 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Clear & Close
            </button>
            <button
              onClick={async (e) => {
                await handleSubmit(e);
                setIsDistractionFree(false);
              }}
              disabled={!notes || loading}
              className={`px-8 py-3 rounded-xl font-bold text-xs text-white transition-all duration-300 cursor-pointer ${notes ? 'bg-primary hover:opacity-90 shadow-lg' : 'bg-secondary border border-border text-muted-foreground cursor-not-allowed'}`}
            >
              Save Reflection Log (+100 XP)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
          Transformation Journal
        </h1>
        <p className="text-sm text-muted-foreground">
          Reflect on daily adjustments, log mental mood indexes, and document physical posture or skin tone shifts.
        </p>
      </div>

      {/* Main Grid: Form on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Entry Form (Left Column) */}
        <div className="glassmorphism border border-border p-6 rounded-2xl shadow-xl h-fit bg-card">
          <h3 className="text-base font-bold text-foreground mb-6 flex items-center justify-between border-b border-border pb-2">
            <span className="flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Write Today's Entry
            </span>
            <button
              type="button"
              onClick={() => setIsDistractionFree(true)}
              className="text-[10px] text-primary hover:underline font-bold border border-primary/20 px-2 py-0.5 rounded bg-primary/5 transition-colors cursor-pointer"
            >
              Full Screen
            </button>
          </h3>

          {isSuccess && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs font-semibold">
              ✓ Log saved to history timeline! (+100 XP awarded)
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mood selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">How is your focus/mood?</label>
              <div className="flex justify-between gap-2">
                {moodEmojis.map((emoji) => (
                  <button
                    key={emoji.value}
                    type="button"
                    onClick={() => setMood(emoji.value)}
                    className={`flex-1 flex flex-col items-center p-2.5 rounded-xl border text-center transition-all duration-200 cursor-pointer ${mood === emoji.value ? 'bg-primary/10 border-primary text-primary font-bold glow-accent' : 'bg-background border-border text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="text-xl block">{emoji.label}</span>
                    <span className="text-[9px] mt-1 block tracking-tighter">{emoji.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Daily Activity Notes</label>
              <textarea
                placeholder="What did you focus on today? (e.g. Cleanser morning check, correct neck posture maintained, 2.5L water...)"
                required
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted-foreground"
              />
            </div>

            {/* Reflections */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Progress Reflections</label>
              <textarea
                placeholder="What changes have you noticed? (e.g. Jawline feels more aligned, sleep quality has increased...)"
                rows="3"
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !notes}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:opacity-90 transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={12} />
              {loading ? 'Saving...' : 'Save Journal Entry'}
            </button>

          </form>
        </div>

        {/* History timeline (Right 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Previous Reflections
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground bg-card border border-border px-2 py-0.5 rounded uppercase tracking-wider">
              {filteredLogs.length} Entries found
            </span>
          </div>

          {/* Advanced Filter grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card p-4 rounded-xl border border-border">
            {/* Search Input */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Search Text</label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Keyword..."
                className="w-full text-xs bg-background border border-border focus:border-primary rounded-lg px-3 py-1.5 outline-none text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Mood selector */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Mood</label>
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="w-full text-xs bg-background border border-border focus:border-primary rounded-lg px-2.5 py-1.5 outline-none text-foreground cursor-pointer"
              >
                <option value="all">All Moods</option>
                <option value="1">😫 Stressed</option>
                <option value="2">😒 Low</option>
                <option value="3">😐 Neutral</option>
                <option value="4">🙂 Good</option>
                <option value="5">⚡ Focused</option>
              </select>
            </div>

            {/* Date filter */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full text-xs bg-background border border-border focus:border-primary rounded-lg px-2.5 py-1.5 outline-none text-foreground"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
              <span className="w-6 h-6 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></span>
              <span>Loading Journals...</span>
            </div>
          ) : filteredLogs.length > 0 ? (
            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 scrollbar-none">
              {filteredLogs.map((log) => {
                const currentMoodObj = moodEmojis.find(m => m.value === log.mood);
                return (
                  <div key={log.id} className="glassmorphism border border-border p-5 rounded-2xl shadow-md space-y-4 bg-card">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-border pb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} className="text-muted-foreground" />
                        <span>{log.date}</span>
                      </div>
                      
                      {currentMoodObj && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">
                          <span>{currentMoodObj.label}</span>
                          <span>{currentMoodObj.text}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Daily Notes</span>
                        <p className="text-foreground leading-relaxed bg-background p-3 rounded-xl border border-border">
                          {log.notes}
                        </p>
                      </div>
                      
                      {log.reflections && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Progress reflections</span>
                          <p className="text-foreground leading-relaxed bg-background p-3 rounded-xl border border-border italic">
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
