import type { WizardId, WizardScores } from "@/lib/duel/session";

export function combineScores(deterministic: number, judge: number): number {
  return Math.round(0.5 * deterministic + 0.5 * judge);
}

export function pickWinner(a: WizardScores, b: WizardScores): WizardId {
  if (a.total !== b.total) return a.total > b.total ? "a" : "b";
  if (a.deterministic !== b.deterministic) {
    return a.deterministic > b.deterministic ? "a" : "b";
  }
  return "a";
}

export function withTotals(
  deterministic: number,
  judge: number,
): WizardScores {
  return {
    deterministic,
    judge,
    total: combineScores(deterministic, judge),
  };
}
