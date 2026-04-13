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

Use `/add-cards` or manually add to the `CARDS` array in `src/data/cards.ts`. Each card needs: `id` (next sequential), `category`, `front`, `back`, `keyPoints` (3-4 items).
