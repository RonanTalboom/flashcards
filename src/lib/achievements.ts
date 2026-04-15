import type { Achievement, AppState, Card } from "../types";

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, "unlockedAt">[] = [
  { id: "first-steps", title: "First Steps", description: "Complete your first lesson", icon: "\u{1F476}" },
  { id: "path-finder", title: "Path Finder", description: "Complete an entire learning path section", icon: "\u{1F9ED}" },
  { id: "week-warrior", title: "Week Warrior", description: "Reach a 7-day streak", icon: "\u{1F525}" },
  { id: "century", title: "Century", description: "Complete 100 total reviews", icon: "\u{1F4AF}" },
  { id: "perfect-lesson", title: "Perfect Lesson", description: "Get all answers correct in a lesson", icon: "\u{2B50}" },
  { id: "speed-demon", title: "Speed Demon", description: "Complete a match game in under 60 seconds", icon: "\u{26A1}" },
  { id: "deep-recall", title: "Deep Recall", description: "Rate a card Good after 30+ day interval", icon: "\u{1F9E0}" },
  { id: "scholar", title: "Scholar", description: "Complete 10 lessons", icon: "\u{1F393}" },
  { id: "marathon", title: "Marathon", description: "Reach a 30-day streak", icon: "\u{1F3C3}" },
  { id: "polyglot", title: "Polyglot", description: "Review 50 French vocabulary cards", icon: "\u{1F1EB}\u{1F1F7}" },
];

export function checkAchievements(
  state: AppState,
  context: {
    lessonJustCompleted?: boolean;
    lessonCorrect?: number;
    lessonTotal?: number;
    matchTime?: number;
    ratedGoodAfterDays?: number;
    cards?: Card[];
  }
): string[] {
  const newUnlocks: string[] = [];
  const achievements = [...state.stats.achievements];

  function tryUnlock(id: string): boolean {
    const a = achievements.find((x) => x.id === id);
    if (!a || a.unlockedAt) return false;
    a.unlockedAt = new Date().toISOString();
    newUnlocks.push(id);
    return true;
  }

  // First Steps: complete a lesson
  if (context.lessonJustCompleted) {
    const completedCount = Object.values(state.lessonProgress).filter((p) => p.completed).length;
    if (completedCount >= 1) tryUnlock("first-steps");
    if (completedCount >= 10) tryUnlock("scholar");
  }

  // Perfect Lesson
  if (
    context.lessonJustCompleted &&
    context.lessonCorrect !== undefined &&
    context.lessonTotal !== undefined &&
    context.lessonTotal > 0 &&
    context.lessonCorrect === context.lessonTotal
  ) {
    tryUnlock("perfect-lesson");
  }

  // Week Warrior & Marathon
  if (state.stats.streak >= 7) tryUnlock("week-warrior");
  if (state.stats.streak >= 30) tryUnlock("marathon");

  // Century
  if (state.stats.totalReviews >= 100) tryUnlock("century");

  // Speed Demon
  if (context.matchTime !== undefined && context.matchTime < 60) {
    tryUnlock("speed-demon");
  }

  // Deep Recall
  if (
    context.ratedGoodAfterDays !== undefined &&
    context.ratedGoodAfterDays >= 30
  ) {
    tryUnlock("deep-recall");
  }

  // Path Finder: check if enough lessons completed
  const completedLessonCount = Object.values(state.lessonProgress).filter(
    (p) => p.completed
  ).length;
  if (completedLessonCount >= 5) tryUnlock("path-finder");

  // Polyglot: 50 French vocab reviewed
  if (context.cards) {
    const frenchReviewed = context.cards.filter(
      (c) =>
        c.deck === "french-a1" &&
        state.cards[c.id]?.reps > 0
    ).length;
    if (frenchReviewed >= 50) tryUnlock("polyglot");
  }

  // Update achievements in state
  state.stats.achievements = achievements;

  return newUnlocks;
}
