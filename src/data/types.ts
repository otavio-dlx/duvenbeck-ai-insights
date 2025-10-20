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

// Re-export from separated type files to maintain backward compatibility
export type { HomeInfo, NewFormatIdea } from "../types/ideas";
export type { LocalizableString, TranslatedString } from "../types/shared";
