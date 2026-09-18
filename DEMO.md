# Demo script — Prompt Wizard Battles POC

1. Open the public URL (or `npm run dev` locally).
2. Landing: skim approved banners (hero → how it works → learn-fun-v2 → duel tease → judge tease → cta) → click **Enter the Arena** (nav, image CTA, or `#enter` pill).
3. Briefing: note before image + riddle.
4. Enter Wizard A’s spell → Wizard B’s spell → **Cast**.
5. Wait: casting animation in the **duel UI** while both gens resolve (parallel).
6. Results: A output | true after | B output.
7. Scores: deterministic + judge + totals; stub badges if stubs on.
8. Winner: wizard name + funny congrats.

Expect stubs labeled until real gen/judge keys are set.

## Smoke

**PASS** (2026-09-18, local `npm run dev`, pre-landing-swap): briefing → two spells → casting (`stubbed gen`) → reveal A|after|B → scores (`stubbed gen` + `stubbed judge`, A 67 vs B 37) → winner Wizard A, “Please do not let this go to your hat.”

Landing swap + visual SoT follow in this PR; re-click `/` → **Enter the Arena** after deploy.

## Live demo (ephemeral tunnel)

- Public: https://meet-net-villa-weed.trycloudflare.com (Cloudflare quick tunnel; no card; dies when tunnel/box stops)
- Local: `npm run build && npm run start` → http://localhost:3000
