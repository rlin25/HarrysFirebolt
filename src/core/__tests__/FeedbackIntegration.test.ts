import { FeedbackIntegration } from '../FeedbackIntegration';
import { SystemConfig } from '../../types/config';
import { FeedbackData } from '../../types/feedback';

describe('FeedbackIntegration', () => {
  let feedbackIntegration: FeedbackIntegration;
  let mockConfig: SystemConfig;

  beforeEach(() => {
    mockConfig = {
      version: '1.0.0',
      validationThresholds: {
        minLength: 10,
        maxLength: 1000,
        minClarity: 0.7
      },
      enhancementRules: {
        enableAutoFormatting: true,
        enableClarityEnhancement: true,
        enableStructureEnhancement: true
      },
      logging: {
        level: 'info',
        enableConsole: true,
        enableFile: false
      },
      performance: {
        promptAnalysisTimeout: 5000,
        documentationTimeout: 3000,
        interactionTimeout: 2000
      },
      feedback: {
        enableLearning: true,
        minFeedbackThreshold: 0.7,
        adaptationRate: 0.8
      }
    };

    feedbackIntegration = new FeedbackIntegration(mockConfig);
  });

  describe('process', () => {
    it('should process feedback successfully', async () => {
      const feedback: FeedbackData = {
        id: 'test-feedback-1',
        promptId: 'test-prompt-1',
        rating: 0.9,
        comments: 'Great response!',
        timestamp: new Date().toISOString(),
        metadata: {
          clarity: 0.9,
          validation: 0.8,
          enhancement: 0.85,
          userSatisfaction: 0.95
        }
      };

      await expect(feedbackIntegration.process(feedback)).resolves.not.toThrow();
    });

    it('should throw error when processing fails', async () => {
      const feedback: FeedbackData = {
        id: 'test-feedback-2',
        promptId: 'test-prompt-2',
        rating: 0.5,
        timestamp: new Date().toISOString(),
        metadata: {
          clarity: 0.5,
          validation: 0.5,
          enhancement: 0.5,
          userSatisfaction: 0.5
        }
      };

      // Mock a failure in storeFeedback
      jest.spyOn(feedbackIntegration as any, 'storeFeedback').mockRejectedValue(new Error('Storage failed'));

      await expect(feedbackIntegration.process(feedback)).rejects.toThrow('Failed to process feedback: Storage failed');
    });
  });

  describe('getQualityMetrics', () => {
    it('should return quality metrics', async () => {
      const metrics = await feedbackIntegration.getQualityMetrics();

      expect(metrics).toEqual({
        clarityScore: 1.0,
        validationRate: 1.0,
        enhancementRate: 1.0,
        userSatisfaction: 1.0
      });
    });
  });

  describe('resetLearningData', () => {
    it('should reset learning data to initial state', () => {
      feedbackIntegration.resetLearningData();

      const metrics = feedbackIntegration.getQualityMetrics();
      expect(metrics).resolves.toEqual({
        clarityScore: 1.0,
        validationRate: 1.0,
        enhancementRate: 1.0,
        userSatisfaction: 1.0
      });
    });
  });

  describe('shouldApplyAdaptation', () => {
    it('should return false when learning is disabled', () => {
      const feedback: FeedbackData = {
        id: 'test-feedback-3',
        promptId: 'test-prompt-3',
        rating: 0.9,
        timestamp: new Date().toISOString(),
        metadata: {
          clarity: 0.9,
          validation: 0.8,
          enhancement: 0.85,
          userSatisfaction: 0.95
        }
      };

      mockConfig.feedback.enableLearning = false;
      feedbackIntegration = new FeedbackIntegration(mockConfig);

      expect((feedbackIntegration as any).shouldApplyAdaptation(feedback)).toBe(false);
    });

    it('should return false when feedback rating is below threshold', () => {
      const feedback: FeedbackData = {
        id: 'test-feedback-4',
        promptId: 'test-prompt-4',
        rating: 0.5,
        timestamp: new Date().toISOString(),
        metadata: {
          clarity: 0.5,
          validation: 0.5,
          enhancement: 0.5,
          userSatisfaction: 0.5
        }
      };

      expect((feedbackIntegration as any).shouldApplyAdaptation(feedback)).toBe(false);
    });
  });
}); 