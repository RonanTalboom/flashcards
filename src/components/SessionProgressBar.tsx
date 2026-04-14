export function SessionProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="session-progress">
      <div className="session-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
