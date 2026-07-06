// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Progress.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getProgressPhotos, addProgressPhoto, getJournals, getProfile, BADGES } from '../services/db';
import ImageSlider from '../components/ImageSlider';
import { Camera, Calendar, PlusCircle, Trash, Sliders, Eye, BookOpen, Trophy } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function Progress() {
  const { addXP } = useGame();
  
  // Gallery, slider, and timeline states
  const [photos, setPhotos] = useState([]);
  const [beforePhotoIdx, setBeforePhotoIdx] = useState(0);
  const [afterPhotoIdx, setAfterPhotoIdx] = useState(0);
  const [timelineItems, setTimelineItems] = useState([]);

  // Filters State
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTimelineItems = timelineItems.filter(item => {
    const matchType = filterType === 'all' || item.type === filterType;
    const matchDate = !filterDate || item.date.includes(filterDate);
    const matchSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.reflections && item.reflections.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchType && matchDate && matchSearch;
  });

  // Upload modal states
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const loadProgressData = () => {
    const list = getProgressPhotos() || [];
    setPhotos(list);
    if (list.length > 0) {
      setBeforePhotoIdx(0);
      setAfterPhotoIdx(list.length - 1);
    }

    const journals = getJournals() || [];
    const profile = getProfile();
    const unlocked = profile?.unlocked_badges || [];
    const joinDate = profile?.join_date || '2026-05-25';

    const photoItems = list.map(p => ({
      id: p.id,
      date: p.date,
      type: 'photo',
      title: `Week ${p.week_number} Photo`,
      notes: p.notes,
      photoUrl: p.photo_url
    }));

    const journalItems = journals.map(j => ({
      id: j.id,
      date: j.date,
      type: 'journal',
      title: `Reflection Journal Entry`,
      notes: j.notes,
      reflections: j.reflections,
      mood: j.mood
    }));

    const badgeItems = unlocked.map((badgeId) => {
      const badge = BADGES.find(b => b.id === badgeId);
      if (!badge) return null;
      let bDate = joinDate;
      if (badgeId === 'journal_entry' && journals.length > 0) {
        bDate = journals[journals.length - 1].date;
      } else if (badgeId === 'routine_pioneer') {
        bDate = '2026-06-01';
      } else if (badgeId === 'premium_unlocked') {
        bDate = '2026-06-08';
      }
      return {
        id: `badge_${badgeId}`,
        date: bDate,
        type: 'badge',
        title: `Achievement: ${badge.name}`,
        badge
      };
    }).filter(Boolean);

    const combined = [...photoItems, ...journalItems, ...badgeItems].sort((a, b) => new Date(b.date) - new Date(a.date));
    setTimelineItems(combined);
  };

  // Load photos on mount
  useEffect(() => {
    loadProgressData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedPhoto) {
      setError('Please select a photo first.');
      return;
    }

    // Add progress photo to DB
    const updated = addProgressPhoto(selectedPhoto, notes);
    
    // Reward XP
    addXP(100, "Log Weekly Progress Photo");

    // Reset state & close modal
    setSelectedPhoto(null);
    setNotes('');
    setIsUploading(false);
    
    // Refresh unified timeline data
    loadProgressData();
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Progress Photo Slider
          </h1>
          <p className="text-sm text-neutral-400">
            Compare visual changes over time. Log one photo each week to track your transformation.
          </p>
        </div>
        
        <button
          onClick={() => setIsUploading(true)}
          className="px-5 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/10"
        >
          <Camera size={14} />
          Upload Progress Photo
        </button>
      </div>

      {/* Main Grid: Comparison Slider & Photo Selector */}
      {photos.length >= 2 ? (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Comparison Slider (Left 2 Columns) */}
          <div className="lg:col-span-2 glassmorphism border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sliders size={16} className="text-blue-400" />
              Draggable Before / After Compare
            </h3>
            
            <div className="w-full flex-1 flex items-center justify-center">
              <ImageSlider 
                beforeImage={photos[beforePhotoIdx]?.photo_url}
                afterImage={photos[afterPhotoIdx]?.photo_url}
                beforeLabel={`Week ${photos[beforePhotoIdx]?.week_number} (${photos[beforePhotoIdx]?.date})`}
                afterLabel={`Week ${photos[afterPhotoIdx]?.week_number} (${photos[afterPhotoIdx]?.date})`}
              />
            </div>
            
            <p className="text-center text-[10px] text-neutral-500 italic mt-4">
              Use your mouse or touch screen to drag the center separator bar.
            </p>
          </div>

          {/* Slider Selectors (Right Column) */}
          <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl flex flex-col gap-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye size={16} className="text-indigo-400" />
              Select Compare Weeks
            </h3>

            {/* Before Photo Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Before Photo (Left)</label>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 border border-neutral-900 rounded-xl p-1 bg-neutral-950/40">
                {photos.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setBeforePhotoIdx(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-colors ${beforePhotoIdx === idx ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-transparent border-transparent hover:bg-neutral-900/60 text-neutral-400 hover:text-white'}`}
                  >
                    <span>Week {p.week_number} Profile</span>
                    <span className="text-[10px] text-neutral-500">{p.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* After Photo Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">After Photo (Right)</label>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 border border-neutral-900 rounded-xl p-1 bg-neutral-950/40">
                {photos.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setAfterPhotoIdx(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-colors ${afterPhotoIdx === idx ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-transparent border-transparent hover:bg-neutral-900/60 text-neutral-400 hover:text-white'}`}
                  >
                    <span>Week {p.week_number} Profile</span>
                    <span className="text-[10px] text-neutral-500">{p.date}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="glassmorphism p-12 border border-neutral-800 rounded-2xl text-center space-y-4">
          <span className="text-3xl block">📸</span>
          <h3 className="text-lg font-bold text-white">Compare Slider Locked</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You need to upload at least **two** progress photos to unlock the side-by-side draggable comparison slider.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsUploading(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Upload Your First Photo
            </button>
          </div>
        </section>
      )}

      {/* Unified chronological timeline feed */}
      <section className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-blue-400" />
            Transformation Timeline Feed
          </h3>
          <p className="text-xs text-neutral-400">
            A chronological feed combining progress photos, reflection journals, and badge milestones.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-850">
          {/* Keyword Search */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Search Text</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keyword..."
              className="w-full text-xs bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-lg px-3 py-1.5 outline-none text-white placeholder-neutral-700"
            />
          </div>

          {/* Type Selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-lg px-2.5 py-1.5 outline-none text-white cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="photo">Photos Only</option>
              <option value="journal">Journals Only</option>
              <option value="badge">Achievements Only</option>
            </select>
          </div>

          {/* Date Selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full text-xs bg-neutral-950 border border-neutral-850 focus:border-blue-500 rounded-lg px-2.5 py-1.5 outline-none text-white"
            />
          </div>
        </div>

        {filteredTimelineItems.length > 0 ? (
          <div className="relative border-l border-neutral-800 ml-4 pl-6 space-y-8 py-2">
            {filteredTimelineItems.map((item) => {
              return (
                <div key={item.id} className="relative group">
                  {/* Timeline point indicator icon */}
                  <span className="absolute -left-10 top-1.5 w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-xs group-hover:border-neutral-700 transition-colors">
                    {item.type === 'photo' ? '📸' : item.type === 'journal' ? '📝' : '🏆'}
                  </span>
                  
                  {/* Timeline Card */}
                  <div className="glassmorphism p-5 rounded-2xl border border-neutral-850 shadow-md space-y-4 max-w-2xl bg-neutral-900/30 hover:bg-neutral-900/50 transition-colors">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.title}</span>
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-500 bg-neutral-950 px-2.5 py-0.5 rounded border border-neutral-900">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-neutral-500">{item.date}</span>
                    </div>

                    {/* Photo layout */}
                    {item.type === 'photo' && (
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <img 
                          src={item.photoUrl} 
                          alt="Progress photo" 
                          className="w-24 h-24 rounded-xl object-cover border border-neutral-850 shrink-0"
                        />
                        <p className="text-xs text-neutral-300 leading-normal italic">
                          "{item.notes || 'No description logged.'}"
                        </p>
                      </div>
                    )}

                    {/* Journal layout */}
                    {item.type === 'journal' && (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Mood:</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[10px]">
                            {item.mood === 1 ? '😫 Stressed' : item.mood === 2 ? '😒 Low' : item.mood === 3 ? '😐 Neutral' : item.mood === 4 ? '🙂 Good' : '⚡ Focused'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase">Notes</span>
                            <p className="text-neutral-300 bg-neutral-950/40 border border-neutral-900 p-2.5 rounded-lg leading-relaxed">{item.notes}</p>
                          </div>
                          {item.reflections && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-neutral-500 uppercase">Reflections</span>
                              <p className="text-neutral-400 bg-neutral-950/40 border border-neutral-900 p-2.5 rounded-lg italic">"{item.reflections}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Badge layout */}
                    {item.type === 'badge' && (
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{item.badge.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-yellow-400">"{item.badge.description}"</p>
                          <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest mt-1 block">
                            +{item.badge.xp} XP Bonus Awarded
                          </span>
                        </div>
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
              icon={Calendar}
              title="Empty Timeline Log"
              description="Establish your visual baseline: complete an analysis scan, log a progress photo, or write in your journal."
              actionText="Upload First Photo"
              onAction={() => setIsUploading(true)}
            />
          </div>
        )}
      </section>

      {/* UPLOAD PROGRESS PHOTO MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glassmorphism p-6 rounded-2xl border border-neutral-800 relative">
            <h3 className="text-lg font-bold text-white mb-2">Log Progress Photo</h3>
            <p className="text-xs text-neutral-400 mb-6">
              For accurate comparison, try to match the same lighting, angle, and camera position as your baseline photo.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* Photo Input Selector */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 rounded-xl p-4 min-h-[160px] text-center bg-neutral-950/20">
                {selectedPhoto ? (
                  <div className="relative">
                    <img 
                      src={selectedPhoto} 
                      alt="Uploaded preview" 
                      className="max-h-[140px] rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(null)}
                      className="mt-2 text-xs font-semibold text-red-400 hover:underline block mx-auto"
                    >
                      Clear Selection
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <PlusCircle size={32} className="text-blue-500" />
                    <span className="text-xs font-bold text-white block">Select Photo File</span>
                    <span className="text-[10px] text-neutral-500">PNG or JPEG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Notes input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Skin texture is clearer, cheek definition improving."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-neutral-600"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => { setIsUploading(false); setError(''); setSelectedPhoto(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/10"
                >
                  Upload & Log (+100 XP)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
