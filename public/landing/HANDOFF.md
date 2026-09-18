# Prompt Wizard Battles — Landing handoff

## Status
Visual blocks approved by Sam for POC demo wiring. Minimal single-page layout at `index.html`.

## Page order
1. Hero — `blocks/hero-v1.png`
2. How it works — `blocks/how-it-works-v1.png`
3. Learn by laughing — `blocks/learn-fun-v2.png` (v1 discarded)
4. The Duel — `blocks/duel-tease-v1.png`
5. The Judge — `blocks/judge-tease-v1.png`
6. CTA — `blocks/cta-v1.png`
7. Live text CTA pill (`#enter`) — placeholder link for real duel entry

## Paths (on Landing agent box)
- Page: `/workspace/pwb-landing/index.html`
- Assets: `/workspace/pwb-landing/blocks/*.png`
- Sizes: ~16:9 section banners; hero/duel/judge ~450KB; how-it-works ~319KB; CTA ~254KB; learn-fun-v2 ~447KB

## Still needs wiring (Build / duel UI)
- Hook "Enter the Arena" (nav + live CTA + image CTA) to the real duel flow / hosted route
- Wait-loop / generation animation lives in the duel experience, not this landing
- Optional: replace full-bleed image text with real HTML typography later; for POC, images carry copy
- Discard `learn-fun-v1.png` from shipping bundle (keep only v2)

## Tone lock
Playful wizard duel; fun while learning AI via "watch professor's transformation spell → replicate with your own prompt."
