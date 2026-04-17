import type { Card } from "../types";

/**
 * Demonstrates the guided-discovery lesson pattern:
 * pretest → concept → practice → reflection → synthesis.
 *
 * This lesson teaches the "Active Recall" technique using the same technique it teaches.
 */
export const THEORY_DEMO_CARDS: Card[] = [
  // --- 1. PRETEST: what do you think? ---
  {
    id: 7000,
    category: "Learning Science",
    exerciseType: "pretest",
    front: "You have 60 minutes to study for a test. Which is best?",
    choices: [
      "Re-read your notes 4 times",
      "Re-read once, then test yourself 3 times",
      "Highlight the most important passages",
      "Watch a summary video",
    ],
    correctAnswer: 1,
    choiceExplanations: [
      "Re-reading feels productive but creates only surface familiarity — fluency, not memory.",
      "Correct. Testing yourself is retrieval practice — the single most-studied high-utility technique.",
      "Highlighting rarely helps because the hard work happens at the act of recall, not marking.",
      "Passive video is closer to re-reading than to retrieval — recognition ≠ recall.",
    ],
    back: "Let's find out why testing beats re-reading — even though it feels worse.",
    keyPoints: [],
  },

  // --- 2. CONCEPT: reveal the idea in 2 sentences ---
  {
    id: 7001,
    category: "Learning Science",
    exerciseType: "concept",
    front: "Active recall",
    back:
      "**Active recall** is the act of producing an answer from memory, without looking. The *effort* of retrieval is what strengthens the memory — re-reading skips that effort and leaves the memory weak.",
    keyPoints: [
      "Retrieval, not exposure, is what builds memory",
      "Effort feels unpleasant but is the signal of learning",
      "Meta-analysis: d = 0.56 (high utility) — Dunlosky 2013",
    ],
  },

  // --- 3. CONCEPT: the counter-intuitive mechanism ---
  {
    id: 7002,
    category: "Learning Science",
    exerciseType: "concept",
    front: "Why does fluency lie?",
    back:
      "When re-reading, the words feel familiar — your brain mistakes *recognition* for *knowing*. This is the **illusion of competence**: the more fluent the text feels, the more confident you are, and the less your memory has actually formed.",
    keyPoints: [
      "Fluency = ease of processing, not strength of memory",
      "Confidence and retention often run in opposite directions",
      "Testing exposes what you don't know; re-reading hides it",
    ],
  },

  // --- 4. PRACTICE: apply the idea to a new scenario ---
  {
    id: 7003,
    category: "Learning Science",
    exerciseType: "mcq",
    front:
      "Your friend closes the book and tries to summarise the chapter from memory, getting several things wrong. Is this helping?",
    choices: [
      "No — the mistakes reinforce wrong information",
      "Yes — retrieval attempts build memory even when incomplete, provided errors are corrected",
      "Only if they can summarise perfectly",
      "Only for simple facts, not complex ideas",
    ],
    correctAnswer: 1,
    back:
      "Failed retrievals are still productive, as long as feedback follows. Each retrieval attempt, successful or not, strengthens the retrieval pathway — the key is the corrective feedback immediately after.",
    keyPoints: [
      "Partial retrievals still build the memory trace",
      "Feedback is the critical ingredient, not success",
      "\"Productive failure\" > passive re-reading",
    ],
  },

  // --- 5. REFLECTION (with model answer = Apply) ---
  {
    id: 7004,
    category: "Learning Science",
    exerciseType: "reflection",
    front:
      "Think of something you've been trying to learn recently — a book, a skill, a topic at work. What's one change you could make this week to swap re-reading for active recall?",
    minLength: 40,
    modelAnswer:
      "A concrete swap: instead of re-reading chapter notes, close the book and write a 3-bullet summary from memory. Then compare to the notes and fix gaps. The gap between what you remembered and what you missed *is* the signal your brain needs.\n\nThe key is making the retrieval **cheap and frequent** — a 2-minute recall beats a 20-minute re-read.",
    back: "",
    keyPoints: [
      "Make retrieval cheap: short attempts, many times",
      "Always finish with feedback (compare to source)",
      "The gap is the signal — not the summary",
    ],
  },

  // --- 6. SYNTHESIS: user assembles the framework ---
  {
    id: 7005,
    category: "Learning Science",
    exerciseType: "ordering",
    synthesis: true,
    front:
      "Put these four steps in the right order to get the most out of active recall:",
    choices: [
      "Read the material once",
      "Close the source and retrieve from memory",
      "Compare your recall against the source",
      "Repeat after a short delay",
    ],
    back:
      "The loop is: expose → retrieve → correct → repeat. Skipping any step leaks value: no exposure = nothing to retrieve; no retrieval = fluency illusion; no correction = reinforces errors; no repetition = no spacing.",
    keyPoints: [
      "Expose (read once, briefly)",
      "Retrieve (close and recall)",
      "Correct (compare, patch gaps)",
      "Repeat (space it out)",
    ],
  },
];
