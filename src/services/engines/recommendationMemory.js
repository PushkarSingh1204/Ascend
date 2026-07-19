// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\recommendationMemory.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Recommendation Memory Engine
 * Tracks Shown, Completed, Dismissed, and Habituated lifecycles.
 * Integrates directly with historical logging to fade out completed habits.
 */
class RecommendationMemory extends BaseEngine {
  constructor() {
    super('recommendationMemory');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, recommendations = [] } = input;
    this.telemetry.dataSourcesUsed = ['profile.recommendation_memory'];

    const memory = profile.recommendation_memory || {};
    
    // Memory schema: { [recId]: { status: 'completed'|'dismissed'|'habituated', count: number, lastUpdated: string } }
    const filteredRecs = recommendations.filter(rec => {
      const recMemory = memory[rec.id];
      if (recMemory) {
        // If dismissed, do not display in the active feed
        if (recMemory.status === 'dismissed') {
          return false;
        }
        
        // If already marked as a fully habituated (maintained) habit, filter it out of daily chores
        if (recMemory.status === 'habituated') {
          return false;
        }

        // Optional: If completed today, keep it in the list but set completed flag
        if (recMemory.status === 'completed') {
          const todayStr = new Date().toISOString().split('T')[0];
          const isCompletedToday = recMemory.lastUpdated === todayStr;
          rec.completed = isCompletedToday;
        }
      }
      return true;
    });

    return filteredRecs;
  }
}

export const recommendationMemory = new RecommendationMemory();
