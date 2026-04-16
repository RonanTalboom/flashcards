import type { Card } from "../types";

// === DDIA Glossary — Designing Data-Intensive Applications (Kleppmann, 2017) ===
// IDs start at 6000 to avoid conflicts with existing decks

export const DDIA_GLOSSARY_CARDS: Card[] = [
  // ================================================================
  // KEY DISTINCTIONS — test understanding, not just recall
  // ================================================================

  // 1. Fault vs Failure
  {
    id: 6000,
    category: "DDIA",
    front: "What is the difference between a fault and a failure?",
    back: "A fault is when one component of the system deviates from its spec. A failure is when the system as a whole stops providing the required service to the user. Faults are causes; failures are effects.",
    keyPoints: [
      "Fault = single component deviation from spec (a hard disk dies, a process crashes)",
      "Failure = the whole system stops working from the user's perspective",
      "Goal: build fault-tolerant systems that prevent faults from causing failures",
      "You can't eliminate all faults — you design to tolerate them",
      "Source: Kleppmann, DDIA Ch. 1",
    ],
    exerciseType: "mcq",
    choices: [
      "A fault is a user-facing outage; a failure is an internal error",
      "A fault is a component deviation from spec; a failure is when the whole system stops providing service",
      "A fault is a software bug; a failure is a hardware problem",
      "They are synonyms — both mean the system is down",
    ],
    correctAnswer: 1,
  },

  // 2. Linearizability vs Serializability
  {
    id: 6001,
    category: "DDIA",
    front:
      "What is the difference between linearizability and serializability?",
    back: "Linearizability is a consistency model for single operations on single objects — every read returns the most recent write. Serializability is an isolation level for transactions involving multiple objects — transactions appear to execute in some serial order. They are independent properties.",
    keyPoints: [
      "Linearizability: recency guarantee on individual reads/writes (consistency model)",
      "Serializability: transactions appear to execute one at a time (isolation level)",
      "They are independent — you can have one without the other",
      "Strict serializability (= serializable + linearizable) gives you both",
      "Source: Kleppmann, DDIA Ch. 7 and Ch. 9",
    ],
    exerciseType: "mcq",
    choices: [
      "Linearizability means transactions execute serially; serializability means reads return the latest write",
      "Linearizability is a recency guarantee on single objects; serializability is a transaction isolation level for multiple objects",
      "Linearizability is stronger than serializability in all cases",
      "Serializability is about single-object consistency; linearizability is about multi-object transactions",
    ],
    correctAnswer: 1,
  },

  // 3. System of record vs Derived data
  {
    id: 6002,
    category: "DDIA",
    front:
      "What is the difference between a system of record and derived data?",
    back: "A system of record (source of truth) holds the authoritative version of the data — it can't be recreated from other sources. Derived data is computed or transformed from other data and can always be rebuilt if lost.",
    keyPoints: [
      "System of record: authoritative, normalized, can't be rebuilt from elsewhere",
      "Derived data: caches, indexes, materialized views — always rebuildable",
      "If you lose derived data, you rebuild it. If you lose the system of record, you've lost data.",
      "The same data can be a system of record in one context and derived in another",
      "Source: Kleppmann, DDIA Ch. 3 and Ch. 11",
    ],
    exerciseType: "mcq",
    choices: [
      "System of record is the database; derived data is the application cache",
      "System of record is authoritative and can't be rebuilt; derived data is computed from other data and can always be rebuilt",
      "System of record is read-optimized; derived data is write-optimized",
      "System of record uses SQL; derived data uses NoSQL",
    ],
    correctAnswer: 1,
  },

  // 4. Concurrent vs Simultaneous
  {
    id: 6003,
    category: "DDIA",
    front:
      "In DDIA, what does 'concurrent' mean, and how does it differ from 'simultaneous'?",
    back: "Two operations are concurrent if neither knew about the other — they may be minutes apart in wall-clock time. Simultaneous means happening at the same physical instant. Concurrency is about knowledge, not time.",
    keyPoints: [
      "Concurrent: neither operation could have seen the result of the other",
      "Simultaneous: same physical time instant — a much stricter condition",
      "Two operations 5 minutes apart can still be concurrent if neither knew about the other",
      "This definition is essential for conflict resolution in replicated systems",
      "Source: Kleppmann, DDIA Ch. 5",
    ],
    exerciseType: "mcq",
    choices: [
      "Concurrent and simultaneous mean the same thing — happening at the same time",
      "Concurrent means running on multiple CPU cores; simultaneous means running on one core with time-slicing",
      "Concurrent means neither operation knew about the other (regardless of timing); simultaneous means same physical instant",
      "Concurrent means fast; simultaneous means parallel",
    ],
    correctAnswer: 2,
  },

  // 5. Command vs Event
  {
    id: 6004,
    category: "DDIA",
    front: "What is the difference between a command and an event?",
    back: "A command is a request that may be rejected or fail — 'please do X.' An event is an immutable fact that has already happened — 'X happened.' Commands are imperative; events are declarative records of what occurred.",
    keyPoints: [
      "Command: a request directed at a system — can be accepted or rejected",
      "Event: an immutable record of something that already occurred — cannot be undone",
      "Commands are validated and may fail; events are facts written to the log",
      "Event sourcing turns commands into events after validation",
      "Source: Kleppmann, DDIA Ch. 11",
    ],
    exerciseType: "mcq",
    choices: [
      "A command writes to the database; an event reads from the database",
      "A command is synchronous; an event is asynchronous",
      "A command is a request that can fail; an event is an immutable fact that already happened",
      "A command is from the user; an event is from the system",
    ],
    correctAnswer: 2,
  },

  // 6. Fault tolerance vs Fault prevention
  {
    id: 6005,
    category: "DDIA",
    front:
      "Why does DDIA emphasize fault tolerance over fault prevention?",
    back: "Faults are inevitable — hardware fails, software has bugs, operators make mistakes. You design for fault tolerance (handling faults gracefully) rather than fault prevention (trying to eliminate all faults), because prevention alone can never achieve 100% uptime.",
    keyPoints: [
      "Faults in hardware, software, and human operation are inevitable",
      "Fault prevention is necessary but insufficient — you can't prevent everything",
      "Fault tolerance means the system continues operating correctly despite faults",
      "Netflix's Chaos Monkey deliberately injects faults to test tolerance",
      "Source: Kleppmann, DDIA Ch. 1",
    ],
  },

  // 7. Schema-on-write vs Schema-on-read
  {
    id: 6006,
    category: "DDIA",
    front:
      "What is the difference between schema-on-write and schema-on-read?",
    back: "Both approaches have a schema. Schema-on-write (relational) enforces the schema at write time — data must conform before it's stored. Schema-on-read (document/NoSQL) enforces the schema at read time — the data is stored as-is and interpreted when queried.",
    keyPoints: [
      "Schema-on-write: explicit schema enforced on every write (like static typing)",
      "Schema-on-read: implicit schema assumed by the reader (like dynamic typing)",
      "Neither is 'schemaless' — the schema always exists, the question is when it's enforced",
      "Schema-on-read is advantageous when items don't all have the same structure",
      "Source: Kleppmann, DDIA Ch. 2",
    ],
    exerciseType: "mcq",
    choices: [
      "Schema-on-write has a schema; schema-on-read is schemaless",
      "Schema-on-write enforces structure at write time; schema-on-read enforces structure at read time — both have schemas",
      "Schema-on-write is SQL; schema-on-read is any NoSQL database",
      "Schema-on-write is slower; schema-on-read is faster",
    ],
    correctAnswer: 1,
  },

  // 8. ACID C vs CAP C vs Replication C
  {
    id: 6007,
    category: "DDIA",
    front:
      "Kleppmann identifies three different meanings of 'consistency.' What are they?",
    back: "ACID Consistency = application-level invariants hold (e.g., credits equal debits). CAP Consistency = linearizability (every read returns the most recent write). Replication Consistency = all replicas agree on the same data. Three totally different concepts sharing one word.",
    keyPoints: [
      "ACID C: application invariants (this is the app's responsibility, not the DB's)",
      "CAP C: linearizability — a specific consistency model",
      "Replication C: eventual consistency, read-your-writes, etc. — replica agreement",
      "Kleppmann argues the overloaded term causes widespread confusion",
      "Source: Kleppmann, DDIA Ch. 7 and Ch. 9",
    ],
    exerciseType: "mcq",
    choices: [
      "They all mean the same thing: data is correct and up to date",
      "ACID C = data durability, CAP C = data availability, Replication C = data partitioning",
      "ACID C = application invariants, CAP C = linearizability, Replication C = replica agreement",
      "ACID C = linearizability, CAP C = application invariants, Replication C = durability",
    ],
    correctAnswer: 2,
  },

  // ================================================================
  // CORE DEFINITIONS
  // ================================================================

  // 9. Distributed system
  {
    id: 6008,
    category: "DDIA",
    front: "What is a distributed system, and why distribute at all?",
    back: "A distributed system consists of components on networked computers that communicate by message passing. You distribute for three reasons: scalability (handle more load), fault tolerance (survive node failures), and latency (put data closer to users).",
    keyPoints: [
      "Components communicate via messages over a network — no shared memory",
      "Scalability: spread load across many machines",
      "Fault tolerance: continue operating when individual nodes fail",
      "Latency: serve users from geographically closer nodes",
      "Distribution adds complexity — only distribute when you have a reason",
    ],
  },

  // 10. Replication
  {
    id: 6009,
    category: "DDIA",
    front: "What is replication, and what does it buy you?",
    back: "Replication is keeping copies of the same data on multiple nodes. It provides fault tolerance (data survives node failures), read scaling (spread read load), and reduced latency (serve reads from nearby replicas).",
    keyPoints: [
      "Every node holds a full copy of the dataset (or a partition's data)",
      "Leader-based, multi-leader, and leaderless are the three replication models",
      "The hard part: keeping replicas consistent as data changes",
      "Tradeoff: stronger consistency guarantees cost more latency",
      "Source: Kleppmann, DDIA Ch. 5",
    ],
  },

  // 11. Partitioning (sharding)
  {
    id: 6010,
    category: "DDIA",
    front: "What is partitioning (sharding), and how does it differ from replication?",
    back: "Partitioning splits data across nodes so each node holds a subset. Replication copies the same data to multiple nodes. Partitioning enables write scaling and larger datasets; replication enables fault tolerance and read scaling. They are typically combined.",
    keyPoints: [
      "Each partition is a subset of the total data — no overlap between partitions",
      "Enables horizontal write scaling: each partition handles its own writes",
      "Key-range and hash-based are the two main partitioning strategies",
      "Hot spots occur when partitioning is uneven (e.g., celebrity user)",
      "Source: Kleppmann, DDIA Ch. 6",
    ],
  },

  // 12. Quorum
  {
    id: 6011,
    category: "DDIA",
    front:
      "What is a quorum in a distributed system? What formula ensures read-write overlap?",
    back: "A quorum is the minimum number of nodes that must participate for a read or write to be valid. The formula w + r > n ensures that the set of nodes written to and the set read from always overlap, guaranteeing you see the latest write.",
    keyPoints: [
      "n = total replicas, w = write quorum, r = read quorum",
      "w + r > n guarantees at least one node in the read set has the latest write",
      "Common config: n=3, w=2, r=2 — tolerates 1 node failure",
      "Quorum doesn't guarantee linearizability — only overlap",
      "Source: Kleppmann, DDIA Ch. 5",
    ],
    exerciseType: "fill-blank",
    correctAnswer: "w + r > n",
  },

  // 13. Consensus
  {
    id: 6012,
    category: "DDIA",
    front: "What is consensus in a distributed system, and why is it hard?",
    back: "Consensus is getting multiple nodes to agree on a value. It's hard because nodes can crash, messages can be lost or delayed, and there's no global clock. Consensus is fundamental to leader election, distributed locks, and atomic commit.",
    keyPoints: [
      "Equivalent problems: leader election, atomic commit, total order broadcast",
      "FLP impossibility: no deterministic algorithm solves consensus in an async system with even one crash",
      "Practical algorithms (Raft, Paxos) work by using timeouts and randomization",
      "Requires a majority (2f+1 nodes to tolerate f failures)",
      "Source: Kleppmann, DDIA Ch. 9",
    ],
  },

  // 14. Idempotency
  {
    id: 6013,
    category: "DDIA",
    front: "What is idempotency, and why is it critical in distributed systems?",
    back: "An idempotent operation produces the same result no matter how many times it's executed. This is critical because networks are unreliable — if a request times out, you don't know if it was processed, so you must be able to safely retry.",
    keyPoints: [
      "f(f(x)) = f(x) — applying the operation twice has the same effect as once",
      "HTTP GET and PUT are idempotent by design; POST is not",
      "Essential for retry safety in unreliable networks",
      "Deduplication tokens / idempotency keys are a common implementation",
      "Source: Kleppmann, DDIA Ch. 11",
    ],
  },

  // 15. CAP theorem
  {
    id: 6014,
    category: "DDIA",
    front: "What does the CAP theorem actually say, and what is Kleppmann's criticism?",
    back: "CAP says: during a network partition, you must choose between consistency (linearizability) and availability. Kleppmann argues CAP has limited practical value because partitions are rare, 'consistency' and 'availability' have narrow formal definitions, and the real tradeoffs are about latency vs consistency in normal operation.",
    keyPoints: [
      "C = linearizability (not just 'correct'), A = every request gets a response",
      "P (partition tolerance) is not optional — partitions happen",
      "CAP only applies during partitions — says nothing about normal operation",
      "Kleppmann: 'CAP has been widely misunderstood and is best avoided'",
      "PACELC is a more useful framework",
    ],
  },

  // 16. PACELC
  {
    id: 6015,
    category: "DDIA",
    front: "What is PACELC, and how does it improve on CAP?",
    back: "PACELC: during a Partition, choose Availability or Consistency; Else (normal operation), choose Latency or Consistency. It extends CAP by acknowledging that the latency-consistency tradeoff exists even when the network is healthy.",
    keyPoints: [
      "PA/PC: partition behavior (same as CAP)",
      "EL/EC: normal-operation tradeoff (the part CAP misses)",
      "Example: Dynamo is PA/EL (available + low latency), Spanner is PC/EC (consistent always)",
      "Most real-world decisions are in the 'Else' branch, not the partition branch",
    ],
  },

  // 17. Event sourcing
  {
    id: 6016,
    category: "DDIA",
    front: "What is event sourcing?",
    back: "Event sourcing stores state as an immutable, append-only log of events rather than mutable current values. Current state is derived by replaying the event log from the beginning. This gives you a complete audit trail and the ability to reconstruct state at any point in time.",
    keyPoints: [
      "The event log is the system of record; current state is derived data",
      "Events are immutable — you never update or delete them",
      "Replaying the log from scratch rebuilds current state (like replaying a git history)",
      "Enables temporal queries: 'what was the state on March 1?'",
      "Source: Kleppmann, DDIA Ch. 11",
    ],
  },

  // 18. CQRS
  {
    id: 6017,
    category: "DDIA",
    front: "What is CQRS, and why separate reads from writes?",
    back: "Command Query Responsibility Segregation (CQRS) uses separate models for writes (commands) and reads (queries). This lets you optimize each independently — the write model for consistency and validation, the read model for query performance.",
    keyPoints: [
      "Write side: handles commands, enforces invariants, appends events",
      "Read side: denormalized views optimized for specific query patterns",
      "Read models are derived data — can always be rebuilt from the event log",
      "Adds complexity: eventual consistency between write and read sides",
      "Source: Kleppmann, DDIA Ch. 11 and Ch. 12",
    ],
  },

  // ================================================================
  // STORAGE & PROCESSING
  // ================================================================

  // 19. B-tree vs LSM-tree
  {
    id: 6018,
    category: "DDIA",
    front: "What are the tradeoffs between B-trees and LSM-trees?",
    back: "B-trees update data in-place and are optimized for reads — lookups are O(log n) with predictable performance. LSM-trees write sequentially to sorted runs and are optimized for writes — they use sequential I/O but require background compaction. B-trees are the default for OLTP; LSM-trees shine for write-heavy workloads.",
    keyPoints: [
      "B-tree: in-place updates, O(log n) reads, write amplification from page splits",
      "LSM-tree: append-only writes, sequential I/O, read amplification from checking multiple levels",
      "B-tree: predictable read latency. LSM-tree: compaction can cause latency spikes",
      "LSM-tree typically achieves higher write throughput due to sequential I/O",
      "Source: Kleppmann, DDIA Ch. 3",
    ],
    exerciseType: "mcq",
    choices: [
      "B-trees are faster for everything; LSM-trees are just simpler to implement",
      "B-trees use in-place updates and are read-optimized; LSM-trees use sequential I/O and are write-optimized",
      "B-trees are for disk; LSM-trees are for memory",
      "LSM-trees are always better because they use less disk space",
    ],
    correctAnswer: 1,
  },

  // 20. OLTP vs OLAP
  {
    id: 6019,
    category: "DDIA",
    front: "What is the difference between OLTP and OLAP?",
    back: "OLTP (Online Transaction Processing) handles frequent, small, low-latency transactions — user-facing apps. OLAP (Online Analytical Processing) handles complex analytical queries over large datasets — business intelligence and reporting.",
    keyPoints: [
      "OLTP: read/write a few records at a time, indexed by key, user-facing",
      "OLAP: scan millions of rows, aggregate columns, analyst-facing",
      "OLTP uses row-oriented storage; OLAP benefits from column-oriented storage",
      "Data warehouses are OLAP systems fed by ETL from OLTP sources",
      "Source: Kleppmann, DDIA Ch. 3",
    ],
    exerciseType: "mcq",
    choices: [
      "OLTP is for reads; OLAP is for writes",
      "OLTP handles frequent small transactions (user-facing); OLAP handles complex analytical queries (analyst-facing)",
      "OLTP is SQL; OLAP is NoSQL",
      "OLTP is batch processing; OLAP is stream processing",
    ],
    correctAnswer: 1,
  },

  // 21. Lambda vs Kappa architecture
  {
    id: 6020,
    category: "DDIA",
    front:
      "What is the difference between Lambda and Kappa architecture?",
    back: "Lambda architecture runs batch and stream processing in parallel, then merges results. Kappa architecture uses stream processing only — everything is treated as a stream, and batch is just a special case of stream replay. Kappa is simpler and increasingly preferred.",
    keyPoints: [
      "Lambda: batch layer (accurate) + speed layer (fast) + serving layer (merged)",
      "Lambda problem: maintaining two codepaths for the same logic",
      "Kappa: stream-only — reprocess by replaying the log from scratch",
      "Kappa is winning because stream processing has matured (Flink, Kafka Streams)",
      "Source: Kleppmann, DDIA Ch. 11",
    ],
  },

  // 22. Change data capture (CDC)
  {
    id: 6021,
    category: "DDIA",
    front: "What is change data capture (CDC)?",
    back: "CDC observes all changes to a database and emits them as a stream of events. Downstream systems (caches, search indexes, data warehouses) consume this stream to stay in sync — without the application needing to write to multiple systems.",
    keyPoints: [
      "The database's write-ahead log is the source — CDC taps into it",
      "Avoids the dual-write anti-pattern: only one system is written to directly",
      "Debezium (Kafka Connect) is the most common CDC tool",
      "CDC turns the database into an event stream producer",
      "Source: Kleppmann, DDIA Ch. 11",
    ],
  },

  // 23. Dual write (anti-pattern)
  {
    id: 6022,
    category: "DDIA",
    front: "What is the dual-write problem, and how do you solve it?",
    back: "Dual write is the anti-pattern of writing the same data to two systems (e.g., database + search index) from application code. It's prone to race conditions and partial failures — if one write succeeds and the other fails, the systems diverge. Solutions: CDC or event sourcing, where one system is the source of truth and others are derived.",
    keyPoints: [
      "Two writes without a shared transaction = no atomicity guarantee",
      "Race conditions: two concurrent updates can apply in different order to each system",
      "Partial failure: one write succeeds, the other fails — systems permanently diverge",
      "Fix: single source of truth + derived views via CDC or event log",
      "Source: Kleppmann, DDIA Ch. 11",
    ],
  },

  // ================================================================
  // OPERATIONAL
  // ================================================================

  // 24. Split brain
  {
    id: 6023,
    category: "DDIA",
    front: "What is split brain in a distributed system?",
    back: "Split brain occurs when two nodes both believe they are the leader, typically due to a network partition or faulty failure detection. Both accept writes independently, causing conflicting data and potential data loss when the partition heals.",
    keyPoints: [
      "Usually caused by a network partition: each side thinks the other is dead",
      "Both 'leaders' accept writes — no coordination, no conflict detection",
      "When the partition heals, conflicting writes must be reconciled (often with data loss)",
      "Prevention: fencing tokens, quorum-based leader election, STONITH",
      "Source: Kleppmann, DDIA Ch. 8",
    ],
  },

  // 25. Backpressure
  {
    id: 6024,
    category: "DDIA",
    front: "What is backpressure, and why is it important?",
    back: "Backpressure is when a slow consumer signals a fast producer to slow down. Without it, a fast producer overwhelms a slow consumer, leading to unbounded buffer growth and eventual out-of-memory crashes. Backpressure keeps the system stable under load.",
    keyPoints: [
      "Without backpressure: producer fills buffers until the consumer OOMs or drops data",
      "With backpressure: producer slows to the consumer's pace — bounded memory, no data loss",
      "TCP uses backpressure (flow control via window size)",
      "In stream processing: Kafka consumer lag is a form of backpressure signaling",
      "Source: Kleppmann, DDIA Ch. 11",
    ],
  },
];
