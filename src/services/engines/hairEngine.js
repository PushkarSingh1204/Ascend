// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\hairEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Hair Engine
 * Proposes haircuts, scalp care, and wash schedules based on face shape
 * proportions and hair attributes using hair.json.
 */
class HairEngine extends BaseEngine {
  constructor() {
    super('hairEngine');
    this.knowledge = null;
  }

  async initialize() {
    try {
      const module = await import('../knowledge/v1/categories/hair.json', { with: { type: 'json' } });
      this.knowledge = module.default;
    } catch (err) {
      console.warn('[Hair Engine] Failed to load hair knowledge base.', err);
    }
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, latestAnalysis } = input;
    this.telemetry.dataSourcesUsed = ['hair.json', 'profile.hair_type'];

    // In a real system, we'd determine face shape dynamically. Fallback to Round/Oval.
    const faceShape = latestAnalysis?.facial_proportion_score < 72 ? 'Round' : 'Oval';
    const matchAdvice = this.knowledge?.faceShapeMatches?.[faceShape] || 'Select clean crops to emphasize jaw outline.';
    const washAdvice = this.knowledge?.washRules?.[profile.hair_type || 'Dry'] || 'Wash 2-3 times/week.';

    const suggestions = [
      {
        id: 'hair_cut',
        category: 'hair',
        title: 'Opt for face-shape matching haircut',
        description: matchAdvice,
        reason: `Based on your facial thirds proportions suggesting an ${faceShape} outline.`,
        priority: 'medium',
        impact: 3,
        difficulty: 'medium',
        estimatedTime: '30 mins'
      },
      {
        id: 'hair_wash',
        category: 'hair',
        title: 'Adjust hair wash frequency',
        description: washAdvice,
        reason: `Tailored to your logged hair type: ${profile.hair_type || 'Dry'}.`,
        priority: 'medium',
        impact: 3,
        difficulty: 'easy',
        estimatedTime: '5 mins'
      }
    ];

    return suggestions;
  }
}

export const hairEngine = new HairEngine();
