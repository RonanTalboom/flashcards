interface DoneScreenProps {
  streak: number;
  learnedCount: number;
  totalReviews: number;
  sessionXp: number;
  onBack: () => void;
}

export function DoneScreen({
  streak,
  learnedCount,
  totalReviews,
  sessionXp,
  onBack,
}: DoneScreenProps) {
  return (
    <div className="container">
      <header>
        <h1>LearnPath</h1>
      </header>
      <div className="done-screen">
        <p className="done-icon">&#10003;</p>
        <h2>Session complete</h2>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day streak</span>
          </div>
          <div className="stat">
            <span className="stat-value">{learnedCount}</span>
            <span className="stat-label">Learned</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalReviews}</span>
            <span className="stat-label">Total reviews</span>
          </div>
          <div className="stat">
            <span className="stat-value">+{sessionXp}</span>
            <span className="stat-label">XP earned</span>
          </div>
        </div>
        <button className="btn-start" onClick={onBack}>
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
