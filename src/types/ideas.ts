// Core data types for ideas and departments

// New interface for the modern data structure using translation keys
export interface NewFormatIdea {
  finalPrio: string | number;
  ideaKey: string;
  problemKey: string;
  solutionKey: string;
  owner: string;
  priority: string;
  complexity: number;
  complexityNoteKey?: string;
  cost: number;
  costNoteKey?: string;
  roi: number;
  roiNote?: string; // Legacy field still sometimes used
  roiNoteKey?: string;
  risk: number;
  riskNoteKey?: string;
  strategicAlignment: number;
  strategicNoteKey?: string;
}

export interface HomeInfo {
  date: string;
  department: string;
  businessLine?: string;
  collaboardLink: string;
}
