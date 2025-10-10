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
  [key: string]: any[];
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

export interface MatrixRow {
  id: string;
  source: string;
  idea: TranslatedString;
  problem: TranslatedString;
  solution: TranslatedString;
  owner: string;
  priority: string;
  complexity: number;
  explanation: TranslatedString;
  cost: number;
  costExplanation: TranslatedString;
  roi: number;
  roiExplanation: TranslatedString;
  risk: number;
  riskExplanation: TranslatedString;
  strategicAlignment: number;
  strategyExplanation: TranslatedString;
  finalPriority: string | number;
  weightedScore: number;
}
