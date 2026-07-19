// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\confidenceEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Confidence Engine
 * Calculates a confidence value indicating how strongly a recommendation holds,
 * based on logging density, biometric scan availability, and data age.
 */
class ConfidenceEngine extends BaseEngine {
  constructor() {
    super('confidenceEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, latestAnalysis, waterLogs = [], sleepLogs = [] } = input;
    this.telemetry.dataSourcesUsed = ['profile', 'scans', 'logs'];

    // Base confidence starts at 60% (general onboarding baseline)
    let score = 0.60;

    // 1. Check if facial biometrics are available
    if (latestAnalysis) {
      score += 0.20; // +20% for biometric verification
      // Adjust based on MediaPipe Landmarker confidence if available
      const landmarkerConfidence = parseFloat(latestAnalysis.confidence_score) / 100 || 0.90;
      score += (landmarkerConfidence * 0.05); // +up to 5%
    }

    // 2. Check density of habit logs
    const hasWaterLogs = waterLogs.length > 0 || (profile.water_log && profile.water_log.current > 0);
    const hasSleepLogs = sleepLogs.length > 0 || (profile.sleep_log && profile.sleep_log.current > 0);
    
    if (hasWaterLogs) score += 0.05;
    if (hasSleepLogs) score += 0.05;

    // 3. Apply penalty if profile data is very old (optional feature placeholder)
    // For now, cap the final confidence score between 50% and 98%
    const finalConfidence = Math.min(0.98, Math.max(0.50, score));
    return finalConfidence;
  }
}

export const confidenceEngine = new ConfidenceEngine();
