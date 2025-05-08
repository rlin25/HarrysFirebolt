export interface FeedbackData {
  id: string;
  promptId: string;
  rating: number;
  comments?: string;
  timestamp: string;
  metadata: {
    clarity: number;
    validation: number;
    enhancement: number;
    userSatisfaction: number;
  };
}

export interface QualityMetrics {
  clarityScore: number;
  validationRate: number;
  enhancementRate: number;
  userSatisfaction: number;
}

export interface PerformanceMetrics {
  promptAnalysis: number;
  documentation: number;
  interaction: number;
}

export interface LearningData {
  patterns: Pattern[];
  adaptations: Adaptation[];
  performance: PerformanceMetrics;
}

export interface Pattern {
  id: string;
  type: 'success' | 'failure' | 'neutral';
  frequency: number;
  lastSeen: string;
  metadata: {
    clarity: number;
    validation: number;
    enhancement: number;
    userSatisfaction: number;
  };
}

export interface Adaptation {
  id: string;
  type: 'threshold' | 'rule' | 'parameter';
  value: any;
  reason: string;
  timestamp: string;
} 