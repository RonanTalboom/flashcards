import { useEffect } from "react";
import type { Card } from "../types";
import { Markdown } from "./Markdown";
import { Diagram } from "./Diagram";

interface ConceptCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onContinue: () => void;
}

/**
 * Non-graded teaching step. Renders a 1-2 sentence concept with an optional diagram.
 * No rating, no XP penalty — just read and continue. Keeps the "teach" half of learning
 * explicit rather than hidden inside card backs.
 */
export function ConceptCard({
  card,
  currentIndex,
  queueLength,
  onContinue,
}: ConceptCardProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Enter" || e.code === "Space") {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onContinue]);

  return (
    <div className="container">
      <header>
        <span className="progress">
          {currentIndex + 1} / {queueLength}
        </span>
        <span className="concept-badge">Concept</span>
      </header>

      <div className="concept-card">
        {card.front && <h2 className="concept-title">{card.front}</h2>}

        {card.diagram && (
          <Diagram
            src={card.diagram}
            caption={card.diagramCaption}
            alt={card.front}
          />
        )}

        {card.back && <Markdown text={card.back} className="concept-body" />}

        {card.keyPoints.length > 0 && (
          <div className="theory-block concept-keypoints">
            <span className="theory-label">Key points</span>
            <ul className="key-points">
              {card.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        <button className="concept-continue" onClick={onContinue}>
          Got it &#8594;
        </button>
      </div>
    </div>
  );
}
