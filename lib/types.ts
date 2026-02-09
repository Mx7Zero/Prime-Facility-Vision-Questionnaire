export type QuestionType = 'single' | 'multi' | 'text' | 'rank' | 'percentage';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  hasOther?: boolean;
  otherLabel?: string;
  placeholder?: string;
  maxSelections?: number;
  rankSlots?: number;
  zones?: string[];
  recommendedAllocations?: Record<string, number>;
}

export interface Section {
  id: string;
  number: number;
  title: string;
  icon: string;
  description: string;
  questions: Question[];
}

export interface QuestionnaireData {
  sections: Section[];
}

export interface SingleResponse {
  selected: string | null;
  other: string | null;
}

export interface MultiResponse {
  selected: string[];
  other: string | null;
}

export interface TextResponse {
  text: string;
}

export interface RankResponse {
  ranked: string[];
}

export interface PercentageResponse {
  allocations: Record<string, number>;
}

export type QuestionResponse =
  | SingleResponse
  | MultiResponse
  | TextResponse
  | RankResponse
  | PercentageResponse;

export interface Respondent {
  name: string;
  email: string;
  role: string;
}

export interface SavedState {
  respondent: Respondent;
  responses: Record<string, QuestionResponse>;
  currentSection: number;
  lastUpdated: string;
}

export interface SubmissionPayload {
  respondent: Respondent;
  responses: Record<string, QuestionResponse>;
  completionRate: number;
  submittedAt: string;
}
