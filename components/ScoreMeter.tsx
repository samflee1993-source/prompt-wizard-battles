type ScoreMeterProps = {
  label: string;
  value: number;
  tone?: "a" | "b" | "gold";
  /** When false, the bar hunts. When true, it fills to `value`. */
  play?: boolean;
  delayMs?: number;
};

export function ScoreMeter({
  label,
  value,
  tone,
  play = true,
  delayMs = 0,
}: ScoreMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`meter tone-${tone ?? "gold"} ${play ? "is-playing" : "is-hunting"}`}
    >
      <div className="meter-row">
        <span>{label}</span>
        <strong>{play ? clamped : "···"}</strong>
      </div>
      <div className="meter-track" aria-hidden>
        <div
          className="meter-fill"
          style={
            play
              ? { width: `${clamped}%`, transitionDelay: `${delayMs}ms` }
              : undefined
          }
        />
      </div>
    </div>
  );
}
