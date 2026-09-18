import { CANNED_PACK } from "@/lib/duel/pack";

/** Player is always Wizard A. Rival B is display-only + canned mock. */
export const PLAYER = {
  id: "a" as const,
  name: "Nova Shipwright",
  shortName: "Nova",
  tagline: "Ships the spell, not the deck.",
} as const;

export const RIVAL = {
  id: "b" as const,
  name: "Synergy the Soft-Committed",
  shortName: "Synergy",
  tagline: "Joined via calendar hold. Still aligning on the prompt.",
  /** Strong-ish canned still from /public/duel/pool — not from a second prompt. */
  mockOutUrl: "/duel/pool/rival-mock.png",
  mockOutFallbackUrl: CANNED_PACK.stubOutB,
  /** Hidden scoring prompt matching the after-02 / strong-ish still. */
  mockSpell:
    "Turn this sleepy cottage into a tall crystal wizard spire at twilight, glowing stained glass, northern lights, rainbow prism rays.",
} as const;

export const SPELL_SECONDS = 90;

export const EMPTY_SPELL_FALLBACK =
  "(silence — the 90 seconds shipped without a prompt)";
