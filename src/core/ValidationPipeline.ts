import { SystemConfig, ValidationResult, ValidationRule, PromptAnalysisResult } from '../types';

export class ValidationPipeline {
  private config: SystemConfig;
  private rules: ValidationRule[] = [];

  constructor(config: SystemConfig) {
    this.config = config;
    this.initializeRules();
  }

  private initializeRules(): void {
    this.rules = [
      {
        id: 'length',
        name: 'Length Validation',
        description: 'Validates prompt length against configured thresholds',
        severity: 'error',
        check: async (prompt: string) => {
          const length = prompt.length;
          return length >= this.config.validationThresholds.minLength &&
                 length <= this.config.validationThresholds.maxLength;
        },
        message: (prompt: string) => {
          const length = prompt.length;
          if (length < this.config.validationThresholds.minLength) {
            return `Prompt is too short (${length} chars). Minimum length is ${this.config.validationThresholds.minLength} chars.`;
          }
          return `Prompt is too long (${length} chars). Maximum length is ${this.config.validationThresholds.maxLength} chars.`;
        }
      },
      {
        id: 'clarity',
        name: 'Clarity Validation',
        description: 'Validates prompt clarity score',
        severity: 'warning',
        check: async (prompt: string) => {
          // TODO: Implement clarity scoring
          return true;
        },
        message: (prompt: string) => 'Prompt clarity score is below threshold'
      },
      {
        id: 'technical_terms',
        name: 'Technical Terms Validation',
        description: 'Validates presence of technical terms',
        severity: 'warning',
        check: async (prompt: string) => {
          // TODO: Implement technical term detection
          return true;
        },
        message: (prompt: string) => 'No technical terms detected in prompt'
      },
      {
        id: 'code_blocks',
        name: 'Code Block Validation',
        description: 'Validates code block formatting',
        severity: 'error',
        check: async (prompt: string) => {
          const codeBlockRegex = /```[\s\S]*?```/g;
          const matches = prompt.match(codeBlockRegex);
          if (!matches) return true;
          
          return matches.every(block => {
            // TODO: Implement code block validation
            return true;
          });
        },
        message: (prompt: string) => 'Invalid code block format detected'
      },
      {
        id: 'examples',
        name: 'Example Validation',
        description: 'Validates presence of examples',
        severity: 'suggestion',
        check: async (prompt: string) => {
          // TODO: Implement example detection
          return true;
        },
        message: (prompt: string) => 'Consider adding examples to improve clarity'
      }
    ];
  }

  public async validate(prompt: string, analysis: PromptAnalysisResult): Promise<ValidationResult> {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];
      const suggestions: string[] = [];

      // Run all validation rules
      for (const rule of this.rules) {
        const isValid = await rule.check(prompt);
        if (!isValid) {
          const message = rule.message(prompt);
          switch (rule.severity) {
            case 'error':
              errors.push(message);
              break;
            case 'warning':
              warnings.push(message);
              break;
            case 'suggestion':
              suggestions.push(message);
              break;
          }
        }
      }

      // Calculate metadata
      const metadata = {
        clarityScore: await this.calculateClarityScore(prompt),
        technicalTermCount: analysis.metadata.technicalTermCount,
        codeBlockCount: analysis.metadata.codeBlockCount,
        exampleCount: await this.countExamples(prompt)
      };

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
        metadata
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to validate prompt: ${error.message}`);
      }
      throw new Error('Failed to validate prompt: Unknown error occurred');
    }
  }

  private async calculateClarityScore(prompt: string): Promise<number> {
    // TODO: Implement clarity scoring algorithm
    return 1.0;
  }

  private async countExamples(prompt: string): Promise<number> {
    // TODO: Implement example counting
    return 0;
  }
} 