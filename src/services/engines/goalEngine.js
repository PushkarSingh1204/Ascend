// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\goalEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Goal Engine
 * Adjusts milestone weights, daily missions, and category coefficients
 * when the user changes goals or focus areas.
 */
class GoalEngine extends BaseEngine {
  constructor() {
    super('goalEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile } = input;
    this.telemetry.dataSourcesUsed = ['profile.focus_area', 'profile.goal'];

    const focusArea = profile.focus_area || 'Face';
    const goal = profile.goal || 'General Alignment';

    // Output adjustments
    const categoryWeightsModifier = {
      skincare: 1.0,
      fitness: 1.0,
      posture: 1.0,
      sleep: 1.0
    };

    if (focusArea === 'Face') {
      categoryWeightsModifier.skincare = 1.3;
      categoryWeightsModifier.posture = 1.2;
    } else if (focusArea === 'Fitness') {
      categoryWeightsModifier.fitness = 1.4;
      categoryWeightsModifier.posture = 1.1;
    } else if (focusArea === 'Grooming') {
      categoryWeightsModifier.skincare = 1.3;
    }

    return {
      focusArea,
      goal,
      categoryWeightsModifier
    };
  }
}

export const goalEngine = new GoalEngine();
