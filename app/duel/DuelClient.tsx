"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AstralBoard } from "@/components/AstralBoard";
import { CastingWait } from "@/components/CastingWait";
import { MediaFrame } from "@/components/MediaFrame";
import { ScoreMeter } from "@/components/ScoreMeter";
import { StubBadge } from "@/components/StubBadge";
import { WizardPortrait } from "@/components/WizardPortrait";
import { ASTRAL_QUIPS } from "@/lib/duel/astral";
import { CANNED_PACK } from "@/lib/duel/pack";
import type { DuelSession, JudgeDetail } from "@/lib/duel/session";
import {
  EMPTY_SPELL_FALLBACK,
  PLAYER,
  RIVAL,
  SPELL_SECONDS,
} from "@/lib/duel/wizards";

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

function formatClock(total: number): string {
  const s = Math.max(0, total);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, "0")}`;
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
  const [secondsLeft, setSecondsLeft] = useState(SPELL_SECONDS);
  const [session, setSession] = useState<DuelSession | null>(null);
  const [judgeDetail, setJudgeDetail] = useState<JudgeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [boardSettled, setBoardSettled] = useState(false);
  const [quipIndex, setQuipIndex] = useState(0);

  const spellRef = useRef(spellA);
  const busyRef = useRef(false);

  useEffect(() => {
    spellRef.current = spellA;
  }, [spellA]);

  const stepIndex = STEPS.indexOf(step);
  const canCast = spellA.trim().length >= 3;

  async function runCast(source: "submit" | "timer") {
    if (busyRef.current) return;
    const typed = spellRef.current.trim();
    if (source === "submit" && typed.length < 3) return;

    busyRef.current = true;
    setError(null);
    setStep("casting");

    const spellForA = typed.length >= 3 ? typed : EMPTY_SPELL_FALLBACK;

    try {
      const outA = await postJson<{ imageUrl: string }>("/api/cast", {
        beforeUrl: pack.beforeUrl,
        spell: spellForA,
        seed: "a",
      });

      const scored = await postJson<{
        session: DuelSession;
        judgeDetail: JudgeDetail;
      }>("/api/score", {
        sessionId,
        packId: pack.id,
        beforeUrl: pack.beforeUrl,
        afterUrl: pack.afterUrl,
        outAUrl: outA.imageUrl,
        outBUrl: RIVAL.mockOutUrl,
        spellA: spellForA,
        spellB: RIVAL.mockSpell,
        riddle: pack.riddle,
      });

      setSession(scored.session);
      setJudgeDetail(scored.judgeDetail);
      setStep("reveal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Casting fizzled.");
      busyRef.current = false;
      setStep("spells");
    }
  }

  useEffect(() => {
    if (step !== "spells") return;
    setSecondsLeft(SPELL_SECONDS);
    const started = Date.now();
    const id = window.setInterval(() => {
      const left = Math.max(
        0,
        SPELL_SECONDS - Math.floor((Date.now() - started) / 1000),
      );
      setSecondsLeft(left);
      if (left === 0) {
        window.clearInterval(id);
        void runCast("timer");
      }
    }, 250);
    return () => window.clearInterval(id);
    // Intentionally start a fresh 90s clock each time we enter spells.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void runCast("submit");
  }

  function resetDuel() {
    busyRef.current = false;
    setSpellA("");
    setSecondsLeft(SPELL_SECONDS);
    setSession(null);
    setJudgeDetail(null);
    setError(null);
    setBoardSettled(false);
    setQuipIndex(0);
    setStep("briefing");
  }

  useEffect(() => {
    if (step !== "score") {
      setBoardSettled(false);
      setQuipIndex(0);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setBoardSettled(true);
      return;
    }
    const quips = window.setInterval(() => {
      setQuipIndex((n) => n + 1);
    }, 700);
    const settle = window.setTimeout(() => {
      window.clearInterval(quips);
      setBoardSettled(true);
    }, 3200);
    return () => {
      window.clearInterval(quips);
      window.clearTimeout(settle);
    };
  }, [step]);

  const winnerName =
    session?.winner === "b" ? RIVAL.name : PLAYER.name;

  const stepLabel = useMemo(
    () =>
      ({
        briefing: "Briefing",
        spells: "Spell",
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
        <p className="eyebrow">One riddle. One spell. A calendar-hold rival.</p>
        <h1>{pack.title}</h1>
        <Matchup />
        <ol className="stepper" aria-label="Duel steps">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={
                i === stepIndex ? "is-current" : i < stepIndex ? "is-done" : ""
              }
            >
              {s === "spells" ? "spell" : s}
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
            <h2>Get the riddle</h2>
            <p className="lede">
              You are {PLAYER.name}. {RIVAL.name} is already on the invite —
              name and face only, no second prompt. Watch the before, then
              ship one spell before the clock does it for you.
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
            <button
              type="button"
              className="btn primary"
              onClick={() => setStep("spells")}
            >
              Speak your spell
            </button>
          </div>
        </section>
      ) : null}

      {step === "spells" ? (
        <section className="panel">
          <div className="panel-head">
            <h2>Cast your prompt</h2>
            <p className="lede">
              Ninety seconds. Cast when you are ready — or the circle auto-casts
              at zero. Do not peek at the after. {RIVAL.shortName} is not
              taking notes from you.
            </p>
          </div>
          <div
            className={`countdown ${secondsLeft <= 10 ? "is-low" : ""}`}
            role="timer"
            aria-live="polite"
            aria-label={`${secondsLeft} seconds remaining`}
          >
            <span className="countdown-label">Ship window</span>
            <span className="countdown-clock">{formatClock(secondsLeft)}</span>
            <span
              className="countdown-bar"
              aria-hidden
              style={{
                width: `${(secondsLeft / SPELL_SECONDS) * 100}%`,
              }}
            />
          </div>
          <blockquote className="riddle compact">
            <p>{pack.riddle}</p>
          </blockquote>
          <form className="spell-form" onSubmit={onSubmit}>
            <div className="spell-grid single-player">
              <label className="spell-card tone-a spellbook">
                <span className="wizard-chip">
                  <WizardPortrait who="a" size="sm" />
                  <span>
                    <span className="wizard-name">{PLAYER.name}</span>
                    <span className="wizard-tag">{PLAYER.tagline}</span>
                  </span>
                </span>
                <div className="spellbook-field">
                  <span className="spellbook-corner c-tl" aria-hidden />
                  <span className="spellbook-corner c-tr" aria-hidden />
                  <span className="spellbook-corner c-bl" aria-hidden />
                  <span className="spellbook-corner c-br" aria-hidden />
                  <p className="spellbook-kicker">
                    Grimoire of Nova · one cantrip · no stakeholder deck
                  </p>
                  <textarea
                    className="spellbook-ink"
                    name="spellA"
                    rows={6}
                    minLength={3}
                    value={spellA}
                    onChange={(e) => setSpellA(e.target.value)}
                    placeholder="Ink the transformation. Ship the spell, not the deck…"
                  />
                  <p className="spellbook-foot">
                    ✦ Runes accept metaphors · ☾ auto-casts at zero · Synergy is
                    not CC’d
                  </p>
                </div>
              </label>
              <aside className="spell-card tone-b rival-card">
                <span className="wizard-chip">
                  <WizardPortrait who="b" size="sm" />
                  <span>
                    <span className="wizard-name">{RIVAL.name}</span>
                    <span className="wizard-tag">{RIVAL.tagline}</span>
                  </span>
                </span>
                <div className="rival-seal" aria-hidden>
                  <span className="wax-seal">HOLD</span>
                </div>
                <p className="rival-lock">
                  Sealed calendar hold. No second prompt, no input, no “quick
                  sync.” The salamander is aligning offline on a canned mock.
                </p>
              </aside>
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
                Cast · ship it
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {step === "casting" ? (
        <section className="panel">
          <div className="panel-head">
            <h2>Wait for the sparks</h2>
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
            <h2>Cast. Wait. Compare.</h2>
            <p className="lede">
              {PLAYER.shortName}’s stub gen · true after · {RIVAL.shortName}’s
              canned mock (not from a second prompt).
            </p>
            <div className="badge-row">
              {session.stubs.gen ? <StubBadge kind="gen" /> : null}
            </div>
          </div>
          <div className="reveal-grid">
            <MediaFrame
              src={session.outputs.a}
              alt={`${PLAYER.name} generated output`}
              caption={PLAYER.name}
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
              alt={`${RIVAL.name} mock rival creation`}
              caption={`${RIVAL.name} · mock`}
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
            <h2>The Judge</h2>
            <p className="lede">
              Personality theater. Half-deterministic. Fully ridiculous — 50%
              lexical match · 50% {judgeDetail.persona}. No live LLM.
            </p>
            <div className="badge-row">
              {session.stubs.gen ? <StubBadge kind="gen" /> : null}
              {session.stubs.judge ? <StubBadge kind="judge" /> : null}
            </div>
          </div>
          <AstralBoard
            persona={judgeDetail.persona}
            settled={boardSettled}
            quip={ASTRAL_QUIPS[quipIndex % ASTRAL_QUIPS.length]}
          />
          <div className="score-grid">
            <article className="score-card tone-a">
              <h3>
                <WizardPortrait who="a" size="sm" /> {PLAYER.name}
              </h3>
              <p className="spell-echo">“{session.spells.a}”</p>
              <ScoreMeter
                label="Deterministic"
                value={session.scores.a.deterministic}
                tone="a"
                play={boardSettled}
                delayMs={80}
              />
              <ScoreMeter
                label="Personality judge"
                value={session.scores.a.judge}
                tone="a"
                play={boardSettled}
                delayMs={420}
              />
              <ScoreMeter
                label="Total"
                value={session.scores.a.total}
                tone="gold"
                play={boardSettled}
                delayMs={860}
              />
              <p className="commentary">
                {boardSettled
                  ? judgeDetail.a.commentary
                  : "Archmage Snark is still tasting the cape…"}
              </p>
              <ul className="rubric">
                {Object.entries(judgeDetail.a.rubric).map(([k, v]) => (
                  <li key={k}>
                    {k} <span>{boardSettled ? v : "✶"}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="score-card tone-b">
              <h3>
                <WizardPortrait who="b" size="sm" /> {RIVAL.name}
              </h3>
              <p className="spell-echo">
                Canned rival mock — not from a second prompt. Synergy is still
                aligning.
              </p>
              <ScoreMeter
                label="Deterministic"
                value={session.scores.b.deterministic}
                tone="b"
                play={boardSettled}
                delayMs={160}
              />
              <ScoreMeter
                label="Personality judge"
                value={session.scores.b.judge}
                tone="b"
                play={boardSettled}
                delayMs={500}
              />
              <ScoreMeter
                label="Total"
                value={session.scores.b.total}
                tone="gold"
                play={boardSettled}
                delayMs={980}
              />
              <p className="commentary">
                {boardSettled
                  ? judgeDetail.b.commentary
                  : "The sticky is in the parking lot of the astral plane…"}
              </p>
              <ul className="rubric">
                {Object.entries(judgeDetail.b.rubric).map(([k, v]) => (
                  <li key={k}>
                    {k} <span>{boardSettled ? v : "✶"}</span>
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
              disabled={!boardSettled}
            >
              Announce the victor
            </button>
          </div>
        </section>
      ) : null}

      {step === "winner" && session && judgeDetail ? (
        <section className="panel winner-panel">
          <div className="panel-head">
            <p className="eyebrow gold">Funny verdict. No sacred cows.</p>
            <div className="winner-face">
              <WizardPortrait
                who={session.winner}
                size="lg"
              />
            </div>
            <h2>{winnerName}</h2>
            <div className="badge-row">
              {session.stubs.gen ? <StubBadge kind="gen" /> : null}
              {session.stubs.judge ? <StubBadge kind="judge" /> : null}
            </div>
          </div>
          <p className="congrats">{session.congrats}</p>
          <p className="totals-line">
            {PLAYER.name} {session.scores.a.total} · {RIVAL.name}{" "}
            {session.scores.b.total}
          </p>
          <p className="persona-note">Judged in the manner of {judgeDetail.persona}.</p>
          <div className="actions">
            <button type="button" className="btn ghost" onClick={resetDuel}>
              Duel again
            </button>
            <a className="btn primary" href="/">
              Back to the banners
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Matchup() {
  return (
    <div className="matchup" aria-label={`${PLAYER.name} versus ${RIVAL.name}`}>
      <div className="matchup-side">
        <WizardPortrait who="a" size="md" />
        <div>
          <p className="matchup-name">{PLAYER.name}</p>
          <p className="matchup-tag">{PLAYER.tagline}</p>
        </div>
      </div>
      <p className="matchup-vs">vs</p>
      <div className="matchup-side">
        <WizardPortrait who="b" size="md" />
        <div>
          <p className="matchup-name">{RIVAL.name}</p>
          <p className="matchup-tag">{RIVAL.tagline}</p>
        </div>
      </div>
    </div>
  );
}
