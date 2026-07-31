// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\utils\facialHarmonyScale.js

/**
 * Standardized Facial Harmony 0-8 Rating Scale Calculator
 * Classifies scores (0-100) into 9 standardized categories:
 * 0: Worst, 1: Subhuman, 2: Sub-5, 3: Low-Tier Normie, 4: Mid-Tier Normie,
 * 5: High-Tier Normie, 6: Chadlite, 7: Chad, 8: True Adam
 */
export function getFacialHarmonyRating(score) {
  const numScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  
  if (numScore >= 96) {
    return {
      tier: 8,
      category: 'True Adam',
      percentile: 'Top 0.1%',
      description: 'The theoretical maximum representing near-perfect facial harmony, golden ratio proportions, and bilateral symmetry.',
      color: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
      badgeBg: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-extrabold shadow-lg shadow-amber-400/20',
      barGradient: 'from-amber-400 via-yellow-300 to-amber-500',
      strengths: ['Golden Ratio Thirds', 'Symmetrical Jawline Alignment', 'Flawless Eye Width Ratio', 'Near-Perfect Canthal Tilt'],
      improvements: ['Maintain Skin Hydration', 'Daily Posture Check-ins']
    };
  } else if (numScore >= 90) {
    return {
      tier: 7,
      category: 'Chad',
      percentile: 'Top 3%',
      description: 'Highly attractive with elite facial structure, dominant jawline definition, and outstanding symmetry.',
      color: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
      badgeBg: 'bg-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/20',
      barGradient: 'from-purple-600 to-indigo-500',
      strengths: ['Defined Mandibular Angle', 'High Symmetry Index', 'Optimal Facial Height Balance'],
      improvements: ['Skincare Double Cleanse Routine', 'Neck & Trap Alignment']
    };
  } else if (numScore >= 80) {
    return {
      tier: 6,
      category: 'Chadlite',
      percentile: 'Top 14%',
      description: 'Noticeably attractive with strong harmonious facial features, clear proportions, and good aesthetics.',
      color: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
      badgeBg: 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20',
      barGradient: 'from-blue-600 to-[#22D3EE]',
      strengths: ['Balanced Proportions', 'Excellent Symmetry', 'Strong Jawline Alignment'],
      improvements: ['Consistent Skin Hydration', 'Haircut Framing Advice', 'Forward Tongue Posture']
    };
  } else if (numScore >= 70) {
    return {
      tier: 5,
      category: 'High-Tier Normie',
      percentile: 'Top 30%',
      description: 'Above average with clear skin, decent symmetry, and balanced vertical facial thirds.',
      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      badgeBg: 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20',
      barGradient: 'from-emerald-600 to-teal-400',
      strengths: ['Good Facial Width Ratio', 'Decent Lower Third Balance', 'Clear Complexion'],
      improvements: ['Mewing Tongue Posture', 'Water Retention Reduction', 'Cheekbone Framing']
    };
  } else if (numScore >= 60) {
    return {
      tier: 4,
      category: 'Mid-Tier Normie',
      percentile: 'Statistical Mean (50%)',
      description: 'Average facial harmony representing the statistical mean of the general population.',
      color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
      badgeBg: 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/20',
      barGradient: 'from-yellow-600 to-amber-400',
      strengths: ['Symmetrical Eye Alignment', 'Standard Facial Proportions'],
      improvements: ['Reduce Facial Bloating', 'Mewing Routine', 'Skincare Moisture Barrier', 'Forward Posture Reset']
    };
  } else if (numScore >= 50) {
    return {
      tier: 3,
      category: 'Low-Tier Normie',
      percentile: 'Below Average (65%)',
      description: 'Slightly below average harmony but generally blends into everyday public appearance.',
      color: 'bg-yellow-600/15 text-yellow-400 border-yellow-600/40',
      badgeBg: 'bg-yellow-600 text-white font-bold',
      barGradient: 'from-yellow-700 to-yellow-500',
      strengths: ['Functional Alignment'],
      improvements: ['Jawline Masseter Tone', 'Nasal Breathing Habits', 'Electrolyte Balance', 'Sleep Support']
    };
  } else if (numScore >= 40) {
    return {
      tier: 2,
      category: 'Sub-5',
      percentile: 'Lower 25%',
      description: 'Below average facial harmony with noticeable aesthetic or proportion shortcomings.',
      color: 'bg-orange-500/15 text-orange-300 border-orange-500/40',
      badgeBg: 'bg-orange-500 text-white font-bold',
      barGradient: 'from-orange-600 to-amber-500',
      strengths: ['Baseline Proportions'],
      improvements: ['Tongue Posture Check', 'Neck Alignment Routines', 'Hydration Optimization']
    };
  } else if (numScore >= 20) {
    return {
      tier: 1,
      category: 'Subhuman',
      percentile: 'Lower 10%',
      description: 'Severe facial disharmony or sub-average structural traits significantly below population mean.',
      color: 'bg-red-500/15 text-red-300 border-red-500/40',
      badgeBg: 'bg-red-600 text-white font-bold',
      barGradient: 'from-red-700 to-red-500',
      strengths: ['Room for Transformation'],
      improvements: ['Postural Correction', 'Hydration & Electrolytes', 'Daily Routine Check-ins']
    };
  } else {
    return {
      tier: 0,
      category: 'Worst',
      percentile: 'Lowest Tier',
      description: 'The lowest score tier representing extreme structural or alignment flaws.',
      color: 'bg-gray-500/15 text-gray-300 border-gray-500/40',
      badgeBg: 'bg-gray-600 text-white font-bold',
      barGradient: 'from-gray-700 to-gray-500',
      strengths: ['Initial Baseline'],
      improvements: ['Full Routine Reset', 'Orthotropics & Posture', 'Daily Compliance']
    };
  }
}
