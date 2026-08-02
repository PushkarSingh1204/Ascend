// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Resources.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, usePremium } from '../context/AuthContext';
import { getAnalyses } from '../services/db';
import { 
  subscribeToResources, 
  saveResource, 
  deleteResource, 
  updateResourceFlags,
  incrementResourceViews, 
  incrementResourceDownloads,
  getUserBookmarks,
  toggleUserBookmark,
  getUserProgress,
  updateUserProgress
} from '../services/resourcesService';
import Toast from '../components/Toast';
import { Card, Button, Badge } from '../components/DesignSystem';
import EmptyState from '../components/EmptyState';
import PremiumGate from '../components/PremiumGate';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  Sparkles, 
  Lock, 
  Eye, 
  Download, 
  Share2, 
  Star, 
  Clock, 
  FileText, 
  Video, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Flame,
  Sliders,
  ExternalLink,
  Crown
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Facial Harmony',
  'Skincare',
  'Haircare',
  'Beard Growth',
  'Jawline',
  'Mewing',
  'Nutrition',
  'Fitness',
  'Posture',
  'Fashion',
  'Style',
  'Confidence',
  'Sleep',
  'Supplements',
  'Mental Health'
];

const TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'pdf', label: 'PDFs' },
  { id: 'video', label: 'Videos' },
  { id: 'article', label: 'Articles' },
  { id: 'guide', label: 'Guides' },
  { id: 'checklist', label: 'Checklists' }
];

export default function Resources() {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  // Primary State
  const [resources, setResources] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [userProgress, setUserProgressState] = useState({});
  const [latestScan, setLatestScan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, popular, beginner, advanced
  const [activeTab, setActiveTab] = useState('browse'); // browse, bookmarks, progress

  // Modals & Active Selections
  const [selectedResource, setSelectedResource] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Admin Toggle Check
  const isAdmin = Boolean(
    user?.profile?.role === 'admin' || 
    user?.profile?.isAdmin || 
    user?.email?.includes('admin') ||
    user?.email === 'pushkar@ascendgod.com'
  );

  // Admin Form State
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    category: 'Facial Harmony',
    type: 'article',
    difficulty: 'Beginner',
    thumbnail: '',
    contentUrl: '',
    markdownBody: '',
    author: 'Ascend Editorial Team',
    estimatedReadTime: 10,
    tags: 'mewing, jawline',
    premium: false,
    featured: false,
    trending: false,
    status: 'published'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), 4000);
  };

  // REAL-TIME FIRESTORE SYNCHRONIZATION
  useEffect(() => {
    setLoading(true);

    // Load initial auxiliary user data
    Promise.all([getUserBookmarks(), getUserProgress(), getAnalyses()]).then(([bkmks, prog, analyses]) => {
      setBookmarks(Array.isArray(bkmks) ? bkmks : []);
      setUserProgressState(prog || {});
      if (Array.isArray(analyses) && analyses.length > 0) {
        setLatestScan(analyses[0]);
      }
    });

    // Real-time Firestore resources listener
    const unsubscribe = subscribeToResources(
      (data) => {
        setResources(Array.isArray(data) ? data : []);
        setLoading(false);
      },
      (err) => {
        console.error("Resources Firestore subscription error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Toggle Bookmark
  const handleToggleBookmark = async (e, resId) => {
    if (e) e.stopPropagation();
    const updated = await toggleUserBookmark(resId);
    setBookmarks(updated);
    const isBookmarked = updated.includes(resId);
    showToast(
      isBookmarked ? "Resource saved to your bookmarks." : "Resource removed from bookmarks.",
      isBookmarked ? "success" : "info"
    );
  };

  // Open Resource Detail Modal
  const handleOpenDetail = async (res) => {
    setSelectedResource(res);
    incrementResourceViews(res.id);
    
    // Update progress
    const updatedProgress = await updateUserProgress(res.id, {
      completed: true,
      progressPercent: 100
    });
    if (updatedProgress) {
      setUserProgressState(prev => ({ ...prev, [res.id]: updatedProgress }));
    }
  };

  // Quick Admin Flag Toggles
  const handleToggleAdminFlag = async (e, res, flagKey) => {
    if (e) e.stopPropagation();
    try {
      const updatedVal = !res[flagKey];
      await updateResourceFlags(res.id, { [flagKey]: updatedVal });
      showToast(`Updated "${res.title}" ${flagKey} to ${updatedVal}.`, "success");
    } catch (err) {
      showToast(`Failed to update ${flagKey}.`, "error");
    }
  };

  // Admin Form Submit (Create / Edit)
  const handleSaveAdminForm = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formState,
        id: editingResource ? editingResource.id : `res_${Date.now()}`,
        tags: typeof formState.tags === 'string' 
          ? formState.tags.split(',').map(t => t.trim()).filter(Boolean) 
          : formState.tags,
        estimatedReadTime: Number(formState.estimatedReadTime) || 10,
        views: editingResource ? editingResource.views : 0,
        downloads: editingResource ? editingResource.downloads : 0
      };

      await saveResource(payload);
      showToast(editingResource ? "Resource updated successfully." : "New resource published successfully!", "success");
      setAdminModalOpen(false);
      setEditingResource(null);
    } catch (err) {
      showToast("Failed to save resource.", "error");
    }
  };

  // Admin Delete Handler
  const handleDeleteResource = async (resId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteResource(resId);
      showToast("Resource deleted successfully.", "info");
      if (selectedResource?.id === resId) setSelectedResource(null);
    } catch (err) {
      showToast("Failed to delete resource.", "error");
    }
  };

  // Filtered Lists per specifications
  const publishedResources = useMemo(() => {
    return resources.filter(res => isAdmin || res.status === 'published');
  }, [resources, isAdmin]);

  const featuredResources = useMemo(() => {
    return publishedResources.filter(r => r.featured === true);
  }, [publishedResources]);

  const trendingResources = useMemo(() => {
    return publishedResources.filter(r => r.trending === true);
  }, [publishedResources]);

  const aiRecommendedResources = useMemo(() => {
    if (!latestScan || !publishedResources.length) return [];
    const recommendedCategories = [];
    if (latestScan.symmetry_score < 80) recommendedCategories.push('Posture', 'Mewing', 'Facial Harmony');
    if (latestScan.facial_proportion_score < 80) recommendedCategories.push('Jawline', 'Beard Growth');
    recommendedCategories.push('Skincare', 'Nutrition');

    return publishedResources.filter(r => recommendedCategories.includes(r.category)).slice(0, 3);
  }, [latestScan, publishedResources]);

  // Main Filtered & Sorted Engine
  const filteredResources = useMemo(() => {
    return publishedResources.filter(res => {
      // Tab filter
      if (activeTab === 'bookmarks' && !bookmarks.includes(res.id)) return false;
      if (activeTab === 'progress' && !userProgress[res.id]?.completed) return false;

      // Category filter
      if (activeCategory !== 'All' && res.category !== activeCategory) return false;

      // Type filter
      if (activeType !== 'all' && res.type !== activeType) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = res.title.toLowerCase().includes(q);
        const descMatch = res.description.toLowerCase().includes(q);
        const catMatch = res.category.toLowerCase().includes(q);
        const tagMatch = Array.isArray(res.tags) && res.tags.some(t => t.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !catMatch && !tagMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'beginner') return (a.difficulty === 'Beginner' ? -1 : 1);
      if (sortBy === 'advanced') return (a.difficulty === 'Advanced' ? -1 : 1);
      return 0;
    });
  }, [publishedResources, bookmarks, userProgress, activeCategory, activeType, searchQuery, sortBy, activeTab]);

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-6xl mx-auto pb-20">
      
      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      {/* Header & Admin Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">
            Knowledge Vault • Real-Time Firestore Sync
          </span>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Resources & Educational Hub
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Browse science-backed orthotropic protocols, skincare routines, debloating guides, and video masterclasses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin Upload Trigger */}
          <button
            onClick={() => {
              setEditingResource(null);
              setFormState({
                title: '',
                description: '',
                category: 'Facial Harmony',
                type: 'article',
                difficulty: 'Beginner',
                thumbnail: '',
                contentUrl: '',
                markdownBody: '',
                author: 'Ascend Editorial Team',
                estimatedReadTime: 10,
                tags: 'mewing, jawline',
                premium: false,
                featured: false,
                trending: false,
                status: 'published'
              });
              setAdminModalOpen(true);
            }}
            className="btn-primary-v2 text-xs py-2.5 px-4 cursor-pointer"
          >
            <Plus size={16} strokeWidth={2} />
            <span>Upload Resource (Admin)</span>
          </button>
        </div>
      </div>

      {/* FEATURED RESOURCES SHOWCASE (First per specification) */}
      {featuredResources.length > 0 && activeTab === 'browse' && !searchQuery && activeCategory === 'All' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <Star size={16} className="fill-amber-400" />
            <span>Featured Guides</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredResources.slice(0, 2).map(res => (
              <div
                key={res.id}
                onClick={() => handleOpenDetail(res)}
                className="matte-card p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card flex flex-col justify-between space-y-4 cursor-pointer group hover:border-amber-400 transition-all shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold uppercase">
                      ⭐ Featured
                    </span>
                    {res.premium && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-accent font-extrabold uppercase flex items-center gap-1">
                        <Crown size={12} /> PRO
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-foreground group-hover:text-amber-300 transition-colors line-clamp-1">
                    {res.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-border/80">
                  <span className="text-[11px] font-bold text-muted-foreground">{res.category} • {res.estimatedReadTime}m read</span>
                  <span className="font-extrabold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 TRENDING RESOURCES SECTION (Second per specification) */}
      {trendingResources.length > 0 && activeTab === 'browse' && !searchQuery && activeCategory === 'All' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-orange-400">
            <span className="flex items-center gap-2">
              <Flame size={18} className="fill-orange-400 text-orange-400 animate-pulse" />
              🔥 Trending Resources
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">Live Firestore Auto-Sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingResources.map(res => (
              <div 
                key={res.id}
                onClick={() => handleOpenDetail(res)}
                className="matte-card p-4 rounded-2xl border border-orange-500/25 bg-gradient-to-b from-orange-500/5 via-card to-card flex flex-col justify-between space-y-3 cursor-pointer group hover:border-orange-400 transition-all shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-extrabold uppercase">
                      🔥 Trending
                    </span>
                    <span className="text-muted-foreground font-bold">{res.category}</span>
                  </div>
                  <h4 className="text-xs font-black text-foreground group-hover:text-orange-300 transition-colors line-clamp-1">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-[10px]">
                  <span className="text-muted-foreground flex items-center gap-1 font-bold">
                    <Eye size={12} /> {res.views || 0} views
                  </span>
                  <span className="font-extrabold text-orange-400 flex items-center gap-0.5">
                    Open <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Personalized Recommendations Section */}
      {aiRecommendedResources.length > 0 && activeTab === 'browse' && !searchQuery && (
        <Card className="p-6 bg-gradient-to-r from-primary/10 via-card to-card border-primary/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-2">
              <Sparkles size={16} strokeWidth={2} className="text-[#22D3EE]" />
              Recommended For You
            </span>
            <span className="text-[10px] text-muted-foreground bg-[#22D3EE]/10 text-[#22D3EE] px-2.5 py-0.5 rounded-full font-bold">
              Personalized Map
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendedResources.map(res => (
              <div 
                key={res.id} 
                onClick={() => handleOpenDetail(res)}
                className="matte-card p-4 flex flex-col justify-between space-y-3 cursor-pointer group hover:border-[#7C3AED]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider">{res.category}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> {res.estimatedReadTime}m
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-[#22D3EE] transition-colors">{res.title}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{res.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-[10px]">
                  <span className="font-semibold text-emerald-400">Targeted Fix</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    Open <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'browse' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          All Published Resources ({filteredResources.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'bookmarks' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Bookmark size={14} />
          <span>My Bookmarks ({bookmarks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'progress' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <CheckCircle2 size={14} />
          <span>Completed / History</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, mewing, posture, skincare routines..."
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-card border border-border rounded-xl px-3 py-2.5 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="newest">Latest Published</option>
              <option value="popular">Most Popular Views</option>
              <option value="beginner">Beginner Friendly</option>
              <option value="advanced">Advanced Only</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeCategory === cat ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-semibold">Synchronizing Knowledge Vault with Firestore...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <EmptyState 
          title="No Resources Found"
          description="Try broadening your category filter or search query."
          icon={BookOpen}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(res => {
            const isBookmarked = bookmarks.includes(res.id);
            const isLocked = res.premium && !isPremium;

            return (
              <div
                key={res.id}
                onClick={() => handleOpenDetail(res)}
                className="matte-card rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between group hover:border-primary/60 transition-all cursor-pointer relative shadow-lg"
              >
                {/* Thumbnail / Header */}
                <div className="relative h-44 bg-secondary overflow-hidden">
                  {res.thumbnail ? (
                    <img 
                      src={res.thumbnail} 
                      alt={res.title} 
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isLocked ? 'blur-[2px] opacity-70' : ''}`} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-primary/20 to-purple-600/10 text-primary font-black text-xl">
                      {res.category}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                      {res.type}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {res.trending && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/80 text-white text-[10px] font-black uppercase">
                          🔥 Trending
                        </span>
                      )}
                      {res.premium && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-black uppercase flex items-center gap-1">
                          <Crown size={10} /> PRO
                        </span>
                      )}
                      <button
                        onClick={(e) => handleToggleBookmark(e, res.id)}
                        className="w-7 h-7 rounded-full bg-background/80 backdrop-blur-md text-foreground flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Bookmark size={14} className={isBookmarked ? 'fill-primary text-primary' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Lock Icon Overlay if Locked */}
                  {isLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-xs z-10 text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 text-accent flex items-center justify-center mb-1">
                        <Lock size={18} />
                      </div>
                      <span className="text-[11px] font-black text-foreground uppercase tracking-wider">PRO Member Access</span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                      <span className="text-primary font-bold uppercase">{res.category}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {res.estimatedReadTime} min</span>
                    </div>
                    <h3 className="text-sm font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {res.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  {/* Quick Admin Control Bar */}
                  {isAdmin && (
                    <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleToggleAdminFlag(e, res, 'trending')}
                          className={`px-2 py-0.5 rounded cursor-pointer ${res.trending ? 'bg-orange-500/20 text-orange-400' : 'bg-secondary hover:text-foreground'}`}
                          title="Toggle Trending"
                        >
                          🔥
                        </button>
                        <button
                          onClick={(e) => handleToggleAdminFlag(e, res, 'featured')}
                          className={`px-2 py-0.5 rounded cursor-pointer ${res.featured ? 'bg-amber-500/20 text-amber-400' : 'bg-secondary hover:text-foreground'}`}
                          title="Toggle Featured"
                        >
                          ⭐
                        </button>
                        <button
                          onClick={(e) => handleToggleAdminFlag(e, res, 'premium')}
                          className={`px-2 py-0.5 rounded cursor-pointer ${res.premium ? 'bg-primary/20 text-accent' : 'bg-secondary hover:text-foreground'}`}
                          title="Toggle Premium"
                        >
                          ⚡
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingResource(res);
                            setFormState(res);
                            setAdminModalOpen(true);
                          }}
                          className="hover:text-primary cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResource(res.id);
                          }}
                          className="hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Eye size={12} /> {res.views || 0}
                    </span>
                    <span className="font-extrabold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {isLocked ? "Unlock PDF" : "Read Guide"} <ChevronRight size={14} />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* RESOURCE DETAIL MODAL */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest block">
                    {selectedResource.category} • {selectedResource.type}
                  </span>
                  <h2 className="text-xl font-black text-foreground line-clamp-1">{selectedResource.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                {selectedResource.premium && !isPremium ? (
                  <PremiumGate
                    title="Unlock Full Orthotropic Blueprint"
                    description="This is an exclusive Ascend God PRO resource containing advanced video masterclasses, downloadable PDFs, and step-by-step biomechanical exercises."
                    previewContent={
                      <div className="space-y-4">
                        <p className="text-sm font-medium leading-relaxed">{selectedResource.description}</p>
                        <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs">
                          {selectedResource.markdownBody || "Detailed step-by-step instructions locked for PRO members."}
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <>
                    {selectedResource.thumbnail && (
                      <img 
                        src={selectedResource.thumbnail} 
                        alt={selectedResource.title}
                        className="w-full h-64 object-cover rounded-2xl border border-border"
                      />
                    )}

                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {selectedResource.description}
                      </p>

                      {/* Content Body / Markdown */}
                      <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-4 text-xs leading-relaxed font-sans text-foreground whitespace-pre-line">
                        {selectedResource.markdownBody || selectedResource.description}
                      </div>

                      {/* Content Link if External */}
                      {selectedResource.contentUrl && (
                        <div className="pt-2">
                          <a
                            href={selectedResource.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary-v2 inline-flex items-center gap-2 text-xs py-3 px-6 rounded-xl"
                          >
                            <ExternalLink size={14} />
                            <span>Access Full Document / Video Link</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border bg-secondary/30 flex justify-between items-center text-xs text-muted-foreground">
                <span>Author: {selectedResource.author || "Ascend Team"}</span>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="btn-secondary-v2 text-xs py-2 px-5 rounded-xl cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN EDIT / CREATE MODAL */}
      <AnimatePresence>
        {adminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl max-h-[90vh] bg-card border border-border rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-black text-foreground">
                  {editingResource ? "Edit Resource (Admin)" : "Publish New Resource (Admin)"}
                </h3>
                <button 
                  onClick={() => setAdminModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveAdminForm} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="font-bold text-muted-foreground uppercase block mb-1">Resource Title</label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={e => setFormState({ ...formState, title: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-foreground outline-none focus:border-primary"
                    placeholder="e.g. Masseter Muscle Hypertrophy Protocol"
                  />
                </div>

                <div>
                  <label className="font-bold text-muted-foreground uppercase block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    required
                    value={formState.description}
                    onChange={e => setFormState({ ...formState, description: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-muted-foreground uppercase block mb-1">Category</label>
                    <select
                      value={formState.category}
                      onChange={e => setFormState({ ...formState, category: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl p-3 text-foreground outline-none focus:border-primary"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-muted-foreground uppercase block mb-1">Status</label>
                    <select
                      value={formState.status}
                      onChange={e => setFormState({ ...formState, status: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl p-3 text-foreground outline-none focus:border-primary"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.trending}
                      onChange={e => setFormState({ ...formState, trending: e.target.checked })}
                    />
                    <span>🔥 Trending</span>
                  </label>

                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.featured}
                      onChange={e => setFormState({ ...formState, featured: e.target.checked })}
                    />
                    <span>⭐ Featured</span>
                  </label>

                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formState.premium}
                      onChange={e => setFormState({ ...formState, premium: e.target.checked })}
                    />
                    <span>⚡ PRO Only</span>
                  </label>
                </div>

                <div>
                  <label className="font-bold text-muted-foreground uppercase block mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={formState.thumbnail}
                    onChange={e => setFormState({ ...formState, thumbnail: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-foreground outline-none focus:border-primary"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="font-bold text-muted-foreground uppercase block mb-1">Content URL / Document Link</label>
                  <input
                    type="text"
                    value={formState.contentUrl}
                    onChange={e => setFormState({ ...formState, contentUrl: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-foreground outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="font-bold text-muted-foreground uppercase block mb-1">Markdown Body Content</label>
                  <textarea
                    rows={5}
                    value={formState.markdownBody}
                    onChange={e => setFormState({ ...formState, markdownBody: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-foreground outline-none focus:border-primary font-mono text-xs"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAdminModalOpen(false)}
                    className="btn-secondary-v2 text-xs py-2.5 px-5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-v2 text-xs py-2.5 px-6 rounded-xl cursor-pointer"
                  >
                    Save & Sync Firestore
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
