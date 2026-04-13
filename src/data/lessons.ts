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

  // === Section 7: French A1 ===
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
];

// All lessons flattened for easy lookup
export const ALL_LESSONS = SECTIONS.flatMap((s) => s.lessons);

export function getLessonById(id: string) {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getSectionByLessonId(lessonId: string) {
  return SECTIONS.find((s) => s.lessons.some((l) => l.id === lessonId));
}
