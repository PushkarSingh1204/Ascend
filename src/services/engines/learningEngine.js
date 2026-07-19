// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\learningEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Learning Engine
 * Analyzes user history (ignored topics, completed categories, high engagement areas)
 * to adjust scoring weights, so recommendations adapt over time.
 */
class LearningEngine extends BaseEngine {
  constructor() {
    super('learningEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile } = input;
    this.telemetry.dataSourcesUsed = ['profile.recommendation_memory', 'profile.recommendation_feedback'];

    const memory = profile.recommendation_memory || {};
    const feedback = profile.recommendation_feedback || {};

    const categoryModifiers = {
      skincare: 1.0,
      fitness: 1.0,
      posture: 1.0,
      sleep: 1.0,
      nutrition: 1.0
    };

    // Calculate modification factors based on completion history
    Object.keys(memory).forEach(recId => {
      const recData = memory[recId];
      const category = recId.split('_')[0]; // simple ID convention: category_action
      
      if (categoryModifiers[category] !== undefined) {
        if (recData.status === 'completed') {
          // Boost completed categories slightly to encourage momentum
          categoryModifiers[category] += 0.05;
        } else if (recData.status === 'dismissed') {
          // Lower score for dismissed categories
          categoryModifiers[category] -= 0.10;
        }
      }
    });

    // Factor in explicit feedback Likes/Dislikes
    Object.keys(feedback).forEach(recId => {
      const type = feedback[recId];
      const category = recId.split('_')[0];
      
      if (categoryModifiers[category] !== undefined) {
        if (type === 'helpful') {
          categoryModifiers[category] += 0.15;
        } else if (type === 'not_helpful' || type === 'not_relevant') {
          categoryModifiers[category] -= 0.20;
        }
      }
    });

    // Prevent extreme deviations: clamp multipliers between 0.50 and 1.80
    Object.keys(categoryModifiers).forEach(cat => {
      categoryModifiers[cat] = Math.min(1.80, Math.max(0.50, categoryModifiers[cat]));
    });

    return categoryModifiers;
  }
}

export const learningEngine = new LearningEngine();
