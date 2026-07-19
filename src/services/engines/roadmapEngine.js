// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\roadmapEngine.js
import { BaseEngine } from './BaseEngine.js';

// Static templates fallback
const ROADMAP_TEMPLATES = {
  Face: [
    { id: 'rm_1', week: 1, title: 'Posture & Alignment', text: 'Complete daily chin-tucks and posture stretching for 5 days', completed: false },
    { id: 'rm_2', week: 1, title: 'Nasal Breathing', text: 'Practice continuous nasal breathing and mouth tape check', completed: false },
    { id: 'rm_3', week: 1, title: 'Hydration Base', text: 'Reach daily water intake target 5 times this week', completed: false },
    { id: 'rm_4', week: 2, title: 'Massage & Muscle Tone', text: 'Perform masseter muscle massage twice to relieve tension', completed: false },
    { id: 'rm_5', week: 2, title: 'Cold Face Rinses', text: 'Rinse face with cold water every morning to reduce puffiness', completed: false },
    { id: 'rm_6', week: 2, title: 'Daily Mewing Check', text: 'Check resting tongue posture 3 times daily', completed: false },
    { id: 'rm_7', week: 3, title: 'Sleep Hygiene', text: 'Aim for 8 hours of sleep for 5 nights this week', completed: false },
    { id: 'rm_8', week: 3, title: 'Consistent Skincare', text: 'Wash and moisturize face morning & night', completed: false },
    { id: 'rm_9', week: 3, title: 'Week 3 Progress Photo', text: 'Upload Week 3 progress photo to log timeline', completed: false },
    { id: 'rm_10', week: 4, title: 'Consistency Streak', text: 'Log active check-in 7 days straight', completed: false },
    { id: 'rm_11', week: 4, title: 'Reflective Journaling', text: 'Write 3 entries in your journal', completed: false },
    { id: 'rm_12', week: 4, title: 'Final Scan Comparison', text: 'Compare current harmony score with baseline', completed: false }
  ]
};

/**
 * Roadmap Engine
 * Generates the 30-day timeline track of milestones, locks, and progress indicators.
 */
class RoadmapEngine extends BaseEngine {
  constructor() {
    super('roadmapEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, planning = {} } = input;
    this.telemetry.dataSourcesUsed = ['profile.roadmap_milestones', 'profile.focus_area'];

    const focusArea = profile.focus_area || 'Face';
    const userMilestones = profile.roadmap_milestones || ROADMAP_TEMPLATES.Face;

    // Preserve completion status from db
    const activeMilestones = userMilestones.map(m => {
      const dbMatch = (profile.roadmap_milestones || []).find(dbM => dbM.id === m.id);
      return {
        ...m,
        completed: dbMatch ? !!dbMatch.completed : false
      };
    });

    return activeMilestones;
  }
}

export const roadmapEngine = new RoadmapEngine();
