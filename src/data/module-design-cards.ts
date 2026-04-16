import type { Card } from "../types";

// === Module Design & Complexity Management ===
// Sources: Ousterhout (A Philosophy of Software Design, 2018), Parnas (1972), Matt Pocock (2026)
// IDs start at 4000 to avoid conflicts with business cards (3000+)

export const MODULE_DESIGN_CARDS: Card[] = [
  // ================================================================
  // LESSON: Module Design (arch-module-design)
  // ================================================================

  // Deep modules: core definition
  {
    id: 4000,
    category: "Architecture",
    front:
      "What is the difference between a deep module and a shallow module?",
    back: "A deep module provides powerful functionality behind a simple interface. A shallow module has a complex interface relative to the functionality it provides. Module depth = implementation complexity / interface complexity.",
    keyPoints: [
      "Deep: simple interface, complex implementation — hides complexity from users",
      "Shallow: complex interface, little functionality — users pay the cost of the interface without much benefit",
      "The benefit of a module is its functionality; the cost is its interface",
      "Source: Ousterhout, A Philosophy of Software Design (2018)",
    ],
    exerciseType: "mcq",
    choices: [
      "Deep modules have more lines of code than shallow modules",
      "Deep modules provide powerful functionality behind a simple interface; shallow modules expose complex interfaces for little functionality",
      "Deep modules are in lower layers of the stack; shallow modules are in higher layers",
      "Deep modules use inheritance; shallow modules use composition",
    ],
    correctAnswer: 1,
  },

  // Unix file I/O example
  {
    id: 4001,
    category: "Architecture",
    front:
      "Why is Unix file I/O considered the canonical example of a deep module?",
    back: "Five functions (open, close, read, write, lseek) hide tens of thousands of lines of implementation — file representation, directory mapping, permissions, concurrent access, caching, and device drivers.",
    keyPoints: [
      "Interface: 5 system calls — one of the simplest APIs in computing",
      "Implementation: 10,000+ lines covering storage, caching, permissions, device drivers",
      "Ratio of implementation to interface is enormous — maximum depth",
      "Contrast: Java's FileInputStream/BufferedInputStream chain — shallow wrappers that leak complexity",
    ],
    exerciseType: "fill-blank",
    correctAnswer: "five",
  },

  // Information hiding principle
  {
    id: 4002,
    category: "Architecture",
    front:
      "What is Parnas's information hiding principle, and why does Ousterhout consider it the most important technique for creating deep modules?",
    back: "Each module should encapsulate a design decision that is likely to change, hiding it behind a stable interface. This reduces complexity by simplifying interfaces and minimizing inter-module dependencies.",
    keyPoints: [
      "Parnas (1972): decompose systems around design decisions likely to change",
      "The 'secret' of a module is the design decision it hides",
      "Two benefits: simpler interfaces + fewer dependencies between modules",
      "Ousterhout: information hiding is the single most important technique for deep modules",
    ],
  },

  // Information leakage
  {
    id: 4003,
    category: "Architecture",
    front:
      "What is information leakage, and how does it undermine modularity?",
    back: "Information leakage occurs when a design decision is duplicated or spread across multiple modules, creating coupling. Changing that decision then forces changes everywhere, defeating the purpose of module boundaries.",
    keyPoints: [
      "The opposite of information hiding — design decisions leak across boundaries",
      "Common sources: shared data formats, temporal decomposition, pass-through methods",
      "Modules become decoratively separate but functionally coupled",
      "Fix: identify what the module's 'secret' should be and push leaked knowledge inside",
    ],
    exerciseType: "mcq",
    choices: [
      "When a module's private data is accidentally exposed through a public API",
      "When a design decision is spread across multiple modules, creating coupling",
      "When security credentials leak into version control",
      "When memory is not properly freed after module teardown",
    ],
    correctAnswer: 1,
  },

  // Temporal decomposition
  {
    id: 4004,
    category: "Architecture",
    front:
      "What is temporal decomposition, and why does Ousterhout warn against it?",
    back: "Temporal decomposition splits code by execution order (read → parse → process) rather than by information boundaries. This leaks data structure knowledge across every step, creating tight coupling.",
    keyPoints: [
      "Anti-pattern: organizing modules by 'when' things happen instead of 'what they know'",
      "Each step leaks knowledge of the shared data structure to the next",
      "Fix: group by information — one module owns the data format, not three modules sharing it",
      "Temporal decomposition is one of the most common sources of information leakage",
    ],
    exerciseType: "mcq",
    choices: [
      "Splitting modules based on which team wrote them",
      "Splitting code by execution order (read → parse → process) instead of by information boundaries",
      "Decomposing a monolith into time-boxed sprint deliverables",
      "Breaking a database into temporal partitions for archiving",
    ],
    correctAnswer: 1,
  },

  // Pass-through methods
  {
    id: 4005,
    category: "Architecture",
    front:
      "What is a pass-through method, and why is it an indicator of shallow design?",
    back: "A pass-through method delegates to another method with the same or very similar signature, adding no abstraction. It increases interface complexity without hiding any implementation — making the module shallower.",
    keyPoints: [
      "The method exists purely to relay calls between layers",
      "Adds a name and a call frame but no new abstraction or logic",
      "Signals a layer boundary that isn't earning its keep",
      "Fix: either merge the layers or have the upper layer add meaningful logic",
    ],
  },

  // Interface simplicity > implementation simplicity
  {
    id: 4006,
    category: "Architecture",
    front:
      "According to Ousterhout, should you prioritize interface simplicity or implementation simplicity?",
    back: "Prioritize interface simplicity. It's better to have a complex implementation behind a simple API than a simple implementation behind a complex interface. Complexity related to a module's functionality should be pulled INTO the module.",
    keyPoints: [
      "Simple interface = low cost for every user of the module",
      "Complex implementation = one-time cost for the module author",
      "Pulling complexity inward reduces total system complexity because many consumers share one interface",
      "Generalization often creates deeper modules — abstract APIs are simpler than special-purpose ones",
    ],
    exerciseType: "mcq",
    choices: [
      "Implementation simplicity — simple code is easier to maintain",
      "Interface simplicity — a complex implementation behind a simple API reduces total system complexity",
      "Both equally — they should always be balanced",
      "Neither — complexity should be pushed to configuration files",
    ],
    correctAnswer: 1,
  },

  // Progressive disclosure for AI
  {
    id: 4007,
    category: "Architecture",
    front:
      "How does progressive disclosure of complexity help AI coding agents navigate a codebase?",
    back: "AI agents cold-start every session with no memory. Deep modules with clear interfaces enable a three-step process: orient (see folder structure) → navigate (read public interfaces) → extract (dive into implementation only when needed).",
    keyPoints: [
      "AI agents have no persistent codebase memory — every invocation is a new-starter onboarding",
      "Folder structure reveals services; interfaces explain what they do without reading internals",
      "Same principle that helps human new-starters, with more urgency",
      "Caveat: AI reads 100K tokens/sec — the bottleneck may be understanding invariants, not finding files",
    ],
  },

  // Graybox modules
  {
    id: 4008,
    category: "Architecture",
    front:
      "What is a graybox module, and how does it create a seam for human-AI collaboration?",
    back: "A graybox module is a deep module where you CAN look inside but don't NEED to. The human designs the interface (applying taste and domain judgment), the AI handles implementation, and tests lock down behavior.",
    keyPoints: [
      "Interface = where human judgment is concentrated (design, taste, architecture)",
      "Implementation = what can be delegated to AI (constrained by interface + tests)",
      "Tests provide behavioral contracts the AI must satisfy",
      "Caveat: assumes clean interface/implementation separation — in practice, you often discover the right API through implementation",
    ],
  },
];
