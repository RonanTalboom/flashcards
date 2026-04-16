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
  | PretestStep                      // NEW: question BEFORE teaching — productive failure
  | ConceptStep                     // read concept + diagram
  | MultipleChoiceStep              // pick the right answer
  | FillBlankStep                   // type missing word/formula
  | OrderingStep                    // drag items into correct order
  | CalculationStep                 // solve a problem, enter number
  | ReflectionStep                  // "why does this matter?" free text
  | FlashcardStep;                  // embedded FSRS review card

// NEW: Pretest step — tests before teaching (pretesting effect, d=0.35-0.75)
// Framed as "What do you think?" not "Test yourself"
// Wrong answers are expected and celebrated ("Good guess! Here's what actually happens...")
// Must be followed by a ConceptStep that teaches the correct answer
interface PretestStep {
  type: 'pretest';
  question: string;                  // "What do you think happens when..."
  options?: string[];                // optional MCQ format (or free text if absent)
  correctIndex?: number;             // if MCQ
  curiosityHook: string;             // shown after answer: "Interesting! Let's find out..."
  // No XP penalty for wrong answers — this is diagnostic, not assessment
  // Track pretest accuracy for analytics (does pretesting improve lesson scores?)
}

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
| `pretest` | **NEW** — Question before teaching, "What do you think?" framing, no penalty for wrong answers | Pretesting effect (d=0.35-0.75, +10-15% retention) |
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

#### 2.5 Evidence-Based Lesson Flow (NEW — addresses "testing before teaching" problem)
**Science**: The optimal learning sequence combines pretesting (d=0.35-0.75), concept instruction, retrieval practice (d=0.56), and spaced repetition (d=0.56). See vault: [[The optimal learning sequence is pretest then teach then retrieve then space]].

**The problem**: Currently the app shows question → answer for material the user hasn't learned yet. This is a degenerate form of pretesting — it has the "fail" but not the "instruction" that makes failure productive.

**The fix**: Lessons should follow the **Pretest → Teach → Retrieve → Space** flow:

```
┌─────────────────────────────────────────────────────────┐
│  Lesson: "Tactical Empathy"                             │
│                                                         │
│  Step 1: PRETEST                                        │
│  "Your supplier says 'This price is non-negotiable.'    │
│   What would you do?"                                   │
│  → User guesses (wrong answer expected & OK)            │
│  → "Interesting! Let's find out what works..."          │
│                                                         │
│  Step 2: CONCEPT                                        │
│  Tactical empathy explanation + diagram                 │
│  (corrects pretest errors — feedback is essential)      │
│                                                         │
│  Step 3: RETRIEVE (multiple-choice / fill-blank)        │
│  Test the same concept — now they should get it         │
│  → Immediate feedback + explanation                     │
│                                                         │
│  Step 4: RETRIEVE (harder variation)                    │
│  Different scenario, same technique                     │
│  → XP awarded for correct answers                       │
│                                                         │
│  Step 5: REFLECTION                                     │
│  "When would YOU use this technique?"                   │
│                                                         │
│  → Lesson complete! Cards enter FSRS for SPACING        │
└─────────────────────────────────────────────────────────┘
```

**What to build**:
- `PretestStep` component: renders like MCQ but with "What do you think?" header, no penalty for wrong answers, curiosity hook after answering
- Lesson flow validation: if a lesson has a `pretest` step, it must be followed by a `concept` step (feedback is essential for pretesting to work)
- Pretest analytics: track pretest accuracy vs. final retrieval accuracy per lesson (measures whether pretesting actually helps)
- Two lesson templates for content authoring:
  - **Pretest-first** (for scenarios, math, concepts): pretest → concept → retrieve → reflect
  - **Teach-first** (for vocabulary, facts, procedures): concept → retrieve → retrieve harder → reflect
- Visual differentiation: pretest steps use a distinct "curiosity" color (e.g., amber) vs. retrieval steps (green/red)

**Design principles** (from research):
- Pretest = low-stakes curiosity, NOT assessment. No hearts lost, no streak broken.
- Wrong answers are *expected and celebrated*: "Good guess! 73% of people get this wrong the first time."
- Concept step must directly address common pretest errors
- Retrieval steps after concept should retest the same material at increasing difficulty

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

### P1.5 — Research-Informed Engagement Features (New)

> Features selected from competitive analysis of Duolingo, Khan Academy, Brilliant.org, Anki, Memrise, Quizlet, Udemy, and Coursera. Evaluated on a board for impact vs. feasibility in a client-side React SPA.

#### R1. Keyboard Shortcuts
**Source**: Anki power users, Quizlet
**Science**: Reducing friction between intent and action increases session length.
**What to build**:
- Space: flip card / advance step
- 1/2/3/4: rate Again/Hard/Good/Easy
- Enter: start study from dashboard
- Escape: back to dashboard
- useEffect with keydown listener, guard against input focus

#### R2. Session Progress Bar
**Source**: Duolingo (progress bar at top of every lesson)
**Science**: Progress visualization increases completion rate by 20-40%.
**What to build**:
- Thin bar at top of study view showing cards completed / total in session
- CSS transition for smooth fill
- Shows in all study modes (review, lesson, speed review)

#### R3. Answer Streak / Combo Counter
**Source**: Quizlet answer streaks, Duolingo combo counter
**Science**: Variable reward schedules (correct streak → bonus) increase engagement.
**What to build**:
- Track consecutive correct answers (grade >= 3) during session
- Show combo counter with pulse animation when streak >= 3
- Bonus XP at streak milestones (5, 10, 20 correct in a row)
- Reset on incorrect answer with brief "streak broken" indicator

#### R4. Enhanced Streak System (Freeze + Milestones)
**Source**: Duolingo streak freeze, streak society, milestone celebrations
**Science**: Streaks increase commitment by 60%. Users with 7-day streaks are 3.6x more likely to stay engaged. Streak freeze reduces anxiety-driven churn.
**What to build**:
- **Streak freeze**: earn 1 freeze after 7-day streak, auto-protects 1 missed day
- **Streak milestones**: celebration at 7, 30, 100, 365 days
- **Longest streak**: track and display personal best
- **Streak calendar**: visual indicator of active days (part of heatmap)

#### R5. Celebration Animations
**Source**: Duolingo (confetti, sounds, character reactions), Khan Academy (level-up celebrations)
**Science**: Immediate positive reinforcement strengthens habit loops. Dopamine on completion drives return behavior.
**What to build**:
- CSS-only confetti burst on session complete
- Milestone celebration overlay for streak milestones
- "Perfect session" special animation (all correct)
- Smooth fade-in for done screen stats

#### R6. Daily Goal Progress Ring
**Source**: Duolingo daily goal ring, Apple Watch activity rings
**Science**: Micro-goals with visual progress increase daily return rate. 89% completion rate for sessions under 10 min.
**What to build**:
- SVG circular progress ring on dashboard
- Cards reviewed today vs daily goal (default 10, configurable)
- Ring fills with animation as progress increases
- Color changes: grey → accent → green when complete
- "Goal met!" indicator with optional "keep going" prompt

#### R7. Activity Heatmap
**Source**: Anki Review Heatmap add-on, GitHub contribution graph
**Science**: Progress visualization reinforces habit formation. Seeing consistency builds identity ("I'm someone who studies every day").
**What to build**:
- GitHub-style 90-day contribution heatmap on dashboard
- CSS grid: 13 columns (weeks) × 7 rows (days)
- Color intensity = cards reviewed that day (4 levels)
- Tooltip on hover showing date and count
- Data from review log stored in AppState

#### R8. Difficult Cards Mode
**Source**: Memrise "Difficult Words", Anki filtered decks
**Science**: Targeted practice on weak items is 2-3x more efficient than mixed review.
**What to build**:
- Auto-detect difficult cards: easeFactor < 1.8 OR failed 4+ times
- "Practice Difficult" button on dashboard when difficult cards exist
- Creates focused session of only weak cards
- Visual indicator on difficult cards during review (flame icon)

#### R9. Leech Detection
**Source**: Anki leech system
**Science**: Cards failed 8+ times indicate a fundamental misunderstanding that flashcard review alone won't fix.
**What to build**:
- Track failure count per card (lapses field in CardState)
- Flag as leech after 8 failures
- Visual leech indicator during review
- Leech count shown in stats

#### R10. Speed Review Mode
**Source**: Memrise Speed Review, Quizlet Match timer
**Science**: Time pressure activates System 1 processing, strengthening automatic recall pathways.
**What to build**:
- Timed flashcard review: 8-second countdown per card
- Timer bar depletes visually from left to right
- Auto-advance on timeout (counts as "Again" grade)
- 3 lives: lose one on timeout or "Again"
- Game over when lives exhausted, show score
- Cards show front only → must decide correct/incorrect quickly

#### R11. Match Game
**Source**: Quizlet Match
**Science**: Active matching between related concepts strengthens associative memory networks.
**What to build**:
- Grid of 12 tiles (6 front/back pairs from cards)
- Tap two tiles to match front↔back
- Correct match: tiles fade out with green flash
- Incorrect match: tiles shake with red flash, +1s penalty
- Timer tracks completion speed
- Score = time + penalties
- Personal best tracking

#### R12. Quiz / Test Mode
**Source**: Quizlet Test Mode, Khan Academy unit tests
**Science**: Practice testing is the #1 learning technique (d=0.56). Varied question formats test different retrieval pathways.
**What to build**:
- Auto-generate quiz from current deck (10-20 questions)
- Mix of question types:
  - **MCQ**: card front as question, correct back + 3 wrong backs as options
  - **True/False**: card front + random back, user judges if pairing is correct
  - **Typed answer**: card front shown, user types answer, fuzzy-matched
- Score at end with percentage and review of incorrect answers
- Does not affect SRS scheduling

#### R13. Review Statistics Dashboard
**Source**: Anki statistics (reviews graph, retention, intervals, forecast), Khan Academy mastery dashboard
**Science**: Metacognition — students who monitor their own learning patterns show 15-20% higher retention.
**What to build**:
- New "Stats" view accessible from dashboard
- **Cards per day**: 30-day bar chart (CSS/SVG, no library)
- **Retention rate**: percentage of reviews graded Good or Easy
- **Card states**: pie/bar showing new vs learning vs mature
- **Hardest cards**: top 5 lowest easeFactor cards
- **Review forecast**: estimated reviews due in next 7 days
- **Streak history**: longest streak, current streak

---

#### 18. Interactive Explorable Visualizations (Brilliant-style)
**Science**: Direct manipulation of parameters builds mathematical intuition faster than static formulas. Bret Victor's "Explorable Explanations" principle: the reader changes an assumption and instantly sees consequences propagate. Brilliant.org's core pattern — one slider, one visual effect — produces deeper understanding than passive reading.
**Inspiration**: Brilliant.org (guided exploration → synthesis), Desmos (parameter sliders on functions), 3Blue1Brown (animate the process, not the result), Khan Academy (scaffolded interactive exercises).
**Stack**: d3-shape + d3-scale (~12KB gzipped) for math, hand-rolled SVG in React for rendering. Zero-dependency plots driven by React state from range sliders. Mobile-friendly touch via native SVG pointer events.

**Design Principles** (from research):
1. **One degree of freedom at a time** — each slider controls exactly one parameter
2. **Tight feedback loop** — plot updates in <16ms (every frame) as user drags
3. **Concrete before abstract** — explore the visual first, then see the formula
4. **Linked representations** — show equation + graph + numeric output simultaneously
5. **Failure is cheap** — exploration has no penalty, builds confidence before testing

**What to build**:

| Widget | Parameters | Visualization | Learning Goal |
|---|---|---|---|
| **Kelly Criterion Curve** | Win probability, payout ratio | Growth rate curve, optimal fraction marker, ruin zone | Feel why 2x Kelly guarantees ruin |
| **EV Calculator** | Contract price, model probability | EV bar crossing zero, profit/loss regions | Intuition for when to enter/exit |
| **Bayes Updater** | Prior probability, likelihood ratio | Probability bar shifting, prior→posterior animation | Feel how evidence strength affects updates |
| **Brier Score Curve** | Forecast probability | Parabolic penalty for outcome=1 and outcome=0 | Understand calibration penalty structure |
| **VPIN Gauge** | Buy volume, sell volume | Semicircular gauge with danger zone at 0.70 | Instant recognition of toxic flow |

**Interactive Card Integration**:
- New `exerciseType: "interactive"` with `plotType` field
- Card front shows a guiding question (e.g., "What happens to the Kelly fraction as payout increases?")
- User explores via sliders, sees real-time plot updates
- Card back shows the key insight with formula
- Self-rated (Again/Hard/Good/Easy) like flashcards — rates understanding, not correctness
- Integrated into lessons alongside flashcards and math practice cards

**Component Architecture**:
```typescript
interface InteractivePlotProps {
  width: number;
  height: number;
}

// Each plot is a standalone React component:
// KellyCurvePlot, EVCalculatorPlot, BayesUpdaterPlot, BrierScorePlot, VPINGaugePlot
// All use: SVG viewBox for responsive sizing, CSS custom properties for dark theme,
// range inputs with custom styling, real-time numeric readouts
```

#### 19. PWA / Offline Support
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
        ├── software-architecture.ts
        └── business-fundamentals.ts # Path: 6 domains, ~37 lessons, ~250 cards
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

## Content: Business Fundamentals Learning Path

> A structured learning path for first-time founders and aspiring operators. 7 domains, 26 lessons, ~180 cards.
> Sources: Thiel, Sinek, Godin, Voss, Harnish, Wickman, Gerber, Ries, Scott, Horowitz, CB Insights.
> Red-team revised: added finance + failures domains, cut from 37→26 lessons, consolidated Godin, added practice bridges.
> See vault note: [[Business Fundamentals — Learning Path]]

### Path Structure

```typescript
const businessFundamentalsPath: LearningPath = {
  id: "biz",
  title: "Business Fundamentals",
  description: "From idea to scale — strategy, marketing, negotiation, execution, leadership, finance, and failures",
  icon: "🏗️",
  lessons: [
    // Domain 1: Vision & Strategy (4)
    "biz-contrarian", "biz-monopoly", "biz-why", "biz-strategic-plan",
    // Domain 2: Marketing & Growth (4)
    "biz-remarkable", "biz-bml", "biz-the-dip", "biz-storytelling",
    // Domain 3: Sales & Negotiation (5)
    "biz-tactical-empathy", "biz-calibrated-q", "biz-accusation-audit",
    "biz-ackerman", "biz-black-swans",
    // Domain 4: Execution & Operations (4)
    "biz-rockefeller", "biz-accountability", "biz-emyth", "biz-cash",
    // Domain 5: People & Leadership (3)
    "biz-radical-candor", "biz-tribes", "biz-wartime-ceo",
    // Domain 6: Finance & Unit Economics (3) — NEW
    "biz-unit-economics", "biz-cashflow-runway", "biz-fundraising",
    // Domain 7: Failures & Post-Mortems (3) — NEW
    "biz-why-startups-die", "biz-the-struggle", "biz-anti-trendslop",
  ],
  createdAt: "2026-04-16",
};
```

### Example Lessons

#### Lesson: Tactical Empathy (Chris Voss)

```typescript
const tacticalEmpathyLesson: Lesson = {
  id: "biz-tactical-empathy",
  pathId: "biz",
  title: "Tactical Empathy",
  description: "Understand feelings to increase influence — without agreeing",
  prerequisites: [],
  estimatedMinutes: 5,
  steps: [
    {
      type: "concept",
      title: "Empathy is not agreement",
      content: "Tactical empathy means understanding someone's feelings and worldview in the moment to increase your influence. It's not sympathy (feeling *for* them) or agreement (conceding their point). It's intelligence gathering through emotional attention.\n\n**Source**: Chris Voss, *Never Split the Difference*",
      diagrams: [],
    },
    {
      type: "multiple-choice",
      question: "Your supplier says 'This price increase is non-negotiable.' What's the tactical empathy response?",
      options: [
        "I understand, let's move on to other terms.",
        "It seems like you're under pressure from your costs going up.",
        "That's not fair — we've been loyal customers for years.",
        "Can you break down the cost increase for me?",
      ],
      correctIndex: 1,
      explanation: "Labeling their emotion ('It seems like...') validates their position without conceding. It opens them up to explain *why*, which reveals leverage points. Option D is a good follow-up, but empathy comes first.",
    },
    {
      type: "fill-blank",
      template: "Tactical empathy = understanding {{feelings}} + hearing what's {{behind}} those feelings → increase your {{influence}}",
      blanks: [
        { key: "feelings", answer: "feelings", hint: "what they're experiencing" },
        { key: "behind", answer: "behind", hint: "the deeper motivation" },
        { key: "influence", answer: "influence", hint: "your power in the conversation" },
      ],
      explanation: "Voss's formula: surface emotions → underlying needs → leverage. The sequence matters — you can't influence without first demonstrating understanding.",
    },
    {
      type: "multiple-choice",
      question: "What's the difference between tactical empathy and sympathy?",
      options: [
        "Tactical empathy is fake, sympathy is real",
        "Sympathy means you feel FOR them, empathy means you understand THEIR perspective",
        "There is no difference — both build rapport",
        "Empathy is emotional, sympathy is rational",
      ],
      correctIndex: 1,
      explanation: "Sympathy creates emotional fusion ('I feel your pain'). Tactical empathy maintains separation — you understand their world without inhabiting it. This separation is what preserves your negotiating position.",
    },
    {
      type: "reflection",
      prompt: "Think of a recent disagreement at work or in life. What was the other person's underlying feeling behind their position? How would labeling that feeling ('It seems like...') have changed the conversation?",
    },
  ],
  reviewCards: ["biz-te-1", "biz-te-2", "biz-te-3"],
};
```

#### Lesson: The Ackerman Model (Chris Voss)

```typescript
const ackermanLesson: Lesson = {
  id: "biz-ackerman",
  pathId: "biz",
  title: "The Ackerman Model",
  description: "A structured anchoring and concession strategy using calculated offers",
  prerequisites: ["biz-tactical-empathy", "biz-mirror-label", "biz-calibrated-q"],
  estimatedMinutes: 5,
  steps: [
    {
      type: "concept",
      title: "Never negotiate in round numbers",
      content: "The Ackerman Model is a structured approach to making offers:\n\n1. Set your target price\n2. Open at **65%** of target (extreme anchor)\n3. Calculate three raises: **85%, 95%, 100%** of target\n4. Use decreasing increments (shows you're reaching your limit)\n5. Use **odd, precise numbers** (e.g., $37,893 not $38,000)\n6. On your final number, throw in a **non-monetary item** to signal you're at your limit\n\n**Why odd numbers?** They signal careful calculation. $37,893 implies you've done precise analysis. $38,000 implies you're guessing.",
      diagrams: [],
    },
    {
      type: "calculation",
      question: "Your target salary is $120,000. What should your opening offer be using the Ackerman model?",
      answer: 78000,
      tolerance: 1000,
      unit: "$",
      explanation: "Opening anchor = 65% of target = 0.65 × $120,000 = $78,000. This feels extreme, but the Ackerman model relies on the anchor dragging the negotiation toward your actual target through calibrated concessions.",
    },
    {
      type: "ordering",
      question: "Put the Ackerman concession steps in order:",
      items: [
        "Set your target price",
        "Open at 65% of target",
        "Raise to 85% of target",
        "Raise to 95% of target",
        "Raise to 100% + non-monetary item",
      ],
      explanation: "The decreasing increments (20% → 10% → 5%) signal diminishing capacity. Each concession 'costs' you visibly more, making the counterpart feel they're squeezing your limit.",
    },
    {
      type: "multiple-choice",
      question: "Why should you include a non-monetary item with your final offer?",
      options: [
        "It adds value for the other side at no cost to you",
        "It signals you've reached your absolute limit",
        "It creates reciprocity pressure",
        "All of the above",
      ],
      correctIndex: 3,
      explanation: "The non-monetary item does triple duty: it's cheap for you but valuable to them, it signals 'I have no more money to give', and it triggers reciprocal generosity. Voss: 'throw in something unrelated to the price.'",
    },
    {
      type: "reflection",
      prompt: "Think of an upcoming negotiation (salary, vendor, lease, etc.). What's your target number? What would your 65% anchor be? Does it feel uncomfortably low? That's the point.",
    },
  ],
  reviewCards: ["biz-ack-1", "biz-ack-2"],
};
```

#### Lesson: Be Remarkable (Seth Godin)

```typescript
const remarkableLesson: Lesson = {
  id: "biz-remarkable",
  pathId: "biz",
  title: "Be Remarkable",
  description: "Why safe is risky and remarkable is the only marketing that works",
  prerequisites: ["biz-why"],
  estimatedMinutes: 5,
  steps: [
    {
      type: "concept",
      title: "The Purple Cow",
      content: "If you drove past a field of cows, you wouldn't notice them. But a **purple cow** — that you'd stop for.\n\nSeth Godin's argument: in a world of infinite choices and zero attention, being safe is the riskiest strategy. The only marketing that works is building something **worth remarking about**.\n\n'Remarkable' literally means 'worth making a remark about.' If your customers don't talk about you, you're invisible.\n\n**Source**: Seth Godin, *Purple Cow*",
      diagrams: [],
    },
    {
      type: "multiple-choice",
      question: "According to Godin, what's the riskiest strategy in a crowded market?",
      options: [
        "Being first to market",
        "Being the cheapest option",
        "Being safe and conventional",
        "Targeting a niche audience",
      ],
      correctIndex: 2,
      explanation: "Godin: 'In a crowded marketplace, fitting in is failing. In a busy marketplace, not standing out is the same as being invisible.' Safe products don't spread — they die quietly.",
    },
    {
      type: "fill-blank",
      template: "The goal is not to market TO {{everyone}} but to market FOR the {{sneezers}} who will spread your idea",
      blanks: [
        { key: "everyone", answer: "everyone", hint: "mass market" },
        { key: "sneezers", answer: "sneezers", hint: "Godin's term for word-of-mouth spreaders" },
      ],
      explanation: "Sneezers are the early adopters who spread ideas. Your job is to make something so remarkable that sneezers can't help but tell people about it. Target the edges, not the middle.",
    },
    {
      type: "reflection",
      prompt: "What's the 'purple cow' in your business or project? If you don't have one, what would you need to change to make someone remark about it to a friend?",
    },
  ],
  reviewCards: ["biz-rem-1", "biz-rem-2"],
};
```

#### Lesson: Unit Economics (NEW — Finance domain)

```typescript
const unitEconomicsLesson: Lesson = {
  id: "biz-unit-economics",
  pathId: "biz",
  title: "Unit Economics",
  description: "The numbers that tell you if your business model actually works",
  prerequisites: [],
  estimatedMinutes: 5,
  steps: [
    {
      type: "concept",
      title: "Two numbers that decide everything",
      content: "**CAC** (Customer Acquisition Cost) = total sales & marketing spend ÷ new customers acquired.\n\n**LTV** (Lifetime Value) = average revenue per customer × average customer lifespan.\n\nIf LTV/CAC < 1, you lose money on every customer. If LTV/CAC > 3, you have a healthy business. Between 1-3, you're surviving but fragile.\n\nCB Insights found that 19% of startup failures come from unsustainable unit economics — the business *worked* but couldn't make money doing it.",
      diagrams: [],
    },
    {
      type: "calculation",
      question: "You spend $50,000/month on marketing and acquire 500 customers. What's your CAC?",
      answer: 100,
      tolerance: 1,
      unit: "$",
      explanation: "CAC = $50,000 ÷ 500 = $100 per customer. Now you need to know: does each customer generate more than $100 in lifetime value?",
    },
    {
      type: "calculation",
      question: "Average customer pays $30/month and stays 18 months. What's the LTV?",
      answer: 540,
      tolerance: 5,
      unit: "$",
      explanation: "LTV = $30 × 18 = $540. With a CAC of $100, LTV/CAC = 5.4x — very healthy. But watch out: if churn increases and average lifespan drops to 6 months, LTV = $180 and LTV/CAC = 1.8x — danger zone.",
    },
    {
      type: "multiple-choice",
      question: "Your LTV/CAC ratio is 1.5x. What does this mean?",
      options: [
        "You're very profitable — keep scaling",
        "You're surviving but fragile — improve retention or reduce acquisition costs",
        "You're losing money on every customer",
        "You need to raise prices immediately",
      ],
      correctIndex: 1,
      explanation: "LTV/CAC between 1-3 means you're making money per customer but not enough margin to absorb shocks (churn spikes, competition, cost increases). Target >3x before scaling aggressively.",
    },
    {
      type: "reflection",
      prompt: "Calculate (or estimate) the CAC and LTV for a product you use or are building. Is the ratio >3x? If not, what's the weakest lever — acquisition cost or retention?",
    },
  ],
  reviewCards: ["biz-ue-1", "biz-ue-2", "biz-ue-3"],
};
```

#### Lesson: Why Startups Die (NEW — Failures domain)

```typescript
const whyStartupsDieLesson: Lesson = {
  id: "biz-why-startups-die",
  pathId: "biz",
  title: "Why Startups Die",
  description: "The empirical data on what actually kills companies — from 483 post-mortems",
  prerequisites: ["biz-unit-economics"],
  estimatedMinutes: 5,
  steps: [
    {
      type: "concept",
      title: "483 post-mortems, 4 killers",
      content: "CB Insights analyzed 431 VC-backed shutdowns (2023+). The top reasons overlap — most failures cite multiple causes:\n\n1. **Ran out of capital** — 70% (the proximate cause, not the root cause)\n2. **No product-market fit** — 43% (two-thirds were early-stage)\n3. **Bad timing / macro conditions** — 29% (crypto winter, alt-protein collapse)\n4. **Unsustainable unit economics** — 19% (the business worked but couldn't make money)\n\nNotice: running out of capital is almost always the *effect*, not the *cause*. The real killers are the other three.",
      diagrams: [],
    },
    {
      type: "ordering",
      question: "Rank these startup failure reasons from most common to least common (CB Insights data):",
      items: [
        "Ran out of capital (70%)",
        "No product-market fit (43%)",
        "Bad timing / macro conditions (29%)",
        "Unsustainable unit economics (19%)",
      ],
      explanation: "Capital exhaustion is the proximate cause in 70% of failures, but it's usually a symptom. Product-market fit (43%) is the most common root cause — if nobody wants what you're building, no amount of runway saves you.",
    },
    {
      type: "multiple-choice",
      question: "Zume Pizza raised $446M and still failed. What was the primary cause?",
      options: [
        "Bad timing — the pandemic killed restaurants",
        "No product-market fit — pivoted from robot pizza to packaging, never found a viable market",
        "Founder conflict broke up the team",
        "A competitor copied their approach",
      ],
      correctIndex: 1,
      explanation: "Zume is a textbook product-market fit failure at scale. They pivoted from robot-made pizza to sustainable packaging but never found a market that wanted either product enough. $446M couldn't fix that.",
    },
    {
      type: "multiple-choice",
      question: "What separates 'ran out of capital' as a root cause vs. a symptom?",
      options: [
        "If you raised less than $10M, it's a root cause",
        "If you had product-market fit but couldn't raise more, it's a root cause. If you couldn't raise because nothing was working, it's a symptom.",
        "It's always a root cause — money solves everything",
        "It's never a root cause — you can always bootstrap",
      ],
      correctIndex: 1,
      explanation: "Capital exhaustion is a root cause only when external factors (funding market freeze, investor politics) kill an otherwise working business. In most cases, investors stop funding because the underlying business isn't working — making capital exhaustion a symptom of deeper problems.",
    },
    {
      type: "reflection",
      prompt: "Which of the 4 failure modes is your biggest current risk? What's one thing you could do this week to reduce it?",
    },
  ],
  reviewCards: ["biz-wsd-1", "biz-wsd-2"],
};
```

#### Lesson: Wartime vs Peacetime CEO (NEW — Leadership domain, Horowitz)

```typescript
const wartimeCeoLesson: Lesson = {
  id: "biz-wartime-ceo",
  pathId: "biz",
  title: "Wartime vs Peacetime CEO",
  description: "Different situations demand different leadership — know which mode you're in",
  prerequisites: ["biz-radical-candor"],
  estimatedMinutes: 5,
  steps: [
    {
      type: "concept",
      title: "Two modes, one leader",
      content: "**Peacetime CEO** builds culture, develops people, expands markets, makes incremental improvements. Think: Google in 2006.\n\n**Wartime CEO** makes hard calls under existential threat — layoffs, pivots, firing executives, killing products. Think: Steve Jobs returning to Apple in 1997.\n\nMost founders default to peacetime mode because it's comfortable. The hard skill is recognizing when your situation has shifted to wartime and switching modes before it's too late.\n\n**Priority order in all modes**: People → Products → Profits (in that order). Get this wrong and nothing else matters.\n\n**Source**: Ben Horowitz, *The Hard Thing About Hard Things*",
      diagrams: [],
    },
    {
      type: "multiple-choice",
      question: "You need to do layoffs. What's the first step in Horowitz's protocol?",
      options: [
        "Announce it to the whole company immediately",
        "Get your own head right — process it emotionally before acting",
        "Let HR handle it and stay out of the way",
        "Find out who the lowest performers are",
      ],
      correctIndex: 1,
      explanation: "Horowitz: get your head right first. If you're emotional, you'll rush, communicate poorly, and damage trust further. Then: don't delay, be clear on reasons, train managers to handle their own layoffs, address the whole company (staying employees need reassurance), and be visible.",
    },
    {
      type: "ordering",
      question: "Put Horowitz's priority hierarchy in order:",
      items: [
        "People",
        "Products",
        "Profits",
      ],
      explanation: "People → Products → Profits. If you have the right people, they build the right products. If you have the right products, profits follow. Optimizing profits first (cutting people or shipping bad products faster) inverts the chain and destroys the company.",
    },
    {
      type: "reflection",
      prompt: "Is your current work situation wartime or peacetime? What's the evidence? If it's wartime, what hard decision are you avoiding?",
    },
  ],
  reviewCards: ["biz-wc-1", "biz-wc-2"],
};
```

### Card Examples (standalone review cards generated from lessons)

```typescript
// Generated from biz-tactical-empathy lesson
const bizCards = [
  {
    id: "biz-te-1",
    lessonId: "biz-tactical-empathy",
    category: "Business — Negotiation",
    type: "basic",
    front: "What is tactical empathy?",
    back: "Understanding someone's feelings and worldview in the moment to increase your influence — without agreeing with them. (Chris Voss)",
    keyPoints: ["Not sympathy", "Intelligence gathering through emotional attention", "Preserves negotiating position"],
    diagrams: [],
  },
  {
    id: "biz-te-2",
    lessonId: "biz-tactical-empathy",
    category: "Business — Negotiation",
    type: "basic",
    front: "What phrase pattern does Voss use for labeling emotions?",
    back: "'It seems like...', 'It sounds like...', 'It looks like...' — never starting with 'I', which puts the other person's guard up.",
    keyPoints: ["Avoid 'I' statements", "Downward inflection (statement, not question)", "Follow with silence"],
    diagrams: [],
  },
  {
    id: "biz-te-3",
    lessonId: "biz-tactical-empathy",
    category: "Business — Negotiation",
    type: "basic",
    front: "Your counterpart says 'That's a fair price.' What technique do you use?",
    back: "Fair Statement Defense: Mirror the word ('Fair?') then label ('It seems like you want to walk me through your calculations...'). This forces them to justify rather than assert. (Voss)",
    keyPoints: ["Mirror 'fair'", "Label to redirect", "Forces justification"],
    diagrams: [],
  },
  {
    id: "biz-ack-1",
    lessonId: "biz-ackerman",
    category: "Business — Negotiation",
    type: "basic",
    front: "What are the Ackerman Model percentages?",
    back: "Open at 65% of target → raise to 85% → 95% → 100% (with non-monetary item). Decreasing increments signal you're reaching your limit. Always use odd, precise numbers.",
    keyPoints: ["65/85/95/100", "Odd numbers signal precision", "Non-monetary item on final offer"],
    diagrams: [],
  },
  {
    id: "biz-rem-1",
    lessonId: "biz-remarkable",
    category: "Business — Marketing",
    type: "basic",
    front: "What is the 'Purple Cow' concept?",
    back: "In a world of infinite choices and zero attention, being safe is the riskiest strategy. Build something worth remarking about — 'remarkable' literally means 'worth making a remark about.' Target the sneezers (early adopters who spread ideas), not the mass market. (Seth Godin)",
    keyPoints: ["Safe = invisible", "Target sneezers not everyone", "Remarkable = worth remarking about"],
    diagrams: [],
  },
  {
    id: "biz-rem-2",
    lessonId: "biz-remarkable",
    category: "Business — Marketing",
    type: "basic",
    front: "What are 'sneezers' in Godin's framework?",
    back: "Early adopters who spread ideas to their networks. Your product doesn't need to appeal to everyone — it needs to be so remarkable that sneezers can't help telling people about it.",
    keyPoints: ["Word-of-mouth spreaders", "Target the edges not the middle", "Ideas spread through sneezers"],
    diagrams: [],
  },
  // NEW — Finance domain
  {
    id: "biz-ue-1",
    lessonId: "biz-unit-economics",
    category: "Business — Finance",
    type: "basic",
    front: "What is the LTV/CAC ratio and what's a healthy target?",
    back: "LTV (Lifetime Value) ÷ CAC (Customer Acquisition Cost). Target >3x. Between 1-3x = surviving but fragile. Below 1x = losing money on every customer.",
    keyPoints: ["CAC = total spend ÷ new customers", "LTV = avg revenue × avg lifespan", ">3x before scaling"],
    diagrams: [],
  },
  {
    id: "biz-ue-2",
    lessonId: "biz-unit-economics",
    category: "Business — Finance",
    type: "basic",
    front: "What percentage of startup failures are caused by unsustainable unit economics?",
    back: "19% (CB Insights, 431 shutdowns). The business worked but couldn't make money doing it. Often overlaps with running out of capital (70%) — which is the symptom, not the cause.",
    keyPoints: ["19% unit economics", "70% ran out of capital (symptom)", "43% no product-market fit (top root cause)"],
    diagrams: [],
  },
  // NEW — Failures domain
  {
    id: "biz-wsd-1",
    lessonId: "biz-why-startups-die",
    category: "Business — Failures",
    type: "basic",
    front: "What are the top 4 reasons startups fail? (CB Insights, 431 companies)",
    back: "1. Ran out of capital — 70% (usually a symptom)\n2. No product-market fit — 43% (top root cause)\n3. Bad timing / macro conditions — 29%\n4. Unsustainable unit economics — 19%\n\nPercentages exceed 100% because most cite multiple reasons.",
    keyPoints: ["Capital exhaustion is symptom not cause", "PMF is #1 root cause", "Multiple causes overlap"],
    diagrams: [],
  },
  // NEW — Leadership domain (Horowitz)
  {
    id: "biz-wc-1",
    lessonId: "biz-wartime-ceo",
    category: "Business — Leadership",
    type: "basic",
    front: "What is Horowitz's priority hierarchy?",
    back: "People → Products → Profits (in that order). Get the right people, they build the right products, profits follow. Inverting this chain (optimizing profits first) destroys the company.",
    keyPoints: ["People first always", "Products second", "Profits are the result, not the input"],
    diagrams: [],
  },
];
```

### Full Lesson Inventory (26 lessons across 7 domains — red-team revised)

| Domain | # | Lessons | Primary Source |
|--------|---|---------|----------------|
| **1. Vision & Strategy** | 4 | Contrarian Question, Build a Monopoly, Start With Why + Infinite Game, Strategic Positioning | Thiel, Sinek, Harnish |
| **2. Marketing & Growth** | 4 | Be Remarkable + Permission, Build-Measure-Learn + Mom Test, The Dip, Storytelling & Status | Godin, Ries, Fitzpatrick |
| **3. Sales & Negotiation** | 5 | Tactical Empathy + Mirroring, Calibrated Questions + "No", Accusation Audit + "That's Right", Ackerman Model + Rule of Three, Black Swans + Styles | Voss |
| **4. Execution & Operations** | 4 | Rockefeller Habits + OPSP, Accountability + EOS, Work ON the Business, Cash Conversion Cycle | Harnish, Wickman, Gerber |
| **5. People & Leadership** | 3 | Radical Candor, Tribes + Linchpin, Wartime vs Peacetime CEO | Scott, Godin, Horowitz |
| **6. Finance & Unit Economics** | 3 | Unit Economics (CAC/LTV), Cash Flow & Runway, Fundraising Mechanics | General, Graham, CB Insights |
| **7. Failures & Post-Mortems** | 3 | Why Startups Die (top failure reasons), The Struggle (hard decisions), Anti-Trendslop Mindset | CB Insights, Horowitz, Vault |
| **Total** | **26** | | |

**Estimated cards**: ~180 (6-8 review cards per lesson)
**Practice bridges**: 10 real-world exercises in domains 3, 5, 6, 7 (e.g., "mirror someone today", "calculate your CAC")
**Target learner**: First-time founder / aspiring operator — practical literacy, not MBA depth
**Remaining gap**: Non-Western business thought (Toyota/kaizen) — candidate for future Domain 8

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
