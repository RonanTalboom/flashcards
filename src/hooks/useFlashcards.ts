import { useState, useCallback, useEffect, useMemo } from "react";
import type { Card, AppState, CardState, Lesson, LessonProgress, MasteryLevel } from "../types";
import { sm2, today, yesterday } from "../lib/sm2";
import { initApp, saveState } from "../lib/storage";
import { ALL_LESSONS, getLessonById } from "../data/lessons";

const MAX_NEW_PER_SESSION = 10;

export type View = "dashboard" | "path" | "lesson-intro" | "study" | "lesson-complete" | "done";

// --- Mastery helpers ---

function getLessonMastery(
  lesson: Lesson,
  cardStates: Record<number, CardState>,
  lessonProgress: Record<string, LessonProgress>,
  _visited?: Set<string>
): MasteryLevel {
  const visited = _visited ?? new Set<string>();
  if (visited.has(lesson.id)) return "locked";
  visited.add(lesson.id);

  // Check prerequisites
  for (const prereqId of lesson.prerequisites) {
    const prereq = getLessonById(prereqId);
    if (!prereq) continue;
    const prereqMastery = getLessonMastery(prereq, cardStates, lessonProgress, visited);
    if (prereqMastery === "locked" || prereqMastery === "available") return "locked";
  }

  const progress = lessonProgress[lesson.id];
  if (!progress || !progress.completed) return "available";

  // Check card mastery
  const cardMasteries: number[] = lesson.cards.map((id) => {
    const s = cardStates[id];
    if (!s || s.repetitions === 0) return 0;
    if (s.repetitions >= 3 && s.easeFactor >= 2.3) return 3; // mastered
    if (s.repetitions >= 2) return 2; // proficient
    return 1; // familiar
  });

  const avg =
    cardMasteries.length > 0
      ? cardMasteries.reduce((a, b) => a + b, 0) / cardMasteries.length
      : 0;
  if (avg >= 2.5) return "mastered";
  if (avg >= 1.5) return "proficient";
  return "familiar";
}

function computeAllMastery(
  cardStates: Record<number, CardState>,
  lessonProgress: Record<string, LessonProgress>
): Record<string, MasteryLevel> {
  const result: Record<string, MasteryLevel> = {};
  for (const lesson of ALL_LESSONS) {
    result[lesson.id] = getLessonMastery(lesson, cardStates, lessonProgress);
  }
  return result;
}

export function useFlashcards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [state, setState] = useState<AppState | null>(null);
  const [queue, setQueue] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [sessionXp, setSessionXp] = useState(0);
  const [loading, setLoading] = useState(true);

  // Learning path state
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLessonMode, setIsLessonMode] = useState(false);
  const [lessonCorrectCount, setLessonCorrectCount] = useState(0);
  const [lessonTotalCount, setLessonTotalCount] = useState(0);

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

  // Compute mastery map
  const lessonMastery = useMemo<Record<string, MasteryLevel>>(() => {
    if (!state) return {};
    return computeAllMastery(state.cards, state.lessonProgress);
  }, [state]);

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
    return cards.filter((card) => state.cards[card.id]?.repetitions > 0).length;
  }, [cards, state]);

  const getCategoryBreakdown = useCallback(() => {
    if (!state) return [];
    const t = today();
    const cats: Record<string, { total: number; learned: number; due: number }> = {};
    for (const card of cards) {
      if (!cats[card.category]) cats[card.category] = { total: 0, learned: 0, due: 0 };
      cats[card.category].total++;
      if (state.cards[card.id]?.repetitions > 0) cats[card.category].learned++;
      if (state.cards[card.id]?.nextReviewDate <= t) cats[card.category].due++;
    }
    return Object.entries(cats).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [cards, state]);

  // --- Review flow (existing) ---

  const startStudy = useCallback(
    (category?: string) => {
      if (!state) return;
      const allDue = getDueCards();
      const due = category ? allDue.filter((c) => c.category === category) : allDue;
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

      setIsLessonMode(false);
      setQueue(newQueue);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionXp(0);
      setView("study");
    },
    [getDueCards, state]
  );

  // --- Learning path flow ---

  const viewPath = useCallback(() => {
    setView("path");
  }, []);

  const selectLesson = useCallback(
    (lessonId: string) => {
      const lesson = getLessonById(lessonId);
      if (!lesson) return;
      // Don't allow selecting locked lessons
      if (lessonMastery[lessonId] === "locked") return;
      setCurrentLesson(lesson);
      setCurrentSection(lesson.sectionId);
      setView("lesson-intro");
    },
    [lessonMastery]
  );

  const startLesson = useCallback(() => {
    if (!currentLesson || !state) return;

    // Build queue from lesson cards
    const lessonCards = currentLesson.cards
      .map((id) => cards.find((c) => c.id === id))
      .filter((c): c is Card => c !== undefined);

    if (lessonCards.length === 0) return;

    // Update streak on lesson start too
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

    setIsLessonMode(true);
    setQueue(lessonCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionXp(0);
    setLessonCorrectCount(0);
    setLessonTotalCount(0);
    setView("study");
  }, [currentLesson, cards, state]);

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

      // Track lesson correctness for flashcard-style cards
      if (isLessonMode) {
        setLessonTotalCount((prev) => prev + 1);
        if (grade >= 3) {
          setLessonCorrectCount((prev) => prev + 1);
        }
      }

      const newQ = [...queue];
      if (grade < 3 && !isLessonMode) {
        // Only re-queue failed cards in review mode, not lesson mode
        newQ.push(card);
        setQueue(newQ);
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= newQ.length) {
        if (isLessonMode) {
          setView("lesson-complete");
        } else {
          setView("done");
        }
      } else {
        setCurrentIndex(nextIndex);
        setIsFlipped(false);
      }
    },
    [queue, currentIndex, state, isLessonMode]
  );

  const answerCard = useCallback(
    (correct: boolean) => {
      if (!state) return;
      const card = queue[currentIndex];

      // Map correct/incorrect to SM-2 grades
      const grade = correct ? 4 : 1;
      const updated = sm2(state.cards[card.id], grade);

      const earned = correct ? 10 : 2;
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

      setLessonTotalCount((prev) => prev + 1);
      if (correct) {
        setLessonCorrectCount((prev) => prev + 1);
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        setView("lesson-complete");
      } else {
        setCurrentIndex(nextIndex);
        setIsFlipped(false);
      }
    },
    [queue, currentIndex, state]
  );

  const completeLesson = useCallback(() => {
    if (!state || !currentLesson) return;

    const progress: LessonProgress = {
      completed: true,
      completedAt: new Date().toISOString(),
      correctCount: lessonCorrectCount,
      totalCount: lessonTotalCount,
    };

    const newState: AppState = {
      ...state,
      lessonProgress: {
        ...state.lessonProgress,
        [currentLesson.id]: progress,
      },
    };
    saveState(newState);
    setState(newState);

    setView("path");
    setCurrentLesson(null);
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [state, currentLesson, lessonCorrectCount, lessonTotalCount]);

  const backToDashboard = useCallback(() => {
    setView("dashboard");
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsLessonMode(false);
    setCurrentLesson(null);
    setCurrentSection(null);
  }, []);

  const backToPath = useCallback(() => {
    setView("path");
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCurrentLesson(null);
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

    // Learning path state
    currentSection,
    currentLesson,
    isLessonMode,
    lessonMastery,
    lessonProgress: state?.lessonProgress ?? {},
    lessonCorrectCount,
    lessonTotalCount,

    // Actions
    startStudy,
    flipCard,
    rateCard,
    answerCard,
    backToDashboard,

    // Learning path actions
    viewPath,
    selectLesson,
    startLesson,
    completeLesson,
    backToPath,
  };
}
