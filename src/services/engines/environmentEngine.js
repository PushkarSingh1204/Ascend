// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\environmentEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Environment Engine
 * Determines seasonal, weather, temperature, and humidity offsets based on the user's location.
 */
class EnvironmentEngine extends BaseEngine {
  constructor() {
    super('environmentEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const profile = input.profile;
    this.telemetry.dataSourcesUsed = ['profile.location'];

    const rawLocation = (profile.location || 'India').trim().toLowerCase();
    const currentMonth = new Date().getMonth(); // 0-11

    let humidity = 'Normal';
    let season = 'Spring';
    let temperature = 'Mild';

    // Rule-based climate mapping for India
    if (rawLocation.includes('india') || rawLocation.includes('in')) {
      // Monsoon/Summer is humid (June to September)
      if (currentMonth >= 4 && currentMonth <= 8) {
        humidity = 'Humid';
        season = 'Summer';
        temperature = 'Hot';
      }
      // Winter (November to February) is dry & cool
      else if (currentMonth >= 10 || currentMonth <= 1) {
        humidity = 'Dry';
        season = 'Winter';
        temperature = 'Cool';
      } else {
        humidity = 'Normal';
        season = 'Spring';
        temperature = 'Warm';
      }
    } 
    // Standard rule-based mapping for Western countries
    else if (rawLocation.includes('us') || rawLocation.includes('uk') || rawLocation.includes('europe')) {
      // Winter (November to February) is dry and cold
      if (currentMonth >= 10 || currentMonth <= 1) {
        humidity = 'Dry';
        season = 'Winter';
        temperature = 'Cold';
      } 
      // Summer (June to August) is warm
      else if (currentMonth >= 5 && currentMonth <= 7) {
        humidity = 'Normal';
        season = 'Summer';
        temperature = 'Hot';
      } else {
        humidity = 'Normal';
        season = 'Spring';
        temperature = 'Mild';
      }
    }

    return {
      country: profile.location || 'India',
      season,
      temperature,
      humidity
    };
  }
}

export const environmentEngine = new EnvironmentEngine();
