import { useState, useEffect } from "react";
import type { Card } from "../types";
import { Latex } from "./Latex";

interface PretestCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
  onBack?: () => void;
}

export function PretestCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
  onBack,
}: PretestCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const choices = card.choices || [];
  const correctIndex =
    typeof card.correctAnswer === "number" ? card.correctAnswer : -1;
  const explanations = card.choiceExplanations || [];

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
        onAnswer(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answered, choices.length, onAnswer]);

  function handleSelect(index: number) {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
  }

  const isCorrect = selectedIndex === correctIndex;
  const selectedExplanation =
    selectedIndex !== null ? explanations[selectedIndex] : null;

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
        <span className="pretest-badge">What do you think?</span>
      </header>

      <div className="mcq-question">
        <Latex text={card.front} className="mcq-prompt" as="p" />
      </div>

      <div className="mcq-choices">
        {choices.map((choice, i) => (
          <button
            key={i}
            className={`mcq-choice${answered && i === selectedIndex ? (isCorrect ? " pretest-choice--correct" : " pretest-choice--selected") : ""}${answered && i === correctIndex && i !== selectedIndex ? " pretest-choice--reveal" : ""}${answered && i !== selectedIndex && i !== correctIndex ? " mcq-choice--dimmed" : ""}`}
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
        <div className="pretest-feedback">
          {selectedExplanation && (
            <Latex
              text={selectedExplanation}
              className={`pretest-explanation${isCorrect ? " pretest-explanation--correct" : ""}`}
              as="p"
            />
          )}
          <Latex text={card.back} className="pretest-hook" as="p" />
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
          <button className="pretest-continue" onClick={() => onAnswer(true)}>
            Let's find out &#8594;
          </button>
        </div>
      )}
    </div>
  );
}
