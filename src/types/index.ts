import { ValidationResult } from './validation';

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

export * from './validation';
export * from './analysis';
export * from './documentation';
export * from './feedback';

// Re-export specific types to avoid naming conflicts
export { Task as DocumentationTask } from './documentation';

// Export SystemConfig directly from config
export type { SystemConfig } from './config'; 