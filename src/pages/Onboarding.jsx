// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\pages\Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { completeOnboarding } = useAuth();
  const { addXP, unlockBadge } = useGame();
  const navigate = useNavigate();

  // Form states
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState('Male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [focusArea, setFocusArea] = useState('Overall');
  const [experience, setExperience] = useState('Beginner');

  const nextStep = () => setStep(prev => Math.min(4, prev + 1));
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  const handleFinish = () => {
    // Process profile updates
    const profileData = {
      age: parseInt(age),
      gender,
      height_cm: parseFloat(height) || 175,
      weight_kg: parseFloat(weight) || 70,
      goal_description: goal,
      focus_area: focusArea,
      previous_experience: experience
    };
    
    // Complete onboarding update in context
    completeOnboarding(profileData);

    // Reward initial onboarding achievements
    setTimeout(() => {
      unlockBadge('first_step');
      addXP(150, "Complete Onboarding Setup");
      navigate('/dashboard');
    }, 500);
  };

  const steps = [
    { title: 'Personal Details', description: 'Tell us a bit about yourself' },
    { title: 'Physical Metrics', description: 'Enter stats to calibrate trackers' },
    { title: 'Transformation Goal', description: 'What are you aiming to improve?' },
    { title: 'Experience Level', description: 'Calibrate routine difficulty' }
  ];

  return (
    <div className="min-h-screen bg-[#07070b] text-neutral-100 flex flex-col items-center justify-center p-4 relative">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Progress header */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Step {step} of 4</span>
          <span className="text-sm font-semibold text-white">{steps[step-1].title}</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-900">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-lg glassmorphism p-8 rounded-2xl border border-neutral-800 flex flex-col shadow-xl min-h-[380px]">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-1">{steps[step-1].title}</h2>
          <p className="text-xs text-neutral-400 mb-8">{steps[step-1].description}</p>

          {/* STEP 1: Basic details */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Your Age: {age}</label>
                <input
                  type="range"
                  min="16"
                  max="60"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-medium">
                  <span>16 Years</span>
                  <span>35 Years</span>
                  <span>60 Years</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Biological Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${gender === g ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold' : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:text-white'}`}
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
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Height (cm)</label>
                <input
                  type="number"
                  placeholder="e.g. 178"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Weight (kg)</label>
                <input
                  type="number"
                  placeholder="e.g. 72"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Goals & Focus Area */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Describe your goals</label>
                <textarea
                  placeholder="I want to improve..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows="3"
                  className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder-neutral-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Primary Improvement Area</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Face', 'Fitness', 'Grooming', 'Overall'].map((area) => (
                    <button
                      key={area}
                      onClick={() => setFocusArea(area)}
                      className={`py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${focusArea === area ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-bold' : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:text-white'}`}
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
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Your Experience Level</label>
              <div className="space-y-3">
                {[
                  { id: 'Beginner', desc: 'New to grooming routines and structural physical posture alignment.' },
                  { id: 'Intermediate', desc: 'Understand basics of skincare & stretching, want to get serious.' },
                  { id: 'Expert', desc: 'Already execute routines daily, looking for optimization.' }
                ].map((exp) => (
                  <div
                    key={exp.id}
                    onClick={() => setExperience(exp.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${experience === exp.id ? 'bg-blue-500/5 border-blue-500' : 'bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700'}`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${experience === exp.id ? 'border-blue-500 bg-blue-500 text-white' : 'border-neutral-700'}`}>
                      {experience === exp.id && <Check size={10} />}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">{exp.id}</span>
                      <span className="text-[11px] text-neutral-400 mt-0.5 block">{exp.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons footer */}
        <div className="flex items-center justify-between border-t border-neutral-900 pt-6 mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${step === 1 ? 'text-neutral-600 cursor-not-allowed' : 'text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800'}`}
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center gap-1.5"
            >
              Continue
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-500/10 flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              Ascend Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
