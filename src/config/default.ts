import { SystemConfig } from '../types';

export const defaultConfig: SystemConfig = {
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
    level: 'debug',
    enableConsole: true,
    enableFile: false
  },
  performance: {
    promptAnalysisTimeout: 5000,
    documentationTimeout: 5000,
    interactionTimeout: 5000
  },
  feedback: {
    enableLearning: true,
    minFeedbackThreshold: 0.7,
    adaptationRate: 0.1
  }
}; 