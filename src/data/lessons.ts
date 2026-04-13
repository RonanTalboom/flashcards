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
];

// All lessons flattened for easy lookup
export const ALL_LESSONS = SECTIONS.flatMap((s) => s.lessons);

export function getLessonById(id: string) {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getSectionByLessonId(lessonId: string) {
  return SECTIONS.find((s) => s.lessons.some((l) => l.id === lessonId));
}
