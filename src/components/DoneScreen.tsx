import { Confetti } from "./Confetti";

interface DoneScreenProps {
  streak: number;
  learnedCount: number;
  totalReviews: number;
  sessionXp: number;
  bestCombo: number;
  onBack: () => void;
}

const MILESTONES = [365, 100, 30, 7];

export function DoneScreen({
  streak,
  learnedCount,
  totalReviews,
  sessionXp,
  bestCombo,
  onBack,
}: DoneScreenProps) {
  const milestone = MILESTONES.find((m) => streak === m);

  return (
    <div className="container">
      <Confetti active={true} />
      <header>
        <h1>LearnPath</h1>
      </header>
      <div className="done-screen">
        <p className="done-icon">&#10003;</p>
        <h2>Session complete</h2>

        {milestone && (
          <div className="streak-milestone">
            &#127942; {streak}-day streak!
          </div>
        )}

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

        {bestCombo >= 3 && (
          <div className="done-combo">
            Best combo: {bestCombo}x
          </div>
        )}

        <button className="btn-start" onClick={onBack}>
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
