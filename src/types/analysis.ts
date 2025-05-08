export interface PromptAnalysisResult {
  assumptions: Assumption[];
  clarityFlags: ClarityFlag[];
  structuralElements: StructuralElement[];
  taskDecomposition: AnalysisTask[];
  metadata: {
    wordCount: number;
    sentenceCount: number;
    technicalTermCount: number;
    codeBlockCount: number;
  };
}

export interface Assumption {
  type: 'InputFormat' | 'ErrorHandling' | 'Performance';
  description: string;
  impact: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface ClarityFlag {
  type: 'MissingActionVerb' | 'UndefinedTerm' | 'AmbiguousOutcome' | 'IncompleteParameterSpec' | 'MissingErrorHandlingConsideration';
  segment: string;
  suggestion: string;
}

export interface StructuralElement {
  type: 'function' | 'class' | 'interface' | 'module' | 'component' | 'service' | 'api';
  name: string;
  parameters?: string[];
  returnType?: string;
  methods?: string[];
  properties?: string[];
}

export interface AnalysisTask {
  id: string;
  description: string;
  dependencies: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
} 