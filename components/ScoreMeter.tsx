export function ScoreMeter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "a" | "b" | "gold";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`meter tone-${tone ?? "gold"}`}>
      <div className="meter-row">
        <span>{label}</span>
        <strong>{clamped}</strong>
      </div>
      <div className="meter-track" aria-hidden>
        <div className="meter-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
