export interface JudgeProvider {
  score(input: {
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
  }>;
}
