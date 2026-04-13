import { useState } from "react";
import type { Card } from "../types";

interface StudyCardProps {
  card: Card;
  isFlipped: boolean;
  currentIndex: number;
  queueLength: number;
  onFlip: () => void;
  onRate: (grade: number) => void;
  onBack?: () => void;
}

export function StudyCard({
  card,
  isFlipped,
  currentIndex,
  queueLength,
  onFlip,
  onRate,
  onBack,
}: StudyCardProps) {
  const [selfAnswer, setSelfAnswer] = useState("");

  return (
    <div className="container">
      <header>
        {onBack ? (
          <button className="back-btn" onClick={onBack} aria-label="Back">
            &#8592;
          </button>
        ) : (
          <span className="progress">
            {currentIndex + 1} / {queueLength}
          </span>
        )}
        <span className="category-badge">{card.category}</span>
      </header>

      <div className="card-container" onClick={!isFlipped ? onFlip : undefined}>
        {!isFlipped ? (
          <div className="card-front">
            <p className="card-text">{card.front}</p>
            <textarea
              className="self-answer-input"
              placeholder="Type your thoughts..."
              value={selfAnswer}
              onChange={(e) => setSelfAnswer(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <div className="card-back">
            {selfAnswer && (
              <div className="self-answer-review">
                <span className="self-answer-label">Your answer</span>
                <p className="self-answer-text">{selfAnswer}</p>
              </div>
            )}
            <p className="card-answer">{card.back}</p>
            <ul className="key-points">
              {card.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div id="controls">
        {isFlipped ? (
          <div className="rating-buttons">
            <button
              className="rate-btn rate-again"
              onClick={() => onRate(0)}
            >
              <span className="rate-label">Again</span>
            </button>
            <button
              className="rate-btn rate-hard"
              onClick={() => onRate(2)}
            >
              <span className="rate-label">Hard</span>
            </button>
            <button
              className="rate-btn rate-good"
              onClick={() => onRate(4)}
            >
              <span className="rate-label">Good</span>
            </button>
            <button
              className="rate-btn rate-easy"
              onClick={() => onRate(5)}
            >
              <span className="rate-label">Easy</span>
            </button>
          </div>
        ) : (
          <p className="hint">Tap to reveal</p>
        )}
      </div>
    </div>
  );
}
