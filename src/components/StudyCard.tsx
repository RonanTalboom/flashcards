import { useState, useEffect } from "react";
import type { Card } from "../types";
import { speak } from "../lib/tts";
import { Latex } from "./Latex";
import { ComboCounter } from "./ComboCounter";
import { SessionProgressBar } from "./SessionProgressBar";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface StudyCardProps {
  card: Card;
  isFlipped: boolean;
  currentIndex: number;
  queueLength: number;
  comboCount: number;
  schedulingIntervals?: Record<number, string> | null;
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
  comboCount,
  schedulingIntervals,
  onFlip,
  onRate,
  onBack,
}: StudyCardProps) {
  const [selfAnswer, setSelfAnswer] = useState("");
  const isVocab = card.type === "vocabulary";
  const genderClass = card.gender === "feminine" ? "card-feminine" : card.gender === "masculine" ? "card-masculine" : "";

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture when typing in an input
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (!isFlipped) onFlip();
      } else if (isFlipped) {
        if (e.key === "1") onRate(0);      // Again
        else if (e.key === "2") onRate(2); // Hard
        else if (e.key === "3") onRate(4); // Good
        else if (e.key === "4") onRate(5); // Easy
      } else if (e.key === "Escape" && onBack) {
        onBack();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFlipped, onFlip, onRate, onBack]);

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
          <ComboCounter count={comboCount} />
          {card.cefrLevel && (
            <span className="cefr-badge">{card.cefrLevel}</span>
          )}
          <span className="category-badge">{card.category}</span>
        </div>
      </header>

      <SessionProgressBar current={currentIndex} total={queueLength} />

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
                <Latex text={card.front} className="card-text" as="p" />
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
            <Latex text={card.back} className="card-answer" as="p" />
            {isVocab && card.sentenceTranslation && (
              <p className="vocab-sentence-translation">{card.sentenceTranslation}</p>
            )}
            {card.keyPoints.length > 0 && (
              <ul className="key-points">
                {card.keyPoints.map((point, i) => (
                  <li key={i}><Latex text={point} /></li>
                ))}
              </ul>
            )}
            {card.image && (
              <img src={card.image} alt="" className="card-image" loading="lazy" />
            )}
            {card.videoUrl && <YouTubeEmbed url={card.videoUrl} />}
          </div>
        )}
      </div>

      <div id="controls">
        {isFlipped ? (
          <div className="rating-buttons">
            <button className="rate-btn rate-again" onClick={() => onRate(0)}>
              <span className="rate-label">Again</span>
              {schedulingIntervals && <span className="rate-interval">{schedulingIntervals[0]}</span>}
              <span className="rate-key">1</span>
            </button>
            <button className="rate-btn rate-hard" onClick={() => onRate(2)}>
              <span className="rate-label">Hard</span>
              {schedulingIntervals && <span className="rate-interval">{schedulingIntervals[2]}</span>}
              <span className="rate-key">2</span>
            </button>
            <button className="rate-btn rate-good" onClick={() => onRate(4)}>
              <span className="rate-label">Good</span>
              {schedulingIntervals && <span className="rate-interval">{schedulingIntervals[4]}</span>}
              <span className="rate-key">3</span>
            </button>
            <button className="rate-btn rate-easy" onClick={() => onRate(5)}>
              <span className="rate-label">Easy</span>
              {schedulingIntervals && <span className="rate-interval">{schedulingIntervals[5]}</span>}
              <span className="rate-key">4</span>
            </button>
          </div>
        ) : (
          <p className="hint">{isVocab ? "Tap to see translation" : "Tap or press Space to reveal"}</p>
        )}
      </div>
    </div>
  );
}
