import { NextResponse } from "next/server";
import { funnyLine } from "@/lib/duel/congrats";
import { getPack } from "@/lib/duel/pack";
import type { DuelSession, JudgeDetail } from "@/lib/duel/session";
import { isGenStubbed } from "@/lib/gen";
import { getJudgeProvider, isJudgeStubbed } from "@/lib/judge";
import { pickWinner, withTotals } from "@/lib/score/combine";
import { deterministicSimilarity } from "@/lib/score/deterministic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    sessionId,
    packId,
    beforeUrl,
    afterUrl,
    outAUrl,
    outBUrl,
    spellA,
    spellB,
    riddle,
  } = (body ?? {}) as Record<string, string | undefined>;

  if (!spellA?.trim() || !spellB?.trim()) {
    return NextResponse.json(
      { error: "spellA and spellB required" },
      { status: 400 },
    );
  }
  if (!outAUrl || !outBUrl || !beforeUrl || !afterUrl || !riddle) {
    return NextResponse.json(
      { error: "image urls and riddle required" },
      { status: 400 },
    );
  }

  const pack = getPack(packId);
  const id = sessionId?.trim() || crypto.randomUUID();

  const detA = deterministicSimilarity(spellA, pack.targetKeywords);
  const detB = deterministicSimilarity(spellB, pack.targetKeywords);

  const judge = getJudgeProvider();
  const judged = await judge.score({
    beforeUrl,
    afterUrl,
    outAUrl,
    outBUrl,
    spellA: spellA.trim(),
    spellB: spellB.trim(),
    riddle,
  });

  const scores = {
    a: withTotals(detA, judged.a.score),
    b: withTotals(detB, judged.b.score),
  };
  const winner = pickWinner(scores.a, scores.b);

  const session: DuelSession = {
    id,
    packId: pack.id,
    spells: { a: spellA.trim(), b: spellB.trim() },
    outputs: { a: outAUrl, b: outBUrl },
    scores,
    winner,
    congrats: funnyLine(winner, id),
    stubs: { gen: isGenStubbed(), judge: isJudgeStubbed() },
  };

  const judgeDetail: JudgeDetail = {
    persona: judged.persona,
    a: { rubric: judged.a.rubric, commentary: judged.a.commentary },
    b: { rubric: judged.b.rubric, commentary: judged.b.commentary },
  };

  return NextResponse.json({ session, judgeDetail });
}
