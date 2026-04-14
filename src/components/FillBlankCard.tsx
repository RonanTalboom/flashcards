import { useState, useRef } from "react";
import type { Card } from "../types";
import { AccentKeyboard } from "./AccentKeyboard";
import { Latex } from "./Latex";

interface FillBlankCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
}

function normalizeAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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
  const inputRef = useRef<HTMLInputElement>(null);

  const correctAnswer =
    typeof card.correctAnswer === "string" ? card.correctAnswer : "";
  const isFrench = card.deck?.startsWith("french") || card.cefrLevel != null;

  function handleCheck() {
    if (!input.trim() || answered) return;
    const exact = input.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    const lenient = isFrench && normalizeAccents(input.trim()) === normalizeAccents(correctAnswer.trim());
    setIsCorrect(exact || lenient);
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

  function handleAccentInsert(char: string) {
    if (!inputRef.current) return;
    const el = inputRef.current;
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const newVal = input.slice(0, start) + char + input.slice(end);
    setInput(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 1, start + 1);
    });
  }

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <div className="header-badges">
          {card.cefrLevel && (
            <span className="cefr-badge">{card.cefrLevel}</span>
          )}
          <span className="category-badge">{card.category}</span>
        </div>
      </header>

      <div className="fill-question">
        <Latex text={card.front} className="fill-prompt" as="p" />
      </div>

      <div className="fill-input-area">
        <input
          ref={inputRef}
          type="text"
          className={`fill-input${answered ? (isCorrect ? " fill-input--correct" : " fill-input--incorrect") : ""}`}
          placeholder="Type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={answered}
          autoFocus
        />
        {!answered && isFrench && <AccentKeyboard onInsert={handleAccentInsert} />}
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
          <Latex text={card.back} className="fill-explanation" as="p" />
          <button className="fill-continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
