// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { Card, Button, Input, Badge, Skeleton } from '../components/DesignSystem';
import { 
  User, 
  Settings, 
  Flame, 
  Calendar, 
  Award, 
  Compass, 
  ShieldCheck,
  CreditCard,
  Bell,
  RefreshCw,
  Sparkles,
  Info,
  Camera
} from 'lucide-react';
import { getProfile, updateProfile } from '../services/db';
import { uploadProfilePhoto, getOptimizedUrl, validateImageFile } from '../services/cloudinary';

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useAuth();
  const { level, streak, longestStreak, daysToAscend } = useGame();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Preferences toggles
  const [morningReminder, setMorningReminder] = useState(true);
  const [nightReminder, setNightReminder] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  
  // Profile information
  const [nameInput, setNameInput] = useState('');
  const [isPlus, setIsPlus] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [cancelAvatarUpload, setCancelAvatarUpload] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setUploadError('');
      
      // Clean up previous preview URL to prevent memory leaks
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreviewUrl(objectUrl);

      setIsUploading(true);
      setUploadProgress(0);

      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onload = (event) => resolve(event.target.result);
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const { promise, cancel } = uploadProfilePhoto(base64Data, user.uid, (percent) => {
        setUploadProgress(percent);
      });

      setCancelAvatarUpload(() => cancel);

      const metadata = await promise;

      const updated = await updateProfile({
        profile_photo_url: metadata.imageUrl,
        profile_photo_public_id: metadata.publicId
      });

      setUser(prev => ({ ...prev, profile: updated }));

      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
        setAvatarPreviewUrl(null);
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      if (err.message === "Upload cancelled by user.") {
        setUploadError("Upload was cancelled.");
      } else {
        setUploadError(err.message || 'Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setCancelAvatarUpload(null);
    }
  };

  const handleCancelAvatar = () => {
    if (cancelAvatarUpload) {
      cancelAvatarUpload();
      setCancelAvatarUpload(null);
    }
    setIsUploading(false);
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
      setAvatarPreviewUrl(null);
    }
  };

  useEffect(() => {
    if (user && user.profile) {
      setIsPlus(!!user.profile.is_premium);
      setNameInput(user.profile.name || '');
      if (user.profile.preferences) {
        setMorningReminder(!!user.profile.preferences.morningReminder);
        setNightReminder(!!user.profile.preferences.nightReminder);
        setWeeklyDigest(!!user.profile.preferences.weeklyDigest);
      }
    }
  }, [user]);

  // Handle immediate re-onboarding trigger if query param present
  useEffect(() => {
    if (searchParams.get('action') === 'reonboard') {
      navigate('/onboarding?re=true');
    }
  }, [searchParams]);

  const handleSavePreferences = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const updated = await updateProfile({
        name: nameInput,
        preferences: {
          morningReminder,
          nightReminder,
          weeklyDigest
        }
      });
      setUser(prev => ({ ...prev, profile: updated }));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Account settings</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Profile Settings
        </h1>
        <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
          Manage your daily reminders, preferences, and Ascend Plus membership status.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Card (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Avatar Profile Box */}
          <Card className="p-6 text-center flex flex-col items-center">
            <div className="relative group w-20 h-20 mb-4">
              {user?.profile?.profile_photo_url ? (
                <img 
                  src={getOptimizedUrl(user.profile.profile_photo_url, 160, 160)} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/10 shadow-lg shadow-primary/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-650 flex items-center justify-center text-white font-black text-3xl shadow-lg border-2 border-white/10">
                  {user?.profile?.name?.substring(0, 2).toUpperCase() || 'TR'}
                </div>
              )}
              
              {/* Camera Trigger Overlay */}
              <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] text-white font-bold cursor-pointer transition-opacity">
                <Camera size={14} className="mb-0.5" />
                <span>EDIT</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {/* Progress Overlay / Cancel Trigger */}
              {isUploading && (
                <button
                  type="button"
                  onClick={handleCancelAvatar}
                  className="absolute inset-0 rounded-full bg-black/80 flex flex-col items-center justify-center text-[9px] text-white font-bold hover:bg-black/90 transition-colors group cursor-pointer"
                  title="Click to cancel upload"
                >
                  <span className="group-hover:hidden flex flex-col items-center">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mb-1"></span>
                    <span>{uploadProgress}%</span>
                  </span>
                  <span className="hidden group-hover:flex flex-col items-center text-red-400">
                    ✕ CANCEL
                  </span>
                </button>
              )}
            </div>
            
            <h2 className="text-lg font-black text-foreground">{user?.profile?.name || 'Transformer'}</h2>
            {uploadError && (
              <span className="text-[10px] font-semibold text-red-400 mt-1 block">
                {uploadError}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block mt-1">
              Member since: {user?.profile?.join_date || 'May 2026'}
            </span>

            {/* Premium tag status */}
            <div className="mt-4 w-full">
              {isPlus ? (
                <div className="py-2.5 px-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="fill-primary/20" />
                  Ascend Plus Active
                </div>
              ) : (
                <div className="py-2.5 px-4 rounded-xl bg-secondary border border-border text-muted-foreground text-xs font-semibold">
                  Free Member Account
                </div>
              )}
            </div>
          </Card>

          {/* Core Stats Shelf */}
          <Card className="p-5 space-y-4">
            <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
              Lifetime stats
            </h3>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Flame size={14} className="text-orange-500" /> Current Streak
                </span>
                <strong className="text-foreground">{streak} days</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award size={14} className="text-yellow-500" /> Longest Streak
                </span>
                <strong className="text-foreground">{longestStreak} days</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-500" /> Days Logged
                </span>
                <strong className="text-foreground">{daysToAscend} days</strong>
              </div>
            </div>
          </Card>

        </div>

        {/* Configurations Forms (Right 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ascend Plus Subscription Promo Card */}
          {!isPlus && (
            <Card className="p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border-primary/25 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-wider">
                  <Sparkles size={10} />
                  <span>Ascend Plus Subscription</span>
                </div>
                <h3 className="text-lg font-black text-foreground tracking-tight">Unlock Unlimited Facial Scans</h3>
                <p className="text-xs text-muted-foreground max-w-md">
                  Upgrade to Ascend Plus for $9.99/mo to unlock unlimited face scans, advanced analytics charts, and premium skincare posture templates.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => navigate('/payments?ref=profile_banner')}
              >
                <CreditCard size={14} className="mr-1 shrink-0" />
                <span>Get Plus ($9.99)</span>
              </Button>
            </Card>
          )}

          {/* Preferences forms */}
          <Card className="p-6">
            <h3 className="text-xs font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-3 uppercase tracking-wider">
              <Settings size={14} className="text-primary" />
              General Preferences
            </h3>

            {isSaved && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs font-semibold">
                ✓ Preferences updated successfully.
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-6">
              {/* Profile Details */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              {/* Interface Theme preferences */}
              <div className="space-y-2.5 pt-4 border-t border-border">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Interface Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: '🌙 Dark' },
                    { id: 'light', label: '☀️ Light' },
                    { id: 'system', label: '💻 System' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${theme === t.id ? 'bg-primary/10 border-primary text-primary shadow-[0_4px_12px_rgba(134,59,255,0.15)]' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification preferences */}
              <div className="space-y-3.5 pt-4 border-t border-border">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1.5">
                  <Bell size={12} className="text-muted-foreground" /> Reminders & Digest Toggles
                </label>
                
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setMorningReminder(!morningReminder)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border text-xs text-left cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-foreground block">Morning Routine Alert</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Send daily morning mewing and cleanse reminder.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${morningReminder ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${morningReminder ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNightReminder(!nightReminder)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border text-xs text-left cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-foreground block">Night Routine Alert</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Send bedtime double-cleanse and posture reminder.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${nightReminder ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${nightReminder ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeeklyDigest(!weeklyDigest)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border text-xs text-left cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-foreground block">Weekly Digest Email</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">Compile sleep, water, and face symmetry progression.</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${weeklyDigest ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${weeklyDigest ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Reset/Re-onboard actions */}
              <div className="space-y-3 pt-4 border-t border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Account Actions</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => navigate('/profile?action=reonboard')}
                    fullWidth
                  >
                    <RefreshCw size={12} className="mr-1 shrink-0" />
                    <span>Reset Focus Area (Re-onboard)</span>
                  </Button>
                </div>
              </div>

              {/* Save changes CTA */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="primary"
                  type="submit"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Settings Preferences'}
                </Button>
              </div>

            </form>
          </Card>

        </div>

      </div>

    </div>
  );
}
