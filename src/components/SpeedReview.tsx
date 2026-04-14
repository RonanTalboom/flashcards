import { useState, useEffect, useCallback, useRef } from "react";
import type { Card } from "../types";
import { Latex } from "./Latex";

interface SpeedReviewProps {
  cards: Card[];
  onRate: (grade: number) => void;
  onBack: () => void;
  currentIndex: number;
  queueLength: number;
}

const TIME_LIMIT = 8000; // 8 seconds per card

export function SpeedReview({ cards, onRate, onBack, currentIndex, queueLength }: SpeedReviewProps) {
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());

  const card = cards[currentIndex];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Timer loop
  useEffect(() => {
    if (gameOver || isFlipped || !card) return;

    startTimeRef.current = Date.now();
    setTimeLeft(TIME_LIMIT);

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = TIME_LIMIT - elapsed;
      if (remaining <= 0) {
        setTimeLeft(0);
        // Timeout — lose a life
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setGameOver(true);
        } else {
          onRate(0); // count as Again
        }
        return;
      }
      setTimeLeft(remaining);
      timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);

    return clearTimer;
  }, [currentIndex, gameOver, isFlipped, card, lives, onRate, clearTimer]);

  const handleFlip = () => {
    if (isFlipped || gameOver) return;
    clearTimer();
    setIsFlipped(true);
  };

  const handleRate = (grade: number) => {
    if (grade >= 3) {
      setScore((s) => s + 1);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
        return;
      }
    }
    setIsFlipped(false);
    onRate(grade);
  };

  if (gameOver || !card) {
    return (
      <div className="container">
        <header>
          <h1>Speed Review</h1>
        </header>
        <div className="done-screen">
          <p className="done-icon" style={{ fontSize: "3rem" }}>&#9889;</p>
          <h2>{gameOver ? "Game Over!" : "Complete!"}</h2>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-value">{score}</span>
              <span className="stat-label">Correct</span>
            </div>
            <div className="stat">
              <span className="stat-value">{currentIndex}</span>
              <span className="stat-label">Reviewed</span>
            </div>
          </div>
          <button className="btn-start" onClick={onBack}>Back to dashboard</button>
        </div>
      </div>
    );
  }

  const pct = (timeLeft / TIME_LIMIT) * 100;
  const timerColor = pct > 50 ? "var(--accent)" : pct > 25 ? "var(--orange)" : "var(--red)";

  return (
    <div className="container">
      <header>
        <button className="back-btn" onClick={onBack}>&#8592;</button>
        <div className="speed-meta">
          <span className="speed-lives">
            {"&#9829;".repeat(lives)}{"&#9825;".repeat(3 - lives)}
          </span>
          <span className="speed-score">Score: {score}</span>
        </div>
      </header>

      {/* Timer bar */}
      <div className="speed-timer-track">
        <div
          className="speed-timer-fill"
          style={{ width: `${pct}%`, backgroundColor: timerColor }}
        />
      </div>

      <div className="session-progress">
        <div className="session-progress-fill" style={{ width: `${((currentIndex) / queueLength) * 100}%` }} />
      </div>

      <div className="card-container" onClick={!isFlipped ? handleFlip : undefined}>
        {!isFlipped ? (
          <div className="card-front">
            <Latex text={card.front} className="card-text" as="p" />
          </div>
        ) : (
          <div className="card-back">
            <Latex text={card.back} className="card-answer" as="p" />
          </div>
        )}
      </div>

      <div id="controls">
        {isFlipped ? (
          <div className="rating-buttons">
            <button className="rate-btn rate-again" onClick={() => handleRate(0)}>
              <span className="rate-label">Again</span>
            </button>
            <button className="rate-btn rate-good" onClick={() => handleRate(4)}>
              <span className="rate-label">Got it</span>
            </button>
          </div>
        ) : (
          <p className="hint">Tap to reveal — {Math.ceil(timeLeft / 1000)}s left</p>
        )}
      </div>
    </div>
  );
}
