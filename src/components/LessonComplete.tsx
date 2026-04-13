interface LessonCompleteProps {
  lessonTitle: string;
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  onContinue: () => void;
}

export function LessonComplete({
  lessonTitle,
  correctCount,
  totalCount,
  xpEarned,
  onContinue,
}: LessonCompleteProps) {
  const percentage =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="container">
      <div className="complete-screen">
        <div className="complete-icon">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="none" stroke="#38a169" strokeWidth="3" />
            <path
              d="M15 24l6 6 12-12"
              fill="none"
              stroke="#38a169"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="complete-title">Lesson Complete!</h2>
        <p className="complete-lesson-name">{lessonTitle}</p>

        <div className="complete-stats">
          <div className="complete-score">
            <span className="complete-score-value">
              {correctCount}/{totalCount}
            </span>
            <span className="complete-score-label">correct</span>
          </div>
          <div className="complete-pct">
            <span className="complete-pct-value">{percentage}%</span>
            <span className="complete-pct-label">accuracy</span>
          </div>
        </div>

        <div className="complete-xp">
          <span className="complete-xp-value">+{xpEarned} XP</span>
        </div>

        <button className="complete-continue" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
