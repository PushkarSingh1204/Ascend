// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\sleepEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Sleep Engine
 * Evaluates sleep logs to recommend circadian adjustments and bedtime rituals using sleep.json.
 */
class SleepEngine extends BaseEngine {
  constructor() {
    super('sleepEngine');
    this.knowledge = null;
  }

  async initialize() {
    try {
      const module = await import('../knowledge/v1/categories/sleep.json', { with: { type: 'json' } });
      this.knowledge = module.default;
    } catch (err) {
      console.warn('[Sleep Engine] Failed to load sleep knowledge base.', err);
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
    this.telemetry.dataSourcesUsed = ['sleep.json'];

    const sleepLog = profile.sleep_log || { current: 0, target: 8.0 };
    const sleepCurrent = sleepLog.current || 0;
    const sleepTarget = sleepLog.target || 8.0;

    const suggestions = [];

    if (sleepCurrent < sleepTarget * 0.8) {
      suggestions.push({
        id: 'sleep_hours',
        category: 'sleep',
        title: `Increase Rest to ${sleepTarget} Hours`,
        description: 'Prioritize an earlier wind-down routine tonight. Sleep is critical for growth hormone release and facial tissue regeneration.',
        reason: `Your last logged sleep of ${sleepCurrent}h is below your target of ${sleepTarget}h.`,
        priority: 'high',
        impact: 5,
        difficulty: 'medium',
        estimatedTime: '8 hours'
      });
    }

    if (this.knowledge?.habits) {
      this.knowledge.habits.forEach((h, idx) => {
        suggestions.push({
          id: `sleep_habit_${idx}`,
          category: 'sleep',
          title: `Implement ${h.name}`,
          description: h.benefit,
          reason: 'General sleep hygiene habit for cognitive and skin restoration.',
          priority: 'medium',
          impact: 3,
          difficulty: 'easy',
          estimatedTime: '5 mins'
        });
      });
    }

    return suggestions;
  }
}

export const sleepEngine = new SleepEngine();
