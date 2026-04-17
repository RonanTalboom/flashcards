import { useState, useCallback, useEffect, useMemo } from "react";
import type { Card, AppState, CardState, Lesson, LessonProgress, MasteryLevel, Achievement, CalibrationEntry } from "../types";
import { reviewCard, getSchedulingIntervals, today, yesterday, addDays } from "../lib/fsrs";
import { initApp, saveState } from "../lib/storage";
import { ALL_LESSONS, getLessonById } from "../data/lessons";
import { checkAchievements } from "../lib/achievements";

const MAX_NEW_PER_SESSION = 10;
const LEECH_THRESHOLD = 8;
const DIFFICULT_DIFFICULTY_THRESHOLD = 7;
const DIFFICULT_LAPSE_THRESHOLD = 4;

export type View = "dashboard" | "paths" | "path" | "lesson-intro" | "study" | "lesson-complete" | "done" | "speed-review" | "match-game" | "quiz-mode" | "stats";

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

  for (const prereqId of lesson.prerequisites) {
    const prereq = getLessonById(prereqId);
    if (!prereq) continue;
    const prereqMastery = getLessonMastery(prereq, cardStates, lessonProgress, visited);
    if (prereqMastery === "locked" || prereqMastery === "available") return "locked";
  }

  const progress = lessonProgress[lesson.id];
  if (!progress || !progress.completed) return "available";

  const cardMasteries: number[] = lesson.cards.map((id) => {
    const s = cardStates[id];
    if (!s || s.reps === 0) return 0;
    if (s.reps >= 3 && s.difficulty <= 4) return 3; // mastered (low difficulty = easy)
    if (s.reps >= 2) return 2; // proficient
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

  // Achievements
  const [pendingAchievement, setPendingAchievement] = useState<Achievement | null>(null);

  // Confidence calibration
  const [pendingConfidence, setPendingConfidence] = useState<CalibrationEntry["confidence"] | null>(null);

  const XP_PER_GRADE: Record<number, number> = { 0: 2, 2: 5, 4: 10, 5: 15 };

  const updateStreak = (s: AppState) => {
    const t = today();
    const y = yesterday();
    if (s.stats.lastReviewDate === t) return;

    if (s.stats.lastReviewDate === y) {
      s.stats.streak++;
    } else if (s.stats.lastReviewDate && s.stats.lastReviewDate < y) {
      const daysBefore = addDays(t, -2);
      if (s.stats.lastReviewDate === daysBefore && s.stats.streakFreezes > 0) {
        s.stats.streakFreezes--;
        s.stats.streak++;
      } else {
        s.stats.streak = 1;
      }
    } else {
      s.stats.streak = 1;
    }
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
    const cutoff = addDays(t, -90);
    s.stats.reviewLog = log.filter((e) => e.date >= cutoff);
  };

  const triggerAchievements = (newState: AppState, context: Parameters<typeof checkAchievements>[1]) => {
    const unlocked = checkAchievements(newState, { ...context, cards });
    if (unlocked.length > 0) {
      const a = newState.stats.achievements.find((x) => x.id === unlocked[0]);
      if (a) setPendingAchievement(a);
    }
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
      return s && s.cardState === "new";
    });
  }, [cards, state]);

  const getLearnedCount = useCallback(() => {
    if (!state) return 0;
    return cards.filter((card) => state.cards[card.id]?.reps > 0).length;
  }, [cards, state]);

  const getCategoryBreakdown = useCallback(() => {
    if (!state) return [];
    const t = today();
    const cats: Record<string, { total: number; learned: number; due: number }> = {};
    for (const card of cards) {
      if (!cats[card.category]) cats[card.category] = { total: 0, learned: 0, due: 0 };
      cats[card.category].total++;
      if (state.cards[card.id]?.reps > 0) cats[card.category].learned++;
      if (state.cards[card.id]?.nextReviewDate <= t) cats[card.category].due++;
    }
    return Object.entries(cats).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [cards, state]);

  // --- Review flow ---

  const startStudy = useCallback(
    (category?: string) => {
      if (!state) return;
      const allDue = getDueCards();
      const due = category ? allDue.filter((c) => c.category === category) : allDue;
      const newCards = due.filter((c) => {
        const s = state.cards[c.id];
        return s.cardState === "new";
      });
      const reviewCards = due.filter((c) => {
        const s = state.cards[c.id];
        return s.cardState !== "new";
      });

      const cappedNew = newCards.slice(0, MAX_NEW_PER_SESSION);

      // Adaptive difficulty: harder cards first (higher difficulty = harder in FSRS)
      reviewCards.sort(
        (a, b) => state.cards[b.id].difficulty - state.cards[a.id].difficulty
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
      setPendingConfidence(null);
      setView("study");
    },
    [getDueCards, state]
  );

  // --- Learning path flow ---

  const viewPath = useCallback(() => {
    setView("paths");
  }, []);

  const selectPath = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    setView("path");
  }, []);

  const selectLesson = useCallback(
    (lessonId: string) => {
      const lesson = getLessonById(lessonId);
      if (!lesson) return;
      if (lessonMastery[lessonId] === "locked") return;
      setCurrentLesson(lesson);
      setCurrentSection(lesson.sectionId);
      setView("lesson-intro");
    },
    [lessonMastery]
  );

  const startLesson = useCallback(() => {
    if (!currentLesson || !state) return;

    const lessonCards = currentLesson.cards
      .map((id) => cards.find((c) => c.id === id))
      .filter((c): c is Card => c !== undefined);

    if (lessonCards.length === 0) return;

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
    setPendingConfidence(null);
    setView("study");
  }, [currentLesson, cards, state]);

  const flipCard = useCallback(() => {
    if (!isFlipped) setIsFlipped(true);
  }, [isFlipped]);

  const rateCard = useCallback(
    (grade: number) => {
      if (!state) return;
      const card = queue[currentIndex];
      const oldCardState = state.cards[card.id];
      const updated = reviewCard(oldCardState, grade);

      // Track lapses and leeches
      if (grade < 3) {
        updated.lapses = oldCardState.lapses + 1;
        if (updated.lapses >= LEECH_THRESHOLD) {
          updated.leech = true;
        }
      }

      // Deep recall detection (for achievements)
      let ratedGoodAfterDays: number | undefined;
      if (grade >= 3 && oldCardState.scheduledDays >= 30) {
        ratedGoodAfterDays = oldCardState.scheduledDays;
      }

      // Combo tracking
      if (grade >= 3) {
        const newCombo = comboCount + 1;
        setComboCount(newCombo);
        if (newCombo > bestCombo) setBestCombo(newCombo);
      } else {
        setComboCount(0);
      }

      let comboBonus = 0;
      if (grade >= 3 && (comboCount + 1) % 5 === 0) comboBonus = 5;
      if (grade >= 3 && (comboCount + 1) % 10 === 0) comboBonus = 10;

      const earned = (XP_PER_GRADE[grade] ?? 5) + comboBonus;

      // Confidence calibration
      if (pendingConfidence) {
        const entry: CalibrationEntry = {
          confidence: pendingConfidence,
          correct: grade >= 3,
          timestamp: new Date().toISOString(),
        };
        state.stats.calibrationLog = [...(state.stats.calibrationLog ?? []), entry];
        setPendingConfidence(null);
      }

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
      triggerAchievements(newState, { ratedGoodAfterDays });
      saveState(newState);
      setState(newState);
      setSessionXp((prev) => prev + earned);

      if (isLessonMode) {
        setLessonTotalCount((prev) => prev + 1);
        if (grade >= 3) {
          setLessonCorrectCount((prev) => prev + 1);
        }
      }

      const newQ = [...queue];
      if (grade < 3 && !isLessonMode) {
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
    [queue, currentIndex, state, isLessonMode, comboCount, bestCombo, pendingConfidence, cards]
  );

  const answerCard = useCallback(
    (correct: boolean) => {
      if (!state) return;
      const card = queue[currentIndex];
      const grade = correct ? 4 : 1;
      const oldCardState = state.cards[card.id];
      const updated = reviewCard(oldCardState, grade);

      if (!correct) {
        updated.lapses = oldCardState.lapses + 1;
        if (updated.lapses >= LEECH_THRESHOLD) updated.leech = true;
      }

      if (correct) {
        const newCombo = comboCount + 1;
        setComboCount(newCombo);
        if (newCombo > bestCombo) setBestCombo(newCombo);
      } else {
        setComboCount(0);
      }

      // Confidence calibration
      if (pendingConfidence) {
        const entry: CalibrationEntry = {
          confidence: pendingConfidence,
          correct,
          timestamp: new Date().toISOString(),
        };
        state.stats.calibrationLog = [...(state.stats.calibrationLog ?? []), entry];
        setPendingConfidence(null);
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
      triggerAchievements(newState, {});
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
    [queue, currentIndex, state, comboCount, bestCombo, pendingConfidence]
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

    triggerAchievements(newState, {
      lessonJustCompleted: true,
      lessonCorrect: lessonCorrectCount,
      lessonTotal: lessonTotalCount,
    });

    saveState(newState);
    setState(newState);

    setView("path");
    setCurrentLesson(null);
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [state, currentLesson, lessonCorrectCount, lessonTotalCount, cards]);

  const backToDashboard = useCallback(() => {
    setView("dashboard");
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsLessonMode(false);
    setCurrentLesson(null);
    setCurrentSection(null);
    setPendingConfidence(null);
  }, []);

  const backToPath = useCallback(() => {
    setView("path");
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCurrentLesson(null);
  }, []);

  const backToPaths = useCallback(() => {
    setView("paths");
    setQueue([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCurrentLesson(null);
    setCurrentSection(null);
  }, []);

  // --- Study modes ---

  const getDifficultCards = useCallback(() => {
    if (!state) return [];
    return cards.filter((card) => {
      const s = state.cards[card.id];
      if (!s) return false;
      return (
        s.difficulty > DIFFICULT_DIFFICULTY_THRESHOLD ||
        s.lapses >= DIFFICULT_LAPSE_THRESHOLD ||
        s.leech
      );
    });
  }, [cards, state]);

  const startDifficultReview = useCallback(() => {
    if (!state) return;
    const difficult = getDifficultCards();
    if (difficult.length === 0) return;
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
    const shuffled = [...due];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQueue(shuffled.slice(0, 20));
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
    const reviewed = Object.values(state.cards).filter((s) => s.reps > 0);
    if (reviewed.length === 0) return 0;
    const good = reviewed.filter((s) => s.difficulty <= 6);
    return Math.round((good.length / reviewed.length) * 100);
  }, [state]);

  const getHardestCards = useCallback(() => {
    if (!state) return [];
    return cards
      .filter((c) => state.cards[c.id]?.reps > 0)
      .sort((a, b) => state.cards[b.id].difficulty - state.cards[a.id].difficulty)
      .slice(0, 5);
  }, [cards, state]);

  const getCardStateCounts = useCallback(() => {
    if (!state) return { newCount: 0, learning: 0, mature: 0 };
    let newCount = 0, learning = 0, mature = 0;
    for (const s of Object.values(state.cards)) {
      if (s.cardState === "new") newCount++;
      else if (s.cardState === "learning" || s.cardState === "relearning") learning++;
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
    triggerAchievements(newState, { matchTime: time });
    saveState(newState);
    setState(newState);
  }, [state, cards]);

  // FSRS scheduling intervals for current card
  const schedulingIntervals = useMemo(() => {
    if (!state || !queue[currentIndex]) return null;
    const cardState = state.cards[queue[currentIndex].id];
    if (!cardState) return null;
    return getSchedulingIntervals(cardState);
  }, [state, queue, currentIndex]);

  const setConfidence = useCallback((c: CalibrationEntry["confidence"]) => {
    setPendingConfidence(c);
  }, []);

  const dismissAchievement = useCallback(() => {
    setPendingAchievement(null);
  }, []);

  const getCalibrationAccuracy = useCallback(() => {
    if (!state) return null;
    const log = state.stats.calibrationLog ?? [];
    if (log.length < 5) return null;
    const byLevel = { low: { total: 0, correct: 0 }, medium: { total: 0, correct: 0 }, high: { total: 0, correct: 0 } };
    for (const entry of log) {
      byLevel[entry.confidence].total++;
      if (entry.correct) byLevel[entry.confidence].correct++;
    }
    return byLevel;
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
        dueCards.filter((c) => (state?.cards[c.id]?.reps ?? 0) > 0).length
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

    // FSRS scheduling
    schedulingIntervals,

    // Achievements
    achievements: state?.stats.achievements ?? [],
    pendingAchievement,
    dismissAchievement,

    // Confidence calibration
    pendingConfidence,
    setConfidence,
    calibrationAccuracy: getCalibrationAccuracy(),

    // Actions
    startStudy,
    flipCard,
    rateCard,
    answerCard,
    backToDashboard,

    // Learning path actions
    viewPath,
    selectPath,
    selectLesson,
    startLesson,
    completeLesson,
    backToPath,
    backToPaths,

    // Study mode actions
    startDifficultReview,
    startSpeedReview,
    startMatchGame,
    startQuizMode,
    viewStats,
    updateMatchBestTime,
  };
}
