"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CastingWait } from "@/components/CastingWait";
import { MediaFrame } from "@/components/MediaFrame";
import { ScoreMeter } from "@/components/ScoreMeter";
import { StubBadge } from "@/components/StubBadge";
import { CANNED_PACK } from "@/lib/duel/pack";
import type { DuelSession, JudgeDetail } from "@/lib/duel/session";

type Step = "briefing" | "spells" | "casting" | "reveal" | "score" | "winner";

const STEPS: Step[] = [
  "briefing",
  "spells",
  "casting",
  "reveal",
  "score",
  "winner",
];

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function DuelClient() {
  const pack = CANNED_PACK;
  const [step, setStep] = useState<Step>("briefing");
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `duel-${Date.now()}`,
  );
  const [spellA, setSpellA] = useState("");
  const [spellB, setSpellB] = useState("");
  const [session, setSession] = useState<DuelSession | null>(null);
  const [judgeDetail, setJudgeDetail] = useState<JudgeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);

  const canCast = spellA.trim().length >= 3 && spellB.trim().length >= 3;

  async function castSpells(event: FormEvent) {
    event.preventDefault();
    if (!canCast) return;
    setError(null);
    setStep("casting");

    try {
      const [outA, outB] = await Promise.all([
        postJson<{ imageUrl: string }>("/api/cast", {
          beforeUrl: pack.beforeUrl,
          spell: spellA.trim(),
          seed: "a",
        }),
        postJson<{ imageUrl: string }>("/api/cast", {
          beforeUrl: pack.beforeUrl,
          spell: spellB.trim(),
          seed: "b",
        }),
      ]);

      const scored = await postJson<{
        session: DuelSession;
        judgeDetail: JudgeDetail;
      }>("/api/score", {
        sessionId,
        packId: pack.id,
        beforeUrl: pack.beforeUrl,
        afterUrl: pack.afterUrl,
        outAUrl: outA.imageUrl,
        outBUrl: outB.imageUrl,
        spellA: spellA.trim(),
        spellB: spellB.trim(),
        riddle: pack.riddle,
      });

      setSession(scored.session);
      setJudgeDetail(scored.judgeDetail);
      setStep("reveal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Casting fizzled.");
      setStep("spells");
    }
  }

  function resetDuel() {
    setSpellA("");
    setSpellB("");
    setSession(null);
    setJudgeDetail(null);
    setError(null);
    setStep("briefing");
  }

  const winnerName = session?.winner === "b" ? "Wizard B" : "Wizard A";

  const stepLabel = useMemo(
    () =>
      ({
        briefing: "Briefing",
        spells: "Spells",
        casting: "Casting",
        reveal: "Reveal",
        score: "Score",
        winner: "Winner",
      })[step],
    [step],
  );

  return (
    <div className="duel-shell">
      <header className="duel-top">
        <p className="eyebrow">Prompt Wizard Battles · POC</p>
        <h1>{pack.title}</h1>
        <ol className="stepper" aria-label="Duel steps">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={
                i === stepIndex ? "is-current" : i < stepIndex ? "is-done" : ""
              }
            >
              {s}
            </li>
          ))}
        </ol>
        <p className="sr-only">Current step: {stepLabel}</p>
      </header>

      {error ? (
        <p className="banner-error" role="alert">
          {error}
        </p>
      ) : null}

      {step === "briefing" ? (
        <section className="panel">
          <div className="panel-head">
            <h2>The riddle of the after</h2>
            <p className="lede">
              Same before. Same riddle. Two wizards. One spell each.
            </p>
          </div>
          <div className="brief-grid">
            <MediaFrame
              src={pack.beforeUrl}
              alt="Before: a sleepy thatched cottage on a hill"
              caption="Before"
              tone="plain"
            />
            <blockquote className="riddle">
              <p>{pack.riddle}</p>
              <footer>Shared riddle · hints at the true after</footer>
            </blockquote>
          </div>
          <div className="actions">
            <button type="button" className="btn primary" onClick={() => setStep("spells")}>
              Choose your spells
            </button>
          </div>
        </section>
      ) : null}

      {step === "spells" ? (
        <section className="panel">
          <div className="panel-head">
            <h2>Speak one spell each</h2>
            <p className="lede">
              The riddle still hangs in the air. Do not peek at the after —
              that is the whole sport.
            </p>
          </div>
          <blockquote className="riddle compact">
            <p>{pack.riddle}</p>
          </blockquote>
          <form className="spell-form" onSubmit={castSpells}>
            <div className="spell-grid">
              <label className="spell-card tone-a">
                <span className="wizard-name">Wizard A</span>
                <textarea
                  name="spellA"
                  rows={5}
                  required
                  minLength={3}
                  value={spellA}
                  onChange={(e) => setSpellA(e.target.value)}
                  placeholder="Speak your spell…"
                />
              </label>
              <label className="spell-card tone-b">
                <span className="wizard-name">Wizard B</span>
                <textarea
                  name="spellB"
                  rows={5}
                  required
                  minLength={3}
                  value={spellB}
                  onChange={(e) => setSpellB(e.target.value)}
                  placeholder="Speak your spell…"
                />
              </label>
            </div>
            <div className="actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => setStep("briefing")}
              >
                Back
              </button>
              <button type="submit" className="btn primary" disabled={!canCast}>
                Cast
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {step === "casting" ? (
        <section className="panel">
          <div className="panel-head">
            <h2>The circle holds</h2>
            <div className="badge-row">
              <StubBadge kind="gen" />
            </div>
          </div>
          <CastingWait />
        </section>
      ) : null}

      {step === "reveal" && session ? (
        <section className="panel">
          <div className="panel-head">
            <h2>Both outputs vs true after</h2>
            <div className="badge-row">
              {session.stubs.gen ? <StubBadge kind="gen" /> : null}
            </div>
          </div>
          <div className="reveal-grid">
            <MediaFrame
              src={session.outputs.a}
              alt="Wizard A generated output"
              caption="Wizard A"
              tone="a"
            />
            <MediaFrame
              src={pack.afterUrl}
              alt="True after image"
              caption="True after"
              tone="true"
            />
            <MediaFrame
              src={session.outputs.b}
              alt="Wizard B generated output"
              caption="Wizard B"
              tone="b"
            />
          </div>
          <div className="actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => setStep("score")}
            >
              Consult the scorekeeper
            </button>
          </div>
        </section>
      ) : null}

      {step === "score" && session && judgeDetail ? (
        <section className="panel">
          <div className="panel-head">
            <h2>Split scores</h2>
            <p className="lede">
              50% deterministic lexical match to the hidden method · 50%{" "}
              {judgeDetail.persona}
            </p>
            <div className="badge-row">
              {session.stubs.gen ? <StubBadge kind="gen" /> : null}
              {session.stubs.judge ? <StubBadge kind="judge" /> : null}
            </div>
          </div>
          <div className="score-grid">
            <article className="score-card tone-a">
              <h3>Wizard A</h3>
              <p className="spell-echo">“{session.spells.a}”</p>
              <ScoreMeter
                label="Deterministic"
                value={session.scores.a.deterministic}
                tone="a"
              />
              <ScoreMeter
                label="Personality judge"
                value={session.scores.a.judge}
                tone="a"
              />
              <ScoreMeter label="Total" value={session.scores.a.total} tone="gold" />
              <p className="commentary">{judgeDetail.a.commentary}</p>
              <ul className="rubric">
                {Object.entries(judgeDetail.a.rubric).map(([k, v]) => (
                  <li key={k}>
                    {k} <span>{v}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="score-card tone-b">
              <h3>Wizard B</h3>
              <p className="spell-echo">“{session.spells.b}”</p>
              <ScoreMeter
                label="Deterministic"
                value={session.scores.b.deterministic}
                tone="b"
              />
              <ScoreMeter
                label="Personality judge"
                value={session.scores.b.judge}
                tone="b"
              />
              <ScoreMeter label="Total" value={session.scores.b.total} tone="gold" />
              <p className="commentary">{judgeDetail.b.commentary}</p>
              <ul className="rubric">
                {Object.entries(judgeDetail.b.rubric).map(([k, v]) => (
                  <li key={k}>
                    {k} <span>{v}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <div className="actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => setStep("winner")}
            >
              Announce the victor
            </button>
          </div>
        </section>
      ) : null}

      {step === "winner" && session && judgeDetail ? (
        <section className="panel winner-panel">
          <div className="panel-head">
            <p className="eyebrow gold">The circle names a winner</p>
            <h2>{winnerName}</h2>
            <div className="badge-row">
              {session.stubs.gen ? <StubBadge kind="gen" /> : null}
              {session.stubs.judge ? <StubBadge kind="judge" /> : null}
            </div>
          </div>
          <p className="congrats">{session.congrats}</p>
          <p className="totals-line">
            {winnerName} {session.scores[session.winner].total} · the other
            wizard{" "}
            {session.winner === "a"
              ? session.scores.b.total
              : session.scores.a.total}
          </p>
          <p className="persona-note">Judged in the manner of {judgeDetail.persona}.</p>
          <div className="actions">
            <button type="button" className="btn ghost" onClick={resetDuel}>
              Duel again
            </button>
            <a className="btn primary" href="/">
              Back to landing
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
}
