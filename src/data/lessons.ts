import type { Section } from "../types";
import { FINANCE_FUNDAMENTALS_SECTION } from "./finance-fundamentals";
import { BUSINESS_CENTRAL_SUBSCRIPTIONS_SECTION } from "./business-central-subscriptions-path";

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
  // Mirrors the 16-lesson CEFR sequence in flashcards-school
  // (school/curriculum/french-a1.yaml) so both apps share one learning path.
  // Lesson IDs and order match the school yaml exactly.
  {
    id: "french-a1",
    title: "French A1",
    description: "Survival French — 16-lesson CEFR path",
    icon: "&#127467;&#127479;",
    color: "#2563eb",
    lessons: [
      {
        id: "fr-greetings",
        sectionId: "french-a1",
        title: "Salutations et politesse",
        description: "Hello, goodbye, please, thank you — the essentials",
        cards: [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1009, 1010, 1011, 1012, 1013, 1014],
        prerequisites: [],
        concepts: [
          "Bonjour, bonsoir, au revoir, salut",
          "Merci, s'il vous plaît, excusez-moi",
          "Introducing yourself: je m'appelle...",
        ],
      },
      {
        id: "fr-pronouns",
        sectionId: "french-a1",
        title: "Les pronoms personnels",
        description: "Subject pronouns and the tu/vous decision",
        cards: [],
        prerequisites: ["fr-greetings"],
        concepts: [
          "je, tu, il/elle, nous, vous, ils/elles",
          "tu (informal singular) vs vous (formal/plural)",
          "On — the everyday 'we'",
        ],
      },
      {
        id: "fr-articles",
        sectionId: "french-a1",
        title: "Les articles définis et indéfinis",
        description: "le/la/les and un/une/des — gender and number",
        cards: [1036],
        prerequisites: ["fr-pronouns"],
        concepts: [
          "Definite: le, la, l', les",
          "Indefinite: un, une, des",
          "Every noun has a gender — memorise it with the article",
        ],
      },
      {
        id: "fr-numbers",
        sectionId: "french-a1",
        title: "Les nombres et l'heure",
        description: "Counting 1–100 and telling the time",
        cards: [1015, 1016, 1017, 1018, 1019, 1025],
        prerequisites: ["fr-articles"],
        concepts: [
          "Numbers 1–100 (including 70, 80, 90 — the tricky ones)",
          "Quelle heure est-il ? — telling the time",
        ],
      },
      {
        id: "fr-er-verbs",
        sectionId: "french-a1",
        title: "Les verbes en -er au présent",
        description: "Regular -er conjugation: parler, manger, habiter…",
        cards: [1063, 1064, 1069, 1070, 1071],
        prerequisites: ["fr-pronouns"],
        concepts: [
          "-e, -es, -e, -ons, -ez, -ent endings",
          "70 % of French verbs follow this pattern",
          "Spelling tweaks: manger → nous mangeons",
        ],
      },
      {
        id: "fr-etre-avoir",
        sectionId: "french-a1",
        title: "Être et avoir",
        description: "The two indispensable irregular verbs",
        cards: [1059, 1060, 1072],
        prerequisites: ["fr-er-verbs"],
        concepts: [
          "être — je suis, tu es, il est, nous sommes, vous êtes, ils sont",
          "avoir — j'ai, tu as, il a, nous avons, vous avez, ils ont",
          "avoir for age: j'ai 30 ans (not je suis)",
        ],
      },
      {
        id: "fr-adjectives",
        sectionId: "french-a1",
        title: "Les adjectifs et leurs accords",
        description: "Adjective agreement in gender and number",
        cards: [1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098],
        prerequisites: ["fr-etre-avoir"],
        concepts: [
          "Add -e for feminine, -s for plural",
          "Irregular pairs: beau/belle, vieux/vieille, nouveau/nouvelle",
          "Most adjectives follow the noun (a few precede it)",
        ],
      },
      {
        id: "fr-negation",
        sectionId: "french-a1",
        title: "La négation",
        description: "ne … pas and its everyday variants",
        cards: [1074, 1075, 1080, 1086, 1087],
        prerequisites: ["fr-etre-avoir"],
        concepts: [
          "ne … pas wraps the verb",
          "Spoken French often drops 'ne'",
          "ne … jamais / plus / rien",
        ],
      },
      {
        id: "fr-days-weather",
        sectionId: "french-a1",
        title: "Les jours, mois, et la météo",
        description: "Days, months, and talking about the weather",
        cards: [1021, 1022, 1023, 1024],
        prerequisites: ["fr-numbers"],
        concepts: [
          "Days lundi–dimanche, months janvier–décembre",
          "aujourd'hui / demain / hier",
          "il fait beau / il pleut / il neige",
        ],
      },
      {
        id: "fr-family",
        sectionId: "french-a1",
        title: "La famille et les possessifs",
        description: "Family members and possessive adjectives",
        cards: [1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050],
        prerequisites: ["fr-articles"],
        concepts: [
          "père, mère, frère, sœur, fils, fille",
          "Possessives: mon/ma/mes, ton/ta/tes, son/sa/ses",
          "Possessive agrees with the THING owned, not the owner",
        ],
      },
      {
        id: "fr-aller-futur",
        sectionId: "french-a1",
        title: "Aller et le futur proche",
        description: "Aller (to go) and the near-future construction",
        cards: [1061, 1073],
        prerequisites: ["fr-etre-avoir"],
        concepts: [
          "aller — je vais, tu vas, il va, nous allons, vous allez, ils vont",
          "Futur proche: aller + infinitive (je vais manger)",
          "Like English 'going to' — for any imminent action",
        ],
      },
      {
        id: "fr-food",
        sectionId: "french-a1",
        title: "Nourriture et restaurant",
        description: "Ordering food, drinks, and asking for the check",
        cards: [1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1037, 1038, 1039, 1040],
        prerequisites: ["fr-articles", "fr-etre-avoir"],
        concepts: [
          "Common food vocabulary with gender (le/la)",
          "Ordering: je voudrais…, s'il vous plaît",
          "Asking for the check: l'addition",
        ],
      },
      {
        id: "fr-shopping",
        sectionId: "french-a1",
        title: "Faire les courses",
        description: "Shopping vocabulary, prices, quantities",
        cards: [1078, 1079, 1101, 1102, 1104],
        prerequisites: ["fr-numbers", "fr-food"],
        concepts: [
          "Combien ça coûte ? / C'est combien ?",
          "le supermarché, la boulangerie, la pharmacie",
          "j'ai besoin de…",
        ],
      },
      {
        id: "fr-questions",
        sectionId: "french-a1",
        title: "Poser des questions",
        description: "Three ways to ask questions: intonation, est-ce que, inversion",
        cards: [1008, 1020, 1076, 1083, 1085],
        prerequisites: ["fr-etre-avoir", "fr-er-verbs"],
        concepts: [
          "Intonation (informal): Tu parles français ?",
          "est-ce que (neutral): Est-ce que tu parles français ?",
          "Inversion (formal): Parlez-vous français ?",
          "Question words: qui, quoi, où, quand, comment, pourquoi, combien",
        ],
      },
      {
        id: "fr-daily-routine",
        sectionId: "french-a1",
        title: "La vie quotidienne et les verbes pronominaux",
        description: "Daily routine and reflexive verbs (se laver, se lever…)",
        cards: [1062, 1065, 1066, 1067, 1068, 1082, 1084, 1089],
        prerequisites: ["fr-er-verbs", "fr-negation"],
        concepts: [
          "Reflexive pronouns: me, te, se, nous, vous, se",
          "se lever, se coucher, se laver, s'habiller",
          "Daily-routine verbs: faire, boire, comprendre, vouloir, pouvoir",
        ],
      },
      {
        id: "fr-places-directions",
        sectionId: "french-a1",
        title: "Lieux et directions",
        description: "Places around town and getting around",
        cards: [1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1077, 1081, 1088, 1099, 1100, 1103, 1105, 1106],
        prerequisites: ["fr-numbers", "fr-articles"],
        concepts: [
          "Où est… ? — asking for locations",
          "à gauche, à droite, tout droit, près de, loin de",
          "la maison, le restaurant, le travail, l'hôpital, la gare, le métro",
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

  // === Section: Polymarket Trading Discipline ===
  {
    id: "polymarket-discipline",
    title: "Polymarket Trading Discipline",
    description: "Anti-patterns from killed affiliate theses + where solo edge actually lives",
    icon: "&#127919;",
    color: "#f56565",
    lessons: [
      {
        id: "pm-bot-redflags",
        sectionId: "polymarket-discipline",
        title: "Bot-Pitch Red Flags",
        description:
          "How to kill a promotional bot thread before paper-trading it",
        cards: [7040, 7041, 7042, 7043, 7044, 7045, 7046],
        prerequisites: [],
        concepts: [
          "Affiliate threads overstate wallet PnL by 2–5× vs leaderboard ground truth",
          "Polymarket ?r= referral codes signal material undisclosed incentive",
          "Markov persistence on 5-min crypto fails because returns have 7–9 steps of memory",
          "Kelly f* > 0.5 signals overconfident probability estimation; Thorp's default is 0.5×",
          "1.80% taker fee at 50¢ midpoint + 0.3% median spread = structurally negative delta-neutral arb",
          "2.7-second arb windows + 73% sub-100ms HFT capture — TypeScript/Workers cannot compete",
          "The 92.4% loss rate is survivor-math; conditioning on discipline flips the base rate",
        ],
      },
      {
        id: "pm-solo-edge",
        sectionId: "polymarket-discipline",
        title: "What Solo Edge Actually Looks Like",
        description:
          "The paths left open — and why the existing repo + tracker don't fit execution",
        cards: [7047, 7048, 7049, 7050, 7051],
        prerequisites: ["pm-bot-redflags"],
        concepts: [
          "Documented solo edge: information + patience + tail-liquidity + closing-line-value",
          "The polymarket-pipeline is 713 LOC of lead tracker; execution = new repo, ~5–10K LOC",
          "Thesis tracker measures Brier; bot tracker measures Sharpe/drawdown/capacity — different disciplines",
          "The 10-thesis gate prevents premature optimisation of unproven edge",
          "Five-check pre-research kill heuristic for promotional bot threads",
        ],
      },
    ],
  },

  // === Section: Austrian Deflationism ===
  {
    id: "austrian-deflationism",
    title: "Austrian Deflationism",
    description:
      "The scale-conflation critique + mainstream counter-mechanisms from the \"Number Go Down\" research",
    icon: "&#128181;",
    color: "#38a169",
    lessons: [
      {
        id: "austrian-scale-conflation",
        sectionId: "austrian-deflationism",
        title: "The Scale-Conflation Core",
        description:
          "Why micro productivity deflation does not entail macro price-level deflation being benign",
        cards: [7052, 7053, 7054, 7055, 7056, 7057, 7058],
        prerequisites: [],
        concepts: [
          "Specific goods deflating under competition ≠ aggregate price level deflation being benign",
          "Fisher-Bernanke debt-deflation: nominal debt + aggregate deflation = mechanical creditor wealth transfer",
          "Krugman ZLB: expected deflation raises real rates even at nominal zero — asymmetric monetary offset",
          "Downward nominal wage rigidity is rational (reference-point psychology), not institutional fragility",
          "Classic Moore's Law broke ~2005 with the end of Dennard scaling; single-thread gains now 10–15%/year",
          "Wright's Law generalises: costs fall 10–25% per cumulative-production doubling across 60+ technologies",
          "Koo balance-sheet recession: Japan post-1995 is a third category — debt-overhang without credit crunch",
        ],
      },
      {
        id: "austrian-historical-record",
        sectionId: "austrian-deflationism",
        title: "Historical Record & Steelman",
        description:
          "What the empirical record actually shows — and Selgin's rigorous version of the argument",
        cards: [7059, 7060, 7061, 7062, 7063],
        prerequisites: ["austrian-scale-conflation"],
        concepts: [
          "The canonical 1873–96 \"good deflation\" had regional losers (German real wages fell) and was politically hated",
          "Atkeson-Kehoe inversion: the 1930s exception is precisely the regime sound money cannot structurally prevent",
          "Selgin's productivity norm (Less Than Zero, 1997) is the rigorous steelman — targets stable NGDP, not stable prices",
          "Paradox of Thrift: fails as a universal law, survives as ZLB-conditioned rational response to deflation expectations",
          "Cantillon effects: mainstream concedes existence, disputes magnitude — post-1971 productivity growth is the empirical pushback",
        ],
      },
    ],
  },

  // === Section: AI Engineering — Finetuning & Serving ===
  {
    id: "finetuning",
    title: "Finetuning & Serving",
    description: "SFT, LoRA/QLoRA, RLHF, GRPO, and production inference",
    icon: "&#129504;",
    color: "#9f7aea",
    lessons: [
      {
        id: "ft-pipeline",
        sectionId: "finetuning",
        title: "Training Pipeline & SFT",
        description:
          "What SFT actually does, where reasoning really comes from, and how finetuning forgets",
        cards: [7000, 7001, 7002, 7003, 7004],
        prerequisites: [],
        concepts: [
          "LIMA: 1K curated examples unlock instruction-following; superficial-alignment partially walked back",
          "Reasoning emerges in RL, not SFT — SFT seeds the distribution",
          "Loss masking trains on assistant tokens only",
          "Catastrophic forgetting scales with model size in 1B-7B range",
          "Chat templates are a training-time semantic contract — mismatch fails silently",
        ],
      },
      {
        id: "ft-peft",
        sectionId: "finetuning",
        title: "LoRA & QLoRA",
        description:
          "Low-rank adaptation, NF4 quantization, and when PEFT breaks down",
        cards: [7010, 7011, 7012, 7013, 7014, 7015],
        prerequisites: ["ft-pipeline"],
        concepts: [
          "Low-intrinsic-rank hypothesis fails on coding and math",
          "NF4 is optimal only under a Gaussian prior that real weights violate",
          "RSLoRA's alpha/sqrt(r) decouples LR from rank",
          "DoRA decomposes into magnitude + direction with zero inference cost",
          "LoRA forgets less than full-FT — capacity constraint as feature",
        ],
      },
      {
        id: "ft-alignment",
        sectionId: "finetuning",
        title: "Alignment Algorithms",
        description:
          "PPO, DPO, KTO, GRPO, and the reward-hacking scaling law",
        cards: [7020, 7021, 7022, 7023, 7024, 7025, 7026],
        prerequisites: ["ft-pipeline"],
        concepts: [
          "DPO is a closed-form reward model — simple but inherits length bias",
          "GRPO eliminates the critic via group-relative baselines (~50% compute vs PPO)",
          "DeepSeek-R1's AIME jump credits the full recipe, not GRPO alone",
          "Reward-model overoptimization follows a power law; KL does not fully contain it",
          "Online (PPO) beats offline (DPO) on code/STEM; data composition dominates both",
          "Constitutional AI complements RLHF, not replaces",
        ],
      },
      {
        id: "ft-serving",
        sectionId: "finetuning",
        title: "Inference Serving",
        description:
          "PagedAttention, continuous batching, prefill-decode disaggregation, and quantization tradeoffs",
        cards: [7030, 7031, 7032, 7033, 7034, 7035, 7036, 7037],
        prerequisites: ["ft-pipeline"],
        concepts: [
          "Prefill is compute-bound; decode is memory-bandwidth-bound — the root of every serving optimization",
          "PagedAttention cuts fragmentation 60-80% → <4% but pays 20-26% kernel overhead",
          "Continuous batching: 23-37x throughput, head-of-line blocking blows p99 tail latency",
          "Prefill-decode disaggregation wins only under the right workload shape",
          "Speculative decoding collapses at long contexts and batch sizes over 32",
          "4-bit weight quantization hurts reasoning ~4x more than easy tasks",
        ],
      },
    ],
  },

  // === Section: LLM Papers — Foundations (2017-2023) ===
  {
    id: "llm-papers",
    title: "LLM Papers — Foundations",
    description: "The foundational 2017-2023 LLM research papers: architecture, scaling, alignment, techniques — with red-team counter-claims and a deliberate gap card flagging what this list misses for 2026.",
    icon: "&#128218;",
    color: "#60a5fa",
    lessons: [
      {
        id: "papers-architecture",
        sectionId: "llm-papers",
        title: "Architecture foundations",
        description: "Transformer, BERT, GPT-3, LLaMA, FlashAttention — with videos by Yannic Kilcher and Stanford MLSys.",
        cards: [7100, 7101, 7102, 7103, 7104, 7105, 7106, 7107, 7108, 7109, 7110, 7111, 7113, 7114],
        prerequisites: [],
        concepts: [
          "Self-attention replaced recurrence; O(n²) time and space is its central constraint",
          "BERT: MLM is load-bearing, NSP was ceremonial (RoBERTa ablation)",
          "GPT-3 demonstrated in-context few-shot learning; scaling is brittle to prompt format",
          "LLaMA: data quality + scale, not architectural breakthrough; RMSNorm + SwiGLU + RoPE",
          "FlashAttention: IO-aware tiling + log-sum-exp; exact not approximate",
        ],
      },
      {
        id: "papers-scaling-alignment",
        sectionId: "llm-papers",
        title: "Scaling + Alignment",
        description: "Kaplan scaling laws (historically wrong), Chinchilla correction (still imperfect), InstructGPT RLHF recipe, LoRA with its Biderman counter-claim, DPO with its production reality check.",
        cards: [7120, 7121, 7123, 7124, 7126, 7127, 7128, 7130, 7131, 7133, 7134],
        prerequisites: ["papers-architecture"],
        concepts: [
          "Kaplan (2020): asymmetric allocation — systematically wrong by ~5×",
          "Chinchilla (2022): ~20 tokens/param — Epoch AI can't replicate the ratio exactly; frontier labs train with fewer",
          "InstructGPT SFT→RM→PPO: legacy at the frontier; DPO / GRPO / CAI superseded it",
          "LoRA: matches full-FT on style tasks, underperforms on math/code (Biderman 2024)",
          "DPO: simpler and more stable; PPO variants still dominate production reasoning",
        ],
      },
      {
        id: "papers-techniques-gaps",
        sectionId: "llm-papers",
        title: "Techniques + 2026 Gaps",
        description: "CoT and RAG (both dated in important ways) — then the deliberate gap card flagging MoE, reasoning models, tool use, multimodal, Constitutional AI, speculative decoding as the 6+ classes of paper missing from the original list.",
        cards: [7140, 7141, 7142, 7143, 7144, 7150],
        prerequisites: ["papers-architecture"],
        concepts: [
          "CoT prompting: emerges at ~100B+ scale; Turpin 2023 shows steps are often post-hoc rationalizations",
          "RAG 2020 architecture is dated; evergreen lesson is 'separate parametric from non-parametric memory'",
          "The 12-paper list itself is a 2023-frozen X-thread — missing MoE, reasoning models, tool use, multimodal, CAI, speculative decoding",
        ],
      },
    ],
  },

  // === Section: Avoidance Loop — stop dreaming big and doing nothing ===
  {
    id: "avoidance-loop",
    title: "Avoidance Loop",
    description:
      "Pychyl's emotion-regulation framework for procrastination — mechanism, disguises, and concrete interrupts. Applied to actual Ronan-shaped patterns.",
    icon: "&#128126;",
    color: "#f59e0b",
    lessons: [
      {
        id: "avoid-mechanism",
        sectionId: "avoidance-loop",
        title: "The mechanism",
        description:
          "Why procrastination is emotion regulation, not time management — the four-stage loop, the amygdala hijack, TMT, and the dread-vs-doing gap.",
        cards: [7200, 7201, 7202, 7203, 7204],
        prerequisites: [],
        concepts: [
          "Procrastination is emotion regulation, not time management (Pychyl)",
          "Four-stage loop: hard task → negative emotion → avoidance → relief (which reinforces)",
          "Amygdala hijack — the threat system overrides the dorsal ACC action system",
          "Each cycle physically strengthens the procrastination circuit; discipline atrophies",
          "TMT: M = (E × V) / (I × D) — every intervention targets one of the four variables",
        ],
      },
      {
        id: "avoid-practice",
        sectionId: "avoidance-loop",
        title: "Breaking the loop in practice",
        description:
          "The two-step interrupt, implementation intentions, the two disguises (perfectionism + productive procrastination), self-compassion, and one applied case on thesis #1.",
        cards: [7205, 7206, 7207, 7208, 7209, 7210, 7211],
        prerequisites: ["avoid-mechanism"],
        concepts: [
          "Two-step interrupt: name the emotion, then shrink the first step until dread can't gate it",
          "Implementation intentions (Gollwitzer d ≈ 0.65) delegate starting to an environmental cue",
          "Perfectionism inflates predicted failure cost — output drops even at constant effort",
          "Productive procrastination swaps the scary task for a safer one that still feels like work",
          "You're avoiding a predicted feeling your brain almost always gets wrong — not the task",
          "Self-compassion after a slip reduces future procrastination; self-blame feeds the loop",
          "Applied: thesis #1 avoidance is productive procrastination with a perfectionism trigger",
        ],
      },
    ],
  },

  // === Section 11: Finance Fundamentals (imported) ===
  // Source: src/data/finance-fundamentals.ts; cards in src/data/finance-cards.ts (8000-series)
  // Path note: learning/Finance Fundamentals — Learning Path.md
  FINANCE_FUNDAMENTALS_SECTION,

  // === Section 12: Business Central Subscriptions (imported) ===
  // Source: src/data/business-central-subscriptions-path.ts
  // Cards: src/data/business-central-subscriptions-cards.ts (9200-9349)
  // Path note: learning/Business Central Subscriptions — Learning Path.md
  // Source brief: learning/Business Central Subscriptions — Source Material.md
  BUSINESS_CENTRAL_SUBSCRIPTIONS_SECTION,
];

// All lessons flattened for easy lookup
export const ALL_LESSONS = SECTIONS.flatMap((s) => s.lessons);

export function getLessonById(id: string) {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getSectionByLessonId(lessonId: string) {
  return SECTIONS.find((s) => s.lessons.some((l) => l.id === lessonId));
}
