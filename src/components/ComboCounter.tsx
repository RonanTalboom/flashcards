export function ComboCounter({ count }: { count: number }) {
  if (count < 3) return null;

  return (
    <div className={`combo-counter ${count >= 10 ? "combo-fire" : ""}`}>
      <span className="combo-number">{count}</span>
      <span className="combo-label">combo</span>
    </div>
  );
}
