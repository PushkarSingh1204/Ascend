// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Progress.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { getProgressPhotos, addProgressPhoto, deleteProgressPhoto, getJournals, getProfile, BADGES } from '../services/db';
import { uploadProgressPhoto, getOptimizedUrl, validateImageFile } from '../services/cloudinary';
import ImageSlider from '../components/ImageSlider';
import { Camera, Calendar, PlusCircle, Trash, Sliders, RefreshCw, CheckCircle2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';

export default function Progress() {
  const { addXP } = useGame();
  
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
      const list = await getProgressPhotos() || [];
      setPhotos(list);
      if (list.length > 0) {
        setBeforePhotoIdx(0);
        setAfterPhotoIdx(list.length - 1);
      }

      const journals = await getJournals() || [];
      const profile = await getProfile();
      const unlocked = profile?.unlocked_badges || [];
      const joinDate = profile?.join_date || '2026-05-25';

      const photoItems = list.map(p => ({
        id: p.id,
        date: p.date,
        type: 'photo',
        title: `Week ${p.week_number} Photo`,
        notes: p.notes,
        photoUrl: p.photo_url,
        publicId: p.publicId
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

      setPhotos(updated);
      setSuccessAnimation(true);

      // Keep modal open for success animation, then close
      setTimeout(() => {
        setIsUploading(false);
        setSuccessAnimation(false);
        setSelectedPhoto(null);
        setNotes('');
        loadProgressData();
      }, 1500);

    } catch (err) {
      console.error(err);
      if (err.message === "Upload cancelled by user.") {
        setError("Upload was cancelled.");
      } else {
        setError(err.message || 'Photo upload failed. Please verify your connection.');
      }
    } finally {
      setUploadingState(false);
      setCancelUpload(null);
    }
  };

  const handleCloseModal = () => {
    setIsUploading(false);
    setError('');
    setSelectedPhoto(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (cancelUpload) {
      cancelUpload();
      setCancelUpload(null);
    }
  };

  const handleDeletePhoto = async (id, publicId) => {
    try {
      setLoading(true);
      const updated = await deleteProgressPhoto(id, publicId);
      setPhotos(updated);
      await loadProgressData();
    } catch (err) {
      console.error("Delete photo error:", err);
    } finally {
      setLoading(false);
    }
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

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
          <span className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></span>
          <span>Loading Progress logs...</span>
        </div>
      ) : (
        <>
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
                
                {/* Draggable Slider Wrapper */}
                <div className="md:col-span-3 flex justify-center">
                  {beforePhoto && afterPhoto && (
                    <div className="w-full max-w-[340px] aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-2xl relative">
                      <ImageSlider 
                        beforeImage={getOptimizedUrl(beforePhoto.photo_url, 400, 533)} 
                        afterImage={getOptimizedUrl(afterPhoto.photo_url, 400, 533)} 
                      />
                    </div>
                  )}
                </div>

                {/* Selection Panel controls */}
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
                      <span className="absolute -left-10 top-1.5 w-8 h-8 rounded-xl bg-background border border-border flex items-center justify-center text-xs group-hover:border-neutral-500 transition-colors z-10">
                        {item.type === 'photo' ? '📸' : item.type === 'journal' ? '📝' : '🏆'}
                      </span>
                      
                      <div className="glassmorphism p-5 rounded-2xl border border-border shadow-md space-y-4 max-w-2xl bg-card hover:bg-card/85 transition-colors animate-fade-in">
                        
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-sm">{item.title}</span>
                            <span className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground bg-background px-2.5 py-0.5 rounded border border-border">
                              {item.type}
                            </span>
                          </div>
                          <span className="text-muted-foreground">{item.date}</span>
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
                              <p className="text-xs text-muted-foreground leading-normal italic">
                                "{item.notes || 'No description logged.'}"
                              </p>
                              <button
                                onClick={() => handleDeletePhoto(item.id, item.publicId)}
                                className="text-[9px] text-red-400 hover:underline flex items-center gap-1 shrink-0 p-1 cursor-pointer"
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
        </>
      )}

      {/* UPLOAD PROGRESS PHOTO MODAL */}
      {isUploading && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div className="w-full max-w-md glassmorphism p-6 rounded-2xl border border-border relative bg-card text-foreground shadow-2xl">
            {/* Close trigger button */}
            <button
              onClick={handleCloseModal}
              disabled={uploadingState}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-bold disabled:opacity-50 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-foreground mb-2">Log Progress Photo</h3>
            <p className="text-xs text-muted-foreground mb-6">
              For accurate comparison, try to match the same lighting, angle, and camera position as your baseline photo.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-normal">
                {error}
              </div>
            )}

            {successAnimation ? (
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl animate-bounce shadow-lg">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-foreground">Upload Successful!</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Your progress photo has been logged (+100 XP)</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                
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
                        disabled={uploadingState}
                        className="mt-2 text-xs font-semibold text-red-400 hover:underline block mx-auto cursor-pointer disabled:opacity-50"
                      >
                        Clear Selection
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <PlusCircle size={32} className="text-primary" />
                      <span className="text-xs font-bold text-foreground block">Select Photo File</span>
                      <span className="text-[10px] text-muted-foreground">PNG, JPG, or WEBP up to 10MB</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={uploadingState}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Description / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Skin texture is clearer, cheek definition improving."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={uploadingState}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary placeholder-muted-foreground disabled:opacity-50"
                  />
                </div>

                {uploadingState && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>Uploading to Cloudinary...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden border border-border">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
                  >
                    {uploadingState ? 'Cancel Upload' : 'Close'}
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingState || !selectedPhoto}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-primary-foreground bg-primary hover:opacity-90 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {error ? 'Retry Upload' : (uploadingState ? `Uploading (${uploadProgress}%)` : 'Upload & Log (+100 XP)')}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
