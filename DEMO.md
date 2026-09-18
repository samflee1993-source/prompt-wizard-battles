# Demo script — Prompt Wizard Battles POC

1. Open the public URL (or `npm run dev` locally).
2. Landing: skim approved banners (hero → how it works → learn-fun-v2 → duel tease → judge tease → cta) → click **Enter the Arena** (nav, image CTA, or `#enter` pill).
3. Briefing: you are **Nova Shipwright** (indigo cloak, rocket-wand) vs pretend rival **Synergy the Soft-Committed** (orange salamander, standup sticky). Note cinematic **before.png** cottage **and** **Target after** (`after.png`) plus the riddle (hints cottage → crystalline wizard tower at dusk, stained-glass, aurora, prism light). No Wizard B inputs anywhere.
4. Spell: **one** ornate spellbook field for Nova only + 90-second countdown. Synergy is name + avatar + status only (no input): starts as “Synergy is still casting…”, then after ~10s “Your foe hath made their move.” **Cast · ship it** or wait for auto-cast at 0.
5. Wait: casting animation in the **duel UI** while Nova’s stub gen resolves. Rival output is `/duel/pool/rival-mock.png` (canned, not a second prompt).
6. Results (top → bottom): professor **Before** + **Target after** (same stills as briefing) → Nova’s transformation → Synergy mock. Not A | after | B.
7. Scores: **consulting the astral board** theater (hunting meters, cycling persona quips, rubric runes). Then stub/deterministic totals fill in. Stub badges stay on. **No live LLM.** Winner can still be Nova or Synergy from scores.
8. Winner: wizard name + spicy Grok × SaaSy congrats.

Expect stubs labeled until real gen/judge keys are set. JudgeProvider stays parked on the stub.

## Smoke

**PASS** (2026-09-18, local `npm run dev`): `/` → **Enter the Arena** → briefing (Nova vs Synergy, before cottage still) → one spellbook + 90s timer → Cast · ship it → stubbed gen → reveal Nova | after | Synergy mock (illustrations paint) → astral-board theater → stub scores → winner. No second prompt UI. No live LLM.

Previous two-spell same-browser UI is gone.
