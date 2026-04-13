interface DashboardProps {
  streak: number;
  dueCount: number;
  learnedCount: number;
  totalCards: number;
  studyCount: number;
  categoryBreakdown: { name: string; total: number; learned: number }[];
  xp: number;
  level: number;
  levelProgress: number;
  onStartStudy: () => void;
}

export function Dashboard({
  streak,
  dueCount,
  learnedCount,
  totalCards,
  studyCount,
  categoryBreakdown,
  xp,
  level,
  levelProgress,
  onStartStudy,
}: DashboardProps) {
  return (
    <div className="container">
      <header>
        <h1>Flashcards</h1>
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

      {dueCount > 0 ? (
        <button className="btn-start" onClick={onStartStudy}>
          Study {studyCount} cards
        </button>
      ) : (
        <div className="done-message">
          <p className="done-icon">&#10003;</p>
          <p>All caught up! Come back tomorrow.</p>
        </div>
      )}

      <div className="category-list">
        {categoryBreakdown.map((cat) => (
          <div key={cat.name} className="category-item">
            <span className="category-name">{cat.name}</span>
            <span className="category-progress">
              {cat.learned}/{cat.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
