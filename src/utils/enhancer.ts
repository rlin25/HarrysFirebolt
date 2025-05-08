import { SystemConfig } from '../types';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

export class PromptEnhancer {
  private config: SystemConfig;

  constructor(config: SystemConfig) {
    this.config = config;
  }

  enhance(prompt: string): string {
    console.log('Original prompt:', prompt);
    let enhancedPrompt = prompt;

    if (this.config.enhancementRules.enableAutoFormatting) {
      console.log('Applying auto-formatting...');
      enhancedPrompt = this.autoFormat(enhancedPrompt);
      console.log('After auto-formatting:', enhancedPrompt);
    }

    if (this.config.enhancementRules.enableClarityEnhancement) {
      console.log('Applying clarity enhancement...');
      enhancedPrompt = this.enhanceClarity(enhancedPrompt);
      console.log('After clarity enhancement:', enhancedPrompt);
    }

    if (this.config.enhancementRules.enableStructureEnhancement) {
      console.log('Applying structure enhancement...');
      enhancedPrompt = this.enhanceStructure(enhancedPrompt);
      console.log('After structure enhancement:', enhancedPrompt);
    }

    console.log('Final enhanced prompt:', enhancedPrompt);
    return enhancedPrompt;
  }

  private autoFormat(prompt: string): string {
    // Remove extra whitespace
    let formatted = prompt.replace(/\s+/g, ' ').trim();

    // Ensure proper spacing around punctuation
    formatted = formatted.replace(/([.,!?])([^\s])/g, '$1 $2');

    // Capitalize first letter of each sentence
    formatted = formatted.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());

    // Format code blocks if present
    formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
    });

    return formatted;
  }

  private enhanceClarity(prompt: string): string {
    const tokens = tokenizer.tokenize(prompt);
    if (!tokens || tokens.length === 0) return prompt;

    let enhanced = prompt;

    // Add missing technical context
    if (!this.hasTechnicalContext(tokens)) {
      enhanced = this.addTechnicalContext(enhanced);
    }

    // Add example if none present
    if (!this.hasExample(prompt)) {
      enhanced = this.addExample(enhanced);
    }

    // Add structure markers if needed
    if (!this.hasStructureMarkers(prompt)) {
      enhanced = this.addStructureMarkers(enhanced);
    }

    return enhanced;
  }

  private enhanceStructure(prompt: string): string {
    let enhanced = prompt;

    // Add section headers if missing
    if (!this.hasSectionHeaders(prompt)) {
      enhanced = this.addSectionHeaders(enhanced);
    }

    // Add implementation details if missing
    if (!this.hasImplementationDetails(prompt)) {
      enhanced = this.addImplementationDetails(enhanced);
    }

    return enhanced;
  }

  private hasTechnicalContext(tokens: string[]): boolean {
    const technicalTerms = tokens.filter(token => 
      /^(function|class|interface|type|const|let|var|import|export|return|if|else|for|while)$/i.test(token)
    );
    return technicalTerms.length > 0;
  }

  private hasExample(prompt: string): boolean {
    return /example|sample|instance|case|e\.g\.|for example/i.test(prompt) ||
           /```[\s\S]*?```/.test(prompt);
  }

  private hasStructureMarkers(prompt: string): boolean {
    return /input|output|parameters|returns|throws|example|note|warning/i.test(prompt);
  }

  private hasSectionHeaders(prompt: string): boolean {
    return /^#+\s|^[A-Z][A-Za-z\s]+:$/m.test(prompt);
  }

  private hasImplementationDetails(prompt: string): boolean {
    return /implement|create|define|write|build|develop/i.test(prompt) &&
           /how|what|where|when|why/i.test(prompt);
  }

  private addTechnicalContext(prompt: string): string {
    return `${prompt}\n\nTechnical Context:\n- Specify the programming language\n- Include any relevant frameworks or libraries\n- Mention any specific design patterns or architectural considerations`;
  }

  private addExample(prompt: string): string {
    return `${prompt}\n\nExample:\n\`\`\`typescript\n// Add a relevant example here\n\`\`\``;
  }

  private addStructureMarkers(prompt: string): string {
    return `${prompt}\n\nStructure:\n- Input: [describe expected input]\n- Output: [describe expected output]\n- Edge Cases: [list important edge cases]`;
  }

  private addSectionHeaders(prompt: string): string {
    return `# Requirements\n${prompt}\n\n# Implementation Details\n\n# Examples\n\n# Notes`;
  }

  private addImplementationDetails(prompt: string): string {
    return `${prompt}\n\nImplementation Details:\n- Describe the approach\n- List any constraints\n- Specify error handling requirements\n- Include performance considerations`;
  }
} 