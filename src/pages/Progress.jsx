// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Progress.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { getProgressPhotos, addProgressPhoto, deleteProgressPhoto, getJournals, getProfile, BADGES } from '../services/db';
import { uploadProgressPhoto, getOptimizedUrl, validateImageFile } from '../services/cloudinary';
import ImageSlider from '../components/ImageSlider';
import { Card, Button, ProgressRing, Badge, Skeleton } from '../components/DesignSystem';
import { Camera, Calendar, PlusCircle, Trash, Sliders, RefreshCw, CheckCircle2, X } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function Progress() {
  const { addXP } = useGame();
  const { user } = useAuth();
  
  // Gallery, slider, and timeline states
  const [photos, setPhotos] = useState([]);
  const [beforePhotoIdx, setBeforePhotoIdx] = useState(0);
  const [afterPhotoIdx, setAfterPhotoIdx] = useState(0);
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTimelineItems = (timelineItems || []).filter(item => {
    if (!item) return false;
    const matchType = filterType === 'all' || item.type === filterType;
    const matchDate = !filterDate || (item.date && item.date.includes(filterDate));
    const matchSearch = !searchQuery || 
      ((item.title || '').toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.reflections && item.reflections.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchType && matchDate && matchSearch;
  });

  // Upload modal states
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [uploadingState, setUploadingState] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cancelUpload, setCancelUpload] = useState(null);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const list = await getProgressPhotos();
      const safeList = Array.isArray(list) ? list : [];
      setPhotos(safeList);
      if (safeList.length > 0) {
        setBeforePhotoIdx(0);
        setAfterPhotoIdx(safeList.length - 1);
      }

      const journals = await getJournals();
      const safeJournals = Array.isArray(journals) ? journals : [];
      const profile = await getProfile();
      const unlocked = profile?.unlocked_badges || [];
      const safeUnlocked = Array.isArray(unlocked) ? unlocked : [];
      const joinDate = profile?.join_date || '2026-05-25';

      const photoItems = safeList.map(p => ({
        id: p.id,
        date: p.date,
        type: 'photo',
        title: `Week ${p.week_number} Photo`,
        notes: p.notes,
        photoUrl: p.photo_url,
        publicId: p.publicId
      }));

      const journalItems = safeJournals.map(j => ({
        id: j.id,
        date: j.date,
        type: 'journal',
        title: `Reflection Journal Entry`,
        notes: j.notes,
        reflections: j.reflections,
        mood: j.mood
      }));

      const badgeItems = safeUnlocked.map((badgeId) => {
        const badge = BADGES.find(b => b.id === badgeId);
        if (!badge) return null;
        let bDate = joinDate;
        if (badgeId === 'journal_entry' && safeJournals.length > 0) {
          bDate = safeJournals[safeJournals.length - 1].date;
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgressData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setError('');
      
      // Clean up previous preview URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message || 'File validation failed.');
      setSelectedPhoto(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPhoto) {
      setError('Please select a photo first.');
      return;
    }

    try {
      setUploadingState(true);
      setError('');
      setUploadProgress(0);
      setSuccessAnimation(false);

      // 1. Upload to Cloudinary using unsigned preset and track progress
      const { promise, cancel } = uploadProgressPhoto(
        selectedPhoto,
        user.uid,
        (percent) => setUploadProgress(percent)
      );

      setCancelUpload(() => cancel);

      const uploadedMetadata = await promise;

      // 2. Save metadata to Firestore
      const updated = await addProgressPhoto(uploadedMetadata, notes);

      // 3. Award XP
      await addXP(100, "Log Progress Photo Baseline");

      // Revoke preview URL to free up memory
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      setSuccessAnimation(true);
      setSelectedPhoto(null);
      setNotes('');
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadingState(false);
        setSuccessAnimation(false);
        loadProgressData();
      }, 1500);

    } catch (err) {
      console.error(err);
      if (err.message === "Upload cancelled by user.") {
        setError("Upload was cancelled.");
      } else {
        setError(err.message || 'Image upload failed. Please try again.');
      }
      setUploadingState(false);
    } finally {
      setCancelUpload(null);
    }
  };

  const handleCancelClick = () => {
    if (cancelUpload) cancelUpload();
    setUploadingState(false);
    setError("Upload cancelled by user.");
  };

  const handleDeletePhoto = async (photoId, publicId) => {
    if (!window.confirm("Are you sure you want to delete this progress photo?")) return;

    try {
      setLoading(true);
      await deleteProgressPhoto(photoId, publicId);
      await loadProgressData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete progress photo.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton variant="rect" height="340px" />
        <Skeleton variant="rect" height="400px" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Visual Tracker</span>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Progress Slider & Log
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Document your physical alignment and log structural checkins. Compare past records using the crossfade slider interface.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsUploading(true)}
        >
          <Camera size={14} className="mr-1 shrink-0" />
          <span>Upload Progress Photo</span>
        </Button>
      </div>

      {/* BEFORE / AFTER PHOTO CROSSFADE COMPARISON SLIDER */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Sliders size={14} className="text-primary" />
          Interactive Crossfade Slider
        </h3>

        {photos.length >= 2 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Left selectors */}
            <Card className="p-5 flex flex-col justify-between space-y-4 lg:col-span-1">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Before Baseline (Left)</label>
                  <select 
                    value={beforePhotoIdx} 
                    onChange={(e) => setBeforePhotoIdx(Number(e.target.value))}
                    className="w-full text-[10px] font-bold bg-secondary/60 border border-border rounded-lg px-2.5 py-2.5 outline-none text-muted-foreground cursor-pointer focus:border-primary"
                  >
                    {photos.map((p, idx) => (
                      <option key={p.id} value={idx}>Week {p.week_number} ({p.date})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">After Progress (Right)</label>
                  <select 
                    value={afterPhotoIdx} 
                    onChange={(e) => setAfterPhotoIdx(Number(e.target.value))}
                    className="w-full text-[10px] font-bold bg-secondary/60 border border-border rounded-lg px-2.5 py-2.5 outline-none text-muted-foreground cursor-pointer focus:border-primary"
                  >
                    {photos.map((p, idx) => (
                      <option key={p.id} value={idx}>Week {p.week_number} ({p.date})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground leading-relaxed bg-secondary/40 border border-border p-3.5 rounded-xl italic">
                * Drag the center handle left and right to transition between selected dates.
              </div>
            </Card>

            {/* Image Slider Wrapper */}
            <div className="lg:col-span-3">
              <ImageSlider 
                beforeImage={photos[beforePhotoIdx] ? getOptimizedUrl(photos[beforePhotoIdx].photo_url) : ''} 
                afterImage={photos[afterPhotoIdx] ? getOptimizedUrl(photos[afterPhotoIdx].photo_url) : ''}
                beforeLabel={photos[beforePhotoIdx] ? `Week ${photos[beforePhotoIdx].week_number}` : 'Week 1'}
                afterLabel={photos[afterPhotoIdx] ? `Week ${photos[afterPhotoIdx].week_number}` : 'Current'}
              />
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Camera}
            title="Comparison Slider Locked"
            description="You need to upload at least two progress photos over separate days to unlock the crossfade comparison slider."
            actionText="Upload First Photo"
            onAction={() => setIsUploading(true)}
          />
        )}
      </section>

      {/* UNIFIED TIMELINE PROGRESS log */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Calendar size={14} className="text-primary" />
          Unified Transformation Timeline
        </h3>

        <Card className="p-6">
          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-border pb-4 mb-6 text-xs">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Search notes</label>
              <input
                type="text"
                placeholder="Type search queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-secondary/40 border border-border focus:border-primary rounded-lg px-2.5 py-1.5 outline-none text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Filter Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full text-xs bg-secondary/40 border border-border focus:border-primary rounded-lg px-2.5 py-1.5 outline-none text-foreground cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="photo">Photos Only</option>
                <option value="journal">Journals Only</option>
                <option value="badge">Achievements Only</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full text-xs bg-secondary/40 border border-border focus:border-primary rounded-lg px-2.5 py-1.5 outline-none text-foreground cursor-pointer"
              />
            </div>
          </div>

          {filteredTimelineItems.length > 0 ? (
            <div className="relative border-l border-border ml-4 pl-6 space-y-6 py-2">
              {filteredTimelineItems.map((item) => {
                return (
                  <div key={item.id} className="relative group">
                    <span className="absolute -left-10 top-1.5 w-8 h-8 rounded-xl bg-secondary/40 border border-border flex items-center justify-center text-xs group-hover:border-primary/30 transition-colors z-10">
                      {item.type === 'photo' ? '📸' : item.type === 'journal' ? '📝' : '🏆'}
                    </span>
                    
                    <div className="bg-secondary/15 p-5 rounded-2xl border border-border shadow-md space-y-4 hover:bg-secondary/20 transition-all animate-fade-in">
                      
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{item.title}</span>
                          <span className="text-[9px] uppercase font-extrabold tracking-widest text-muted-foreground bg-secondary/40 px-2.5 py-0.5 rounded border border-border">
                            {item.type}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-[10px] font-semibold">{item.date}</span>
                      </div>

                      {item.type === 'photo' && (
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          <img 
                            src={getOptimizedUrl(item.photoUrl, 160, 160)} 
                            alt="Progress photo" 
                            className="w-24 h-24 rounded-xl object-cover border border-border shrink-0"
                            loading="lazy"
                          />
                          <div className="flex-1 flex justify-between items-start">
                            <p className="text-xs text-muted-foreground leading-relaxed italic">
                              "{item.notes || 'No description logged.'}"
                            </p>
                            <button
                              onClick={() => handleDeletePhoto(item.id, item.publicId)}
                              className="text-[9px] text-red-400 hover:underline flex items-center gap-1 shrink-0 p-1 cursor-pointer font-bold"
                            >
                              <Trash size={10} />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}

                      {item.type === 'journal' && (
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Mood state:</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[9px]">
                              {item.mood === 1 ? '😫 Stressed' : item.mood === 2 ? '😒 Low' : item.mood === 3 ? '😐 Neutral' : item.mood === 4 ? '🙂 Good' : '⚡ Focused'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Notes</span>
                              <p className="text-foreground bg-secondary/40 border border-border p-3 rounded-xl leading-relaxed">{item.notes}</p>
                            </div>
                            {item.reflections && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Reflections</span>
                                <p className="text-muted-foreground bg-secondary/40 border border-border p-3 rounded-xl italic">"{item.reflections}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {item.type === 'badge' && (
                        <div className="flex items-center gap-4">
                          <span className="text-3xl bg-secondary/50 p-2.5 rounded-2xl border border-border">{item.badge.icon}</span>
                          <div>
                            <p className="text-xs font-black text-foreground">"{item.badge.description}"</p>
                            <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mt-1.5 inline-block uppercase tracking-wider">
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
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              No matching progress timeline entries found. Clear filters or add logs.
            </div>
          )}
        </Card>
      </section>

      {/* UPLOAD PROGRESS PHOTO MODAL */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploadingState && setIsUploading(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md glassmorphism p-6 rounded-2xl relative z-10 bg-card border border-border shadow-2xl flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider">Log progress photo</h3>
                <button 
                  onClick={() => !uploadingState && setIsUploading(false)}
                  disabled={uploadingState}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              {successAnimation ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 size={24} className="stroke-[1.5]" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Upload Complete!</h4>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full inline-block">+100 XP Credited</span>
                </div>
              ) : uploadingState ? (
                <div className="py-8 text-center space-y-4">
                  <span className="text-xs text-muted-foreground block">Uploading to secure Cloudinary storage...</span>
                  <div className="max-w-xs mx-auto space-y-2">
                    <div className="flex justify-between text-[9px] text-muted-foreground font-black">
                      <span>Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
                      <div className="h-full bg-primary" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={handleCancelClick} className="mx-auto">
                    Cancel Upload
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  
                  {/* Photo selection input container */}
                  <div className="flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-xl bg-secondary/15 hover:bg-secondary/25 transition-all text-center">
                    {previewUrl ? (
                      <div className="relative max-h-[140px] rounded-lg overflow-hidden border border-border">
                        <img src={previewUrl} alt="Upload preview" className="max-h-[140px] object-contain" />
                        <button
                          type="button"
                          onClick={() => { setSelectedPhoto(null); setPreviewUrl(null); }}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer py-4 flex flex-col items-center space-y-2 w-full">
                        <Camera size={20} className="text-primary" />
                        <div>
                          <span className="text-xs font-bold text-foreground block">Select Image File</span>
                          <span className="text-[9px] text-muted-foreground mt-0.5 block">JPG, PNG, WEBP limit 10MB</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/jpeg,image/png,image/webp" 
                          onChange={handleFileChange} 
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>

                  {/* Notes description input */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block ml-1">Timeline Notes</label>
                    <textarea
                      placeholder="Add brief details (e.g. skin routine day 4, haircut posture offsets...)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      maxLength={180}
                      className="w-full px-4 py-3 bg-secondary/40 border border-border text-xs rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                    />
                  </div>

                  <Button variant="primary" type="submit" fullWidth disabled={!selectedPhoto}>
                    <span>Complete Upload & Log</span>
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
