import type { Card } from "../types";

// === Kahneman: Thinking Fast & Slow + Noise ===
// Sources: Kahneman (2011), Kahneman/Sibony/Sunstein (2021), Kahneman & Tversky (1979)
// IDs start at 5000 to avoid conflicts

export const KAHNEMAN_CARDS: Card[] = [
  // ================================================================
  // LESSON 1: System 1 & System 2
  // ================================================================

  // Core distinction
  {
    id: 5000,
    category: "Kahneman",
    front: "What are System 1 and System 2 in Kahneman's framework?",
    back: "System 1 is fast, automatic, and intuitive. System 2 is slow, deliberate, and analytical. Most cognitive biases arise from System 1's shortcuts that System 2 fails to override.",
    keyPoints: [
      "System 1: effortless, always running — pattern matching, first impressions, gut feelings",
      "System 2: effortful, lazily activated — complex math, careful analysis, self-control",
      "Biases happen when System 1 gives a quick answer and System 2 doesn't bother checking",
      "Source: Kahneman, Thinking, Fast and Slow (2011)",
    ],
    exerciseType: "mcq",
    choices: [
      "System 1 is logical and System 2 is emotional",
      "System 1 is fast and automatic; System 2 is slow and deliberate",
      "System 1 handles complex tasks; System 2 handles simple ones",
      "System 1 and System 2 are different brain regions",
    ],
    correctAnswer: 1,
  },

  // System 1 examples
  {
    id: 5001,
    category: "Kahneman",
    front:
      "Which of these is a System 1 (fast, automatic) process?",
    back: "Reading a facial expression is System 1 — fast, effortless, involuntary. You can't choose NOT to read someone's face. Calculating 17 × 24 requires System 2.",
    keyPoints: [
      "System 1: face reading, driving on empty road, detecting hostility in a voice, 2+2",
      "System 2: parking in a tight space, filing taxes, 17×24, comparing two washing machines",
      "The key distinction is effort and automaticity, not intelligence",
    ],
    exerciseType: "mcq",
    choices: [
      "Calculating 17 × 24",
      "Reading a facial expression",
      "Comparing two insurance policies",
      "Filling out a tax return",
    ],
    correctAnswer: 1,
  },

  // ================================================================
  // LESSON 2: Heuristics & Biases
  // ================================================================

  // Anchoring
  {
    id: 5002,
    category: "Kahneman",
    front:
      "What is the anchoring effect, and why is it dangerous?",
    back: "The first number you hear pulls all subsequent estimates toward it — even when the anchor is obviously irrelevant. Judges shown a random number gave different sentences. The effect has replicated robustly and is even stronger than originally estimated.",
    keyPoints: [
      "Example: 'Is the population of Turkey more or less than 5 million?' → estimates pulled toward 5M",
      "Works even with obviously arbitrary anchors (spinning a wheel to generate the number)",
      "Replicated: one of Kahneman's strongest findings — effect size is LARGER than originally reported",
      "Defense: generate your own estimate BEFORE hearing anyone else's",
    ],
    exerciseType: "mcq",
    choices: [
      "People give more weight to recent events than older ones",
      "The first number heard pulls subsequent estimates toward it, even when irrelevant",
      "People prefer information that confirms their existing beliefs",
      "People overestimate the probability of dramatic events",
    ],
    correctAnswer: 1,
  },

  // Availability heuristic
  {
    id: 5003,
    category: "Kahneman",
    front:
      "What is the availability heuristic?",
    back: "We judge how frequent or likely something is by how easily examples come to mind. Vivid, recent, or emotional events feel more probable than they are. This is why people fear plane crashes (dramatic, memorable) more than car accidents (common but mundane).",
    keyPoints: [
      "System 1 substitutes 'how easily can I think of an example?' for 'how frequent is this?'",
      "Media amplifies this: covered events feel more common than uncovered ones",
      "Example: after a shark attack is on the news, people overestimate shark attack risk",
      "Defense: ask 'am I thinking of this because it's common, or because it's vivid?'",
    ],
    exerciseType: "mcq",
    choices: [
      "We judge probability by similarity to a stereotype",
      "We judge frequency by how easily examples come to mind",
      "We anchor on the first piece of information received",
      "We prefer avoiding losses to acquiring gains",
    ],
    correctAnswer: 1,
  },

  // Representativeness — Linda problem
  {
    id: 5004,
    category: "Kahneman",
    front:
      "The 'Linda problem': Linda is 31, outspoken, a philosophy major concerned with social justice. Which is more probable — that Linda is (A) a bank teller, or (B) a bank teller who is active in the feminist movement?",
    back: "Answer: A is always more probable. 'Bank teller AND feminist' is a subset of 'bank teller,' so it can't be more likely. But ~85% of people choose B because it 'fits' the description better. This is the conjunction fallacy — driven by the representativeness heuristic.",
    keyPoints: [
      "Representativeness: judging probability by similarity to a stereotype, ignoring base rates",
      "Conjunction fallacy: P(A and B) can never exceed P(A), but vivid descriptions override logic",
      "This is System 1: the description 'feels right' for a feminist bank teller",
      "Defense: always check — am I judging probability or similarity?",
    ],
    exerciseType: "mcq",
    choices: [
      "B — bank teller active in feminist movement (fits the description better)",
      "A — bank teller (a broader category is always at least as probable as a subset)",
      "Both are equally probable",
      "Neither can be determined from the information given",
    ],
    correctAnswer: 1,
  },

  // ================================================================
  // LESSON 3: Prospect Theory & Loss Aversion
  // ================================================================

  // Loss aversion ratio
  {
    id: 5005,
    category: "Kahneman",
    front:
      "According to prospect theory, roughly how much stronger is the pain of losing compared to the pleasure of an equivalent gain?",
    back: "About 2x. Losing $100 hurts approximately as much as gaining $200 feels good. This 'loss aversion' ratio of roughly 2:1 is one of the most robust findings in behavioral economics (Kahneman & Tversky, 1979).",
    keyPoints: [
      "Losses loom larger than gains — the psychological impact is asymmetric",
      "This explains risk aversion for gains and risk seeking for losses",
      "Won Kahneman the Nobel Prize in Economics (2002)",
      "Robust: replicated across cultures, monetary and non-monetary domains",
    ],
    exerciseType: "mcq",
    choices: [
      "About equal — 1:1",
      "About 2x — losses hurt twice as much",
      "About 5x — losses hurt five times as much",
      "It depends entirely on the individual — no general ratio exists",
    ],
    correctAnswer: 1,
  },

  // Framing effect
  {
    id: 5006,
    category: "Kahneman",
    front:
      "Two groups face the same decision but framed differently. Group A: 'You have $1000. Choose: gain $500 for sure, or 50% chance of gaining $1000.' Group B: 'You have $2000. Choose: lose $500 for sure, or 50% chance of losing $1000.' What happens?",
    back: "Group A (gains frame) mostly takes the sure $500. Group B (loss frame) mostly gambles. The final outcomes are mathematically identical ($1500 sure vs. 50/50 of $1000/$2000), but framing the choice as a loss vs. a gain reverses the preference.",
    keyPoints: [
      "Risk-averse for gains: take the sure thing when you might win",
      "Risk-seeking for losses: gamble when you might lose (hoping to avoid the loss entirely)",
      "Reference dependence: people evaluate outcomes relative to a starting point, not in absolute terms",
      "Implication: how you present a choice changes the decision, even when the math is identical",
    ],
    exerciseType: "mcq",
    choices: [
      "Both groups choose the sure option",
      "Both groups choose to gamble",
      "Group A takes the sure gain; Group B gambles to avoid the sure loss",
      "Group A gambles; Group B takes the sure loss",
    ],
    correctAnswer: 2,
  },

  // ================================================================
  // LESSON 4: Noise vs. Bias
  // ================================================================

  // Core distinction
  {
    id: 5007,
    category: "Kahneman",
    front:
      "What is the difference between bias and noise in judgment?",
    back: "Bias is systematic error in one direction (everyone gets it wrong the same way). Noise is random variability (different people get it wrong in different directions). MSE = Bias² + Noise². Both contribute to total error, but noise is often larger and harder to see.",
    keyPoints: [
      "Bias: all arrows hit left of the bullseye → predictable, directional error",
      "Noise: arrows scattered randomly around the target → unpredictable variability",
      "Organizations focus on bias (is our hiring sexist?) while ignoring noise (do interviewers disagree wildly?)",
      "Source: Kahneman, Sibony, Sunstein — Noise (2021)",
    ],
    exerciseType: "mcq",
    choices: [
      "Bias is random error; noise is systematic error",
      "Bias is systematic error in one direction; noise is random variability across judges",
      "Bias affects groups; noise affects individuals",
      "Bias is conscious; noise is unconscious",
    ],
    correctAnswer: 1,
  },

  // Insurance underwriters example
  {
    id: 5008,
    category: "Kahneman",
    front:
      "In a noise audit of insurance underwriters, how much did premiums vary for the same case — and how much did executives expect?",
    back: "Premiums varied by 55% (median). Executives expected about 10%. The actual noise was 5x greater than anyone in the organization believed. This finding — that organizations dramatically underestimate their own noise — is one of the book's most striking results.",
    keyPoints: [
      "55% variation means two underwriters could price the same risk at $9,500 vs. $16,700",
      "Executives expected ~10% variation — they were off by 5x",
      "Similar results in criminal sentencing, medical diagnosis, asylum decisions",
      "Noise is invisible until you specifically measure it with a noise audit",
    ],
    exerciseType: "mcq",
    choices: [
      "5% variation, executives expected 3%",
      "20% variation, executives expected 15%",
      "55% variation, executives expected about 10%",
      "100% variation, executives expected 50%",
    ],
    correctAnswer: 2,
  },

  // Three types of noise
  {
    id: 5009,
    category: "Kahneman",
    front: "What are the three types of noise identified in Kahneman's Noise?",
    back: "Level noise (some judges are consistently harsh, others lenient), Pattern noise (people respond differently to specific cases), and Occasion noise (the same person decides differently on different days due to mood, fatigue, weather).",
    keyPoints: [
      "Level noise: individual baselines differ (harsh vs. lenient judge)",
      "Pattern noise: people weight case features differently (one judge cares about remorse, another doesn't)",
      "Occasion noise: same person, different day = different decision (mood, fatigue, hunger, weather)",
      "Example of occasion noise: college admissions officers weighed academics more on cloudy days",
    ],
    exerciseType: "mcq",
    choices: [
      "Random noise, systematic noise, measurement noise",
      "Level noise, pattern noise, occasion noise",
      "Input noise, process noise, output noise",
      "Individual noise, group noise, environmental noise",
    ],
    correctAnswer: 1,
  },

  // ================================================================
  // LESSON 5: Decision Hygiene
  // ================================================================

  // Decision hygiene concept
  {
    id: 5010,
    category: "Kahneman",
    front:
      "What is 'decision hygiene' and why is it called that?",
    back: "Decision hygiene is a set of structural interventions that reduce noise in judgments — like hand-washing prevents infections you can't see. You can't identify which specific decisions are noisy, but you know noise exists, so you apply protocols that reduce it across the board.",
    keyPoints: [
      "Analogy: you don't wash hands because you see specific bacteria — you do it because invisible threats exist",
      "Key techniques: noise audits, structured decisions, independent assessment before group discussion",
      "The fix is structural (protocols), not individual (trying harder)",
      "Source: Kahneman, Sibony, Sunstein — Noise (2021)",
    ],
    exerciseType: "flashcard",
  },

  // MAP protocol
  {
    id: 5011,
    category: "Kahneman",
    front:
      "What is the Mediating Assessment Protocol (MAP)?",
    back: "A structured decision-making method: (1) define key dimensions, (2) rate each dimension independently on a predefined scale, (3) delay overall judgment until all dimensions scored, (4) combine scores mechanically, (5) only override with explicit justification.",
    keyPoints: [
      "Step 1: break the decision into independent dimensions",
      "Step 2: score each dimension before forming an overall view — prevents halo effect",
      "Step 3: use a formula to combine scores — consistency beats intuition",
      "Step 4: allow override, but require written justification (raises the bar for ignoring the formula)",
    ],
    exerciseType: "ordering",
    choices: [
      "Define key dimensions of the decision",
      "Rate each dimension independently on a predefined scale",
      "Delay overall judgment until all dimensions are scored",
      "Combine dimension scores using a mechanical rule",
      "Override only with explicit written justification",
    ],
    correctAnswer: "0,1,2,3,4",
  },

  // Algorithms vs. experts
  {
    id: 5012,
    category: "Kahneman",
    front:
      "According to Kahneman, why do simple algorithms often outperform expert judgment?",
    back: "Not because algorithms are smarter — but because they're consistent. A simple linear model applies the same weights every time. Experts are noisy: their judgments shift based on mood, order of cases, fatigue, and recent experience. Consistency beats brilliance.",
    keyPoints: [
      "Meehl (1954) first showed clinical vs. statistical prediction — models won in ~50% of domains",
      "The advantage is noise reduction, not intelligence",
      "Even a model built from the expert's OWN stated weights outperforms the expert",
      "This is not an argument against expertise — it's an argument against unstructured expert judgment",
    ],
    exerciseType: "mcq",
    choices: [
      "Algorithms process more data than humans can",
      "Algorithms are smarter than experts",
      "Algorithms are consistent — they apply the same weights every time, unlike noisy human judgment",
      "Algorithms can detect patterns invisible to humans",
    ],
    correctAnswer: 2,
  },

  // ================================================================
  // LESSON 6: Replication & Intellectual Honesty
  // ================================================================

  // Replication status
  {
    id: 5013,
    category: "Kahneman",
    front:
      "Which findings from Thinking, Fast and Slow have survived the replication crisis, and which have not?",
    back: "Survived: prospect theory, loss aversion, anchoring (stronger than originally thought), framing effects, overconfidence. Failed: priming studies (Ch. 4 'Florida effect'), ego depletion. Mean replicability of cited studies: ~46%.",
    keyPoints: [
      "Kahneman & Tversky's own research: robust — replicated across thousands of studies",
      "Priming research Kahneman cited from others: largely collapsed",
      "Ego depletion (willpower as depletable resource): contested by Hagger et al. (2016)",
      "Kahneman admitted: 'I placed too much faith in underpowered studies' — called it 'simply an error'",
    ],
    exerciseType: "mcq",
    choices: [
      "All findings replicated successfully",
      "All findings failed to replicate",
      "Core heuristics and prospect theory replicated; priming studies largely failed",
      "Only the Noise findings replicated; Thinking Fast and Slow was debunked",
    ],
    correctAnswer: 2,
  },
];
