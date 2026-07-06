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

    const updated = addProgressPhoto({
      photo_url: selectedPhoto,
      notes
    });

    // Award XP
    addXP(100, "Log Progress Photo Baseline");

    setPhotos(updated);
    setIsUploading(false);
    setSelectedPhoto(null);
    setNotes('');
    setError('');
    loadProgressData();
  };

  const handleDeletePhoto = (id) => {
    // Note: Simple mock delete for safety demo
    const remaining = photos.filter(p => p.id !== id);
    setPhotos(remaining);
    // Reload local state storage trigger
    localStorage.setItem('ascend_photos_gallery', JSON.stringify(remaining));
    loadProgressData();
  };

  const beforePhoto = photos[beforePhotoIdx];
  const afterPhoto = photos[afterPhotoIdx];

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
            Progress Monitor
          </h1>
          <p className="text-sm text-muted-foreground">
            Document visual transformations, slide side-by-side matches, and track your consistency milestones.
          </p>
        </div>
        <button
          onClick={() => setIsUploading(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:opacity-90 transition-colors shadow-lg cursor-pointer"
        >
          <Camera size={14} />
          Upload Photo
        </button>
      </div>

      {/* DRAGGABLE BEFORE/AFTER IMAGE SLIDER SECTION */}
      {photos.length >= 2 ? (
        <section className="glassmorphism p-6 rounded-2xl border border-border bg-card shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sliders size={16} className="text-primary" />
              Interactive Compare Slider
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground">
              DRAG VERTICAL HANDLE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            
            {/* Draggable Slider Wrapper (Takes 3 Columns) */}
            <div className="md:col-span-3 flex justify-center">
              {beforePhoto && afterPhoto && (
                <div className="w-full max-w-[340px] aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-2xl relative">
                  <ImageSlider 
                    beforeImage={beforePhoto.photo_url} 
                    afterImage={afterPhoto.photo_url} 
                  />
                </div>
              )}
            </div>

            {/* Selection Panel controls (Takes 2 Columns) */}
            <div className="md:col-span-2 space-y-4">
              {/* Select Before Image */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Select Baseline (Before)</span>
                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1 border border-border rounded-xl p-1 bg-background">
                  {photos.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setBeforePhotoIdx(idx)}
                      className={`w-full flex justify-between p-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${beforePhotoIdx === idx ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-transparent border border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      <span>Week {p.week_number} Profile</span>
                      <span className="text-[9px] text-muted-foreground">{p.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select After Image */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Select Current (After)</span>
                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1 border border-border rounded-xl p-1 bg-background">
                  {photos.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setAfterPhotoIdx(idx)}
                      className={`w-full flex justify-between p-2 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${afterPhotoIdx === idx ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-transparent border border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      <span>Week {p.week_number} Profile</span>
                      <span className="text-[9px] text-muted-foreground">{p.date}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="glassmorphism p-12 border border-border rounded-2xl text-center space-y-4 bg-card">
          <span className="text-3xl block">📸</span>
          <h3 className="text-lg font-bold text-foreground">Compare Slider Locked</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You need to upload at least **two** progress photos to unlock the side-by-side draggable comparison slider.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsUploading(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:opacity-90 transition-colors shadow-lg cursor-pointer"
            >
              Upload Your First Photo
            </button>
          </div>
        </section>
      )}

      {/* Unified chronological timeline feed */}
      <section className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Transformation Timeline Feed
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            A chronological feed combining progress photos, reflection journals, and badge milestones.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card p-4 rounded-xl border border-border">
          {/* Keyword Search */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Search Text</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keyword..."
              className="w-full text-xs bg-background border border-border focus:border-primary rounded-lg px-3 py-1.5 outline-none text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Type Selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs bg-background border border-border focus:border-primary rounded-lg px-2.5 py-1.5 outline-none text-foreground cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="photo">Photos Only</option>
              <option value="journal">Journals Only</option>
              <option value="badge">Achievements Only</option>
            </select>
          </div>

          {/* Date Selector */}
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

        {filteredTimelineItems.length > 0 ? (
          <div className="relative border-l border-border ml-4 pl-6 space-y-8 py-2">
            {filteredTimelineItems.map((item) => {
              return (
                <div key={item.id} className="relative group">
                  {/* Timeline point indicator icon */}
                  <span className="absolute -left-10 top-1.5 w-8 h-8 rounded-xl bg-background border border-border flex items-center justify-center text-xs group-hover:border-neutral-500 transition-colors z-10">
                    {item.type === 'photo' ? '📸' : item.type === 'journal' ? '📝' : '🏆'}
                  </span>
                  
                  {/* Timeline Card */}
                  <div className="glassmorphism p-5 rounded-2xl border border-border shadow-md space-y-4 max-w-2xl bg-card hover:bg-card/85 transition-colors">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{item.title}</span>
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground bg-background px-2.5 py-0.5 rounded border border-border">
                          {item.type}
                        </span>
                      </div>
                      <span className="text-muted-foreground">{item.date}</span>
                    </div>

                    {/* Photo layout */}
                    {item.type === 'photo' && (
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <img 
                          src={item.photoUrl} 
                          alt="Progress photo" 
                          className="w-24 h-24 rounded-xl object-cover border border-border shrink-0"
                        />
                        <div className="flex-1 flex justify-between items-start">
                          <p className="text-xs text-muted-foreground leading-normal italic">
                            "{item.notes || 'No description logged.'}"
                          </p>
                          <button
                            onClick={() => handleDeletePhoto(item.id)}
                            className="text-[9px] text-red-400 hover:underline flex items-center gap-1 shrink-0 p-1 cursor-pointer"
                          >
                            <Trash size={10} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Journal layout */}
                    {item.type === 'journal' && (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Mood:</span>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px]">
                            {item.mood === 1 ? '😫 Stressed' : item.mood === 2 ? '😒 Low' : item.mood === 3 ? '😐 Neutral' : item.mood === 4 ? '🙂 Good' : '⚡ Focused'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Notes</span>
                            <p className="text-foreground bg-background border border-border p-2.5 rounded-lg leading-relaxed">{item.notes}</p>
                          </div>
                          {item.reflections && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">Reflections</span>
                              <p className="text-muted-foreground bg-background border border-border p-2.5 rounded-lg italic">"{item.reflections}"</p>
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
                          <p className="text-xs font-bold text-yellow-500">"{item.badge.description}"</p>
                          <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1 block">
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
          <div className="w-full max-w-md glassmorphism p-6 rounded-2xl border border-border relative bg-card text-foreground">
            <h3 className="text-lg font-bold text-foreground mb-2">Log Progress Photo</h3>
            <p className="text-xs text-muted-foreground mb-6">
              For accurate comparison, try to match the same lighting, angle, and camera position as your baseline photo.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* Photo Input Selector */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 min-h-[160px] text-center bg-background">
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
                      className="mt-2 text-xs font-semibold text-red-400 hover:underline block mx-auto cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <PlusCircle size={32} className="text-primary" />
                    <span className="text-xs font-bold text-foreground block">Select Photo File</span>
                    <span className="text-[10px] text-muted-foreground">PNG or JPEG up to 5MB</span>
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
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Skin texture is clearer, cheek definition improving."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary placeholder-muted-foreground"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setIsUploading(false); setError(''); setSelectedPhoto(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:opacity-90 transition-colors shadow-lg cursor-pointer"
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
