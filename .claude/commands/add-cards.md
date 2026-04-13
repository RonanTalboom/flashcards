Add new flashcards to the deck.

The user will describe the topic or provide specific questions/answers. For each card:

1. Read the current cards in `src/data/cards.ts`
2. Determine the next available `id` (increment from the highest existing id)
3. Choose an appropriate `category` from existing categories or create a new one if the topic doesn't fit
4. Write the card with:
   - `id`: next sequential number
   - `category`: appropriate category
   - `front`: clear question
   - `back`: concise answer (1-2 sentences)
   - `keyPoints`: array of 3-4 supporting details that deepen understanding
5. Add the card(s) to the CARDS array in `src/data/cards.ts`
6. Run `npm run build` to verify no TypeScript errors
7. Seed the new cards into D1 using `npx wrangler d1 execute flashcards-db --remote --command "INSERT OR REPLACE INTO cards (id, category, front, back, key_points) VALUES (ID, 'CATEGORY', 'FRONT', 'BACK', 'KEY_POINTS_JSON');"` for each card
8. Ask the user if they want to deploy the updated deck
