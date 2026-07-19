// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\postureEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Posture Engine
 * Proposes shoulder, neck, and spinal alignment stretches and ergonomics using posture.json.
 */
class PostureEngine extends BaseEngine {
  constructor() {
    super('postureEngine');
    this.knowledge = null;
  }

  async initialize() {
    try {
      const module = await import('../knowledge/v1/categories/posture.json');
      this.knowledge = module.default;
    } catch (err) {
      console.warn('[Posture Engine] Failed to load posture knowledge base.', err);
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
    this.telemetry.dataSourcesUsed = ['posture.json'];

    const symmetry = latestAnalysis?.symmetry_score ?? 70;
    const activeGuideKey = symmetry < 75 ? 'ForwardNeck' : 'RoundedShoulders';
    const guideDetails = this.knowledge?.guides?.[activeGuideKey] || { exercises: [], ergonomics: '' };

    const suggestions = [
      {
        id: 'posture_exercises',
        category: 'posture',
        title: `Alignment Routine: ${activeGuideKey}`,
        description: `Complete posture alignment tasks: ${guideDetails.exercises.join(', ')}.`,
        reason: `Suggested to balance facial and neck symmetry (current score: ${symmetry}%).`,
        priority: 'high',
        impact: 4,
        difficulty: 'medium',
        estimatedTime: '10 mins'
      },
      {
        id: 'posture_ergonomics',
        category: 'posture',
        title: 'Adjust Desk Ergonomics',
        description: guideDetails.ergonomics,
        reason: 'Reduces strain on cervical spine during screen hours.',
        priority: 'medium',
        impact: 3,
        difficulty: 'easy',
        estimatedTime: '5 mins'
      }
    ];

    return suggestions;
  }
}

export const postureEngine = new PostureEngine();
