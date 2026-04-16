import type { Section } from "../types";

export const SECTIONS: Section[] = [
  // === Section 1: Foundations ===
  {
    id: "foundations",
    title: "Foundations",
    description: "Core principles of data-intensive systems",
    icon: "&#9881;",
    color: "#38b2ac",
    lessons: [
      {
        id: "design-principles",
        sectionId: "foundations",
        title: "Design Principles",
        description:
          "Why system design is about tradeoffs, not best practices",
        cards: [1, 2],
        prerequisites: [],
        concepts: [
          "Tradeoffs are unavoidable and should be made explicit",
          "Reliability, Scalability, Maintainability: the three axes",
          "No universally correct solutions — only decisions that fit requirements",
        ],
      },
      {
        id: "data-distribution",
        sectionId: "foundations",
        title: "Data Distribution",
        description: "Replication, partitioning, and consistency models",
        cards: [3, 4, 5],
        prerequisites: ["design-principles"],
        concepts: [
          "Replication copies data for fault tolerance",
          "Partitioning splits data for write scaling",
          "Consistency ranges from eventual to linearizable",
        ],
      },
      {
        id: "ddia-glossary",
        sectionId: "foundations",
        title: "DDIA Glossary",
        description:
          "Key distinctions and core definitions from Designing Data-Intensive Applications",
        cards: [
          6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009, 6010,
          6011, 6012, 6013, 6014, 6015, 6016, 6017, 6018, 6019, 6020, 6021,
          6022, 6023, 6024,
        ],
        prerequisites: [],
        concepts: [
          "Fault vs failure, linearizability vs serializability, and other key distinctions",
          "Core distributed systems definitions: replication, partitioning, consensus, quorum",
          "Storage tradeoffs: B-trees vs LSM-trees, OLTP vs OLAP",
          "Event sourcing, CQRS, CDC, and the dual-write anti-pattern",
          "Operational concerns: split brain, backpressure",
        ],
      },
    ],
  },

  // === Section 2: Distributed Systems ===
  {
    id: "distributed",
    title: "Distributed Systems",
    description: "Theory and trade-offs of distributed computing",
    icon: "&#9741;",
    color: "#4299e1",
    lessons: [
      {
        id: "cap-consistency",
        sectionId: "distributed",
        title: "CAP & Consistency",
        description: "The fundamental constraints of distributed systems",
        cards: [6, 7],
        prerequisites: ["data-distribution"],
        concepts: [
          "During a partition: choose Consistency or Availability",
          "PACELC: even without partitions, latency vs consistency",
          "The real question is day-to-day tradeoffs, not partition scenarios",
        ],
      },
      {
        id: "consensus",
        sectionId: "distributed",
        title: "Consensus",
        description: "How nodes agree despite failures",
        cards: [8],
        prerequisites: ["cap-consistency"],
        concepts: [
          "Consensus = getting nodes to agree on a value",
          "Raft: leader election + log replication",
          "2f+1 nodes tolerate f failures",
        ],
      },
    ],
  },

  // === Section 3: Architecture ===
  {
    id: "architecture",
    title: "Architecture Patterns",
    description: "Bounded contexts, event sourcing, and beyond",
    icon: "&#9635;",
    color: "#9f7aea",
    lessons: [
      {
        id: "domain-design",
        sectionId: "architecture",
        title: "Domain-Driven Design",
        description: "Bounded contexts and the dependency rule",
        cards: [9, 10, 11],
        prerequisites: ["design-principles"],
        concepts: [
          "Bounded contexts are the natural unit of service decomposition",
          "Dependencies point inward: domain at center, frameworks at edges",
          "Wrong boundaries create distributed monoliths",
        ],
      },
      {
        id: "event-driven",
        sectionId: "architecture",
        title: "Event-Driven Architecture",
        description: "Event sourcing, CQRS, and stream processing",
        cards: [12, 13, 14],
        prerequisites: ["domain-design"],
        concepts: [
          "Event sourcing: state as a sequence of events",
          "CQRS: separate models for reading and writing",
          "Kappa > Lambda in modern architectures",
        ],
      },
      {
        id: "module-design",
        sectionId: "architecture",
        title: "Module Design",
        description:
          "Deep modules, information hiding, and complexity management",
        cards: [4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008],
        prerequisites: ["domain-design"],
        concepts: [
          "Deep modules: simple interface, powerful implementation",
          "Information hiding: encapsulate design decisions likely to change",
          "Information leakage couples modules through shared decisions",
          "Interface simplicity > implementation simplicity",
          "Progressive disclosure helps AI agents navigate codebases",
        ],
      },
    ],
  },

  // === Section 4: Infrastructure & SRE ===
  {
    id: "operations",
    title: "Infrastructure & SRE",
    description: "Scaling, reliability, and incident management",
    icon: "&#9888;",
    color: "#ed8936",
    lessons: [
      {
        id: "scaling",
        sectionId: "operations",
        title: "Scaling Primitives",
        description: "Load balancers, caches, and database choices",
        cards: [15, 16],
        prerequisites: ["data-distribution"],
        concepts: [
          "LB → app → cache → DB: each layer absorbs load",
          "Postgres is the default unless you have a reason not to",
          "Redis for sub-ms, Cassandra for write-heavy scale",
        ],
      },
      {
        id: "sre-foundations",
        sectionId: "operations",
        title: "SRE Foundations",
        description: "SLIs, error budgets, and toil",
        cards: [17, 18, 19],
        prerequisites: ["scaling"],
        concepts: [
          "SLIs measure user experience, not CPU",
          "Error budget: 100% minus SLO, a spendable resource",
          "Toil scales linearly — engineering reduces future toil",
        ],
      },
      {
        id: "incident-mgmt",
        sectionId: "operations",
        title: "Incident Management",
        description: "Structured response and blameless postmortems",
        cards: [20, 21],
        prerequisites: ["sre-foundations"],
        concepts: [
          "Incident Commander coordinates, doesn't debug",
          "Severity levels pre-defined by impact",
          "Blameless postmortems fix systems, not people",
        ],
      },
    ],
  },

  // === Section 5: Quantitative Finance ===
  {
    id: "quant",
    title: "Quantitative Finance",
    description: "Options pricing, risk, and portfolio theory",
    icon: "&#936;",
    color: "#38a169",
    lessons: [
      {
        id: "options-pricing",
        sectionId: "quant",
        title: "Options Pricing",
        description: "Black-Scholes, Greeks, and risk-neutral pricing",
        cards: [32, 33, 34],
        prerequisites: [],
        concepts: [
          "Black-Scholes: option price = cost of a perfect hedge",
          "Greeks measure sensitivity to price, time, vol",
          "Risk-neutral pricing: discount expected payoff at risk-free rate",
        ],
      },
      {
        id: "stochastic-calc",
        sectionId: "quant",
        title: "Stochastic Calculus",
        description: "Ito's Lemma and the foundations",
        cards: [35],
        prerequisites: ["options-pricing"],
        concepts: [
          "Ito's Lemma: chain rule for stochastic calculus",
          "Extra term: (dW)² = dt from non-zero quadratic variation",
          "Foundation for Black-Scholes PDE derivation",
        ],
      },
      {
        id: "risk-measurement",
        sectionId: "quant",
        title: "Risk Measurement",
        description: "VaR, Sharpe, and their limitations",
        cards: [36, 37],
        prerequisites: ["options-pricing"],
        concepts: [
          "VaR: max loss at a confidence level, says nothing beyond threshold",
          "Sharpe: excess return per unit risk, misleading for non-normal returns",
          "Expected Shortfall fixes VaR's subadditivity problem",
        ],
      },
      {
        id: "portfolio-theory",
        sectionId: "quant",
        title: "Portfolio Theory",
        description: "Mean-variance optimization and volatility surfaces",
        cards: [38, 39],
        prerequisites: ["risk-measurement"],
        concepts: [
          "Diversification: the only free lunch in finance",
          "Efficient frontier: max return for each risk level",
          "Volatility smile reveals Black-Scholes limitations",
        ],
      },
    ],
  },

  // === Section 6: Learning Science ===
  {
    id: "learning",
    title: "Learning Science",
    description: "Meta-knowledge: how to learn effectively",
    icon: "&#128218;",
    color: "#e53e3e",
    lessons: [
      {
        id: "core-techniques",
        sectionId: "learning",
        title: "Core Techniques",
        description:
          "Spaced repetition, desirable difficulties, and interleaving",
        cards: [22, 23, 24],
        prerequisites: [],
        concepts: [
          "Spaced repetition + active recall: the two highest-utility techniques",
          "Desirable difficulties: harder now = stronger later",
          "Interleaving improves transfer by +43%",
        ],
      },
      {
        id: "metacognition",
        sectionId: "learning",
        title: "Metacognition & Feedback",
        description: "Knowing what you don't know",
        cards: [25, 26],
        prerequisites: ["core-techniques"],
        concepts: [
          "Illusion of competence: re-reading feels productive but isn't",
          "Confidence calibration trains metacognition",
          "Immediate elaborated feedback amplifies every other technique",
        ],
      },
      {
        id: "platforms-gamification",
        sectionId: "learning",
        title: "Platforms & Gamification",
        description: "What makes Duolingo, Brilliant, and Anki work",
        cards: [27, 28, 29, 30, 31],
        prerequisites: ["metacognition"],
        concepts: [
          "Streaks increase commitment by 60%",
          "FSRS outperforms SM-2 in 91.9% of cases",
          "Active learning > passive: produce before consuming",
        ],
      },
    ],
  },

  // === Section 7: Prediction Market Trading ===
  {
    id: "pm-trading",
    title: "Prediction Market Trading",
    description: "From EV to execution — the math of profitable trading",
    icon: "&#128200;",
    color: "#d69e2e",
    lessons: [
      {
        id: "pm-expected-value",
        sectionId: "pm-trading",
        title: "Expected Value",
        description: "The single most important formula in trading",
        cards: [100, 300, 200, 201, 202, 203],
        prerequisites: [],
        concepts: [
          "EV = (win_prob x profit) - (loss_prob x loss)",
          "Never enter a trade with EV <= 0",
          "Calculate EV before every trade",
        ],
      },
      {
        id: "pm-kelly",
        sectionId: "pm-trading",
        title: "Kelly Criterion",
        description: "Optimal position sizing for maximum growth",
        cards: [101, 301, 204, 205, 206],
        prerequisites: ["pm-expected-value"],
        concepts: [
          "f* = (p*b - q) / b",
          "Full Kelly is too aggressive — use 1/4 to 1/2 Kelly",
          "2x Kelly = guaranteed ruin",
        ],
      },
      {
        id: "pm-bayes",
        sectionId: "pm-trading",
        title: "Bayesian Updates",
        description: "Update beliefs with evidence, not emotion",
        cards: [102, 103, 302, 207, 208, 209],
        prerequisites: ["pm-expected-value"],
        concepts: [
          "P(H|E) = P(E|H) * P(H) / P(E)",
          "Base rates matter more than narratives",
          "Update proportionally — don't overreact",
        ],
      },
      {
        id: "pm-calibration",
        sectionId: "pm-trading",
        title: "Calibration & Scoring",
        description: "Measure how good your predictions actually are",
        cards: [105, 303, 142, 210, 211],
        prerequisites: ["pm-bayes"],
        concepts: [
          "Brier Score: 0 = perfect, 0.25 = coin flip",
          "Win rate is a trap — focus on realized PnL",
          "If your Brier > market, switch to arbitrage",
        ],
      },
      {
        id: "pm-market-structure",
        sectionId: "pm-trading",
        title: "Market Structure & VPIN",
        description: "How order books and toxic flow work",
        cards: [120, 121, 304, 130, 212, 213],
        prerequisites: ["pm-expected-value"],
        concepts: [
          "CLOB: bid/ask matching with YES + NO = $1.00",
          "VPIN detects informed trading — exit above 0.70",
          "Read order book depth to find supply/demand zones",
        ],
      },
      {
        id: "pm-strategies",
        sectionId: "pm-trading",
        title: "Winning Strategies",
        description: "The three strategies that survive 10,000 simulations",
        cards: [110, 111, 112, 114, 214, 215],
        prerequisites: ["pm-kelly", "pm-calibration"],
        concepts: [
          "Insurance, Sports O/U, Bayesian Arb — the only survivors",
          "Market making: capture spread without predicting outcomes",
          "97.1% of simulated traders went broke",
        ],
      },
      {
        id: "pm-advanced",
        sectionId: "pm-trading",
        title: "Advanced Topics",
        description: "KL-divergence, pairs trading, and sentiment",
        cards: [104, 113, 150, 151, 216, 217],
        prerequisites: ["pm-strategies"],
        concepts: [
          "KL-divergence finds structural mispricings",
          "Pairs trading on cointegrated contracts",
          "Fear/sentiment sensitivity varies by contract",
        ],
      },
    ],
  },

  // === Section 8: French A1 ===
  {
    id: "french-a1",
    title: "French A1",
    description: "Survival French — greetings to everyday communication",
    icon: "&#127467;&#127479;",
    color: "#2563eb",
    lessons: [
      {
        id: "fr-greetings",
        sectionId: "french-a1",
        title: "Greetings & Politeness",
        description: "Hello, goodbye, please, thank you — the essentials",
        cards: [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014],
        prerequisites: [],
        concepts: [
          "Bonjour, bonsoir, au revoir, salut",
          "Merci, s'il vous plaît, excusez-moi",
          "Introducing yourself: je m'appelle...",
        ],
      },
      {
        id: "fr-numbers",
        sectionId: "french-a1",
        title: "Numbers & Time",
        description: "Counting, days, months, and telling time",
        cards: [1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025],
        prerequisites: ["fr-greetings"],
        concepts: [
          "Numbers 1-100 (including 70, 80, 90 — the tricky ones)",
          "Days of the week and months",
          "Asking and telling time",
        ],
      },
      {
        id: "fr-food",
        sectionId: "french-a1",
        title: "Food & Restaurant",
        description: "Ordering food, drinks, and asking for the check",
        cards: [1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040],
        prerequisites: ["fr-greetings"],
        concepts: [
          "Common food vocabulary with gender (le/la)",
          "Ordering: je voudrais..., s'il vous plaît",
          "Asking for the check: l'addition",
        ],
      },
      {
        id: "fr-family",
        sectionId: "french-a1",
        title: "Family & People",
        description: "Family members, describing people",
        cards: [1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050],
        prerequisites: ["fr-greetings"],
        concepts: [
          "Family members: père, mère, frère, sœur",
          "Gender pairs: un ami / une amie",
          "Possessives: mon, ma, mes",
        ],
      },
      {
        id: "fr-directions",
        sectionId: "french-a1",
        title: "Directions & Transport",
        description: "Getting around — where is...?, left, right, metro",
        cards: [1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058],
        prerequisites: ["fr-numbers"],
        concepts: [
          "Asking: où est... ?",
          "Directions: à gauche, à droite, tout droit",
          "Transport: le métro, la gare, un billet",
        ],
      },
      {
        id: "fr-verbs",
        sectionId: "french-a1",
        title: "Essential Verbs",
        description: "être, avoir, aller, faire — the foundation verbs",
        cards: [1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074],
        prerequisites: ["fr-greetings"],
        concepts: [
          "être (to be) and avoir (to have) — full present tense",
          "aller (to go) and faire (to do/make)",
          "Regular -er verbs: parler, manger, aimer, habiter",
        ],
      },
      {
        id: "fr-phrases",
        sectionId: "french-a1",
        title: "Essential Phrases & Adjectives",
        description: "Survival phrases, descriptions, and everyday expressions",
        cards: [1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1104, 1105, 1106],
        prerequisites: ["fr-verbs", "fr-food", "fr-directions"],
        concepts: [
          "Survival: je ne comprends pas, parlez-vous anglais ?",
          "Descriptions: grand/petit, bon/mauvais, beau/belle",
          "Places: la maison, la boulangerie, le supermarché",
        ],
      },
    ],
  },

  // === Section 9: Kahneman — Thinking & Decision-Making ===
  {
    id: "kahneman",
    title: "Thinking & Decision-Making",
    description: "Kahneman: heuristics, biases, prospect theory, noise",
    icon: "&#129504;",
    color: "#e53e3e",
    lessons: [
      {
        id: "kah-system12",
        sectionId: "kahneman",
        title: "System 1 & System 2",
        description: "Fast intuitive thinking vs slow deliberate thinking",
        cards: [5000, 5001],
        prerequisites: [],
        concepts: [
          "System 1: fast, automatic, effortless",
          "System 2: slow, deliberate, effortful",
          "Most errors come from System 1 substituting easy questions for hard ones",
        ],
      },
      {
        id: "kah-heuristics",
        sectionId: "kahneman",
        title: "Heuristics & Biases",
        description: "Anchoring, availability, representativeness, and their traps",
        cards: [5002, 5003, 5004],
        prerequisites: ["kah-system12"],
        concepts: [
          "Anchoring: first number biases all subsequent estimates",
          "Availability: ease of recall ≠ actual frequency",
          "Representativeness: similarity to a stereotype ≠ probability",
        ],
      },
      {
        id: "kah-prospect",
        sectionId: "kahneman",
        title: "Prospect Theory & Loss Aversion",
        description: "Why losses hurt 2x more than equivalent gains feel good",
        cards: [5005, 5006],
        prerequisites: ["kah-heuristics"],
        concepts: [
          "Loss aversion: losses weighted ~2x gains",
          "Reference point determines whether an outcome feels like a gain or loss",
          "Framing: same outcome described as gain vs loss changes decisions",
        ],
      },
      {
        id: "kah-noise",
        sectionId: "kahneman",
        title: "Noise vs. Bias",
        description: "The hidden variability in human judgment",
        cards: [5007, 5008, 5009],
        prerequisites: [],
        concepts: [
          "Bias = systematic error, Noise = random scatter",
          "Noise is often larger than bias but invisible without measurement",
          "Occasion noise: the same person gives different judgments on different days",
        ],
      },
      {
        id: "kah-hygiene",
        sectionId: "kahneman",
        title: "Decision Hygiene",
        description: "Practical protocols for reducing noise and bias",
        cards: [5010, 5011, 5012],
        prerequisites: ["kah-noise"],
        concepts: [
          "Structure replaces intuition: checklists, rubrics, independent judgments",
          "Aggregate multiple opinions before discussing",
          "Mediating assessments: break complex judgments into components",
        ],
      },
      {
        id: "kah-replication",
        sectionId: "kahneman",
        title: "Replication & Intellectual Honesty",
        description: "What Kahneman got wrong and why that matters",
        cards: [5013],
        prerequisites: ["kah-heuristics"],
        concepts: [
          "Several priming studies from Thinking Fast & Slow failed to replicate",
          "Kahneman publicly acknowledged the failures — a model of intellectual honesty",
          "Replication crisis doesn't invalidate the core framework, but demands calibration",
        ],
      },
    ],
  },

  // === Section 10: Business Fundamentals ===
  {
    id: "business",
    title: "Business Fundamentals",
    description: "Strategy, marketing, negotiation — from Godin, Voss, and Thiel",
    icon: "&#127959;",
    color: "#8b5cf6",
    lessons: [
      {
        id: "biz-tactical-empathy",
        sectionId: "business",
        title: "Tactical Empathy",
        description: "Understand feelings to increase influence — without agreeing",
        cards: [3000, 3001, 3007, 3002, 3003, 3004, 3010, 3011, 3012],
        prerequisites: [],
        concepts: [
          "Tactical empathy = understand → label → calibrated questions",
          "Label emotions with 'It seems like...' — never 'I'",
          "Calibrated 'how' questions shift the problem collaboratively",
        ],
      },
      {
        id: "biz-remarkable",
        sectionId: "business",
        title: "Be Remarkable",
        description: "Why safe is risky and remarkable is the only marketing that works",
        cards: [3045, 3040, 3041, 3042, 3043, 3050, 3051],
        prerequisites: [],
        concepts: [
          "Purple Cow: safe is the riskiest strategy",
          "Remarkable = worth making a remark about",
          "Target sneezers (early adopters), not the mass market",
        ],
      },
      {
        id: "biz-ackerman",
        sectionId: "business",
        title: "The Ackerman Model",
        description: "A structured anchoring and concession strategy",
        cards: [3025, 3020, 3021, 3022, 3023, 3024, 3030, 3031],
        prerequisites: ["biz-tactical-empathy"],
        concepts: [
          "65% → 85% → 95% → 100% with decreasing increments",
          "Odd, precise numbers signal calculation, not guessing",
          "Non-monetary item on final offer signals absolute limit",
        ],
      },
      {
        id: "biz-unit-economics",
        sectionId: "business",
        title: "Unit Economics",
        description: "The numbers that tell you if your business model works",
        cards: [3060, 3061, 3062, 3063, 3064, 3065, 3070, 3071],
        prerequisites: [],
        concepts: [
          "CAC = total spend ÷ new customers",
          "LTV = avg revenue × avg lifespan",
          "LTV/CAC > 3x = healthy, < 1x = losing money",
        ],
      },
      {
        id: "biz-why-startups-die",
        sectionId: "business",
        title: "Why Startups Die",
        description: "The empirical data on what actually kills companies",
        cards: [3080, 3081, 3082, 3083, 3084, 3085, 3090],
        prerequisites: ["biz-unit-economics"],
        concepts: [
          "70% ran out of capital (symptom, not cause)",
          "43% no product-market fit (top root cause)",
          "Capital exhaustion is usually the effect, not the cause",
        ],
      },
      {
        id: "biz-wartime-ceo",
        sectionId: "business",
        title: "Wartime vs Peacetime CEO",
        description: "Different situations demand different leadership",
        cards: [3100, 3101, 3102, 3103, 3104, 3110, 3111],
        prerequisites: ["biz-tactical-empathy"],
        concepts: [
          "Peacetime: build and expand. Wartime: cut and survive.",
          "People → Products → Profits (always this order)",
          "Get your head right before making hard decisions",
        ],
      },
    ],
  },
];

// All lessons flattened for easy lookup
export const ALL_LESSONS = SECTIONS.flatMap((s) => s.lessons);

export function getLessonById(id: string) {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getSectionByLessonId(lessonId: string) {
  return SECTIONS.find((s) => s.lessons.some((l) => l.id === lessonId));
}
