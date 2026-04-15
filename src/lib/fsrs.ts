import { fsrs, createEmptyCard, Rating, State, type Card as FSRSCard } from "ts-fsrs";
import type { CardState } from "../types";

const f = fsrs({ request_retention: 0.9, maximum_interval: 36500 });

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function yesterday(): string {
  return addDays(today(), -1);
}

// Grade mapping: UI grades (0,1,2,4,5) → FSRS ratings (1,2,3,4)
const GRADE_TO_RATING: Record<number, Rating> = {
  0: Rating.Again,
  1: Rating.Again,
  2: Rating.Hard,
  3: Rating.Good,
  4: Rating.Good,
  5: Rating.Easy,
};

const STATE_TO_STRING: Record<number, CardState["cardState"]> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};

const STRING_TO_STATE: Record<string, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
};

function toFSRSCard(s: CardState): FSRSCard {
  const card = createEmptyCard(new Date(s.nextReviewDate + "T00:00:00"));
  card.stability = s.stability;
  card.difficulty = s.difficulty;
  card.scheduled_days = s.scheduledDays;
  card.reps = s.reps;
  card.lapses = s.lapses;
  card.state = STRING_TO_STATE[s.cardState] ?? State.New;
  if (s.lastReview) {
    (card as FSRSCard & { last_review: Date }).last_review = new Date(s.lastReview + "T00:00:00");
  }
  return card;
}

function fromFSRSCard(c: FSRSCard, leech: boolean): CardState {
  const lastReview = (c as FSRSCard & { last_review?: Date }).last_review;
  return {
    stability: c.stability,
    difficulty: c.difficulty,
    scheduledDays: c.scheduled_days,
    reps: c.reps,
    lapses: c.lapses,
    cardState: STATE_TO_STRING[c.state] ?? "new",
    lastReview: lastReview ? lastReview.toISOString().slice(0, 10) : null,
    nextReviewDate: c.due.toISOString().slice(0, 10),
    leech,
  };
}

export function newCardState(): CardState {
  return {
    stability: 0,
    difficulty: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    cardState: "new",
    lastReview: null,
    nextReviewDate: today(),
    leech: false,
  };
}

export function reviewCard(state: CardState, grade: number): CardState {
  const rating = GRADE_TO_RATING[grade] ?? Rating.Good;
  const fsrsCard = toFSRSCard(state);
  const now = new Date();
  const scheduling = f.repeat(fsrsCard, now);
  const result = (scheduling as unknown as Record<number, { card: FSRSCard }>)[rating];
  return fromFSRSCard(result.card, state.leech);
}

function formatInterval(days: number): string {
  if (days < 1) return "<1d";
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

export function getSchedulingIntervals(
  state: CardState
): Record<number, string> {
  const fsrsCard = toFSRSCard(state);
  const now = new Date();
  const scheduling = f.repeat(fsrsCard, now);

  const s = scheduling as unknown as Record<number, { card: FSRSCard }>;
  return {
    0: formatInterval(s[Rating.Again].card.scheduled_days),
    2: formatInterval(s[Rating.Hard].card.scheduled_days),
    4: formatInterval(s[Rating.Good].card.scheduled_days),
    5: formatInterval(s[Rating.Easy].card.scheduled_days),
  };
}

// Migrate legacy SM-2 state to FSRS
export function migrateSM2(old: Record<string, unknown>): CardState {
  if ("stability" in old && "cardState" in old) return old as unknown as CardState;

  const ef = (old.easeFactor as number) ?? 2.5;
  const interval = (old.interval as number) ?? 0;
  const reps = (old.repetitions as number) ?? 0;
  const lapses = (old.lapses as number) ?? 0;
  const leech = (old.leech as boolean) ?? false;
  const nextReviewDate = (old.nextReviewDate as string) ?? today();

  // Map ease factor (1.3–2.5+) to FSRS difficulty (1–10, higher = harder)
  const difficulty = Math.max(
    1,
    Math.min(10, ((2.5 - ef) / 1.2) * 9 + 1)
  );

  return {
    stability: interval > 0 ? interval : 0,
    difficulty,
    scheduledDays: interval,
    reps,
    lapses,
    cardState:
      reps === 0 ? "new" : interval >= 21 ? "review" : "learning",
    lastReview:
      reps > 0 && interval > 0
        ? addDays(nextReviewDate, -interval)
        : null,
    nextReviewDate,
    leech,
  };
}
