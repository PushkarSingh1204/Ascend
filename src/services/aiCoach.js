// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\aiCoach.js

/**
 * AI Coach Service Layer
 * Abstracts coaching responses to support seamless transitions between mock engines 
 * and external API endpoints (OpenAI, Gemini, Claude, or local LLMs) without UI edits.
 */

// Heuristic response generator
const generateMockResponse = (query, currentData = {}) => {
  const q = query.toLowerCase();
  
  // 1. Safety Guardrail: Medical Disclaimer
  const medicalKeywords = [
    'pain', 'hurt', 'acne', 'disease', 'medicine', 'doctor', 'dermatologist', 
    'pimple', 'scars', 'swelling', 'bleed', 'infect', 'diagnose', 'surgery'
  ];
  if (medicalKeywords.some(keyword => q.includes(keyword))) {
    return "Disclaimer: I am your AI self-improvement coach. For medical concerns, skin diagnostics, or persistent discomfort, always consult a qualified physician or dermatologist. Let's focus on healthy, non-invasive daily habits to support your goals: maintaining a gentle cleansing cycle, broad-spectrum sunscreen protection, and optimal hydration to support skin vitality.";
  }

  // 2. Scan Analysis Explanations
  if (q.includes('scan') || q.includes('analysis') || q.includes('harmony') || q.includes('symmetry')) {
    const score = currentData.latestAnalysis?.facial_harmony_score || 72;
    const label = currentData.latestAnalysis?.potential_label || 'MTN (Mid Tier Normal)';
    
    return `Looking at your latest harmony scan, your Facial Harmony Score is evaluated at ${score}% (classified as ${label}). \n\nRemember, these metrics are geometric estimates processed entirely on your device. To improve facial balance naturally, prioritize:
1. **Masseter Muscle Symmetry:** Focus on chewing food evenly on both sides of your mouth.
2. **Postural Alignment:** Maintain correct resting tongue posture (mewing) against the roof of the mouth and do daily chin-tucks to eliminate forward head neck slouching.`;
  }

  // 3. Progress / Streak Summaries
  if (q.includes('streak') || q.includes('progress') || q.includes('xp') || q.includes('level')) {
    const levelVal = currentData.level || 8;
    const streakVal = currentData.streak || 7;
    return `Fantastic consistency! You are currently at Level ${levelVal} with an active ${streakVal}-day streak. \n\nConsistency is the primary driver of transformation. To optimize your daily missions:
- Check off your morning and night skincare routines.
- Log water intake immediately after workouts.
- Write a quick entry in your reflection journal to secure streak bonuses.`;
  }

  // 4. Skincare & Grooming Tips
  if (q.includes('skincare') || q.includes('skin') || q.includes('wash') || q.includes('cleanse')) {
    return "To maintain premium skin texture, adopt a disciplined daily grooming routine:\n1. **Double Cleanse:** Use a gentle oil cleanser at night to clear sebum, followed by a hydrating cleanser.\n2. **Barrier Protection:** Apply broad-spectrum SPF 30+ every morning to block UV collagen degradation.\n3. **Night recovery:** Apply a thin layer of moisturizer to lock in hydration while sleeping.";
  }

  // 5. Sleep & Recovery Tips
  if (q.includes('sleep') || q.includes('night') || q.includes('rest') || q.includes('tired')) {
    return "Optimal recovery directly impacts facial aesthetics (reducing fluid retention and dark circles):\n- Aim for 7.5 to 8.5 hours of deep sleep.\n- Sleep strictly on your back with a contour pillow to avoid unilateral sleep wrinkles and facial compression.\n- Shut down blue screens 1 hour before bed to support melatonin release.";
  }

  // Default Coaching Motivational Response
  return "Ascending is a daily compound effect. Focus on small, intentional shifts: posture alignment, water logs, and rest. What transformation milestone are we targeting today?";
};

/**
 * Main Service API for AI Coach
 * @param {string} query - User message
 * @param {Object} currentData - Context data (level, streak, latest scan scores, etc.)
 * @returns {Promise<string>}
 */
export const askCoach = async (query, currentData = {}) => {
  // Simulate network latency for premium SaaS feel
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = generateMockResponse(query, currentData);
      resolve(response);
    }, 1200);
  });

  /* 
  // FUTURE INTEGRATION: Switching to an API endpoint is simple:
  try {
    const response = await fetch('https://api.ascend.app/v1/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, userData: currentData })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Coach API error, falling back to heuristics...", error);
    return generateMockResponse(query, currentData);
  }
  */
};
