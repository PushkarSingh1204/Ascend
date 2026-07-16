// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Onboarding.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { regenerateRoadmap, getProfile } from '../services/db';
import { Card, Button, Input } from '../components/DesignSystem';
import { Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const { user, completeOnboarding } = useAuth();
  const { addXP, unlockBadge, syncGameState } = useGame();
  const navigate = useNavigate();

  // Detect if re-onboarding
  const isReonboard = searchParams.get('re') === 'true' || !!user?.profile?.focus_area;

  // Form states (pre-populated with existing profile values if available)
  const [step, setStep] = useState(1);
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [focusArea, setFocusArea] = useState('Overall');
  const [experience, setExperience] = useState('Beginner');

  // Load baseline profile defaults if present
  useEffect(() => {
    const fetchBaseline = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          if (profile.age) setAge(profile.age);
          if (profile.gender) setGender(profile.gender);
          if (profile.height_cm) setHeight(profile.height_cm);
          if (profile.weight_kg) setWeight(profile.weight_kg);
          if (profile.goal_description) setGoal(profile.goal_description);
          if (profile.focus_area) setFocusArea(profile.focus_area);
          if (profile.previous_experience) setExperience(profile.previous_experience);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBaseline();
  }, [user]);

  const nextStep = () => setStep(prev => Math.min(4, prev + 1));
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  const handleFinish = async () => {
    const profileData = {
      age: parseInt(age),
      gender,
      height_cm: parseFloat(height) || 175,
      weight_kg: parseFloat(weight) || 70,
      goal_description: goal,
      focus_area: focusArea,
      previous_experience: experience
    };
    
    // Complete onboarding core profile
    await completeOnboarding(profileData);

    // Regenerate roadmap template milestones based on new focus area
    await regenerateRoadmap(focusArea);

    setTimeout(async () => {
      // Award achievements only if first time onboarding
      if (!isReonboard) {
        await unlockBadge('first_step');
        await addXP(150, "Complete Onboarding Setup");
      } else {
        await addXP(75, "Redefined Transformation Focus Area");
      }
      
      // Force sync context
      await syncGameState();
      
      // Redirect directly to roadmap to see the new journey!
      navigate('/roadmap');
    }, 500);
  };

  const steps = [
    { title: 'Personal Details', description: 'Tell us a bit about yourself' },
    { title: 'Physical Metrics', description: 'Enter stats to calibrate trackers' },
    { title: 'Transformation Goal', description: 'What are you aiming to improve?' },
    { title: 'Experience Level', description: 'Calibrate routine difficulty' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Progress header */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step {step} of 4</span>
          <span className="text-xs font-bold text-foreground">
            {isReonboard ? `Regenerating: ${steps[step-1].title}` : steps[step-1].title}
          </span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden border border-border">
          <div 
            className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="w-full max-w-lg p-8 flex flex-col shadow-2xl min-h-[380px]">
        <div className="flex-1">
          <h2 className="text-lg font-black text-foreground mb-1">
            {isReonboard ? `Update ${steps[step-1].title}` : steps[step-1].title}
          </h2>
          <p className="text-xs text-muted-foreground mb-8">{steps[step-1].description}</p>

          {/* STEP 1: Basic details */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Your Age: {age}</label>
                <input
                  type="range"
                  min="16"
                  max="60"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-1.5 bg-secondary/40 border border-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground font-black uppercase tracking-wider">
                  <span>16 Yrs</span>
                  <span>35 Yrs</span>
                  <span>60 Yrs</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Biological Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${gender === g ? 'bg-primary/10 border-primary text-primary shadow-[0_4px_12px_rgba(134,59,255,0.15)]' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Physical metrics */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Height (cm)</label>
                <input
                  type="number"
                  placeholder="e.g. 180"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Weight (kg)</label>
                <input
                  type="number"
                  placeholder="e.g. 75"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-secondary/20 border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Goals & Focus Area */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Describe your goals</label>
                <textarea
                  placeholder="I want to improve..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows="3"
                  className="w-full bg-secondary/20 border border-border rounded-xl py-3 px-4 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none placeholder-neutral-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Primary Focus Area</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Face', 'Fitness', 'Grooming', 'Overall'].map((area) => (
                    <button
                      key={area}
                      onClick={() => setFocusArea(area)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${focusArea === area ? 'bg-primary/10 border-primary text-primary shadow-[0_4px_12px_rgba(134,59,255,0.15)]' : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'}`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Experience Level */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Your Experience Level</label>
              <div className="space-y-3">
                {[
                  { id: 'Beginner', desc: 'New to grooming routines and structural physical posture alignment.' },
                  { id: 'Intermediate', desc: 'Understand basics of skincare & stretching, want to get serious.' },
                  { id: 'Expert', desc: 'Already execute routines daily, looking for optimization.' }
                ].map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => setExperience(exp.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${experience === exp.id ? 'bg-primary/5 border-primary shadow-[0_4px_12px_rgba(134,59,255,0.1)]' : 'bg-secondary/20 border-border hover:border-primary/20'}`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${experience === exp.id ? 'border-primary bg-primary text-white' : 'border-neutral-700'}`}>
                      {experience === exp.id && <Check size={10} />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block">{exp.id}</span>
                      <span className="text-[9px] text-muted-foreground mt-0.5 block leading-normal">{exp.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons footer */}
        <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={step === 1}
          >
            <ArrowLeft size={12} className="mr-1" />
            <span>Back</span>
          </Button>

          {step < 4 ? (
            <Button
              variant="primary"
              onClick={nextStep}
            >
              <span>Continue</span>
              <ArrowRight size={12} className="ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleFinish}
            >
              <Sparkles size={12} className="mr-1" />
              <span>{isReonboard ? 'Regenerate Journey' : 'Ascend Now'}</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
