// === Cards (existing, extended) ===

export interface Card {
  id: number;
  category: string;
  front: string;
  back: string;
  keyPoints: string[];
  exerciseType?: "flashcard" | "mcq" | "fill-blank";
  choices?: string[];
  correctAnswer?: number | string; // index for MCQ, string for fill-blank
  image?: string; // inline SVG or URL
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
  color: string; // CSS color for theming
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  image?: string; // SVG string for lesson header
  cards: number[]; // card IDs
  prerequisites: string[]; // lesson IDs
  concepts: string[]; // key concepts shown in intro
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
