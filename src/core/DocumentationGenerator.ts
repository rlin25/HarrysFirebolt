import {
  SystemConfig,
  DocumentationResult,
  Requirement,
  TaskBreakdown,
  DependencyMap,
  ChangeTracking,
  DocumentationTask,
  Dependency,
  Timeline,
  Node,
  Edge,
  Change,
  PromptAnalysisResult,
  ValidationResult
} from '../types';

export class DocumentationGenerator {
  private config: SystemConfig;

  constructor(config: SystemConfig) {
    this.config = config;
  }

  public async generate(
    prompt: string,
    analysis: PromptAnalysisResult,
    validation: ValidationResult
  ): Promise<DocumentationResult> {
    try {
      // Generate requirements
      const requirements = await this.generateRequirements(prompt, analysis);

      // Generate task breakdown
      const taskBreakdown = await this.generateTaskBreakdown(analysis);

      // Generate dependency map
      const dependencyMap = await this.generateDependencyMap(analysis);

      // Generate change tracking
      const changeTracking = await this.generateChangeTracking(prompt, analysis, validation);

      return {
        requirements,
        taskBreakdown,
        dependencyMap,
        changeTracking,
        metadata: {
          generatedAt: new Date().toISOString(),
          version: this.config.version,
          format: 'JSON'
        }
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate documentation: ${error.message}`);
      }
      throw new Error('Failed to generate documentation: Unknown error occurred');
    }
  }

  private async generateRequirements(
    prompt: string,
    analysis: PromptAnalysisResult
  ): Promise<Requirement[]> {
    const requirements: Requirement[] = [];

    // Convert assumptions to requirements
    analysis.assumptions.forEach(assumption => {
      requirements.push({
        id: `REQ-${assumption.type}`,
        description: assumption.description,
        priority: assumption.impact === 'high' ? 'High' : assumption.impact === 'medium' ? 'Medium' : 'Low',
        status: 'Pending',
        relatedTasks: []
      });
    });

    // Convert structural elements to requirements
    analysis.structuralElements.forEach(element => {
      requirements.push({
        id: `REQ-${element.type}-${element.name}`,
        description: `Implement ${element.type} ${element.name}`,
        priority: 'Medium',
        status: 'Pending',
        relatedTasks: []
      });
    });

    return requirements;
  }

  private async generateTaskBreakdown(analysis: PromptAnalysisResult): Promise<TaskBreakdown> {
    const tasks = analysis.taskDecomposition.map(task => ({
      id: task.id,
      name: task.description,
      description: task.description,
      status: 'Pending' as const,
      dependencies: task.dependencies
    }));

    const dependencies = this.extractDependencies(tasks);
    const timeline = this.generateTimeline(tasks);

    return {
      tasks,
      dependencies,
      timeline
    };
  }

  private extractDependencies(tasks: DocumentationTask[]): Dependency[] {
    const dependencies: Dependency[] = [];

    tasks.forEach(task => {
      task.dependencies.forEach((depId: string) => {
        dependencies.push({
          from: depId,
          to: task.id,
          type: 'depends_on'
        });
      });
    });

    return dependencies;
  }

  private generateTimeline(tasks: DocumentationTask[]): Timeline {
    const now = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now

    return {
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      milestones: [
        {
          id: 'M1',
          name: 'Initial Implementation',
          date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          tasks: tasks.map(t => t.id)
        }
      ]
    };
  }

  private async generateDependencyMap(analysis: PromptAnalysisResult): Promise<DependencyMap> {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Add structural elements as nodes
    analysis.structuralElements.forEach(element => {
      nodes.push({
        id: `${element.type}-${element.name}`,
        type: 'component',
        name: element.name
      });
    });

    // Add tasks as nodes
    analysis.taskDecomposition.forEach(task => {
      nodes.push({
        id: task.id,
        type: 'task',
        name: task.description
      });
    });

    // Add dependencies as edges
    analysis.taskDecomposition.forEach(task => {
      task.dependencies.forEach(depId => {
        edges.push({
          from: depId,
          to: task.id,
          type: 'depends_on'
        });
      });
    });

    return { nodes, edges };
  }

  private async generateChangeTracking(
    prompt: string,
    analysis: PromptAnalysisResult,
    validation: ValidationResult
  ): Promise<ChangeTracking> {
    const changes: Change[] = [];

    // Add initial change for prompt creation
    changes.push({
      id: 'CHG-001',
      type: 'addition',
      description: 'Initial prompt creation',
      affectedComponents: analysis.structuralElements.map(e => e.name),
      timestamp: new Date().toISOString()
    });

    // Add changes for validation issues
    validation.errors.forEach((error, index) => {
      changes.push({
        id: `CHG-${String(index + 2).padStart(3, '0')}`,
        type: 'modification',
        description: `Fix validation error: ${error}`,
        affectedComponents: [],
        timestamp: new Date().toISOString()
      });
    });

    return {
      changes,
      version: this.config.version,
      timestamp: new Date().toISOString()
    };
  }
} 