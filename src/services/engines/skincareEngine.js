// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\skincareEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Skincare Engine
 * Maps skin types and environmental offsets to curated skincare routines
 * and active ingredients using skincare.json.
 */
class SkincareEngine extends BaseEngine {
  constructor() {
    super('skincareEngine');
    this.knowledge = null;
  }

  async initialize() {
    try {
      const module = await import('../knowledge/v1/categories/skincare.json', { with: { type: 'json' } });
      this.knowledge = module.default;
    } catch (err) {
      console.warn('[Skincare Engine] Failed to load skincare knowledge base.', err);
    }
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, env = {} } = input;
    this.telemetry.dataSourcesUsed = ['skincare.json', 'profile.skin_type'];

    const skinType = profile.skin_type || 'Normal';
    const skinRules = this.knowledge?.skinTypes?.[skinType] || { cleanser: 'Gentle Cleanser', moisturizer: 'Daily Moisturizer', avoid: [] };
    const climateRules = this.knowledge?.climateAdjustments?.[env.humidity] || { spf: 'Daily Sunscreen SPF 30', moisturizerOverride: null };

    const suggestions = [];

    // 1. Cleanser suggestion
    suggestions.push({
      id: 'skin_cleanser',
      category: 'skincare',
      title: `Use ${skinRules.cleanser}`,
      description: `Cleanse face thoroughly every night and morning using a ${skinRules.cleanser.toLowerCase()} to remove impurities.`,
      reason: `Suggested because you have ${skinType} skin type.`,
      priority: 'high',
      impact: 4,
      difficulty: 'easy',
      estimatedTime: '2 mins'
    });

    // 2. Moisturizer suggestion (adjusting for environment)
    const moisturizerType = climateRules.moisturizerOverride || skinRules.moisturizer;
    suggestions.push({
      id: 'skin_moisturizer',
      category: 'skincare',
      title: `Apply ${moisturizerType}`,
      description: `Apply a layer of ${moisturizerType.toLowerCase()} after cleansing to support skin barrier recovery.`,
      reason: `Adjusted for ${skinType} skin under ${env.humidity || 'normal'} climate conditions.`,
      priority: 'high',
      impact: 4,
      difficulty: 'easy',
      estimatedTime: '1 min'
    });

    // 3. SPF suggestion
    suggestions.push({
      id: 'skin_spf',
      category: 'skincare',
      title: `Apply ${climateRules.spf}`,
      description: `Use a broad-spectrum sunscreen with SPF 30+ every single morning to prevent photoaging.`,
      reason: `Critical daily protection target for ${env.season || 'summer'} season.`,
      priority: 'high',
      impact: 5,
      difficulty: 'easy',
      estimatedTime: '1 min'
    });

    return suggestions;
  }
}

export const skincareEngine = new SkincareEngine();
