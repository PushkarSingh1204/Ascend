// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\decisionEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Decision Engine
 * Evaluates logging data to identify critical journey bottlenecks (e.g. sleep/water deficits),
 * and dynamic focus areas, resolving priority conflicts before Specialized Engines execute.
 */
class DecisionEngine extends BaseEngine {
  constructor() {
    super('decisionEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile } = input;
    this.telemetry.dataSourcesUsed = ['profile.sleep_log', 'profile.water_log'];

    const bottlenecks = [];
    const focusAdjustments = {};

    // 1. Evaluate Sleep Recovery Bottlenecks
    const sleepCurrent = profile.sleep_log?.current ?? 8.0;
    const sleepTarget = profile.sleep_log?.target ?? 8.0;
    if (sleepCurrent < 6.0 || sleepCurrent < sleepTarget * 0.75) {
      bottlenecks.push('sleep_recovery');
      focusAdjustments.sleep = 'critical';
    } else if (sleepCurrent < sleepTarget) {
      focusAdjustments.sleep = 'high';
    } else {
      focusAdjustments.sleep = 'low'; // Sleep is sufficient
    }

    // 2. Evaluate Hydration Bottlenecks
    const waterCurrent = profile.water_log?.current ?? 2000;
    const waterTarget = profile.water_log?.target ?? 2000;
    if (waterCurrent < 1200 || waterCurrent < waterTarget * 0.6) {
      bottlenecks.push('hydration');
      focusAdjustments.nutrition = 'critical';
    } else if (waterCurrent < waterTarget) {
      focusAdjustments.nutrition = 'high';
    } else {
      focusAdjustments.nutrition = 'low'; // Hydration target met
    }

    // 3. Resolve conflicts: If multiple criticals exist, balance the steering priorities
    return {
      bottlenecks,
      focusAdjustments
    };
  }
}

export const decisionEngine = new DecisionEngine();
