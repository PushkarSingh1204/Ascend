// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\progressEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Progress Engine
 * Evaluates historical scans, photos, and journal logs to summarize long-term trends.
 */
class ProgressEngine extends BaseEngine {
  constructor() {
    super('progressEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { scans = [], progressPhotos = [] } = input;
    this.telemetry.dataSourcesUsed = ['scans', 'progress_photos'];

    const insights = [];

    if (scans.length >= 2) {
      const latest = scans[0].facial_harmony_score || 0;
      const oldest = scans[scans.length - 1].facial_harmony_score || 0;
      const delta = latest - oldest;

      if (delta > 0) {
        insights.push(`Biometric Harmony Score increased by ${delta} points from baseline.`);
      }
    }

    if (progressPhotos.length > 0) {
      insights.push(`Logged ${progressPhotos.length} timeline progress photo(s). Visual tracking is active.`);
    } else {
      insights.push('Upload your first progress photo to initiate comparative visual timelines.');
    }

    return {
      insights,
      photosCount: progressPhotos.length,
      scansCount: scans.length
    };
  }
}

export const progressEngine = new ProgressEngine();
