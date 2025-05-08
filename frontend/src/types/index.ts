export interface ValidationResult {
  errors: string[];
  warnings: string[];
  suggestions: string[];
  metadata: {
    clarityScore: number;
    technicalTermCount: number;
    codeBlockCount: number;
    exampleCount: number;
  };
} 