// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\glassesEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Glasses Engine
 * Proposes optical frames and styles to balance face proportion features using glasses.json.
 */
class GlassesEngine extends BaseEngine {
  constructor() {
    super('glassesEngine');
    this.knowledge = null;
  }

  async initialize() {
    try {
      const module = await import('../knowledge/v1/categories/glasses.json');
      this.knowledge = module.default;
    } catch (err) {
      console.warn('[Glasses Engine] Failed to load glasses knowledge base.', err);
    }
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { latestAnalysis } = input;
    this.telemetry.dataSourcesUsed = ['glasses.json'];

    const propScore = latestAnalysis?.facial_proportion_score ?? 70;
    const styleAdvice = propScore < 75 
      ? (this.knowledge?.faceShapeFrames?.Round || 'Wear rectangular frames.')
      : (this.knowledge?.faceShapeFrames?.Square || 'Wear rounder wireframes.');

    const suggestions = [
      {
        id: 'glasses_frame',
        category: 'glasses',
        title: 'Choose frame shape matching face structure',
        description: styleAdvice,
        reason: 'Selected to balance facial width and vertical proportion lines.',
        priority: 'low',
        impact: 2,
        difficulty: 'easy',
        estimatedTime: '15 mins'
      }
    ];

    return suggestions;
  }
}

export const glassesEngine = new GlassesEngine();
