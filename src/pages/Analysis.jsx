// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Analysis.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { saveAnalysis, unlockAnalysis, getAnalyses } from '../services/db';
import { analyzeFaceImage, generateTransformationTips } from '../services/mediapipe';
import FaceMeshOverlay from '../components/FaceMeshOverlay';
import { 
  Sparkles, 
  Upload, 
  Camera, 
  HelpCircle, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Sliders
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
  const [activeView, setActiveView] = useState('upload'); // upload, processing, results
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // Ref elements to measure image sizes for canvas overlay alignment
  const imageRef = useRef(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  // Load latest analysis on mount
  useEffect(() => {
    const list = getAnalyses();
    if (list && list.length > 0) {
      setCurrentAnalysis(list[0]);
      setActiveView('results');
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
    setActiveView('processing');
    
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
      await new Promise(resolve => setTimeout(resolve, 600));
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
        
        // Award initial analysis achievements
        unlockBadge('first_analysis');
        addXP(200, "First Biometric Harmony Scan");
        
        setIsProcessing(false);
        setActiveView('results');
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
        setActiveView('upload');
      }
    };
  };

  const handleReset = () => {
    setFrontImage(null);
    setSideImage(null);
    setFrontFile(null);
    setSideFile(null);
    setLandmarks(null);
    setActiveView('upload');
  };

  const handleUnlockMock = () => {
    // Redirect to payments page, passing the current analysis ID
    navigate(`/payments?analysisId=${currentAnalysis.id}`);
  };

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

      {/* VIEW 1: Upload Front and Side images */}
      {activeView === 'upload' && (
        <section className="space-y-6">
          
          {/* Medical / Scientific Disclaimer Box */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-3">
            <AlertTriangle className="text-blue-400 mt-0.5 shrink-0" size={16} />
            <p className="text-xs text-neutral-400 leading-normal">
              <strong>Estimate Disclaimer:</strong> All metrics, including Facial Harmony, Symmetry, and Proportion Scores, are automated AI estimates intended for general grooming and posture feedback, and are not medical, scientific, or diagnostic measurements. Photos are processed strictly on your device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Photo Card */}
            <div className="glassmorphism p-6 rounded-2xl flex flex-col items-center justify-center border border-neutral-800/80 min-h-[300px] text-center relative overflow-hidden">
              {frontImage ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <img 
                    src={frontImage} 
                    alt="Front view" 
                    className="w-full max-h-[220px] object-contain rounded-xl border border-neutral-800"
                  />
                  <button 
                    onClick={() => { setFrontImage(null); setFrontFile(null); }}
                    className="mt-3 text-xs font-semibold text-red-400 hover:underline"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center space-y-4 w-full h-full py-10 justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Frontal Profile Photo</span>
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

            {/* Side Photo Card */}
            <div className="glassmorphism p-6 rounded-2xl flex flex-col items-center justify-center border border-neutral-800/80 min-h-[300px] text-center relative overflow-hidden">
              {sideImage ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <img 
                    src={sideImage} 
                    alt="Side view" 
                    className="w-full max-h-[220px] object-contain rounded-xl border border-neutral-800"
                  />
                  <button 
                    onClick={() => { setSideImage(null); setSideFile(null); }}
                    className="mt-3 text-xs font-semibold text-red-400 hover:underline"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center space-y-4 w-full h-full py-10 justify-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Side Profile Photo</span>
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
          </div>

          {/* Action trigger button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleStartAnalysis}
              disabled={!frontImage || !sideImage}
              className={`px-8 py-4 rounded-xl font-bold text-xs text-white transition-all duration-300 flex items-center gap-2 ${frontImage && sideImage ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/10' : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed'}`}
            >
              <Sparkles size={16} />
              Analyze Structural Balance
            </button>
          </div>
        </section>
      )}

      {/* VIEW 2: Biometric processing states */}
      {activeView === 'processing' && (
        <section className="glassmorphism p-12 rounded-2xl border border-neutral-800 flex flex-col items-center text-center space-y-8 min-h-[380px] justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/25 border-t-blue-500 animate-spin flex items-center justify-center relative">
            <div className="absolute inset-2 rounded-full border-2 border-indigo-500/10 border-t-indigo-500 animate-spin-reverse"></div>
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="text-lg font-bold text-white">Biometric Scanning In Progress</h3>
            <p className="text-xs text-neutral-400 animate-pulse">{processStatus}</p>
          </div>
        </section>
      )}

      {/* VIEW 3: Results display with free/premium views */}
      {activeView === 'results' && currentAnalysis && (
        <section className="space-y-8">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center bg-neutral-900/40 border border-neutral-800/80 px-5 py-3 rounded-2xl">
            <div className="text-xs font-semibold text-neutral-400">
              Analysis completed on: {currentAnalysis.date}
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              Re-Scan Profile
            </button>
          </div>

          {/* Core Metric Dials */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    {/* Ring background */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                      <circle cx="48" cy="48" r="40" stroke="rgba(59,130,246,0.2)" strokeWidth="6" fill="transparent" />
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

          {/* Visual Mesh Preview & Paywalled suggestions */}
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
                <FaceMeshOverlay 
                  landmarks={currentAnalysis.landmarks_json} 
                  width={imgSize.width} 
                  height={imgSize.height}
                />
              </div>
              <span className="text-[10px] text-neutral-500 italic mt-3 block">
                Biometric mapping of 478 local points.
              </span>
            </div>

            {/* Paywall Suggestion Panel */}
            <div className="lg:col-span-3 glassmorphism p-6 rounded-2xl border border-neutral-800/80 relative flex flex-col justify-between min-h-[300px]">
              
              {!currentAnalysis.is_premium_unlocked ? (
                // FREE VIEW (LOCKED)
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-[#0c0c12]/70 backdrop-blur-md rounded-2xl text-center">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 flex items-center justify-center mb-4 glow-accent">
                    <Lock size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Unlock Transformation Report</h3>
                  <p className="text-xs text-neutral-400 max-w-xs mb-6">
                    Unlock full radar details, facial third comparisons, and personalized checklists for posture, skincare, and exercise.
                  </p>
                  <button
                    onClick={handleUnlockMock}
                    className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-500/10 flex items-center gap-2"
                  >
                    Unlock Premium Report ($4.99)
                  </button>
                </div>
              ) : null}

              {/* Suggestions content (Blurred if locked) */}
              <div className={`space-y-5 ${!currentAnalysis.is_premium_unlocked ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
                <h3 className="text-base font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
                  <Sliders size={16} className="text-indigo-400" />
                  Targeted Suggestions Checklist
                </h3>

                <div className="space-y-4">
                  {/* Category 1 */}
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1.5">Posture & Jawline</h4>
                    <ul className="space-y-1 text-xs text-neutral-300">
                      {currentAnalysis.suggestions?.posture.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={12} className="text-blue-500 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 2 */}
                  <div>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1.5">Skincare & Grooming</h4>
                    <ul className="space-y-1 text-xs text-neutral-300">
                      {currentAnalysis.suggestions?.skincare.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={12} className="text-purple-500 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Category 3 */}
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">Lifestyle & Sleep</h4>
                    <ul className="space-y-1 text-xs text-neutral-300">
                      {currentAnalysis.suggestions?.lifestyle.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Estimate Disclaimer at the bottom of report */}
              <div className="text-[9px] text-neutral-500 border-t border-neutral-900 pt-3 mt-4">
                * Harmony, symmetry, and proportion are calculated based on geometrical ratios. Results represent structural estimates.
              </div>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
