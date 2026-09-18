import type { WizardId } from "@/lib/duel/session";

const LINES: Record<WizardId, string[]> = {
  a: [
    "Wizard A takes the circle. Wizard B may retrieve their dignity from lost-and-found.",
    "The after-image curtsied for Wizard A. Barely, but it counted.",
    "Archmage Snark awards Wizard A the slightly less soggy laurel.",
    "Wizard A wins. Please do not let this go to your hat.",
  ],
  b: [
    "Wizard B’s spell had main-character energy. The pixels agreed.",
    "Wizard B takes the duel. Wizard A is invited to try a simpler cantrip.",
    "Congrats, Wizard B. The cottage will never psychologically recover.",
    "Wizard B wins. Try not to gloat in iambic pentameter.",
  ],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function funnyLine(winner: WizardId, sessionId: string): string {
  const pool = LINES[winner];
  return pool[hash(`${winner}:${sessionId}`) % pool.length];
}
