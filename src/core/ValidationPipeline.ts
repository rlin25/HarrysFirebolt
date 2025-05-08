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
          const score = await this.calculateClarityScore(prompt);
          return score >= this.config.validationThresholds.minClarity;
        },
        message: (prompt: string) => 'Prompt clarity score is below threshold'
      },
      {
        id: 'technical_terms',
        name: 'Technical Terms Validation',
        description: 'Validates presence of technical terms',
        severity: 'warning',
        check: async (prompt: string) => {
          const technicalTerms = await this.extractTechnicalTerms(prompt);
          return technicalTerms.length > 0;
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
            const lines = block.split('\n');
            return lines.length >= 3 && // At least opening, content, and closing
                   lines[0].startsWith('```') &&
                   lines[lines.length - 1].trim() === '```';
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
          const exampleCount = await this.countExamples(prompt);
          return exampleCount > 0;
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
    // Simple clarity scoring based on:
    // 1. Sentence structure (presence of subject, verb, object)
    // 2. Technical term density
    // 3. Example presence
    // 4. Code block formatting

    let score = 1.0;

    // Check sentence structure
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const hasGoodStructure = sentences.every(s => {
      const words = s.toLowerCase().split(/\s+/);
      return words.length >= 3; // Basic requirement for subject-verb-object
    });
    if (!hasGoodStructure) score -= 0.2;

    // Check technical term density
    const technicalTerms = await this.extractTechnicalTerms(prompt);
    const termDensity = technicalTerms.length / prompt.split(/\s+/).length;
    if (termDensity < 0.1) score -= 0.1;

    // Check example presence
    const exampleCount = await this.countExamples(prompt);
    if (exampleCount === 0) score -= 0.1;

    // Check code block formatting
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = prompt.match(codeBlockRegex);
    if (matches && !matches.every(block => {
      const lines = block.split('\n');
      return lines.length >= 3 &&
             lines[0].startsWith('```') &&
             lines[lines.length - 1].trim() === '```';
    })) {
      score -= 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  private async extractTechnicalTerms(prompt: string): Promise<string[]> {
    const technicalTerms = new Set([
      'function', 'class', 'method', 'variable', 'parameter',
      'return', 'type', 'interface', 'module', 'component',
      'api', 'database', 'algorithm', 'data structure'
    ]);

    return prompt.toLowerCase()
      .split(/\s+/)
      .filter(word => technicalTerms.has(word));
  }

  private async countExamples(prompt: string): Promise<number> {
    // Count examples based on:
    // 1. Code blocks
    // 2. "For example" phrases
    // 3. "e.g." notation

    let count = 0;

    // Count code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    const codeBlocks = prompt.match(codeBlockRegex);
    if (codeBlocks) count += codeBlocks.length;

    // Count "For example" phrases
    const examplePhraseRegex = /for example|e\.g\./gi;
    const examplePhrases = prompt.match(examplePhraseRegex);
    if (examplePhrases) count += examplePhrases.length;

    return count;
  }
} 