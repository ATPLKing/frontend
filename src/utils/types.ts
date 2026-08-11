export interface Option {
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  question: string;
  explanation?: string;
  options: Option[];
  subtopic: string;
}

export interface SubtopicMetadata {
  code: string;
  name: string;
}

export interface SubjectMetadata {
  code: string;
  name: string;
  subtopics: SubtopicMetadata[];
}

export interface SubtopicStats {
  code: string;
  name: string;
  count: number;
}

export interface SubjectStats {
  code: string;
  name: string;
  total: number;
  subtopics: SubtopicStats[];
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  subjects: SubjectMetadata[];
  questions: Question[];
}

export interface TestParams {
  mode: string;
  bankId: string;
  bankName: string;
  subject: string;
  questions: Question[];
  minSuccessScore: number;
}

export interface Test {
  id: string;
  mode: string;
  bankId: string;
  bankName: string;
  subject: string;
  createdAt: string;
  questions: Question[];
  userAnswers: (number | null)[];
  params: TestParams;
  timeElapsed?: number;
  saveAt?: string;
  score?: number;
  database?: string;
  uv?: string;
}

export type ThemeMode = "light" | "dark";
