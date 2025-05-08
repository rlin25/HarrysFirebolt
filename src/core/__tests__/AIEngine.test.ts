import { AIEngine } from '../AIEngine';
import { SystemConfig } from '../../types/config';
import { PromptAnalysisResult } from '../../types/analysis';
import { ValidationResult } from '../../types/validation';
import { DocumentationResult } from '../../types/documentation';
import { FeedbackData } from '../../types/feedback';

describe('AIEngine', () => {
  let aiEngine: AIEngine;
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

    aiEngine = new AIEngine(mockConfig);
  });

  describe('processPrompt', () => {
    it('should process a valid prompt successfully', async () => {
      const prompt = 'Create a function that calculates the Fibonacci sequence';
      const result = await aiEngine.processPrompt(prompt);

      expect(result).toBeDefined();
      expect(result.analysis).toBeDefined();
      expect(result.validation).toBeDefined();
      expect(result.documentation).toBeDefined();
    });

    it('should handle invalid prompts appropriately', async () => {
      const prompt = '';
      const result = await aiEngine.processPrompt(prompt);

      expect(result.validation.isValid).toBe(false);
      expect(result.validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('processFeedback', () => {
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

      await expect(aiEngine.processFeedback(feedback)).resolves.not.toThrow();
    });

    it('should handle negative feedback appropriately', async () => {
      const feedback: FeedbackData = {
        id: 'test-feedback-2',
        promptId: 'test-prompt-2',
        rating: 0.3,
        comments: 'Response was unclear',
        timestamp: new Date().toISOString(),
        metadata: {
          clarity: 0.3,
          validation: 0.4,
          enhancement: 0.3,
          userSatisfaction: 0.3
        }
      };

      await expect(aiEngine.processFeedback(feedback)).resolves.not.toThrow();
    });
  });

  describe('getSystemMetrics', () => {
    it('should return system metrics', async () => {
      const metrics = await aiEngine.getSystemMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.performance).toBeDefined();
      expect(metrics.quality).toBeDefined();
      expect(metrics.performance.promptAnalysis).toBeDefined();
      expect(metrics.performance.documentation).toBeDefined();
      expect(metrics.performance.interaction).toBeDefined();
      expect(metrics.quality.clarityScore).toBeDefined();
      expect(metrics.quality.validationRate).toBeDefined();
      expect(metrics.quality.enhancementRate).toBeDefined();
    });
  });

  describe('resetSystem', () => {
    it('should reset the system state', async () => {
      await aiEngine.resetSystem();

      const metrics = await aiEngine.getSystemMetrics();
      expect(metrics.performance.promptAnalysis).toBe(0);
      expect(metrics.performance.documentation).toBe(0);
      expect(metrics.performance.interaction).toBe(0);
    });
  });
}); 