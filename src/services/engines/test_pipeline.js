import { recommendationEngine } from './recommendationEngine.js';
import { aiCoachEngine } from './aiCoachEngine.js';

// Setup basic environment variables for imports to resolve
global.console.log = Object.assign(console.log.bind(console), {
  warn: console.warn.bind(console),
  error: console.error.bind(console)
});

async function runTest() {
  console.log('==================================================');
  console.log('ASCEND INTELLIGENCE PIPELINE INTEGRATION TEST');
  console.log('==================================================\n');

  // Mock User Profile data simulating a user with low sleep but strong posture focus
  const mockProfile = {
    uid: 'test_user_123',
    name: 'Test Transformer',
    age: 24,
    gender: 'Male',
    focus_area: 'Face',
    goal: 'Jawline Definition',
    skin_type: 'Oily',
    gym_access: true,
    streak: 4,
    days_to_ascend: 12,
    sleep_log: { current: 5.5, target: 8.0 }, // Sleep deficit
    water_log: { current: 1500, target: 2500 }, // Water deficit
    routines: {
      morning: [{ id: 'm1', completed: true }],
      night: [{ id: 'n1', completed: false }]
    },
    recommendation_memory: {
      'skincare_cleanse': { status: 'completed' } // Completed skin actions
    },
    recommendation_feedback: {
      'sleep_hours': 'helpful' // Liked sleep advice
    }
  };

  const mockAnalysis = {
    facial_harmony_score: 72,
    symmetry_score: 68, // Symmetry deficit
    facial_proportion_score: 74,
    features: {
      jawline: { score: 65 }
    }
  };

  try {
    console.log('[Test] Running pipeline orchestrator...');
    const startTime = Date.now();
    
    const recommendations = await recommendationEngine.run({
      profile: mockProfile,
      latestAnalysis: mockAnalysis,
      waterLogs: [],
      sleepLogs: [],
      checkins: [],
      progressPhotos: []
    });

    const elapsed = Date.now() - startTime;
    console.log(`[Success] Pipeline finished in ${elapsed}ms!\n`);

    console.log('--- TELEMETRY REPORT ---');
    console.log(JSON.stringify(recommendationEngine.getTelemetry(), null, 2));
    console.log('\n--- TOP 3 PRIORITY RECOMMENDATIONS GENERATED ---');
    
    recommendations.slice(0, 3).forEach((rec, idx) => {
      console.log(`\n${idx + 1}. [${rec.category.toUpperCase()}] ${rec.title} (Priority Score: ${rec.score})`);
      console.log(`   Description: ${rec.description}`);
      console.log(`   Explainability: ${rec.reason}`);
      console.log(`   Impact Metric: ${rec.impact}/5 | Confidence: ${Math.round((rec.confidence || 0) * 100)}%`);
    });

    console.log('\n--- AI COACH DIALOG TEST ("tell me my routine") ---');
    const coachResponse = await aiCoachEngine.run({
      query: 'tell me my routine',
      recommendations,
      profile: mockProfile
    });
    console.log(coachResponse);

    console.log('\n==================================================');
  } catch (err) {
    console.error('[Error] Pipeline failed to execute:', err);
  }
}

runTest();
