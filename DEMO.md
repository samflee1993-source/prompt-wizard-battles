# Demo script — Prompt Wizard Battles POC

1. Open the public URL (or `npm run dev` locally).
2. Landing: skim approved banners (hero → how it works → learn-fun-v2 → duel tease → judge tease → cta) → click **Enter the Arena** (nav, image CTA, or `#enter` pill).
3. Briefing: you are **Nova Shipwright** (indigo cloak, rocket-wand) vs pretend rival **Synergy the Soft-Committed** (orange salamander, standup sticky). Note before image + riddle.
4. Spell: **one** prompt field for Nova only. Synergy is name + avatar, not controllable. 90-second countdown. **Cast** or wait for auto-cast at 0.
5. Wait: casting animation in the **duel UI** while Nova’s stub gen resolves. Rival output is a canned mock (not a second prompt).
6. Results: Nova output | true after | Synergy mock.
7. Scores: deterministic + judge + totals; stub badges if stubs on. Winner can still be Nova or Synergy from scores.
8. Winner: wizard name + spicy SaaSy congrats.

Expect stubs labeled until real gen/judge keys are set. No live LLM judge in this POC.

## Smoke

Supersedes the two-wizard same-browser path. Re-click `/` → **Enter the Arena** → briefing (Nova vs Synergy) → **one** Nova spell + 90s timer → Cast → stubbed gen → reveal Nova | after | Synergy mock → scores → winner.

Previous two-spell smoke (2026-09-18): briefing → two spells → casting → reveal A|after|B → A 67 vs B 37 → “Please do not let this go to your hat.” That UI is gone.

## Live demo (ephemeral tunnel)

- Public: https://meet-net-villa-weed.trycloudflare.com (Cloudflare quick tunnel; no card; dies when tunnel/box stops)
- Local: `npm run build && npm run start` → http://localhost:3000
