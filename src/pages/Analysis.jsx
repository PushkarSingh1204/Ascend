// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Analysis.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { saveAnalysis, unlockAnalysis, getAnalyses } from '../services/db';
import { analyzeFaceImage, generateTransformationTips } from '../services/mediapipe';
import FaceMeshOverlay from '../components/FaceMeshOverlay';
import EmptyState from '../components/EmptyState';
import { 
  Sparkles, 
  Upload, 
  Camera, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  LineChart as ChartIcon
} from 'lucide-react';

export default function Analysis() {
  const { user } = useAuth();
  const { addXP, unlockBadge } = useGame();
  const navigate = useNavigate();

  // Images state
  const [frontImage, setFrontImage] = useState(null);
  const [sideImage, setSideImage] = useState(null);
  const [frontFile, setFrontFile] = useState(null);
  const [sideFile, setSideFile] = useState(null);

  // Landmarking & results state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [landmarks, setLandmarks] = useState(null);
  const [activeView, setActiveView] = useState('step1'); // step1, step2, step3, step4, step5
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analysesList, setAnalysesList] = useState([]);
  const [compareScanId, setCompareScanId] = useState('');
  const [activeTab, setActiveTab] = useState('suggestions'); // suggestions, comparison
  const [activeRecCategory, setActiveRecCategory] = useState('skincare');
  const [historySortOrder, setHistorySortOrder] = useState('date-desc');

  // Ref elements to measure image sizes for canvas overlay alignment
  const imageRef = useRef(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  // Load analysis list on mount
  useEffect(() => {
    const list = getAnalyses() || [];
    setAnalysesList(list);
    if (list.length > 0) {
      setCurrentAnalysis(list[0]);
      setActiveView('step4');
      if (list.length > 1) {
        setCompareScanId(list[1].id);
      }
    } else {
      setActiveView('step1');
    }
  }, []);

  // Set up resize listener for overlay canvas
  useEffect(() => {
    if (imageRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setImgSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      });
      resizeObserver.observe(imageRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [activeView, frontImage]);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'front') {
        setFrontImage(event.target.result);
        setFrontFile(file);
      } else {
        setSideImage(event.target.result);
        setSideFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = async () => {
    if (!frontImage || !sideImage) return;

    setIsProcessing(true);
    setActiveView('step3');
    
    // Simulate steps of biometric calculations
    const statuses = [
      'Initializing local MediaPipe model...',
      'Locating 478 face mesh coordinates...',
      'Measuring Euclidean left-right coordinate deviations...',
      'Calculating vertical facial thirds balance...',
      'Calculating jaw ramus definition estimates...',
      'Calibrating potential growth scores...'
    ];

    for (let i = 0; i < statuses.length; i++) {
      setProcessStatus(statuses[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Load image inside browser to pass to analyzer
    const imgEl = new Image();
    imgEl.src = frontImage;
    imgEl.onload = async () => {
      try {
        const detection = await analyzeFaceImage(imgEl, false);
        setLandmarks(detection.landmarks);
        
        const tips = generateTransformationTips(detection.scores);
        
        // Save analysis to local DB
        const saved = saveAnalysis({
          front_photo_url: frontImage,
          side_photo_url: sideImage,
          ...detection.scores,
          landmarks_json: detection.landmarks,
          suggestions: tips
        });

        setCurrentAnalysis(saved);
        
        // Refresh list
        const updatedList = getAnalyses() || [];
        setAnalysesList(updatedList);
        if (updatedList.length > 1) {
          setCompareScanId(updatedList[1].id);
        }
        
        // Award initial analysis achievements
        unlockBadge('first_analysis');
        addXP(200, "First Biometric Harmony Scan");
        
        setIsProcessing(false);
        setActiveView('step4');
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
        setActiveView('step1');
      }
    };
  };

  const handleReset = () => {
    setFrontImage(null);
    setSideImage(null);
    setFrontFile(null);
    setSideFile(null);
    setLandmarks(null);
    setActiveView('step1');
  };

  const handleUnlockMock = () => {
    navigate(`/payments?analysisId=${currentAnalysis.id}`);
  };

  const isPremiumUser = user?.profile?.is_premium;
  const isUnlocked = isPremiumUser || currentAnalysis?.is_premium_unlocked;

  // Sorted and filtered analyses list (excluding current scan) for comparison options
  const sortedAnalysesList = [...analysesList].sort((a, b) => {
    if (historySortOrder === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (historySortOrder === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (historySortOrder === 'score-desc') return b.facial_harmony_score - a.facial_harmony_score;
    if (historySortOrder === 'score-asc') return a.facial_harmony_score - b.facial_harmony_score;
    return 0;
  });

  const compareScan = analysesList.find(s => s.id === compareScanId);

  return (
    <div className="space-y-8 animate-fade-in text-neutral-100 max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Facial Harmony Analysis
        </h1>
        <p className="text-sm text-neutral-400">
          Measure structural symmetry and proportion parameters client-side. Complete your routines to unlock your potential.
        </p>
      </div>

      {/* STEP 1: Upload Front Image */}
      {activeView === 'step1' && (
        <section className="space-y-6">
          {/* Medical / Scientific Disclaimer Box */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-3">
            <AlertTriangle className="text-blue-400 mt-0.5 shrink-0" size={16} />
            <p className="text-xs text-neutral-400 leading-normal">
              <strong>Estimate Disclaimer:</strong> All metrics, including Facial Harmony, Symmetry, and Proportion Scores, are automated AI estimates intended for general grooming and posture feedback, and are not medical, scientific, or diagnostic measurements. Photos are processed strictly on your device.
            </p>
          </div>

          <div className="glassmorphism p-6 rounded-2xl flex flex-col items-center justify-center border border-neutral-800/80 min-h-[340px] text-center relative overflow-hidden max-w-xl mx-auto">
            {frontImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img 
                  src={frontImage} 
                  alt="Front view preview" 
                  className="w-full max-h-[240px] object-contain rounded-xl border border-neutral-800"
                />
                <button 
                  onClick={() => { setFrontImage(null); setFrontFile(null); }}
                  className="mt-3 text-xs font-semibold text-red-400 hover:underline"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center space-y-4 w-full h-full py-12 justify-center">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Upload size={22} />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Step 1: Frontal Profile Photo</span>
                  <span className="text-[11px] text-neutral-500 mt-1 block">Click to select (JPG, PNG)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'front')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => setActiveView('step2')}
              disabled={!frontImage}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs text-white transition-all duration-300 flex items-center gap-1.5 ${frontImage ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/10' : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed'}`}
            >
              Next: Side Profile Photo
              <ChevronRight size={14} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: Upload Side Image */}
      {activeView === 'step2' && (
        <section className="space-y-6">
          <div className="glassmorphism p-6 rounded-2xl flex flex-col items-center justify-center border border-neutral-800/80 min-h-[340px] text-center relative overflow-hidden max-w-xl mx-auto">
            {sideImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img 
                  src={sideImage} 
                  alt="Side view preview" 
                  className="w-full max-h-[240px] object-contain rounded-xl border border-neutral-800"
                />
                <button 
                  onClick={() => { setSideImage(null); setSideFile(null); }}
                  className="mt-3 text-xs font-semibold text-red-400 hover:underline"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center space-y-4 w-full h-full py-12 justify-center">
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Upload size={22} />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Step 2: Side Profile Photo</span>
                  <span className="text-[11px] text-neutral-500 mt-1 block">Click to select (JPG, PNG)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'side')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex justify-between items-center max-w-xl mx-auto pt-4">
            <button
              onClick={() => setActiveView('step1')}
              className="px-5 py-3 rounded-xl border border-neutral-850 hover:border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-300 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft size={14} />
              Back
            </button>
            
            <button
              onClick={handleStartAnalysis}
              disabled={!sideImage}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs text-white transition-all duration-300 flex items-center gap-1.5 ${sideImage ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/10' : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed'}`}
            >
              <Sparkles size={14} />
              Start Biometric Analysis
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: Scanning Animation */}
      {activeView === 'step3' && (
        <section className="glassmorphism p-12 rounded-2xl border border-neutral-800 flex flex-col items-center text-center space-y-8 min-h-[380px] justify-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/25 border-t-blue-500 animate-spin flex items-center justify-center relative">
            <div className="absolute inset-2 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin-reverse"></div>
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-lg font-bold text-white">Biometric Scanning In Progress</h3>
            <p className="text-xs text-neutral-400 animate-pulse">{processStatus}</p>
          </div>
        </section>
      )}

      {/* STEP 4: Results Dials Overview */}
      {activeView === 'step4' && currentAnalysis && (
        <section className="space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/40 border border-neutral-800/80 px-5 py-3 rounded-2xl">
            <span className="text-xs font-semibold text-neutral-400">
              Scan completed: {currentAnalysis.date}
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveView('step5')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
              >
                <Sliders size={12} />
                Detailed Report
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-300 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                Scan Again
              </button>
            </div>
          </div>

          {/* Dials Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Facial Harmony', score: currentAnalysis.facial_harmony_score, desc: 'Overall balance metric', color: 'text-blue-400' },
              { name: 'Symmetry Score', score: currentAnalysis.symmetry_score, desc: 'Left-to-right alignment', color: 'text-indigo-400' },
              { name: 'Facial Proportion', score: currentAnalysis.facial_proportion_score, desc: 'Vertical thirds division', color: 'text-purple-400' },
              { name: 'Potential Score', score: currentAnalysis.improvement_potential_score, desc: 'Estimated limit with effort', color: 'text-emerald-400' }
            ].map((metric) => (
              <div key={metric.name} className="glassmorphism p-5 rounded-2xl text-center flex flex-col justify-between border border-neutral-800/80">
                <div>
                  <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">{metric.name}</span>
                  <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                      <circle cx="48" cy="48" r="40" stroke="rgba(59,130,246,0.1)" strokeWidth="6" fill="transparent" />
                      <circle 
                         cx="48" 
                         cy="48" 
                         r="40" 
                         stroke="currentColor" 
                         strokeWidth="6" 
                         fill="transparent" 
                         className={metric.color}
                         strokeDasharray={2 * Math.PI * 40}
                         strokeDashoffset={2 * Math.PI * 40 * (1 - metric.score / 100)}
                      />
                    </svg>
                    <span className="absolute text-xl font-black text-white">{metric.score}%</span>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500 leading-normal block">{metric.desc}</span>
              </div>
            ))}
          </div>

          {/* Biometric Summary Card */}
          <div className="glassmorphism p-6 rounded-2xl border border-neutral-800/80 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-400" />
                  Subjective Biometric Profile
                </h3>
                <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                  Calculated using client-side geometric measurements. Attractiveness is highly subjective and metrics are for entertainment/improvement estimates only.
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Potential Label</span>
                <span className="text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full inline-block mt-1">
                  {currentAnalysis.potential_label || 'MTN (Mid Tier Normal)'}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-300">Transformation Potential</span>
                <span className="text-blue-400">{currentAnalysis.facial_harmony_score}% → {currentAnalysis.improvement_potential_score}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800/80 flex">
                <div 
                  className="bg-blue-500/80 transition-all duration-500" 
                  style={{ width: `${currentAnalysis.facial_harmony_score}%` }}
                ></div>
                <div 
                  className="bg-indigo-500/40 transition-all duration-500" 
                  style={{ width: `${currentAnalysis.improvement_potential_score - currentAnalysis.facial_harmony_score}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Current Harmony: {currentAnalysis.facial_harmony_score}%</span>
                <span>Confidence: {currentAnalysis.confidence_score || 92}%</span>
                <span>Potential: {currentAnalysis.improvement_potential_score}%</span>
              </div>
            </div>
          </div>

          {/* Core Feature Breakdown List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Core Feature Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentAnalysis.features && Object.keys(currentAnalysis.features).length > 0 ? (
                Object.keys(currentAnalysis.features).map((key) => {
                  const feat = currentAnalysis.features[key];
                  const labelMap = {
                    symmetry: 'Facial Symmetry',
                    skin: 'Skin Quality',
                    jawline: 'Jawline Definition',
                    eyes: 'Eye Area Balance',
                    nose: 'Nose Proportion',
                    lips: 'Lips Symmetry',
                    hairline: 'Hairline Contour',
                    posture: 'Neck & Posture',
                    smile: 'Smile Alignment'
                  };
                  const diffColors = {
                    Easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                    Medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
                    Hard: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  };
                  const impColors = {
                    Low: 'text-neutral-500',
                    Medium: 'text-neutral-400',
                    High: 'text-blue-400 font-semibold'
                  };

                  return (
                    <div key={key} className="glassmorphism p-4 rounded-xl border border-neutral-800/80 flex flex-col justify-between space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-white block">{labelMap[key] || key}</span>
                          <span className="text-[10px] text-neutral-500 block mt-0.5">{feat.percentile}</span>
                        </div>
                        <span className="text-xs font-black text-indigo-450 bg-indigo-500/5 border border-indigo-550/20 w-8 h-8 rounded-lg flex items-center justify-center">
                          {feat.grade}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-neutral-900/60">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] ${diffColors[feat.difficulty]}`}>
                          {feat.difficulty}
                        </span>
                        <span className="text-neutral-500">
                          Impact: <span className={impColors[feat.impact]}>{feat.impact}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                ['Symmetry', 'Skin', 'Jawline', 'Eyes', 'Nose', 'Lips', 'Hairline', 'Posture', 'Smile'].map((name) => (
                  <div key={name} className="glassmorphism p-4 rounded-xl border border-neutral-800/80 flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{name}</span>
                    <span className="text-xs font-bold text-neutral-400">80% (Grade B)</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActiveView('step5')}
              className="px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-500/10 flex items-center justify-center gap-1.5 mx-auto"
            >
              Open Detailed Insights & comparisons
              <ChevronRight size={14} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: Detailed Insights & History Comparison */}
      {activeView === 'step5' && currentAnalysis && (
        <section className="space-y-6">
          
          {/* Header Back controls */}
          <div className="flex justify-between items-center bg-neutral-900/40 border border-neutral-800/80 px-5 py-3 rounded-2xl">
            <button
              onClick={() => setActiveView('step4')}
              className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1.5"
            >
              <ChevronLeft size={14} />
              Back to Overview
            </button>
            <span className="text-[10px] font-bold text-neutral-500">REPORT LOG</span>
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-neutral-900">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${activeTab === 'suggestions' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
            >
              Detailed Suggestions
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all ${activeTab === 'comparison' ? 'border-indigo-500 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
            >
              Scan History & comparisons
            </button>
          </div>

          {activeTab === 'suggestions' ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Visual Mesh Card */}
              <div className="lg:col-span-2 glassmorphism p-5 rounded-2xl border border-neutral-800/80 flex flex-col justify-between items-center text-center">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 block w-full text-left">
                  Biometric Mesh Map
                </span>
                <div className="relative rounded-xl overflow-hidden border border-neutral-800 w-full max-w-[280px] aspect-square bg-neutral-950 flex items-center justify-center">
                  <img 
                    ref={imageRef}
                    src={currentAnalysis.front_photo_url} 
                    alt="Symmetry scan" 
                    className="w-full h-full object-cover"
                  />
                  {currentAnalysis.landmarks_json && (
                    <FaceMeshOverlay 
                      landmarks={currentAnalysis.landmarks_json} 
                      width={imgSize.width} 
                      height={imgSize.height}
                    />
                  )}
                </div>
                <span className="text-[10px] text-neutral-500 italic mt-3 block">
                  Biometric mapping of 478 points.
                </span>
              </div>

              {/* Suggestions Panel (Locked if not premium) */}
              <div className="lg:col-span-3 glassmorphism p-6 rounded-2xl border border-neutral-800/80 relative flex flex-col justify-between min-h-[360px]">
                {!isUnlocked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-[#0c0c12]/75 backdrop-blur-md rounded-2xl text-center">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 flex items-center justify-center mb-4 glow-accent">
                      <Lock size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Unlock suggestions Checklist</h3>
                    <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
                      Upgrade to Ascend Plus to unlock targeted posture correction guides, styling advice, and skincare routine suggestions.
                    </p>
                    <button
                      onClick={handleUnlockMock}
                      className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-500/10 flex items-center gap-2"
                    >
                      Unlock Ascend Plus ($4.99)
                    </button>
                  </div>
                )}

                <div className={`space-y-4 ${!isUnlocked ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
                  <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
                    <Sliders size={16} className="text-indigo-400" />
                    Targeted Suggestions Checklist
                  </h3>

                  {/* Horizontal Category Selector */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-900">
                    {[
                      { id: 'skincare', label: '🧴 Skincare' },
                      { id: 'hairstyle', label: '💇‍♂️ Hair' },
                      { id: 'beard', label: '🧔 Beard' },
                      { id: 'glasses', label: '👓 Glasses' },
                      { id: 'makeup', label: '💄 Makeup' },
                      { id: 'fashion', label: '👕 Fashion' },
                      { id: 'color_analysis', label: '🎨 Colors' },
                      { id: 'fitness', label: '🏋️‍♂️ Fitness' },
                      { id: 'sleep', label: '💤 Sleep' },
                      { id: 'dental', label: '🦷 Dental/Mew' },
                      { id: 'grooming', label: '✂️ Groom' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveRecCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${activeRecCategory === cat.id ? 'bg-indigo-650 text-white' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-850 hover:text-white'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="py-2">
                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">
                      Recommended Routine Hacks
                    </h4>
                    <ul className="space-y-3 text-xs text-neutral-300">
                      {(() => {
                        const tipsList = currentAnalysis.suggestions?.[activeRecCategory] || 
                          (activeRecCategory === 'fitness' && currentAnalysis.suggestions?.posture) ||
                          (activeRecCategory === 'sleep' && currentAnalysis.suggestions?.lifestyle) || [
                            "Maintain consistent daily habits.",
                            "Track your routines to log progress and earn badges."
                          ];
                        return tipsList.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <CheckCircle2 size={13} className="text-indigo-500 mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                </div>

                <div className="text-[9px] text-neutral-500 border-t border-neutral-900 pt-3 mt-4">
                  * Harmony, symmetry, and proportion are calculated based on geometrical ratios. Results represent structural estimates.
                </div>
              </div>
            </div>
          ) : (
            // COMPARISON VIEW (FREE)
            <div className="glassmorphism border border-neutral-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ChartIcon size={18} className="text-indigo-400" />
                  Compare With Previous Scans
                </h3>
                <p className="text-xs text-neutral-400">
                  Select a past face analysis reports to track symmetry progression values over time.
                </p>
              </div>

              {analysesList.length >= 2 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Select past Scan list */}
                  <div className="md:col-span-1 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Select Previous Scan</label>
                      <select 
                        value={historySortOrder} 
                        onChange={(e) => setHistorySortOrder(e.target.value)}
                        className="w-full text-[10px] font-bold bg-neutral-950 border border-neutral-900 rounded-lg px-2 py-1 outline-none text-neutral-400 cursor-pointer"
                      >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="score-desc">Highest Score First</option>
                        <option value="score-asc">Lowest Score First</option>
                      </select>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 border border-neutral-900 rounded-xl p-1 bg-neutral-950/40 scrollbar-none">
                      {sortedAnalysesList.filter(s => s.id !== currentAnalysis.id).map((scan) => (
                        <button
                          key={scan.id}
                          onClick={() => setCompareScanId(scan.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${compareScanId === scan.id ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-transparent border-transparent hover:bg-neutral-900/60 text-neutral-400 hover:text-white'}`}
                        >
                          <span>Scan on {scan.date}</span>
                          <span className="text-[10px] font-extrabold text-neutral-500">{scan.facial_harmony_score}%</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comparisons offset chart cards */}
                  <div className="md:col-span-2 space-y-4">
                    {compareScan ? (
                      <div className="space-y-4">
                        <div className="bg-neutral-950/40 border border-neutral-900 p-4 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="text-neutral-500 uppercase tracking-wider font-bold text-[9px] block">Comparing Against</span>
                            <span className="text-white font-bold block mt-0.5">Scan date: {compareScan.date}</span>
                          </div>
                          <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                            Harmony: {compareScan.facial_harmony_score}%
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: 'Harmony Score', current: currentAnalysis.facial_harmony_score, prev: compareScan.facial_harmony_score },
                            { label: 'Symmetry Score', current: currentAnalysis.symmetry_score, prev: compareScan.symmetry_score },
                            { label: 'Proportion Score', current: currentAnalysis.facial_proportion_score, prev: compareScan.facial_proportion_score },
                            { label: 'Potential Score', current: currentAnalysis.improvement_potential_score, prev: compareScan.improvement_potential_score }
                          ].map(score => {
                            const diff = score.current - score.prev;
                            const diffText = diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : '0%';
                            const diffColor = diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-neutral-500';
                            
                            return (
                              <div key={score.label} className="bg-neutral-950/80 border border-neutral-900 p-4 rounded-xl flex flex-col justify-between h-24">
                                <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider block">{score.label}</span>
                                <div className="flex items-baseline justify-between mt-2">
                                  <span className="text-white text-lg font-black">{score.current}%</span>
                                  <span className={`text-xs font-bold ${diffColor}`}>{diffText} shift</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center text-xs text-neutral-500 italic">
                        Select a past scan date from the left to view score shift metrics.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  title="No Comparative Scans"
                  description="You need to complete at least two face harmony scans to unlock visual progression offsets and comparisons."
                  actionText="Scan Profile Again"
                  onAction={handleReset}
                />
              )}

            </div>
          )}

        </section>
      )}

    </div>
  );
}
