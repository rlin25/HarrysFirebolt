import { SystemConfig, PromptAnalysisResult, Assumption, ClarityFlag, StructuralElement, AnalysisTask } from '../types';

export class PromptAnalysisEngine {
  private config: SystemConfig;
  private actionVerbs: Set<string>;
  private technicalTerms: Set<string>;

  constructor(config: SystemConfig) {
    this.config = config;
    this.actionVerbs = new Set([
      'create', 'implement', 'build', 'develop', 'design', 'write', 'generate',
      'calculate', 'compute', 'process', 'analyze', 'validate', 'test', 'deploy'
    ]);
    this.technicalTerms = new Set([
      'function', 'class', 'method', 'variable', 'parameter', 'return', 'type',
      'interface', 'module', 'package', 'dependency', 'algorithm', 'data structure'
    ]);
  }

  public async analyze(prompt: string): Promise<PromptAnalysisResult> {
    try {
      // Analyze assumptions
      const assumptions = await this.identifyAssumptions(prompt);

      // Check for clarity issues
      const clarityFlags = await this.checkClarity(prompt);

      // Identify structural elements
      const structuralElements = await this.identifyStructuralElements(prompt);

      // Decompose tasks
      const taskDecomposition = await this.decomposeTasks(prompt);

      // Calculate metadata
      const metadata = await this.calculateMetadata(prompt);

      return {
        assumptions,
        clarityFlags,
        structuralElements,
        taskDecomposition,
        metadata
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to analyze prompt: ${error.message}`);
      }
      throw new Error('Failed to analyze prompt: Unknown error occurred');
    }
  }

  private async identifyAssumptions(prompt: string): Promise<Assumption[]> {
    const assumptions: Assumption[] = [];
    const words = prompt.toLowerCase().split(/\s+/);

    // Check for implicit assumptions about input data
    if (words.includes('data') && !words.includes('format')) {
      assumptions.push({
        type: 'InputFormat',
        description: 'Input data format is not specified',
        impact: 'medium',
        suggestion: 'Specify the expected format of input data'
      });
    }

    // Check for implicit assumptions about error handling
    if (!this.hasErrorHandling(prompt)) {
      assumptions.push({
        type: 'ErrorHandling',
        description: 'Error handling requirements are not specified',
        impact: 'high',
        suggestion: 'Specify how errors should be handled'
      });
    }

    // Check for implicit assumptions about performance
    if (words.includes('process') && !words.includes('performance')) {
      assumptions.push({
        type: 'Performance',
        description: 'Performance requirements are not specified',
        impact: 'medium',
        suggestion: 'Specify performance requirements or constraints'
      });
    }

    return assumptions;
  }

  private async checkClarity(prompt: string): Promise<ClarityFlag[]> {
    const flags: ClarityFlag[] = [];

    // Check for action verbs
    if (!this.hasActionVerb(prompt)) {
      flags.push({
        type: 'MissingActionVerb',
        segment: prompt,
        suggestion: 'Add a clear action verb to specify what needs to be done'
      });
    }

    // Check for undefined terms
    const undefinedTerms = await this.findUndefinedTerms(prompt);
    undefinedTerms.forEach(term => {
      flags.push({
        type: 'UndefinedTerm',
        segment: term,
        suggestion: `Define or clarify the term "${term}"`
      });
    });

    // Check for ambiguous outcomes
    if (this.hasAmbiguousOutcome(prompt)) {
      flags.push({
        type: 'AmbiguousOutcome',
        segment: prompt,
        suggestion: 'Specify clear success criteria or expected outcomes'
      });
    }

    // Check for incomplete parameter specifications
    const incompleteParams = await this.findIncompleteParameters(prompt);
    incompleteParams.forEach(param => {
      flags.push({
        type: 'IncompleteParameterSpec',
        segment: param,
        suggestion: `Specify type and constraints for "${param}"`
      });
    });

    return flags;
  }

  private async identifyStructuralElements(prompt: string): Promise<StructuralElement[]> {
    const elements: StructuralElement[] = [];
    const words = prompt.toLowerCase().split(/\s+/);

    // Identify function declarations
    if (words.includes('function')) {
      elements.push({
        type: 'function',
        name: this.extractFunctionName(prompt),
        parameters: this.extractParameters(prompt),
        returnType: this.extractReturnType(prompt)
      });
    }

    // Identify class declarations
    if (words.includes('class')) {
      elements.push({
        type: 'class',
        name: this.extractClassName(prompt),
        methods: this.extractMethods(prompt),
        properties: this.extractProperties(prompt)
      });
    }

    return elements;
  }

  private async decomposeTasks(prompt: string): Promise<AnalysisTask[]> {
    const tasks: AnalysisTask[] = [];
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);

    sentences.forEach((sentence, index) => {
      if (this.hasActionVerb(sentence)) {
        tasks.push({
          id: `TASK-${index + 1}`,
          description: sentence.trim(),
          dependencies: this.identifyTaskDependencies(sentence, tasks),
          estimatedEffort: this.estimateTaskEffort(sentence)
        });
      }
    });

    return tasks;
  }

  private async calculateMetadata(prompt: string): Promise<PromptAnalysisResult['metadata']> {
    return {
      wordCount: this.countWords(prompt),
      sentenceCount: this.countSentences(prompt),
      technicalTermCount: await this.countTechnicalTerms(prompt),
      codeBlockCount: this.countCodeBlocks(prompt)
    };
  }

  private hasActionVerb(prompt: string): boolean {
    const words = prompt.toLowerCase().split(/\s+/);
    return words.some(word => this.actionVerbs.has(word));
  }

  private async findUndefinedTerms(prompt: string): Promise<string[]> {
    const words = prompt.toLowerCase().split(/\s+/);
    return words.filter(word => 
      this.technicalTerms.has(word) && 
      !this.isTermDefined(word, prompt)
    );
  }

  private hasAmbiguousOutcome(prompt: string): boolean {
    const ambiguousPhrases = [
      'should be', 'might be', 'could be', 'possibly',
      'depending on', 'if needed', 'if required'
    ];
    return ambiguousPhrases.some(phrase => 
      prompt.toLowerCase().includes(phrase)
    );
  }

  private async findIncompleteParameters(prompt: string): Promise<string[]> {
    const parameters: string[] = [];
    const words = prompt.toLowerCase().split(/\s+/);
    
    // Look for parameter-like words without type specifications
    words.forEach((word, index) => {
      if (word === 'parameter' || word === 'input' || word === 'value') {
        const nextWord = words[index + 1];
        if (nextWord && !this.isTypeSpecification(nextWord)) {
          parameters.push(nextWord);
        }
      }
    });

    return parameters;
  }

  private hasErrorHandling(prompt: string): boolean {
    const errorTerms = ['error', 'exception', 'handle', 'catch', 'try'];
    return errorTerms.some(term => 
      prompt.toLowerCase().includes(term)
    );
  }

  private countWords(prompt: string): number {
    return prompt.split(/\s+/).length;
  }

  private countSentences(prompt: string): number {
    return prompt.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  }

  private async countTechnicalTerms(prompt: string): Promise<number> {
    const words = prompt.toLowerCase().split(/\s+/);
    return words.filter(word => this.technicalTerms.has(word)).length;
  }

  private countCodeBlocks(prompt: string): number {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = prompt.match(codeBlockRegex);
    return matches ? matches.length : 0;
  }

  private isTermDefined(term: string, prompt: string): boolean {
    const sentences = prompt.split(/[.!?]+/);
    const termIndex = prompt.toLowerCase().indexOf(term);
    if (termIndex === -1) return false;

    // Check if the term is defined in the same sentence or previous sentence
    const currentSentence = sentences.find(s => 
      s.toLowerCase().includes(term)
    );
    if (!currentSentence) return false;

    const definingPhrases = [
      'is defined as', 'means', 'refers to', 'represents',
      'is a', 'are', 'consists of'
    ];

    return definingPhrases.some(phrase => 
      currentSentence.toLowerCase().includes(phrase)
    );
  }

  private isTypeSpecification(word: string): boolean {
    const types = [
      'string', 'number', 'boolean', 'array', 'object',
      'int', 'float', 'double', 'void', 'any'
    ];
    return types.includes(word.toLowerCase());
  }

  private extractFunctionName(prompt: string): string {
    const functionMatch = prompt.match(/function\s+(\w+)/i);
    return functionMatch ? functionMatch[1] : '';
  }

  private extractParameters(prompt: string): string[] {
    const paramMatch = prompt.match(/\(([^)]+)\)/);
    if (!paramMatch) return [];
    return paramMatch[1].split(',').map(p => p.trim());
  }

  private extractReturnType(prompt: string): string {
    const returnMatch = prompt.match(/->\s*(\w+)/i);
    return returnMatch ? returnMatch[1] : 'void';
  }

  private extractClassName(prompt: string): string {
    const classMatch = prompt.match(/class\s+(\w+)/i);
    return classMatch ? classMatch[1] : '';
  }

  private extractMethods(prompt: string): string[] {
    const methodMatches = prompt.match(/method\s+(\w+)/gi);
    return methodMatches ? methodMatches.map(m => m.split(/\s+/)[1]) : [];
  }

  private extractProperties(prompt: string): string[] {
    const propertyMatches = prompt.match(/property\s+(\w+)/gi);
    return propertyMatches ? propertyMatches.map(p => p.split(/\s+/)[1]) : [];
  }

  private identifyTaskDependencies(sentence: string, existingTasks: AnalysisTask[]): string[] {
    const dependencies: string[] = [];
    existingTasks.forEach(task => {
      if (sentence.toLowerCase().includes(task.description.toLowerCase())) {
        dependencies.push(task.id);
      }
    });
    return dependencies;
  }

  private estimateTaskEffort(sentence: string): 'low' | 'medium' | 'high' {
    const wordCount = this.countWords(sentence);
    if (wordCount <= 5) return 'low';
    if (wordCount <= 10) return 'medium';
    return 'high';
  }
} 