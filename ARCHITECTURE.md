# Prompt Wizard Battles — Architecture (POC)

Machine-friendly notes for a vaporware happy-path demo. Prefer stubbing expensive pieces behind real interfaces.

## Goal / DoD

Public URL that clicks through: **landing → duel → one-spell 90s wait → score → funny winner**.  
Happy path once is enough. No deep QA.

## Product lock

- Demo player **is Wizard A only**: **Nova Shipwright** (indigo cloak, rocket-wand). Tagline: ships the spell, not the deck.
- Opponent is a pretend rival, not a second player: **Synergy the Soft-Committed** (orange corporate salamander, standup sticky as staff). Name + avatar only — no Wizard B inputs / second spell field.
- Same **before** media + **riddle** (hints at prompt method behind real **after**).
- Nova submits **one spell** on a **90-second countdown**; auto-cast at 0 or Cast on submit, whichever first.
- Nova’s gen is stubbed; Synergy’s compare image is a **canned mock** (`stub-out-b.svg` until `/public/duel/pool/` stills exist). Not from a second prompt.
- Score = **50% deterministic** match-to-after + **50% personality LLM-judge** rubric (stub judge; no live LLM). Winner can still be Nova or Synergy from scores.
- Announce winning wizard + short spicy SaaSy congrats.
- Out of scope: brand system, CI matrices, features beyond this loop.

## Stack (as implemented)

| Layer | Choice | Why |
|-------|--------|-----|
| App | Next.js 15 App Router (TypeScript) | Fast to host; API routes for gen/judge stubs |
| Host | Vercel free tier from GitHub | Public URL without paid APIs for stubs |
| Media | Approved landing PNGs in `/public/landing/` + canned duel SVGs | Swap gen/judge later |
| State | Client step machine + one duel session id | No DB for POC |

Repo: `samflee1993-source/prompt-wizard-battles`.

## Repo layout

```
/
  README.md                 # run + deploy
  ARCHITECTURE.md           # this file
  DEMO.md                   # click script + smoke note
  .env.example              # future provider keys
  app/                      # App Router UI + API
    page.tsx                # landing (approved banners)
    duel/page.tsx           # duel step machine
    api/cast/route.ts       # POST /api/cast
    api/score/route.ts      # POST /api/score
  components/               # StubBadge, CastingWait, MediaFrame, ScoreMeter, WizardPortrait, AstralBoard
  lib/
    gen/                    # ImageGenProvider interface + StubImageGen
    judge/                  # JudgeProvider interface + StubPersonalityJudge
    score/                  # deterministicSimilarity + combineScores
    duel/                   # canned duel pack, session type, congrats, wizard roster
  public/
    landing/                # approved banners + index.html + HANDOFF.md
    duel/                   # before.svg, after.svg, stub-out-a.svg, stub-out-b.svg (rival mock)
```

## UI flow (steps)

1. **Landing** (`/`) — approved banners in page order; CTAs “Enter the Arena” → `/duel`.
2. **Duel briefing** (`/duel`) — Nova vs Synergy portraits, before media + riddle (shared).
3. **Spell input** — Nova only (90s timer). Synergy is a locked rival card.
4. **Casting** — wait animation; one gen call for Nova. Rival still is canned.
5. **Reveal** — Nova output | true after | Synergy mock.
6. **Score** — theatrical “consulting the astral board” (meters hunt, quips cycle), then stub/deterministic totals. No live LLM.
7. **Winner** — wizard name + funny congrats line.

Every stub surfaces a visible badge: `stubbed gen`, `stubbed judge`. Landing is approved visual SoT (not a stub). Duel UI reuses that palette, pill CTAs, and playful wizard tone.

## Data flow

```
[Landing CTA]
    → load DuelPack { beforeUrl, afterUrl, riddle, hintMethod, targetKeywords }
    → player spell { wizardA = Nova }  (90s auto-cast or submit)
    → gen.cast(before, spellA, seed a)
    → outputs { outA, outB = canned rival mock }
    → detA = deterministicSimilarity(spellA, targetKeywords)
    → detB = deterministicSimilarity(cannedRivalSpell, targetKeywords)
    → judge = judge.score({ before, after, outA, outB, spells, riddle })  // stub
    → total = round(0.5 * det + 0.5 * judge.personality)  (per wizard)
    → winner = argmax(total); tie-break higher det, then Nova
    → congrats = funnyLine(winner)
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

**Stub gen:** ignore spell semantics; return canned `stub-out-a.svg` after a short delay for Nova only. Synergy’s reveal image is the canned rival mock (`stub-out-b.svg`), not a second `/api/cast`.  
**Stub judge:** persona “Archmage Snark” (overridable via `JUDGE_PERSONA`); hash prompt+urls into stable 0–100 rubric buckets (theatricality, cunning, resemblance, panache) + witty one-liner. No live LLM.  
**Deterministic:** lexical overlap of the wizard’s spell against `pack.targetKeywords` (the hidden prompt-method the riddle hints at), mapped to ~14–98. Pure function in `lib/score/deterministic.ts`. Pixel/histogram distance was skipped because placeholder SVGs would barely move the score with user input.

## Scoring split

| Half | Weight | Implementation (POC) | Real plug-in |
|------|--------|----------------------|--------------|
| Deterministic | 0.5 | `deterministicSimilarity(spell, targetKeywords) → 0..100` | CLIP / LPIPS / embedding cosine vs after |
| Personality judge | 0.5 | StubPersonalityJudge rubric | LLM agent with fixed persona + rubric JSON schema |

`total = round(0.5 * det + 0.5 * judge)`. Tie-break: higher deterministic, then Nova.

## Env vars / secrets

| Var | Required for POC stubs | Used when |
|-----|------------------------|-----------|
| none | yes | Local + Vercel stubs-only |
| `IMAGE_GEN_API_KEY` | no | Real image gen provider |
| `IMAGE_GEN_PROVIDER` | no | `stub` \| `openai` \| `fal` \| … |
| `JUDGE_API_KEY` | no | Real LLM judge |
| `JUDGE_MODEL` | no | Model id for judge |
| `JUDGE_PERSONA` | no | Override default Archmage Snark |

Never commit `.env`. Empty `.env.example` lists the keys above. Unwired non-stub provider names log a warning and still use stubs.

## Stubs vs real

| Piece | POC | Real later |
|-------|-----|------------|
| Landing visuals | Approved banners (`hero-v1` … `cta-v1`, `learn-fun-v2`) | Optional HTML typography instead of image copy |
| Before / after / stub outs | Static SVG in `/public/duel` | Real pack assets / CDN |
| Image gen | `StubImageGen` | Provider behind `ImageGenProvider` |
| Judge | `StubPersonalityJudge` + theatrical astral-board animation | LLM + rubric agent |
| Deterministic score | Lexical overlap vs target keywords | Embedding / perceptual metric |
| Wait animation | CSS loop in duel UI | Optional Lottie |
| Persistence | None | Optional session store |

## Landing (wired)

Approved assets in `/public/landing/`, rendered by `app/page.tsx` in this order:

1. `hero-v1.png` (image CTA → `/duel`)
2. `how-it-works-v1.png`
3. `learn-fun-v2.png` (do not ship v1)
4. `duel-tease-v1.png`
5. `judge-tease-v1.png`
6. `cta-v1.png` (image CTA → `/duel`)
7. Live `#enter` pill → `/duel`

Nav **Enter the Arena** also goes to `/duel`. Wait-loop stays on the duel route.

Visual system (source of truth for landing **and** duel UI): dark purple `#14081f`, ink `#f5f0ff`, muted `#c9b8e8`, accent gold `#f5d76e`, CTA pill `#e8d4ff` on `#2a1840`, sticky header, rounded pill CTAs, full-bleed section banners, playful wizard tone.

## Smoke (once)

1. Open `/` → see landing CTA → `/duel`  
2. Enter duel → Nova vs Synergy, before + riddle visible  
3. Submit one Nova spell (or wait 90s) → casting animation  
4. See Nova | after | rival mock, split scores, winner + funny line  
5. Confirm stub badges visible; no second prompt UI  

Record pass/fail in `DEMO.md`.

## Non-goals

Paid APIs without Sam’s OK. Deep brand. Thorough test harness. Multiplayer auth. Real-time sockets.
