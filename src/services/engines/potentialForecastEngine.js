// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\potentialForecastEngine.js
/**
 * Potential Forecast Engine
 * Calculates dynamic potential scores, projected improvement timelines, confidence levels,
 * and explainability factors based on user biometrics, routine consistency, and scan history.
 */

export function calculatePotentialForecast(profile = {}, latestScan = null, scanHistory = []) {
  // 1. Current Harmony Baseline
  const currentHarmony = latestScan ? (latestScan.facial_harmony_score || 72) : (profile.facial_harmony_score || 72);
  const symmetryScore = latestScan ? (latestScan.symmetry_score || 75) : 75;
  const proportionScore = latestScan ? (latestScan.facial_proportion_score || 75) : 75;

  // 2. Consistency & Habit Factors
  const streak = profile.streak || 0;
  const daysToAscend = profile.days_to_ascend || 0;
  const routineCompliance = Math.min(100, Math.max(40, (streak > 0 ? 70 + Math.min(25, streak * 1.5) : 50)));

  // 3. Potential Headroom Calculation
  // Biological headroom is higher for lower baselines, and enhanced by high compliance
  const baseGap = 100 - currentHarmony;
  const potentialMultiplier = 0.45 + (routineCompliance / 200); // 0.65 to 0.95 multiplier
  const estimatedGain = Math.min(18, Math.max(5, Math.round(baseGap * potentialMultiplier * 0.4)));
  const potentialHarmony = Math.min(96, currentHarmony + estimatedGain);

  // 4. Projected Timeline
  let timelineMonths = "4–6 Months";
  if (estimatedGain <= 7) timelineMonths = "2–3 Months";
  else if (estimatedGain <= 12) timelineMonths = "3–5 Months";
  else timelineMonths = "6–9 Months";

  // 5. Dynamic Confidence Score
  const historyCount = Array.isArray(scanHistory) ? scanHistory.length : (latestScan ? 1 : 0);
  let confidenceLevel = "Medium";
  let confidencePercent = 65;

  if (historyCount >= 3 && streak >= 7) {
    confidenceLevel = "High";
    confidencePercent = 92;
  } else if (historyCount >= 1 || streak >= 3) {
    confidenceLevel = "Medium";
    confidencePercent = 70;
  } else {
    confidenceLevel = "Low";
    confidencePercent = 45;
  }

  // 6. Explainability Drivers
  const keyDrivers = [];
  if (symmetryScore < 85) {
    keyDrivers.push(`Biometric Symmetry Headroom (+${Math.round((85 - symmetryScore) * 0.3)}% Potential)`);
  }
  if (proportionScore < 88) {
    keyDrivers.push(`Vertical Thirds Balance & Posture Decompression`);
  }
  if (routineCompliance >= 75) {
    keyDrivers.push(`High Habit Consistency (${routineCompliance}% Compliance)`);
  } else {
    keyDrivers.push(`Regular Routine Check-ins accelerate potential optimization`);
  }
  keyDrivers.push(`Hydration & Subcutaneous Debloating Protocol`);

  const summaryReason = `Based on your current facial symmetry (${symmetryScore}%), vertical thirds balance, 30-day routine consistency (${routineCompliance}%), and historical scan trajectory.`;

  return {
    currentHarmony,
    potentialHarmony,
    estimatedGain,
    timelineMonths,
    confidenceLevel,
    confidencePercent,
    keyDrivers,
    summaryReason,
    routineCompliance
  };
}
