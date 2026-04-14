import { useState, useCallback, useEffect, useMemo } from "react";
import type { Card, AppState, CardState, Lesson, LessonProgress, MasteryLevel } from "../types";
import { sm2, today, yesterday, addDays } from "../lib/sm2";
import { initApp, saveState } from "../lib/storage";
import { ALL_LESSONS, getLessonById } from "../data/lessons";

const MAX_NEW_PER_SESSION = 10;
const LEECH_THRESHOLD = 8;
const DIFFICULT_EASE_THRESHOLD = 1.8;
const DIFFICULT_LAPSE_THRESHOLD = 4;

export type View = "dashboard" | "path" | "lesson-intro" | "study" | "lesson-complete" | "done" | "speed-review" | "match-game" | "quiz-mode" | "stats";

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

  // Combo / streak counter
  const [comboCount, setComboCount] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const XP_PER_GRADE: Record<number, number> = { 0: 2, 2: 5, 4: 10, 5: 15 };

  const updateStreak = (s: AppState) => {
    const t = today();
    const y = yesterday();
    if (s.stats.lastReviewDate === t) return; // already updated today

    if (s.stats.lastReviewDate === y) {
      s.stats.streak++;
    } else if (s.stats.lastReviewDate && s.stats.lastReviewDate < y) {
      // Missed at least one day — try streak freeze
      const daysBefore = addDays(t, -2);
      if (s.stats.lastReviewDate === daysBefore && s.stats.streakFreezes > 0) {
        // Freeze covers exactly 1 missed day
        s.stats.streakFreezes--;
        s.stats.streak++;
      } else {
        s.stats.streak = 1;
      }
    } else {
      s.stats.streak = 1;
    }
    // Award streak freeze at 7-day milestone
    if (s.stats.streak === 7 && s.stats.streakFreezes < 2) {
      s.stats.streakFreezes++;
    }
    if (s.stats.streak > s.stats.longestStreak) {
      s.stats.longestStreak = s.stats.streak;
    }
    s.stats.lastReviewDate = t;
  };

  const recordReview = (s: AppState) => {
    const t = today();
    const log = [...s.stats.reviewLog];
    const last = log[log.length - 1];
    if (last && last.date === t) {
      last.count++;
    } else {
      log.push({ date: t, count: 1 });
    }
    // Keep only last 90 days
    const cutoff = addDays(t, -90);
    s.stats.reviewLog = log.filter((e) => e.date >= cutoff);
  };

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

      const newState = { ...state, stats: { ...state.stats } };

      updateStreak(newState);
      saveState(newState);
      setState(newState);

      setIsLessonMode(false);
      setQueue(newQueue);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionXp(0);
      setComboCount(0);
      setBestCombo(0);
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
    const newState = { ...state, stats: { ...state.stats } };
    updateStreak(newState);
    saveState(newState);
    setState(newState);

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

      // Track lapses and leeches
      const oldCard = state.cards[card.id];
      if (grade < 3) {
        updated.lapses = (oldCard.lapses ?? 0) + 1;
        if (updated.lapses >= LEECH_THRESHOLD) {
          updated.leech = true;
        }
      } else {
        updated.lapses = oldCard.lapses ?? 0;
        updated.leech = oldCard.leech ?? false;
      }

      // Combo tracking
      if (grade >= 3) {
        const newCombo = comboCount + 1;
        setComboCount(newCombo);
        if (newCombo > bestCombo) setBestCombo(newCombo);
      } else {
        setComboCount(0);
      }

      // Combo XP bonus
      let comboBonus = 0;
      if (grade >= 3 && (comboCount + 1) % 5 === 0) comboBonus = 5;
      if (grade >= 3 && (comboCount + 1) % 10 === 0) comboBonus = 10;

      const earned = (XP_PER_GRADE[grade] ?? 5) + comboBonus;
      const newState: AppState = {
        ...state,
        cards: { ...state.cards, [card.id]: updated },
        stats: {
          ...state.stats,
          totalReviews: state.stats.totalReviews + 1,
          xp: state.stats.xp + earned,
        },
      };
      recordReview(newState);
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
    [queue, currentIndex, state, isLessonMode, comboCount, bestCombo]
  );

  const answerCard = useCallback(
    (correct: boolean) => {
      if (!state) return;
      const card = queue[currentIndex];

      // Map correct/incorrect to SM-2 grades
      const grade = correct ? 4 : 1;
      const updated = sm2(state.cards[card.id], grade);

      // Track lapses
      const oldCard = state.cards[card.id];
      if (!correct) {
        updated.lapses = (oldCard.lapses ?? 0) + 1;
        if (updated.lapses >= LEECH_THRESHOLD) updated.leech = true;
      } else {
        updated.lapses = oldCard.lapses ?? 0;
        updated.leech = oldCard.leech ?? false;
      }

      // Combo
      if (correct) {
        const newCombo = comboCount + 1;
        setComboCount(newCombo);
        if (newCombo > bestCombo) setBestCombo(newCombo);
      } else {
        setComboCount(0);
      }

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
      recordReview(newState);
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

  // --- New study modes ---

  const getDifficultCards = useCallback(() => {
    if (!state) return [];
    return cards.filter((card) => {
      const s = state.cards[card.id];
      if (!s) return false;
      return (
        s.easeFactor < DIFFICULT_EASE_THRESHOLD ||
        (s.lapses ?? 0) >= DIFFICULT_LAPSE_THRESHOLD ||
        s.leech
      );
    });
  }, [cards, state]);

  const startDifficultReview = useCallback(() => {
    if (!state) return;
    const difficult = getDifficultCards();
    if (difficult.length === 0) return;
    // Shuffle
    for (let i = difficult.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [difficult[i], difficult[j]] = [difficult[j], difficult[i]];
    }
    const newState = { ...state, stats: { ...state.stats } };
    updateStreak(newState);
    saveState(newState);
    setState(newState);
    setIsLessonMode(false);
    setQueue(difficult);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionXp(0);
    setComboCount(0);
    setBestCombo(0);
    setView("study");
  }, [state, getDifficultCards]);

  const startSpeedReview = useCallback(() => {
    if (!state) return;
    const due = getDueCards();
    if (due.length === 0) return;
    // Shuffle for speed review
    const shuffled = [...due];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQueue(shuffled.slice(0, 20)); // Cap at 20 for speed review
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionXp(0);
    setComboCount(0);
    setBestCombo(0);
    setView("speed-review");
  }, [state, getDueCards]);

  const startMatchGame = useCallback(() => {
    setView("match-game");
  }, []);

  const startQuizMode = useCallback(() => {
    setView("quiz-mode");
  }, []);

  const viewStats = useCallback(() => {
    setView("stats");
  }, []);

  const getTodayReviewCount = useCallback(() => {
    if (!state) return 0;
    const t = today();
    const entry = state.stats.reviewLog.find((e) => e.date === t);
    return entry?.count ?? 0;
  }, [state]);

  const getLeechCount = useCallback(() => {
    if (!state) return 0;
    return Object.values(state.cards).filter((s) => s.leech).length;
  }, [state]);

  const getReviewForecast = useCallback(() => {
    if (!state) return [];
    const forecast: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(today(), d);
      let count = 0;
      for (const card of cards) {
        const s = state.cards[card.id];
        if (s && s.nextReviewDate === date) count++;
      }
      forecast.push({ date, count });
    }
    return forecast;
  }, [cards, state]);

  const getRetentionRate = useCallback(() => {
    if (!state) return 0;
    const reviewed = Object.values(state.cards).filter((s) => s.repetitions > 0);
    if (reviewed.length === 0) return 0;
    const good = reviewed.filter((s) => s.easeFactor >= 2.0);
    return Math.round((good.length / reviewed.length) * 100);
  }, [state]);

  const getHardestCards = useCallback(() => {
    if (!state) return [];
    return cards
      .filter((c) => state.cards[c.id]?.repetitions > 0)
      .sort((a, b) => state.cards[a.id].easeFactor - state.cards[b.id].easeFactor)
      .slice(0, 5);
  }, [cards, state]);

  const getCardStateCounts = useCallback(() => {
    if (!state) return { newCount: 0, learning: 0, mature: 0 };
    let newCount = 0, learning = 0, mature = 0;
    for (const s of Object.values(state.cards)) {
      if (s.repetitions === 0) newCount++;
      else if (s.interval < 21) learning++;
      else mature++;
    }
    return { newCount, learning, mature };
  }, [state]);

  const updateMatchBestTime = useCallback((time: number) => {
    if (!state) return;
    const newState = { ...state, stats: { ...state.stats } };
    if (!newState.stats.matchBestTime || time < newState.stats.matchBestTime) {
      newState.stats.matchBestTime = time;
    }
    saveState(newState);
    setState(newState);
  }, [state]);

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

    // Combo / engagement
    comboCount,
    bestCombo,
    todayReviewCount: getTodayReviewCount(),
    dailyGoal: state?.stats.dailyGoal ?? 10,
    streakFreezes: state?.stats.streakFreezes ?? 0,
    longestStreak: state?.stats.longestStreak ?? 0,
    reviewLog: state?.stats.reviewLog ?? [],
    difficultCount: getDifficultCards().length,
    leechCount: getLeechCount(),
    matchBestTime: state?.stats.matchBestTime ?? null,

    // Stats
    retentionRate: getRetentionRate(),
    reviewForecast: getReviewForecast(),
    hardestCards: getHardestCards(),
    cardStateCounts: getCardStateCounts(),
    allCards: cards,
    cardStates: state?.cards ?? {},

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

    // New study mode actions
    startDifficultReview,
    startSpeedReview,
    startMatchGame,
    startQuizMode,
    viewStats,
    updateMatchBestTime,
  };
}
