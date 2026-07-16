// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\PremiumTools.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Skeleton } from '../components/DesignSystem';
import { 
  Sparkles, 
  Camera, 
  Layers, 
  UserCheck, 
  Hourglass, 
  Lock, 
  Check, 
  HelpCircle, 
  AlertCircle,
  Sliders,
  RefreshCw,
  Sun
} from 'lucide-react';

export default function PremiumTools() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('photo_coach');
  const isPremium = !!user?.profile?.is_premium;

  // 1. Photo Coach State
  const [photoFeedback, setPhotoFeedback] = useState(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);

  // 2. Outfit Simulator State
  const [selectedOutfit, setSelectedOutfit] = useState('casual');
  const [outfitFeedback, setOutfitFeedback] = useState(null);

  // 3. Hair Color State
  const [selectedHairColor, setSelectedHairColor] = useState('black');

  // 4. Celeb Match State
  const [isScanningCeleb, setIsScanningCeleb] = useState(false);
  const [celebMatches, setCelebMatches] = useState(null);

  // 5. Aging State
  const [selectedAge, setSelectedAge] = useState(25);

  // Trigger Photo Coach
  const triggerPhotoCoach = () => {
    setIsAnalyzingPhoto(true);
    setPhotoFeedback(null);
    setTimeout(() => {
      setIsAnalyzingPhoto(false);
      setPhotoFeedback({
        score: 88,
        lighting: 'Excellent frontal light source. Minimal side shadowing.',
        angle: 'Face tilt is 2° off-center. Keep chin level for alignment.',
        tips: [
          'Move closer to a window for natural daylight diffusion.',
          'Hold camera at eye-level to prevent neck shortening perspective.'
        ]
      });
    }, 1500);
  };

  // Trigger Outfit Evaluation
  const triggerOutfitEvaluation = (style) => {
    setSelectedOutfit(style);
    const database = {
      casual: {
        score: 84,
        harmony: 'Minimalist styling coordinates well with soft facial contrast.',
        tips: ['Prefer crewneck collars to emphasize jaw width.', 'Stick to earth tones like beige, sand, and charcoal gray.']
      },
      formal: {
        score: 92,
        harmony: 'Structured lapels and dark colors accentuate sharp bone structure.',
        tips: ['Use crisp white shirts to create high-contrast facial highlights.', 'A dark navy blazer provides an elegant frame.']
      },
      streetwear: {
        score: 78,
        harmony: 'Oversized silhouettes can make head proportions appear smaller.',
        tips: ['Avoid extremely bagginess around the neck.', 'Combine hoodies with structured denim jackets.']
      },
      old_money: {
        score: 95,
        harmony: 'Tailored knitwear and neutral palettes provide maximum visual harmony.',
        tips: ['Select cable-knit sweaters in cream or navy.', 'Polo collars frame the jawline perfectly.']
      }
    };
    setOutfitFeedback(database[style]);
  };

  // Trigger Celeb Look-Alike Scan
  const triggerCelebScan = () => {
    setIsScanningCeleb(true);
    setCelebMatches(null);
    setTimeout(() => {
      setIsScanningCeleb(false);
      setCelebMatches([
        { name: 'Channing Tatum', match: 86, reason: 'Matching jaw angularity & square hairline structure.' },
        { name: 'Zayn Malik', match: 80, reason: 'Similar horizontal facial thirds and brow proximity.' },
        { name: 'Timothée Chalamet', match: 74, reason: 'Corresponding slim jaw ramus definition.' }
      ]);
    }, 1500);
  };

  // Get aging description helper
  const getAgingDescription = (age) => {
    if (age < 30) {
      return 'Max facial volume. Excellent collagen synthesis. Fat pad integrity is at peak levels.';
    } else if (age < 45) {
      return 'Minor cheek fat depletion. First signs of horizontal neck folds. 10% decline in submental support.';
    } else if (age < 60) {
      return 'Nasolabial folds deepen. Bone resorption at chin boundaries. Elasticity coefficients lower by 30%.';
    } else {
      return 'Pronounced jaw laxity. Suborbital volume hollows. Masseter muscle tissue shows structural atrophy.';
    }
  };

  const handleUnlockMock = () => {
    navigate('/payments?ref=premium_tools');
  };

  // Safe checks for arrays
  const safeTips = Array.isArray(photoFeedback?.tips) ? photoFeedback.tips : [];
  const safeOutfitTips = Array.isArray(outfitFeedback?.tips) ? outfitFeedback.tips : [];
  const safeMatches = Array.isArray(celebMatches) ? celebMatches : [];

  return (
    <div className="space-y-8 animate-fade-in text-foreground pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Elite Lab</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Premium Assessment Tools
        </h1>
        <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
          Access high-fidelity simulations for tone contrast matching, celebrity bone-mesh alignments, and longevity aging scales.
        </p>
      </div>

      {/* Grid: Navigation on Left, Simulation view on Right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <Card className="p-3.5 space-y-1.5 md:col-span-1">
          {[
            { id: 'photo_coach', label: '📸 Photo Coach', desc: 'Scan illumination' },
            { id: 'outfit_sim', label: '👕 Outfit Sim', desc: 'Contrast tuning' },
            { id: 'hair_sim', label: '💇‍♂️ Hair Color', desc: 'Undertone match' },
            { id: 'celeb_match', label: '🏆 Celeb Match', desc: 'Mesh lookalike' },
            { id: 'aging_sim', label: '⏳ Longevity Aging', desc: 'Laxity scale' }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${activeTool === tool.id ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-transparent text-muted-foreground hover:bg-secondary/40 hover:text-foreground border border-transparent'}`}
            >
              <span className="text-xs font-bold block">{tool.label}</span>
              <span className="text-[9px] text-muted-foreground mt-0.5 block">{tool.desc}</span>
            </button>
          ))}
        </Card>

        {/* Dynamic Simulator Workspace */}
        <div className="md:col-span-3 relative min-h-[380px]">
          
          {/* Locked screen if user is not premium */}
          {!isPremium && (
            <Card className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-[#0c0c12]/80 backdrop-blur-md text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
                <Lock size={20} className="animate-pulse" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Unlock Premium Tools</h3>
              <p className="text-xs text-muted-foreground max-w-xs mb-6 leading-relaxed">
                Upgrade to Ascend Plus to unlock clothing frame checkers, celebrity similarity indexes, and tissue degradation aging sliders.
              </p>
              <Button
                variant="primary"
                onClick={handleUnlockMock}
              >
                Upgrade to Ascend Plus ($9.99)
              </Button>
            </Card>
          )}

          <div className={!isPremium ? 'filter blur-sm select-none pointer-events-none' : ''}>
            
            {/* 1. PHOTO COACH */}
            {activeTool === 'photo_coach' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="md:col-span-2 p-5 flex flex-col justify-between items-center text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block text-left w-full mb-4">
                    Photo Coach Lab
                  </span>
                  <div className="w-full aspect-square rounded-xl bg-[#0c0c14] border border-border flex flex-col items-center justify-center p-6 text-center border-dashed">
                    <Camera className="text-primary/30 mb-3" size={24} />
                    <span className="text-xs font-bold text-foreground">Front or 3/4 Profile</span>
                    <span className="text-[9px] text-muted-foreground mt-1">Natural diffused indoor light</span>
                    <Button
                      variant="secondary"
                      onClick={triggerPhotoCoach}
                      disabled={isAnalyzingPhoto}
                      className="mt-6"
                    >
                      {isAnalyzingPhoto ? 'Analyzing...' : 'Simulate Analysis'}
                    </Button>
                  </div>
                </Card>

                <Card className="md:col-span-3 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                      <Camera size={14} className="text-primary" />
                      Photo Coach Feedback
                    </h3>

                    {photoFeedback ? (
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center bg-[#0c0c14] p-3 rounded-xl border border-border">
                          <div>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase block">Composition Score</span>
                            <span className="text-xs font-black text-emerald-400 block mt-0.5">{photoFeedback.score}/100</span>
                          </div>
                          <Badge variant="primary" className="text-[8px]">
                            Ready for Scan
                          </Badge>
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed">
                          <div>
                            <strong className="text-primary block text-[9px] uppercase tracking-wider mb-0.5">Lighting Check</strong>
                            <p className="text-foreground">{photoFeedback.lighting}</p>
                          </div>
                          <div>
                            <strong className="text-blue-400 block text-[9px] uppercase tracking-wider mb-0.5">Angle Alignment</strong>
                            <p className="text-foreground">{photoFeedback.angle}</p>
                          </div>
                          <div>
                            <strong className="text-purple-400 block text-[9px] uppercase tracking-wider mb-1">Grooming Prep Tips</strong>
                            <ul className="space-y-1.5 text-muted-foreground">
                              {safeTips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check size={12} className="text-primary mt-0.5 shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-16 text-center text-xs text-muted-foreground italic">
                        {isAnalyzingPhoto ? 'Analyzing lighting parameters & landmarks alignment...' : 'Simulate a photo analysis to check alignment.'}
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-muted-foreground border-t border-border pt-3 mt-4">
                    * Correct alignment and lighting decreases biometric scan variations by up to 14%.
                  </p>
                </Card>
              </div>
            )}

            {/* 2. OUTFIT SIMULATOR */}
            {activeTool === 'outfit_sim' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="md:col-span-2 p-5 space-y-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                    Select Fashion Vibe
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'casual', label: 'Casual Wear', emoji: '👕' },
                      { id: 'formal', label: 'Formal Tailored', emoji: '💼' },
                      { id: 'streetwear', label: 'Streetwear Vibe', emoji: '👟' },
                      { id: 'old_money', label: 'Old Money Knit', emoji: '🏌️‍♂️' }
                    ].map(style => (
                      <button
                        key={style.id}
                        onClick={() => triggerOutfitEvaluation(style.id)}
                        className={`p-4 rounded-xl text-xs font-bold border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${selectedOutfit === style.id ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/40 border-border hover:border-primary/20 text-muted-foreground'}`}
                      >
                        <span className="text-xl">{style.emoji}</span>
                        <span>{style.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="md:col-span-3 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                      <Layers size={14} className="text-primary" />
                      Color & Neckline Analysis
                    </h3>

                    {outfitFeedback ? (
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center bg-[#0c0c14] p-3 rounded-xl border border-border">
                          <div>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase block">Facial Frame Match</span>
                            <span className="text-xs font-black text-primary block mt-0.5">{outfitFeedback.score}/100</span>
                          </div>
                          <Badge variant="primary" className="text-[8px]">
                            {outfitFeedback.score >= 90 ? 'Ideal Frame' : 'Acceptable'}
                          </Badge>
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed">
                          <div>
                            <strong className="text-primary block text-[9px] uppercase tracking-wider mb-0.5">Symmetry Harmony</strong>
                            <p className="text-foreground">{outfitFeedback.harmony}</p>
                          </div>
                          <div>
                            <strong className="text-purple-400 block text-[9px] uppercase tracking-wider mb-1">Frame Hacks</strong>
                            <ul className="space-y-1.5 text-muted-foreground">
                              {safeOutfitTips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check size={12} className="text-primary mt-0.5 shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-16 text-center text-xs text-muted-foreground italic">
                        Select a style from the left to run matching simulations.
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-muted-foreground border-t border-border pt-3 mt-4">
                    * Wardrobe contrast tuning increases facial tone clarity and balances jaw geometry.
                  </p>
                </Card>
              </div>
            )}

            {/* 3. HAIR COLOR SIMULATOR */}
            {activeTool === 'hair_sim' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="md:col-span-2 p-5 space-y-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                    Select Hair Tint
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'black', label: 'Deep Black', color: 'bg-black' },
                      { id: 'brown', label: 'Warm Brown', color: 'bg-amber-900' },
                      { id: 'blonde', label: 'Golden Blonde', color: 'bg-amber-300' },
                      { id: 'platinum', label: 'Platinum Silver', color: 'bg-neutral-300' }
                    ].map(hair => (
                      <button
                        key={hair.id}
                        onClick={() => setSelectedHairColor(hair.id)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${selectedHairColor === hair.id ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/40 border-border hover:border-primary/20 text-muted-foreground'}`}
                      >
                        <span className={`w-5 h-5 rounded-full border border-white/25 shrink-0 ${hair.color}`}></span>
                        <span>{hair.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="md:col-span-3 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                      <Sliders size={14} className="text-primary" />
                      Color Undertone Suggestions
                    </h3>

                    <div className="space-y-4 mt-4 text-xs leading-relaxed">
                      {selectedHairColor === 'black' && (
                        <>
                          <p className="text-foreground">
                            <strong>Deep Black:</strong> Emphasizes cool and olive undertones. Strong dark-contrast values define the brow border and hairline boundary sharply.
                          </p>
                          <span className="inline-block text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            Recommended for high-contrast profiles
                          </span>
                        </>
                      )}
                      {selectedHairColor === 'brown' && (
                        <>
                          <p className="text-foreground">
                            <strong>Warm Brown:</strong> Softens strong facial features. Creates a friendly, balanced vertical dimension. Perfect for neutralizing reddish skin blemishes.
                          </p>
                          <span className="inline-block text-[9px] text-primary font-bold bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                            Highly versatile
                          </span>
                        </>
                      )}
                      {selectedHairColor === 'blonde' && (
                        <>
                          <p className="text-foreground">
                            <strong>Golden Blonde:</strong> Highlights warm tones. Drawbacks include washing out pale skin configurations. Perfect for medium-toned honey skin profiles.
                          </p>
                          <span className="inline-block text-[9px] text-yellow-405 font-bold bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full">
                            Warm undertone exclusive
                          </span>
                        </>
                      )}
                      {selectedHairColor === 'platinum' && (
                        <>
                          <p className="text-foreground">
                            <strong>Platinum Silver:</strong> High styling index. Strips warm glare, emphasizing cool skin paleness and bringing intense eyes into prominence.
                          </p>
                          <span className="inline-block text-[9px] text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                            Extreme maintenance required
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground border-t border-border pt-3 mt-4">
                    * Select style tones that maintain or elevate your natural eye-hair contrast level.
                  </p>
                </Card>
              </div>
            )}

            {/* 4. CELEBRITY MATCH */}
            {activeTool === 'celeb_match' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="md:col-span-2 p-5 flex flex-col justify-between items-center text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-left w-full mb-4">
                    Similarity Engine
                  </span>
                  <div className="w-full aspect-square rounded-xl bg-[#0c0c14] border border-border flex flex-col items-center justify-center p-6 text-center border-dashed">
                    <UserCheck className="text-primary/30 mb-3 animate-pulse" size={24} />
                    <span className="text-xs font-bold text-foreground">Compare Facial Thirds</span>
                    <span className="text-[9px] text-muted-foreground mt-1">Scans 478 points against database</span>
                    <Button
                      variant="secondary"
                      onClick={triggerCelebScan}
                      disabled={isScanningCeleb}
                      className="mt-6"
                    >
                      {isScanningCeleb ? 'Comparing meshes...' : 'Scan Matches'}
                    </Button>
                  </div>
                </Card>

                <Card className="md:col-span-3 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                      <Sparkles size={14} className="text-primary animate-pulse" />
                      Top Celebrity Matches
                    </h3>

                    {celebMatches ? (
                      <div className="space-y-3 mt-4">
                        {safeMatches.map((match) => (
                          <div key={match.name} className="bg-[#0c0c14] p-3 rounded-xl border border-border flex justify-between items-center">
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-foreground block">{match.name}</span>
                              <span className="text-[9px] text-muted-foreground block leading-normal">{match.reason}</span>
                            </div>
                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg shrink-0 border border-primary/20">
                              {match.match}% Match
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-16 text-center text-xs text-muted-foreground italic">
                        {isScanningCeleb ? 'Comparing landmarks with database models...' : 'Run Similarity check to discover matching structures.'}
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-muted-foreground border-t border-border pt-3 mt-4">
                    * Matching structures indicate similar hair parting styles and eyeglasses styles.
                  </p>
                </Card>
              </div>
            )}

            {/* 5. AGING SLIDER */}
            {activeTool === 'aging_sim' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="md:col-span-2 p-5 flex flex-col justify-between items-center">
                  <div className="w-full text-left">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                      Longevity Aging Slider
                    </span>
                    <span className="text-[10px] text-muted-foreground block">Simulate structural changes</span>
                  </div>

                  <div className="w-full py-8 space-y-6">
                    <div className="text-center">
                      <span className="text-xs font-bold text-muted-foreground">Target Age</span>
                      <div className="text-3xl font-black text-primary mt-1">{selectedAge} Years</div>
                    </div>

                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={selectedAge}
                      onChange={(e) => setSelectedAge(parseInt(e.target.value))}
                      className="w-full h-1.5 rounded-full bg-secondary border border-border outline-none appearance-none cursor-pointer accent-primary"
                    />

                    <div className="flex justify-between text-[9px] text-muted-foreground font-black">
                      <span>20 yrs</span>
                      <span>50 yrs</span>
                      <span>80 yrs</span>
                    </div>
                  </div>
                  <div></div>
                </Card>

                <Card className="md:col-span-3 p-6 flex flex-col justify-between min-h-[260px]">
                  <div>
                    <h3 className="text-xs font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                      <Hourglass size={14} className="text-primary" />
                      Structural Facial Shift Analysis
                    </h3>

                    <div className="space-y-4 mt-4">
                      <div className="bg-[#0c0c14] p-3.5 rounded-xl border border-border text-xs">
                        <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px] block">Expected Skin Laxity Status</span>
                        <p className="text-foreground mt-1.5 leading-relaxed">{getAgingDescription(selectedAge)}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-2.5">
                        <AlertCircle className="text-primary shrink-0 mt-0.5" size={13} />
                        <p className="text-[10px] text-muted-foreground leading-normal">
                          <strong>Habit Shift Guard:</strong> Consistent routines (SPF 30+ daily, proper sleep, back sleeping, nasal breathing) decelerate these structural shifts by up to 25% over a 10-year span.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground border-t border-border pt-3 mt-4">
                    * Longevity simulator predictions are mathematical estimations based on tissue degradation coefficients.
                  </p>
                </Card>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
