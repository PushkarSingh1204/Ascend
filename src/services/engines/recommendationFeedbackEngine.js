// C:\Users\pushk\.gemini\antigravity\scratch\ascend\src\services\engines\recommendationFeedbackEngine.js
import { BaseEngine } from './BaseEngine.js';

/**
 * Recommendation Feedback Engine
 * Adjusts recommendation scores based on direct user feedback (👍, 👎, Already doing, Not relevant).
 */
class RecommendationFeedbackEngine extends BaseEngine {
  constructor() {
    super('recommendationFeedbackEngine');
  }

  validate(input) {
    if (!input || !input.profile) {
      return { isValid: false, errors: ['Input must contain a user profile.'] };
    }
    return { isValid: true, errors: [] };
  }

  async execute(input) {
    const { profile, recommendations = [] } = input;
    this.telemetry.dataSourcesUsed = ['profile.feedback'];

    const feedback = profile.recommendation_feedback || {};

    const adjustedRecs = recommendations.map(rec => {
      const userFeedback = feedback[rec.id];
      if (!userFeedback) return rec;

      const updatedRec = { ...rec };
      
      switch (userFeedback) {
        case 'helpful': // 👍
          updatedRec.score = Math.min(100, (updatedRec.score || 50) + 15);
          break;
        case 'not_helpful': // 👎
          updatedRec.score = Math.max(1, (updatedRec.score || 50) - 15);
          break;
        case 'already_doing':
          // Set as habituated / completed, score adjusted
          updatedRec.completed = true;
          updatedRec.score = Math.max(1, (updatedRec.score || 50) - 25);
          break;
        case 'not_relevant':
        case 'dont_show_again':
          // Flag to filter out
          updatedRec.score = 0;
          updatedRec.dismissed = true;
          break;
        default:
          break;
      }

      return updatedRec;
    });

    // Filter out recommendations that the user marked as completely irrelevant
    return adjustedRecs.filter(rec => rec.score > 0 && !rec.dismissed);
  }
}

export const recommendationFeedbackEngine = new RecommendationFeedbackEngine();
