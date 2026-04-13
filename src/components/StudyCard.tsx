import type { Card } from "../types";

interface StudyCardProps {
  card: Card;
  isFlipped: boolean;
  currentIndex: number;
  queueLength: number;
  onFlip: () => void;
  onRate: (grade: number) => void;
}

export function StudyCard({
  card,
  isFlipped,
  currentIndex,
  queueLength,
  onFlip,
  onRate,
}: StudyCardProps) {
  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="category-badge">{card.category}</span>
      </header>

      <div className="card-container" onClick={onFlip}>
        <div className={`card-inner${isFlipped ? " flipped" : ""}`}>
          <div className="card-front">
            <p className="card-text">{card.front}</p>
          </div>
          <div className="card-back">
            <p className="card-answer">{card.back}</p>
            <ul className="key-points">
              {card.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
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
