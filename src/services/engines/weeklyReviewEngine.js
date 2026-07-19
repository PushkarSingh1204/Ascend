// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\weeklyReviewEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Weekly Review Engine
 * Synthesizes a weekly report based on check-ins, routine completions, and goals.
 */
class WeeklyReviewEngine extends BaseEngine {
  constructor() {
    super('weeklyReviewEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, checkins = [] } = input;
    this.telemetry.dataSourcesUsed = ['profile.streak', 'checkins'];

    const wins = [];
    const weaknesses = [];

    // Calculate completions this week
    const activeStreak = profile.streak || 0;
    if (activeStreak >= 5) {
      wins.push(`Maintained an active streak of ${activeStreak} days. Your consistency is superior.`);
    } else {
      weaknesses.push('Check-in consistency fell this week. Try setting daily alarms to build frequency.');
    }

    const waterLog = profile.water_log || { current: 0, target: 2000 };
    if (waterLog.current >= waterLog.target) {
      wins.push('Met your daily hydration targets consistently. Skin turgor and cell hydration levels are balanced.');
    } else {
      weaknesses.push('Hydration intake is lower than optimal. Keep a water bottle at your desk.');
    }

    return {
      wins,
      weaknesses,
      reviewCompleted: checkins.length >= 7,
      nextWeekFocus: profile.focus_area || 'Face'
    };
  }
}

export const weeklyReviewEngine = new WeeklyReviewEngine();
