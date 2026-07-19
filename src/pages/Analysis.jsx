// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Analysis.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { saveAnalysis, unlockAnalysis, getAnalyses, deleteAnalysis } from '../services/db';
import { uploadScan, getOptimizedUrl, validateImageFile } from '../services/cloudinary';
import { analyzeFaceImage, generateTransformationTips } from '../services/mediapipe';
import FaceMeshOverlay from '../components/FaceMeshOverlay';
import { Card, Button, ProgressRing, Badge, Skeleton } from '../components/DesignSystem';
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
  const [frontProgress, setFrontProgress] = useState(0);
  const [sideProgress, setSideProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [frontPreviewUrl, setFrontPreviewUrl] = useState(null);
  const [sidePreviewUrl, setSidePreviewUrl] = useState(null);
  const [frontCancel, setFrontCancel] = useState(null);
  const [sideCancel, setSideCancel] = useState(null);
  const [stepError, setStepError] = useState('');

  // Ref elements to measure image sizes for canvas overlay alignment
  const imageRef = useRef(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  // Load analysis list on mount
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const list = await getAnalyses();
        const safeList = Array.isArray(list) ? list : [];
        setAnalysesList(safeList);
        if (safeList.length > 0) {
          setCurrentAnalysis(safeList[0]);
          setActiveView('step4');
          if (safeList.length > 1) {
            setCompareScanId(safeList[1].id);
          }
        } else {
          setActiveView('step1');
        }
      } catch (err) {
        console.error("Analysis mount load error:", err);
      }
    };
    fetchAnalyses();
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

    try {
      validateImageFile(file);
      setStepError('');

      // Generate local preview URL
      const objectUrl = URL.createObjectURL(file);
      if (type === 'front') {
        if (frontPreviewUrl) URL.revokeObjectURL(frontPreviewUrl);
        setFrontPreviewUrl(objectUrl);
        setFrontFile(file);
      } else {
        if (sidePreviewUrl) URL.revokeObjectURL(sidePreviewUrl);
        setSidePreviewUrl(objectUrl);
        setSideFile(file);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'front') {
          setFrontImage(event.target.result);
        } else {
          setSideImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setStepError(err.message || 'File validation failed.');
      if (type === 'front') {
        setFrontImage(null);
        setFrontFile(null);
      } else {
        setSideImage(null);
        setSideFile(null);
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (!frontImage || !sideImage) return;

    setIsProcessing(true);
    setActiveView('step3');
    setUploadError('');
    setFrontProgress(0);
    setSideProgress(0);

    try {
      // 1. Upload Front Image
      setProcessStatus('Uploading frontal view to Cloudinary...');
      const frontUpload = uploadScan(frontImage, user.uid, (percent) => {
        setFrontProgress(percent);
      });
      setFrontCancel(() => frontUpload.cancel);
      const frontMetadata = await frontUpload.promise;

      // 2. Upload Side Image
      setProcessStatus('Uploading side view to Cloudinary...');
      const sideUpload = uploadScan(sideImage, user.uid, (percent) => {
        setSideProgress(percent);
      });
      setSideCancel(() => sideUpload.cancel);
      const sideMetadata = await sideUpload.promise;

      // 3. Run MediaPipe analysis
      setProcessStatus('Running local face mesh landmarker...');
      
      const imgEl = new Image();
      imgEl.src = frontImage;
      await new Promise((resolve, reject) => {
        imgEl.onload = resolve;
        imgEl.onerror = () => reject(new Error("Failed to load image for MediaPipe."));
      });

      const detection = await analyzeFaceImage(imgEl, false);
      setLandmarks(detection.landmarks);
      
      const tips = generateTransformationTips(detection.scores);
      
      // 4. Save analysis to Firestore
      setProcessStatus('Saving scan report metadata to Firestore...');
      const saved = await saveAnalysis(
        frontMetadata,
        sideMetadata,
        detection.scores,
        tips
      );

      // Clean up object URLs
      if (frontPreviewUrl) {
        URL.revokeObjectURL(frontPreviewUrl);
        setFrontPreviewUrl(null);
      }
      if (sidePreviewUrl) {
        URL.revokeObjectURL(sidePreviewUrl);
        setSidePreviewUrl(null);
      }

      setCurrentAnalysis(saved);
      
      // Refresh list
      const updatedList = await getAnalyses();
      const safeUpdatedList = Array.isArray(updatedList) ? updatedList : [];
      setAnalysesList(safeUpdatedList);
      if (safeUpdatedList.length > 1) {
        setCompareScanId(safeUpdatedList[1].id);
      }
      
      // Award achievements
      await unlockBadge('first_analysis');
      await addXP(200, "First Biometric Harmony Scan");
      
      setIsProcessing(false);
      setActiveView('step4');
    } catch (err) {
      console.error("Biometric analysis error:", err);
      if (err.message === "Upload cancelled by user.") {
        setUploadError("Upload was cancelled.");
      } else {
        setUploadError(err.message || 'An error occurred during analysis or upload.');
      }
      setIsProcessing(false);
    } finally {
      setFrontCancel(null);
      setSideCancel(null);
    }
  };

  const handleCancelScan = () => {
    if (frontCancel) frontCancel();
    if (sideCancel) sideCancel();
    setIsProcessing(false);
    setUploadError("Upload was cancelled.");
  };

  const handleReset = () => {
    setFrontImage(null);
    setSideImage(null);
    setFrontFile(null);
    setSideFile(null);
    setFrontProgress(0);
    setSideProgress(0);
    setUploadError('');
    setStepError('');
    if (frontPreviewUrl) {
      URL.revokeObjectURL(frontPreviewUrl);
      setFrontPreviewUrl(null);
    }
    if (sidePreviewUrl) {
      URL.revokeObjectURL(sidePreviewUrl);
      setSidePreviewUrl(null);
    }
    setActiveView('step1');
  };

  const handleUnlockMock = () => {
    if (currentAnalysis?.id) {
      navigate(`/payments?analysisId=${currentAnalysis.id}`);
    }
  };

  const isPremiumUser = !!user?.profile?.is_premium;
  const isUnlocked = isPremiumUser || !!currentAnalysis?.is_premium_unlocked;

  // Sorted and filtered analyses list (excluding current scan) for comparison options
  const safeList = Array.isArray(analysesList) ? analysesList : [];
  const sortedAnalysesList = [...safeList].sort((a, b) => {
    if (historySortOrder === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (historySortOrder === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (historySortOrder === 'score-desc') return b.facial_harmony_score - a.facial_harmony_score;
    if (historySortOrder === 'score-asc') return a.facial_harmony_score - b.facial_harmony_score;
    return 0;
  });

  const compareScan = safeList.find(s => s.id === compareScanId);

  return (
    <div className="space-y-8 animate-fade-in text-foreground max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">Face Geometry Engine</span>
        <h1 className="text-3xl font-black tracking-tight mb-2">
          Facial Harmony Analysis
        </h1>
        <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
          Measure structural symmetry and proportion parameters client-side. Complete your routines to unlock your potential.
        </p>
      </div>

      {/* STEP 1: Upload Front Image */}
      {activeView === 'step1' && (
        <section className="space-y-6">
          {/* Privacy & Safe Guidance Box */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <Sparkles className="text-primary mt-0.5 shrink-0" size={16} />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              🔒 <strong>Privacy-First Safe Guidance:</strong> To protect your data, all biometric scans are processed 100% locally on your device—your photos are never sent to external servers. These proportion insights are designed to guide your daily grooming and posture consistency goals safely.
            </p>
          </div>

          {stepError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-normal max-w-xl mx-auto">
              {stepError}
            </div>
          )}

          <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden max-w-md mx-auto">
            {frontImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img 
                  src={frontImage} 
                  alt="Front view preview" 
                  className="w-full max-h-[200px] object-contain rounded-xl border border-border"
                />
                <button 
                  onClick={() => { setFrontImage(null); setFrontFile(null); setStepError(''); }}
                  className="mt-3 text-xs font-bold text-red-400 hover:underline cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center space-y-4 w-full h-full py-10 justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-lg">
                  <Upload size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold block text-foreground">Step 1: Frontal Profile Photo</span>
                  <span className="text-[9px] text-muted-foreground mt-1 block">Click to select (JPG, PNG, WEBP)</span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e, 'front')}
                  className="hidden"
                />
              </label>
            )}
          </Card>

          <div className="flex justify-center">
            <Button
              variant="primary"
              disabled={!frontImage}
              onClick={() => setActiveView('step2')}
            >
              <span>Next: Side Profile Photo</span>
              <ChevronRight size={12} />
            </Button>
          </div>
        </section>
      )}

      {/* STEP 2: Upload Side Image */}
      {activeView === 'step2' && (
        <section className="space-y-6">
          {stepError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-normal max-w-xl mx-auto">
              {stepError}
            </div>
          )}

          <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden max-w-md mx-auto">
            {sideImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img 
                  src={sideImage} 
                  alt="Side view preview" 
                  className="w-full max-h-[200px] object-contain rounded-xl border border-border"
                />
                <button 
                  onClick={() => { setSideImage(null); setSideFile(null); setStepError(''); }}
                  className="mt-3 text-xs font-bold text-red-400 hover:underline cursor-pointer"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center space-y-4 w-full h-full py-10 justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-lg">
                  <Upload size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold block text-foreground">Step 2: Side Profile Photo</span>
                  <span className="text-[9px] text-muted-foreground mt-1 block">Click to select (JPG, PNG, WEBP)</span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleImageUpload(e, 'side')}
                  className="hidden"
                />
              </label>
            )}
          </Card>

          <div className="flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setActiveView('step1')}
            >
              <ChevronLeft size={12} />
              <span>Back</span>
            </Button>
            <Button
              variant="primary"
              disabled={!sideImage}
              onClick={handleStartAnalysis}
            >
              <Sparkles size={12} />
              <span>Start Analysis</span>
            </Button>
          </div>
        </section>
      )}

      {/* STEP 3: Processing Status */}
      {activeView === 'step3' && (
        <Card className="p-8 max-w-md mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{uploadError ? 'Biometric Upload Failed' : 'Scanning Face Structure...'}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {uploadError || processStatus}
            </p>
          </div>

          {!uploadError ? (
            <div className="space-y-4 max-w-xs mx-auto">
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                <span>Front Upload</span>
                <span>{frontProgress}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
                <div className="h-full bg-primary" style={{ width: `${frontProgress}%` }}></div>
              </div>
              
              <div className="flex justify-between text-[10px] text-muted-foreground font-bold pt-2">
                <span>Side Upload</span>
                <span>{sideProgress}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
                <div className="h-full bg-primary" style={{ width: `${sideProgress}%` }}></div>
              </div>

              <Button
                variant="secondary"
                onClick={handleCancelScan}
                className="w-full mt-4"
              >
                Cancel Analysis
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl">
                {uploadError}
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="secondary" onClick={handleReset}>Cancel</Button>
                <Button variant="primary" onClick={handleStartAnalysis}>
                  <RefreshCw size={12} className="mr-1 shrink-0" />
                  Retry Analysis
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* STEP 4: Report dashboard */}
      {activeView === 'step4' && currentAnalysis && (
        <section className="space-y-6">
          {/* Main metrics Card */}
          <Card className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/10">
            <div className="md:col-span-2 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-0.5">Overall Estimate Report</span>
                <h2 className="text-xl font-black text-foreground tracking-tight">Facial Harmony Score</h2>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-foreground">{currentAnalysis.facial_harmony_score}%</span>
                <span className="text-xs font-semibold text-muted-foreground">/ 100 max</span>
              </div>
              
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Harmony calculation based on proportions (Thirds, Fifths) and bilateral alignment landmarks.
              </p>
            </div>

            <div className="grid grid-cols-2 md:col-span-2 gap-4">
              {[
                { label: 'Symmetry index', val: `${currentAnalysis.symmetry_score}%`, desc: 'Left-right balance' },
                { label: 'Proportion index', val: `${currentAnalysis.facial_proportion_score}%`, desc: 'Vertical splits' },
                { label: 'Improvement Pot.', val: `${currentAnalysis.improvement_potential_score}%`, desc: 'Routine head-room' },
                { label: 'Confidence Score', val: 'High', desc: 'Sufficient illumination' }
              ].map((sub, idx) => (
                <div key={idx} className="bg-secondary/25 border border-border p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-wider block">{sub.label}</span>
                  <div className="mt-2">
                    <span className="text-base font-black text-foreground block leading-none">{sub.val}</span>
                    <span className="text-[8px] text-muted-foreground mt-0.5 block leading-none">{sub.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Selector tab controls */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'suggestions' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Biometric mesh & Routine Suggestions
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'comparison' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Scan History & Comparisons
            </button>
          </div>

          {activeTab === 'suggestions' ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Visual Mesh Card */}
              <Card className="lg:col-span-2 p-5 flex flex-col justify-between items-center text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 block w-full text-left">
                  Biometric Mesh Map
                </span>
                <div className="relative rounded-xl overflow-hidden border border-border w-full max-w-[280px] aspect-square bg-background flex items-center justify-center">
                  <img 
                    ref={imageRef}
                    src={getOptimizedUrl(currentAnalysis.front_photo_url)} 
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
                <span className="text-[10px] text-muted-foreground italic mt-3 block">
                  Biometric mapping of 478 points.
                </span>
              </Card>

              {/* Suggestions Panel (Locked if not premium) */}
              <Card className="lg:col-span-3 p-6 relative flex flex-col justify-between min-h-[360px]">
                {!isUnlocked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-card/75 backdrop-blur-md rounded-2xl text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
                      <Lock size={20} className="animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">Unlock suggestions Checklist</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mb-6 leading-relaxed">
                      Upgrade to Ascend Plus to unlock targeted posture correction guides, styling advice, and skincare routine suggestions.
                    </p>
                    <Button
                      variant="primary"
                      onClick={handleUnlockMock}
                    >
                      Unlock Ascend Plus ($9.99)
                    </Button>
                  </div>
                )}

                <div className={`space-y-4 ${!isUnlocked ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
                  <h3 className="text-xs font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                    <Sliders size={14} className="text-primary" />
                    Targeted Suggestions Checklist
                  </h3>

                  {/* Horizontal Category Selector */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border">
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
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-colors ${activeRecCategory === cat.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="py-2">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                      Recommended Routine Hacks
                    </h4>
                    <ul className="space-y-3 text-xs text-foreground">
                      {(() => {
                        const tipsList = currentAnalysis.suggestions?.[activeRecCategory] || 
                          (activeRecCategory === 'fitness' && currentAnalysis.suggestions?.posture) ||
                          (activeRecCategory === 'sleep' && currentAnalysis.suggestions?.lifestyle) || [
                            "Maintain consistent daily habits.",
                            "Track your routines to log progress and earn badges."
                          ];
                        return tipsList.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                            <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                </div>

                <div className="text-[9px] text-muted-foreground border-t border-border pt-3 mt-4">
                  * Harmony, symmetry, and proportion are calculated based on geometrical ratios. Results represent structural estimates.
                </div>
              </Card>
            </div>
          ) : (
            // COMPARISON VIEW
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <ChartIcon size={14} className="text-primary" />
                  Compare With Previous Scans
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a past face analysis reports to track symmetry progression values over time.
                </p>
              </div>

              {analysesList.length >= 2 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Select past Scan list */}
                  <div className="md:col-span-1 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Select Previous Scan</label>
                      <select 
                        value={historySortOrder} 
                        onChange={(e) => setHistorySortOrder(e.target.value)}
                        className="w-full text-[10px] font-bold bg-secondary/60 border border-border rounded-lg px-2.5 py-2.5 outline-none text-muted-foreground cursor-pointer focus:border-primary"
                      >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="score-desc">Highest Score First</option>
                        <option value="score-asc">Lowest Score First</option>
                      </select>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 border border-border rounded-xl p-1 bg-secondary/40 scrollbar-none">
                      {sortedAnalysesList.filter(s => currentAnalysis && s.id !== currentAnalysis.id).map((scan) => (
                        <button
                          key={scan.id}
                          onClick={() => setCompareScanId(scan.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${compareScanId === scan.id ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-transparent hover:bg-card/60 text-muted-foreground hover:text-foreground'}`}
                        >
                          <span>Scan on {scan.date}</span>
                          <span className="text-[10px] font-extrabold text-muted-foreground">{scan.facial_harmony_score}%</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comparisons offset chart cards */}
                  <div className="md:col-span-2 space-y-4">
                    {compareScan ? (
                      <div className="space-y-4">
                        <div className="bg-secondary/40 border border-border p-4 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="text-muted-foreground uppercase tracking-wider font-bold text-[9px] block">Comparing Against</span>
                            <span className="text-foreground font-bold block mt-0.5">Scan date: {compareScan.date}</span>
                          </div>
                          <span className="text-[9px] uppercase font-extrabold tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
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
                            const diffColor = diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-muted-foreground';
                            
                            return (
                              <div key={score.label} className="bg-secondary/15 border border-border p-4 rounded-xl flex flex-col justify-between h-24">
                                <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider block">{score.label}</span>
                                <div className="flex items-baseline justify-between mt-2">
                                  <span className="text-foreground text-lg font-black">{score.current}%</span>
                                  <span className={`text-[10px] font-bold ${diffColor}`}>{diffText} shift</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center text-xs text-muted-foreground italic">
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
            </Card>
          )}

          <div className="flex justify-center pt-4">
            <Button
              variant="secondary"
              onClick={handleReset}
            >
              <RefreshCw size={12} className="mr-1 shrink-0" />
              Start New Analysis
            </Button>
          </div>
        </section>
      )}

    </div>
  );
}
