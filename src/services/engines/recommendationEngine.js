// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\recommendationEngine.js
import { BaseEngine } from './BaseEngine.js';
import { userContextEngine } from './userContextEngine.js';
import { environmentEngine } from './environmentEngine.js';
import { decisionEngine } from './decisionEngine.js';
import { planningEngine } from './planningEngine.js';
import { goalEngine } from './goalEngine.js';
import { faceInsightEngine } from './faceInsightEngine.js';
import { skincareEngine } from './skincareEngine.js';
import { hairEngine } from './hairEngine.js';
import { beardEngine } from './beardEngine.js';
import { glassesEngine } from './glassesEngine.js';
import { fashionEngine } from './fashionEngine.js';
import { nutritionEngine } from './nutritionEngine.js';
import { sleepEngine } from './sleepEngine.js';
import { fitnessEngine } from './fitnessEngine.js';
import { postureEngine } from './postureEngine.js';
import { productRecommendationEngine } from './productRecommendationEngine.js';
import { learningEngine } from './learningEngine.js';
import { confidenceEngine } from './confidenceEngine.js';
import { recommendationScoringEngine } from './recommendationScoringEngine.js';
import { recommendationMemory } from './recommendationMemory.js';
import { recommendationFeedbackEngine } from './recommendationFeedbackEngine.js';
import { recommendationCache } from './recommendationCache.js';

/**
 * Recommendation Engine Pipeline Manager
 * Orchestrates user context loading, decision steering, domain execution,
 * scoring calculations, memory filtering, and cached delivery.
 */
class RecommendationEngine extends BaseEngine {
  constructor() {
    super('recommendationEngine');
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Initialize all sub-engines (lazy loading datasets)
    await Promise.all([
      userContextEngine.initialize(),
      environmentEngine.initialize(),
      decisionEngine.initialize(),
      planningEngine.initialize(),
      goalEngine.initialize(),
      faceInsightEngine.initialize(),
      skincareEngine.initialize(),
      hairEngine.initialize(),
      beardEngine.initialize(),
      glassesEngine.initialize(),
      fashionEngine.initialize(),
      nutritionEngine.initialize(),
      sleepEngine.initialize(),
      fitnessEngine.initialize(),
      postureEngine.initialize(),
      productRecommendationEngine.initialize(),
      learningEngine.initialize(),
      confidenceEngine.initialize(),
      recommendationScoringEngine.initialize(),
      recommendationMemory.initialize(),
      recommendationFeedbackEngine.initialize()
    ]);

    this.initialized = true;
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Pipeline input must contain user profile state.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, latestAnalysis, waterLogs, sleepLogs, checkins, progressPhotos } = input;
    
    // Check Cache first
    const cacheKey = recommendationCache.generateKey(profile.uid, {
      streak: profile.streak,
      water: profile.water_log?.current,
      sleep: profile.sleep_log?.current,
      focus: profile.focus_area
    });
    
    const cachedData = recommendationCache.get(cacheKey);
    if (cachedData) {
      console.log('[Recommendation Engine] Serving recommendations from Cache.');
      return cachedData;
    }

    await this.initialize();

    // 1. Run context and environment prep
    const context = await userContextEngine.run({ profile });
    const env = await environmentEngine.run({ profile });
    const confidenceVal = await confidenceEngine.run({ profile, latestAnalysis, waterLogs, sleepLogs });

    // 2. Core steering and planning decision runs
    const decision = await decisionEngine.run({ profile });
    const planning = await planningEngine.run({ profile });
    const goal = await goalEngine.run({ profile });

    const runInputs = { profile, context, env, decision, planning, goal, latestAnalysis, waterLogs, sleepLogs };

    // 3. Execute domain-specific recommendation generators
    const specializedPromises = [
      skincareEngine.run(runInputs),
      hairEngine.run(runInputs),
      beardEngine.run(runInputs),
      glassesEngine.run(runInputs),
      fashionEngine.run(runInputs),
      nutritionEngine.run(runInputs),
      sleepEngine.run(runInputs),
      fitnessEngine.run(runInputs),
      postureEngine.run(runInputs),
      productRecommendationEngine.run(runInputs)
    ];

    if (latestAnalysis) {
      specializedPromises.push(faceInsightEngine.run(runInputs));
    }

    const rawOutputs = await Promise.all(specializedPromises);
    
    // Flatten and clean up duplicates
    let rawRecommendations = rawOutputs.flat().filter(r => r && typeof r === 'object' && r.id);

    // 4. Run Learning, Scoring, Feedback, and Memory filters
    const categoryModifiers = await learningEngine.run({ profile });
    
    // Pass to scoring engine
    let recommendations = await recommendationScoringEngine.run({
      recommendations: rawRecommendations,
      context,
      confidenceVal
    });

    // Apply learning modifiers to scores
    recommendations = recommendations.map(rec => {
      const modifier = categoryModifiers[rec.category] || 1.0;
      return {
        ...rec,
        score: Math.min(100, Math.round(rec.score * modifier)),
        confidence: confidenceVal
      };
    });

    // Sort again based on updated scores
    recommendations.sort((a, b) => b.score - a.score);

    // Memory and feedback filtering
    recommendations = await recommendationMemory.run({ profile, recommendations });
    recommendations = await recommendationFeedbackEngine.run({ profile, recommendations });

    // Cache final results
    recommendationCache.set(cacheKey, recommendations);

    return recommendations;
  }
}

export const recommendationEngine = new RecommendationEngine();
