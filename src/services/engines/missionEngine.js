// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\missionEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Mission Engine
 * Creates daily tasks (Checkin, Sleep log, Water log, Skincare steps, Journal reflections),
 * assigning priority scores and XP rewards based on progress.
 */
class MissionEngine extends BaseEngine {
  constructor() {
    super('missionEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, decision = {} } = input;
    this.telemetry.dataSourcesUsed = ['profile.daily_missions', 'decision.focusAdjustments'];

    const userMissions = profile.daily_missions || { checkin: false, sleep: false, water: false, skincare: false, journal: false };
    const focus = decision.focusAdjustments || {};

    const missionsList = [
      {
        id: 'mission_checkin',
        title: 'Daily Check-in',
        description: 'Complete your active mood and progress check-in to maintain your logging streak.',
        completed: !!userMissions.checkin,
        xp: 50,
        priority: 'high'
      },
      {
        id: 'mission_water',
        title: 'Reach Hydration Target',
        description: 'Log your hydration progress and drink enough water to meet your daily cellular intake target.',
        completed: !!userMissions.water,
        xp: 30,
        priority: focus.nutrition === 'critical' ? 'critical' : 'high'
      },
      {
        id: 'mission_sleep',
        title: 'Reach Sleep Target',
        description: 'Log sleep hours and aim for sufficient rest to ensure proper overnight cellular repair.',
        completed: !!userMissions.sleep,
        xp: 40,
        priority: focus.sleep === 'critical' ? 'critical' : 'high'
      },
      {
        id: 'mission_skincare',
        title: 'Complete Skincare Cycle',
        description: 'Perform all daily skincare checklist items (morning wash, SPF, night moisturizing).',
        completed: !!userMissions.skincare,
        xp: 30,
        priority: focus.skincare === 'critical' ? 'critical' : 'medium'
      },
      {
        id: 'mission_journal',
        title: 'Log Reflection Journal',
        description: 'Write down a brief self-reflection post in your transformation journal to log mindset.',
        completed: !!userMissions.journal,
        xp: 40,
        priority: 'medium'
      }
    ];

    return missionsList;
  }
}

export const missionEngine = new MissionEngine();
