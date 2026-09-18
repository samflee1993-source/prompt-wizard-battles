export type WizardId = "a" | "b";

export type WizardScores = {
  deterministic: number;
  judge: number;
  total: number;
};

export type DuelSession = {
  id: string;
  packId: string;
  spells: { a: string; b: string };
  outputs: { a: string; b: string };
  scores: {
    a: WizardScores;
    b: WizardScores;
  };
  winner: WizardId;
  congrats: string;
  stubs: { gen: boolean; judge: boolean };
};

export type JudgeDetail = {
  persona: string;
  a: { rubric: Record<string, number>; commentary: string };
  b: { rubric: Record<string, number>; commentary: string };
};
