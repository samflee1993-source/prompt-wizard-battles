# Prompt Wizard Battles — Architecture (POC)

Machine-friendly notes for a vaporware happy-path demo. Prefer stubbing expensive pieces behind real interfaces.

## Goal / DoD

Public URL that clicks through: **landing → duel → parallel casting wait → score → funny winner**.  
Happy path once is enough. No deep QA.

## Product lock

- Both players = wizards.
- Same **before** media + **riddle** (hints at prompt method behind real **after**).
- Each submits **one spell** (prompt).
- Gens run **in parallel**; wait animation loops.
- Score = **50% deterministic** match-to-after + **50% personality LLM-judge** rubric.
- Announce winning wizard + short funny congrats.
- Out of scope: brand system, CI matrices, features beyond this loop.

## Proposed stack (thinnest public)

| Layer | Choice | Why |
|-------|--------|-----|
| App | Next.js App Router (TypeScript) **or** Vite + React + one serverless API | Fast to host; API routes for gen/judge stubs |
| Host | Vercel free tier from GitHub | Public URL without paid APIs for stubs |
| Media | Static placeholders in `/public/duel/` | Swap Landing assets later |
| State | Client step machine + one duel session id | No DB for POC |

Repo target: `samflee1993-source/prompt-wizard-battles` (or Origin later).

## Repo layout (target)

```
/
  README.md                 # run + deploy
  ARCHITECTURE.md           # this file
  DEMO.md                   # click script
  app/ or src/              # UI steps
  lib/
    gen/                    # ImageGenProvider interface + StubImageGen
    judge/                  # JudgeProvider interface + StubPersonalityJudge
    score/                  # deterministicSimilarity + combineScores
    duel/                   # canned duel pack (before, after, riddle)
  public/
    landing/                # placeholder until Landing handoff
    duel/                   # before.png, after.png, stub outputs
  api/ or app/api/          # POST /api/cast, POST /api/score
```

## UI flow (steps)

1. **Landing** — placeholder blocks; CTA “Enter the duel”.
2. **Duel briefing** — before media + riddle (shared).
3. **Spell input** — Wizard A + Wizard B each one prompt (sequential or side-by-side).
4. **Casting** — wait animation; fire two gen calls in parallel.
5. **Reveal** — Wizard A output | true after | Wizard B output.
6. **Score** — show split: deterministic / judge / total.
7. **Winner** — wizard name + funny congrats line.

Every stub surfaces a visible badge: `stubbed gen`, `stubbed judge`.

## Data flow

```
[Landing CTA]
    → load DuelPack { beforeUrl, afterUrl, riddle, hintMethod? }
    → user spells { wizardA, wizardB }
    → Promise.all([ gen.cast(before, spellA), gen.cast(before, spellB) ])
    → outputs { outA, outB }
    → detA = similarity(outA, after); detB = similarity(outB, after)
    → judge = judge.score({ before, after, outA, outB, spells, riddle })
    → total = 0.5 * det + 0.5 * judge.personality  (per wizard)
    → winner = argmax(total); congrats = funnyLine(winner)
```

Session shape (client or API):

```ts
type DuelSession = {
  id: string
  packId: string
  spells: { a: string; b: string }
  outputs: { a: string; b: string }      // image URLs
  scores: {
    a: { deterministic: number; judge: number; total: number }
    b: { deterministic: number; judge: number; total: number }
  }
  winner: 'a' | 'b'
  congrats: string
  stubs: { gen: boolean; judge: boolean }
}
```

## Interfaces (swap stubs later)

```ts
// lib/gen/types.ts
export interface ImageGenProvider {
  cast(input: { beforeUrl: string; spell: string; seed?: string }): Promise<{ imageUrl: string; meta?: Record<string, unknown> }>
}

// lib/judge/types.ts
export interface JudgeProvider {
  score(input: {
    beforeUrl: string
    afterUrl: string
    outAUrl: string
    outBUrl: string
    spellA: string
    spellB: string
    riddle: string
  }): Promise<{
    a: { score: number; rubric: Record<string, number>; commentary: string }
    b: { score: number; rubric: Record<string, number>; commentary: string }
    persona: string
  }>
}
```

**Stub gen:** ignore spell semantics; return canned `stub-out-a.png` / `stub-out-b.png` after a short delay (simulate parallel latency).  
**Stub judge:** persona e.g. “Archmage Snark”; hash prompt+urls into stable 0–100 rubric buckets + witty one-liner.  
**Deterministic:** POC = pixel/histogram distance on placeholders, or lexical overlap of spell vs riddle keywords mapped to 0–100 — document which; keep pure function in `lib/score/deterministic.ts`.

## Scoring split

| Half | Weight | Implementation (POC) | Real plug-in |
|------|--------|----------------------|--------------|
| Deterministic | 0.5 | `deterministicSimilarity(out, after) → 0..100` | CLIP / LPIPS / embedding cosine vs after |
| Personality judge | 0.5 | StubPersonalityJudge rubric | LLM agent with fixed persona + rubric JSON schema |

`total = round(0.5 * det + 0.5 * judge)`. Tie-break: higher deterministic, then Wizard A.

## Env vars / secrets

| Var | Required for POC stubs | Used when |
|-----|------------------------|-----------|
| none | yes | Local + Vercel stubs-only |
| `IMAGE_GEN_API_KEY` | no | Real image gen provider |
| `IMAGE_GEN_PROVIDER` | no | `stub` \| `openai` \| `fal` \| … |
| `JUDGE_API_KEY` | no | Real LLM judge |
| `JUDGE_MODEL` | no | Model id for judge |
| `JUDGE_PERSONA` | no | Override default Archmage Snark |

Never commit `.env`. Empty `.env.example` lists the keys above.

## Stubs vs real

| Piece | POC | Real later |
|-------|-----|------------|
| Landing visuals | Placeholder HTML/CSS | Approved Landing blocks + markup |
| Before / after / stub outs | Static files in `/public` | Real pack assets / CDN |
| Image gen | `StubImageGen` | Provider behind `ImageGenProvider` |
| Judge | `StubPersonalityJudge` | LLM + rubric agent |
| Deterministic score | Simple local metric | Embedding / perceptual metric |
| Wait animation | CSS loop | Optional Lottie from Landing |
| Persistence | None | Optional session store |

## Landing handoff (when ready)

Expect from Landing / Orchestrator:

1. Approved section images (paths or URLs)
2. Minimal HTML/CSS (or section markup)
3. Note: sizes + what still needs duel wiring

Wire into `/public/landing/` + landing route; keep duel routes unchanged.

## Smoke (once)

1. Open `/` → see landing CTA  
2. Enter duel → before + riddle visible  
3. Submit two spells → casting animation  
4. See both outs vs after, split scores, winner + funny line  
5. Confirm stub badges visible  

Record pass/fail in `DEMO.md`.

## Non-goals

Paid APIs without Sam’s OK. Deep brand. Thorough test harness. Multiplayer auth. Real-time sockets.
