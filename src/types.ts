export interface Card {
  id: number;
  category: string;
  front: string;
  back: string;
  keyPoints: string[];
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
}

export interface AppState {
  cards: Record<number, CardState>;
  stats: Stats;
}
