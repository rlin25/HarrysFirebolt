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
  id: string;
  text: string;
  inferredFrom: string;
  confidence: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Confirmed' | 'Modified' | 'Rejected';
  modifiedText?: string;
}

export interface ClarityFlag {
  type: 'MissingActionVerb' | 'UndefinedTerm' | 'AmbiguousOutcome' | 'IncompleteParameterSpec' | 'MissingErrorHandlingConsideration';
  segment: string;
  suggestion: string;
}

export interface StructuralElement {
  type: 'class' | 'module' | 'function' | 'interface' | 'component' | 'service' | 'api';
  name: string;
  description: string;
  relationships: string[];
}

export interface AnalysisTask {
  id: string;
  description: string;
  dependencies: string[];
  status: 'Pending' | 'Confirmed' | 'Modified' | 'Rejected';
} 