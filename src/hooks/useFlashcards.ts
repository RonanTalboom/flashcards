import { useState, useCallback, useEffect } from "react";
import type { Card, AppState } from "../types";
import { sm2, today, yesterday } from "../lib/sm2";
import { initApp, saveState } from "../lib/storage";

const MAX_NEW_PER_SESSION = 10;

export type View = "dashboard" | "study" | "done";

export function useFlashcards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [state, setState] = useState<AppState | null>(null);
  const [queue, setQueue] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [sessionXp, setSessionXp] = useState(0);
  const [loading, setLoading] = useState(true);

  const XP_PER_GRADE: Record<number, number> = { 0: 2, 2: 5, 4: 10, 5: 15 };

  const getLevel = (xp: number) =>
    Math.floor((1 + Math.sqrt(1 + (4 * xp) / 25)) / 2);

  const levelThreshold = (n: number) => 25 * n * (n - 1);

  useEffect(() => {
    initApp().then(({ cards: c, state: s }) => {
      setCards(c);
      setState(s);
      setLoading(false);
    });
  }, []);

  const getDueCards = useCallback(() => {
    if (!state) return [];
    const t = today();
    return cards.filter((card) => state.cards[card.id]?.nextReviewDate <= t);
  }, [cards, state]);

  const getNewCards = useCallback(() => {
    if (!state) return [];
    return cards.filter((card) => {
      const s = state.cards[card.id];
      return s && s.repetitions === 0 && s.interval === 0;
    });
  }, [cards, state]);

  const getLearnedCount = useCallback(() => {
    if (!state) return 0;
    return cards.filter((card) => state.cards[card.id]?.repetitions > 0)
      .length;
  }, [cards, state]);

  const getCategoryBreakdown = useCallback(() => {
    if (!state) return [];
    const cats: Record<string, { total: number; learned: number }> = {};
    for (const card of cards) {
      if (!cats[card.category]) cats[card.category] = { total: 0, learned: 0 };
      cats[card.category].total++;
      if (state.cards[card.id]?.repetitions > 0) cats[card.category].learned++;
    }
    return Object.entries(cats).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [cards, state]);

  const startStudy = useCallback(() => {
    if (!state) return;
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

    // Adaptive difficulty: harder cards first
    reviewCards.sort(
      (a, b) => state.cards[a.id].easeFactor - state.cards[b.id].easeFactor
    );

    const newQueue = [...reviewCards, ...cappedNew];

    // Interleave: shuffle within chunks of 4
    for (let i = 0; i < newQueue.length; i += 4) {
      const end = Math.min(i + 4, newQueue.length);
      for (let j = end - 1; j > i; j--) {
        const k = i + Math.floor(Math.random() * (j - i + 1));
        [newQueue[j], newQueue[k]] = [newQueue[k], newQueue[j]];
      }
    }

    if (newQueue.length === 0) return;

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
    setSessionXp(0);
    setView("study");
  }, [getDueCards, state]);

  const flipCard = useCallback(() => {
    if (!isFlipped) setIsFlipped(true);
  }, [isFlipped]);

  const rateCard = useCallback(
    (grade: number) => {
      if (!state) return;
      const card = queue[currentIndex];
      const updated = sm2(state.cards[card.id], grade);

      const earned = XP_PER_GRADE[grade] ?? 5;
      const newState: AppState = {
        ...state,
        cards: { ...state.cards, [card.id]: updated },
        stats: {
          ...state.stats,
          totalReviews: state.stats.totalReviews + 1,
          xp: state.stats.xp + earned,
        },
      };
      saveState(newState);
      setState(newState);
      setSessionXp((prev) => prev + earned);

      const newQ = [...queue];
      if (grade < 3) {
        newQ.push(card);
        setQueue(newQ);
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= newQ.length) {
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
  const xp = state?.stats.xp ?? 0;
  const currentLevel = getLevel(xp);
  const lvlStart = levelThreshold(currentLevel);
  const lvlSize = 50 * currentLevel;

  return {
    loading,
    view,
    currentCard,
    isFlipped,
    currentIndex,
    queueLength: queue.length,
    dueCount: dueCards.length,
    newCount: getNewCards().length,
    learnedCount: getLearnedCount(),
    totalCards: cards.length,
    categoryBreakdown: getCategoryBreakdown(),
    studyCount: Math.min(
      dueCards.length,
      MAX_NEW_PER_SESSION +
        dueCards.filter((c) => (state?.cards[c.id]?.repetitions ?? 0) > 0).length
    ),
    sessionXp,
    xp,
    level: currentLevel,
    levelProgress: lvlSize > 0 ? (xp - lvlStart) / lvlSize : 0,
    streak: state?.stats.streak ?? 0,
    totalReviews: state?.stats.totalReviews ?? 0,
    startStudy,
    flipCard,
    rateCard,
    backToDashboard,
  };
}
