// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\userContextEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * User Context Engine
 * Standardizes raw user profile properties (Age, Budget, Focus, Goals) into a normalized context.
 */
class UserContextEngine extends BaseEngine {
  constructor() {
    super('userContextEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile object.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const profile = input.profile;
    this.telemetry.dataSourcesUsed = ['profile'];

    // Map budget string to standardized limits
    const rawBudget = (profile.budget_preference || 'Medium').trim();
    let budgetTier = 'Medium';
    if (['low', 'budget', 'affordable'].includes(rawBudget.toLowerCase())) {
      budgetTier = 'Low';
    } else if (['high', 'premium', 'luxury'].includes(rawBudget.toLowerCase())) {
      budgetTier = 'High';
    }

    // Standardize goals and focus areas
    const focusArea = profile.focus_area || 'Face';
    const rawGoal = profile.goal || 'General Alignment';
    
    // Normalize age
    const age = parseInt(profile.age) || 24;

    const context = {
      uid: profile.uid || 'guest',
      age,
      gender: profile.gender || 'Male',
      budget: budgetTier,
      focusArea,
      goal: rawGoal,
      lifestyle: {
        gymAccess: !!profile.gym_access,
        screenTimeHours: parseInt(profile.daily_screentime) || 6,
        workoutFrequencyDays: parseInt(profile.workout_frequency) || 3
      }
    };

    return context;
  }
}

export const userContextEngine = new UserContextEngine();
