// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Community.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { 
  getCommunityPosts, 
  voteOnPost, 
  addCommunityPost, 
  getChallenges, 
  toggleChallenge 
} from '../services/db';
import { 
  MessageSquare, 
  Award, 
  Trophy, 
  Send, 
  Check, 
  ThumbsUp, 
  Flame, 
  Plus, 
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function Community() {
  const { addXP } = useGame();
  
  // Tabs: feed, challenges, leaderboards
  const [activeTab, setActiveTab] = useState('feed');
  
  // Data State
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load community data on mount
  useEffect(() => {
    setPosts(getCommunityPosts());
    setChallenges(getChallenges());
  }, []);

  // Handle Voting
  const handleVote = (postId, category) => {
    const updated = voteOnPost(postId, category);
    setPosts([...updated]);
  };

  // Handle Post Submit
  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Pick a random unsplash face placeholder for the post
      const presets = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80"
      ];
      const randomImg = presets[Math.floor(Math.random() * presets.length)];
      
      const updated = addCommunityPost(newPostText, randomImg);
      setPosts([...updated]);
      setNewPostText('');
      setIsSubmitting(false);

      // Award XP for contributing to community
      addXP(50, "Shared Progress Scan Anonymously");
    }, 800);
  };

  // Toggle Challenge Completion
  const handleToggleChallenge = (challengeId, xpReward) => {
    const updated = toggleChallenge(challengeId);
    setChallenges([...updated]);
    
    // Find the status
    const item = updated.find(c => c.id === challengeId);
    if (item && item.completed) {
      addXP(xpReward, `Completed Challenge: ${item.title}`);
    }
  };

  // Mock Leaderboards Data
  const mockLeaderboard = [
    { rank: 1, name: 'Ascender_Alpha', level: 14, streak: 34, xp: 4500, active: true },
    { rank: 2, name: 'MewingMage', level: 11, streak: 28, xp: 3200, active: false },
    { rank: 3, name: 'PostureKing_4', level: 9, streak: 19, xp: 2600, active: false },
    { rank: 4, name: 'You', level: 8, streak: 7, xp: 2150, active: true, isUser: true },
    { rank: 5, name: 'HydrationHero', level: 6, streak: 12, xp: 1800, active: false }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-2">
          Ascend Community
          <span className="text-xs font-semibold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full">
            Beta
          </span>
        </h1>
        <p className="text-sm text-neutral-400">
          Share transformations anonymously, join focus group challenges, and match consistency scores with peers.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-900">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${activeTab === 'feed' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
        >
          Anonymous Feed
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${activeTab === 'challenges' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
        >
          Transformation Challenges
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${activeTab === 'leaderboard' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
        >
          Consistency Leaderboard
        </button>
      </div>

      {/* TAB CONTENT: ANONYMOUS FEED */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Post Creation Column */}
          <div className="lg:col-span-1 glassmorphism p-5 rounded-2xl border border-neutral-800/80 h-fit space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus size={16} className="text-indigo-400" />
              Share Anonymous Scan
            </h3>
            
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share your grooming milestones or jawline progress notes anonymously..."
                rows="4"
                className="w-full text-xs bg-neutral-950 border border-neutral-850 focus:border-indigo-500 rounded-xl p-3 outline-none text-neutral-250 placeholder-neutral-500 leading-relaxed resize-none focus:ring-1 focus:ring-indigo-500"
              />
              
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/10 rounded-xl text-[10px] text-neutral-400">
                ⚠️ Scans posted will be shared anonymously under a randomized handle. Your personal avatar and real profile will remain completely private.
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newPostText.trim()}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-900 disabled:text-neutral-550 border border-transparent disabled:border-neutral-850 transition-colors flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Posting...' : 'Post Anonymously'}
                <Send size={12} />
              </button>
            </form>
          </div>

          {/* Timeline Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="glassmorphism p-5 rounded-2xl border border-neutral-800/80 space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                    <div>
                      <span className="text-xs font-bold text-white block">{post.username}</span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">Checked-in {post.date}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded-full">
                      Anonymous Member
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {post.notes}
                  </p>

                  <div className="relative rounded-xl overflow-hidden border border-neutral-900 max-h-[220px]">
                    <img 
                      src={post.photo_url} 
                      alt="Anonymous progress" 
                      className="w-full object-cover max-h-[220px]"
                    />
                  </div>

                  {/* Voting Checkmarks */}
                  <div className="border-t border-neutral-900/60 pt-3 flex flex-wrap gap-2.5">
                    {[
                      { key: 'symmetry', label: '🧬 Symmetry Boost', color: 'hover:text-blue-400 hover:bg-blue-500/5 hover:border-blue-500/20' },
                      { key: 'posture', label: '🧍 Good Posture', color: 'hover:text-amber-400 hover:bg-amber-500/5 hover:border-amber-500/20' },
                      { key: 'skincare', label: '🧴 Skin Glow', color: 'hover:text-emerald-400 hover:bg-emerald-500/5 hover:border-emerald-500/20' }
                    ].map(btn => (
                      <button
                        key={btn.key}
                        onClick={() => handleVote(post.id, btn.key)}
                        className={`px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-[10px] font-bold text-neutral-400 transition-all flex items-center gap-1.5 ${btn.color}`}
                      >
                        <span>{btn.label}</span>
                        <span className="text-neutral-500 font-extrabold">({post.votes?.[btn.key] || 0})</span>
                      </button>
                    ))}
                  </div>

                </div>
              ))
            ) : (
              <div className="py-20 text-center text-xs text-neutral-500 italic">
                No transformation cards shared yet. Be the first to share!
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT: FOCUS CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((ch) => (
            <div 
              key={ch.id} 
              className={`glassmorphism p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${ch.completed ? 'border-emerald-500/25 bg-emerald-950/5' : 'border-neutral-800/80'}`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award size={16} className={ch.completed ? 'text-emerald-400' : 'text-indigo-400'} />
                    {ch.title}
                  </h3>
                  <span className="text-[10px] font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    +{ch.xp} XP
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {ch.desc}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-neutral-900/60">
                <span className={`text-[10px] font-bold ${ch.completed ? 'text-emerald-450' : 'text-neutral-500'}`}>
                  {ch.completed ? 'Completed Successfully' : 'Status: In-Progress'}
                </span>
                
                <button
                  onClick={() => handleToggleChallenge(ch.id, ch.xp)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${ch.completed ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-indigo-650 text-white hover:bg-indigo-500'}`}
                >
                  {ch.completed ? 'Complete Again' : 'Mark Completed'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="glassmorphism border border-neutral-800/80 rounded-2xl overflow-hidden">
          
          <div className="p-5 border-b border-neutral-900/80 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy size={16} className="text-amber-400" />
                Consistency Rankings
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Compare check-in consistency averages over the last 30 days.
              </p>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-900">
              <Flame size={12} className="text-amber-500" />
              STREAK FACTOR
            </div>
          </div>

          <div className="divide-y divide-neutral-900/60">
            {mockLeaderboard.map((row) => (
              <div 
                key={row.name} 
                className={`p-4 flex items-center justify-between text-xs transition-colors ${row.isUser ? 'bg-indigo-500/5' : 'hover:bg-neutral-950/20'}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank badge */}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${row.rank === 1 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : row.rank === 2 ? 'bg-neutral-400/10 text-neutral-300 border border-neutral-400/20' : row.rank === 3 ? 'bg-amber-700/10 text-amber-600 border border-amber-700/20' : 'text-neutral-500'}`}>
                    {row.rank}
                  </span>
                  
                  <div>
                    <span className={`font-bold block ${row.isUser ? 'text-indigo-400' : 'text-white'}`}>
                      {row.name} {row.isUser && '(You)'}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">Level {row.level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-550 block">Activity</span>
                    <span className="font-bold text-white block mt-0.5">{row.xp} XP</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-neutral-950 px-3 py-1 rounded-xl border border-neutral-900 shrink-0">
                    <Flame size={13} className="text-amber-500" />
                    <span className="font-extrabold text-neutral-350 text-[10px]">{row.streak} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
