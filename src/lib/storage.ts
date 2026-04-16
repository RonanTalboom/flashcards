import type { AppState, Card } from "../types";
import { newCardState, migrateSM2 } from "./fsrs";
import { FRENCH_A1_CARDS } from "../data/french-a1";
import { QUANT_CARDS } from "../data/quant-cards";
import { QUANT_MATH_CARDS } from "../data/quant-math-cards";
import { QUANT_INTERACTIVE_CARDS } from "../data/quant-interactive-cards";
import { CONJUGATION_CARDS } from "../data/conjugation-cards";
import { BUSINESS_CARDS } from "../data/business-cards";
import { MODULE_DESIGN_CARDS } from "../data/module-design-cards";
import { KAHNEMAN_CARDS } from "../data/kahneman-cards";
import { DDIA_GLOSSARY_CARDS } from "../data/ddia-glossary-cards";
import { ACHIEVEMENT_DEFINITIONS } from "./achievements";

export async function loadCards(): Promise<Card[]> {
  const res = await fetch("/api/cards");
  const apiCards: Card[] = res.ok ? await res.json() : [];
  const apiIds = new Set(apiCards.map((c) => c.id));
  const frenchCards = FRENCH_A1_CARDS.filter((c) => !apiIds.has(c.id));
  const quantCards = QUANT_CARDS.filter((c) => !apiIds.has(c.id));
  const mathCards = QUANT_MATH_CARDS.filter((c) => !apiIds.has(c.id));
  const interactiveCards = QUANT_INTERACTIVE_CARDS.filter((c) => !apiIds.has(c.id));
  const conjugationCards = CONJUGATION_CARDS.filter((c) => !apiIds.has(c.id));
  const businessCards = BUSINESS_CARDS.filter((c) => !apiIds.has(c.id));
  const moduleDesignCards = MODULE_DESIGN_CARDS.filter((c) => !apiIds.has(c.id));
  const kahnemanCards = KAHNEMAN_CARDS.filter((c) => !apiIds.has(c.id));
  const ddiaGlossaryCards = DDIA_GLOSSARY_CARDS.filter((c) => !apiIds.has(c.id));

  const allCards = [
    ...apiCards,
    ...frenchCards,
    ...quantCards,
    ...mathCards,
    ...interactiveCards,
    ...conjugationCards,
    ...businessCards,
    ...moduleDesignCards,
    ...kahnemanCards,
    ...ddiaGlossaryCards,
  ];

  // Generate reverse cards for vocabulary cards
  const reverseCards: Card[] = [];
  for (const card of allCards) {
    if (card.type === "vocabulary" && card.back && !card.reverseOf) {
      const reverseId = card.id + 50000;
      if (!apiIds.has(reverseId) && !allCards.some((c) => c.id === reverseId)) {
        reverseCards.push({
          id: reverseId,
          category: card.category,
          front: card.back,
          back: card.article ? `${card.article} ${card.front}` : card.front,
          keyPoints: card.keyPoints,
          exerciseType: "flashcard",
          type: "vocabulary",
          deck: card.deck,
          gender: card.gender,
          article: card.article,
          pronunciation: card.pronunciation,
          sentence: card.sentenceTranslation,
          sentenceTranslation: card.sentence,
          cefrLevel: card.cefrLevel,
          reverseOf: card.id,
        });
      }
    }
  }

  return [...allCards, ...reverseCards];
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
    const existing = existingState?.cards[card.id];
    if (existing) {
      // Migrate SM-2 state to FSRS if needed
      cardStates[card.id] = migrateSM2(existing as unknown as Record<string, unknown>);
    } else {
      cardStates[card.id] = newCardState();
    }
  }

  const existingStats = existingState?.stats;
  const state: AppState = {
    cards: cardStates,
    stats: {
      streak: existingStats?.streak ?? 0,
      longestStreak: existingStats?.longestStreak ?? existingStats?.streak ?? 0,
      lastReviewDate: existingStats?.lastReviewDate ?? null,
      totalReviews: existingStats?.totalReviews ?? 0,
      xp: existingStats?.xp ?? 0,
      dailyGoal: existingStats?.dailyGoal ?? 10,
      streakFreezes: existingStats?.streakFreezes ?? 0,
      reviewLog: existingStats?.reviewLog ?? [],
      matchBestTime: existingStats?.matchBestTime ?? null,
      achievements: existingStats?.achievements ?? ACHIEVEMENT_DEFINITIONS.map((a) => ({ ...a, unlockedAt: null })),
      calibrationLog: existingStats?.calibrationLog ?? [],
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
