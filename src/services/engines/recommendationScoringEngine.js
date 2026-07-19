// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\recommendationScoringEngine.js
import { BaseEngine } from './BaseEngine.js';

// Static fallbacks for weights in case rules files fail to load
const DEFAULT_PRIORITY_WEIGHTS = { critical: 100, high: 80, medium: 50, low: 20 };
const DEFAULT_CATEGORY_WEIGHTS = {
  posture: 1.2, skincare: 1.0, fitness: 1.1, nutrition: 1.0, sleep: 1.3,
  hair: 0.8, beard: 0.8, glasses: 0.7, fashion: 0.7
};
const DEFAULT_DIFFICULTY_PENALTIES = { easy: 0, medium: 10, hard: 25 };

/**
 * Recommendation Scoring Engine
 * Sorts and weights raw recommendation structures according to user goals,
 * urgency, estimated impact, confidence, and difficulty factors.
 */
class RecommendationScoringEngine extends BaseEngine {
  constructor() {
    super('recommendationScoringEngine');
    this.priorityWeights = DEFAULT_PRIORITY_WEIGHTS;
    this.categoryWeights = DEFAULT_CATEGORY_WEIGHTS;
    this.difficultyPenalties = DEFAULT_DIFFICULTY_PENALTIES;
  }

  async initialize() {
    try {
      // Lazy load rules to separate data from logic
      const priorityModule = await import('../knowledge/v1/rules/priority.json');
      const difficultyModule = await import('../knowledge/v1/rules/difficulty.json');
      
      this.priorityWeights = priorityModule.default?.priorityWeights || DEFAULT_PRIORITY_WEIGHTS;
      this.categoryWeights = priorityModule.default?.categoryWeights || DEFAULT_CATEGORY_WEIGHTS;
      this.difficultyPenalties = difficultyModule.default?.difficultyPenalties || DEFAULT_DIFFICULTY_PENALTIES;
    } catch (err) {
      console.warn('[Scoring Engine] Failed to load JSON rule files. Using fallback defaults.', err);
    }
  }

  validate(input) {
    if (!input || !Array.isArray(input.recommendations)) {
      return { isValid: false, errors: ['Input must contain a recommendations array.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { recommendations, context = {}, confidenceVal = 0.8 } = input;
    this.telemetry.dataSourcesUsed = ['rules/priority.json', 'rules/difficulty.json'];

    const scoredRecs = recommendations.map(rec => {
      // 1. Base priority points
      const priorityStr = rec.priority || 'medium';
      const basePriorityPoints = this.priorityWeights[priorityStr.toLowerCase()] || 50;

      // 2. Category multiplier
      const catKey = (rec.category || '').toLowerCase();
      const categoryMult = this.categoryWeights[catKey] || 1.0;

      // 3. Goal Alignment modifier
      let goalAlignmentPoints = 0;
      const targetGoal = (context.goal || '').toLowerCase();
      const targetFocus = (context.focusArea || '').toLowerCase();
      
      if (catKey === targetFocus || (targetGoal && rec.title.toLowerCase().includes(targetGoal))) {
        goalAlignmentPoints = 25; // +25 point alignment bonus
      }

      // 4. Difficulty/Effort Penalty
      const difficultyStr = rec.difficulty || 'medium';
      const difficultyPenalty = this.difficultyPenalties[difficultyStr.toLowerCase()] || 10;
      
      // Calculate composite score
      const impactVal = parseInt(rec.impact) || 3; // 1-5 scale
      const impactPoints = impactVal * 15; // Up to 75 points
      
      const rawScore = (basePriorityPoints * 0.4) + (impactPoints * 0.3) + (goalAlignmentPoints * 0.2) + (confidenceVal * 10) - (difficultyPenalty * 0.1);
      const finalScore = Math.max(1, Math.min(100, Math.round(rawScore * categoryMult)));

      return {
        ...rec,
        score: finalScore,
        lastUpdated: new Date().toISOString()
      };
    });

    // Sort descending by calculated score
    return scoredRecs.sort((a, b) => b.score - a.score);
  }
}

export const recommendationScoringEngine = new RecommendationScoringEngine();
