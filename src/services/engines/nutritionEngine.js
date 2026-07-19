// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\nutritionEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Nutrition Engine
 * Calculates protein, hydration, and meal composition rules using nutrition.json.
 */
class NutritionEngine extends BaseEngine {
  constructor() {
    super('nutritionEngine');
    this.knowledge = null;
  }

  async initialize() {
    try {
      const module = await import('../knowledge/v1/categories/nutrition.json', { with: { type: 'json' } });
      this.knowledge = module.default;
    } catch (err) {
      console.warn('[Nutrition Engine] Failed to load nutrition knowledge base.', err);
    }
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile } = input;
    this.telemetry.dataSourcesUsed = ['nutrition.json'];

    const weightKg = parseFloat(profile.weight) || 70;
    const activeLevel = profile.gym_access ? 'Gym' : 'HomeWorkouts';
    const multiplier = this.knowledge?.proteinMultiplier?.[activeLevel] || 1.2;
    const proteinTarget = Math.round(weightKg * multiplier);

    const baseWater = this.knowledge?.hydrationTarget?.baseMl || 2000;
    const exerciseAdd = profile.gym_access ? (this.knowledge?.hydrationTarget?.gymAdditionMl || 750) : 0;
    const waterTarget = baseWater + exerciseAdd;

    const suggestions = [
      {
        id: 'nutrition_protein',
        category: 'nutrition',
        title: `Reach ${proteinTarget}g Protein Daily`,
        description: `Ensure you consume at least ${proteinTarget}g protein spread across your meals to support muscle and skin cell structure.`,
        reason: `Calculated from your weight of ${weightKg}kg and lifestyle level: ${activeLevel}.`,
        priority: 'high',
        impact: 4,
        difficulty: 'medium',
        estimatedTime: '15 mins'
      },
      {
        id: 'nutrition_hydration',
        category: 'nutrition',
        title: `Target ${waterTarget}ml Water Intake`,
        description: `Drink at least ${waterTarget}ml of water throughout the day to support skin elasticity and cell recovery.`,
        reason: `Includes base needs plus active exercise additions of ${exerciseAdd}ml.`,
        priority: 'high',
        impact: 5,
        difficulty: 'easy',
        estimatedTime: '2 mins'
      }
    ];

    return suggestions;
  }
}

export const nutritionEngine = new NutritionEngine();
