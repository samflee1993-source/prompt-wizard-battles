export function StubBadge({
  kind,
}: {
  kind: "gen" | "judge" | "landing";
}) {
  const label =
    kind === "gen"
      ? "stubbed gen"
      : kind === "judge"
        ? "stubbed judge"
        : "placeholder landing";
  return <span className={`badge badge-${kind}`}>{label}</span>;
}
