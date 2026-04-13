interface DashboardProps {
  streak: number;
  dueCount: number;
  learnedCount: number;
  totalCards: number;
  xp: number;
  level: number;
  levelProgress: number;
  onLearn: () => void;
  onReview: () => void;
  studyCount: number;
}

export function Dashboard({
  streak,
  dueCount,
  learnedCount,
  totalCards,
  xp,
  level,
  levelProgress,
  onLearn,
  onReview,
  studyCount,
}: DashboardProps) {
  return (
    <div className="container">
      <header>
        <h1>LearnPath</h1>
        <div className="streak">
          {streak > 0 ? `${streak}d streak` : ""}
        </div>
      </header>

      <div className="stats-row">
        <div className="stat">
          <span className="stat-value">{dueCount}</span>
          <span className="stat-label">Due today</span>
        </div>
        <div className="stat">
          <span className="stat-value">{learnedCount}</span>
          <span className="stat-label">Learned</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totalCards}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="xp-bar">
        <div className="xp-header">
          <span className="xp-level">Level {level}</span>
          <span className="xp-amount">{xp} XP</span>
        </div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width: `${levelProgress * 100}%` }} />
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="btn-learn" onClick={onLearn}>
          Learn
        </button>
        {dueCount > 0 && (
          <button className="btn-review" onClick={onReview}>
            Review {studyCount}
          </button>
        )}
      </div>

      {dueCount === 0 && (
        <div className="done-message">
          <p className="done-icon">&#10003;</p>
          <p>All caught up! Come back tomorrow.</p>
        </div>
      )}
    </div>
  );
}
