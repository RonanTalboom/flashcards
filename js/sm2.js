// SM-2 Spaced Repetition Algorithm
// Based on: https://en.wikipedia.org/wiki/SuperMemo#Algorithm_SM-2

export function sm2(card, grade) {
  let { easeFactor, interval, repetitions } = card;

  if (grade >= 3) {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    // Failed recall — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  );

  const nextReviewDate = addDays(today(), interval);

  return { easeFactor, interval, repetitions, nextReviewDate };
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function yesterday() {
  return addDays(today(), -1);
}
