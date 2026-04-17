import { useState, useEffect } from "react";
import type { Card } from "../types";
import { AccentKeyboard } from "./AccentKeyboard";
import { SessionProgressBar } from "./SessionProgressBar";

interface ConjugationCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
  onBack?: () => void;
}

function normalizeAccents(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function ConjugationCard({ card, currentIndex, queueLength, onAnswer, onBack }: ConjugationCardProps) {
  const [userInput, setUserInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

  // Extract the conjugated form (after the pronoun)
  const expectedFull = card.back; // e.g., "je suis"
  const parts = expectedFull.split(" ");
  const pronoun = card.pronoun ?? parts[0];
  const conjugated = parts.slice(1).join(" "); // the verb form

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const userNorm = normalizeAccents(userInput);
    const expectedNorm = normalizeAccents(conjugated);
    const correct = userNorm === expectedNorm;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
    setUserInput("");
    setSubmitted(false);
    setIsCorrect(false);
  };

  const handleInsertAccent = (char: string) => {
    if (inputRef) {
      const start = inputRef.selectionStart ?? userInput.length;
      const end = inputRef.selectionEnd ?? userInput.length;
      const newVal = userInput.slice(0, start) + char + userInput.slice(end);
      setUserInput(newVal);
      setTimeout(() => {
        inputRef.setSelectionRange(start + 1, start + 1);
        inputRef.focus();
      }, 0);
    } else {
      setUserInput((v) => v + char);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (submitted) handleNext();
        else handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitted, userInput]);

  return (
    <div className="container">
      <header>
        <div className="header-left">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Back">
              &#8592;
            </button>
          )}
          <span className="progress">{currentIndex + 1} / {queueLength}</span>
        </div>
        <div className="header-badges">
          {card.cefrLevel && <span className="cefr-badge">{card.cefrLevel}</span>}
          <span className="category-badge">Conjugation</span>
        </div>
      </header>

      <SessionProgressBar current={currentIndex} total={queueLength} />

      <div className="card-container">
        <div className="conjugation-card">
          <p className="conjugation-verb">{card.verb}</p>
          <p className="conjugation-tense">{card.tense}</p>
          <div className="conjugation-prompt">
            <span className="conjugation-pronoun">{pronoun}</span>
            {!submitted ? (
              <input
                ref={setInputRef}
                className="conjugation-input"
                type="text"
                placeholder="..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                autoFocus
              />
            ) : (
              <span className={`conjugation-answer ${isCorrect ? "correct" : "incorrect"}`}>
                {userInput}
              </span>
            )}
          </div>

          {submitted && !isCorrect && (
            <p className="conjugation-correction">
              Correct: <strong>{conjugated}</strong>
            </p>
          )}

          {submitted && isCorrect && (
            <p className="conjugation-correct-msg">Correct!</p>
          )}

          {card.keyPoints.length > 0 && submitted && (
            <ul className="key-points">
              {card.keyPoints.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {!submitted && <AccentKeyboard onInsert={handleInsertAccent} />}

      <div id="controls">
        {!submitted ? (
          <button className="btn-review" onClick={handleSubmit} disabled={!userInput.trim()}>
            Check
          </button>
        ) : (
          <button className="btn-review" onClick={handleNext}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
