import { useState } from "react";
import type { Card } from "../types";

interface MCQCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
}

export function MCQCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
}: MCQCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const correctIndex =
    typeof card.correctAnswer === "number" ? card.correctAnswer : -1;
  const choices = card.choices || [];

  function handleSelect(index: number) {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
  }

  function handleContinue() {
    onAnswer(selectedIndex === correctIndex);
  }

  function choiceClass(index: number): string {
    let cls = "mcq-choice";
    if (!answered) {
      return cls;
    }
    if (index === correctIndex) {
      cls += " mcq-choice--correct";
    } else if (index === selectedIndex) {
      cls += " mcq-choice--incorrect";
    } else {
      cls += " mcq-choice--dimmed";
    }
    return cls;
  }

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="category-badge">{card.category}</span>
      </header>

      <div className="mcq-question">
        <p className="mcq-prompt">{card.front}</p>
      </div>

      <div className="mcq-choices">
        {choices.map((choice, i) => (
          <button
            key={i}
            className={choiceClass(i)}
            onClick={() => handleSelect(i)}
            disabled={answered}
          >
            <span className="mcq-choice-letter">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="mcq-choice-text">{choice}</span>
          </button>
        ))}
      </div>

      {answered && (
        <div className="mcq-feedback">
          <div
            className={`mcq-result ${selectedIndex === correctIndex ? "mcq-result--correct" : "mcq-result--incorrect"}`}
          >
            {selectedIndex === correctIndex ? "Correct" : "Incorrect"}
          </div>
          <p className="mcq-explanation">{card.back}</p>
          <button className="mcq-continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
