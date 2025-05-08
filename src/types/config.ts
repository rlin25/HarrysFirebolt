export interface SystemConfig {
  version: string;
  validationThresholds: {
    minLength: number;
    maxLength: number;
    minClarity: number;
  };
  enhancementRules: {
    enableAutoFormatting: boolean;
    enableClarityEnhancement: boolean;
    enableStructureEnhancement: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableConsole: boolean;
    enableFile: boolean;
  };
  performance: {
    promptAnalysisTimeout: number;
    documentationTimeout: number;
    interactionTimeout: number;
  };
  feedback: {
    enableLearning: boolean;
    minFeedbackThreshold: number;
    adaptationRate: number;
  };
} 