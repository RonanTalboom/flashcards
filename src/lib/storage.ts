import type { AppState } from "../types";
import { CARDS } from "../data/cards";
import { today } from "./sm2";

const STORAGE_KEY = "flashcards_state";

export function loadState(): AppState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AppState;
    } catch {
      return null;
    }
  }
  return null;
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function initState(): AppState {
  const existing = loadState();
  if (existing) return existing;

  const cards: AppState["cards"] = {};
  for (const card of CARDS) {
    cards[card.id] = {
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: today(),
    };
  }

  const state: AppState = {
    cards,
    stats: {
      streak: 0,
      lastReviewDate: null,
      totalReviews: 0,
      xp: 0,
    },
  };

  saveState(state);
  return state;
}
