import type { Card, CardState, ReviewLogEntry } from "../types";

interface StatsViewProps {
  reviewLog: ReviewLogEntry[];
  retentionRate: number;
  cardStateCounts: { newCount: number; learning: number; mature: number };
  hardestCards: Card[];
  cardStates: Record<number, CardState>;
  reviewForecast: { date: string; count: number }[];
  streak: number;
  longestStreak: number;
  totalReviews: number;
  leechCount: number;
  onBack: () => void;
}

function BarChart({ data, maxBars = 30 }: { data: { label: string; value: number }[]; maxBars?: number }) {
  const sliced = data.slice(-maxBars);
  const maxVal = Math.max(...sliced.map((d) => d.value), 1);

  return (
    <div className="stats-bar-chart">
      {sliced.map((d, i) => (
        <div key={i} className="stats-bar-col">
          <div
            className="stats-bar"
            style={{ height: `${(d.value / maxVal) * 100}%` }}
            title={`${d.label}: ${d.value}`}
          />
        </div>
      ))}
    </div>
  );
}

export function StatsView({
  reviewLog,
  retentionRate,
  cardStateCounts,
  hardestCards,
  cardStates,
  reviewForecast,
  streak,
  longestStreak,
  totalReviews,
  leechCount,
  onBack,
}: StatsViewProps) {
  const total = cardStateCounts.newCount + cardStateCounts.learning + cardStateCounts.mature;
  const maturePct = total > 0 ? Math.round((cardStateCounts.mature / total) * 100) : 0;
  const learningPct = total > 0 ? Math.round((cardStateCounts.learning / total) * 100) : 0;
  const newPct = total > 0 ? 100 - maturePct - learningPct : 0;

  const chartData = reviewLog.map((e) => ({
    label: e.date.slice(5), // MM-DD
    value: e.count,
  }));

  const forecastData = reviewForecast.map((e) => ({
    label: e.date.slice(5),
    value: e.count,
  }));

  return (
    <div className="container">
      <header>
        <button className="back-btn" onClick={onBack}>&#8592;</button>
        <h1>Statistics</h1>
      </header>

      {/* Overview stats */}
      <div className="stats-row">
        <div className="stat">
          <span className="stat-value">{totalReviews}</span>
          <span className="stat-label">Reviews</span>
        </div>
        <div className="stat">
          <span className="stat-value">{retentionRate}%</span>
          <span className="stat-label">Retention</span>
        </div>
        <div className="stat">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Streak</span>
        </div>
        <div className="stat">
          <span className="stat-value">{longestStreak}</span>
          <span className="stat-label">Best</span>
        </div>
      </div>

      {/* Card state breakdown */}
      <div className="stats-section">
        <h3 className="stats-section-title">Card States</h3>
        <div className="stats-state-bar">
          <div className="stats-state-new" style={{ width: `${newPct}%` }} />
          <div className="stats-state-learning" style={{ width: `${learningPct}%` }} />
          <div className="stats-state-mature" style={{ width: `${maturePct}%` }} />
        </div>
        <div className="stats-state-legend">
          <span className="stats-legend-item">
            <span className="stats-dot stats-dot-new" /> New ({cardStateCounts.newCount})
          </span>
          <span className="stats-legend-item">
            <span className="stats-dot stats-dot-learning" /> Learning ({cardStateCounts.learning})
          </span>
          <span className="stats-legend-item">
            <span className="stats-dot stats-dot-mature" /> Mature ({cardStateCounts.mature})
          </span>
        </div>
      </div>

      {/* Reviews per day */}
      {chartData.length > 0 && (
        <div className="stats-section">
          <h3 className="stats-section-title">Reviews per Day</h3>
          <BarChart data={chartData} />
        </div>
      )}

      {/* Forecast */}
      <div className="stats-section">
        <h3 className="stats-section-title">7-Day Forecast</h3>
        <BarChart data={forecastData} maxBars={7} />
        <div className="stats-forecast-labels">
          {forecastData.map((d, i) => (
            <span key={i} className="stats-forecast-label">{d.label}</span>
          ))}
        </div>
      </div>

      {/* Hardest cards */}
      {hardestCards.length > 0 && (
        <div className="stats-section">
          <h3 className="stats-section-title">Hardest Cards</h3>
          <div className="stats-hard-list">
            {hardestCards.map((card) => (
              <div key={card.id} className="stats-hard-item">
                <span className="stats-hard-front">{card.front.slice(0, 50)}</span>
                <span className="stats-hard-ease">
                  EF {cardStates[card.id]?.easeFactor.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leech count */}
      {leechCount > 0 && (
        <div className="stats-section">
          <div className="stats-leech-warning">
            &#9888; {leechCount} leech card{leechCount > 1 ? "s" : ""} detected — consider rewriting them
          </div>
        </div>
      )}

      <button className="btn-start" onClick={onBack} style={{ marginTop: "auto" }}>
        Back to dashboard
      </button>
    </div>
  );
}
