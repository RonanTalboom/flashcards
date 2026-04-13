# Feature List — Flashcard Learning App

> Implementation spec for building an evidence-based interactive learning app.
> Grounded in the Dunlosky meta-analysis (242 studies, 169k participants) and Bjork's desirable difficulties framework.
> Each feature maps to a specific learning science principle with measured effect sizes.

---

## Current State (what's already built)

- **Stack**: React + TypeScript + Vite, no backend
- **Algorithm**: SM-2 spaced repetition (classic Anki algorithm)
- **Cards**: 21 software architecture flashcards, hardcoded in `src/data/cards.ts`
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

| Learning Principle | Effect Size | Current Implementation | Gap |
|---|---|---|---|
| **Spaced repetition** | d=0.56 (high utility) | SM-2 algorithm | Upgrade to FSRS (20-30% fewer reviews) |
| **Active recall** | d=0.56 (high utility) | Self-answer textarea | Add typed-answer matching, cloze deletion |
| **Interleaving** | +43% transfer | Chunk-of-4 shuffle | Cross-deck interleaving, category mixing toggle |
| **Immediate feedback** | Strong moderator | Show answer on flip | Add elaborated feedback, confidence calibration |
| **Desirable difficulties** | Framework | Cards get harder by ease | Add difficulty-aware scheduling, lapse tracking |
| **Gamification** | Motivation sustainer | XP + levels + streaks | Streak freeze, daily goals, achievements, heatmap |
| **Microlearning** | +25-60% retention, 80%+ completion | Max 10 new/session | Session timer, target session length |
| **Generation** | Desirable difficulty | Self-answer textarea | Enforce answer-first, hide flip until answered |
| **Elaborative interrogation** | Moderate utility | Not implemented | "Why?" prompt cards, connection prompts |

---

## Implementation Priorities

### P0 — Core Learning Engine Upgrades

#### 1. Upgrade SM-2 to FSRS v4.5
**Science**: FSRS outperforms SM-2 in 91.9% of cases, 20-30% fewer reviews for same retention.
**What to build**:
- Replace `src/lib/sm2.ts` with FSRS implementation
- Use `ts-fsrs` package from npm (`open-spaced-repetition/ts-fsrs`)
- New card state model:
  ```typescript
  interface CardState {
    stability: number;     // memory strength in days
    difficulty: number;    // 1-10 scale
    elapsedDays: number;
    scheduledDays: number;
    reps: number;
    lapses: number;
    state: 'new' | 'learning' | 'review' | 'relearning';
    lastReview: string | null;
  }
  ```
- Target retention parameter: default 0.9 (configurable in settings)
- Four rating grades map to: Again (1), Hard (2), Good (3), Easy (4)
- Show predicted next review interval on each rating button (like Anki)
- **Migration**: convert existing SM-2 state → FSRS state on first load

#### 2. Multi-Deck Support
**Science**: Interleaving across categories improves discrimination and transfer.
**What to build**:
- Deck data structure: `{ id, name, description, cards[], createdAt }`
- Deck selector on dashboard
- "Study all" mode that interleaves across decks
- Per-deck and cross-deck statistics
- Default deck: "Software Architecture" (current 21 cards)
- **Files**: new `src/types.ts` Deck type, update `src/lib/storage.ts`

#### 3. Card Editor & Custom Cards
**Science**: Generation effect — creating your own cards is itself a learning act.
**What to build**:
- Add/edit/delete cards within any deck
- Fields: front (question), back (answer), keyPoints[] (optional), category/tags
- Markdown rendering in card content (bold, code blocks, lists)
- Import from JSON (match current `cards.ts` format)
- Import from CSV (Anki-compatible: front, back, tags)
- Card count shown per deck on dashboard

---

### P1 — Gamification & Motivation System

#### 4. Enhanced Streak System (Duolingo model)
**Science**: Streaks increase commitment by 60%. Users with 7-day streaks are 3.6x more likely to stay engaged.
**What to build**:
- **Streak freeze**: 1 free freeze stored (earned after 7-day streak), protects streak for 1 missed day
- **Streak milestones**: visual celebration at 7, 30, 100, 365 days
- **Streak recovery**: if broken within 1 day, offer to restore for spending XP
- Store streak data: `{ currentStreak, longestStreak, freezesAvailable, lastActiveDate }`
- Streak counter always visible in header

#### 5. Daily Goals & Session Targets
**Science**: Microlearning modules under 10 min hit 89% completion rate. Bite-sized = lower barrier = higher consistency.
**What to build**:
- Configurable daily goal: number of cards (default: 10) or time (default: 5 min)
- Session timer visible during study (non-intrusive, top corner)
- Goal completion animation on done screen
- "Keep going" option after goal reached (no cap, just a milestone)
- Daily goal progress ring on dashboard

#### 6. Activity Heatmap
**Science**: Progress visualization reinforces habit formation and makes effort tangible.
**What to build**:
- GitHub-style contribution heatmap on dashboard (last 90 days)
- Color intensity = number of cards reviewed that day
- Data source: array of `{ date: string, count: number }` in localStorage
- Lightweight implementation: CSS grid, 13 columns (weeks) × 7 rows (days)
- Tooltip on hover showing date and count

#### 7. Achievements / Badges
**Science**: Users earning badges are 30% more likely to finish a course.
**What to build**:
- Achievement system with unlock conditions:
  - **First Steps**: complete first study session
  - **Week Warrior**: 7-day streak
  - **Century**: 100 total reviews
  - **Perfect Session**: rate all cards Good or Easy in one session
  - **Speed Demon**: complete 10 cards in under 2 minutes
  - **Deck Builder**: create 10 custom cards
  - **Deep Recall**: get a card right after 30+ day interval
  - **Scholar**: learn all cards in a deck
- Badge display on dashboard (compact row of icons)
- Toast notification on unlock
- Store: `{ id: string, unlockedAt: string | null }[]`

---

### P2 — Enhanced Learning Mechanics

#### 8. Confidence Calibration
**Science**: Metacognition (knowing what you don't know) is a key skill. Students systematically overestimate their knowledge.
**What to build**:
- Before flipping: "How confident are you?" (1-5 scale or Low/Medium/High)
- After flipping: compare confidence vs. actual rating
- Track calibration over time: `{ predicted: number, actual: number }[]`
- Dashboard stat: "Calibration accuracy" percentage
- Surfaces the illusion-of-competence problem directly to the learner

#### 9. Elaborative Interrogation Prompts
**Science**: Asking "why is this true?" deepens encoding by connecting to prior knowledge. Moderate utility rating.
**What to build**:
- Optional "Why?" prompt after answering a card correctly
- Textbox to explain reasoning in own words
- Stored as `{ cardId, response, date }` — not graded, just for reflection
- Toggle on/off in settings (some sessions want speed, others depth)

#### 10. Cloze Deletion Cards
**Science**: Generation effect — producing answers from partial cues is more effective than recognition.
**What to build**:
- New card type: cloze deletion `"The {{c1::CAP theorem}} forces a choice between..."`
- Parse `{{c1::answer}}` syntax, show blanks on front, filled on back
- Multiple clozes per card (c1, c2, c3)
- Add to card editor as a card type option
- **Card type field**: add `type: 'basic' | 'cloze'` to Card interface

#### 11. Review Statistics Dashboard
**Science**: Feedback is the strongest moderator of learning effectiveness. Self-directed feedback on learning patterns.
**What to build**:
- New "Stats" view accessible from dashboard
- Charts (lightweight, no charting library — CSS/SVG):
  - Cards reviewed per day (bar chart, last 30 days)
  - Retention rate over time (% of cards rated Good/Easy)
  - Time spent per session
  - Cards by FSRS state (new / learning / review / relearning)
  - Hardest cards (lowest stability, most lapses)
- Data: aggregate from review history log
- **Review log**: append-only array `{ cardId, date, grade, timeMs }[]`

#### 12. Keyboard Shortcuts
**Science**: Reducing friction increases session frequency. Every tap saved compounds.
**What to build**:
- Space: flip card
- 1/2/3/4: rate Again/Hard/Good/Easy
- Enter: start study from dashboard
- Escape: back to dashboard
- Show shortcut hints on buttons (subtle, desktop only)

---

### P3 — Content & Import Pipeline

#### 13. Vault Import
**What to build**:
- Import flashcards from Obsidian vault markdown files
- Parse format: `front: "..."` / `back: "..."` in YAML frontmatter, or `Q:` / `A:` in body
- Drag-and-drop `.md` file onto card editor
- Batch import: select folder, parse all matching files

#### 14. Deck Sharing (Export)
**What to build**:
- Export deck as JSON file
- Export as CSV (Anki-compatible)
- Copy deck link (encodes cards in URL for small decks, or generates shareable JSON blob)

#### 15. PWA / Offline Support
**Science**: Low friction to start (mobile-first, 5-min sessions) is a key trait of effective platforms.
**What to build**:
- Service worker for offline access
- `manifest.json` for install-to-homescreen
- App already uses localStorage — offline-first by nature
- Add install prompt banner

---

## Architecture Notes for Implementer

### File structure (target)
```
src/
├── App.tsx                    # Router: dashboard | study | done | stats | editor
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── types.ts                   # All type definitions
├── components/
│   ├── Dashboard.tsx          # Main view: stats, heatmap, deck list, start button
│   ├── StudyCard.tsx          # Card flip, self-answer, rating buttons
│   ├── DoneScreen.tsx         # Session summary, achievements unlocked
│   ├── StatsView.tsx          # NEW: review statistics dashboard
│   ├── CardEditor.tsx         # NEW: add/edit/delete cards
│   ├── DeckList.tsx           # NEW: deck selector and management
│   ├── Heatmap.tsx            # NEW: activity heatmap component
│   ├── AchievementToast.tsx   # NEW: unlock notification
│   └── ConfidencePrompt.tsx   # NEW: pre-flip confidence rating
├── hooks/
│   ├── useFlashcards.ts       # Main state management hook
│   ├── useAchievements.ts     # NEW: achievement tracking
│   └── useReviewLog.ts        # NEW: append-only review history
├── lib/
│   ├── fsrs.ts                # NEW: FSRS algorithm (or use ts-fsrs package)
│   ├── storage.ts             # localStorage abstraction
│   ├── achievements.ts        # NEW: achievement definitions and unlock logic
│   └── importers.ts           # NEW: JSON/CSV/markdown import parsers
└── data/
    └── cards.ts               # Default software architecture deck
```

### Key dependencies to add
```json
{
  "ts-fsrs": "^4.5.0"
}
```
Everything else should be built from scratch — no charting libraries, no UI frameworks beyond React. Keep the bundle tiny.

### State shape (target)
```typescript
interface AppState {
  decks: Record<string, Deck>;
  cards: Record<number, CardState>;  // FSRS state per card
  stats: Stats;
  achievements: Achievement[];
  reviewLog: ReviewLogEntry[];
  settings: Settings;
  heatmap: Record<string, number>;   // date -> review count
}

interface Settings {
  targetRetention: number;     // 0.9 default
  dailyGoal: number;           // cards per day, default 10
  sessionTimeTarget: number;   // minutes, default 5
  showConfidencePrompt: boolean;
  showElaborationPrompt: boolean;
  interleaveDecks: boolean;
}
```

### Design constraints
- Dark mode (#070b0d background), Outfit font — already established
- Mobile-first, 480px max-width — already established
- No backend — all localStorage
- No build-time card generation — all runtime
- Animations: keep subtle (card flip already done, add toast slide-in, heatmap fade)

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
