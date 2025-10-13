export interface Participant {
  cResort: string;
  groupNumber: string;
  groupName: string;
  type: string;
  name: string;
  organisationalUnit: string;
  businessLine: string;
  day1: boolean;
  day2: boolean;
  day3: boolean;
  site?: string;
}

export interface DepartmentData {
  [key: string]: Record<string, unknown>[];
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  department: string;
  owner: string;
  priority?: number;
  impact?: number;
  effort?: number;
  participants?: string[];
}

export interface TranslatedString {
  de: string;
  en: string;
}

// Union type to handle both old format (TranslatedString) and new format (translation key)
export type LocalizableString = TranslatedString | string;

// Removed old MatrixRow interface - focusing on NewFormatIdea only

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
