-- Migration 0001: add full-card JSON column to cards table.
-- Rationale: the original 5-column schema (id, category, front, back, key_points)
-- cannot represent rich Card fields (exerciseType, choices, correctAnswer, vocab
-- gender/article, sentence, etc.). Adding a nullable JSON `data` column lets
-- sync-decks-to-d1 round-trip the full Card object while keeping the legacy
-- columns for backward-compatible SQL browsing.
--
-- Worker reads: if data IS NOT NULL, parse and return that; else fall back to
-- the legacy 5-column shape.
--
-- Safe to run multiple times (ALTER IF NOT EXISTS via SQLite idiom).

ALTER TABLE cards ADD COLUMN data TEXT;
