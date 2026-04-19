# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (Vite + Cloudflare plugin, HMR)
- **Build**: `npm run build` (runs `tsc -b && vite build`)
- **Deploy**: `npm run deploy` (build + `wrangler deploy` to Cloudflare Workers)
- **Type generation**: `npm run cf-typegen` (generate Cloudflare Workers types)

No test framework is configured.

## Architecture

React + TypeScript SPA deployed to Cloudflare Workers as a static asset (SPA mode via `wrangler.jsonc`). Built with Vite and the `@cloudflare/vite-plugin`.

### Core data flow

1. **Card definitions** (`src/data/cards.ts`): Static `CARDS` array with id, category, front/back text, and keyPoints. New cards are added here with sequential ids.
2. **SM-2 algorithm** (`src/lib/sm2.ts`): Spaced repetition scheduling. Takes a `CardState` and grade (0-5), returns updated easeFactor/interval/repetitions/nextReviewDate. Grade >= 3 means recall succeeded.
3. **Persistence** (`src/lib/storage.ts`): `AppState` (per-card SM-2 state + streak stats) stored in localStorage under `flashcards_state`.
4. **State management** (`src/hooks/useFlashcards.ts`): Single hook drives the entire app. Manages study queue, view transitions (dashboard/study/done), and persists after each rating. Caps new cards at 10 per session.
5. **Views**: Three views controlled by the `view` state in `useFlashcards` — `Dashboard`, `StudyCard` (with flip animation and 4-button rating: Again/Hard/Good/Easy mapping to grades 0/2/4/5), and `DoneScreen`.

### Styling

Plain CSS in `src/index.css` with CSS custom properties (dark theme). No CSS framework. Mobile-first with a 480px max-width container.

### Adding cards

**Content is split into multiple per-topic deck files** under `src/data/*.ts`. Each deck exports a named `Card[]` (e.g. `AUSTRIAN_DEFLATIONISM_CARDS`) and uses a reserved ID range. Do not add new cards to the legacy `CARDS` array in `src/data/cards.ts` — that file is the bootstrap deck; new content goes in a new file.

Canonical procedure (or run `/add-cards`):

1. **Pick an ID range.** Find the current maximum ID with `grep -rh "^    id: " src/data/*.ts | grep -oE "[0-9]+" | sort -n | tail -1`. Start the new deck at the next round hundred.
2. **Write `src/data/<topic>-cards.ts`.** Header comment naming the source, date, and ID range. Export `export const <TOPIC>_CARDS: Card[] = [...]`.
3. **Wire into `src/lib/storage.ts`**: add an `import`, a filter line (`... .filter((c) => !apiIds.has(c.id))`), and a spread in `allCards`.
4. **Wire into `src/data/lessons.ts`**: add a Section entry with one or more lessons whose `cards: [ids]` reference the deck.
5. **Typecheck**: `npx tsc --noEmit`. Confirm no ID collisions: `grep -rh "    id: " src/data/*.ts | grep -oE "id: [0-9]+" | sort | uniq -d` should output nothing.
6. **Sync to D1** (optional, for offline/cross-device): `npm run sync-decks` regenerates `migrations/cards-seed.sql` from all TS decks and applies it to the remote D1 instance via `wrangler d1 execute --remote`. The TS files remain the source of truth; D1 is a mirror consumed by the Worker's `/api/cards` endpoint.

### D1 schema

Two tables managed by `worker/index.ts`:

- `cards` — `(id, category, front, back, key_points, data)`. The `data` column holds the full `JSON.stringify(card)` so rich fields (MCQ choices, vocab gender, exerciseType, etc.) round-trip. Worker's `GET /api/cards` returns `JSON.parse(row.data)` when present, falling back to the legacy 5-column shape for rows without `data`.
- `app_state` — single-row `(id=1, data TEXT)` storing the full `AppState` (FSRS per-card + streak + XP + lessonProgress).

The TS-over-D1 filter pattern in `storage.ts` means D1-resident IDs override the TS spread. Practical implication: after running `npm run sync-decks`, editing a TS deck won't take effect in the browser until either D1 is re-synced or the TS ID is removed from D1. Treat D1 as downstream of TS, not parallel to it.
