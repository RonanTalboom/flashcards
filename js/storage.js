import { today } from "./sm2.js";
import { CARDS } from "./cards.js";

const STORAGE_KEY = "flashcards_state";

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function initState() {
  const existing = loadState();
  if (existing) return existing;

  const cards = {};
  for (const card of CARDS) {
    cards[card.id] = {
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: today(),
    };
  }

  const state = {
    cards,
    stats: {
      streak: 0,
      lastReviewDate: null,
      totalReviews: 0,
    },
  };

  saveState(state);
  return state;
}
