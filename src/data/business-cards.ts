import type { Card } from "../types";

// === Business Fundamentals Learning Path ===
// Sources: Chris Voss (Never Split the Difference), Seth Godin (Purple Cow)
// IDs start at 3000 to avoid conflicts with conjugation cards (2000+)

export const BUSINESS_CARDS: Card[] = [
  // ================================================================
  // LESSON: Tactical Empathy (biz-tactical-empathy)
  // Guided Discovery: Predict → Reveal → Predict → Reveal → Apply → Synthesize
  // ================================================================

  // PREDICT 1: Supplier scenario
  {
    id: 3000,
    category: "Business — Negotiation",
    front: "Your supplier says 'This price increase is non-negotiable.' What would you say?",
    back: "Most people either give in (A) or fight (C). The best negotiators do something counterintuitive — they acknowledge the other side's pressure first.",
    keyPoints: [],
    exerciseType: "pretest",
    choices: [
      "I understand, let's move on to other terms.",
      "It seems like you're under pressure from your costs going up.",
      "That's not fair — we've been loyal customers for years.",
      "Can you break down the cost increase for me?",
    ],
    correctAnswer: 1,
    choiceExplanations: [
      "Giving in skips past their emotion. You learn nothing and lose leverage.",
      "This is a *label* — it names their feeling without agreeing. It makes them feel heard and opens them up.",
      "Fairness claims trigger defensiveness. Now they're fighting you instead of explaining.",
      "Good instinct to gather data, but jumping to logic skips the emotional layer. Empathy first, then questions.",
    ],
  },

  // REVEAL 1: Labeling (micro-concept, 2 sentences)
  {
    id: 3001,
    category: "Business — Negotiation",
    front: "What does labeling do in a negotiation?",
    back: "Labeling their emotion ('It seems like...') validates their position without conceding yours. It opens them up to explain *why* — which reveals leverage points you can use.",
    keyPoints: [
      "'It seems like...' is non-threatening and invites elaboration",
      "Never start with 'I' — it shifts focus to you",
    ],
    exerciseType: "flashcard",
  },

  // PREDICT 2: Follow-up scenario (builds on what you just learned)
  {
    id: 3007,
    category: "Business — Negotiation",
    front: "You labeled: 'It seems like costs are squeezing you.' They respond: 'Yeah, raw materials are up 30%.' What's your next move?",
    back: "Calibrated questions shift the problem to them without confrontation. 'How can we...' makes it collaborative instead of adversarial.",
    keyPoints: [],
    exerciseType: "pretest",
    choices: [
      "Ask 'How can we make this work for both of us?'",
      "Offer a 10% discount to split the difference",
      "Say 'That's tough' and change the subject",
      "Ask to see their supplier invoices",
    ],
    correctAnswer: 0,
    choiceExplanations: [
      "A *calibrated question* — open-ended, starts with 'how', shifts the pressure to them to solve the problem collaboratively.",
      "Splitting the difference rewards their extreme position. You're negotiating against yourself.",
      "Sympathetic but passive. You've lost the thread — they'll just restate their position.",
      "Too aggressive too early. You haven't earned enough trust for this ask yet.",
    ],
  },

  // REVEAL 2: Concept assembles (micro-concept)
  {
    id: 3002,
    category: "Business — Negotiation",
    front: "What is tactical empathy?",
    back: "Tactical empathy = understand their feelings → label them ('It seems like...') → ask calibrated questions ('How can we...'). You never agree or concede — you *demonstrate understanding* to gain influence. (Chris Voss)",
    keyPoints: [
      "Step 1: Identify the feeling behind their position",
      "Step 2: Label it — 'It seems like...'",
      "Step 3: Ask calibrated 'how' questions",
    ],
    exerciseType: "flashcard",
  },

  // RETRIEVE: Empathy vs sympathy
  {
    id: 3003,
    category: "Business — Negotiation",
    front: "What's the difference between tactical empathy and sympathy?",
    back: "Sympathy creates emotional fusion ('I feel your pain'). Tactical empathy maintains separation — you understand their world without inhabiting it. This separation preserves your negotiating position.",
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

  // APPLY: Transfer to new context
  {
    id: 3004,
    category: "Business — Negotiation",
    front: "Your cofounder says 'I'm done working on this feature.' Write a label using 'It seems like...' and a calibrated question.",
    back: "Model answer: 'It seems like you're frustrated with how long this is taking. How can we scope it down so it ships this week?' — The label names the emotion, the calibrated question makes it collaborative.",
    keyPoints: [
      "Label: 'It seems like you're frustrated...'",
      "Calibrated Q: 'How can we...' (collaborative, not confrontational)",
      "Never: 'You need to finish this' (triggers defensiveness)",
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

  // Step 3: MCQ — sneezers
  {
    id: 3042,
    category: "Business — Marketing",
    front: "According to Godin, who should you build your product for?",
    back: "Sneezers are the early adopters who spread ideas. Your job is to make something so remarkable that sneezers can't help but tell people about it. Target the edges, not the middle.",
    keyPoints: [
      "Everyone = mass market (ineffective in crowded markets)",
      "Sneezers = Godin's term for word-of-mouth spreaders",
      "Target the edges (early adopters), not the middle (mass market)",
    ],
    exerciseType: "mcq",
    choices: [
      "The mass market — reach as many people as possible",
      "The sneezers — early adopters who spread ideas for you",
      "Your competitors' customers — steal their market share",
      "Investors — they'll fund your growth",
    ],
    correctAnswer: 1,
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

  // ================================================================
  // PRETEST CARDS (diagnostic — no penalty, shown before concept)
  // ================================================================

  // Pretest: Ackerman
  {
    id: 3025,
    category: "Business — Negotiation",
    front: "You want to negotiate a $120,000 salary. What's your opening number?",
    back: "Most people open at their target or slightly below. There's a counterintuitive strategy that research shows is far more effective...",
    keyPoints: [],
    exerciseType: "pretest",
    choices: [
      "$120,000 — start with what you want",
      "$130,000 — aim high so you have room to come down",
      "$78,000 — an extreme low anchor",
      "$110,000 — slightly below target",
    ],
    correctAnswer: 2,
    choiceExplanations: [
      "Opening at your target gives you zero room to concede. You'll end up below your goal.",
      "Better instinct, but 8% above isn't extreme enough to shift the range meaningfully.",
      "Feels crazy, but extreme anchors drag the negotiation toward your actual target through calibrated concessions.",
      "Barely below target — you'll be negotiated down to $100k before you know it.",
    ],
  },

  // Pretest: Be Remarkable
  {
    id: 3045,
    category: "Business — Marketing",
    front: "You're launching a product in a crowded market. What's the riskiest strategy?",
    back: "The answer surprises most people. Let's explore why 'safe' might be the most dangerous choice you can make...",
    keyPoints: [],
    exerciseType: "pretest",
    choices: [
      "Being radically different from competitors",
      "Targeting a tiny niche audience",
      "Playing it safe with a proven formula",
      "Pricing significantly higher than competitors",
    ],
    correctAnswer: 2,
    choiceExplanations: [
      "Different is risky in a different way — but at least people notice you.",
      "Niches are small but passionate. They can be the foundation of something big.",
      "Safe means invisible. In a world of infinite choice, nobody talks about 'fine'. You die quietly.",
      "Premium pricing signals quality and can work for the right audience — it's not the riskiest move.",
    ],
  },

  // ================================================================
  // LESSON: Unit Economics (biz-unit-economics)
  // ================================================================

  // Pretest
  {
    id: 3060,
    category: "Business — Finance",
    front: "Your startup acquires customers for $100 each. They pay $30/month but leave after 2 months. Is this business viable?",
    back: "Good instinct to check the math. The answer depends on two numbers that every founder should know cold. Let's learn them...",
    keyPoints: [],
    exerciseType: "pretest",
    choices: [
      "Yes — you're making $60 per customer ($30 × 2)",
      "No — you spend $100 to make $60, losing $40 per customer",
      "It depends on how fast you're growing",
      "Yes — if you raise prices to $60/month",
    ],
    correctAnswer: 1,
    choiceExplanations: [
      "$60 revenue vs $100 cost = -$40 per customer. You're literally paying people to use your product.",
      "Exactly right. LTV ($60) < CAC ($100). Every customer you acquire destroys value.",
      "Growth doesn't fix bad unit economics — it makes them worse. You lose more money faster.",
      "Doubling prices might fix the math, but it assumes customers would still pay. Test that assumption.",
    ],
  },

  // Concept
  {
    id: 3061,
    category: "Business — Finance",
    front: "What are CAC and LTV, and why do they decide if your business model works?",
    back: "**CAC** (Customer Acquisition Cost) = total sales & marketing spend ÷ new customers acquired.\n\n**LTV** (Lifetime Value) = average revenue per customer × average customer lifespan.\n\nIf LTV/CAC < 1, you lose money on every customer. If LTV/CAC > 3, you have a healthy business. Between 1-3, you're surviving but fragile.\n\nCB Insights found that 19% of startup failures come from unsustainable unit economics.",
    keyPoints: [
      "CAC = total spend ÷ new customers",
      "LTV = avg revenue × avg lifespan",
      "LTV/CAC > 3x = healthy, < 1x = losing money",
    ],
    exerciseType: "flashcard",
  },

  // Math: Calculate CAC
  {
    id: 3062,
    category: "Business — Finance",
    front: "You spend $50,000/month on marketing and acquire 500 customers. What's your CAC?",
    back: "CAC = $50,000 ÷ 500 = $100 per customer. Now you need to know: does each customer generate more than $100 in lifetime value?",
    keyPoints: [
      "CAC = total marketing spend ÷ new customers",
      "Include all acquisition costs: ads, sales team, content",
      "Track CAC by channel — some are 10x more efficient",
    ],
    exerciseType: "math",
    mathAnswer: 100,
    tolerance: 1,
    unit: "$",
  },

  // Math: Calculate LTV
  {
    id: 3063,
    category: "Business — Finance",
    front: "Average customer pays $30/month and stays 18 months. What's the LTV?",
    back: "LTV = $30 × 18 = $540. With a CAC of $100, LTV/CAC = 5.4x — very healthy. But watch out: if churn increases and average lifespan drops to 6 months, LTV = $180 and LTV/CAC = 1.8x — danger zone.",
    keyPoints: [
      "LTV = avg monthly revenue × avg months retained",
      "Small churn changes have massive LTV impact",
      "5.4x is excellent; below 3x is warning territory",
    ],
    exerciseType: "math",
    mathAnswer: 540,
    tolerance: 5,
    unit: "$",
  },

  // MCQ: LTV/CAC interpretation
  {
    id: 3064,
    category: "Business — Finance",
    front: "Your LTV/CAC ratio is 1.5x. What does this mean?",
    back: "LTV/CAC between 1-3 means you're making money per customer but not enough margin to absorb shocks (churn spikes, competition, cost increases). Target >3x before scaling aggressively.",
    keyPoints: [
      ">3x = scale aggressively",
      "1-3x = surviving but fragile",
      "<1x = losing money on every customer",
    ],
    exerciseType: "mcq",
    choices: [
      "You're very profitable — keep scaling",
      "You're surviving but fragile — improve retention or reduce acquisition costs",
      "You're losing money on every customer",
      "You need to raise prices immediately",
    ],
    correctAnswer: 1,
  },

  // Reflection
  {
    id: 3065,
    category: "Business — Finance",
    front: "Calculate (or estimate) the CAC and LTV for a product you use or are building. Is the ratio >3x? If not, what's the weakest lever — acquisition cost or retention?",
    back: "The two levers: reduce CAC (better targeting, organic channels, referrals) or increase LTV (reduce churn, upsell, increase prices). Most startups focus on acquisition when retention is the bigger lever.",
    keyPoints: [
      "Retention is usually the bigger lever than acquisition",
      "Reducing churn by 5% can double LTV",
      "Referrals reduce CAC and increase LTV simultaneously",
    ],
    exerciseType: "flashcard",
  },

  // --- Unit Economics REVIEW CARDS ---

  {
    id: 3070,
    category: "Business — Finance",
    front: "What is the LTV/CAC ratio and what's a healthy target?",
    back: "LTV (Lifetime Value) ÷ CAC (Customer Acquisition Cost). Target >3x. Between 1-3x = surviving but fragile. Below 1x = losing money on every customer.",
    keyPoints: [
      "CAC = total spend ÷ new customers",
      "LTV = avg revenue × avg lifespan",
      ">3x before scaling aggressively",
    ],
    exerciseType: "flashcard",
  },
  {
    id: 3071,
    category: "Business — Finance",
    front: "Why is retention usually a bigger lever than acquisition for improving unit economics?",
    back: "Reducing churn by 5% can double LTV (the denominator effect). Improving acquisition reduces CAC linearly, but retention compounds: each extra month a customer stays adds full-margin revenue.",
    keyPoints: [
      "Churn reduction compounds — each saved customer pays every month",
      "Acquisition improvements are linear, retention is exponential",
      "Referrals are the best of both: reduce CAC AND increase LTV",
    ],
    exerciseType: "flashcard",
  },

  // ================================================================
  // LESSON: Why Startups Die (biz-why-startups-die)
  // ================================================================

  // Pretest
  {
    id: 3080,
    category: "Business — Failures",
    front: "What do you think is the #1 reason startups fail?",
    back: "The data might surprise you. 'Running out of money' is the most cited reason — but is it really the cause, or just the symptom?",
    keyPoints: [],
    exerciseType: "pretest",
    choices: [
      "Running out of money",
      "No product-market fit",
      "Bad timing",
      "Team conflict",
    ],
    correctAnswer: 0,
    choiceExplanations: [
      "Technically correct — 70% cite this. But it's almost always the *symptom* of a deeper problem, not the root cause.",
      "This is the #1 *root* cause (43%), but it's cited less often because founders blame the money, not the product.",
      "A real factor (29%) but founders often use it as an excuse for deeper issues.",
      "Surprisingly less common than you'd think in the data. It matters, but it's not in the top 4.",
    ],
  },

  // Concept
  {
    id: 3081,
    category: "Business — Failures",
    front: "What are the top reasons startups fail, according to CB Insights' analysis of 431 shutdowns?",
    back: "CB Insights analyzed 431 VC-backed shutdowns (2023+). The top reasons overlap — most cite multiple causes:\n\n1. **Ran out of capital** — 70% (usually a symptom, not root cause)\n2. **No product-market fit** — 43% (the top root cause)\n3. **Bad timing / macro conditions** — 29%\n4. **Unsustainable unit economics** — 19%\n\nRunning out of capital is almost always the *effect*. The real killers are the other three.",
    keyPoints: [
      "70% ran out of capital (symptom, not cause)",
      "43% no product-market fit (top root cause)",
      "Multiple causes overlap in most failures",
    ],
    exerciseType: "flashcard",
  },

  // MCQ: Ranking (converted from ordering)
  {
    id: 3082,
    category: "Business — Failures",
    front: "Which is the correct ranking of startup failure reasons from most to least common?",
    back: "Capital exhaustion is the proximate cause in 70% of failures, but it's usually a symptom. Product-market fit (43%) is the most common root cause — if nobody wants what you're building, no amount of runway saves you.",
    keyPoints: [
      "Capital exhaustion = most cited but usually symptom",
      "PMF = most common root cause",
      "Percentages exceed 100% — multiple causes per failure",
    ],
    exerciseType: "mcq",
    choices: [
      "Capital (70%) → PMF (43%) → Timing (29%) → Unit economics (19%)",
      "PMF (43%) → Capital (70%) → Unit economics (19%) → Timing (29%)",
      "Timing (29%) → Capital (70%) → PMF (43%) → Unit economics (19%)",
      "Capital (70%) → Timing (29%) → PMF (43%) → Unit economics (19%)",
    ],
    correctAnswer: 0,
  },

  // MCQ: Zume Pizza
  {
    id: 3083,
    category: "Business — Failures",
    front: "Zume Pizza raised $446M and still failed. What was the primary cause?",
    back: "Zume is a textbook product-market fit failure at scale. They pivoted from robot-made pizza to sustainable packaging but never found a market that wanted either product enough. $446M couldn't fix that.",
    keyPoints: [
      "No amount of funding fixes lack of product-market fit",
      "Multiple pivots without finding fit = the money runs out",
      "$446M is the most expensive PMF lesson in recent history",
    ],
    exerciseType: "mcq",
    choices: [
      "Bad timing — the pandemic killed restaurants",
      "No product-market fit — pivoted from robot pizza to packaging, never found a viable market",
      "Founder conflict broke up the team",
      "A competitor copied their approach",
    ],
    correctAnswer: 1,
  },

  // MCQ: Capital as root vs symptom
  {
    id: 3084,
    category: "Business — Failures",
    front: "What separates 'ran out of capital' as a root cause vs. a symptom?",
    back: "Capital exhaustion is a root cause only when external factors (funding market freeze, investor politics) kill an otherwise working business. In most cases, investors stop funding because the underlying business isn't working.",
    keyPoints: [
      "Root cause: external factors killed a working business",
      "Symptom: investors stopped funding because nothing was working",
      "Ask: 'Would more money have fixed this?' If no, capital isn't the root cause",
    ],
    exerciseType: "mcq",
    choices: [
      "If you raised less than $10M, it's a root cause",
      "If you had PMF but couldn't raise more, it's root cause. If you couldn't raise because nothing worked, it's symptom.",
      "It's always a root cause — money solves everything",
      "It's never a root cause — you can always bootstrap",
    ],
    correctAnswer: 1,
  },

  // Reflection
  {
    id: 3085,
    category: "Business — Failures",
    front: "Which of the 4 failure modes is your biggest current risk? What's one thing you could do this week to reduce it?",
    back: "The most dangerous failure mode is the one you're not watching. PMF risk: talk to 5 customers this week. Capital risk: calculate runway. Timing risk: research market trends. Unit economics risk: calculate LTV/CAC.",
    keyPoints: [
      "Identify your #1 risk honestly",
      "PMF risk → customer conversations",
      "Capital risk → runway calculation",
    ],
    exerciseType: "flashcard",
  },

  // --- Why Startups Die REVIEW CARDS ---

  {
    id: 3090,
    category: "Business — Failures",
    front: "What are the top 4 reasons startups fail? (CB Insights, 431 companies)",
    back: "1. Ran out of capital — 70% (usually a symptom)\n2. No product-market fit — 43% (top root cause)\n3. Bad timing / macro conditions — 29%\n4. Unsustainable unit economics — 19%\n\nPercentages exceed 100% because most cite multiple reasons.",
    keyPoints: [
      "Capital exhaustion is symptom not cause",
      "PMF is #1 root cause",
      "Multiple causes overlap in most failures",
    ],
    exerciseType: "flashcard",
  },

  // ================================================================
  // LESSON: Wartime vs Peacetime CEO (biz-wartime-ceo)
  // ================================================================

  // Pretest
  {
    id: 3100,
    category: "Business — Leadership",
    front: "You need to lay off 30% of your company. What's the first thing you should do?",
    back: "This is one of the hardest decisions in business. There's a specific protocol from someone who's done it multiple times. Let's learn it...",
    keyPoints: [],
    exerciseType: "pretest",
    choices: [
      "Call an all-hands meeting immediately",
      "Get your own head right emotionally before acting",
      "Have HR prepare the paperwork",
      "Identify the lowest performers to cut first",
    ],
    correctAnswer: 1,
    choiceExplanations: [
      "Without emotional preparation, you'll communicate poorly. The message matters as much as the decision.",
      "Horowitz: process it first. If you rush while emotional, you'll say the wrong things and damage trust permanently.",
      "Process before paperwork. If HR leads, it feels corporate and impersonal. You need to own this.",
      "Layoffs aren't performance management. You're cutting roles, not underperformers. Different lens entirely.",
    ],
  },

  // Concept
  {
    id: 3101,
    category: "Business — Leadership",
    front: "What is the difference between a wartime and peacetime CEO?",
    back: "**Peacetime CEO** builds culture, develops people, expands markets. Think: Google in 2006.\n\n**Wartime CEO** makes hard calls under existential threat — layoffs, pivots, killing products. Think: Steve Jobs returning to Apple in 1997.\n\nMost founders default to peacetime because it's comfortable. The hard skill is recognizing when to switch.\n\n**Priority order in all modes**: People → Products → Profits.\n\n**Source**: Ben Horowitz, *The Hard Thing About Hard Things*",
    keyPoints: [
      "Peacetime: build, expand, develop (comfortable)",
      "Wartime: cut, pivot, survive (uncomfortable but necessary)",
      "People → Products → Profits (always this order)",
    ],
    exerciseType: "flashcard",
  },

  // MCQ: Layoffs protocol
  {
    id: 3102,
    category: "Business — Leadership",
    front: "You need to do layoffs. What's the first step in Horowitz's protocol?",
    back: "Horowitz: get your head right first. If you're emotional, you'll rush, communicate poorly, and damage trust further. Then: don't delay, be clear on reasons, train managers, address the whole company, be visible.",
    keyPoints: [
      "Process your emotions BEFORE acting",
      "Rushing leads to poor communication and broken trust",
      "After: don't delay, be clear, address everyone, stay visible",
    ],
    exerciseType: "mcq",
    choices: [
      "Announce it to the whole company immediately",
      "Get your own head right — process it emotionally before acting",
      "Let HR handle it and stay out of the way",
      "Find out who the lowest performers are",
    ],
    correctAnswer: 1,
  },

  // MCQ: Priority hierarchy (converted from ordering)
  {
    id: 3103,
    category: "Business — Leadership",
    front: "What is Horowitz's priority hierarchy for running a company?",
    back: "People → Products → Profits. If you have the right people, they build the right products. If you have the right products, profits follow. Inverting this chain destroys the company.",
    keyPoints: [
      "People first — always",
      "Products second — built by the right people",
      "Profits are the result, not the input",
    ],
    exerciseType: "mcq",
    choices: [
      "Profits → Products → People",
      "Products → People → Profits",
      "People → Products → Profits",
      "People → Profits → Products",
    ],
    correctAnswer: 2,
  },

  // Reflection
  {
    id: 3104,
    category: "Business — Leadership",
    front: "Is your current work situation wartime or peacetime? What's the evidence? If wartime, what hard decision are you avoiding?",
    back: "Signs of wartime: declining metrics, runway pressure, key people leaving, market shifting against you. The hardest part isn't making the decision — it's admitting you're in wartime when peacetime feels safer.",
    keyPoints: [
      "Wartime signs: declining metrics, runway pressure, key departures",
      "The hardest part is admitting the mode has changed",
      "Delaying wartime decisions makes them worse",
    ],
    exerciseType: "flashcard",
  },

  // --- Wartime CEO REVIEW CARDS ---

  {
    id: 3110,
    category: "Business — Leadership",
    front: "What is Horowitz's priority hierarchy?",
    back: "People → Products → Profits (in that order). Get the right people, they build the right products, profits follow. Inverting this chain (optimizing profits first) destroys the company.",
    keyPoints: [
      "People first always",
      "Products second",
      "Profits are the result, not the input",
    ],
    exerciseType: "flashcard",
  },
  {
    id: 3111,
    category: "Business — Leadership",
    front: "What's the first step when you need to do layoffs? (Horowitz)",
    back: "Get your own head right — process the emotions before acting. If you rush, you'll communicate poorly and damage trust. Then: don't delay, be clear on reasons, train managers to handle their reports, address the whole company, and be visible afterward.",
    keyPoints: [
      "Emotional processing comes FIRST",
      "Then: don't delay, be clear, address everyone",
      "Managers must own their own conversations",
    ],
    exerciseType: "flashcard",
  },
];
