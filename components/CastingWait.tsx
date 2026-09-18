export function CastingWait() {
  const glyphs = ["✦", "✧", "✶", "★", "☾", "⚡"];
  return (
    <div className="casting" role="status" aria-live="polite">
      <div className="casting-stage">
        <div className="casting-orb">
          <div className="casting-ring ring-a" />
          <div className="casting-ring ring-b" />
          <div className="casting-core">✦</div>
          {glyphs.map((g, i) => (
            <span key={`${g}-${i}`} className={`casting-glyph g-${i}`}>
              {g}
            </span>
          ))}
        </div>
        <div className="spark-clash" aria-hidden>
          <span className="spark spark-a" />
          <span className="spark spark-hit" />
          <span className="spark spark-b" />
        </div>
      </div>
      <p className="casting-kicker">Wait for the sparks</p>
      <p className="casting-copy">
        Both wizards cast at once. Teal vs magenta, same riddle — the circle
        waits on the slower spark, not the sum of both.
      </p>
    </div>
  );
}
