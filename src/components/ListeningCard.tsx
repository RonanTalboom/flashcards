import { useState, useEffect } from "react";
import type { Card } from "../types";
import { speak, stopSpeaking } from "../lib/tts";
import { SessionProgressBar } from "./SessionProgressBar";

interface ListeningCardProps {
  card: Card;
  currentIndex: number;
  queueLength: number;
  onAnswer: (correct: boolean) => void;
  onBack?: () => void;
}

export function ListeningCard({ card, currentIndex, queueLength, onAnswer, onBack }: ListeningCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [userAnswer, setUserAnswer] = useState("");

  const frenchText = card.article ? `${card.article} ${card.front}` : card.front;

  useEffect(() => {
    // Auto-play on mount
    speak(frenchText, "fr-FR", playbackRate);
    return () => stopSpeaking();
  }, []);

  const handlePlay = () => {
    speak(frenchText, "fr-FR", playbackRate);
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleRate = (correct: boolean) => {
    stopSpeaking();
    setRevealed(false);
    setUserAnswer("");
    onAnswer(correct);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (!revealed) handleReveal();
      } else if (e.key === "p") {
        handlePlay();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [revealed]);

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
          <span className="category-badge">Listening</span>
        </div>
      </header>

      <SessionProgressBar current={currentIndex} total={queueLength} />

      <div className="card-container">
        {!revealed ? (
          <div className="card-front listening-front">
            <button className="listening-play-btn" onClick={handlePlay} aria-label="Play audio">
              &#9654;
            </button>
            <p className="listening-instruction">Listen and think of the meaning</p>

            <div className="listening-speed">
              {[0.7, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  className={`speed-btn ${playbackRate === rate ? "speed-btn-active" : ""}`}
                  onClick={() => {
                    setPlaybackRate(rate);
                    speak(frenchText, "fr-FR", rate);
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <input
              className="listening-input"
              type="text"
              placeholder="Type what you hear (optional)..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
          </div>
        ) : (
          <div className="card-back">
            <p className="listening-french">{frenchText}</p>
            {card.pronunciation && (
              <p className="vocab-pronunciation">{card.pronunciation}</p>
            )}
            <p className="card-answer">{card.back}</p>
            {card.sentence && (
              <p className="vocab-sentence-text">{card.sentence}</p>
            )}
            {card.sentenceTranslation && (
              <p className="vocab-sentence-translation">{card.sentenceTranslation}</p>
            )}
            {userAnswer && (
              <div className="self-answer-review">
                <span className="self-answer-label">You typed</span>
                <p className="self-answer-text">{userAnswer}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div id="controls">
        {revealed ? (
          <div className="rating-buttons">
            <button className="rate-btn rate-again" onClick={() => handleRate(false)}>
              <span className="rate-label">Wrong</span>
            </button>
            <button className="rate-btn rate-good" onClick={() => handleRate(true)}>
              <span className="rate-label">Correct</span>
            </button>
          </div>
        ) : (
          <button className="btn-review" onClick={handleReveal}>
            Reveal Answer
          </button>
        )}
      </div>
    </div>
  );
}
