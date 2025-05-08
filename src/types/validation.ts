export interface ValidationResult {
  isValid: boolean;
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

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'suggestion';
  check: (prompt: string) => Promise<boolean>;
  message: (prompt: string) => string;
} 