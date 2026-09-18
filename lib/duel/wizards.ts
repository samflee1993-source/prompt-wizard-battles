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
  /** Canned still — not from a second prompt. Swap for /duel/pool/* when those land. */
  mockOutUrl: "/duel/stub-out-b.svg",
  /** Hidden scoring prompt so the rival can still beat a weak ship. */
  mockSpell: CANNED_PACK.hintMethod,
} as const;

export const SPELL_SECONDS = 90;

export const EMPTY_SPELL_FALLBACK =
  "(silence — the 90 seconds shipped without a prompt)";
