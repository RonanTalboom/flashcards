Scaffold a new topical flashcard deck, wire it into the app, typecheck, and optionally sync to D1.

## When to invoke
The user wants to add cards around a new topic, or asks for "cards from my research", "flashcards for X", or points at a vault research session (e.g. `Sessions/2026-04-19.md`).

For one-off card additions to an existing deck, edit the deck file directly — the skill overhead is only justified when creating a new deck.

## Inputs expected
Either:
- A **topic + list of concepts** the user describes in-conversation, OR
- A **vault research session path** (e.g., `~/Library/.../Sessions/2026-04-19.md`) and the user saying "make cards from this", OR
- A **list of atomic vault notes** (`[[wikilinks]]`) to draw from.

If the input is ambiguous, ask one clarifying question — source and scope (how many cards, how many lessons).

## Procedure

1. **Discover the next ID range.** Run `grep -rh "^    id: " src/data/*.ts | grep -oE "[0-9]+" | sort -n | tail -1`. Start the new deck at the next round hundred above that maximum (e.g., max 7063 → start at 7070, or jump to 8000 if the domain is clearly separate).

2. **Pick a deck slug.** Short, hyphenated, domain-keyed: `austrian-deflationism`, `polymarket-discipline`, `ddia-glossary`. The exported constant becomes `SLUG_IN_SCREAMING_SNAKE_CARDS`.

3. **Draft 10-15 cards.** Each card must include:
   - `id` (sequential within the deck)
   - `category` (display string — keep consistent within the deck)
   - `front` (a question, not a term)
   - `back` (1–3 sentence direct answer)
   - `keyPoints` (3–5 supporting bullets)
   - Optional: `exerciseType: "mcq"` with `choices: [string, string, string, string]` and `correctAnswer: 0|1|2|3` for retrieval-practice cards. Mix MCQ and flashcard-only cards so the deck supports both Study and Quiz modes.
   - For vocab-style decks: `type: "vocabulary"` + `gender`/`article`/`sentence`/`sentenceTranslation` — storage.ts auto-generates reverse cards.

   Distribute cards across 2–3 lessons. Each lesson should be a coherent sub-theme, 4–7 cards. Later lessons should list earlier lesson IDs as `prerequisites`.

4. **Write the deck file** at `src/data/<slug>-cards.ts`:
   - Header comment: source, date, ID range, key references.
   - `import type { Card } from "../types"`
   - `export const <SLUG>_CARDS: Card[] = [ ... ]`
   - Follow the layout convention from `polymarket-discipline-cards.ts` (section-banner comments separating lessons).

5. **Wire `src/lib/storage.ts`**:
   - Add the `import { <SLUG>_CARDS } from "../data/<slug>-cards"` line (keep imports alphabetical-ish; match existing order if possible).
   - Add the filter line: `const slugCards = <SLUG>_CARDS.filter((c) => !apiIds.has(c.id));`
   - Add `...slugCards` to the `allCards` array.

6. **Wire `src/data/lessons.ts`**:
   - Add a new Section entry (id, title, description, icon, color, lessons).
   - Each lesson gets an id, sectionId, title, description, `cards: [<ids>]`, `prerequisites`, and a `concepts` array that mirrors each card's main takeaway for quick preview.
   - Use a distinct `color` (hex) and `icon` (HTML entity, e.g., `&#128181;` for currency, `&#129504;` for brain).

7. **Typecheck**: `npx tsc --noEmit`. Zero errors expected. If any, fix before proceeding.

8. **Check for ID collisions**: `grep -rh "    id: " src/data/*.ts | grep -oE "id: [0-9]+" | sort | uniq -d` must output nothing.

9. **Sync to D1** (optional, ask the user):
   - `npm run sync-decks:build` — regenerates `migrations/cards-seed.sql` from all decks.
   - `npm run sync-decks:apply:local` — test against local D1 first.
   - `npm run sync-decks:apply:remote` — ships to the live worker. Requires explicit user confirmation because it mutates production D1.

10. **Log to Actions.md** in the vault if the deck came from a research session — follow the pattern `[x] /build: Flashcard deck — <slug>-cards.ts (N cards, IDs X-Y) across M lessons ...`.

## Safety rules
- **Never** edit the legacy `src/data/cards.ts` to add topical cards. That file is the bootstrap deck; new content goes in a new file.
- **Never** reuse an ID that already exists anywhere in `src/data/*.ts`. The `uniq -d` check is load-bearing.
- **Never** run `sync-decks:apply:remote` without asking — it mutates shared state (the deployed D1 instance).
- **Do not** modify the `Card` type in `src/types.ts` to accommodate a new deck. If the existing shape cannot represent the content, flag the gap to the user and let them decide.

## Verification checklist
- [ ] `npx tsc --noEmit` clean
- [ ] `grep -rh "    id: " src/data/*.ts | grep -oE "id: [0-9]+" | sort | uniq -d` empty
- [ ] New section appears in `lessons.ts` in the same shape as sibling sections
- [ ] `storage.ts` imports, filters, and spreads the new deck
- [ ] Deck count in the Dashboard UI (after `npm run dev`) shows the new cards

## Deployment
After acceptance:
- `npm run build` to produce the Vite bundle
- `npm run deploy` to push to Cloudflare Workers (asks user if they want to)
- If D1 was synced, the new cards are already in the remote DB — the deploy just updates the static assets

## When to refuse
If the topic is thin (user can't articulate 5+ distinct testable claims), push back — a padded deck is worse than no deck. Ask what the user would actually want to be able to recall in 6 months.
