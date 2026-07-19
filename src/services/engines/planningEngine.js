// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\planningEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Planning Engine
 * Formulates structured 30/60/90 day roadmaps and sequences focus milestones,
 * ensuring users establish habits incrementally instead of facing cognitive overload.
 */
class PlanningEngine extends BaseEngine {
  constructor() {
    super('planningEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile } = input;
    this.telemetry.dataSourcesUsed = ['profile.focus_area', 'profile.createdAt'];

    const focusArea = profile.focus_area || 'Face';
    
    // Determine user's current day in the program
    const createdAt = profile.createdAt?.seconds ? new Date(profile.createdAt.seconds * 1000) : new Date();
    const daysActive = Math.max(1, Math.round((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
    
    // 30-Day Plan Sequence:
    // Week 1 (Days 1-7): Foundations & Posture Baseline
    // Week 2 (Days 8-14): Hydration & Muscle Targets
    // Week 3 (Days 15-21): Skincare & Bedtime Rhythm
    // Week 4 (Days 22-30): Peak Consistency Alignment
    let currentWeek = 1;
    if (daysActive > 21) currentWeek = 4;
    else if (daysActive > 14) currentWeek = 3;
    else if (daysActive > 7) currentWeek = 2;

    const weeklyPriorities = {
      1: { focus: 'Posture Baseline', text: 'Focus on setting morning/night routines and correcting head/neck posture.' },
      2: { focus: 'Muscle & Hydration', text: 'Focus on hitting daily water targets and muscle toning exercises.' },
      3: { focus: 'Rest & Skincare', text: 'Establish deep recovery sleep windows and specialized skincare cycles.' },
      4: { focus: 'Peak Consistency', text: 'Maximize consistency streaks and complete final milestone scans.' }
    };

    return {
      currentWeek,
      daysActive,
      planLengthDays: 30,
      activePhaseName: weeklyPriorities[currentWeek]?.focus || 'Foundations',
      phaseInstructions: weeklyPriorities[currentWeek]?.text || '',
      milestoneDependencySatisfied: currentWeek === 1 ? true : false // Used to restrict lock state
    };
  }
}

export const planningEngine = new PlanningEngine();
