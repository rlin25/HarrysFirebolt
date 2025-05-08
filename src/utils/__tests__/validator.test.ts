import { PromptValidator } from '../validator';
import { defaultConfig } from '../../config/default';

describe('PromptValidator', () => {
  let validator: PromptValidator;

  beforeEach(() => {
    validator = new PromptValidator(defaultConfig);
  });

  describe('validate', () => {
    it('should validate a good prompt', () => {
      const goodPrompt = `
        Create a function that calculates the factorial of a number.
        The function should:
        - Accept a positive integer as input
        - Return the factorial of that number
        - Handle edge cases (0, 1)
        - Include error handling for negative numbers
        
        Example:
        \`\`\`typescript
        function factorial(n: number): number {
          if (n < 0) throw new Error('Input must be non-negative');
          if (n <= 1) return 1;
          return n * factorial(n - 1);
        }
        \`\`\`
      `.trim();

      const result = validator.validate(goodPrompt);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      // Allow warnings for clarity as long as they're not severe
      expect(result.warnings.filter(w => !w.includes('clarity'))).toHaveLength(0);
    });

    it('should reject a too short prompt', () => {
      const shortPrompt = 'code';
      const result = validator.validate(shortPrompt);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(expect.stringContaining('too short'));
    });

    it('should reject a too long prompt', () => {
      const longPrompt = 'a'.repeat(defaultConfig.validationThresholds.maxLength + 1);
      const result = validator.validate(longPrompt);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(expect.stringContaining('too long'));
    });

    it('should warn about low clarity', () => {
      const unclearPrompt = 'do something with the thing and make it work good';
      const result = validator.validate(unclearPrompt);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContainEqual(expect.stringContaining('clarity is low'));
      expect(result.suggestions).toContainEqual(expect.stringContaining('specific details'));
    });
  });
}); 