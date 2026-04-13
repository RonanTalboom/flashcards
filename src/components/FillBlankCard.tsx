import { useState } from "react";
import type { Card } from "../types";

interface FillBlankCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
}

export function FillBlankCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
}: FillBlankCardProps) {
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const correctAnswer =
    typeof card.correctAnswer === "string" ? card.correctAnswer : "";

  function handleCheck() {
    if (!input.trim() || answered) return;
    const correct =
      input.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
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

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="category-badge">{card.category}</span>
      </header>

      <div className="fill-question">
        <p className="fill-prompt">{card.front}</p>
      </div>

      <div className="fill-input-area">
        <input
          type="text"
          className={`fill-input${answered ? (isCorrect ? " fill-input--correct" : " fill-input--incorrect") : ""}`}
          placeholder="Type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={answered}
          autoFocus
        />
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
              Answer: <strong>{correctAnswer}</strong>
            </p>
          )}
          <p className="fill-explanation">{card.back}</p>
          <button className="fill-continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
