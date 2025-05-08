import { PromptEnhancer } from '../enhancer';
import { defaultConfig } from '../../config/default';

describe('PromptEnhancer', () => {
  let enhancer: PromptEnhancer;

  beforeEach(() => {
    enhancer = new PromptEnhancer(defaultConfig);
  });

  describe('enhance', () => {
    it('should enhance a basic prompt with all features enabled', () => {
      const basicPrompt = 'create a function to add two numbers';
      const enhanced = enhancer.enhance(basicPrompt);

      // Check for added structure
      expect(enhanced).toContain('Structure:');
      expect(enhanced).toContain('Input:');
      expect(enhanced).toContain('Output:');
      expect(enhanced).toContain('Edge Cases:');

      // Check for added example
      expect(enhanced).toContain('Example:');
      expect(enhanced).toContain('```typescript');

      // Check for added implementation details
      expect(enhanced).toContain('Implementation Details:');
      expect(enhanced).toContain('Describe the approach');
      expect(enhanced).toContain('List any constraints');
    });

    it('should format code blocks properly', () => {
      const promptWithCode = 'Here is some code:\n```typescript\nconst x = 1;\n```';
      const enhanced = enhancer.enhance(promptWithCode);
      
      // Check that the code block is preserved with proper formatting
      expect(enhanced).toMatch(/```typescript\s+const x = 1;\s+```/);
    });

    it('should not add redundant sections if they already exist', () => {
      const promptWithSections = `
        # Requirements
        Create a function
        
        # Implementation Details
        Use TypeScript
        
        # Examples
        \`\`\`typescript
        const result = myFunction();
        \`\`\`
      `.trim();

      const enhanced = enhancer.enhance(promptWithSections);
      
      // Count occurrences of section headers
      const requirementsCount = (enhanced.match(/# Requirements/g) || []).length;
      const implementationCount = (enhanced.match(/# Implementation Details/g) || []).length;
      const examplesCount = (enhanced.match(/# Examples/g) || []).length;

      expect(requirementsCount).toBe(1);
      expect(implementationCount).toBe(1);
      expect(examplesCount).toBe(1);
    });

    it('should handle empty prompts gracefully', () => {
      const emptyPrompt = '';
      const enhanced = enhancer.enhance(emptyPrompt);
      
      // Empty prompts should still get basic structure
      expect(enhanced).toContain('# Requirements');
      expect(enhanced).toContain('# Implementation Details');
      expect(enhanced).toContain('# Examples');
    });

    it('should preserve original prompt content while normalizing case', () => {
      const originalPrompt = 'Create a function to add two numbers';
      const enhanced = enhancer.enhance(originalPrompt.toLowerCase());
      expect(enhanced).toContain(originalPrompt);
    });
  });
}); 