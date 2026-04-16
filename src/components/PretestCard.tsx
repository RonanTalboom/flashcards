import { useState, useEffect } from "react";
import type { Card } from "../types";
import { Latex } from "./Latex";

interface PretestCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
}

export function PretestCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
}: PretestCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const choices = card.choices || [];

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

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="pretest-badge">What do you think?</span>
      </header>

      <div className="mcq-question">
        <Latex text={card.front} className="mcq-prompt" as="p" />
      </div>

      <div className="mcq-choices">
        {choices.map((choice, i) => (
          <button
            key={i}
            className={`mcq-choice${answered && i === selectedIndex ? " pretest-choice--selected" : ""}${answered && i !== selectedIndex ? " mcq-choice--dimmed" : ""}`}
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
          <Latex text={card.back} className="pretest-hook" as="p" />
          <button className="pretest-continue" onClick={() => onAnswer(true)}>
            Let's find out &#8594;
          </button>
        </div>
      )}
    </div>
  );
}
