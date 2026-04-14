export function DailyGoalRing({
  current,
  goal,
}: {
  current: number;
  goal: number;
}) {
  const pct = Math.min(current / goal, 1);
  const complete = pct >= 1;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className={`daily-goal-ring ${complete ? "goal-complete" : ""}`}>
      <svg viewBox="0 0 80 80" width="80" height="80">
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="5"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={complete ? "var(--green)" : "var(--accent)"}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="goal-text">
        <span className="goal-count">{current}</span>
        <span className="goal-target">/{goal}</span>
      </div>
      {complete && <span className="goal-check">&#10003;</span>}
    </div>
  );
}
