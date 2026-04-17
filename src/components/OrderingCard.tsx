import { useState, useEffect, useRef } from "react";
import type { Card } from "../types";
import { Latex } from "./Latex";

interface OrderingCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
  onBack?: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function OrderingCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
  onBack,
}: OrderingCardProps) {
  const correctOrder = card.choices || [];
  const [items, setItems] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      let shuffled = shuffle(correctOrder);
      // Ensure shuffled order differs from correct
      while (shuffled.length > 1 && shuffled.every((v, i) => v === correctOrder[i])) {
        shuffled = shuffle(correctOrder);
      }
      setItems(shuffled);
      initialized.current = true;
    }
  }, [correctOrder]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (answered && (e.key === "Enter" || e.code === "Space")) {
        e.preventDefault();
        onAnswer(isCorrect);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answered, isCorrect, onAnswer]);

  function handleTap(index: number) {
    if (answered) return;
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      // Swap
      const newItems = [...items];
      [newItems[selectedIndex], newItems[index]] = [newItems[index], newItems[selectedIndex]];
      setItems(newItems);
      setSelectedIndex(null);
    }
  }

  function moveItem(index: number, direction: -1 | 1) {
    if (answered) return;
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setItems(newItems);
    setSelectedIndex(null);
  }

  function handleCheck() {
    const correct = items.every((v, i) => v === correctOrder[i]);
    setIsCorrect(correct);
    setAnswered(true);
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

      <div className="ordering-list">
        {items.map((item, i) => {
          let cls = "ordering-item";
          if (selectedIndex === i) cls += " ordering-item--selected";
          if (answered) {
            cls += item === correctOrder[i]
              ? " ordering-item--correct"
              : " ordering-item--incorrect";
          }
          return (
            <div key={item} className={cls}>
              <span className="ordering-number">{i + 1}</span>
              <button
                className="ordering-text"
                onClick={() => handleTap(i)}
                disabled={answered}
              >
                <Latex text={item} />
              </button>
              {!answered && (
                <div className="ordering-arrows">
                  <button
                    className="ordering-arrow"
                    onClick={() => moveItem(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                  >
                    &#9650;
                  </button>
                  <button
                    className="ordering-arrow"
                    onClick={() => moveItem(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                  >
                    &#9660;
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!answered && (
        <button className="mcq-continue" onClick={handleCheck}>
          Check order
        </button>
      )}

      {answered && (
        <div className="mcq-feedback">
          <div className={`mcq-result ${isCorrect ? "mcq-result--correct" : "mcq-result--incorrect"}`}>
            {isCorrect ? "Correct" : "Incorrect"}
          </div>
          {!isCorrect && (
            <div className="ordering-correct-order">
              <p className="ordering-correct-label">Correct order:</p>
              {correctOrder.map((item, i) => (
                <div key={i} className="ordering-correct-item">
                  <span className="ordering-number">{i + 1}</span>
                  <Latex text={item} />
                </div>
              ))}
            </div>
          )}
          <Latex text={card.back} className="mcq-explanation" as="p" />
          <button className="mcq-continue" onClick={() => onAnswer(isCorrect)}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
