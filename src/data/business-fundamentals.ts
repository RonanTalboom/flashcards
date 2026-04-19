import type { Lesson, Section } from "../types";

// === Business Fundamentals Learning Path ===
//
// Source: learning/Business Fundamentals — Learning Path.md in the Obsidian vault
// 7 domains, 26 lessons, target learner: first-time founder / aspiring operator.
//
// Lesson IDs use the "biz-" prefix. Card IDs are allocated from BUSINESS_CARDS
// in business-cards.ts (3000-series). This file defines only the section and
// lesson scaffold — the card IDs are wired in by lesson where the cards exist.

const D1_VISION_LESSONS: Lesson[] = [
  {
    id: "biz-contrarian-question",
    sectionId: "business-fundamentals",
    title: "The Contrarian Question",
    description:
      "Thiel: what important truth do few people agree with you on? Zero-to-One vs 1-to-N, definite vs indefinite optimism.",
    cards: [],
    prerequisites: [],
    concepts: [
      "Zero-to-One creates new categories; 1-to-N scales existing ones",
      "Secrets are truths that aren't yet consensus — the basis for monopoly",
      "Definite optimism invests in a specific future; indefinite hedges across futures",
      "Four views of the future combine definite/indefinite × optimistic/pessimistic",
    ],
  },
  {
    id: "biz-build-monopoly",
    sectionId: "business-fundamentals",
    title: "Build a Monopoly",
    description: "Competition destroys profits; durable businesses escape it.",
    cards: [],
    prerequisites: ["biz-contrarian-question"],
    concepts: [
      "Perfect competition is a race to zero margin; monopoly extracts rent",
      "Monopoly characteristics: proprietary tech, network effects, economies of scale, brand",
      "Last-mover advantage beats first-mover when the market rewards compounding",
      "Start small and dominate — see also [[Beachhead market strategy works for enterprise sales but PLG can bypass it]]",
    ],
  },
  {
    id: "biz-start-with-why",
    sectionId: "business-fundamentals",
    title: "Start With Why",
    description:
      "Sinek: the Golden Circle (Why → How → What) and infinite vs finite games.",
    cards: [],
    prerequisites: [],
    concepts: [
      "People buy why you do it, not what you do",
      "Communicate from the inside of the Golden Circle outward",
      "Infinite games have no winner; playing with a finite mindset in an infinite game is a losing frame",
    ],
  },
  {
    id: "biz-strategic-positioning",
    sectionId: "business-fundamentals",
    title: "Strategic Positioning",
    description:
      "Harnish: BHAG, One-Page Strategic Plan, 7 Strata of strategy, core customer in 25 words.",
    cards: [],
    prerequisites: ["biz-start-with-why"],
    concepts: [
      "BHAG: Big Hairy Audacious Goal — 10-25 year horizon",
      "One-Page Strategic Plan forces clarity across purpose / priorities / people",
      "Seven Strata: words you own, brand promises, brand-promise guarantees, one-phrase strategy, differentiating activities, X-factor, profit/X",
      "Core customer articulable in 25 words or fewer",
    ],
  },
];

const D2_MARKETING_LESSONS: Lesson[] = [
  {
    id: "biz-be-remarkable",
    sectionId: "business-fundamentals",
    title: "Be Remarkable",
    description:
      "Godin: Purple Cow, sneezers, permission vs interruption, smallest viable audience.",
    cards: [],
    prerequisites: [],
    concepts: [
      "Remarkable literally means worth remarking on",
      "Sneezers carry the message across their network — design for them, not the median",
      "Permission marketing exchanges value over time vs interruption marketing which pays for attention",
      "Smallest viable audience: pick the narrowest group you can delight, not the largest you can reach",
    ],
  },
  {
    id: "biz-build-measure-learn",
    sectionId: "business-fundamentals",
    title: "Build-Measure-Learn",
    description:
      "Ries + Fitzpatrick: MVP, validated learning, pivot or persevere, Mom Test interview hygiene.",
    cards: [],
    prerequisites: [],
    concepts: [
      "MVP is the minimum feature set that produces validated learning",
      "Vanity metrics (total signups) are useless; cohort metrics (7-day retention) are actionable",
      "Pivot or persevere is a quarterly decision, not a reaction",
      "Mom Test rules: talk about their life not your idea; ask about past specifics not future generics; listen more than you talk",
      "See also [[Compliments are fool's gold; only commitment counts in customer interviews]]",
      "See also [[MVP validation systematically produces false positives in non-representative early adopter cohorts]]",
    ],
  },
  {
    id: "biz-the-dip",
    sectionId: "business-fundamentals",
    title: "The Dip",
    description:
      "Godin: strategic quitting, the dip vs the cul-de-sac, being best in a small world.",
    cards: [],
    prerequisites: ["biz-be-remarkable"],
    concepts: [
      "The dip is the hard middle where quitters drop off — persist if you'll be best at the end",
      "The cul-de-sac is effort that can never reach the end — quit quickly",
      "Sunk cost is irrelevant; expected value of continuing is what matters",
      "Being best in the world requires defining a small enough world",
    ],
  },
  {
    id: "biz-storytelling-status",
    sectionId: "business-fundamentals",
    title: "Storytelling & Status",
    description:
      "Godin: authentic narratives, worldview alignment, status roles as the marketing engine.",
    cards: [],
    prerequisites: ["biz-be-remarkable"],
    concepts: [
      "People tell themselves a story about the products they buy — your job is to match the story",
      "Worldviews are stable filters — markets don't change minds, they surface matching worldviews",
      "Status roles (dominance, affiliation, distinction) drive most purchase decisions",
      "Tension between the current state and a desired state is what makes a story compelling",
    ],
  },
];

const D3_SALES_LESSONS: Lesson[] = [
  {
    id: "biz-tactical-empathy",
    sectionId: "business-fundamentals",
    title: "Tactical Empathy & Labeling",
    description:
      "Voss: labeling emotions increases influence; mirroring invites elaboration; the late-night FM DJ voice.",
    cards: [3000, 3001],
    prerequisites: [],
    concepts: [
      "'It seems like...' labels the other side's emotion without conceding anything",
      "Mirroring (repeat their last 3 words as a question) invites elaboration",
      "The late-night FM DJ voice (slow, warm, downward inflection) signals safety",
      "Acknowledge emotion before attempting logic",
    ],
  },
  {
    id: "biz-calibrated-questions",
    sectionId: "business-fundamentals",
    title: "Calibrated Questions",
    description: "Open-ended How/What questions that shift pressure and power.",
    cards: [3007],
    prerequisites: ["biz-tactical-empathy"],
    concepts: [
      "How / What questions make the other side solve your problem",
      "'How am I supposed to do that?' is a calibrated rejection",
      "The power of No — it gives the other side the illusion of control",
      "Avoid Why — it sounds accusatory in most languages",
    ],
  },
  {
    id: "biz-accusation-audit",
    sectionId: "business-fundamentals",
    title: "The Accusation Audit",
    description: "Preemptively list negatives to defuse them; 'That's Right' as turning point.",
    cards: [],
    prerequisites: ["biz-tactical-empathy"],
    concepts: [
      "Say the hard thing about yourself first so the other side can't use it",
      "'That's right' from the other side is the turning point — they feel understood",
      "'You're right' is empty concession; listen for 'that's right'",
    ],
  },
  {
    id: "biz-ackerman-model",
    sectionId: "business-fundamentals",
    title: "The Ackerman Model",
    description: "Anchor at 65%, calibrated offers (85/95/100%), odd numbers, Rule of Three.",
    cards: [],
    prerequisites: ["biz-calibrated-questions"],
    concepts: [
      "Set target; open at 65%; calibrated moves to 85%, 95%, 100%",
      "Odd numbers signal careful calculation",
      "Rule of Three: get the other side to say the same thing three ways — locks commitment",
      "Non-monetary pivots (delivery, terms, exclusivity) often beat price concessions",
    ],
  },
  {
    id: "biz-black-swans",
    sectionId: "business-fundamentals",
    title: "Black Swans & Counterpart Styles",
    description:
      "Hidden information, the counterpart's 'religion', Accommodator vs Assertive vs Analyst.",
    cards: [],
    prerequisites: ["biz-accusation-audit"],
    concepts: [
      "Black swans are unknown-knowables the other side has that break the deal",
      "Their 'religion' is the deep value they won't trade against — find it",
      "Accommodator types want relationship; Assertive want respect; Analyst wants data",
      "Adapt tone and pacing to their style, not yours",
    ],
  },
];

const D4_EXECUTION_LESSONS: Lesson[] = [
  {
    id: "biz-rockefeller-habits",
    sectionId: "business-fundamentals",
    title: "The Rockefeller Habits",
    description:
      "Harnish: 10 habits across three pillars (Priorities / Data / Rhythm), quarterly Rocks, meeting cadences.",
    cards: [],
    prerequisites: [],
    concepts: [
      "Three pillars: Priorities (clarity), Data (visibility), Rhythm (cadence)",
      "Quarterly Rocks: 3-5 big priorities with clear owner and deadline",
      "Daily huddle + weekly meeting + monthly learning + quarterly planning",
      "See [[The Rockefeller Habits are an execution system not a strategy framework]]",
    ],
  },
  {
    id: "biz-accountability-alignment",
    sectionId: "business-fundamentals",
    title: "Accountability & Alignment",
    description:
      "Wickman EOS: FACe chart, single owner per function, Scorecard, right people in right seats.",
    cards: [],
    prerequisites: ["biz-rockefeller-habits"],
    concepts: [
      "Functional Accountability chart: one owner per function, no shared accountability",
      "Scorecard: 5-15 weekly numbers you track every meeting",
      "Right people (shared core values) × right seats (capability + desire + ability)",
      "See [[Business operating systems are interchangeable packagings of the same management hygiene]]",
    ],
  },
  {
    id: "biz-work-on-business",
    sectionId: "business-fundamentals",
    title: "Work ON the Business",
    description: "Gerber E-Myth: technician → manager → entrepreneur, systemize with processes.",
    cards: [],
    prerequisites: [],
    concepts: [
      "Most small businesses fail because the technician opened shop without the manager/entrepreneur mindsets",
      "Work ON the business (system design) as much as IN it (execution)",
      "Document every process so anyone at your skill level could run it",
      "Franchise prototype mental model: build it as if you were going to franchise",
    ],
  },
  {
    id: "biz-cash-conversion",
    sectionId: "business-fundamentals",
    title: "Cash Conversion Cycle",
    description: "CCC formula, three levers (cycle time / inventory / receivables), Power of One.",
    cards: [],
    prerequisites: [],
    concepts: [
      "CCC = DSO + DIO − DPO (days sales outstanding + days inventory outstanding − days payable outstanding)",
      "Three levers: shrink cycle time, reduce inventory, lengthen payables",
      "Power of One: 1% improvements in price, volume, COGS, OpEx, accounts — model each before acting",
      "Operating cash flow > accounting profit as a viability signal",
    ],
  },
];

const D5_PEOPLE_LESSONS: Lesson[] = [
  {
    id: "biz-radical-candor",
    sectionId: "business-fundamentals",
    title: "Radical Candor",
    description:
      "Scott: care personally + challenge directly; feedback as dialogue not monologue.",
    cards: [],
    prerequisites: [],
    concepts: [
      "2×2: ruinous empathy (care but don't challenge), obnoxious aggression (challenge but don't care), manipulative insincerity (neither), radical candor (both)",
      "Care is demonstrated by remembering, showing up, asking about their life",
      "Challenge means saying the hard thing in real time, not saving it for the annual review",
      "Feedback is a gift only if the receiver can use it",
    ],
  },
  {
    id: "biz-tribes-linchpin",
    sectionId: "business-fundamentals",
    title: "Tribes & The Linchpin",
    description: "Godin: tribes need leaders not managers; emotional labor; shipping; the resistance.",
    cards: [],
    prerequisites: [],
    concepts: [
      "Tribes exist — your job as a leader is to make them effective, not create them",
      "Emotional labor (showing up for hard conversations, honest feedback, genuine presence) is what makes a linchpin",
      "The Resistance (Pressfield/Godin) is the internal voice that prevents shipping — name it to defeat it",
      "Shipping is the only skill that compounds",
    ],
  },
  {
    id: "biz-wartime-peacetime",
    sectionId: "business-fundamentals",
    title: "Wartime vs Peacetime CEO",
    description:
      "Horowitz: different skills, different modes; know which one the current moment demands.",
    cards: [],
    prerequisites: [],
    concepts: [
      "Wartime CEO: single-point-of-decision, no consensus, hard calls (layoffs, pivots, firings)",
      "Peacetime CEO: expand market, invest in culture, build systems",
      "Trying to run wartime with peacetime methods — or vice versa — is a reliable failure mode",
      "The transition between modes is the hardest thing a CEO does",
    ],
  },
];

const D6_FINANCE_LESSONS: Lesson[] = [
  {
    id: "biz-unit-economics",
    sectionId: "business-fundamentals",
    title: "Unit Economics",
    description: "CAC, LTV, payback period, contribution margin.",
    cards: [],
    prerequisites: [],
    concepts: [
      "CAC (customer acquisition cost): total sales + marketing spend / new customers acquired",
      "LTV (lifetime value): gross margin per customer × average customer lifetime",
      "LTV/CAC > 3× is the healthy heuristic; > 1× is barely viable",
      "Payback period: months to recover CAC from gross margin — shorter is better",
    ],
  },
  {
    id: "biz-cash-flow-runway",
    sectionId: "business-fundamentals",
    title: "Cash Flow & Runway",
    description:
      "Burn rate, runway, cash flow statement structure, Graham's 'default alive' test.",
    cards: [],
    prerequisites: ["biz-unit-economics"],
    concepts: [
      "Burn rate: monthly net cash outflow",
      "Runway: cash on hand / burn rate",
      "Three sections of cash flow statement: operating, investing, financing",
      "Default alive (Graham): current growth trajectory reaches profitability before runway ends",
    ],
  },
  {
    id: "biz-fundraising-mechanics",
    sectionId: "business-fundamentals",
    title: "Fundraising Mechanics",
    description: "Pre/post-money valuation, dilution, cap tables, convertibles and SAFEs.",
    cards: [],
    prerequisites: ["biz-cash-flow-runway"],
    concepts: [
      "Pre-money = post-money − amount raised; price per share = pre-money / existing shares",
      "Dilution: founder ownership decreases proportionally to new capital raised",
      "SAFE (Simple Agreement for Future Equity): deferred priced round, cap and/or discount",
      "Convertible notes are debt that converts; SAFEs are not debt",
    ],
  },
];

const D7_FAILURES_LESSONS: Lesson[] = [
  {
    id: "biz-why-startups-die",
    sectionId: "business-fundamentals",
    title: "Why Startups Die",
    description:
      "CB Insights 483-post-mortem data + Eisenmann's six-pattern taxonomy.",
    cards: [],
    prerequisites: [],
    concepts: [
      "CB Insights: 70% ran out of capital, 43% no PMF, 29% bad timing, 19% unit economics",
      "Eisenmann's six patterns: false starts, bad bedfellows, false positives, speed traps, help wanted, cascading miracles",
      "Ran-out-of-cash is the death certificate, not the disease — look upstream",
      "See [[Startup outcomes follow a power law dominated by capital timing and luck not methodology]]",
    ],
  },
  {
    id: "biz-struggle",
    sectionId: "business-fundamentals",
    title: "The Struggle",
    description: "Horowitz: the hard thing about hard things; management debt.",
    cards: [],
    prerequisites: [],
    concepts: [
      "The Struggle: the felt experience of founder/CEO existential dread as a normal phase, not failure",
      "Management debt: short-term fixes (overpaying to retain, not firing, two-in-a-box) that compound",
      "Take care of the people, the products, and the profits — in that order",
      "Tell it like it is — demoralization from bullshit is worse than demoralization from bad news",
    ],
  },
  {
    id: "biz-anti-trendslop",
    sectionId: "business-fundamentals",
    title: "The Anti-Trendslop Mindset",
    description:
      "Generic advice sounds right but goes wrong; contrarian thinking; perspective forcing.",
    cards: [],
    prerequisites: [],
    concepts: [
      "Trendslop: advice that sounds insightful but could apply to any company — useless as action",
      "See [[Trendslop is extrapolation masquerading as foresight]]",
      "Demand specificity: strip the proper nouns — does the sentence still make sense for a different company? If yes, it's generic",
      "Perspective forcing: who would disagree and why? What's the steelman counter?",
    ],
  },
];

export const BUSINESS_FUNDAMENTALS_SECTION: Section = {
  id: "business-fundamentals",
  title: "Business Fundamentals",
  description:
    "A 26-lesson path for first-time founders and aspiring operators. Frameworks from Thiel, Sinek, Harnish, Godin, Voss, Ries, Fitzpatrick, Wickman, Gerber, Scott, Horowitz + CB Insights failure data. Tests framework recall and situational recognition, not business judgment.",
  icon: "&#128188;", // briefcase
  color: "#b37feb",
  lessons: [
    ...D1_VISION_LESSONS,
    ...D2_MARKETING_LESSONS,
    ...D3_SALES_LESSONS,
    ...D4_EXECUTION_LESSONS,
    ...D5_PEOPLE_LESSONS,
    ...D6_FINANCE_LESSONS,
    ...D7_FAILURES_LESSONS,
  ],
};

export const BUSINESS_FUNDAMENTALS_LESSON_ORDER: string[] =
  BUSINESS_FUNDAMENTALS_SECTION.lessons.map((l) => l.id);
