import { ValidationResult, SystemConfig } from '../types';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();

export class PromptValidator {
  private config: SystemConfig;

  constructor(config: SystemConfig) {
    this.config = config;
  }

  validate(prompt: string): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
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
    const clarity = this.calculateClarity(prompt);
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
    const technicalTerms = tokens.filter(token => 
      /^(function|class|interface|type|const|let|var|import|export|return|if|else|for|while)$/i.test(token)
    ).length;

    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;

    const hasCodeBlock = /```[\s\S]*?```/.test(prompt);
    const hasExample = /example|sample|instance|case/i.test(prompt);

    // Calculate clarity score (0-1)
    const score = (
      (technicalTerms / tokens.length) * 0.4 +
      (avgSentenceLength > 10 && avgSentenceLength < 50 ? 0.3 : 0.1) +
      (hasCodeBlock ? 0.2 : 0) +
      (hasExample ? 0.1 : 0)
    );

    return Math.min(1, Math.max(0, score));
  }
} 