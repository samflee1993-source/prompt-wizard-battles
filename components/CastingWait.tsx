export function CastingWait() {
  const glyphs = ["ᛟ", "✦", "ᚠ", "✧", "ᚱ", "✶"];
  return (
    <div className="casting" role="status" aria-live="polite">
      <div className="casting-orb">
        <div className="casting-ring ring-a" />
        <div className="casting-ring ring-b" />
        <div className="casting-core">✦</div>
        {glyphs.map((g, i) => (
          <span key={g} className={`casting-glyph g-${i}`}>
            {g}
          </span>
        ))}
      </div>
      <p className="casting-kicker">Parallel weaving in progress</p>
      <p className="casting-copy">
        Wizard A and Wizard B cast at once. The circle waits on the slower
        spark — not the sum of both.
      </p>
    </div>
  );
}
