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

#### M1. Multiple Choice Questions (MCQ) — **implemented**
**Science**: Practice testing (d=0.56, high-utility) + immediate elaborated feedback. Forces discrimination between confusable options, which is stronger retrieval than free recall alone.
**What's built**:
- `exerciseType: "mcq"` on any `Card`, with `choices: string[]` and `correctAnswer: number` (index of correct option)
- `src/components/MCQCard.tsx`: A/B/C/D options, tap-to-select, green/red feedback, correct option always revealed on answer
- Incorrect first try still shows the correct choice alongside the user's pick (dimmed) plus the card's `back` as elaborated explanation
- `useFlashcards.answerCard(correct)` maps result to SM-2 grade (4 if correct, 1 if incorrect) and awards 10 / 2 XP
- Wired into `App.tsx` exerciseType switch alongside `fill-blank`, `cloze`, and default `flashcard`
- Available in both review mode and lesson mode (lesson correctness counter updated)
**Authoring**: mix MCQ cards freely with flashcard/fill-blank/cloze in the same lesson — exercise type is per-card, so a single lesson can interleave concept recall, recognition, and production.

#### M2. Interactive Widgets — Stats, Math Sliders, Simulators
**Science**: Brilliant-style interactive manipulation produces stronger intuition than passive text. Dual coding (visual + numeric) + generation (moving a slider is a lightweight form of "what if?" generation) + immediate feedback on every frame. Converts abstract formulas into grabbable objects.
**What to build**:
- New `exerciseType: "interactive"` on `Card`, with a `widget` discriminator that names the simulation to render
- Shared `InteractiveCard.tsx` shell: prompt + widget body + "Got it" button; completion is self-rated (no wrong answer, just exploration), awarding fixed XP
- Built-in widget library (pure React, no deps):

| Widget | Sliders | Live Outputs | Learning Goal |
|---|---|---|---|
| `expected-value` | win_prob (0-1), win_payoff ($), loss_payoff ($) | EV = p·win − (1−p)·loss, colored green/red; break-even probability | Quant / prediction markets intuition |
| `kelly` | edge probability, odds | Optimal fraction f* = p − (1−p)/b; growth rate under full / half / double Kelly | Position sizing, why 2× Kelly ruins |
| `compound-growth` | principal, annual rate (%), years | Final value, CAGR table, inline sparkline of growth curve | Exponential vs. linear intuition |
| `availability` | per-node availability (0.9-0.9999), replica count N | P(system up) for parallel replicas (1 − (1−A)ⁿ), expected downtime/year | DDIA redundancy math |
| `binomial` | n trials, success probability p | Probability mass bar chart, mean np, stddev √(np(1−p)) | Practice-testing statistical intuition |
| `latency-percentile` | p50, p99 ratio, fan-out N | Tail amplification: P(any slow) = 1 − (1−p99)ⁿ | Why tail latency dominates |

- Widgets are **data-driven presets** selected by name in the card (`card.widget = "kelly"`), with optional `initial` values overriding defaults
- Each widget: range inputs styled with a custom CSS thumb, numbers update instantly, SVG sparkline/bar chart rendered inline (no chart library)
- Can be placed standalone in a deck or as a step inside a lesson — same `Card` shape, so spaced review / mastery calculations still work (interactive cards count toward lesson completion but never as "wrong")
- Keyboard: ←/→ nudge the focused slider; Enter marks complete

**Why this is additive, not a rebuild**: Interactive cards slot into the existing `exerciseType` switch in `App.tsx` beside `flashcard` / `mcq` / `fill-blank` / `cloze`. No changes to SM-2, storage, or the learning path engine.

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

---

## Language Learning Features (French)

> Extends the app from concept cards to language learning. Designed for French but language-agnostic in implementation. Each feature maps to a learning science principle.

### Gap: concept cards vs language cards

| Dimension | Current (concept cards) | Needed (language cards) |
|---|---|---|
| Card model | `{ front, back, keyPoints[] }` | `{ word, sentence, translation, gender, pronunciation, audio, image, type }` |
| Card types | Basic (front/back) | Vocabulary, sentence, cloze, reverse, listening, conjugation |
| Media | Text only | Audio (TTS/recordings), images |
| Metadata | `category` | `language`, `cefrLevel`, `gender`, `partOfSpeech`, `tags[]` |
| Direction | One-way (Q→A) | Bidirectional (FR→EN recognition + EN→FR production) |
| Grammar | Not applicable | Conjugation tables, agreement rules, cloze patterns |

---

### LP0 — Core Language Card Model

#### L1. Extended Card Types
**Science**: Different card types test different retrieval pathways.
**What to build**:
- Extend `Card` interface with optional language fields: `type`, `gender`, `article`, `pronunciation`, `sentence`, `sentenceTranslation`, `cefrLevel`, `clozeText`
- Type aliases: `CardType = 'basic' | 'vocabulary' | 'cloze'`, `CEFRLevel`, `Gender`
- Card renderer switches layout based on `type`:
  - **vocabulary**: article + word with gender color coding (masculine = blue, feminine = pink), pronunciation (IPA), example sentence, TTS button
  - **cloze**: parse `{{c1::answer}}` syntax, show blanks, typed answer with accent-lenient matching
- Gender color coding: masculine = `--blue`, feminine = `#ec4899`
- Article always shown with noun (never learn "maison", always "la maison")

```typescript
type CardType = 'basic' | 'vocabulary' | 'cloze';
type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
type Gender = 'masculine' | 'feminine';

// Added as optional fields to existing Card interface
interface Card {
  // ... existing fields ...
  type?: CardType;
  deck?: string;
  gender?: Gender;
  article?: string;           // "la", "le", "l'", "un", "une"
  pronunciation?: string;     // IPA: /mɛ.zɔ̃/
  sentence?: string;          // "La maison est grande."
  sentenceTranslation?: string; // "The house is big."
  cefrLevel?: CEFRLevel;
  clozeText?: string;         // "La {{c1::maison}} est grande."
}
```

#### L2. Audio / Text-to-Speech
**Science**: Connecting written and spoken forms strengthens encoding. Listening before reading prevents false pronunciation patterns.
**What to build**:
- `src/lib/tts.ts` — Web Speech API wrapper, zero dependencies
  - `speak(text, lang = 'fr-FR', rate = 1.0)` using `speechSynthesis`
  - `stopSpeaking()` to cancel
- Play button on every card with French text (small speaker icon)
- Auto-play audio on card front for listening cards (audio-only front)
- Playback speed control: 0.75x / 1x / 1.25x
- Future: option to use recorded audio files per card

#### L3. Reverse / Bidirectional Cards
**Science**: Recognition (FR→EN) and production (EN→FR) use different neural pathways. Production is harder but more useful for speaking.
**What to build**:
- Toggle per deck: "Generate reverse cards automatically"
- For each vocabulary card, auto-generate a reverse card:
  - **Recognition**: front = "la maison" → back = "the house"
  - **Production**: front = "the house" → back = "la maison"
- Reverse cards have independent SRS state
- Badge both cards with a link icon so user knows they're paired

#### L4. Cloze Deletion for Grammar
**Science**: Producing the missing word from context forces deeper processing than recognition.
**What to build**:
- `src/components/ClozeCard.tsx` — cloze deletion card component
- Parse `{{c1::answer}}` syntax from `card.clozeText`
- Front: sentence with blank(s) styled as underlines
- Input field for typing answer (integrates AccentKeyboard)
- Accent-lenient comparison: `francais` matches `français` with warning
- Multiple clozes per card: `{{c1::...}}`, `{{c2::...}}`
- Pre-built cloze templates for grammar patterns:
  - Article agreement: `"{{c1::La}} maison est grande"`
  - Verb conjugation: `"Je {{c1::suis}} français"`
  - Passé composé: `"Elle est {{c1::allée}} au cinéma"`

---

### LP1 — Content Organization

#### L5. CEFR Level Tagging & Filtering
**What to build**:
- Every language card tagged with CEFR level (A1-C2)
- Filter by level in study session
- Dashboard shows progress per CEFR level: "A1: 85% learned, A2: 32% learned"
- Visual CEFR badge on each card during review
- Study mode: "Only A1 cards" or "A1 + A2" or "All"

#### L6. Pre-Built French Decks (Starter Content)
**What to build**:
- **A1 Starter Deck**: ~120 cards organized by theme:
  - Greetings & Politeness (15 cards)
  - Numbers & Time (11 cards)
  - Food & Restaurant (15 cards)
  - Family & People (10 cards)
  - Directions & Transport (8 cards)
  - Essential Verbs (16 cards)
  - Essential Phrases & Adjectives (32 cards)
  - Places & Everyday (8 cards)
- Mix of exerciseTypes: flashcard, mcq, fill-blank, cloze
- Card format: vocabulary cards with sentence examples, gender, pronunciation, IPA
- Integrated into learning path as a new "French A1" section with 7 lessons
- IDs starting at 1000 to avoid conflicts
- Future: A2, B1, B2 decks added progressively

#### L7. Thematic Deck Organization
**What to build**:
- French section in learning path with themed lessons (Greetings, Food, Verbs, etc.)
- Cross-lesson study: interleave cards from multiple lessons
- Per-lesson progress: % of cards in "review" or "learned" state

---

### LP2 — Enhanced Study Modes

#### L8. Listening Mode
**Science**: Comprehension requires processing speech at speed.
**What to build**:
- Card type: `listening` — front shows only a play button (no text)
- User listens, types or thinks of the meaning, then flips to see text + translation
- Optional: typed answer comparison (fuzzy match for accents)
- Playback speed selector: slow (0.7x) for beginners, normal for intermediate

#### L9. Conjugation Drill Mode
**What to build**:
- Card type: `conjugation` — shows verb + tense + subject pronoun
- Front: "aller — présent — je" → Back: "vais"
- Drill mode: random pronoun for a given verb+tense
- Pre-built conjugation data for top 50 French verbs × common tenses
- Tenses: présent, passé composé, imparfait, futur simple, conditionnel, subjonctif

#### L10. Typing Answer Mode
**Science**: Typing forces generation, not just recognition.
**What to build**:
- Typing answer toggle (per session or global)
- Answer comparison: exact match, accent-lenient mode, partial match highlighting
- French accent keyboard toolbar: é è ê ë à â ç ù û ô î ï œ æ

#### L11. French Accent Keyboard
**What to build**:
- `src/components/AccentKeyboard.tsx` — compact toolbar
- Buttons for: é è ê ë à â ç ù û ô î ï œ æ
- Tap to insert at cursor position
- Auto-show when input is focused for French cards
- Integrated into FillBlankCard and ClozeCard

---

### LP3 — Content Pipeline

#### L12. AI Card Generation
**What to build**:
- "Generate cards" button in deck editor
- Input: topic, level, count (e.g., "Food vocabulary, A1, 20 cards")
- Uses Claude API to generate vocabulary + sentence cards
- User reviews and edits before adding

#### L13. Sentence Mining Import
**What to build**:
- Paste French text → highlight unknown words → generate cards with context
- Import from subtitle files (.srt)

#### L14. Frequency List Import
**What to build**:
- Built-in French frequency list (top 5000 words)
- One-click "Add next 50 words from frequency list"
- Skips words already in user's decks
- Progress: "You know 1,247 / 5,000 most common French words"

---

### Language Feature Implementation Order

| Priority | Feature | Depends on | Effort |
|---|---|---|---|
| **LP0** | L1. Extended card types | — | M |
| **LP0** | L2. Audio / TTS | — | S |
| **LP0** | L3. Reverse cards | L1 | M |
| **LP0** | L4. Cloze deletion | — | M |
| **LP1** | L5. CEFR tagging | L1 | S |
| **LP1** | L6. French A1 starter deck | L1, L2 | L |
| **LP1** | L7. Thematic organization | L6 | S |
| **LP2** | L8. Listening mode | L2 | M |
| **LP2** | L9. Conjugation drills | L1 | M |
| **LP2** | L10. Typing answer mode | — | M |
| **LP2** | L11. Accent keyboard | L10 | S |
| **LP3** | L12. AI card generation | L1 | L |
| **LP3** | L13. Sentence mining | L1 | L |
| **LP3** | L14. Frequency list import | L6 | M |

**S** = small (~1-2 hours), **M** = medium (~3-5 hours), **L** = large (~8+ hours)

### Language Feature Sources
- [Migaku — Flashcard Best Practices for Language Learning](https://migaku.com/blog/language-fun/flashcard-best-practices-language-learning)
- [Speakada — How to Use Anki for French](https://speakada.com/how-to-use-anki-for-french/)
- [Language Atlas — Best French Anki Decks 2025](https://languageatlas.com/anki/best-french-anki-decks/)
- [Taalhammer — Best Language Learning Apps with Flashcards 2026](https://www.taalhammer.com/best-language-learning-apps-with-flashcards-in-2026-taalhammer-vs-anki-memrise-and-quizlet/)
- [Joy of French — French Flashcard Guide 2026](https://joyoffrench.com/french-flashcards/)

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
