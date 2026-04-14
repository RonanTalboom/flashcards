import { DailyGoalRing } from "./DailyGoalRing";
import { Heatmap } from "./Heatmap";
import type { ReviewLogEntry } from "../types";

interface DashboardProps {
  streak: number;
  longestStreak: number;
  streakFreezes: number;
  dueCount: number;
  learnedCount: number;
  totalCards: number;
  xp: number;
  level: number;
  levelProgress: number;
  onLearn: () => void;
  onReview: () => void;
  studyCount: number;
  todayReviewCount: number;
  dailyGoal: number;
  difficultCount: number;
  reviewLog: ReviewLogEntry[];
  onDifficultReview: () => void;
  onSpeedReview: () => void;
  onMatchGame: () => void;
  onQuizMode: () => void;
  onStats: () => void;
}

export function Dashboard({
  streak,
  longestStreak,
  streakFreezes,
  dueCount,
  learnedCount,
  totalCards,
  xp,
  level,
  levelProgress,
  onLearn,
  onReview,
  studyCount,
  todayReviewCount,
  dailyGoal,
  difficultCount,
  reviewLog,
  onDifficultReview,
  onSpeedReview,
  onMatchGame,
  onQuizMode,
  onStats,
}: DashboardProps) {
  return (
    <div className="container">
      <header>
        <h1>LearnPath</h1>
        <div className="streak">
          {streak > 0 && (
            <>
              {streak}d streak
              {longestStreak > streak && (
                <span className="streak-best" title="Personal best">(best: {longestStreak})</span>
              )}
              {streakFreezes > 0 && (
                <span className="streak-freeze" title={`${streakFreezes} freeze${streakFreezes > 1 ? "s" : ""}`}>
                  &#10052;{streakFreezes}
                </span>
              )}
            </>
          )}
        </div>
      </header>

      {/* Daily Goal + Stats Row */}
      <div className="dashboard-goal-row">
        <DailyGoalRing current={todayReviewCount} goal={dailyGoal} />
        <div className="dashboard-goal-stats">
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

      {/* Primary actions */}
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

      {/* Study modes */}
      <div className="study-modes">
        {dueCount > 0 && (
          <button className="mode-btn mode-speed" onClick={onSpeedReview}>
            &#9889; Speed Review
          </button>
        )}
        <button className="mode-btn mode-match" onClick={onMatchGame}>
          &#127922; Match Game
        </button>
        <button className="mode-btn mode-quiz" onClick={onQuizMode}>
          &#128221; Quiz Mode
        </button>
        {difficultCount > 0 && (
          <button className="mode-btn mode-difficult" onClick={onDifficultReview}>
            &#128293; Difficult ({difficultCount})
          </button>
        )}
        <button className="mode-btn mode-stats" onClick={onStats}>
          &#128202; Statistics
        </button>
      </div>

      {/* Activity Heatmap */}
      {reviewLog.length > 0 && (
        <div className="dashboard-heatmap">
          <h3 className="dashboard-section-title">Activity</h3>
          <Heatmap reviewLog={reviewLog} />
        </div>
      )}

      {dueCount === 0 && (
        <div className="done-message">
          <p className="done-icon">&#10003;</p>
          <p>All caught up! Come back tomorrow.</p>
        </div>
      )}
    </div>
  );
}
