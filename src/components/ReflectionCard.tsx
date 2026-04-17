import { useState, useEffect } from "react";
import type { Card } from "../types";
import { Markdown } from "./Markdown";
import { Diagram } from "./Diagram";

interface ReflectionCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onContinue: () => void;
}

/**
 * Free-text elaborative interrogation. No grading — the value is in generating the answer.
 * If `modelAnswer` is set, a reveal is shown after submission (Apply-step variant).
 * Otherwise the user's reflection is the end of the step (pure reflection).
 */
export function ReflectionCard({
  card,
  currentIndex,
  queueLength,
  onContinue,
}: ReflectionCardProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const minLength = card.minLength ?? 0;
  const hasModel = Boolean(card.modelAnswer);
  const canSubmit = answer.trim().length >= minLength;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      // Ctrl/Cmd+Enter submits from textarea; Enter outside an input continues after reveal
      if (submitted && (e.key === "Enter" || e.code === "Space") && tag !== "TEXTAREA") {
        e.preventDefault();
        onContinue();
      } else if (!submitted && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (canSubmit) setSubmitted(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submitted, canSubmit, onContinue]);

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
    if (!hasModel) {
      // Pure reflection: submit immediately advances
      setTimeout(onContinue, 0);
    }
  }

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="reflection-badge">
          {hasModel ? "Apply" : "Reflect"}
        </span>
      </header>

      <div className="reflection-card">
        <Markdown text={card.front} className="reflection-prompt" />

        {card.diagram && (
          <Diagram src={card.diagram} caption={card.diagramCaption} alt={card.front} />
        )}

        <textarea
          className="reflection-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={
            minLength > 0
              ? `Your answer (min ${minLength} characters)…`
              : "Your answer…"
          }
          rows={6}
          disabled={submitted && hasModel}
        />
        {minLength > 0 && !submitted && (
          <div className="reflection-counter">
            {answer.trim().length} / {minLength}
          </div>
        )}

        {!submitted && (
          <button
            type="button"
            className="reflection-submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {hasModel ? "Show model answer" : "Submit"}
          </button>
        )}

        {submitted && hasModel && (
          <div className="reflection-reveal">
            <div className="theory-block">
              <span className="theory-label">Model answer</span>
              <Markdown text={card.modelAnswer!} className="theory-body" />
            </div>
            {card.keyPoints.length > 0 && (
              <div className="theory-block">
                <span className="theory-label">Key points</span>
                <ul className="key-points">
                  {card.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              type="button"
              className="reflection-continue"
              onClick={onContinue}
            >
              Continue &#8594;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
