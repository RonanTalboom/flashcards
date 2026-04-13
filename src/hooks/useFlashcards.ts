import { useState, useCallback } from "react";
import type { Card, AppState } from "../types";
import { CARDS } from "../data/cards";
import { sm2, today, yesterday } from "../lib/sm2";
import { initState, saveState } from "../lib/storage";

const MAX_NEW_PER_SESSION = 10;

export type View = "dashboard" | "study" | "done";

export function useFlashcards() {
  const [state, setState] = useState<AppState>(initState);
  const [queue, setQueue] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [view, setView] = useState<View>("dashboard");

  const getDueCards = useCallback(() => {
    const t = today();
    return CARDS.filter((card) => state.cards[card.id].nextReviewDate <= t);
  }, [state]);

  const getNewCards = useCallback(() => {
    return CARDS.filter((card) => {
      const s = state.cards[card.id];
      return s.repetitions === 0 && s.interval === 0;
    });
  }, [state]);

  const getLearnedCount = useCallback(() => {
    return CARDS.filter((card) => state.cards[card.id].repetitions > 0).length;
  }, [state]);

  const getCategoryBreakdown = useCallback(() => {
    const cats: Record<string, { total: number; learned: number }> = {};
    for (const card of CARDS) {
      if (!cats[card.category]) cats[card.category] = { total: 0, learned: 0 };
      cats[card.category].total++;
      if (state.cards[card.id].repetitions > 0) cats[card.category].learned++;
    }
    return Object.entries(cats).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [state]);

  const startStudy = useCallback(() => {
    const due = getDueCards();
    const newCards = due.filter((c) => {
      const s = state.cards[c.id];
      return s.repetitions === 0 && s.interval === 0;
    });
    const reviewCards = due.filter((c) => {
      const s = state.cards[c.id];
      return !(s.repetitions === 0 && s.interval === 0);
    });

    const cappedNew = newCards.slice(0, MAX_NEW_PER_SESSION);
    const newQueue = [...reviewCards, ...cappedNew];

    if (newQueue.length === 0) return;

    // Update streak
    const t = today();
    const y = yesterday();
    const newState = { ...state, stats: { ...state.stats } };

    if (newState.stats.lastReviewDate !== t) {
      if (newState.stats.lastReviewDate === y) {
        newState.stats.streak++;
      } else {
        newState.stats.streak = 1;
      }
      newState.stats.lastReviewDate = t;
      saveState(newState);
      setState(newState);
    }

    setQueue(newQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
    setView("study");
  }, [getDueCards, state]);

  const flipCard = useCallback(() => {
    if (!isFlipped) setIsFlipped(true);
  }, [isFlipped]);

  const rateCard = useCallback(
    (grade: number) => {
      const card = queue[currentIndex];
      const updated = sm2(state.cards[card.id], grade);

      const newState: AppState = {
        ...state,
        cards: { ...state.cards, [card.id]: updated },
        stats: { ...state.stats, totalReviews: state.stats.totalReviews + 1 },
      };
      saveState(newState);
      setState(newState);

      const newQueue = [...queue];
      if (grade < 3) {
        newQueue.push(card);
        setQueue(newQueue);
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= newQueue.length) {
        setView("done");
      } else {
        setCurrentIndex(nextIndex);
        setIsFlipped(false);
      }
    },
    [queue, currentIndex, state]
  );

  const backToDashboard = useCallback(() => {
    setView("dashboard");
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  const currentCard = queue[currentIndex] ?? null;
  const dueCards = getDueCards();

  return {
    view,
    state,
    currentCard,
    isFlipped,
    currentIndex,
    queueLength: queue.length,
    dueCount: dueCards.length,
    newCount: getNewCards().length,
    learnedCount: getLearnedCount(),
    totalCards: CARDS.length,
    categoryBreakdown: getCategoryBreakdown(),
    studyCount: Math.min(
      dueCards.length,
      MAX_NEW_PER_SESSION +
        dueCards.filter((c) => state.cards[c.id].repetitions > 0).length
    ),
    startStudy,
    flipCard,
    rateCard,
    backToDashboard,
  };
}
