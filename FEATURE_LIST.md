# Feature List — Interactive Learning Platform

> Implementation spec for an evidence-based interactive learning platform.
> Not just flashcards — structured learning paths with interactive lessons, diagrams, and spaced review.
> Inspired by Brilliant.org (interactive problem-solving) + Duolingo (gamification + habit) + Anki (spaced repetition).
> Grounded in the Dunlosky meta-analysis (242 studies, 169k participants) and Bjork's desirable difficulties framework.

---

## Vision

```
OLD:  Card → Flip → Rate → Next card (Anki clone)

NEW:  Learning Path → Lesson → Interactive Steps → Spaced Review
      ┌──────────────────────────────────────────────────────┐
      │  Path: "Prediction Markets"                          │
      │  ├── Lesson 1: "Expected Value"                      │
      │  │   ├── Step: Read concept + Excalidraw diagram     │
      │  │   ├── Step: Interactive quiz (drag formula parts)  │
      │  │   ├── Step: "Calculate EV for this contract"       │
      │  │   ├── Step: "Why does this matter?" reflection     │
      │  │   └── Step: Flashcard review (FSRS scheduled)      │
      │  ├── Lesson 2: "Kelly Criterion"                      │
      │  │   └── ...                                          │
      │  └── Lesson 3: "Bayes in Markets" (requires 1 + 2)   │
      └──────────────────────────────────────────────────────┘
```

The app has **two modes** that reinforce each other:
1. **Learn mode** — structured lessons with interactive steps (Brilliant-style)
2. **Review mode** — spaced repetition on cards generated from completed lessons (Anki-style)

---

## Current State (what's already built)

- **Stack**: React + TypeScript + Vite, no backend
- **Algorithm**: SM-2 spaced repetition (classic Anki algorithm)
- **Cards**: 21 software architecture + 40 quant flashcards in `src/data/`
- **Card model**: `{ id, category, front, back, keyPoints[] }`
- **State model**: `{ easeFactor, interval, repetitions, nextReviewDate }` per card
- **Gamification**: XP system (grade-based), levels (quadratic scaling), streak counter
- **Interleaving**: Shuffle within chunks of 4 cards, harder cards first
- **Active recall**: Self-answer textarea on card front, shown alongside correct answer on flip
- **Session**: Max 10 new cards per session, failed cards re-queued
- **Storage**: localStorage
- **Views**: Dashboard → Study → Done

---

## Science-to-Feature Mapping

| Learning Principle | Effect Size | Current | Target |
|---|---|---|---|
| **Spaced repetition** | d=0.56 (high utility) | SM-2 | FSRS + lesson-generated review cards |
| **Active recall** | d=0.56 (high utility) | Self-answer textarea | Interactive steps: fill-blank, ordering, typed answer |
| **Interleaving** | +43% transfer | Chunk-of-4 shuffle | Cross-path interleaving in review mode |
| **Immediate feedback** | Strong moderator | Show answer on flip | Per-step feedback with explanations + diagrams |
| **Desirable difficulties** | Framework | Ease-based ordering | Scaffolded lesson progression, prerequisite gates |
| **Gamification** | +60% commitment | XP + levels + streaks | Streak freeze, daily goals, achievements, heatmap, path progress |
| **Microlearning** | +25-60% retention | Max 10 new/session | 5-min lessons, session timer |
| **Generation** | Desirable difficulty | Self-answer textarea | Build-before-reveal steps, cloze deletion |
| **Elaborative interrogation** | Moderate utility | Not implemented | "Why?" reflection steps within lessons |
| **Dual coding** | Strong for retention | Not implemented | Excalidraw diagrams inline in lessons |
| **Scaffolded progression** | Zone of proximal dev. | Not implemented | Prerequisite-gated lessons within paths |

---

## Data Model

### Core Types

```typescript
// === Learning Paths ===

interface LearningPath {
  id: string;
  title: string;                    // "Prediction Markets"
  description: string;
  icon: string;                     // emoji or SVG identifier
  lessons: string[];                // ordered lesson IDs
  createdAt: string;
}

interface Lesson {
  id: string;
  pathId: string;
  title: string;                    // "Expected Value"
  description: string;
  prerequisites: string[];          // lesson IDs that must be completed first
  steps: Step[];                    // ordered interactive steps
  reviewCards: string[];            // card IDs generated from this lesson
  estimatedMinutes: number;         // e.g. 5
}

// === Interactive Steps (the Brilliant-style core) ===

type Step =
  | ConceptStep                     // read concept + diagram
  | MultipleChoiceStep              // pick the right answer
  | FillBlankStep                   // type missing word/formula
  | OrderingStep                    // drag items into correct order
  | CalculationStep                 // solve a problem, enter number
  | ReflectionStep                  // "why does this matter?" free text
  | FlashcardStep;                  // embedded FSRS review card

interface ConceptStep {
  type: 'concept';
  title: string;
  content: string;                  // markdown with diagrams
  diagrams: Diagram[];              // Excalidraw SVGs
}

interface MultipleChoiceStep {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;              // shown after answering (elaborated feedback)
  diagram?: Diagram;
}

interface FillBlankStep {
  type: 'fill-blank';
  template: string;                 // "EV = (win_prob × {{profit}}) − (loss_prob × {{loss}})"
  blanks: { key: string; answer: string; hint?: string }[];
  explanation: string;
}

interface OrderingStep {
  type: 'ordering';
  question: string;                 // "Order these from highest to lowest utility:"
  items: string[];                  // correct order (shuffled on render)
  explanation: string;
}

interface CalculationStep {
  type: 'calculation';
  question: string;                 // "Contract at $0.40, model says 55%. What's the EV?"
  answer: number;
  tolerance: number;                // acceptable error (e.g. 0.01)
  unit?: string;                    // "$", "%", etc.
  explanation: string;
  diagram?: Diagram;
}

interface ReflectionStep {
  type: 'reflection';
  prompt: string;                   // "Why would 2× Kelly guarantee ruin?"
  minLength?: number;               // optional minimum character count
}

interface FlashcardStep {
  type: 'flashcard';
  cardId: string;                   // reference to a Card for FSRS review
}

// === Diagrams (Excalidraw integration) ===

interface Diagram {
  id: string;
  title: string;
  url: string;                      // R2 URL for rendered SVG/PNG
  excalidrawUrl?: string;           // link to editable .excalidraw source
  caption?: string;
}

// === Cards (enhanced from current) ===

interface Card {
  id: string;
  lessonId?: string;                // which lesson generated this card (null = standalone)
  category: string;
  type: 'basic' | 'cloze';
  front: string;
  back: string;
  keyPoints: string[];
  diagrams: Diagram[];              // inline diagrams on card back
}

interface CardState {
  // FSRS v4.5 state
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  lastReview: string | null;
}

// === Progress & Gamification ===

interface LessonProgress {
  lessonId: string;
  stepsCompleted: number;
  totalSteps: number;
  completedAt: string | null;
  score: number;                    // 0-1, % of steps answered correctly first try
}

interface PathProgress {
  pathId: string;
  lessonsCompleted: number;
  totalLessons: number;
  currentLessonId: string | null;
}
```

### Full App State

```typescript
interface AppState {
  // Learning paths
  paths: Record<string, LearningPath>;
  lessons: Record<string, Lesson>;
  pathProgress: Record<string, PathProgress>;
  lessonProgress: Record<string, LessonProgress>;

  // Flashcards (review mode)
  cards: Record<string, CardState>;
  decks: Record<string, Deck>;

  // Gamification
  stats: Stats;
  achievements: Achievement[];
  reviewLog: ReviewLogEntry[];
  heatmap: Record<string, number>;

  // Settings
  settings: Settings;
}

interface Stats {
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  freezesAvailable: number;
  totalReviews: number;
  totalLessonsCompleted: number;
  xp: number;
}

interface Settings {
  targetRetention: number;          // FSRS: 0.9 default
  dailyGoal: number;                // cards/steps per day, default 10
  sessionTimeTarget: number;        // minutes, default 5
  showConfidencePrompt: boolean;
  showElaborationPrompt: boolean;
  interleaveDecks: boolean;
  preferredMode: 'learn' | 'review' | 'both';
}
```

---

## Implementation Priorities

### P0 — Learning Path Engine (the core differentiator)

#### 1. Learning Path & Lesson System
**Science**: Scaffolded progression keeps learners in the zone of proximal development. Brilliant's problem-first, visual approach produces deeper understanding than passive video.
**What to build**:
- Path/Lesson/Step data model (see types above)
- Lesson renderer: steps displayed one at a time, sequential progression
- Step components for each type (concept, multiple-choice, fill-blank, ordering, calculation, reflection, flashcard)
- Prerequisite gate: lesson locked until prerequisites completed (shown greyed out with lock icon)
- Lesson completion: all steps answered → lesson marked complete → unlock next
- XP awarded per step (more for harder step types)
- **Path view**: visual progress showing completed/current/locked lessons (vertical list with progress indicators, not a complex skill tree)

#### 2. Interactive Step Components
**Science**: Active engagement (generation, testing, elaboration) dramatically outperforms passive reading. Each step type maps to a learning principle.
**What to build**:

| Step Type | Component | Learning Principle |
|---|---|---|
| `concept` | Markdown renderer + inline diagram display | Dual coding (text + visual) |
| `multiple-choice` | Options with tap-to-select, green/red feedback, explanation reveal | Practice testing + immediate feedback |
| `fill-blank` | Input fields inline in template text, validate on submit | Generation effect |
| `ordering` | Drag-and-drop list (touch-friendly), validate order | Active recall + discrimination |
| `calculation` | Number input with unit, tolerance-based validation | Generation + elaboration |
| `reflection` | Textarea, no grading, stored for personal review | Elaborative interrogation |
| `flashcard` | Existing StudyCard component, FSRS-scheduled | Spaced repetition |

- After each non-reflection step: show explanation + diagram (elaborated feedback)
- Correct first try → full XP. Incorrect → show explanation → retry → half XP
- Step progress bar at top of lesson view

#### 3. Excalidraw Diagram Integration
**Science**: Dual coding theory — combining verbal and visual information produces stronger memory traces than either alone.
**What to build**:
- Diagram component: renders SVG/PNG from URL, with caption
- Tap to expand fullscreen (pinch-to-zoom on mobile)
- Diagrams stored as static files (SVG exported from Excalidraw)
- For v1: diagrams bundled in `public/diagrams/` as SVG files
- For v2: diagrams served from Cloudflare R2 via Workers API
- Diagram referenced by URL in step/card data
- Support multiple diagrams per step (swipeable carousel on mobile)

#### 4. Upgrade SM-2 to FSRS v4.5
**Science**: FSRS outperforms SM-2 in 91.9% of cases, 20-30% fewer reviews for same retention.
**What to build**:
- Replace `src/lib/sm2.ts` with FSRS implementation
- Use `ts-fsrs` package from npm (`open-spaced-repetition/ts-fsrs`)
- CardState model: `{ stability, difficulty, elapsedDays, scheduledDays, reps, lapses, state, lastReview }`
- Target retention parameter: default 0.9 (configurable in settings)
- Show predicted next review interval on each rating button
- **Migration**: convert existing SM-2 state → FSRS state on first load

---

### P1 — Gamification & Motivation System

#### 5. Enhanced Streak System (Duolingo model)
**Science**: Streaks increase commitment by 60%. Users with 7-day streaks are 3.6x more likely to stay engaged.
**What to build**:
- **Streak freeze**: 1 free freeze stored (earned after 7-day streak), protects streak for 1 missed day
- **Streak milestones**: visual celebration at 7, 30, 100, 365 days
- **Streak recovery**: if broken within 1 day, offer to restore for spending XP
- Streak counter always visible in header (both learn and review modes)

#### 6. Daily Goals & Session Targets
**Science**: Microlearning modules under 10 min hit 89% completion rate.
**What to build**:
- Configurable daily goal: steps + cards combined (default: 10) or time (default: 5 min)
- Session timer visible during study (non-intrusive, top corner)
- Goal completion animation on done screen
- "Keep going" option after goal reached
- Daily goal progress ring on dashboard

#### 7. Activity Heatmap
**Science**: Progress visualization reinforces habit formation.
**What to build**:
- GitHub-style contribution heatmap on dashboard (last 90 days)
- Color intensity = steps completed + cards reviewed that day
- CSS grid: 13 columns (weeks) × 7 rows (days)
- Tooltip on hover showing date and count

#### 8. Achievements / Badges
**Science**: Users earning badges are 30% more likely to finish a course.
**What to build**:
- Achievement system:
  - **First Steps**: complete first lesson
  - **Path Finder**: complete first learning path
  - **Week Warrior**: 7-day streak
  - **Century**: 100 total reviews
  - **Perfect Lesson**: all steps correct first try
  - **Speed Demon**: complete a lesson in under 3 minutes
  - **Deck Builder**: create 10 custom cards
  - **Deep Recall**: card right after 30+ day interval
  - **Scholar**: complete all lessons in a path
  - **Dual Coder**: view 50 diagrams during lessons
- Toast notification on unlock

---

### P2 — Enhanced Learning Mechanics

#### 9. Auto-Generated Review Cards from Lessons
**Science**: Practice testing is highest-utility. Lessons teach, cards retain.
**What to build**:
- Each lesson defines `reviewCards[]`: cards that enter FSRS review after lesson completion
- Cards auto-added to review queue when lesson is finished
- Cards reference back to lesson (tap "Review lesson" from card)
- Ensures learn mode feeds review mode automatically

#### 10. Confidence Calibration
**Science**: Metacognition — students systematically overestimate their knowledge.
**What to build**:
- Before interactive steps: "How confident are you?" (Low/Medium/High)
- Track calibration over time: `{ predicted, actual }[]`
- Dashboard stat: "Calibration accuracy" percentage

#### 11. Cloze Deletion Cards
**Science**: Generation effect — producing answers from partial cues beats recognition.
**What to build**:
- Card type `'cloze'`: `"The {{c1::CAP theorem}} forces a choice between..."`
- Parse `{{c1::answer}}` syntax, show blanks on front
- Multiple clozes per card (c1, c2, c3)
- Usable in both standalone cards and lesson flashcard steps

#### 12. Review Statistics Dashboard
**Science**: Feedback on learning patterns.
**What to build**:
- New "Stats" view:
  - Cards reviewed per day (bar chart, 30 days)
  - Lessons completed per week
  - Retention rate over time
  - Cards by FSRS state
  - Hardest cards (lowest stability)
  - Path completion progress
- Lightweight CSS/SVG charts, no library

#### 13. Keyboard Shortcuts
- Space: flip card / advance step
- 1/2/3/4: rate or select option
- Enter: submit answer / start study
- Escape: back to dashboard

---

### P3 — Content Pipeline & Backend

#### 14. Cloudflare D1 + Workers API
**Why**: Move from localStorage to a real backend so content can be added from anywhere.
**What to build**:
- D1 tables: `paths`, `lessons`, `steps`, `cards`, `diagrams`, `user_state`
- Workers API: CRUD endpoints for all entities
- App fetches content from API at runtime
- User state syncs to D1 (with localStorage as offline fallback)
- Auth: simple API key for writes, public reads

#### 15. Cloudflare R2 for Diagrams
**Why**: Excalidraw exports need to be served as static files.
**What to build**:
- R2 bucket: `learning-diagrams`
- Upload pipeline: Excalidraw → export SVG → upload to R2
- Workers route serves diagrams with caching headers
- Diagram URL pattern: `https://your-worker.dev/diagrams/{id}.svg`

#### 16. Vault → Learning Content Pipeline
**Why**: Research in the vault should automatically feed the learning platform.
**What to build**:
- Script/agent reads vault notes → extracts concepts → generates lesson steps + cards
- Excalidraw files in vault → export SVG → upload to R2
- Push to D1 via Workers API
- Claude Code remote trigger option: scheduled agent runs weekly

#### 17. Multi-Deck Support & Card Editor
**What to build**:
- Deck data structure for organizing standalone cards outside of paths
- Card editor: add/edit/delete cards
- Import from JSON, CSV, markdown
- Deck selector on dashboard

#### 18. PWA / Offline Support
**What to build**:
- Service worker for offline access
- `manifest.json` for install-to-homescreen
- Offline queue: sync user state when back online

---

## Architecture

### File structure (target)

```
src/
├── App.tsx                         # Router: home | path | lesson | review | stats | editor
├── main.tsx
├── index.css
├── types.ts                        # All type definitions (see Data Model above)
│
├── components/
│   ├── home/
│   │   ├── HomePage.tsx            # Dashboard: paths, review due, streak, heatmap
│   │   ├── PathCard.tsx            # Path preview with progress bar
│   │   ├── Heatmap.tsx             # Activity heatmap
│   │   └── DailyGoal.tsx           # Progress ring
│   │
│   ├── path/
│   │   ├── PathView.tsx            # Lesson list with prerequisites, progress
│   │   └── LessonCard.tsx          # Lesson preview (locked/available/complete)
│   │
│   ├── lesson/
│   │   ├── LessonView.tsx          # Step-by-step lesson runner
│   │   ├── steps/
│   │   │   ├── ConceptStep.tsx     # Markdown + diagrams
│   │   │   ├── MultipleChoice.tsx  # Tap-to-select options
│   │   │   ├── FillBlank.tsx       # Inline input fields
│   │   │   ├── Ordering.tsx        # Drag-and-drop list
│   │   │   ├── Calculation.tsx     # Number input + validation
│   │   │   ├── Reflection.tsx      # Free text prompt
│   │   │   └── FlashcardStep.tsx   # Embedded FSRS card
│   │   ├── StepFeedback.tsx        # Correct/incorrect + explanation
│   │   └── DiagramViewer.tsx       # SVG render, tap-to-expand, zoom
│   │
│   ├── review/
│   │   ├── ReviewSession.tsx       # FSRS card review flow
│   │   ├── StudyCard.tsx           # Card flip, rating buttons (existing, enhanced)
│   │   └── DoneScreen.tsx          # Session summary
│   │
│   ├── stats/
│   │   └── StatsView.tsx           # Charts, retention, hardest cards
│   │
│   └── shared/
│       ├── Header.tsx              # Streak, XP, nav
│       ├── AchievementToast.tsx    # Unlock notification
│       └── MarkdownRenderer.tsx    # Render markdown content in steps
│
├── hooks/
│   ├── useFlashcards.ts            # Review mode state
│   ├── useLearningPath.ts          # NEW: path/lesson navigation + progress
│   ├── useLessonRunner.ts          # NEW: step-by-step lesson execution
│   ├── useAchievements.ts          # NEW: achievement tracking
│   └── useReviewLog.ts             # NEW: append-only review history
│
├── lib/
│   ├── fsrs.ts                     # FSRS algorithm (or ts-fsrs package)
│   ├── storage.ts                  # localStorage abstraction (+ future D1 sync)
│   ├── achievements.ts             # Achievement definitions and unlock logic
│   └── importers.ts                # JSON/CSV/markdown import parsers
│
└── data/
    ├── cards.ts                    # Software architecture deck (21 cards)
    ├── quant-cards.ts              # Quant/prediction markets deck (40 cards)
    └── paths/                      # NEW: learning path definitions
        ├── prediction-markets.ts   # Path: lessons + steps + cards
        └── software-architecture.ts
```

### Key dependencies

```json
{
  "ts-fsrs": "^4.5.0",
  "marked": "^15.0.0"
}
```

No charting libraries, no drag-and-drop libraries (use native HTML drag events + touch events), no UI frameworks beyond React. Keep the bundle small.

### Design constraints

- Dark mode (#070b0d background), Outfit font — already established
- Mobile-first, 480px max-width — already established
- Lesson steps: full-width cards, one step visible at a time, swipe or button to advance
- Diagrams: max-width 100%, maintain aspect ratio, tap to fullscreen
- Animations: step transitions (slide left), feedback (green flash / red shake), diagram expand (scale up)
- No backend for v1 — all localStorage + static data files
- v2: Cloudflare D1 + R2 + Workers

### Navigation flow

```
┌──────────────────────────────────────────┐
│                 HOME                      │
│  ┌────────────┐  ┌─────────────────────┐ │
│  │ Learn      │  │ Review              │ │
│  │ [Paths]    │  │ [12 cards due]      │ │
│  │ ▸ Quant    │  │ [Start Review →]    │ │
│  │ ▸ Arch     │  │                     │ │
│  └─────┬──────┘  └──────────┬──────────┘ │
│        │                    │             │
│  ┌─────▾──────┐  ┌──────────▾──────────┐ │
│  │ PATH VIEW  │  │ REVIEW SESSION      │ │
│  │ Lesson 1 ✓ │  │ Card → Flip → Rate  │ │
│  │ Lesson 2 ● │  │ → Next → ... → Done │ │
│  │ Lesson 3 🔒│  └─────────────────────┘ │
│  └─────┬──────┘                           │
│        │                                  │
│  ┌─────▾──────────────────────────────┐  │
│  │ LESSON VIEW                         │  │
│  │ Step 1/6: [Concept + Diagram]       │  │
│  │ Step 2/6: [Multiple Choice]         │  │
│  │ Step 3/6: [Calculate EV]            │  │
│  │ Step 4/6: [Fill in Kelly formula]   │  │
│  │ Step 5/6: [Reflection: why?]        │  │
│  │ Step 6/6: [Flashcard review]        │  │
│  │ → Lesson Complete! +45 XP           │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## Example Content: Prediction Markets Path

To show how the data model works in practice:

```typescript
const predictionMarketsPath: LearningPath = {
  id: "pm",
  title: "Prediction Markets",
  description: "From probability basics to autonomous trading agents",
  icon: "📊",
  lessons: ["pm-ev", "pm-kelly", "pm-bayes", "pm-validation", "pm-strategies", "pm-infrastructure", "pm-sentiment", "pm-quantum"],
  createdAt: "2026-04-13",
};

// Example lesson with interactive steps
const evLesson: Lesson = {
  id: "pm-ev",
  pathId: "pm",
  title: "Expected Value",
  description: "The single most important formula in prediction markets",
  prerequisites: [],  // first lesson, no prerequisites
  estimatedMinutes: 5,
  steps: [
    {
      type: "concept",
      title: "Why most traders lose",
      content: "87% of prediction market traders lose money. The #1 reason: they enter trades with negative expected value...",
      diagrams: [{ id: "ev-diagram", title: "EV Decision Tree", url: "/diagrams/ev-tree.svg" }],
    },
    {
      type: "fill-blank",
      template: "EV = ({{win_prob}} × profit) − ({{loss_prob}} × loss)",
      blanks: [
        { key: "win_prob", answer: "win_prob", hint: "probability of winning" },
        { key: "loss_prob", answer: "loss_prob", hint: "probability of losing" },
      ],
      explanation: "EV sums probability-weighted outcomes. Positive EV = worth entering. Negative EV = guaranteed long-term loss.",
    },
    {
      type: "calculation",
      question: "A contract costs $0.40. Your model says 55% chance of YES. What's the EV?",
      answer: 0.15,
      tolerance: 0.02,
      unit: "$",
      explanation: "EV = (0.55 × $0.60) − (0.45 × $0.40) = $0.33 − $0.18 = $0.15. Positive → enter.",
      diagram: { id: "ev-calc", title: "EV Calculation", url: "/diagrams/ev-calc.svg" },
    },
    {
      type: "multiple-choice",
      question: "What's the #1 property that predicts long-term survival in prediction markets?",
      options: [
        "High win rate (>80%)",
        "Positive EV on every single entry",
        "Large position sizes",
        "Fast execution speed",
      ],
      correctIndex: 1,
      explanation: "Win rate is a trap (a 77% win rate at $0.77 barely breaks even). EV > 0 on every entry is the only universal survival condition.",
    },
    {
      type: "reflection",
      prompt: "Think of a recent decision (not trading). How would you estimate its expected value? What was the probability of success and the payoff?",
    },
  ],
  reviewCards: ["pm-ev-1", "pm-ev-2"],  // cards auto-added to FSRS review after completion
};
```

---

## Research Sources

- Dunlosky et al. (2013). "Improving Students' Learning With Effective Learning Techniques" — [PubMed](https://pubmed.ncbi.nlm.nih.gov/26173288/)
- Frontiers meta-analysis (2021). "A Meta-Analysis of Ten Learning Techniques" — [Frontiers](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full)
- Bjork & Bjork (2011). "Creating Desirable Difficulties to Enhance Learning" — [UCLA](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf)
- FSRS algorithm — [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs), [FSRS explained](https://studycardsai.com/blog/anki-fsrs-algorithm)
- Duolingo gamification — [Orizon](https://www.orizon.co/blog/duolingos-gamification-secrets), [StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo), [Trophy](https://trophy.so/blog/duolingo-gamification-case-study)
- Brilliant.org pedagogy — [UX Collective](https://uxdesign.cc/the-key-to-learning-math-and-science-online-is-interactive-play-6ea68ce167fe), [ustwo case study](https://ustwo.com/work/brilliant/)
- Microlearning — [ScienceDirect systematic review](https://www.sciencedirect.com/science/article/pii/S2405844024174440), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6716752/)
- [Research.com: Best Online Learning Platforms 2026](https://research.com/software/best-online-learning-platforms)
- [Scrimba: Best Coding Practice Platforms 2026](https://scrimba.com/articles/best-coding-practice-platforms-and-challenge-websites-in-2026/)
