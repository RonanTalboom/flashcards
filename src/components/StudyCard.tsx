import { useState } from "react";
import type { Card } from "../types";
import { speak } from "../lib/tts";

interface StudyCardProps {
  card: Card;
  isFlipped: boolean;
  currentIndex: number;
  queueLength: number;
  onFlip: () => void;
  onRate: (grade: number) => void;
  onBack?: () => void;
}

function SpeakButton({ text, lang = "fr-FR" }: { text: string; lang?: string }) {
  return (
    <button
      type="button"
      className="speak-btn"
      onClick={(e) => {
        e.stopPropagation();
        speak(text, lang);
      }}
      aria-label="Play pronunciation"
    >
      &#9654;
    </button>
  );
}

export function StudyCard({
  card,
  isFlipped,
  currentIndex,
  queueLength,
  onFlip,
  onRate,
  onBack,
}: StudyCardProps) {
  const [selfAnswer, setSelfAnswer] = useState("");
  const isVocab = card.type === "vocabulary";
  const genderClass = card.gender === "feminine" ? "card-feminine" : card.gender === "masculine" ? "card-masculine" : "";

  return (
    <div className="container">
      <header>
        {onBack ? (
          <button className="back-btn" onClick={onBack} aria-label="Back">
            &#8592;
          </button>
        ) : (
          <span className="progress">
            {currentIndex + 1} / {queueLength}
          </span>
        )}
        <div className="header-badges">
          {card.cefrLevel && (
            <span className="cefr-badge">{card.cefrLevel}</span>
          )}
          <span className="category-badge">{card.category}</span>
        </div>
      </header>

      <div className="card-container" onClick={!isFlipped ? onFlip : undefined}>
        {!isFlipped ? (
          <div className={`card-front ${genderClass}`}>
            {isVocab ? (
              <>
                <div className="vocab-word">
                  {card.article && (
                    <span className="vocab-article">{card.article} </span>
                  )}
                  <span className="vocab-term">{card.front}</span>
                  <SpeakButton text={card.article ? `${card.article} ${card.front}` : card.front} />
                </div>
                {card.pronunciation && (
                  <p className="vocab-pronunciation">{card.pronunciation}</p>
                )}
                {card.sentence && (
                  <div className="vocab-sentence">
                    <p className="vocab-sentence-text">{card.sentence}</p>
                    <SpeakButton text={card.sentence} />
                  </div>
                )}
                {card.gender && (
                  <span className={`gender-tag gender-${card.gender}`}>
                    {card.gender === "masculine" ? "m." : "f."}
                  </span>
                )}
              </>
            ) : (
              <>
                <p className="card-text">{card.front}</p>
                <textarea
                  className="self-answer-input"
                  placeholder="Type your thoughts..."
                  value={selfAnswer}
                  onChange={(e) => setSelfAnswer(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </>
            )}
          </div>
        ) : (
          <div className={`card-back ${genderClass}`}>
            {selfAnswer && !isVocab && (
              <div className="self-answer-review">
                <span className="self-answer-label">Your answer</span>
                <p className="self-answer-text">{selfAnswer}</p>
              </div>
            )}
            <p className="card-answer">{card.back}</p>
            {isVocab && card.sentenceTranslation && (
              <p className="vocab-sentence-translation">{card.sentenceTranslation}</p>
            )}
            {card.keyPoints.length > 0 && (
              <ul className="key-points">
                {card.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div id="controls">
        {isFlipped ? (
          <div className="rating-buttons">
            <button className="rate-btn rate-again" onClick={() => onRate(0)}>
              <span className="rate-label">Again</span>
            </button>
            <button className="rate-btn rate-hard" onClick={() => onRate(2)}>
              <span className="rate-label">Hard</span>
            </button>
            <button className="rate-btn rate-good" onClick={() => onRate(4)}>
              <span className="rate-label">Good</span>
            </button>
            <button className="rate-btn rate-easy" onClick={() => onRate(5)}>
              <span className="rate-label">Easy</span>
            </button>
          </div>
        ) : (
          <p className="hint">{isVocab ? "Tap to see translation" : "Tap to reveal"}</p>
        )}
      </div>
    </div>
  );
}
