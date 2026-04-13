export const CARDS = [
  // === DDIA — Data Systems ===
  {
    id: 1,
    category: "DDIA",
    front: "What is the fundamental meta-principle of software architecture?",
    back: "System design is fundamentally about tradeoffs, not best practices.",
    keyPoints: [
      "No universally correct solutions — only decisions that fit specific requirements",
      "Tradeoffs are unavoidable: consistency vs. availability, latency vs. throughput, simplicity vs. flexibility",
      "Making tradeoffs explicit separates architecture from accidental complexity",
    ],
  },
  {
    id: 2,
    category: "DDIA",
    front: "What are the three foundational concerns of data-intensive applications?",
    back: "Reliability, Scalability, and Maintainability — the three axes for evaluating any data system design.",
    keyPoints: [
      "Reliability: works correctly despite faults (fault-tolerant ≠ fault-free)",
      "Scalability: handles growth — not binary, but 'what are our options for coping?'",
      "Maintainability: operability (easy to run), simplicity (easy to understand), evolvability (easy to change)",
    ],
  },
  {
    id: 3,
    category: "DDIA",
    front: "What are the two fundamental strategies for distributing data?",
    back: "Replication (copies for fault tolerance) and Partitioning/Sharding (splitting for write scaling).",
    keyPoints: [
      "Replication: single-leader, multi-leader, or leaderless — each with different consistency tradeoffs",
      "Partitioning: split data so each machine holds a subset — key selection determines query patterns",
      "Usually combined: each partition is replicated across multiple nodes",
    ],
  },
  {
    id: 4,
    category: "DDIA",
    front: "Describe the spectrum of consistency models in distributed systems.",
    back: "Consistency ranges from eventual (weakest, cheapest) to linearizable (strongest, most expensive).",
    keyPoints: [
      "Eventual: replicas converge eventually, no timing guarantee — fine for feeds, analytics",
      "Causal: respects causal ordering without global coordination",
      "Linearizable: behaves as if one copy of data, all operations atomic — needed for locks, leader election",
      "Choose the weakest model that preserves correctness for each operation",
    ],
  },
  {
    id: 5,
    category: "DDIA",
    front: "How do transaction isolation levels relate to the correctness-concurrency tradeoff?",
    back: "Stronger isolation prevents more anomalies but costs more performance. The spectrum: Read Committed → Snapshot Isolation → Serializable.",
    keyPoints: [
      "Read Committed: prevents dirty reads/writes, not read skew",
      "Snapshot Isolation (MVCC): consistent snapshot per transaction, but misses write skew",
      "Serializable: equivalent to serial execution — via actual serial, 2PL (pessimistic), or SSI (optimistic)",
      "Write skew is the sneaky bug that only serializability prevents",
    ],
  },

  // === Distributed Systems Theory ===
  {
    id: 6,
    category: "Distributed Systems",
    front: "What does the CAP theorem actually say?",
    back: "During a network partition, a distributed system must choose between Consistency and Availability. Partitions are inevitable, so the real choice is CP vs. AP.",
    keyPoints: [
      "CP: returns errors during partitions rather than stale data (HBase, MongoDB majority reads)",
      "AP: stays available during partitions but may return stale data (Cassandra, DynamoDB)",
      "It's not 'pick 2 of 3' — it's 'during a partition, sacrifice C or A'",
      "CAP says nothing about normal operation — that's where PACELC matters",
    ],
  },
  {
    id: 7,
    category: "Distributed Systems",
    front: "How does PACELC extend the CAP theorem?",
    back: "PACELC adds: even without partitions (Else), there's a tradeoff between Latency and Consistency. This matters more day-to-day than CAP.",
    keyPoints: [
      "PA/EL (Cassandra): available during partitions, low-latency normally — weak consistency",
      "PC/EC (sync RDBMS): consistent always, pays latency cost",
      "Google Spanner achieves PC/EC via GPS-synchronized TrueTime clocks (~7ms commit wait)",
      "The right question: 'what consistency-latency tradeoff during normal operation?'",
    ],
  },
  {
    id: 8,
    category: "Distributed Systems",
    front: "What problem do consensus algorithms solve, and how does Raft work?",
    back: "Consensus gets multiple nodes to agree on a value despite failures. Raft decomposes this into leader election + log replication.",
    keyPoints: [
      "Raft: leader elected by majority vote after randomized election timeout (150-300ms)",
      "Leader accepts writes, replicates log to followers, commits after majority acknowledgment",
      "A 2f+1 cluster tolerates f failures (5 nodes → 2 can fail)",
      "Used by: etcd, Consul, TiKV, CockroachDB, Kafka metadata",
    ],
  },

  // === Architectural Patterns ===
  {
    id: 9,
    category: "Architecture",
    front: "What is a bounded context, and why does it matter for microservices?",
    back: "A boundary within which a particular domain model is defined. Bounded contexts are the natural unit of microservice decomposition — split by business domain, not technical layers.",
    keyPoints: [
      "The word 'Customer' can mean different things in billing vs. shipping — and that's fine",
      "Ubiquitous language: shared vocabulary within a context that maps directly to code",
      "Context mapping defines relationships: shared kernel, anti-corruption layer, etc.",
      "Wrong boundaries → distributed monolith (all the costs, none of the benefits)",
    ],
  },
  {
    id: 10,
    category: "Architecture",
    front: "What is Clean Architecture's Dependency Rule?",
    back: "Source code dependencies must only point inward — inner circles know nothing about outer circles. Domain logic at center, frameworks at edges.",
    keyPoints: [
      "Four layers: Entities → Use Cases → Interface Adapters → Frameworks & Drivers",
      "Ports (interfaces defined by domain) + Adapters (implementations for infrastructure)",
      "Key inversion: the database depends on business logic interfaces, not the reverse",
      "Benefits: framework independence, testability, database flexibility",
    ],
  },
  {
    id: 11,
    category: "Architecture",
    front: "What is a distributed monolith, and why is it the worst outcome?",
    back: "Services that are split into separate deployments but still tightly coupled — all the costs of distributed systems with none of the benefits.",
    keyPoints: [
      "Caused by: shared database schemas, synchronous call chains, shared business logic libraries",
      "The test: can you deploy this service without coordinating with any other team?",
      "Fix: each service owns its data, favor async communication, align with bounded contexts",
      "A well-structured monolith is vastly preferable to a distributed monolith",
    ],
  },
  {
    id: 12,
    category: "Architecture",
    front: "What is event sourcing?",
    back: "Store state as a chronological, append-only sequence of events — not mutable rows. Current state is derived by replaying the event log.",
    keyPoints: [
      "The event log is the source of truth; current state views are derived projections",
      "Advantages: full audit trail, temporal queries, replay for debugging, flexible projections",
      "Challenges: schema evolution, eventual consistency, unbounded log growth, GDPR conflicts",
      "Best for: financial systems, order management, compliance — overkill for simple CRUD",
    ],
  },
  {
    id: 13,
    category: "Architecture",
    front: "What is CQRS, and when should you use it?",
    back: "Command Query Responsibility Segregation: separate models for reading and writing. Commands enforce business rules; queries are denormalized for performance.",
    keyPoints: [
      "Write model: normalized, consistent, enforces rules. Read model: denormalized, eventually consistent, fast",
      "Natural pairing with event sourcing: commands → events → read projections",
      "Enables independent scaling of reads vs. writes",
      "Only worth the complexity when read/write patterns diverge significantly",
    ],
  },
  {
    id: 14,
    category: "Architecture",
    front: "Compare Lambda and Kappa data processing architectures.",
    back: "Lambda runs batch + stream in parallel (accurate but complex). Kappa treats everything as streams (simpler, one codebase). Kappa is winning in 2026.",
    keyPoints: [
      "Lambda: batch layer (accuracy) + speed layer (immediacy) + serving layer (merged view)",
      "Lambda's problem: two codebases that must produce identical results",
      "Kappa: immutable event log as source of truth, reprocess by replaying with new code",
      "2026 trend: Kappa + lakehouse hybrids for analytics and ML",
    ],
  },

  // === Infrastructure ===
  {
    id: 15,
    category: "Infrastructure",
    front: "What are the three fundamental infrastructure primitives for scaling?",
    back: "Load balancers, caches, and CDNs. These solve most scaling problems before you need exotic distributed systems.",
    keyPoints: [
      "Load balancers: L4 (transport) vs. L7 (application) — distribute requests, health-check backends",
      "Caches: Redis/Memcached between app and DB — the single most impactful read optimization",
      "CDNs: geographically distributed cache, often handles 80%+ of requests",
      "They compose: CDN → LB → app → cache → DB. Each layer absorbs load for the next",
    ],
  },
  {
    id: 16,
    category: "Infrastructure",
    front: "How do Postgres, Cassandra, DynamoDB, and Redis embody different architecture tradeoffs?",
    back: "Each database makes specific consistency/latency/scale choices. Often used together, each handling the workload it's suited for.",
    keyPoints: [
      "Postgres: strong consistency, ACID, rich queries — the default unless you have a reason not to",
      "Cassandra: AP/tunable, masterless, LSM trees — write-heavy at massive scale (IoT, time-series)",
      "DynamoDB: managed, auto-scaling, single-digit-ms — serverless, simple access patterns",
      "Redis: sub-ms in-memory — caching, sessions, leaderboards, rate limiting (not primary storage)",
    ],
  },

  // === SRE Operations ===
  {
    id: 17,
    category: "SRE",
    front: "What should SLIs measure, and how do SLIs/SLOs/SLAs relate?",
    back: "SLIs should measure user experience, not internal metrics. SLI (what you measure) → SLO (your target) → SLA (contractual commitment).",
    keyPoints: [
      "Good SLIs: request latency, error rate, availability as perceived by clients",
      "Anti-pattern: CPU/memory as proxy for user happiness — a server at 90% CPU may be fine",
      "SLOs set based on what users need, not what the system can achieve",
      "Multi-window, multi-burn-rate alerting is best practice",
    ],
  },
  {
    id: 18,
    category: "SRE",
    front: "How do error budgets work, and why are they SRE's key innovation?",
    back: "Error budget = 100% minus the SLO. It's a quantitative resource: spent = ship fast, exhausted = freeze and fix reliability. Makes reliability negotiable.",
    keyPoints: [
      "99.9% SLO → 0.1% error budget → ~43 min downtime/month",
      "Budget exhausted → freeze non-critical releases until recovery",
      "Unused budget means the team could be shipping faster",
      "Aligns incentives: product teams and ops teams share the same number",
    ],
  },
  {
    id: 19,
    category: "SRE",
    front: "What is 'toil' in SRE, and why does it matter?",
    back: "Toil is operational work that is manual, repetitive, automatable, tactical, devoid of enduring value, and scales linearly with service size.",
    keyPoints: [
      "The test: if the work doubles when the service doubles, it's toil",
      "Google target: SREs spend ≤50% on toil, ≥50% on engineering to reduce future toil",
      "Toil crowds out engineering work — creates a death spiral if unchecked",
      "Not all ops work is toil: on-call (strategic), postmortems (learning) are not toil",
    ],
  },
  {
    id: 20,
    category: "SRE",
    front: "Why does Google SRE treat incident management as a practiced discipline?",
    back: "Structured roles (IC, Ops Lead, Comms Lead), runbooks, and communication cadence beat heroic ad-hoc firefighting. Design the process before the incident.",
    keyPoints: [
      "Incident Commander coordinates — doesn't debug. Delegates technical work",
      "Severity levels pre-defined by user/revenue/data impact — no debate during incidents",
      "Runbooks: tested procedures for known failure modes. 3am on-call shouldn't be inventing",
      "Complete loop: SLIs detect → error budgets quantify → incidents resolve → postmortems prevent",
    ],
  },
  {
    id: 21,
    category: "SRE",
    front: "What makes a postmortem 'blameless,' and why does it matter?",
    back: "Blameless postmortems assume everyone acted in good faith with available information. Focus on fixing the system, not punishing individuals. Blame drives hiding; learning drives improvement.",
    keyPoints: [
      "Trigger ≠ root cause: a deploy may trigger an outage, but the root cause is missing canary analysis",
      "Required: impact summary, timeline, root causes, action items with owners and deadlines",
      "Originated in healthcare/aviation where blame culture is literally fatal",
      "Organizational benefit: faster incident reporting, more honest sharing, actual learning",
    ],
  },
];
