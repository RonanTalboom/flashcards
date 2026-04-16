import { useState, useRef } from "react";
import type { Card } from "../types";
import { AccentKeyboard } from "./AccentKeyboard";
import { Latex } from "./Latex";

interface ClozeCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
}

function parseCloze(text: string): { before: string; answer: string; after: string } {
  const match = text.match(/\{\{c\d+::(.+?)\}\}/);
  if (!match) return { before: text, answer: "", after: "" };
  const idx = match.index!;
  return {
    before: text.slice(0, idx),
    answer: match[1],
    after: text.slice(idx + match[0].length),
  };
}

function normalizeAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function ClozeCard({
  card,
  currentIndex,
  queueLength,
  onAnswer,
}: ClozeCardProps) {
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const cloze = parseCloze(card.clozeText ?? card.front);
  const correctAnswer = typeof card.correctAnswer === "string" ? card.correctAnswer : cloze.answer;

  function handleCheck() {
    if (!input.trim() || answered) return;
    const exact = input.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    const lenient = normalizeAccents(input.trim()) === normalizeAccents(correctAnswer.trim());
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

      <div className="cloze-question">
        <Latex text={card.front} className="cloze-prompt" as="p" />
        <p className="cloze-sentence">
          <span>{cloze.before}</span>
          {!answered ? (
            <span className="cloze-blank">______</span>
          ) : (
            <span className={`cloze-revealed ${isCorrect ? "cloze-correct" : "cloze-incorrect"}`}>
              {correctAnswer}
            </span>
          )}
          <span>{cloze.after}</span>
        </p>
      </div>

      <div className="fill-input-area">
        <input
          ref={inputRef}
          type="text"
          className={`fill-input${answered ? (isCorrect ? " fill-input--correct" : " fill-input--incorrect") : ""}`}
          placeholder="Type the missing word..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={answered}
          autoFocus
        />
        {!answered && <AccentKeyboard onInsert={handleAccentInsert} />}
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
          <div className={`fill-result ${isCorrect ? "fill-result--correct" : "fill-result--incorrect"}`}>
            {isCorrect ? "Correct" : "Incorrect"}
          </div>
          {!isCorrect && (
            <p className="fill-answer">
              Answer: <strong>{correctAnswer}</strong>
            </p>
          )}
          {card.back && (
            <div className="theory-block">
              <span className="theory-label">Why</span>
              <Latex text={card.back} className="theory-body" as="p" />
            </div>
          )}
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
          <button className="fill-continue" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
