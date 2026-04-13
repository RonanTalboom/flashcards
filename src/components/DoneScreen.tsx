interface DoneScreenProps {
  streak: number;
  learnedCount: number;
  totalReviews: number;
  onBack: () => void;
}

export function DoneScreen({
  streak,
  learnedCount,
  totalReviews,
  onBack,
}: DoneScreenProps) {
  return (
    <div className="container">
      <header>
        <h1>Flashcards</h1>
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
        </div>
        <button className="btn-start" onClick={onBack}>
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
