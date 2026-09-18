const RUBRIC = ["theatricality", "cunning", "resemblance", "panache"] as const;

type AstralBoardProps = {
  persona: string;
  settled: boolean;
  quip: string;
};

export function AstralBoard({ persona, settled, quip }: AstralBoardProps) {
  return (
    <div
      className={`astral-board ${settled ? "is-settled" : "is-consulting"}`}
      role="status"
      aria-live="polite"
    >
      <div className="astral-halo" aria-hidden />
      <p className="astral-kicker">
        {settled ? "Verdict inked" : "Consulting the astral board…"}
      </p>
      <p className="astral-quip">
        {settled
          ? `Judged in the manner of ${persona}. Stubbed on purpose — no live LLM.`
          : quip}
      </p>
      <ul className="astral-runes">
        {RUBRIC.map((rune, i) => (
          <li key={rune} className={`astral-rune r-${i}`}>
            {rune}
          </li>
        ))}
      </ul>
    </div>
  );
}
