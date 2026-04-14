import { useState, useMemo } from "react";
import type { Card } from "../types";
import { Latex } from "./Latex";

interface QuizModeProps {
  cards: Card[];
  onBack: () => void;
}

type QuestionType = "mcq" | "true-false" | "typed";

interface Question {
  type: QuestionType;
  card: Card;
  question: string;
  // MCQ
  options?: string[];
  correctIndex?: number;
  // True/False
  statement?: string;
  isTrue?: boolean;
  // Typed
  answer?: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuiz(cards: Card[]): Question[] {
  if (cards.length < 4) return [];
  const pool = shuffleArray(cards).slice(0, 20);
  const questions: Question[] = [];

  for (const card of pool) {
    const rand = Math.random();

    if (rand < 0.5) {
      // MCQ
      const wrongCards = shuffleArray(cards.filter((c) => c.id !== card.id)).slice(0, 3);
      const options = shuffleArray([card.back, ...wrongCards.map((c) => c.back)]);
      questions.push({
        type: "mcq",
        card,
        question: card.front,
        options,
        correctIndex: options.indexOf(card.back),
      });
    } else if (rand < 0.75) {
      // True/False
      const isTrue = Math.random() > 0.5;
      const statement = isTrue
        ? card.back
        : shuffleArray(cards.filter((c) => c.id !== card.id))[0]?.back ?? card.back;
      questions.push({
        type: "true-false",
        card,
        question: card.front,
        statement,
        isTrue: isTrue || statement === card.back,
      });
    } else {
      // Typed
      questions.push({
        type: "typed",
        card,
        question: card.front,
        answer: card.back,
      });
    }
  }

  return questions;
}

export function QuizMode({ cards, onBack }: QuizModeProps) {
  const questions = useMemo(() => generateQuiz(cards), [cards]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(questions.length).fill(null));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [tfAnswer, setTfAnswer] = useState<boolean | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const q = questions[currentQ];

  const submitAnswer = () => {
    if (!q) return;
    let correct = false;

    if (q.type === "mcq" && selectedOption !== null) {
      correct = selectedOption === q.correctIndex;
    } else if (q.type === "true-false" && tfAnswer !== null) {
      correct = tfAnswer === q.isTrue;
    } else if (q.type === "typed") {
      // Fuzzy match: case-insensitive, trim
      const userAns = typedAnswer.trim().toLowerCase();
      const correctAns = (q.answer ?? "").trim().toLowerCase();
      correct = correctAns.includes(userAns) || userAns.includes(correctAns.slice(0, 20));
    }

    const newAnswers = [...answers];
    newAnswers[currentQ] = correct;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setSelectedOption(null);
    setTfAnswer(null);
    setTypedAnswer("");
    if (currentQ + 1 >= questions.length) {
      setQuizComplete(true);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="container">
        <header><h1>Quiz Mode</h1></header>
        <div className="done-screen">
          <p>Need at least 4 cards to generate a quiz.</p>
          <button className="btn-start" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const correct = answers.filter((a) => a === true).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="container">
        <header><h1>Quiz Results</h1></header>
        <div className="done-screen">
          <p className="done-icon" style={{ fontSize: "3rem" }}>&#128221;</p>
          <h2>{pct}% Correct</h2>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-value">{correct}</span>
              <span className="stat-label">Correct</span>
            </div>
            <div className="stat">
              <span className="stat-value">{questions.length - correct}</span>
              <span className="stat-label">Wrong</span>
            </div>
            <div className="stat">
              <span className="stat-value">{questions.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>

          {/* Review wrong answers */}
          <div className="quiz-review">
            {questions.map((question, i) =>
              answers[i] === false ? (
                <div key={i} className="quiz-review-item">
                  <Latex text={question.question} className="quiz-review-q" as="p" />
                  <p className="quiz-review-a">
                    {question.card.back}
                  </p>
                </div>
              ) : null
            )}
          </div>

          <button className="btn-start" onClick={onBack}>Back to dashboard</button>
        </div>
      </div>
    );
  }

  const pct = ((currentQ) / questions.length) * 100;

  return (
    <div className="container">
      <header>
        <button className="back-btn" onClick={onBack}>&#8592;</button>
        <span className="progress">{currentQ + 1} / {questions.length}</span>
      </header>

      <div className="session-progress">
        <div className="session-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="quiz-card">
        <span className="quiz-type-badge">{q.type === "mcq" ? "Multiple Choice" : q.type === "true-false" ? "True / False" : "Type Answer"}</span>
        <Latex text={q.question} className="quiz-question" as="p" />

        {q.type === "mcq" && q.options && (
          <div className="quiz-options">
            {q.options.map((opt, i) => {
              let cls = "quiz-option";
              if (showResult) {
                if (i === q.correctIndex) cls += " quiz-option-correct";
                else if (i === selectedOption && i !== q.correctIndex) cls += " quiz-option-wrong";
              } else if (i === selectedOption) {
                cls += " quiz-option-selected";
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => !showResult && setSelectedOption(i)}
                  disabled={showResult}
                >
                  <Latex text={opt} />
                </button>
              );
            })}
          </div>
        )}

        {q.type === "true-false" && (
          <>
            <div className="quiz-statement">
              <Latex text={q.statement ?? ""} />
            </div>
            <div className="quiz-tf-buttons">
              {[true, false].map((val) => {
                let cls = "quiz-tf-btn";
                if (showResult) {
                  if (val === q.isTrue) cls += " quiz-option-correct";
                  else if (val === tfAnswer && val !== q.isTrue) cls += " quiz-option-wrong";
                } else if (val === tfAnswer) {
                  cls += " quiz-option-selected";
                }
                return (
                  <button
                    key={String(val)}
                    className={cls}
                    onClick={() => !showResult && setTfAnswer(val)}
                    disabled={showResult}
                  >
                    {val ? "True" : "False"}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {q.type === "typed" && (
          <div className="quiz-typed">
            <input
              type="text"
              className="quiz-input"
              placeholder="Type your answer..."
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              disabled={showResult}
              onKeyDown={(e) => e.key === "Enter" && !showResult && submitAnswer()}
            />
            {showResult && (
              <p className="quiz-correct-answer">
                Correct: <Latex text={q.answer ?? ""} />
              </p>
            )}
          </div>
        )}

        {showResult && (
          <div className={`quiz-result ${answers[currentQ] ? "quiz-result-correct" : "quiz-result-wrong"}`}>
            {answers[currentQ] ? "Correct!" : "Incorrect"}
          </div>
        )}
      </div>

      <div id="controls">
        {!showResult ? (
          <button
            className="btn-start"
            onClick={submitAnswer}
            disabled={q.type === "mcq" ? selectedOption === null : q.type === "true-false" ? tfAnswer === null : typedAnswer.trim() === ""}
          >
            Submit
          </button>
        ) : (
          <button className="btn-start" onClick={nextQuestion}>
            {currentQ + 1 >= questions.length ? "See Results" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
