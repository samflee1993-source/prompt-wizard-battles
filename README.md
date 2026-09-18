# Prompt Wizard Battles (POC)

Two-wizard prompt duel: same **before** image + **riddle**, one **spell** each, gens in **parallel**, then a split score (50% deterministic / 50% personality judge) and a funny winner line.

Architecture: [`ARCHITECTURE.md`](./ARCHITECTURE.md). Click path: [`DEMO.md`](./DEMO.md).

## Status

Happy-path demo is clickable. Image gen and the personality judge are **labeled stubs** (no API keys). Landing visuals are placeholders until the Landing handoff.

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Follow `DEMO.md`.

Production-mode check:

```bash
npm run build
npm start
```

No `.env` is required for the stubbed POC. Optional keys are listed in [`.env.example`](./.env.example). Copy to `.env.local` only when wiring real providers; never commit secrets.

## Deploy to Vercel (from this GitHub repo)

1. In [Vercel](https://vercel.com), **Add New Project** and import `samflee1993-source/prompt-wizard-battles`.
2. Framework preset: **Next.js** (auto-detected). Root directory: repo root.
3. Env vars: leave empty for stubs. Later, set `IMAGE_GEN_*` / `JUDGE_*` from `.env.example`.
4. Deploy. The public URL should click through `DEMO.md` without paid APIs.

## What is stubbed

| Piece | Badge in UI | Implementation |
|-------|-------------|----------------|
| Landing visuals | `placeholder landing` | CSS blocks; `/public/landing/` reserved |
| Image gen | `stubbed gen` | `StubImageGen` via `POST /api/cast` |
| Personality judge | `stubbed judge` | `StubPersonalityJudge` via `POST /api/score` |
| Deterministic score | (not a stub) | lexical overlap of spell vs pack keywords |

Swap later behind `ImageGenProvider` and `JudgeProvider` without changing the duel step machine.
