import { useState, useEffect } from "react";
import type { Card } from "../types";
import { Latex } from "./Latex";

interface MCQCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
  onBack?: () => void;
}

export function MCQCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
  onBack,
}: MCQCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const correctIndex =
    typeof card.correctAnswer === "number" ? card.correctAnswer : -1;
  const choices = card.choices || [];

  // Keyboard shortcuts: 1-4 to select, Enter/Space to continue
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (!answered) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= choices.length) {
          setSelectedIndex(num - 1);
          setAnswered(true);
        }
      } else if (e.key === "Enter" || e.code === "Space") {
        e.preventDefault();
        onAnswer(selectedIndex === correctIndex);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answered, selectedIndex, correctIndex, choices.length, onAnswer]);

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
        <div className="header-left">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Back">
              &#8592;
            </button>
          )}
          <span className="progress">
            {currentIndex + 1} / {queueLength}
          </span>
        </div>
        <span className="category-badge">{card.category}</span>
      </header>

      <div className="mcq-question">
        <Latex text={card.front} className="mcq-prompt" as="p" />
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
            <span className="mcq-choice-text"><Latex text={choice} /></span>
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
          <div className="theory-block">
            <span className="theory-label">Why</span>
            <Latex text={card.back} className="theory-body" as="p" />
          </div>
          {card.keyPoints.length > 0 && (
            <div className="theory-block">
              <span className="theory-label">Key points</span>
              <ul className="key-points">
                {card.keyPoints.map((point, i) => (
                  <li key={i}>
                    <Latex text={point} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className="mcq-continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
