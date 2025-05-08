export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface PromptMetadata {
  id: string;
  timestamp: number;
  version: string;
  source: string;
}

export interface EnhancedPrompt {
  original: string;
  enhanced: string;
  metadata: PromptMetadata;
  validation: ValidationResult;
}

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
} 