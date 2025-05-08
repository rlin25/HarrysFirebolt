export interface DocumentationResult {
  requirements: Requirement[];
  taskBreakdown: TaskBreakdown;
  dependencyMap: DependencyMap;
  changeTracking: ChangeTracking;
  metadata: {
    generatedAt: string;
    version: string;
    format: 'JSONSchema' | 'Markdown' | 'JSON';
  };
}

export interface Requirement {
  id: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'InProgress' | 'Completed' | 'Rejected';
  relatedTasks: string[];
}

export interface TaskBreakdown {
  tasks: Task[];
  dependencies: Dependency[];
  timeline: Timeline;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies: string[];
}

export interface Dependency {
  from: string;
  to: string;
  type: 'blocks' | 'depends_on' | 'related_to';
}

export interface Timeline {
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  tasks: string[];
}

export interface DependencyMap {
  nodes: Node[];
  edges: Edge[];
}

export interface Node {
  id: string;
  type: 'task' | 'requirement' | 'component';
  name: string;
}

export interface Edge {
  from: string;
  to: string;
  type: string;
  weight?: number;
}

export interface ChangeTracking {
  changes: Change[];
  version: string;
  timestamp: string;
}

export interface Change {
  id: string;
  type: 'addition' | 'modification' | 'deletion';
  description: string;
  affectedComponents: string[];
  timestamp: string;
} 