import { StubPersonalityJudge } from "@/lib/judge/stub";
import type { JudgeProvider } from "@/lib/judge/types";

export type { JudgeProvider } from "@/lib/judge/types";

export function getJudgeProvider(): JudgeProvider {
  if (process.env.JUDGE_API_KEY) {
    console.warn(
      "[judge] JUDGE_API_KEY is set but no real judge is wired; using StubPersonalityJudge",
    );
  }
  return new StubPersonalityJudge();
}

export function isJudgeStubbed(): boolean {
  return !process.env.JUDGE_API_KEY;
}
