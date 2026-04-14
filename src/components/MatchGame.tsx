import { useState, useEffect, useMemo, useCallback } from "react";
import type { Card } from "../types";

interface MatchGameProps {
  cards: Card[];
  onBack: () => void;
  onComplete: (time: number) => void;
  bestTime: number | null;
}

interface Tile {
  id: string;
  text: string;
  cardId: number;
  side: "front" | "back";
  matched: boolean;
}

export function MatchGame({ cards, onBack, onComplete, bestTime }: MatchGameProps) {
  // Pick 6 random cards
  const gameCards = useMemo(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [cards]);

  const tiles = useMemo(() => {
    const t: Tile[] = [];
    for (const card of gameCards) {
      // Truncate long text for tile display
      const frontText = card.front.length > 60 ? card.front.slice(0, 57) + "..." : card.front;
      const backText = card.back.length > 60 ? card.back.slice(0, 57) + "..." : card.back;
      t.push({ id: `f-${card.id}`, text: frontText, cardId: card.id, side: "front", matched: false });
      t.push({ id: `b-${card.id}`, text: backText, cardId: card.id, side: "back", matched: false });
    }
    // Shuffle
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  }, [gameCards]);

  const [tileStates, setTileStates] = useState<Tile[]>(tiles);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [complete, setComplete] = useState(false);
  const [startTime] = useState(Date.now());

  // Timer
  useEffect(() => {
    if (complete) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, complete]);

  const handleTileClick = useCallback((tileId: string) => {
    if (complete) return;
    const tile = tileStates.find((t) => t.id === tileId);
    if (!tile || tile.matched) return;

    if (!selected) {
      setSelected(tileId);
      setWrongPair(null);
      return;
    }

    if (selected === tileId) {
      setSelected(null);
      return;
    }

    const first = tileStates.find((t) => t.id === selected)!;

    if (first.cardId === tile.cardId && first.side !== tile.side) {
      // Match!
      const updated = tileStates.map((t) =>
        t.cardId === tile.cardId ? { ...t, matched: true } : t
      );
      setTileStates(updated);
      setSelected(null);
      setWrongPair(null);

      // Check if all matched
      if (updated.every((t) => t.matched)) {
        const finalTime = (Date.now() - startTime + penalty * 1000) / 1000;
        setComplete(true);
        onComplete(finalTime);
      }
    } else {
      // Wrong match
      setWrongPair([selected, tileId]);
      setPenalty((p) => p + 1);
      setTimeout(() => {
        setSelected(null);
        setWrongPair(null);
      }, 600);
    }
  }, [selected, tileStates, complete, startTime, penalty, onComplete]);

  const totalTime = ((elapsed + penalty * 1000) / 1000).toFixed(1);

  if (complete) {
    return (
      <div className="container">
        <header><h1>Match Game</h1></header>
        <div className="done-screen">
          <p className="done-icon" style={{ fontSize: "3rem" }}>&#127942;</p>
          <h2>Complete!</h2>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-value">{totalTime}s</span>
              <span className="stat-label">Time</span>
            </div>
            <div className="stat">
              <span className="stat-value">{penalty}</span>
              <span className="stat-label">Penalties</span>
            </div>
            {bestTime !== null && (
              <div className="stat">
                <span className="stat-value">{bestTime.toFixed(1)}s</span>
                <span className="stat-label">Best</span>
              </div>
            )}
          </div>
          <button className="btn-start" onClick={onBack}>Back to dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <button className="back-btn" onClick={onBack}>&#8592;</button>
        <span className="match-timer">{totalTime}s</span>
      </header>
      <div className="match-grid">
        {tileStates.map((tile) => {
          const isSelected = selected === tile.id;
          const isWrong = wrongPair?.includes(tile.id);
          let cls = "match-tile";
          if (tile.matched) cls += " match-tile-matched";
          else if (isWrong) cls += " match-tile-wrong";
          else if (isSelected) cls += " match-tile-selected";

          return (
            <button
              key={tile.id}
              className={cls}
              onClick={() => handleTileClick(tile.id)}
              disabled={tile.matched}
            >
              <span className="match-tile-text">{tile.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
