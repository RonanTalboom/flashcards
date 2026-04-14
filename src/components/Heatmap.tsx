import { useMemo, useState } from "react";
import type { ReviewLogEntry } from "../types";

function getDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function getIntensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 5) return 1;
  if (count <= 15) return 2;
  if (count <= 30) return 3;
  return 4;
}

const DAYS = ["M", "", "W", "", "F", "", ""];

export function Heatmap({ reviewLog }: { reviewLog: ReviewLogEntry[] }) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const logMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of reviewLog) m[e.date] = e.count;
    return m;
  }, [reviewLog]);

  // Build 13 weeks × 7 days grid (most recent on the right)
  const cells = useMemo(() => {
    const result: { date: string; count: number; col: number; row: number }[] = [];
    const todayDate = new Date();
    const todayDay = todayDate.getDay(); // 0=Sun
    // Adjust so Monday is 0
    const todayOffset = todayDay === 0 ? 6 : todayDay - 1;

    for (let i = 90; i >= 0; i--) {
      const date = getDaysAgo(i);
      const daysFromEnd = i;
      const totalDaysShown = 91;
      const cellIndex = totalDaysShown - 1 - daysFromEnd;
      const adjustedIndex = cellIndex + (6 - todayOffset);
      const col = Math.floor(adjustedIndex / 7);
      const row = adjustedIndex % 7;
      if (col >= 0 && col < 13) {
        result.push({ date, count: logMap[date] ?? 0, col, row });
      }
    }
    return result;
  }, [logMap]);

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-days">
        {DAYS.map((d, i) => (
          <span key={i} className="heatmap-day-label">{d}</span>
        ))}
      </div>
      <div className="heatmap-grid">
        {cells.map((cell) => (
          <div
            key={cell.date}
            className={`heatmap-cell heatmap-level-${getIntensity(cell.count)}`}
            style={{
              gridColumn: cell.col + 1,
              gridRow: cell.row + 1,
            }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({ date: cell.date, count: cell.count, x: rect.left, y: rect.top - 30 });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </div>
      {tooltip && (
        <div className="heatmap-tooltip" style={{ position: "fixed", left: tooltip.x, top: tooltip.y }}>
          {tooltip.date}: {tooltip.count} reviews
        </div>
      )}
    </div>
  );
}
