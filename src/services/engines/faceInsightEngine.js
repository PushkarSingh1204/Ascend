// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\faceInsightEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Face Insight Engine
 * Interprets local MediaPipe biometrics and landmarks to return structural symmetry,
 * facial thirds proportions, and jawline definition observations.
 */
class FaceInsightEngine extends BaseEngine {
  constructor() {
    super('faceInsightEngine');
  }

  validate(input) {
    if (!input || !input.latestAnalysis) {
      return { isValid: false, errors: ['Input must contain a latest biometric analysis.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const analysis = input.latestAnalysis;
    this.telemetry.dataSourcesUsed = ['scans.scores', 'scans.features'];

    const observations = [];
    const strengths = [];
    const improvements = [];

    // Analyze facial thirds balance
    const propScore = analysis.facial_proportion_score ?? 70;
    if (propScore >= 80) {
      strengths.push('Excellent facial thirds ratio. Vertical proportions display optimal height balance.');
    } else {
      improvements.push('Vertical facial thirds display mild proportion variance. High-volume haircuts can help create balance.');
    }

    // Analyze facial symmetry
    const symScore = analysis.symmetry_score ?? 70;
    if (symScore >= 80) {
      strengths.push('High bilateral symmetry across key landmarks (eyes and mouth corner offsets).');
    } else {
      improvements.push('Mild lateral symmetry offsets. Correct sleeping positions and chewing alignment can support restoration.');
    }

    // Analyze jaw definition
    const features = analysis.features || {};
    const jawScore = features.jawline?.score ?? 70;
    if (jawScore >= 78) {
      strengths.push('Defined jaw borders with clear submental boundary lines.');
    } else {
      improvements.push('Soft jawline borders. Posture exercises and submental toning are recommended to increase definition.');
    }

    return {
      scores: {
        harmony: analysis.facial_harmony_score || 70,
        symmetry: symScore,
        proportion: propScore,
        potential: analysis.improvement_potential_score || 85
      },
      observations,
      strengths,
      improvements
    };
  }
}

export const faceInsightEngine = new FaceInsightEngine();
