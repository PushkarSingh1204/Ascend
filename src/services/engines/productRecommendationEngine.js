// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\productRecommendationEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Product Recommendation Engine
 * Maps user context (e.g. Low vs. High budget preferences) to products.json.
 */
class ProductRecommendationEngine extends BaseEngine {
  constructor() {
    super('productRecommendationEngine');
    this.knowledge = null;
  }

  async initialize() {
    try {
      const module = await import('../knowledge/v1/products/products.json');
      this.knowledge = module.default;
    } catch (err) {
      console.warn('[Product Engine] Failed to load products knowledge base.', err);
    }
  }

  validate(input) {
    if (!input || !input.context) {
      return { isValid: false, errors: ['Input must contain a user context object.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { context } = input;
    this.telemetry.dataSourcesUsed = ['products.json', 'context.budget'];

    const userBudget = context.budget || 'Medium';
    const allProducts = this.knowledge?.products || [];

    // Filter products matching user budget level and categories
    const matchingProducts = allProducts.filter(p => {
      // If user is Low budget, suggest only Low budget products.
      // If user is High budget, suggest High budget.
      // Medium budget can see both.
      if (userBudget === 'Low') {
        return p.priceTier === 'Low';
      }
      if (userBudget === 'High') {
        return p.priceTier === 'High';
      }
      return true; // Medium sees all
    });

    return matchingProducts.map(p => ({
      id: p.id,
      category: p.category,
      title: `Recommended: ${p.name}`,
      description: p.benefits,
      reason: p.reason,
      priority: p.priority || 'medium',
      cost: p.cost
    }));
  }
}

export const productRecommendationEngine = new ProductRecommendationEngine();
