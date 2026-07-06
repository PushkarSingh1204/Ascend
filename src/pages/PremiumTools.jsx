// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\PremiumTools.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const isPremium = user?.profile?.is_premium;

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
    }, 2000);
  };

  // Get Aging Description
  const getAgingDescription = (age) => {
    if (age <= 30) return 'Peak cellular elasticity. Defined subcutaneous volume and tight mandibular outline.';
    if (age <= 45) return 'Initial loss of mid-face collagen. Slight depth accentuation around nasolabial creases.';
    if (age <= 60) return 'Moderate orbital volume fat redistribution. Jawline softens slightly, orbital tissue expands.';
    return 'Redistributed cheek volume. Submental fold elasticity relaxes, deep expressions settle.';
  };

  const unlockPremium = () => {
    navigate('/payments');
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2 flex items-center gap-2">
            Premium Transformation Tools
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
              Plus
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Interactive simulators and structural guidance to refine your style, camera techniques, and longevity.
          </p>
        </div>

        {!isPremium && (
          <button
            onClick={unlockPremium}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-foreground bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10"
          >
            <Lock size={12} />
            Unlock All with Ascend Plus
          </button>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
        {[
          { id: 'photo_coach', label: '📸 Photo Coach', icon: Camera },
          { id: 'outfit_sim', label: '👕 Outfit Match', icon: Layers },
          { id: 'hair_sim', label: '💇‍♂️ Hair Color', icon: Sliders },
          { id: 'celeb_match', label: '👥 Celeb Match', icon: UserCheck },
          { id: 'aging_sim', label: '⏳ Aging Slider', icon: Hourglass }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTool(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${activeTool === tab.id ? 'bg-indigo-600 text-foreground' : 'bg-card text-muted-foreground hover:bg-neutral-850 hover:text-foreground'}`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Gated content warning */}
      {!isPremium && activeTool !== 'photo_coach' && (
        <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Lock className="text-indigo-400 mt-0.5 shrink-0" size={18} />
            <div>
              <h4 className="text-sm font-bold text-foreground">Ascend Plus Tool</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                This simulator uses advanced structural models. Subscribe to Ascend Plus to unlock unlimited tests.
              </p>
            </div>
          </div>
          <button
            onClick={unlockPremium}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors shrink-0"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* Tab Contents */}
      <div className={`transition-all duration-300 ${(!isPremium && activeTool !== 'photo_coach') ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
        
        {/* 1. PHOTO COACH */}
        {activeTool === 'photo_coach' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 glassmorphism p-6 rounded-2xl border border-border flex flex-col justify-between items-center text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-left w-full mb-4">
                Upload Target Photo
              </span>
              <div className="w-full aspect-square rounded-xl bg-background/80 border border-border flex flex-col items-center justify-center p-6 text-center border-dashed">
                <Sun className="text-indigo-500/30 mb-3 animate-pulse" size={32} />
                <span className="text-xs font-bold text-foreground">Front or 3/4 Profile</span>
                <span className="text-[10px] text-muted-foreground mt-1">Natural diffused indoor light</span>
                <button
                  onClick={triggerPhotoCoach}
                  disabled={isAnalyzingPhoto}
                  className="mt-6 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border hover:border-neutral-750 text-foreground transition-colors"
                >
                  {isAnalyzingPhoto ? 'Analyzing...' : 'Simulate Analysis'}
                </button>
              </div>
            </div>

            <div className="md:col-span-3 glassmorphism p-6 rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                  <Camera size={16} className="text-blue-400" />
                  Photo Coach Feedback
                </h3>

                {photoFeedback ? (
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center bg-background/40 p-3.5 rounded-xl border border-border">
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Composition Score</span>
                        <span className="text-sm font-black text-emerald-400 block mt-0.5">{photoFeedback.score}/100</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Ready for Scan
                      </span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed">
                      <div>
                        <strong className="text-blue-400 block text-[10px] uppercase tracking-wider mb-0.5">Lighting Check</strong>
                        <p className="text-foreground">{photoFeedback.lighting}</p>
                      </div>
                      <div>
                        <strong className="text-indigo-400 block text-[10px] uppercase tracking-wider mb-0.5">Angle Alignment</strong>
                        <p className="text-foreground">{photoFeedback.angle}</p>
                      </div>
                      <div>
                        <strong className="text-purple-400 block text-[10px] uppercase tracking-wider mb-1">Grooming Prep Tips</strong>
                        <ul className="space-y-1.5 text-muted-foreground">
                          {photoFeedback.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check size={12} className="text-purple-500 mt-0.5 shrink-0" />
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
            </div>
          </div>
        )}

        {/* 2. OUTFIT SIMULATOR */}
        {activeTool === 'outfit_sim' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 glassmorphism p-6 rounded-2xl border border-border space-y-4">
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
                    className={`p-4 rounded-xl text-xs font-bold border text-center transition-all flex flex-col items-center justify-center gap-2 ${selectedOutfit === style.id ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-card border-neutral-855 hover:border-neutral-750 text-muted-foreground'}`}
                  >
                    <span className="text-xl">{style.emoji}</span>
                    <span>{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 glassmorphism p-6 rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                  <Layers size={16} className="text-indigo-400" />
                  Color & Neckline Analysis
                </h3>

                {outfitFeedback ? (
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center bg-background/40 p-3.5 rounded-xl border border-border">
                      <div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase block">Facial Frame Match</span>
                        <span className="text-sm font-black text-indigo-400 block mt-0.5">{outfitFeedback.score}/100</span>
                      </div>
                      <span className="text-[9px] font-bold text-primary bg-indigo-500/10 px-2 py-0.5 rounded-full border border-primary/20">
                        {outfitFeedback.score >= 90 ? 'Ideal Frame' : 'Acceptable'}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed">
                      <div>
                        <strong className="text-indigo-405 block text-[10px] uppercase tracking-wider mb-0.5">Symmetry Harmony</strong>
                        <p className="text-foreground">{outfitFeedback.harmony}</p>
                      </div>
                      <div>
                        <strong className="text-purple-400 block text-[10px] uppercase tracking-wider mb-1">Frame Hacks</strong>
                        <ul className="space-y-1.5 text-neutral-450">
                          {outfitFeedback.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check size={12} className="text-indigo-400 mt-0.5 shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-xs text-neutral-505 italic">
                    Select a style from the left to run matching simulations.
                  </div>
                )}
              </div>
              <p className="text-[9px] text-muted-foreground border-t border-neutral-905 pt-3 mt-4">
                * Wardrobe contrast tuning increases facial tone clarity and balances jaw geometry.
              </p>
            </div>
          </div>
        )}

        {/* 3. HAIR COLOR SIMULATOR */}
        {activeTool === 'hair_sim' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 glassmorphism p-6 rounded-2xl border border-border space-y-4">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                Select Hair Tint
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'black', label: 'Deep Black', color: 'bg-background' },
                  { id: 'brown', label: 'Warm Brown', color: 'bg-amber-900' },
                  { id: 'blonde', label: 'Golden Blonde', color: 'bg-amber-300' },
                  { id: 'platinum', label: 'Platinum Silver', color: 'bg-neutral-300' }
                ].map(hair => (
                  <button
                    key={hair.id}
                    onClick={() => setSelectedHairColor(hair.id)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-3 transition-colors ${selectedHairColor === hair.id ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-card border-border hover:border-neutral-750 text-muted-foreground'}`}
                  >
                    <span className={`w-5 h-5 rounded-full border border-white/20 shrink-0 ${hair.color}`}></span>
                    <span>{hair.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 glassmorphism p-6 rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                  <Sliders size={16} className="text-blue-400" />
                  Color Undertone Suggestions
                </h3>

                <div className="space-y-4 mt-4 text-xs leading-relaxed">
                  {selectedHairColor === 'black' && (
                    <>
                      <p className="text-foreground">
                        <strong>Deep Black:</strong> Emphasizes cool and olive undertones. Strong dark-contrast values define the brow border and hairline boundary sharply.
                      </p>
                      <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        Recommended for high-contrast profiles
                      </span>
                    </>
                  )}
                  {selectedHairColor === 'brown' && (
                    <>
                      <p className="text-foreground">
                        <strong>Warm Brown:</strong> Softens strong facial features. Creates a friendly, balanced vertical dimension. Perfect for neutralizing reddish skin blemishes.
                      </p>
                      <span className="inline-block text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                        Highly versatile
                      </span>
                    </>
                  )}
                  {selectedHairColor === 'blonde' && (
                    <>
                      <p className="text-foreground">
                        <strong>Golden Blonde:</strong> Highlights warm tones. Drawbacks include washing out pale skin configurations. Perfect for medium-toned honey skin profiles.
                      </p>
                      <span className="inline-block text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full">
                        Warm undertone exclusive
                      </span>
                    </>
                  )}
                  {selectedHairColor === 'platinum' && (
                    <>
                      <p className="text-foreground">
                        <strong>Platinum Silver:</strong> High styling index. Strips warm glare, emphasizing cool skin paleness and bringing intense eyes into prominence.
                      </p>
                      <span className="inline-block text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                        Extreme maintenance required
                      </span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground border-t border-border pt-3 mt-4">
                * Select style tones that maintain or elevate your natural eye-hair contrast level.
              </p>
            </div>
          </div>
        )}

        {/* 4. CELEBRITY MATCH */}
        {activeTool === 'celeb_match' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 glassmorphism p-6 rounded-2xl border border-border flex flex-col justify-between items-center text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-left w-full mb-4">
                Similarity Engine
              </span>
              <div className="w-full aspect-square rounded-xl bg-background/85 border border-border flex flex-col items-center justify-center p-6 text-center border-dashed">
                <UserCheck className="text-purple-500/30 mb-3 animate-pulse" size={32} />
                <span className="text-xs font-bold text-foreground">Compare Facial Thirds</span>
                <span className="text-[10px] text-muted-foreground mt-1">Scans 478 points against database</span>
                <button
                  onClick={triggerCelebScan}
                  disabled={isScanningCeleb}
                  className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-foreground transition-colors"
                >
                  {isScanningCeleb ? 'Comparing meshes...' : 'Scan Matches'}
                </button>
              </div>
            </div>

            <div className="md:col-span-3 glassmorphism p-6 rounded-2xl border border-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" />
                  Top Celebrity Matches
                </h3>

                {celebMatches ? (
                  <div className="space-y-3 mt-4">
                    {celebMatches.map((match) => (
                      <div key={match.name} className="bg-background/40 p-3 rounded-xl border border-border flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-foreground block">{match.name}</span>
                          <span className="text-[10px] text-muted-foreground block leading-normal">{match.reason}</span>
                        </div>
                        <span className="text-xs font-extrabold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg shrink-0">
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
            </div>
          </div>
        )}

        {/* 5. AGING SLIDER */}
        {activeTool === 'aging_sim' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 glassmorphism p-6 rounded-2xl border border-border flex flex-col justify-between items-center">
              <div className="w-full text-left">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                  Longevity Aging Slider
                </span>
                <span className="text-[10px] text-muted-foreground block">Simulate structural changes</span>
              </div>

              <div className="w-full py-8 space-y-6">
                <div className="text-center">
                  <span className="text-xs font-bold text-muted-foreground">Target Age</span>
                  <div className="text-3xl font-black text-indigo-400 mt-1">{selectedAge} Years</div>
                </div>

                <input
                  type="range"
                  min="20"
                  max="80"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-full bg-card border border-border outline-none appearance-none cursor-pointer accent-indigo-500"
                />

                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>20 years</span>
                  <span>50 years</span>
                  <span>80 years</span>
                </div>
              </div>
              <div></div>
            </div>

            <div className="md:col-span-3 glassmorphism p-6 rounded-2xl border border-border flex flex-col justify-between min-h-[260px]">
              <div>
                <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                  <Hourglass size={16} className="text-amber-400" />
                  Structural Facial Shift Analysis
                </h3>

                <div className="space-y-4 mt-4">
                  <div className="bg-background/40 p-3.5 rounded-xl border border-border text-xs">
                    <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px] block">Expected Skin Laxity Status</span>
                    <p className="text-foreground mt-1.5 leading-relaxed">{getAgingDescription(selectedAge)}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-2.5">
                    <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={13} />
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      <strong>Habit Shift Guard:</strong> Consistent routines (SPF 30+ daily, proper sleep, back sleeping, nasal breathing) decelerate these structural shifts by up to 25% over a 10-year span.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground border-t border-border pt-3 mt-4">
                * Longevity simulator predictions are mathematical estimations based on tissue degradation coefficients.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
