// === Card Types ===

export type CardType = "basic" | "vocabulary" | "cloze";
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Gender = "masculine" | "feminine";

export interface Card {
  id: number;
  category: string;
  front: string;
  back: string;
  keyPoints: string[];

  // Exercise variants
  exerciseType?: "flashcard" | "mcq" | "fill-blank" | "cloze" | "math" | "interactive";
  choices?: string[];
  correctAnswer?: number | string;
  image?: string;

  // Math exercise fields
  mathAnswer?: number;
  tolerance?: number;
  unit?: string;
  hints?: string[];

  // Interactive plot fields
  plotType?: "kelly-curve" | "ev-calculator" | "bayes-updater" | "brier-score" | "vpin-gauge";

  // Language learning fields
  type?: CardType;
  deck?: string;
  gender?: Gender;
  article?: string;
  pronunciation?: string;
  sentence?: string;
  sentenceTranslation?: string;
  cefrLevel?: CEFRLevel;
  clozeText?: string;
}

export interface CardState {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
}

export interface Stats {
  streak: number;
  lastReviewDate: string | null;
  totalReviews: number;
  xp: number;
}

export interface AppState {
  cards: Record<number, CardState>;
  stats: Stats;
  lessonProgress: Record<string, LessonProgress>;
}

// === Learning Path ===

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  image?: string;
  cards: number[];
  prerequisites: string[];
  concepts: string[];
}

export interface LessonProgress {
  completed: boolean;
  completedAt: string | null;
  correctCount: number;
  totalCount: number;
}

export type MasteryLevel =
  | "locked"
  | "available"
  | "familiar"
  | "proficient"
  | "mastered";
