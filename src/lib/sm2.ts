import type { CardState } from "../types";

export function sm2(card: CardState, grade: number): CardState {
  let { easeFactor, interval, repetitions } = card;

  if (grade >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  );

  const nextReviewDate = addDays(today(), interval);

  return { easeFactor, interval, repetitions, nextReviewDate, lapses: card.lapses ?? 0, leech: card.leech ?? false };
}

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
