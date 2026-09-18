export type DuelPack = {
  id: string;
  title: string;
  beforeUrl: string;
  beforeFallbackUrl: string;
  afterUrl: string;
  afterFallbackUrl: string;
  riddle: string;
  hintMethod: string;
  targetKeywords: string[];
  stubOutA: string;
  stubOutB: string;
};

/** Canned happy-path pack. PNG stills preferred; SVG stubs are fallback. */
export const CANNED_PACK: DuelPack = {
  id: "cottage-to-spire",
  title: "The Hearth That Learned to Sing",
  beforeUrl: "/duel/before.png",
  beforeFallbackUrl: "/duel/before.svg",
  afterUrl: "/duel/after.png",
  afterFallbackUrl: "/duel/after.svg",
  riddle:
    "Timber dreamed of starlight. The hearth grew a crown of glass. What craft raised a singing spire from a sleepy cottage?",
  hintMethod:
    "Transform the thatched cottage into a crystalline wizard tower at dusk with stained-glass windows, an aurora sky, and prism light.",
  targetKeywords: [
    "crystal",
    "crystalline",
    "tower",
    "spire",
    "glass",
    "stained",
    "dusk",
    "aurora",
    "prism",
    "wizard",
    "cottage",
    "transform",
    "starlight",
    "hearth",
    "thatched",
    "singing",
  ],
  stubOutA: "/duel/stub-out-a.svg",
  stubOutB: "/duel/stub-out-b.svg",
};

export function getPack(packId?: string): DuelPack {
  if (!packId || packId === CANNED_PACK.id) return CANNED_PACK;
  return CANNED_PACK;
}
