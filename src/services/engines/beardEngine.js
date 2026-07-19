// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\beardEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Beard Engine
 * Generates beard style and grooming guidelines matching jaw symmetry
 * and face structures using beard.json.
 */
class BeardEngine extends BaseEngine {
  constructor() {
    super('beardEngine');
    this.knowledge = null;
  }

  async initialize() {
    try {
      const module = await import('../knowledge/v1/categories/beard.json');
      this.knowledge = module.default;
    } catch (err) {
      console.warn('[Beard Engine] Failed to load beard knowledge base.', err);
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
    this.telemetry.dataSourcesUsed = ['beard.json', 'scans.scores'];

    if (input.profile.gender === 'Female') return []; // Don't recommend beards to female profiles

    const symmetry = latestAnalysis?.symmetry_score ?? 70;
    const styleAdvice = symmetry < 75 
      ? (this.knowledge?.styles?.WeakJaw || 'Keep stubble symmetric.')
      : (this.knowledge?.styles?.StrongJaw || 'Keep clean stubble.');

    const suggestions = [
      {
        id: 'beard_style',
        category: 'beard',
        title: 'Align beard silhouette',
        description: styleAdvice,
        reason: `Suggested to balance your lateral symmetry score of ${symmetry}%.`,
        priority: 'medium',
        impact: 3,
        difficulty: 'medium',
        estimatedTime: '10 mins'
      }
    ];

    if (this.knowledge?.maintenance) {
      this.knowledge.maintenance.forEach((m, idx) => {
        suggestions.push({
          id: `beard_maint_${idx}`,
          category: 'beard',
          title: 'Beard maintenance routine step',
          description: m,
          reason: 'Daily grooming habit for uniform follicular thickness.',
          priority: 'low',
          impact: 2,
          difficulty: 'easy',
          estimatedTime: '2 mins'
        });
      });
    }

    return suggestions;
  }
}

export const beardEngine = new BeardEngine();
