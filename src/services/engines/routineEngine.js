// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\routineEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Routine Engine
 * Assembles dynamic morning, night, skincare, and workout checklists using routines JSONs.
 */
class RoutineEngine extends BaseEngine {
  constructor() {
    super('routineEngine');
    this.morningData = null;
    this.nightData = null;
    this.workoutData = null;
  }

  async initialize() {
    try {
      this.morningData = (await import('../knowledge/v1/routines/morning.json', { with: { type: 'json' } })).default;
      this.nightData = (await import('../knowledge/v1/routines/night.json', { with: { type: 'json' } })).default;
      this.workoutData = (await import('../knowledge/v1/routines/workout.json', { with: { type: 'json' } })).default;
    } catch (err) {
      console.warn('[Routine Engine] Failed to load routine knowledge base files.', err);
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
    this.telemetry.dataSourcesUsed = ['morning.json', 'night.json', 'workout.json'];

    const userRoutines = profile.routines || {};

    // Standardize checklists: Load defaults if not set, else preserve checked off states
    const compileChecklist = (category, dataSrc) => {
      const defaultTasks = dataSrc?.defaultTasks || [];
      const userTasks = userRoutines[category] || [];

      return defaultTasks.map(defTask => {
        const existing = userTasks.find(t => t.id === defTask.id);
        return {
          id: defTask.id,
          text: defTask.text,
          completed: existing ? !!existing.completed : false,
          estimatedTime: defTask.estimatedTime || '5 mins'
        };
      });
    };

    const morning = compileChecklist('morning', this.morningData);
    const night = compileChecklist('night', this.nightData);
    const workout = compileChecklist('workout', this.workoutData);

    // Skincare checklist rules (factors skin cleanser/moisturizer settings)
    const skincareTasks = [
      { id: 's1', text: 'Gentle Cleanser application', completed: false },
      { id: 's2', text: 'Hydrating Gel Moisturizer', completed: false },
      { id: 's3', text: 'SPF protection (Morning)', completed: false }
    ].map(defTask => {
      const existing = (userRoutines.skincare || []).find(t => t.id === defTask.id);
      return {
        ...defTask,
        completed: existing ? !!existing.completed : false
      };
    });

    return {
      morning,
      night,
      skincare: skincareTasks,
      workout
    };
  }
}

export const routineEngine = new RoutineEngine();
