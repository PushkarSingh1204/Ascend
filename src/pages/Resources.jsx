// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Resources.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAnalyses } from '../services/db';
import { 
  getResources, 
  saveResource, 
  deleteResource, 
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
  Sliders,
  ExternalLink
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
    status: 'published'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), 4000);
  };

  // Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [resList, bkmks, prog, analyses] = await Promise.all([
        getResources(),
        getUserBookmarks(),
        getUserProgress(),
        getAnalyses()
      ]);

      setResources(Array.isArray(resList) ? resList : []);
      setBookmarks(Array.isArray(bkmks) ? bkmks : []);
      setUserProgressState(prog || {});
      if (Array.isArray(analyses) && analyses.length > 0) {
        setLatestScan(analyses[0]);
      }
    } catch (err) {
      console.error("Resources page data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isPremiumUser = !!user?.profile?.is_premium;

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
    
    // Update local views state
    setResources(prev => prev.map(r => r.id === res.id ? { ...r, views: (r.views || 0) + 1 } : r));

    // Update progress
    const updatedProgress = await updateUserProgress(res.id, {
      completed: true,
      progressPercent: 100
    });
    if (updatedProgress) {
      setUserProgressState(prev => ({ ...prev, [res.id]: updatedProgress }));
    }
  };

  // Download Handler
  const handleDownload = (e, res) => {
    if (e) e.stopPropagation();
    incrementResourceDownloads(res.id);
    showToast(`Downloading "${res.title}"...`, "success");
    if (res.contentUrl) {
      window.open(res.contentUrl, '_blank');
    }
  };

  // Share Handler
  const handleShare = (e, res) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Resource link copied to clipboard!", "success");
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
      loadData();
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
      loadData();
    } catch (err) {
      showToast("Failed to delete resource.", "error");
    }
  };

  // AI Recommendation Mapping based on user's scan
  const aiRecommendedResources = useMemo(() => {
    if (!latestScan || !resources.length) return [];
    
    // Pick categories based on latest scan scores
    const recommendedCategories = [];
    if (latestScan.symmetry_score < 80) recommendedCategories.push('Posture', 'Mewing', 'Facial Harmony');
    if (latestScan.facial_proportion_score < 80) recommendedCategories.push('Jawline', 'Beard Growth');
    recommendedCategories.push('Skincare', 'Nutrition');

    return resources.filter(r => recommendedCategories.includes(r.category)).slice(0, 3);
  }, [latestScan, resources]);

  // Filter & Search Engine
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
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
  }, [resources, bookmarks, userProgress, activeCategory, activeType, searchQuery, sortBy, activeTab]);

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-6xl mx-auto pb-20">
      
      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">
            Knowledge Vault
          </span>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Resources & Educational Hub
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
            Browse science-backed guides, orthotropic protocols, skincare routines, and video masterclasses.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
                status: 'published'
              });
              setAdminModalOpen(true);
            }}
            className="btn-primary-v2 text-xs py-2.5 px-4"
          >
            <Plus size={16} strokeWidth={2} />
            <span>Upload Resource (Admin)</span>
          </button>
        </div>
      </div>

      {/* AI Personalized Recommendations Section (Dynamic) */}
      {aiRecommendedResources.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-primary/10 via-card to-card border-primary/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-2">
              <Sparkles size={16} strokeWidth={2} className="text-[#22D3EE]" />
              AI Recommended For Your Scan Profile
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
                    <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                      <Clock size={12} /> {res.estimatedReadTime}m
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#F8FAFC] line-clamp-1 group-hover:text-[#22D3EE] transition-colors">{res.title}</h4>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2">{res.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1F2937] text-[10px]">
                  <span className="font-semibold text-[#22C55E]">Targeted Fix</span>
                  <span className="font-bold text-[#7C3AED] flex items-center gap-1">
                    Open <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main Tabs (Browse / Bookmarks / Progress) */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'browse' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          All Educational Resources ({resources.length})
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
          {/* Instant Search Bar */}
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

          {/* Type Filter */}
          <select
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
            className="w-full md:w-44 bg-card border border-border rounded-xl px-3 py-2.5 text-xs text-foreground outline-none cursor-pointer focus:border-primary"
          >
            {TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          {/* Sort By Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-44 bg-card border border-border rounded-xl px-3 py-2.5 text-xs text-foreground outline-none cursor-pointer focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="beginner">Beginner Friendly</option>
            <option value="advanced">Advanced Protocol</option>
          </select>
        </div>

        {/* Popular Search Tags */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
          <span className="font-semibold">Popular Searches:</span>
          {['Mewing', 'Jawline', 'Posture', 'Retinoid', 'Sodium'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2.5 py-0.5 rounded-full bg-secondary border border-border hover:border-primary/50 text-foreground transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* 15 Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/40">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border-bright'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const isBookmarked = bookmarks.includes(res.id);
            const isCompleted = !!userProgress[res.id]?.completed;
            const isLocked = res.premium && !isPremiumUser;

            return (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleOpenDetail(res)}
                className="matte-card p-5 flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden"
              >
                {/* Thumbnail Header */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-background border border-border">
                  <img
                    src={res.thumbnail || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80'}
                    alt={res.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Type Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-white uppercase border border-white/10">
                    {res.type}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleToggleBookmark(e, res.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-colors cursor-pointer ${
                      isBookmarked 
                        ? 'bg-primary text-white border-primary shadow-lg' 
                        : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                    }`}
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark Resource"}
                  >
                    <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
                  </button>

                  {/* Premium Overlay if Locked */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
                      <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center mb-2">
                        <Lock size={18} />
                      </div>
                      <span className="text-xs font-bold text-white">Ascend Plus Resource</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">Click to view preview</span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-bold text-primary uppercase tracking-wider">{res.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-semibold">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        {res.difficulty}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {res.estimatedReadTime} min
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {res.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                {/* Card Footer Info */}
                <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {res.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={12} /> {res.downloads || 0}
                    </span>
                  </div>

                  {isCompleted && (
                    <span className="text-[10px] font-bold text-[#22C55E] flex items-center gap-1 bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> Completed
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No Resources Found"
          description="No educational modules matched your search or category filter. Try clearing filters or searching another topic."
          actionText="Clear Search & Filters"
          onAction={() => {
            setSearchQuery('');
            setActiveCategory('All');
            setActiveType('all');
          }}
        />
      )}

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-2xl max-w-3xl w-full p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto my-8 shadow-2xl"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Resource Hero Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant="indigo">{selectedResource.category}</Badge>
                  <span className="text-muted-foreground uppercase font-bold text-[10px]">{selectedResource.type}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{selectedResource.estimatedReadTime} min read/watch</span>
                </div>

                <h2 className="text-2xl font-black text-foreground">{selectedResource.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedResource.description}</p>
              </div>

              {/* Resource Media View (Video / Image / PDF / Article) */}
              <div className="rounded-xl overflow-hidden border border-border bg-background">
                {selectedResource.type === 'video' ? (
                  <div className="aspect-video w-full">
                    {selectedResource.contentUrl.includes('youtube.com') || selectedResource.contentUrl.includes('youtu.be') ? (
                      <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedResource.contentUrl.split('v=')[1] || ''}`}
                        title={selectedResource.title}
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video controls className="w-full h-full object-cover" src={selectedResource.contentUrl}>
                        Your browser does not support HTML5 video.
                      </video>
                    )}
                  </div>
                ) : (
                  <img
                    src={selectedResource.thumbnail}
                    alt={selectedResource.title}
                    className="w-full h-64 object-cover"
                  />
                )}
              </div>

              {/* Premium Lock Teaser Warning if user is not premium */}
              {selectedResource.premium && !isPremiumUser && (
                <div className="p-5 rounded-xl bg-primary/10 border border-primary/30 space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm">
                    <Lock size={18} />
                    <span>Ascend Plus Premium Resource</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                    You are viewing a 20% free teaser preview. Upgrade to Ascend Plus to unlock the full protocol, downloadable PDF blueprints, and video walkthroughs.
                  </p>
                  <Button variant="primary" onClick={() => navigate('/payments')}>
                    Upgrade to Ascend Plus ($4.99)
                  </Button>
                </div>
              )}

              {/* Markdown Content Body */}
              <div className="prose prose-invert max-w-none text-xs text-foreground space-y-4 pt-4 border-t border-border leading-relaxed whitespace-pre-line">
                {selectedResource.markdownBody || selectedResource.description}
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleToggleBookmark(e, selectedResource.id)}
                    className={`btn-secondary-v2 text-xs py-2 px-4 ${bookmarks.includes(selectedResource.id) ? 'bg-primary/20 text-primary border-primary' : ''}`}
                  >
                    <Bookmark size={14} />
                    <span>{bookmarks.includes(selectedResource.id) ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(e, selectedResource)}
                    className="btn-secondary-v2 text-xs py-2 px-4"
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {selectedResource.contentUrl && (
                    <button
                      onClick={(e) => handleDownload(e, selectedResource)}
                      className="btn-primary-v2 text-xs py-2 px-4"
                    >
                      <Download size={14} />
                      <span>Download File ({selectedResource.downloads || 0})</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditingResource(selectedResource);
                      setFormState({
                        title: selectedResource.title,
                        description: selectedResource.description,
                        category: selectedResource.category,
                        type: selectedResource.type,
                        difficulty: selectedResource.difficulty,
                        thumbnail: selectedResource.thumbnail,
                        contentUrl: selectedResource.contentUrl,
                        markdownBody: selectedResource.markdownBody || '',
                        author: selectedResource.author || 'Ascend Editorial Team',
                        estimatedReadTime: selectedResource.estimatedReadTime || 10,
                        tags: Array.isArray(selectedResource.tags) ? selectedResource.tags.join(', ') : selectedResource.tags || '',
                        premium: !!selectedResource.premium,
                        featured: !!selectedResource.featured,
                        status: selectedResource.status || 'published'
                      });
                      setSelectedResource(null);
                      setAdminModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground"
                    title="Edit Resource (Admin)"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN UPLOAD / EDIT MODAL */}
      <AnimatePresence>
        {adminModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto my-8 shadow-2xl"
            >
              <button
                onClick={() => setAdminModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Admin Management</span>
                <h2 className="text-xl font-bold text-foreground">
                  {editingResource ? 'Edit Educational Resource' : 'Publish New Resource'}
                </h2>
              </div>

              <form onSubmit={handleSaveAdminForm} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={e => setFormState({ ...formState, title: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formState.description}
                    onChange={e => setFormState({ ...formState, description: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground font-bold mb-1">Category</label>
                    <select
                      value={formState.category}
                      onChange={e => setFormState({ ...formState, category: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-bold mb-1">Type</label>
                    <select
                      value={formState.type}
                      onChange={e => setFormState({ ...formState, type: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary"
                    >
                      {TYPES.filter(t => t.id !== 'all').map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground font-bold mb-1">Difficulty</label>
                    <select
                      value={formState.difficulty}
                      onChange={e => setFormState({ ...formState, difficulty: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground font-bold mb-1">Est. Read Time (Mins)</label>
                    <input
                      type="number"
                      value={formState.estimatedReadTime}
                      onChange={e => setFormState({ ...formState, estimatedReadTime: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={formState.thumbnail}
                    onChange={e => setFormState({ ...formState, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Content / Video / PDF Link URL</label>
                  <input
                    type="url"
                    value={formState.contentUrl}
                    onChange={e => setFormState({ ...formState, contentUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or PDF URL"
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-bold mb-1">Markdown Article Body</label>
                  <textarea
                    rows={5}
                    value={formState.markdownBody}
                    onChange={e => setFormState({ ...formState, markdownBody: e.target.value })}
                    placeholder="# Article Title&#10;Detailed breakdown..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:border-primary font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={formState.premium}
                      onChange={e => setFormState({ ...formState, premium: e.target.checked })}
                      className="rounded accent-primary"
                    />
                    <span>Requires Premium (Ascend Plus)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={formState.featured}
                      onChange={e => setFormState({ ...formState, featured: e.target.checked })}
                      className="rounded accent-primary"
                    />
                    <span>Featured Pin</span>
                  </label>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  {editingResource ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteResource(editingResource.id)}
                      className="text-red-400 text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete Resource
                    </button>
                  ) : <div></div>}

                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => setAdminModalOpen(false)}>Cancel</Button>
                    <Button type="submit" variant="primary">
                      {editingResource ? 'Save Changes' : 'Publish Resource'}
                    </Button>
                  </div>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
