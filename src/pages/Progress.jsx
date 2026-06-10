// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Progress.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getProgressPhotos, addProgressPhoto } from '../services/db';
import ImageSlider from '../components/ImageSlider';
import { Camera, Calendar, PlusCircle, Trash, Sliders, Eye } from 'lucide-react';

export default function Progress() {
  const { addXP } = useGame();
  
  // Gallery and slider states
  const [photos, setPhotos] = useState([]);
  const [beforePhotoIdx, setBeforePhotoIdx] = useState(0);
  const [afterPhotoIdx, setAfterPhotoIdx] = useState(0);

  // Upload modal states
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Load photos on mount
  useEffect(() => {
    const list = getProgressPhotos();
    setPhotos(list || []);
    if (list && list.length > 0) {
      setBeforePhotoIdx(0);
      setAfterPhotoIdx(list.length - 1);
    }
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
    setPhotos(updated);

    // Reward XP
    addXP(100, "Log Weekly Progress Photo");

    // Reset state & close modal
    setSelectedPhoto(null);
    setNotes('');
    setIsUploading(false);
    setAfterPhotoIdx(updated.length - 1);
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

      {/* Chronological Photo Timeline Gallery */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white">Progress Log History</h3>
        
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="glassmorphism border border-neutral-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                <div className="relative aspect-square w-full bg-neutral-950">
                  <img 
                    src={photo.photo_url} 
                    alt={`Week ${photo.week_number}`} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-wider text-white px-2.5 py-1 rounded-full">
                    WEEK {photo.week_number}
                  </span>
                </div>
                
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-neutral-300 leading-normal line-clamp-2 italic">
                    "{photo.notes || 'No description logged.'}"
                  </p>
                  
                  <div className="pt-3 border-t border-neutral-900 flex items-center gap-1.5 text-[10px] text-neutral-500">
                    <Calendar size={12} />
                    <span>Logged: {photo.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-neutral-900 border-dashed rounded-2xl text-center text-xs text-neutral-500">
            No progress photos logged. Set your first visual baseline.
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
