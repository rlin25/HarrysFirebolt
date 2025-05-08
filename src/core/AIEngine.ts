import { SystemConfig, ValidationResult, PromptAnalysisResult, DocumentationResult, FeedbackData } from '../types';
import { PromptAnalysisEngine } from './PromptAnalysisEngine';
import { ValidationPipeline } from './ValidationPipeline';
import { DocumentationGenerator } from './DocumentationGenerator';
import { ImplementationMonitor } from './ImplementationMonitor';
import { FeedbackIntegration } from './FeedbackIntegration';

export class AIEngine {
  private config: SystemConfig;
  private analysisEngine!: PromptAnalysisEngine;
  private validationPipeline!: ValidationPipeline;
  private documentationGenerator!: DocumentationGenerator;
  private implementationMonitor!: ImplementationMonitor;
  private feedbackIntegration!: FeedbackIntegration;

  constructor(config: SystemConfig) {
    this.config = {
      ...config,
      performance: {
        ...config.performance,
        promptAnalysisTimeout: config.performance?.promptAnalysisTimeout ?? 5000,
        documentationTimeout: config.performance?.documentationTimeout ?? 5000,
        interactionTimeout: config.performance?.interactionTimeout ?? 5000
      },
      feedback: {
        ...config.feedback,
        enableLearning: config.feedback?.enableLearning ?? true,
        minFeedbackThreshold: config.feedback?.minFeedbackThreshold ?? 0.7,
        adaptationRate: config.feedback?.adaptationRate ?? 0.1
      }
    };
    this.initializeComponents();
  }

  private initializeComponents(): void {
    this.analysisEngine = new PromptAnalysisEngine(this.config);
    this.validationPipeline = new ValidationPipeline(this.config);
    this.documentationGenerator = new DocumentationGenerator(this.config);
    this.implementationMonitor = new ImplementationMonitor(this.config);
    this.feedbackIntegration = new FeedbackIntegration(this.config);
  }

  public async processPrompt(prompt: string): Promise<{
    analysis: PromptAnalysisResult;
    validation: ValidationResult;
    documentation: DocumentationResult;
  }> {
    try {
      // Step 1: Analyze the prompt
      const analysis = await this.analysisEngine.analyze(prompt);

      // Step 2: Validate the prompt
      const validation = await this.validationPipeline.validate(prompt, analysis);

      // Step 3: Generate documentation
      const documentation = await this.documentationGenerator.generate(prompt, analysis, validation);

      // Step 4: Monitor implementation
      await this.implementationMonitor.track(prompt, analysis, validation);

      return {
        analysis,
        validation,
        documentation
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to process prompt: ${error.message}`);
      }
      throw new Error('Failed to process prompt: Unknown error occurred');
    }
  }

  public async enhancePrompt(prompt: string): Promise<string> {
    try {
      const { analysis, validation } = await this.processPrompt(prompt);
      
      if (!validation.isValid) {
        throw new Error('Cannot enhance invalid prompt');
      }

      // Apply enhancement rules based on analysis and validation
      const enhancedPrompt = await this.applyEnhancementRules(prompt, analysis, validation);
      
      return enhancedPrompt;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to enhance prompt: ${error.message}`);
      }
      throw new Error('Failed to enhance prompt: Unknown error occurred');
    }
  }

  private async applyEnhancementRules(
    prompt: string,
    analysis: PromptAnalysisResult,
    validation: ValidationResult
  ): Promise<string> {
    let enhancedPrompt = prompt;

    // Apply clarity enhancements
    if (this.config.enhancementRules.enableClarityEnhancement) {
      enhancedPrompt = await this.enhanceClarity(enhancedPrompt, analysis);
    }

    // Apply structure enhancements
    if (this.config.enhancementRules.enableStructureEnhancement) {
      enhancedPrompt = await this.enhanceStructure(enhancedPrompt, analysis);
    }

    // Apply auto-formatting
    if (this.config.enhancementRules.enableAutoFormatting) {
      enhancedPrompt = await this.formatPrompt(enhancedPrompt);
    }

    return enhancedPrompt;
  }

  private async enhanceClarity(
    prompt: string,
    analysis: PromptAnalysisResult
  ): Promise<string> {
    let enhancedPrompt = prompt;

    // Add missing error handling considerations
    if (analysis.assumptions.some(a => a.type === 'ErrorHandling')) {
      enhancedPrompt += '. Handle invalid inputs and edge cases appropriately';
    }

    // Add type specifications for parameters
    const incompleteParams = analysis.clarityFlags
      .filter(f => f.type === 'IncompleteParameterSpec')
      .map(f => f.segment);
    
    if (incompleteParams.length > 0) {
      enhancedPrompt += `. Parameters: ${incompleteParams.join(', ')} should be properly typed`;
    }

    // Add success criteria for ambiguous outcomes
    if (analysis.clarityFlags.some(f => f.type === 'AmbiguousOutcome')) {
      enhancedPrompt += '. Return value should be clearly specified';
    }

    return enhancedPrompt;
  }

  private async enhanceStructure(
    prompt: string,
    analysis: PromptAnalysisResult
  ): Promise<string> {
    let enhancedPrompt = prompt;

    // Add function signature if missing
    if (analysis.structuralElements.length > 0) {
      const func = analysis.structuralElements[0];
      if (func.type === 'function' && (!func.parameters || !func.returnType)) {
        enhancedPrompt = `Create a function with parameters (${func.parameters?.join(', ') || 'n: number'}) that returns ${func.returnType || 'an array of numbers'}. ${enhancedPrompt}`;
      }
    }

    // Add implementation steps if task decomposition exists
    if (analysis.taskDecomposition.length > 0) {
      enhancedPrompt += '\n\nImplementation steps:';
      analysis.taskDecomposition.forEach(task => {
        enhancedPrompt += `\n- ${task.description}`;
      });
    }

    return enhancedPrompt;
  }

  private async formatPrompt(prompt: string): Promise<string> {
    // Split into lines for better readability
    const lines = prompt.split('\n');
    let formattedPrompt = '';

    // Format each line
    lines.forEach((line, index) => {
      // Add newline before implementation steps
      if (line.includes('Implementation steps:')) {
        formattedPrompt += '\n';
      }

      // Add the line
      formattedPrompt += line;

      // Add newline after main description and between steps
      if (index === 0 || line.startsWith('-')) {
        formattedPrompt += '\n';
      }
    });

    return formattedPrompt.trim();
  }

  public async processFeedback(feedback: FeedbackData): Promise<void> {
    await this.feedbackIntegration.process(feedback);
  }

  public async getSystemMetrics(): Promise<{
    performance: {
      promptAnalysis: number;
      documentation: number;
      interaction: number;
    };
    quality: {
      clarityScore: number;
      validationRate: number;
      enhancementRate: number;
    };
  }> {
    return {
      performance: await this.implementationMonitor.getPerformanceMetrics(),
      quality: await this.feedbackIntegration.getQualityMetrics()
    };
  }

  public async resetSystem(): Promise<void> {
    // Reset all components
    this.analysisEngine = new PromptAnalysisEngine(this.config);
    this.validationPipeline = new ValidationPipeline(this.config);
    this.documentationGenerator = new DocumentationGenerator(this.config);
    this.implementationMonitor = new ImplementationMonitor(this.config);
    this.feedbackIntegration = new FeedbackIntegration(this.config);
  }
} 