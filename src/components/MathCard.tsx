import { useState } from "react";
import type { Card } from "../types";
import { Latex } from "./Latex";

interface MathCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
}

export function MathCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
}: MathCardProps) {
  const [input, setInput] = useState("");
  const [negative, setNegative] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  const answer = card.mathAnswer ?? 0;
  const tolerance = card.tolerance ?? 0.01;

  function handleCheck() {
    if (answered) return;
    const cleaned = input.trim().replace(/[$%,]/g, "");
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return;

    const value = negative ? -parsed : parsed;
    const correct = Math.abs(value - answer) <= tolerance;
    setIsCorrect(correct);
    setAnswered(true);
  }

  function handleContinue() {
    onAnswer(isCorrect);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !answered) {
      handleCheck();
    }
  }

  function revealHint() {
    if (card.hints && hintsRevealed < card.hints.length) {
      setHintsRevealed((h) => h + 1);
    }
  }

  function formatAnswer(n: number): string {
    const abs = Math.abs(n);
    // Show enough decimals to be meaningful
    const str = abs === Math.floor(abs) ? abs.toString() : abs.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
    return n < 0 ? `−${str}` : str;
  }

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="category-badge">{card.category}</span>
      </header>

      <div className="math-question">
        <Latex text={card.front} className="math-prompt" as="p" />
      </div>

      <div className="math-input-area">
        {/* Hints */}
        {card.hints && card.hints.length > 0 && (
          <div className="math-hints">
            {card.hints.slice(0, hintsRevealed).map((hint, i) => (
              <div key={i} className="math-hint">
                <Latex text={hint} />
              </div>
            ))}
            {!answered && hintsRevealed < card.hints.length && (
              <button className="math-show-hint" onClick={revealHint}>
                Show hint ({hintsRevealed + 1}/{card.hints.length})
              </button>
            )}
          </div>
        )}

        {/* Input row */}
        <div className="math-input-row">
          {!answered && (
            <button
              className={`math-sign-toggle${negative ? " negative" : ""}`}
              onClick={() => setNegative((n) => !n)}
              title="Toggle negative"
            >
              {negative ? "−" : "+"}
            </button>
          )}
          <input
            type="text"
            inputMode="decimal"
            className={`math-input${answered ? (isCorrect ? " math-input--correct" : " math-input--incorrect") : ""}`}
            placeholder="Your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={answered}
            autoFocus
          />
          {card.unit && <span className="math-unit">{card.unit}</span>}
        </div>

        {!answered && (
          <button
            className="fill-check"
            onClick={handleCheck}
            disabled={!input.trim()}
          >
            Check
          </button>
        )}
      </div>

      {answered && (
        <div className="fill-feedback">
          <div
            className={`fill-result ${isCorrect ? "fill-result--correct" : "fill-result--incorrect"}`}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </div>
          {!isCorrect && (
            <p className="fill-answer">
              Answer:{" "}
              <strong className="math-answer-display">
                {formatAnswer(answer)}
                {card.unit ? ` ${card.unit}` : ""}
              </strong>
            </p>
          )}
          <Latex text={card.back} className="fill-explanation" as="p" />
          {card.keyPoints.length > 0 && (
            <ul className="key-points">
              {card.keyPoints.map((kp, i) => (
                <li key={i}>
                  <Latex text={kp} />
                </li>
              ))}
            </ul>
          )}
          <button className="fill-continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
