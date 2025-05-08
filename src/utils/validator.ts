import { ValidationResult, SystemConfig } from '../types';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();

export class PromptValidator {
  private config: SystemConfig;

  constructor(config: SystemConfig) {
    this.config = config;
  }

  validate(prompt: string): ValidationResult {
    const clarity = this.calculateClarity(prompt);
    const technicalTerms = this.extractTechnicalTerms(prompt);
    const codeBlocks = this.countCodeBlocks(prompt);
    const examples = this.countExamples(prompt);

    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      metadata: {
        clarityScore: clarity,
        technicalTermCount: technicalTerms.length,
        codeBlockCount: codeBlocks,
        exampleCount: examples
      }
    };

    // Length validation
    if (prompt.length < this.config.validationThresholds.minLength) {
      result.errors.push(`Prompt is too short (minimum ${this.config.validationThresholds.minLength} characters)`);
      result.isValid = false;
    }

    if (prompt.length > this.config.validationThresholds.maxLength) {
      result.errors.push(`Prompt is too long (maximum ${this.config.validationThresholds.maxLength} characters)`);
      result.isValid = false;
    }

    // Basic clarity check
    if (clarity < this.config.validationThresholds.minClarity) {
      result.warnings.push(`Prompt clarity is low (${clarity.toFixed(2)})`);
      result.suggestions.push('Consider adding more specific details or examples');
    }

    return result;
  }

  private calculateClarity(prompt: string): number {
    const tokens = tokenizer.tokenize(prompt);
    if (!tokens || tokens.length === 0) return 0;

    // Simple clarity metric based on:
    // 1. Presence of specific technical terms
    // 2. Sentence structure
    // 3. Presence of examples or code snippets
    const technicalTerms = this.extractTechnicalTerms(prompt);
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;

    const hasCodeBlock = this.countCodeBlocks(prompt) > 0;
    const hasExample = this.countExamples(prompt) > 0;

    // Calculate clarity score (0-1)
    const score = (
      (technicalTerms.length / tokens.length) * 0.4 +
      (avgSentenceLength > 10 && avgSentenceLength < 50 ? 0.3 : 0.1) +
      (hasCodeBlock ? 0.2 : 0) +
      (hasExample ? 0.1 : 0)
    );

    return Math.min(1, Math.max(0, score));
  }

  private extractTechnicalTerms(prompt: string): string[] {
    const tokens = tokenizer.tokenize(prompt) || [];
    return tokens.filter(token => 
      /^(function|class|interface|type|const|let|var|import|export|return|if|else|for|while)$/i.test(token)
    );
  }

  private countCodeBlocks(prompt: string): number {
    const matches = prompt.match(/```[\s\S]*?```/g);
    return matches ? matches.length : 0;
  }

  private countExamples(prompt: string): number {
    const exampleMatches = prompt.match(/example|sample|instance|case/gi);
    const codeBlocks = this.countCodeBlocks(prompt);
    return (exampleMatches ? exampleMatches.length : 0) + codeBlocks;
  }
} 