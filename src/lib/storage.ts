import type { AppState, Card } from "../types";
import { today } from "./sm2";
import { FRENCH_A1_CARDS } from "../data/french-a1";
import { QUANT_CARDS } from "../data/quant-cards";
import { QUANT_MATH_CARDS } from "../data/quant-math-cards";
import { QUANT_INTERACTIVE_CARDS } from "../data/quant-interactive-cards";

export async function loadCards(): Promise<Card[]> {
  const res = await fetch("/api/cards");
  const apiCards: Card[] = res.ok ? await res.json() : [];
  // Merge API cards with built-in decks (live client-side for now)
  const apiIds = new Set(apiCards.map((c) => c.id));
  const frenchCards = FRENCH_A1_CARDS.filter((c) => !apiIds.has(c.id));
  const quantCards = QUANT_CARDS.filter((c) => !apiIds.has(c.id));
  const mathCards = QUANT_MATH_CARDS.filter((c) => !apiIds.has(c.id));
  const interactiveCards = QUANT_INTERACTIVE_CARDS.filter((c) => !apiIds.has(c.id));
  return [...apiCards, ...frenchCards, ...quantCards, ...mathCards, ...interactiveCards];
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
