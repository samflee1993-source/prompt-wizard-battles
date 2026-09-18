# Prompt Wizard Battles — Landing handoff

## Status
Visual blocks approved by Sam and wired into the Next.js landing at `/` (`app/page.tsx`). Source-of-truth markup also kept here as `index.html`.

## Page order
1. Hero — `hero-v1.png` (image CTA → `/duel`)
2. How it works — `how-it-works-v1.png`
3. Learn by laughing — `learn-fun-v2.png` (v1 discarded)
4. The Duel — `duel-tease-v1.png`
5. The Judge — `judge-tease-v1.png`
6. CTA — `cta-v1.png` (image CTA → `/duel`)
7. Live text CTA pill (`#enter`) → `/duel`

## Wiring (done)
- Nav **Enter the Arena**, live `#enter`, and image CTAs (hero + cta) go to `/duel`
- Wait-loop / generation animation lives in the duel UI, not landing
- Duel screens reuse this visual system (palette, pill CTAs, playful wizard tone)
- `learn-fun-v1.png` is not shipped

## Tone lock
Playful wizard duel; fun while learning AI via "watch professor's transformation spell → replicate with your own prompt."
