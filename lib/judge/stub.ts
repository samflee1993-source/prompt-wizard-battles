import type { JudgeProvider } from "@/lib/judge/types";

function fnv(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function bucket(n: number, min: number, max: number): number {
  return min + (n % (max - min + 1));
}

const QUIPS = [
  "Bold. Incorrect in places. I respect the audacity.",
  "This spell walked in wearing a cape and tripped on the hem.",
  "A respectable flourish. The after-image is still judging you, though.",
  "One star for drama, one star for almost reading the riddle.",
  "If pixels could sigh, they just did. Charming effort.",
  "Theatrical, slightly unhinged, and closer than it has any right to be.",
  "I have seen worse. I have also seen lunch. This sits between them.",
  "Notes of hubris, a finish of stained glass. Serve chilled.",
];

/**
 * Persona judge: stable 0–100 rubric from a hash of prompt + urls.
 * Witty one-liner, no LLM call.
 */
export class StubPersonalityJudge implements JudgeProvider {
  async score(input: {
    beforeUrl: string;
    afterUrl: string;
    outAUrl: string;
    outBUrl: string;
    spellA: string;
    spellB: string;
    riddle: string;
  }): Promise<{
    a: { score: number; rubric: Record<string, number>; commentary: string };
    b: { score: number; rubric: Record<string, number>; commentary: string };
    persona: string;
  }> {
    await new Promise((r) => setTimeout(r, 420));
    const persona = process.env.JUDGE_PERSONA?.trim() || "Archmage Snark";

    const scoreWizard = (spell: string, outUrl: string, salt: string) => {
      const key = `${spell}|${outUrl}|${input.afterUrl}|${input.riddle}|${salt}`;
      const h = fnv(key);
      const theatricality = bucket(h, 40, 96);
      const cunning = bucket(h >> 3, 32, 94);
      const resemblance = bucket(h >> 7, 28, 90);
      const panache = bucket(h >> 11, 45, 99);
      const score = Math.round(
        theatricality * 0.25 +
          cunning * 0.25 +
          resemblance * 0.3 +
          panache * 0.2,
      );
      return {
        score,
        rubric: { theatricality, cunning, resemblance, panache },
        commentary: QUIPS[h % QUIPS.length],
      };
    };

    return {
      persona,
      a: scoreWizard(input.spellA, input.outAUrl, "a"),
      b: scoreWizard(input.spellB, input.outBUrl, "b"),
    };
  }
}
