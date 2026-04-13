import type { AppState, Card } from "../types";
import { today } from "./sm2";

export async function loadCards(): Promise<Card[]> {
  const res = await fetch("/api/cards");
  if (!res.ok) return [];
  return res.json();
}

async function loadState(): Promise<AppState | null> {
  try {
    const res = await fetch("/api/state");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function saveState(state: AppState): Promise<void> {
  await fetch("/api/state", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
}

export async function initApp(): Promise<{ cards: Card[]; state: AppState }> {
  const [cards, existingState] = await Promise.all([
    loadCards(),
    loadState(),
  ]);

  const cardStates: AppState["cards"] = {};
  for (const card of cards) {
    cardStates[card.id] = existingState?.cards[card.id] ?? {
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: today(),
    };
  }

  const state: AppState = {
    cards: cardStates,
    stats: existingState?.stats ?? {
      streak: 0,
      lastReviewDate: null,
      totalReviews: 0,
      xp: 0,
    },
    lessonProgress: existingState?.lessonProgress ?? {},
  };

  if (
    !existingState ||
    Object.keys(cardStates).length !== Object.keys(existingState.cards).length
  ) {
    await saveState(state);
  }

  return { cards, state };
}
