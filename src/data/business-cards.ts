import type { Card } from "../types";

// === Business Fundamentals Learning Path ===
// Sources: Chris Voss (Never Split the Difference), Seth Godin (Purple Cow)
// IDs start at 3000 to avoid conflicts with conjugation cards (2000+)

export const BUSINESS_CARDS: Card[] = [
  // ================================================================
  // LESSON: Tactical Empathy (biz-tactical-empathy)
  // ================================================================

  // Step 1: Concept — "Empathy is not agreement"
  {
    id: 3000,
    category: "Business — Negotiation",
    front: "What is tactical empathy and how does it differ from sympathy or agreement?",
    back: "Tactical empathy means understanding someone's feelings and worldview in the moment to increase your influence. It's not sympathy (feeling *for* them) or agreement (conceding their point). It's intelligence gathering through emotional attention.\n\n**Source**: Chris Voss, *Never Split the Difference*",
    keyPoints: [
      "Empathy ≠ agreement — you can understand without conceding",
      "Empathy ≠ sympathy — sympathy creates emotional fusion, empathy maintains separation",
      "Purpose: intelligence gathering through emotional attention",
    ],
    exerciseType: "flashcard",
  },

  // Step 2: MCQ — Supplier scenario
  {
    id: 3001,
    category: "Business — Negotiation",
    front: "Your supplier says 'This price increase is non-negotiable.' What's the tactical empathy response?",
    back: "Labeling their emotion ('It seems like...') validates their position without conceding. It opens them up to explain *why*, which reveals leverage points. Asking for a cost breakdown is a good follow-up, but empathy comes first.",
    keyPoints: [
      "Label before you probe — empathy opens the door to information",
      "'It seems like...' is non-threatening and invites elaboration",
      "Understanding their pressure gives you leverage without confrontation",
    ],
    exerciseType: "mcq",
    choices: [
      "I understand, let's move on to other terms.",
      "It seems like you're under pressure from your costs going up.",
      "That's not fair — we've been loyal customers for years.",
      "Can you break down the cost increase for me?",
    ],
    correctAnswer: 1,
  },

  // Step 3: Fill-blank
  {
    id: 3002,
    category: "Business — Negotiation",
    front: "Tactical empathy = understanding _____ + hearing what's behind those feelings → increase your _____",
    back: "Voss's formula: surface emotions → underlying needs → leverage. The sequence matters — you can't influence without first demonstrating understanding.",
    keyPoints: [
      "Step 1: Identify the feeling",
      "Step 2: Understand the motivation behind it",
      "Step 3: Use that understanding to increase influence",
    ],
    exerciseType: "fill-blank",
    correctAnswer: "feelings",
  },

  // Step 4: MCQ — empathy vs sympathy
  {
    id: 3003,
    category: "Business — Negotiation",
    front: "What's the difference between tactical empathy and sympathy?",
    back: "Sympathy creates emotional fusion ('I feel your pain'). Tactical empathy maintains separation — you understand their world without inhabiting it. This separation is what preserves your negotiating position.",
    keyPoints: [
      "Sympathy = feeling FOR them (emotional fusion)",
      "Empathy = understanding THEIR perspective (maintains separation)",
      "Separation preserves your negotiating position",
    ],
    exerciseType: "mcq",
    choices: [
      "Tactical empathy is fake, sympathy is real",
      "Sympathy means you feel FOR them, empathy means you understand THEIR perspective",
      "There is no difference — both build rapport",
      "Empathy is emotional, sympathy is rational",
    ],
    correctAnswer: 1,
  },

  // Step 5: Reflection
  {
    id: 3004,
    category: "Business — Negotiation",
    front: "Think of a recent disagreement at work or in life. What was the other person's underlying feeling behind their position? How would labeling that feeling ('It seems like...') have changed the conversation?",
    back: "The goal of this reflection is to practice identifying emotions behind positions. Most disagreements have a hidden feeling driving the stated position — fear, frustration, pride, or uncertainty. Labeling it creates a moment of connection that opens the door to resolution.",
    keyPoints: [
      "Positions mask feelings — identify the feeling first",
      "Labeling creates connection without conceding",
      "Practice: replay past conversations with empathy lens",
    ],
    exerciseType: "flashcard",
  },

  // --- Tactical Empathy REVIEW CARDS ---

  {
    id: 3010,
    category: "Business — Negotiation",
    front: "What is tactical empathy?",
    back: "Understanding someone's feelings and worldview in the moment to increase your influence — without agreeing with them. (Chris Voss)",
    keyPoints: [
      "Not sympathy — intelligence gathering through emotional attention",
      "Preserves negotiating position while building rapport",
      "Foundation for all other Voss techniques",
    ],
    exerciseType: "flashcard",
  },
  {
    id: 3011,
    category: "Business — Negotiation",
    front: "What phrase pattern does Voss use for labeling emotions?",
    back: "'It seems like...', 'It sounds like...', 'It looks like...' — never starting with 'I', which puts the other person's guard up.",
    keyPoints: [
      "Avoid 'I' statements — they shift focus to you",
      "Downward inflection (statement, not question)",
      "Follow with silence — let the label land",
    ],
    exerciseType: "flashcard",
  },
  {
    id: 3012,
    category: "Business — Negotiation",
    front: "Your counterpart says 'That's a fair price.' What technique do you use?",
    back: "Fair Statement Defense: Mirror the word ('Fair?') then label ('It seems like you want to walk me through your calculations...'). This forces them to justify rather than assert. (Voss)",
    keyPoints: [
      "Mirror 'fair' to pause and redirect",
      "Label to invite justification",
      "Forces them to back up the claim with evidence",
    ],
    exerciseType: "flashcard",
  },

  // ================================================================
  // LESSON: The Ackerman Model (biz-ackerman)
  // ================================================================

  // Step 1: Concept
  {
    id: 3020,
    category: "Business — Negotiation",
    front: "What is the Ackerman Model for structured negotiation?",
    back: "A structured approach to making offers:\n\n1. Set your target price\n2. Open at **65%** of target (extreme anchor)\n3. Calculate three raises: **85%, 95%, 100%** of target\n4. Use decreasing increments (shows you're reaching your limit)\n5. Use **odd, precise numbers** (e.g., $37,893 not $38,000)\n6. On your final number, throw in a **non-monetary item** to signal you're at your limit\n\n**Why odd numbers?** They signal careful calculation. $37,893 implies precise analysis. $38,000 implies guessing.",
    keyPoints: [
      "65% → 85% → 95% → 100% with decreasing increments",
      "Odd, precise numbers signal calculation, not guessing",
      "Non-monetary item on final offer signals absolute limit",
    ],
    exerciseType: "flashcard",
  },

  // Step 2: Calculation
  {
    id: 3021,
    category: "Business — Negotiation",
    front: "Your target salary is $120,000. What should your opening offer be using the Ackerman model?",
    back: "Opening anchor = 65% of target = 0.65 × $120,000 = $78,000. This feels extreme, but the Ackerman model relies on the anchor dragging the negotiation toward your actual target through calibrated concessions.",
    keyPoints: [
      "65% anchor feels uncomfortable — that's by design",
      "Extreme anchors shift the entire negotiation range",
      "Follow-up raises: $102k → $114k → $120k + non-monetary item",
    ],
    exerciseType: "math",
    mathAnswer: 78000,
    tolerance: 1000,
    unit: "$",
  },

  // Step 3: Ordering → converted to MCQ
  {
    id: 3022,
    category: "Business — Negotiation",
    front: "What is the correct order of the Ackerman concession steps?",
    back: "The decreasing increments (20% → 10% → 5%) signal diminishing capacity. Each concession 'costs' you visibly more, making the counterpart feel they're squeezing your limit.",
    keyPoints: [
      "Decreasing increments signal you're reaching your limit",
      "Each step feels harder — builds perceived scarcity",
      "Final non-monetary item = 'I literally have nothing left'",
    ],
    exerciseType: "mcq",
    choices: [
      "Open 65% → Raise 85% → Raise 95% → Raise 100% + non-monetary",
      "Open 50% → Raise 75% → Raise 90% → Raise 100%",
      "Open 80% → Raise 90% → Raise 95% → Raise 100% + non-monetary",
      "Open 65% → Raise 80% → Raise 100% + non-monetary",
    ],
    correctAnswer: 0,
  },

  // Step 4: MCQ — non-monetary item
  {
    id: 3023,
    category: "Business — Negotiation",
    front: "Why should you include a non-monetary item with your final Ackerman offer?",
    back: "The non-monetary item does triple duty: it's cheap for you but valuable to them, it signals 'I have no more money to give', and it triggers reciprocal generosity. Voss: 'throw in something unrelated to the price.'",
    keyPoints: [
      "Signals you've exhausted your monetary capacity",
      "Cheap for you, perceived as valuable by them",
      "Triggers reciprocity — they feel they should give back",
    ],
    exerciseType: "mcq",
    choices: [
      "It adds value for the other side at no cost to you",
      "It signals you've reached your absolute limit",
      "It creates reciprocity pressure",
      "All of the above",
    ],
    correctAnswer: 3,
  },

  // Step 5: Reflection
  {
    id: 3024,
    category: "Business — Negotiation",
    front: "Think of an upcoming negotiation (salary, vendor, lease, etc.). What's your target number? What would your 65% anchor be? Does it feel uncomfortably low? That's the point.",
    back: "The discomfort of the 65% anchor is a feature, not a bug. Research shows extreme anchors are more effective than moderate ones because they shift the entire negotiation range. Your counterpart adjusts *from* your anchor, not from the midpoint.",
    keyPoints: [
      "If the anchor doesn't feel uncomfortable, it's not extreme enough",
      "Extreme anchors shift the negotiation range in your favor",
      "Preparation: calculate all 4 numbers before you walk in",
    ],
    exerciseType: "flashcard",
  },

  // --- Ackerman REVIEW CARDS ---

  {
    id: 3030,
    category: "Business — Negotiation",
    front: "What are the Ackerman Model percentages?",
    back: "Open at 65% of target → raise to 85% → 95% → 100% (with non-monetary item). Decreasing increments signal you're reaching your limit. Always use odd, precise numbers.",
    keyPoints: [
      "65/85/95/100 — memorize this sequence",
      "Odd numbers signal precision and calculation",
      "Non-monetary item on final offer signals absolute limit",
    ],
    exerciseType: "flashcard",
  },
  {
    id: 3031,
    category: "Business — Negotiation",
    front: "Why does Voss insist on odd, precise numbers in negotiation?",
    back: "Precise numbers ($37,893 vs $38,000) signal that you've done careful analysis. Round numbers feel arbitrary and invite counter-offers. Precise numbers feel calculated and harder to argue against.",
    keyPoints: [
      "$37,893 implies spreadsheet analysis",
      "$38,000 implies guessing or rounding",
      "Precision creates psychological anchoring weight",
    ],
    exerciseType: "flashcard",
  },

  // ================================================================
  // LESSON: Be Remarkable (biz-remarkable)
  // ================================================================

  // Step 1: Concept — Purple Cow
  {
    id: 3040,
    category: "Business — Marketing",
    front: "What is Seth Godin's Purple Cow concept?",
    back: "If you drove past a field of cows, you wouldn't notice them. But a **purple cow** — that you'd stop for.\n\nSeth Godin's argument: in a world of infinite choices and zero attention, being safe is the riskiest strategy. The only marketing that works is building something **worth remarking about**.\n\n'Remarkable' literally means 'worth making a remark about.' If your customers don't talk about you, you're invisible.\n\n**Source**: Seth Godin, *Purple Cow*",
    keyPoints: [
      "Safe = invisible in a crowded market",
      "Remarkable = literally 'worth making a remark about'",
      "If customers don't talk about you, you don't exist",
    ],
    exerciseType: "flashcard",
  },

  // Step 2: MCQ — riskiest strategy
  {
    id: 3041,
    category: "Business — Marketing",
    front: "According to Godin, what's the riskiest strategy in a crowded market?",
    back: "Godin: 'In a crowded marketplace, fitting in is failing. In a busy marketplace, not standing out is the same as being invisible.' Safe products don't spread — they die quietly.",
    keyPoints: [
      "Fitting in = failing in a crowded market",
      "Safe products are invisible, not protected",
      "Risk of standing out < risk of being ignored",
    ],
    exerciseType: "mcq",
    choices: [
      "Being first to market",
      "Being the cheapest option",
      "Being safe and conventional",
      "Targeting a niche audience",
    ],
    correctAnswer: 2,
  },

  // Step 3: Fill-blank — sneezers
  {
    id: 3042,
    category: "Business — Marketing",
    front: "The goal is not to market TO _____ but to market FOR the _____ who will spread your idea",
    back: "Sneezers are the early adopters who spread ideas. Your job is to make something so remarkable that sneezers can't help but tell people about it. Target the edges, not the middle.",
    keyPoints: [
      "Everyone = mass market (ineffective in crowded markets)",
      "Sneezers = Godin's term for word-of-mouth spreaders",
      "Target the edges (early adopters), not the middle (mass market)",
    ],
    exerciseType: "fill-blank",
    correctAnswer: "everyone",
  },

  // Step 4: Reflection
  {
    id: 3043,
    category: "Business — Marketing",
    front: "What's the 'purple cow' in your business or project? If you don't have one, what would you need to change to make someone remark about it to a friend?",
    back: "The test: would someone voluntarily tell a friend about your product? If not, you have a marketing problem that no amount of advertising can fix. The product itself must be the marketing.",
    keyPoints: [
      "The product IS the marketing",
      "Test: would someone tell a friend unprompted?",
      "No amount of ads fixes an unremarkable product",
    ],
    exerciseType: "flashcard",
  },

  // --- Be Remarkable REVIEW CARDS ---

  {
    id: 3050,
    category: "Business — Marketing",
    front: "What is the 'Purple Cow' concept?",
    back: "In a world of infinite choices and zero attention, being safe is the riskiest strategy. Build something worth remarking about — 'remarkable' literally means 'worth making a remark about.' Target the sneezers (early adopters who spread ideas), not the mass market. (Seth Godin)",
    keyPoints: [
      "Safe = invisible in a world of infinite choice",
      "Target sneezers, not everyone",
      "Remarkable = worth remarking about (literally)",
    ],
    exerciseType: "flashcard",
  },
  {
    id: 3051,
    category: "Business — Marketing",
    front: "What are 'sneezers' in Godin's framework?",
    back: "Early adopters who spread ideas to their networks. Your product doesn't need to appeal to everyone — it needs to be so remarkable that sneezers can't help telling people about it.",
    keyPoints: [
      "Word-of-mouth spreaders — the engine of idea propagation",
      "Target the edges, not the middle of the market",
      "Ideas spread through sneezers, not through mass advertising",
    ],
    exerciseType: "flashcard",
  },
];
